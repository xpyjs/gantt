import { describe, expect, it, vi } from 'vitest';
import { Task } from '../../src/models/Task';
import { EventBus, EventName } from '../../src/event';
import dayjs from 'dayjs';

function makeStore(options: Partial<Record<string, any>> = {}): any {
  const fields = {
    id: 'id',
    startTime: 'startTime',
    endTime: 'endTime',
    name: 'name',
    progress: 'progress',
    children: 'children',
    duration: 'duration',
    type: 'type',
    split: 'split'
  };
  const opts = {
    fields,
    dateFormat: 'YYYY-MM-DD HH:mm:ss',
    expand: { show: true, enabled: true },
    milestone: { show: false },
    summary: { show: false },
    split: { enabled: true, overlap: 'free' },
    ...options
  };
  return {
    getOptionManager: () => ({
      getOptions: () => opts
    }),
    updateTime: vi.fn(),
    getTimeAxis: () => ({ getCellUnit: () => 'day' }),
    getWorkCalendar: () => ({
      workOffset: (start: any, n: number) => start,
      workDiff: (start: any, end: any) => end.diff(start)
    })
  };
}

/** 构建一个带两个时间段的 split 任务 */
function makeSplitTask(
  store: any,
  event: EventBus,
  segments: Array<{ id: string; startTime?: string; endTime?: string }> = [
    { id: 's1', startTime: '2026-07-25', endTime: '2026-07-30' },
    { id: 's2', startTime: '2026-08-03', endTime: '2026-08-05' }
  ]
): Task {
  const parent = new Task(store, event, {
    id: 'p1',
    name: '任务1',
    split: true,
    startTime: '2026-01-01',
    endTime: '2026-01-02'
  });
  parent.children = segments.map(
    seg => new Task(store, event, { name: seg.id, ...seg }, parent)
  );
  return parent;
}

describe('Task split', () => {
  describe('isSplit - 双层与门判定', () => {
    it('全局关闭时，数据携带 split 字段也不生效（零影响契约）', () => {
      const store = makeStore({ split: { enabled: false, overlap: 'free' } });
      const task = makeSplitTask(store, new EventBus());
      expect(task.isSplit()).toBe(false);
    });

    it('全局开启但数据未标记 split 时不生效', () => {
      const store = makeStore();
      const event = new EventBus();
      const task = new Task(store, event, {
        id: 'p',
        children: [{ id: 'c' }]
      });
      task.children = [
        new Task(store, event, { id: 'c1', startTime: '2026-07-25', endTime: '2026-07-26' }, task)
      ];
      expect(task.isSplit()).toBe(false);
    });

    it('全局开启且数据标记 split、类型普通、仅一层子级时生效', () => {
      const task = makeSplitTask(makeStore(), new EventBus());
      expect(task.isSplit()).toBe(true);
    });

    it('split 字段支持任意可被 Boolean 判定为真的值', () => {
      const store = makeStore();
      const event = new EventBus();

      for (const truthy of [true, 1, 'yes', 'segment', {}]) {
        const task = new Task(store, event, { id: 'p', split: truthy });
        task.children = [
          new Task(store, event, { id: 's1', startTime: '2026-07-25', endTime: '2026-07-26' }, task)
        ];
        expect(task.isSplit()).toBe(true);
      }
    });

    it('split 为假值时任务按普通树形展开处理（含 children 可展开）', () => {
      const store = makeStore();
      const event = new EventBus();

      for (const falsy of [false, 0, '', null, undefined]) {
        const task = new Task(store, event, { id: 'p', split: falsy });
        task.children = [
          new Task(store, event, { id: 's1', startTime: '2026-07-25', endTime: '2026-07-26' }, task)
        ];
        expect(task.isSplit()).toBe(false);
      }
    });

    it('类型为 summary 时 split 失效', () => {
      const store = makeStore();
      const event = new EventBus();
      const task = new Task(store, event, {
        id: 'p',
        split: true,
        type: 'summary'
      });
      task.children = [
        new Task(store, event, { id: 's1', startTime: '2026-07-25', endTime: '2026-07-26' }, task)
      ];
      expect(task.isSplit()).toBe(false);
    });

    it('没有子级时 split 失效', () => {
      const store = makeStore();
      const task = new Task(store, new EventBus(), { id: 'p', split: true });
      expect(task.isSplit()).toBe(false);
    });

    it('子级拥有自己的子级（孙级）时 split 失效', () => {
      const store = makeStore();
      const event = new EventBus();
      const task = new Task(store, event, { id: 'p', split: true });
      const seg = new Task(store, event, { id: 's1', startTime: '2026-07-25', endTime: '2026-07-26' }, task);
      seg.children = [new Task(store, event, { id: 'g1' }, seg)];
      task.children = [seg];
      expect(task.isSplit()).toBe(false);
    });

    it('支持自定义 split 字段名', () => {
      const store = makeStore({
        fields: {
          id: 'id',
          startTime: 'startTime',
          endTime: 'endTime',
          name: 'name',
          progress: 'progress',
          children: 'children',
          duration: 'duration',
          type: 'type',
          split: 'isSegment'
        }
      });
      const event = new EventBus();
      const task = new Task(store, event, { id: 'p', isSegment: true });
      task.children = [
        new Task(store, event, { id: 's1', startTime: '2026-07-25', endTime: '2026-07-26' }, task)
      ];
      expect(task.isSplit()).toBe(true);
    });
  });

  describe('getSegments - 段列表', () => {
    it('按开始时间升序返回段', () => {
      const store = makeStore();
      const event = new EventBus();
      const parent = new Task(store, event, { id: 'p', split: true });
      const late = new Task(store, event, { id: 'late', startTime: '2026-08-03', endTime: '2026-08-05' }, parent);
      const early = new Task(store, event, { id: 'early', startTime: '2026-07-25', endTime: '2026-07-30' }, parent);
      parent.children = [late, early];

      const segments = parent.getSegments();
      expect(segments.map(s => s.id)).toEqual(['early', 'late']);
    });

    it('缺失时间的段排在末尾', () => {
      const store = makeStore();
      const event = new EventBus();
      const parent = new Task(store, event, { id: 'p', split: true });
      const noTime = new Task(store, event, { id: 'no-time' }, parent);
      const timed = new Task(store, event, { id: 'timed', startTime: '2026-07-25', endTime: '2026-07-30' }, parent);
      parent.children = [noTime, timed];

      const segments = parent.getSegments();
      expect(segments.map(s => s.id)).toEqual(['timed', 'no-time']);
    });

    it('非 split 任务返回空数组', () => {
      const store = makeStore({ split: { enabled: false, overlap: 'free' } });
      const task = makeSplitTask(store, new EventBus());
      expect(task.getSegments()).toEqual([]);
    });
  });

  describe('updateEnvelope - 包络派生', () => {
    it('父任务时间由段极值派生并写回数据', () => {
      const store = makeStore();
      const task = makeSplitTask(store, new EventBus());

      const changed = task.updateEnvelope();

      expect(changed).toBe(true);
      expect(task.startTime?.isSame(dayjs('2026-07-25'))).toBe(true);
      expect(task.endTime?.isSame(dayjs('2026-08-05'))).toBe(true);
      // 写回原始数据
      expect(task.data.startTime).toBe('2026-07-25 00:00:00');
      expect(task.data.endTime).toBe('2026-08-05 00:00:00');
    });

    it('数据中给出的父时间被包络覆盖', () => {
      const store = makeStore();
      const task = makeSplitTask(store, new EventBus());
      // makeSplitTask 的初始父时间为 2026-01-01 ~ 2026-01-02
      task.updateEnvelope();
      expect(task.startTime?.isSame(dayjs('2026-07-25'))).toBe(true);
    });

    it('段整体后移时包络同步移动（收缩与扩展双向）', () => {
      const store = makeStore();
      const event = new EventBus();
      const task = makeSplitTask(store, event);
      task.updateEnvelope();

      // 将最早的段移到更晚的时间，包络应收缩
      const seg1 = task.children.find(c => c.id === 's1')!;
      seg1.updateTime(dayjs('2026-07-28'), dayjs('2026-07-31'));

      task.updateEnvelope();
      expect(task.startTime?.isSame(dayjs('2026-07-28'))).toBe(true);
      expect(task.endTime?.isSame(dayjs('2026-08-05'))).toBe(true);
    });

    it('仅一段时包络即该段时间', () => {
      const store = makeStore();
      const task = makeSplitTask(store, new EventBus(), [
        { id: 'only', startTime: '2026-09-01', endTime: '2026-09-10' }
      ]);
      task.updateEnvelope();
      expect(task.startTime?.isSame(dayjs('2026-09-01'))).toBe(true);
      expect(task.endTime?.isSame(dayjs('2026-09-10'))).toBe(true);
    });

    it('包络变化时抛出 UPDATE_TASK 事件', () => {
      const store = makeStore();
      const event = new EventBus();
      const spy = vi.fn();
      event.on(EventName.UPDATE_TASK, spy);

      makeSplitTask(store, event).updateEnvelope();

      expect(spy).toHaveBeenCalled();
    });

    it('包络未变化时不重复抛出事件', () => {
      const store = makeStore();
      const event = new EventBus();
      const spy = vi.fn();
      event.on(EventName.UPDATE_TASK, spy);

      const task = makeSplitTask(store, event);
      task.updateEnvelope();
      spy.mockClear();
      const changed = task.updateEnvelope();

      expect(changed).toBe(false);
      expect(spy).not.toHaveBeenCalled();
    });

    it('全部段缺失时间时保持原值并返回 false', () => {
      const store = makeStore();
      const task = makeSplitTask(store, new EventBus(), [
        { id: 'no-time-1' },
        { id: 'no-time-2' }
      ]);

      const changed = task.updateEnvelope();

      expect(changed).toBe(false);
      expect(task.startTime?.isSame(dayjs('2026-01-01'))).toBe(true);
    });

    it('非 split 任务调用无效', () => {
      const store = makeStore({ split: { enabled: false, overlap: 'free' } });
      const task = makeSplitTask(store, new EventBus());
      expect(task.updateEnvelope()).toBe(false);
      expect(task.startTime?.isSame(dayjs('2026-01-01'))).toBe(true);
    });
  });
});
