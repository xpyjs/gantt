import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import Konva from 'konva';
import dayjs, { type Dayjs } from 'dayjs';
import { LinkGroup } from '../../src/rendering/chart/ChartLink';
import { OptionManager } from '../../src/store/OptionManager';
import { EventBus } from '../../src/event';
import { Task } from '../../src/models/Task';
import { stubCanvasContext } from './helpers/canvasStub';

stubCanvasContext();

const PX_PER_DAY = 40;
const AXIS_START = dayjs('2026-07-01');
const HEADER_HEIGHT = 40;
const ROW_HEIGHT = 40;

const timeAxis = {
  getCellUnit: () => 'day',
  getTimeLeft: (t: Dayjs) => t.diff(AXIS_START, 'day', true) * PX_PER_DAY,
  getEndTime: () => dayjs('2026-09-01')
};

let optionManager: OptionManager;
let event: EventBus;
let context: any;
let stage: Konva.Stage;
let layer: Konva.Layer;
let taskMap: Map<string, Task>;
let links: any[];

function setup(options: Record<string, any> = {}): void {
  optionManager = new OptionManager();
  optionManager.setOptions({
    row: { height: ROW_HEIGHT },
    header: { height: HEADER_HEIGHT },
    bar: { height: 20, show: true },
    links: {
      show: true,
      create: { enabled: true, mode: 'always' }
    },
    split: { enabled: true, overlap: 'free' },
    ...options
  });

  event = new EventBus();

  const store: any = {
    getOptionManager: () => optionManager,
    getTimeAxis: () => timeAxis,
    getWorkCalendar: () => ({
      workOffset: (start: Dayjs, n: number) => start.add(n, 'day'),
      workDiff: (start: Dayjs, end: Dayjs) => end.diff(start, 'day', true)
    }),
    updateTime: vi.fn(),
    getDataManager: () => ({
      getTaskById: (id: string) => taskMap.get(id),
      isTaskVisible: () => true,
      getVisibleTasks: () => [...taskMap.values()].filter(t => !t.parent)
    }),
    getLinkManager: () => ({
      getLinks: () => links,
      getLinksByTaskId: (id: string) =>
        links.filter(l => l.from === id || l.to === id)
    })
  };

  context = {
    getOptions: () => optionManager.getOptions(),
    store,
    event
  };
}

/** 构建任务树（与 DataManager.createTask 等价的极简版），flatIndex 手动指定 */
function buildTask(data: any, flatIndex: number, parent?: Task): Task {
  const task = new Task(context.store, event, data, parent);
  task.flatIndex = flatIndex;
  taskMap.set(task.id, task);
  if (Array.isArray(data.children)) {
    task.children = data.children.map((c: any) =>
      buildTask(c, flatIndex, task)
    );
  }
  return task;
}

function splitData(): any {
  return {
    id: 'p1',
    name: '任务1',
    split: true,
    children: [
      { id: 's1', name: '段1', startTime: '2026-07-25', endTime: '2026-07-30' },
      { id: 's2', name: '段2', startTime: '2026-08-03', endTime: '2026-08-05' }
    ]
  };
}

beforeEach(() => {
  taskMap = new Map();
  links = [];
  setup();

  const container = document.createElement('div');
  document.body.appendChild(container);
  stage = new Konva.Stage({ container, width: 800, height: 600 });
  layer = new Konva.Layer();
  stage.add(layer);
});

afterEach(() => {
  stage.destroy();
  document.body.innerHTML = '';
});

describe('ChartLink split 锚点', () => {
  it('split 行：段各自拥有左右锚点，父级不创建锚点', () => {
    const p1 = buildTask(splitData(), 0);
    buildTask({ id: 't2', startTime: '2026-07-10', endTime: '2026-07-20' }, 1);

    const linkGroup = new LinkGroup(context, stage, layer);
    linkGroup.render([p1, taskMap.get('t2')!]);

    expect(layer.findOne('#point-s1-left')).toBeDefined();
    expect(layer.findOne('#point-s1-right')).toBeDefined();
    expect(layer.findOne('#point-s2-left')).toBeDefined();
    expect(layer.findOne('#point-s2-right')).toBeDefined();
    // 父级没有条形依托，不应出现悬空锚点
    expect(layer.findOne('#point-p1-left')).toBeUndefined();
    expect(layer.findOne('#point-p1-right')).toBeUndefined();
  });

  it('段锚点按段自身时间边界定位', () => {
    const p1 = buildTask(splitData(), 0);

    const linkGroup = new LinkGroup(context, stage, layer);
    linkGroup.render([p1]);

    // s1: 07-25 ~ 07-30，gap 5
    expect(layer.findOne<Konva.Circle>('#point-s1-left')!.x()).toBe(
      24 * PX_PER_DAY - 5
    );
    expect(layer.findOne<Konva.Circle>('#point-s1-right')!.x()).toBe(
      29 * PX_PER_DAY + 5
    );
    // s2: 08-03 ~ 08-05
    expect(layer.findOne<Konva.Circle>('#point-s2-left')!.x()).toBe(
      33 * PX_PER_DAY - 5
    );
  });

  it('段锚点 Y 与父行一致（flatIndex 相同）', () => {
    const p1 = buildTask(splitData(), 0);
    buildTask({ id: 't2', startTime: '2026-07-10', endTime: '2026-07-20' }, 1);

    const linkGroup = new LinkGroup(context, stage, layer);
    linkGroup.render([p1, taskMap.get('t2')!]);

    const s1Y = layer.findOne<Konva.Circle>('#point-s1-left')!.y();
    const t2Y = layer.findOne<Konva.Circle>('#point-t2-left')!.y();
    expect(s1Y).toBe(ROW_HEIGHT / 2 + HEADER_HEIGHT);
    expect(t2Y - s1Y).toBe(ROW_HEIGHT);
  });

  it('普通任务锚点不受影响（零影响）', () => {
    buildTask({ id: 't2', startTime: '2026-07-10', endTime: '2026-07-20' }, 0);

    const linkGroup = new LinkGroup(context, stage, layer);
    linkGroup.render([taskMap.get('t2')!]);

    expect(layer.findOne('#point-t2-left')).toBeDefined();
    expect(layer.findOne('#point-t2-right')).toBeDefined();
  });

  it('split 关闭时父级恢复自身锚点（零影响）', () => {
    setup({ split: { enabled: false, overlap: 'free' } });
    // 关闭时回退普通树形，父级时间即包络派生值
    const p1 = buildTask(
      {
        ...splitData(),
        startTime: '2026-07-25',
        endTime: '2026-08-05'
      },
      0
    );

    const linkGroup = new LinkGroup(context, stage, layer);
    linkGroup.render([p1]);

    expect(layer.findOne('#point-p1-left')).toBeDefined();
    expect(layer.findOne('#point-p1-right')).toBeDefined();
    expect(layer.findOne('#point-s1-left')).toBeUndefined();
  });

  it('更新 split 父任务时段锚点联动重建', () => {
    const p1 = buildTask(splitData(), 0);

    const linkGroup = new LinkGroup(context, stage, layer);
    linkGroup.render([p1]);

    const oldS1 = layer.findOne('#point-s1-left');

    // 段时间变化（模拟包络派生触发的父更新路径）
    const s1 = taskMap.get('s1')!;
    s1.updateTime(dayjs('2026-07-15'), dayjs('2026-07-20'));
    linkGroup.updateTask(p1);

    const newS1 = layer.findOne<Konva.Circle>('#point-s1-left')!;
    expect(newS1).toBeDefined();
    expect(newS1).not.toBe(oldS1);
    expect(newS1.x()).toBe(14 * PX_PER_DAY - 5);
  });
});

describe('ChartLink 拖拽目标解析', () => {
  it('split 行按 x 坐标定位到最近的段', () => {
    const p1 = buildTask(splitData(), 0);

    const linkGroup = new LinkGroup(context, stage, layer);
    linkGroup.render([p1]);

    const rowY = HEADER_HEIGHT + ROW_HEIGHT / 2;
    const getTask = (x: number) =>
      (linkGroup as any).getTaskByPosition({ x, y: rowY });

    // 段1 中点 1060，段2 中点 1360
    expect(getTask(1000).id).toBe('s1');
    expect(getTask(1300).id).toBe('s2');
  });

  it('普通行返回该行任务', () => {
    buildTask({ id: 't2', startTime: '2026-07-10', endTime: '2026-07-20' }, 0);

    const linkGroup = new LinkGroup(context, stage, layer);
    linkGroup.render([taskMap.get('t2')!]);

    const task = (linkGroup as any).getTaskByPosition({
      x: 300,
      y: HEADER_HEIGHT + ROW_HEIGHT / 2
    });
    expect(task.id).toBe('t2');
  });

  it('表头区域返回 null', () => {
    const p1 = buildTask(splitData(), 0);

    const linkGroup = new LinkGroup(context, stage, layer);
    linkGroup.render([p1]);

    const task = (linkGroup as any).getTaskByPosition({ x: 300, y: 20 });
    expect(task).toBeNull();
  });

  it('段缺失时间时不参与目标解析', () => {
    const p1 = buildTask(
      {
        id: 'p1',
        split: true,
        children: [{ id: 's1', name: '段1' }]
      },
      0
    );

    const linkGroup = new LinkGroup(context, stage, layer);
    linkGroup.render([p1]);

    const task = (linkGroup as any).getTaskByPosition({
      x: 300,
      y: HEADER_HEIGHT + ROW_HEIGHT / 2
    });
    expect(task).toBeNull();
  });
});

describe('ChartLink split 连线', () => {
  it('段与普通任务之间的连线正常渲染', () => {
    const p1 = buildTask(splitData(), 0);
    buildTask({ id: 't2', startTime: '2026-07-10', endTime: '2026-07-20' }, 1);
    links = [{ id: 'l1', from: 's1', to: 't2', type: 'FS' }];

    const linkGroup = new LinkGroup(context, stage, layer);
    linkGroup.resize(800, 600);
    linkGroup.render([p1, taskMap.get('t2')!]);

    const group = layer.findOne('#link-group-l1-s1-t2-FS');
    expect(group).toBeDefined();

    // 起点：段1 尾部 + gap
    const circle = group!.findOne<Konva.Circle>('Circle');
    expect(circle.x()).toBe(29 * PX_PER_DAY + 5);
    expect(circle.y()).toBeCloseTo(ROW_HEIGHT / 2 + HEADER_HEIGHT, 1);
  });

  it('段与段之间的连线渲染在同一直线上（同 flatIndex）', () => {
    const p1 = buildTask(splitData(), 0);
    links = [{ id: 'l2', from: 's1', to: 's2', type: 'FS' }];

    const linkGroup = new LinkGroup(context, stage, layer);
    // 视口需覆盖段2（1320px），否则连线被可视范围裁剪
    linkGroup.resize(2000, 600);
    linkGroup.render([p1]);

    const group = layer.findOne('#link-group-l2-s1-s2-FS');
    expect(group).toBeDefined();

    const circle = group!.findOne<Konva.Circle>('Circle');
    const arrow = group!.findOne<Konva.Arrow>('Arrow');
    const line = group!.findOne<Konva.Line>('Line');
    // 起点在段1 尾部，终点在段2 头部，同一行高度
    expect(circle.x()).toBe(29 * PX_PER_DAY + 5);
    const points = arrow.points();
    expect(points[points.length - 2]).toBe(33 * PX_PER_DAY - 5);
    expect(points[points.length - 1]).toBeCloseTo(
      ROW_HEIGHT / 2 + HEADER_HEIGHT,
      1
    );

    // 同行连线应为水平直线：Line + Arrow 的所有 y 坐标都在行中心，
    // 不允许出现垂到行外（行底边）的纵向折返
    const rowCenter = ROW_HEIGHT / 2 + HEADER_HEIGHT;
    const rowBottom = HEADER_HEIGHT + ROW_HEIGHT;
    const allPoints = [...line.points(), ...arrow.points()];
    const ys = allPoints.filter((_, i) => i % 2 === 1);
    expect(ys.length).toBeGreaterThan(2);
    ys.forEach(v => expect(Math.abs(v - rowCenter)).toBeLessThan(0.1));
    ys.forEach(v => expect(Math.abs(v - rowBottom)).toBeGreaterThanOrEqual(0.1));
  });

  it('段与段之间的 SF 连线同样为水平直线', () => {
    const p1 = buildTask(splitData(), 0);
    links = [{ id: 'l4', from: 's1', to: 's2', type: 'SF' }];

    const linkGroup = new LinkGroup(context, stage, layer);
    linkGroup.resize(2000, 600);
    linkGroup.render([p1]);

    const group = layer.findOne('#link-group-l4-s1-s2-SF');
    expect(group).toBeDefined();

    const arrow = group!.findOne<Konva.Arrow>('Arrow');
    const line = group!.findOne<Konva.Line>('Line');
    const rowCenter = ROW_HEIGHT / 2 + HEADER_HEIGHT;
    const ys = [...line.points(), ...arrow.points()].filter(
      (_, i) => i % 2 === 1
    );
    ys.forEach(v => expect(Math.abs(v - rowCenter)).toBeLessThan(0.1));
    // 终点在段2 尾部 + gap
    const points = arrow.points();
    expect(points[points.length - 2]).toBe(35 * PX_PER_DAY + 5);
  });

  it('普通任务之间的连线不受影响（零影响）', () => {
    buildTask({ id: 't2', startTime: '2026-07-10', endTime: '2026-07-20' }, 0);
    buildTask({ id: 't3', startTime: '2026-07-25', endTime: '2026-07-30' }, 1);
    links = [{ id: 'l3', from: 't2', to: 't3', type: 'FS' }];

    const linkGroup = new LinkGroup(context, stage, layer);
    linkGroup.resize(800, 600);
    linkGroup.render([taskMap.get('t2')!, taskMap.get('t3')!]);

    const group = layer.findOne('#link-group-l3-t2-t3-FS');
    expect(group).toBeDefined();

    // 跨行连线的纵向绕行（行底边转向点）保持不变
    const line = group!.findOne<Konva.Line>('Line');
    const rowBottom = HEADER_HEIGHT + ROW_HEIGHT;
    expect(line.points()).toContain(rowBottom);
  });
});
