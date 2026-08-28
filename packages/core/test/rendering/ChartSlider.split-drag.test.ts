import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import Konva from 'konva';
import dayjs, { type Dayjs } from 'dayjs';
import { ChartRow } from '../../src/rendering/chart/ChartRow';
import { OptionManager } from '../../src/store/OptionManager';
import { DataManager } from '../../src/store/DataManager';
import { LinkManager } from '../../src/store/LinkManager';
import { EventBus, EventName } from '../../src/event';
import { Task } from '../../src/models/Task';
import { stubCanvasContext } from './helpers/canvasStub';
// 注册 isSameOrBefore 等插件
import '../../src/utils/time';

stubCanvasContext();

const PX_PER_DAY = 40;
const AXIS_START = dayjs('2026-07-01');
const AXIS_END = dayjs('2026-09-01');

/** 语义与真实 TimeAxis 一致的 mock：左端扩展会平移坐标系 */
function makeTimeAxis() {
  let startTime = AXIS_START;
  let endTime = AXIS_END;
  const expandCalls: Array<{ type: string; count: number }> = [];
  return {
    getCellUnit: () => 'day' as const,
    getCellWidth: () => PX_PER_DAY,
    getStartTime: () => startTime,
    getEndTime: () => endTime,
    getTimeLeft: (t: Dayjs) => t.diff(startTime, 'day', true) * PX_PER_DAY,
    getTimeByLeft: (left: number) => startTime.add(left / PX_PER_DAY, 'day'),
    getTotalWidth: () => endTime.diff(startTime, 'day') * PX_PER_DAY,
    expand: (type: 'left' | 'right' | 'all', count = 1) => {
      expandCalls.push({ type, count });
      if (type === 'left') startTime = startTime.subtract(count, 'day');
      else if (type === 'right') endTime = endTime.add(count, 'day');
    },
    __expandCalls: expandCalls
  };
}

let optionManager: OptionManager;
let event: EventBus;
let dataManager: DataManager;
let timeAxis: ReturnType<typeof makeTimeAxis>;
let context: any;
let stage: Konva.Stage;

function setup(options: Record<string, any> = {}): void {
  optionManager = new OptionManager();
  optionManager.setOptions({
    row: { height: 40 },
    header: { height: 40 },
    bar: {
      height: 20,
      show: true,
      backgroundColor: '#1890ff',
      move: {
        enabled: true,
        byUnit: false,
        lock: false,
        single: { left: false, right: false, icon: null },
        link: { child: 'none', parent: 'none' }
      },
      progress: { show: false }
    },
    links: { show: false },
    fields: {
      id: 'id',
      children: 'children',
      name: 'name',
      type: 'type',
      startTime: 'startTime',
      endTime: 'endTime',
      progress: 'progress',
      duration: 'duration',
      split: 'split'
    },
    split: { enabled: true, overlap: 'forbid' },
    ...options
  });

  event = new EventBus();
  timeAxis = makeTimeAxis();

  const store: any = {
    getOptionManager: () => optionManager,
    getTimeAxis: () => timeAxis,
    getWorkCalendar: () => ({
      workOffset: (start: Dayjs, n: number) => start.add(n, 'day'),
      workDiff: (start: Dayjs, end: Dayjs) => end.diff(start, 'day', true),
      currentWorkTime: (t: Dayjs) => t
    }),
    getDataManager: () => dataManager,
    updateTime: vi.fn()
  };

  dataManager = new DataManager(store, event);
  store.getDataManager = () => dataManager;
  // merge 合并段时 DataManager 会调用 LinkManager.redirectTaskLinks，
  // 与真实 Store 行为一致，挂一个真实实例（默认无连线）
  const linkManager = new LinkManager(store, event);
  store.getLinkManager = () => linkManager;

  context = {
    getOptions: () => optionManager.getOptions(),
    store,
    event
  };
}

function buildTask(data: any, parent?: Task): Task {
  const task = new Task(context.store, event, data, parent);
  if (Array.isArray(data.children)) {
    task.children = data.children.map((c: any) => buildTask(c, task));
  }
  return task;
}

/** 端侧段贴时间轴两端的 split 数据 */
function edgeData(): any {
  return {
    id: 'p1',
    name: '任务1',
    split: true,
    children: [
      // 贴时间轴左端（x=0）
      { id: 's1', name: '段1', startTime: '2026-07-01', endTime: '2026-07-05' },
      { id: 's2', name: '段2', startTime: '2026-07-15', endTime: '2026-07-20' },
      // 贴时间轴右端
      { id: 's3', name: '段3', startTime: '2026-08-25', endTime: '2026-08-31' }
    ]
  };
}

function makeRow(data: any, stageWidth = 800): { row: ChartRow; task: Task } {
  const div = document.createElement('div');
  document.body.appendChild(div);
  stage = new Konva.Stage({ container: div, width: stageWidth, height: 200 });
  const layer = new Konva.Layer();
  stage.add(layer);

  const task = buildTask(data);
  const row = new ChartRow(context, task, `chart-row-${task.id}`, 0, 40, 800, 40);
  layer.add(row.row);

  // 模拟 ChartBody.updateTask 的事件路由：段/父的 UPDATE_TASK → 父行刷新
  event.on(EventName.UPDATE_TASK, (t: Task) => {
    const rowTask = t.parent?.isSplit() ? t.parent : t;
    if (rowTask.id === task.id) row.update(0, 40, rowTask);
  });

  return { row, task };
}

function sliderOf(row: ChartRow, segId: string): Konva.Group | undefined {
  const group = row.row.findOne(`#chart-slider-bar-${segId}`);
  return group?.getChildren().find(c => (c as Konva.Group).draggable()) as Konva.Group | undefined;
}

/** 模拟 Konva 拖拽：dragstart 后，按指针累计位移驱动 dragBoundFunc + dragmove */
function dragSim(row: ChartRow, segId: string) {
  const slider = sliderOf(row, segId)!;
  let baseX = 0;
  let accum = 0;
  return {
    start() {
      baseX = slider.x();
      slider.fire('dragstart', { evt: { movementX: 0 }, target: slider } as any);
    },
    /** mousemove 一次：dx 为本次鼠标位移（movementX） */
    move(dx: number) {
      accum += dx;
      const bound = slider.dragBoundFunc()!({ x: baseX + accum, y: slider.y() });
      slider.position(bound);
      slider.fire('dragmove', { evt: { movementX: dx }, target: slider } as any);
    },
    end() {
      slider.fire('dragend', { evt: { movementX: 0 }, target: slider } as any);
    },
    x: () => slider.x()
  };
}

beforeEach(() => {
  vi.useFakeTimers();
  setup();
});

afterEach(() => {
  vi.useRealTimers();
  stage?.destroy();
  document.body.innerHTML = '';
});

describe('forbid 模式端侧段拖拽', () => {
  it('左端段（贴时间轴起点）向右拖动正常跟随', () => {
    const { row, task } = makeRow(edgeData());
    const sim = dragSim(row, 's1');

    sim.start();
    for (let i = 0; i < 12; i++) {
      sim.move(10);
      vi.advanceTimersByTime(16);
    }
    sim.end();
    vi.advanceTimersByTime(100);

    const s1 = task.children.find(c => c.id === 's1')!;
    // 120px = 3 天：7/1 → 7/4
    expect(s1.startTime?.format('YYYY-MM-DD')).toBe('2026-07-04');
    expect(timeAxis.__expandCalls.length).toBe(0);
  });

  it('右端段（贴时间轴末端）向左拖动正常跟随', () => {
    // 舞台加宽到覆盖整条时间轴，段全程在视口内，避免 dragend 的
    // 视口越界扩展逻辑干扰断言
    const { row, task } = makeRow(edgeData(), 2600);
    const sim = dragSim(row, 's3');

    sim.start();
    for (let i = 0; i < 12; i++) {
      sim.move(-10);
      vi.advanceTimersByTime(16);
    }
    sim.end();
    vi.advanceTimersByTime(100);

    const s3 = task.children.find(c => c.id === 's3')!;
    // -120px = -3 天：8/25 → 8/22
    expect(s3.startTime?.format('YYYY-MM-DD')).toBe('2026-08-22');
    expect(timeAxis.__expandCalls.length).toBe(0);
  });

  it('中间段向左拖动正常（对照组）', () => {
    const { row, task } = makeRow(edgeData());
    const sim = dragSim(row, 's2');

    sim.start();
    for (let i = 0; i < 12; i++) {
      sim.move(-10);
      vi.advanceTimersByTime(16);
    }
    sim.end();
    vi.advanceTimersByTime(100);

    const s2 = task.children.find(c => c.id === 's2')!;
    // -120px = -3 天：7/15 → 7/12（未触及 s1 结束边界 7/5，自由移动）
    expect(s2.startTime?.format('YYYY-MM-DD')).toBe('2026-07-12');
  });
});

describe('merge 模式段合并视图同步', () => {
  /** 两段数据：s2 拖到与 s1 交叠后合并 */
  function mergeData(): any {
    return {
      id: 'p1',
      name: '任务1',
      split: true,
      children: [
        { id: 's1', name: '段1', startTime: '2026-07-01', endTime: '2026-07-05' },
        { id: 's2', name: '段2', startTime: '2026-07-15', endTime: '2026-07-20' }
      ]
    };
  }

  it('松开鼠标后合并结果立即反映到视图：被合并段滑块销毁、保留段加宽', () => {
    setup({ split: { enabled: true, overlap: 'merge' } });
    const { row, task } = makeRow(mergeData());
    const sim = dragSim(row, 's2');

    sim.start();
    // s2 起点 x=560（7/15），拖 460px 到 7/3 附近，与 s1（至 7/5）交叠
    for (let i = 0; i < 46; i++) {
      sim.move(-10);
      vi.advanceTimersByTime(17);
    }
    sim.end();
    vi.advanceTimersByTime(100);

    // 段已合并：s2 从数据中移除，s1 起点不变、结束扩展到拖拽后 s2 的结束
    //（合并取两段当前位置的更宽范围：s2 整体拖入 s1，其结束时间随之左移）
    expect(task.children.map(c => c.id)).toEqual(['s1']);
    const s1 = task.children[0];
    expect(s1.startTime?.format('YYYY-MM-DD')).toBe('2026-07-01');
    expect(s1.endTime!.isAfter(dayjs('2026-07-08'))).toBe(true);

    // 视图同步：s2 的滑块已销毁，s1 的滑块宽度为合并后的宽度（≥7 天）
    expect(row.row.findOne('#chart-slider-bar-s2')).toBeUndefined();
    const s1Slider = sliderOf(row, 's1')!;
    expect(s1Slider.width()).toBeGreaterThanOrEqual(7 * PX_PER_DAY);
  });
});
