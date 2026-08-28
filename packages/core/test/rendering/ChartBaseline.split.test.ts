import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import Konva from 'konva';
import dayjs, { type Dayjs } from 'dayjs';
import { ChartBaseline } from '../../src/rendering/chart/ChartBaseline';
import { OptionManager } from '../../src/store/OptionManager';
import { EventBus } from '../../src/event';
import { Task } from '../../src/models/Task';
import { Baseline } from '../../src/models/Baseline';
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
let baselinesByTask: Map<string, Baseline[]>;

function setup(options: Record<string, any> = {}): void {
  optionManager = new OptionManager();
  optionManager.setOptions({
    row: { height: ROW_HEIGHT },
    header: { height: HEADER_HEIGHT },
    bar: { height: 20, show: true },
    baselines: {
      show: true,
      mode: 'line',
      position: 'bottom'
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
      getBaselinesByTaskId: (id: string) => baselinesByTask.get(id) || []
    })
  };

  context = {
    getOptions: () => optionManager.getOptions(),
    store,
    event
  };
}

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

function addBaseline(taskId: string, data: any): void {
  const bl = new Baseline(context.store, event, { taskId, ...data });
  const list = baselinesByTask.get(taskId) || [];
  list.push(bl);
  baselinesByTask.set(taskId, list);
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
  baselinesByTask = new Map();
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

describe('ChartBaseline split 渲染', () => {
  it('段基线渲染在父行 Y 上，x 按基线自身时间定位', () => {
    const p1 = buildTask(splitData(), 0);
    buildTask({ id: 't2', startTime: '2026-07-10', endTime: '2026-07-20' }, 1);
    addBaseline('s1', { id: 'b1', startTime: '2026-07-25', endTime: '2026-07-28' });

    const baselineGroup = new ChartBaseline(context, stage, layer);
    baselineGroup.resize(800, 600);
    baselineGroup.render([p1, taskMap.get('t2')!]);

    const line = layer.findOne<Konva.Line>('#baseline-item-b1');
    expect(line).toBeDefined();

    const points = line!.points();
    // x：07-25 → 24 天，07-28 → 27 天
    expect(points[0]).toBe(24 * PX_PER_DAY);
    expect(points[2]).toBe(27 * PX_PER_DAY);
    // y：行 0（段与父行同 flatIndex），line 模式 bottom 位置
    const y = HEADER_HEIGHT + ROW_HEIGHT * 0 + ROW_HEIGHT - 5 / 2;
    expect(points[1]).toBe(y);
  });

  it('父级基线仍渲染，作为整行的计划参考', () => {
    const p1 = buildTask(splitData(), 0);
    addBaseline('p1', { id: 'b2', startTime: '2026-07-20', endTime: '2026-08-10' });

    const baselineGroup = new ChartBaseline(context, stage, layer);
    baselineGroup.resize(800, 600);
    baselineGroup.render([p1]);

    const line = layer.findOne<Konva.Line>('#baseline-item-b2');
    expect(line).toBeDefined();

    const points = line!.points();
    expect(points[0]).toBe(19 * PX_PER_DAY);
    expect(points[2]).toBe(40 * PX_PER_DAY);
  });

  it('段基线与父基线可同时渲染（互不干扰）', () => {
    const p1 = buildTask(splitData(), 0);
    addBaseline('s1', { id: 'b1', startTime: '2026-07-25', endTime: '2026-07-28' });
    addBaseline('s2', { id: 'b3', startTime: '2026-08-03', endTime: '2026-08-06' });
    addBaseline('p1', { id: 'b2', startTime: '2026-07-20', endTime: '2026-08-10' });

    const baselineGroup = new ChartBaseline(context, stage, layer);
    baselineGroup.resize(800, 600);
    baselineGroup.render([p1]);

    expect(layer.findOne('#baseline-item-b1')).toBeDefined();
    expect(layer.findOne('#baseline-item-b2')).toBeDefined();
    expect(layer.findOne('#baseline-item-b3')).toBeDefined();
  });

  it('普通任务基线不受影响（零影响）', () => {
    buildTask({ id: 't2', startTime: '2026-07-10', endTime: '2026-07-20' }, 0);
    addBaseline('t2', { id: 'b4', startTime: '2026-07-10', endTime: '2026-07-18' });

    const baselineGroup = new ChartBaseline(context, stage, layer);
    baselineGroup.resize(800, 600);
    baselineGroup.render([taskMap.get('t2')!]);

    const line = layer.findOne<Konva.Line>('#baseline-item-b4');
    expect(line).toBeDefined();
    const points = line!.points();
    expect(points[0]).toBe(9 * PX_PER_DAY);
    // 行 0 的 bottom 位置
    expect(points[1]).toBe(HEADER_HEIGHT + ROW_HEIGHT - 5 / 2);
  });

  it('split 关闭时段基线不再内联渲染（回退树形，段不占行）', () => {
    setup({ split: { enabled: false, overlap: 'free' } });
    const p1 = buildTask(
      {
        ...splitData(),
        startTime: '2026-07-25',
        endTime: '2026-08-05'
      },
      0
    );
    addBaseline('s1', { id: 'b1', startTime: '2026-07-25', endTime: '2026-07-28' });
    addBaseline('p1', { id: 'b2', startTime: '2026-07-20', endTime: '2026-08-10' });

    const baselineGroup = new ChartBaseline(context, stage, layer);
    baselineGroup.resize(800, 600);
    baselineGroup.render([p1]);

    // 段不是独立行，其基线随之消失；父级基线保留
    expect(layer.findOne('#baseline-item-b1')).toBeUndefined();
    expect(layer.findOne('#baseline-item-b2')).toBeDefined();
  });
});
