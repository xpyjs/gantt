import { describe, expect, it, vi, beforeEach } from 'vitest';
import Konva from 'konva';
import dayjs, { type Dayjs } from 'dayjs';
import { ChartRow } from '../../src/rendering/chart/ChartRow';
import { OptionManager } from '../../src/store/OptionManager';
import { EventBus } from '../../src/event';
import { Task } from '../../src/models/Task';

const PX_PER_DAY = 40;
const AXIS_START = dayjs('2026-07-01');

const timeAxis = {
  getCellUnit: () => 'day',
  getTimeLeft: (t: Dayjs) => t.diff(AXIS_START, 'day', true) * PX_PER_DAY,
  getEndTime: () => dayjs('2026-09-01')
};

let optionManager: OptionManager;
let event: EventBus;
let context: any;

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
        enabled: false,
        single: { left: false, right: false, icon: null }
      },
      progress: { show: false }
    },
    links: { show: false },
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
    getDataManager: () => ({}),
    updateTime: vi.fn()
  };

  context = {
    getOptions: () => optionManager.getOptions(),
    store,
    event
  };
}

/** 构建任务树（与 DataManager.createTask 等价的极简版） */
function buildTask(data: any, parent?: Task): Task {
  const task = new Task(context.store, event, data, parent);
  if (Array.isArray(data.children)) {
    task.children = data.children.map((c: any) => buildTask(c, task));
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

function makeRow(data: any): { row: ChartRow; task: Task } {
  const task = buildTask(data);
  return { row: new ChartRow(context, task, `chart-row-${task.id}`, 0, 40, 800, 40), task };
}

/** 段条内层 Group 的 x 坐标（由段时间换算） */
function sliderX(row: ChartRow, segmentId: string): number | undefined {
  const group = row.row.findOne(`#chart-slider-bar-${segmentId}`);
  const slider = group?.findOne<Konva.Group>('Group');
  return slider?.x();
}

beforeEach(() => {
  setup();
});

describe('ChartRow split 渲染', () => {
  describe('构建', () => {
    it('split 行：每个段一个滑块，父级自身不渲染条形', () => {
      const { row } = makeRow(splitData());

      // rowRect + 两个段滑块组
      expect(row.row.getChildren().length).toBe(3);
      expect(row.row.findOne('#chart-slider-bar-s1')).toBeDefined();
      expect(row.row.findOne('#chart-slider-bar-s2')).toBeDefined();
      expect(row.row.findOne('#chart-slider-bar-p1')).toBeUndefined();
    });

    it('段滑块按段时间定位', () => {
      const { row } = makeRow(splitData());

      expect(sliderX(row, 's1')).toBe(24 * PX_PER_DAY); // 07-25 距 07-01 为 24 天
      expect(sliderX(row, 's2')).toBe(33 * PX_PER_DAY); // 08-03
    });

    it('普通任务：单滑块渲染（零影响）', () => {
      const { row } = makeRow({
        id: 't1',
        name: '普通任务',
        startTime: '2026-07-10',
        endTime: '2026-07-20'
      });

      expect(row.row.findOne('#chart-slider-bar-t1')).toBeDefined();
      expect(row.row.getChildren().length).toBe(2); // rowRect + 滑块组
    });

    it('split 关闭时数据携带 split 字段也按普通树形渲染（零影响）', () => {
      setup({ split: { enabled: false, overlap: 'free' } });
      const { row } = makeRow(splitData());

      expect(row.row.findOne('#chart-slider-bar-p1')).toBeDefined();
      expect(row.row.findOne('#chart-slider-bar-s1')).toBeUndefined();
    });
  });

  describe('更新', () => {
    it('段集合不变时复用已有滑块实例', () => {
      const { row, task } = makeRow(splitData());
      const before = row.row.findOne('#chart-slider-bar-s1');

      row.update(0, 40, task);

      expect(row.row.findOne('#chart-slider-bar-s1')).toBe(before);
    });

    it('段时间变化时滑块位置跟随', () => {
      const { row, task } = makeRow(splitData());

      const s1 = task.children.find(c => c.id === 's1')!;
      s1.updateTime(dayjs('2026-07-15'), dayjs('2026-07-18'));
      row.update(0, 40, task);

      expect(sliderX(row, 's1')).toBe(14 * PX_PER_DAY);
    });

    it('新增段时增量创建对应滑块', () => {
      const { row, task } = makeRow(splitData());

      const s3 = buildTask(
        { id: 's3', startTime: '2026-08-10', endTime: '2026-08-12' },
        task
      );
      task.children.push(s3);
      row.update(0, 40, task);

      expect(row.row.findOne('#chart-slider-bar-s3')).toBeDefined();
      // 原有滑块不受影响
      expect(row.row.findOne('#chart-slider-bar-s1')).toBeDefined();
    });

    it('删除段时销毁对应滑块', () => {
      const { row, task } = makeRow(splitData());

      task.children = task.children.filter(c => c.id !== 's1');
      row.update(0, 40, task);

      expect(row.row.findOne('#chart-slider-bar-s1')).toBeUndefined();
      expect(row.row.findOne('#chart-slider-bar-s2')).toBeDefined();
    });

    it('运行时关闭 split 后整行重建为父级单条', () => {
      const { row, task } = makeRow(splitData());

      optionManager.setOptions({ split: { enabled: false, overlap: 'free' } });
      row.update(0, 40, task);

      expect(row.row.findOne('#chart-slider-bar-p1')).toBeDefined();
      expect(row.row.findOne('#chart-slider-bar-s1')).toBeUndefined();
      expect(row.row.findOne('#chart-slider-bar-s2')).toBeUndefined();
    });

    it('运行时重新开启 split 后恢复多段渲染', () => {
      setup({ split: { enabled: false, overlap: 'free' } });
      const { row, task } = makeRow(splitData());
      expect(row.row.findOne('#chart-slider-bar-p1')).toBeDefined();

      optionManager.setOptions({ split: { enabled: true, overlap: 'free' } });
      row.update(0, 40, task);

      expect(row.row.findOne('#chart-slider-bar-s1')).toBeDefined();
      expect(row.row.findOne('#chart-slider-bar-s2')).toBeDefined();
      expect(row.row.findOne('#chart-slider-bar-p1')).toBeUndefined();
    });

    it('普通任务更新不经过段同步路径（零影响）', () => {
      const { row, task } = makeRow({
        id: 't1',
        startTime: '2026-07-10',
        endTime: '2026-07-20'
      });
      const before = row.row.findOne('#chart-slider-bar-t1');

      row.update(0, 40, task);

      expect(row.row.findOne('#chart-slider-bar-t1')).toBe(before);
    });
  });

  describe('销毁', () => {
    it('销毁 split 行清理全部段滑块', () => {
      const { row } = makeRow(splitData());

      row.destroy();

      expect(row.row.getChildren().length).toBe(0);
    });

    it('销毁普通行清理滑块', () => {
      const { row } = makeRow({
        id: 't1',
        startTime: '2026-07-10',
        endTime: '2026-07-20'
      });

      row.destroy();

      expect(row.row.getChildren().length).toBe(0);
    });
  });
});
