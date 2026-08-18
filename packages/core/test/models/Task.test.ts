import { describe, expect, it, vi } from 'vitest';
import { Task } from '../../src/models/Task';
import { EventBus, EventName } from '../../src/event';
import { generateId } from '../../src/utils/id';
import { WorkCalendar } from '../../src/store/workCalendar';
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
    type: 'type'
  };
  const opts = {
    fields,
    dateFormat: 'YYYY-MM-DD HH:mm:ss',
    expand: { show: true, enabled: true },
    milestone: { show: false },
    summary: { show: false },
    ...options
  };
  return {
    getOptionManager: () => ({
      getOptions: () => opts
    }),
    updateTime: vi.fn(),
    getWorkCalendar: () => null,
    ...options
  };
}

describe('Task', () => {
  describe('constructor', () => {
    it('should create a task with generated id if none provided', () => {
      const store = makeStore();
      const task = new Task(store, new EventBus(), { name: 'Test' });
      expect(task.id).toBeDefined();
      expect(task.name).toBe('Test');
      expect(task.type).toBe('task');
      expect(task.children).toEqual([]);
      expect(task.level).toBe(0);
    });

    it('should use provided id', () => {
      const store = makeStore();
      const task = new Task(store, new EventBus(), { id: 't1', name: 'T1' });
      expect(task.id).toBe('t1');
    });

    it('should set parent and level', () => {
      const store = makeStore();
      const parent = new Task(store, new EventBus(), { id: 'p1', name: 'Parent' });
      const child = new Task(store, new EventBus(), { id: 'c1', name: 'Child' }, parent);
      expect(child.parent).toBe(parent);
      expect(child.level).toBe(1);
    });

    it('should parse progress', () => {
      const store = makeStore();
      const task = new Task(store, new EventBus(), { id: 't1', progress: 50 });
      expect(task.progress).toBe(50);
    });
  });

  describe('getField', () => {
    it('should return undefined for empty field', () => {
      const store = makeStore();
      const task = new Task(store, new EventBus(), { name: 'T' });
      expect(task.getField('')).toBeUndefined();
      expect(task.getField(null as any)).toBeUndefined();
    });

    it('should return value by simple field name', () => {
      const store = makeStore();
      const task = new Task(store, new EventBus(), { name: 'T', progress: 30 });
      expect(task.getField('progress')).toBe(30);
    });

    it('should return undefined for missing field', () => {
      const store = makeStore();
      const task = new Task(store, new EventBus(), { name: 'T' });
      expect(task.getField('missing')).toBeUndefined();
    });

    it('should support nested field access with dot notation', () => {
      const store = makeStore();
      const task = new Task(store, new EventBus(), { name: 'T', meta: { level: 'high' } });
      expect(task.getField('meta.level')).toBe('high');
    });

    it('should return undefined for invalid nested path', () => {
      const store = makeStore();
      const task = new Task(store, new EventBus(), { name: 'T' });
      expect(task.getField('meta.level')).toBeUndefined();
    });
  });

  describe('getEmitData', () => {
    it('should return structured emit data', () => {
      const store = makeStore();
      const task = new Task(store, new EventBus(), { id: 't1', name: 'T', progress: 50 });
      task.flatIndex = 3;
      const emit = task.getEmitData();
      expect(emit.data).toBeDefined();
      expect(emit.$index).toBe(3);
      expect(emit.level).toBe(1);
    });
  });

  describe('getAllChildren', () => {
    it('should return all descendants recursively', () => {
      const store = makeStore();
      const p = new Task(store, new EventBus(), { id: 'p' });
      const c1 = new Task(store, new EventBus(), { id: 'c1' }, p);
      const c2 = new Task(store, new EventBus(), { id: 'c2' }, p);
      const gc = new Task(store, new EventBus(), { id: 'gc' }, c1);
      p.children = [c1, c2];
      c1.children = [gc];
      const all = p.getAllChildren();
      expect(all).toHaveLength(3);
    });

    it('should return empty for leaf task', () => {
      const store = makeStore();
      const task = new Task(store, new EventBus(), { id: 't' });
      expect(task.getAllChildren()).toEqual([]);
    });
  });

  describe('isMilestone', () => {
    it('should return false when milestone not enabled', () => {
      const store = makeStore({ milestone: { show: false } });
      const task = new Task(store, new EventBus(), { id: 't', type: 'milestone' });
      expect(task.isMilestone()).toBe(false);
    });

    it('should return true when milestone enabled and type matches', () => {
      const store = makeStore({ milestone: { show: true } });
      const task = new Task(store, new EventBus(), { id: 't', type: 'milestone' });
      expect(task.isMilestone()).toBe(true);
    });
  });

  describe('isSummary', () => {
    it('should return false when summary not enabled', () => {
      const store = makeStore({ summary: { show: false } });
      const task = new Task(store, new EventBus(), { id: 't', type: 'summary' });
      expect(task.isSummary()).toBe(false);
    });

    it('should return true when summary enabled and type matches', () => {
      const store = makeStore({ summary: { show: true } });
      const task = new Task(store, new EventBus(), { id: 't', type: 'summary' });
      expect(task.isSummary()).toBe(true);
    });
  });

  describe('isSomeoneChildren', () => {
    // isSomeoneChildren(parent): walks up `parent`'s chain; returns true if `this` is in it.
    // i.e. checks whether `parent` is a DESCENDANT of `this`.
    it('should return true when given parent is a descendant of this task', () => {
      const store = makeStore();
      const p = new Task(store, new EventBus(), { id: 'p' });
      const c = new Task(store, new EventBus(), { id: 'c' }, p);
      // c is a descendant of p, so p.isSomeoneChildren(c) === true
      expect(p.isSomeoneChildren(c)).toBe(true);
    });

    it('should return false when given parent is NOT a descendant of this task', () => {
      const store = makeStore();
      const a = new Task(store, new EventBus(), { id: 'a' });
      const b = new Task(store, new EventBus(), { id: 'b' });
      expect(a.isSomeoneChildren(b)).toBe(false);
    });

    it('should traverse up through multiple levels', () => {
      const store = makeStore();
      const gp = new Task(store, new EventBus(), { id: 'gp' });
      const p = new Task(store, new EventBus(), { id: 'p' }, gp);
      const c = new Task(store, new EventBus(), { id: 'c' }, p);
      // c and p are both descendants of gp
      expect(gp.isSomeoneChildren(c)).toBe(true);
      expect(gp.isSomeoneChildren(p)).toBe(true);
    });

    it('should return false for undefined parent', () => {
      const store = makeStore();
      const task = new Task(store, new EventBus(), { id: 't' });
      expect(task.isSomeoneChildren(undefined)).toBe(false);
    });
  });

  describe('clone', () => {
    it('should create a new Task with same data and id', () => {
      const store = makeStore();
      const event = new EventBus();
      const original = new Task(store, event, { id: 't1', name: 'Orig', progress: 40 });
      const cloned = original.clone();
      expect(cloned.id).toBe('t1');
      expect(cloned.name).toBe('Orig');
      expect(cloned.progress).toBe(40);
      expect(cloned).not.toBe(original);
    });
  });

  describe('updateData', () => {
    it('should update name and progress', () => {
      const store = makeStore();
      const event = new EventBus();
      const task = new Task(store, event, { id: 't1', name: 'Old', progress: 10 });
      task.updateData({ name: 'New', progress: 90 });
      expect(task.name).toBe('New');
      expect(task.progress).toBe(90);
    });

    it('should update name when changed', () => {
      const store = makeStore();
      const event = new EventBus();
      const task = new Task(store, event, { id: 't1', name: 'Old' });
      expect(task.name).toBe('Old');
      task.updateData({ name: 'New' });
      expect(task.name).toBe('New');
    });

    it('should clamp progress to 0-100', () => {
      const store = makeStore();
      const event = new EventBus();
      const task = new Task(store, event, { id: 't1', progress: 50 });
      task.updateData({ progress: 150 });
      expect(task.progress).toBe(100);
      task.updateData({ progress: -20 });
      expect(task.progress).toBe(0);
    });
  });

  // date.endOf 与含尾时长语义：从使用角度覆盖数据解析、duration 推导、
  // 拖拽交互回写与工作日（skipWeekends）场景。
  //
  // 语义约定（endOf='end' 含尾）：
  // - 结束时间保持在尾单位内：18日0点起 1 天，结束为 18日 23:59:59
  // - 非 0 点同样成立：13:00:00 为第一秒，数满 86400 秒，结束为次日 12:59:59
  // - 不足尾单位最后一秒（如 23:50:20）的时长为 0.xxx，不进位成整数
  //
  // 2025-08-15 为周五，08-16/17 为周末，08-18 为周一
  describe('date.endOf semantics (usage scenarios)', () => {
    const makeUsageStore = (o: {
      endOf?: 'start' | 'end' | [number, number, number];
      endOfAll?: boolean;
      format?: string;
      unit?: 'day' | 'hour';
      skipWeekends?: boolean;
      milestone?: boolean;
    } = {}): any => {
      const opts = {
        fields: {
          id: 'id', startTime: 'startTime', endTime: 'endTime', name: 'name',
          progress: 'progress', children: 'children', duration: 'duration', type: 'type'
        },
        dateFormat: 'YYYY-MM-DD HH:mm:ss',
        date: { format: o.format ?? 'YYYY-MM-DD HH:mm:ss', endOf: o.endOf, endOfAll: o.endOfAll },
        expand: { show: true, enabled: true },
        milestone: { show: !!o.milestone },
        summary: { show: false }
      };
      return {
        getOptionManager: () => ({ getOptions: () => opts }),
        updateTime: vi.fn(),
        getWorkCalendar: () =>
          new WorkCalendar(undefined, undefined, { skipWeekends: !!o.skipWeekends }),
        getTimeAxis: () => ({ getCellUnit: () => o.unit ?? 'day' })
      };
    };

    describe('解析字符串结束时间（day 粒度）', () => {
      it('日期精度占满当天：18日起 1 天，结束为 18日 23:59:59，原始数据不变', () => {
        const task = new Task(makeUsageStore({ endOf: 'end' }), new EventBus(), {
          id: 't1', startTime: '2025-08-18', endTime: '2025-08-18'
        });
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-18 23:59:59');
        expect(task.duration).toBe(1);
        expect(task.data.endTime).toBe('2025-08-18');
        expect(task.data.startTime).toBe('2025-08-18');
      });

      it('跨天任务：18日 ~ 20日，结束为 20日 23:59:59，duration 为 3', () => {
        const task = new Task(makeUsageStore({ endOf: 'end' }), new EventBus(), {
          id: 't1', startTime: '2025-08-18', endTime: '2025-08-20'
        });
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-20 23:59:59');
        expect(task.duration).toBe(3);
      });

      it('小时精度补分秒：endTime 13 解析为 13:59:59，duration 为 0.583333', () => {
        const task = new Task(makeUsageStore({ endOf: 'end' }), new EventBus(), {
          id: 't1', startTime: '2025-08-18', endTime: '2025-08-18 13'
        });
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-18 13:59:59');
        expect(task.duration).toBeCloseTo(14 / 24, 5);
      });

      it('分钟精度只补秒：endTime 08:00 解析为 08:00:59（已有位保留）', () => {
        const task = new Task(makeUsageStore({ endOf: 'end' }), new EventBus(), {
          id: 't1', startTime: '2025-08-18', endTime: '2025-08-18 08:00'
        });
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-18 08:00:59');
        expect(task.duration).toBeCloseTo((8 * 3600 + 60) / 86400, 5);
      });

      it('完整精度保持原值：endTime 23:50:20 的 duration 为 0.xxx 而非 1', () => {
        const task = new Task(makeUsageStore({ endOf: 'end' }), new EventBus(), {
          id: 't1', startTime: '2025-08-18', endTime: '2025-08-18 23:50:20'
        });
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-18 23:50:20');
        expect(task.duration).toBeGreaterThan(0.99);
        expect(task.duration).toBeLessThan(1);
      });

      it('Date 输入不做精度补全：结束 19日0点 整，duration 超 1 天一秒', () => {
        // 19日 0:00:00 整意味着数满 86400 秒后又占用了下一秒
        const task = new Task(makeUsageStore({ endOf: 'end' }), new EventBus(), {
          id: 't1', startTime: '2025-08-18', endTime: new Date('2025-08-19T00:00:00')
        });
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-19 00:00:00');
        expect(task.duration).toBeCloseTo(1 + 1 / 86400, 5);
      });
    });

    describe('由 duration 推导结束时间', () => {
      it('0 点起 1 天：结束为当天 23:59:59 而非次日 0点', () => {
        const task = new Task(makeUsageStore({ endOf: 'end' }), new EventBus(), {
          id: 't1', startTime: '2025-08-18 00:00:00', duration: 1
        });
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-18 23:59:59');
        expect(task.duration).toBe(1);
      });

      it('13:00 起 1 天：13:00:00 为第一秒，数满 86400 秒，结束为次日 12:59:59', () => {
        const task = new Task(makeUsageStore({ endOf: 'end' }), new EventBus(), {
          id: 't1', startTime: '2025-08-18 13:00:00', duration: 1
        });
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-19 12:59:59');
        expect(task.duration).toBe(1);
      });

      it('13:00 起 2.5 天：结束为 21日 00:59:59', () => {
        const task = new Task(makeUsageStore({ endOf: 'end' }), new EventBus(), {
          id: 't1', startTime: '2025-08-18 13:00:00', duration: 2.5
        });
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-21 00:59:59');
        expect(task.duration).toBeCloseTo(2.5, 5);
      });
    });

    describe('其他 endOf 取值', () => {
      it('未配置 endOf：结束时间保持原始解析值，18→19日0点 duration 为 1', () => {
        const task = new Task(makeUsageStore({}), new EventBus(), {
          id: 't1', startTime: '2025-08-18', endTime: '2025-08-19'
        });
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-19 00:00:00');
        expect(task.duration).toBe(1);
      });

      it("endOf='start'：缺失位补 0，19日 解析为 19日 00:00:00", () => {
        const task = new Task(makeUsageStore({ endOf: 'start' }), new EventBus(), {
          id: 't1', startTime: '2025-08-18', endTime: '2025-08-19'
        });
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-19 00:00:00');
        expect(task.duration).toBe(1);
      });

      it("endOf='start'：分精度缺失补 0，19日13:30 解析为 13:30:00", () => {
        const task = new Task(makeUsageStore({ endOf: 'start' }), new EventBus(), {
          id: 't1', startTime: '2025-08-18', endTime: '2025-08-19 13:30'
        });
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-19 13:30:00');
        expect(task.duration).toBeCloseTo(1 + 13.5 / 24, 5);
      });

      it('元组 [8,30,0]：19日（日精度）补为 08:30:00；已有位不被元组覆盖（13:00 → 13:00:00）', () => {
        const store = makeUsageStore({ endOf: [8, 30, 0] });
        const t1 = new Task(store, new EventBus(), {
          id: 't1', startTime: '2025-08-18', endTime: '2025-08-19'
        });
        expect(t1.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-19 08:30:00');
        expect(t1.duration).toBeCloseTo(1 + 8.5 / 24, 5);

        const t2 = new Task(store, new EventBus(), {
          id: 't2', startTime: '2025-08-18', endTime: '2025-08-19 13:00'
        });
        expect(t2.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-19 13:00:00');
        expect(t2.duration).toBeCloseTo(1 + 13 / 24, 5);
      });

      it('endOfAll=true：Date 输入也强制全位补全到 23:59:59', () => {
        const task = new Task(
          makeUsageStore({ endOf: 'end', endOfAll: true }),
          new EventBus(),
          { id: 't1', startTime: '2025-08-18', endTime: new Date('2025-08-19T10:00:00') }
        );
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-19 23:59:59');
        expect(task.duration).toBe(2);
      });
    });

    describe('hour 粒度', () => {
      it("endTime 15:00 补秒为 15:00:59，duration 为 2 小时 1 分（天）", () => {
        const task = new Task(
          makeUsageStore({ endOf: 'end', unit: 'hour' }),
          new EventBus(),
          { id: 't1', startTime: '2025-08-18 13:00', endTime: '2025-08-18 15:00' }
        );
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-18 15:00:59');
        expect(task.duration).toBeCloseTo((2 * 3600 + 60) / 86400, 5);
      });

      it('元组在 hour 粒度忽略时位：[10,20,30] 只补缺失的秒位 → 15:00:30', () => {
        const task = new Task(
          makeUsageStore({ endOf: [10, 20, 30], unit: 'hour' }),
          new EventBus(),
          { id: 't1', startTime: '2025-08-18 13:00', endTime: '2025-08-18 15:00' }
        );
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-18 15:00:30');
        expect(task.duration).toBeCloseTo((2 * 3600 + 30) / 86400, 5);
      });
    });

    describe('拖拽交互（updateTime）', () => {
      it('按单位缩放到 1 天：计算边界 19日0点 归一化为 18日 23:59:59，duration 为 1', () => {
        const task = new Task(makeUsageStore({ endOf: 'end' }), new EventBus(), {
          id: 't1', startTime: '2025-08-18', endTime: '2025-08-20'
        });
        // 模拟 byUnit 缩放：反推的结束时间恰为单位起点（计算边界）
        task.updateTime(task.startTime!, dayjs('2025-08-19 00:00:00'), true);
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-18 23:59:59');
        expect(task.duration).toBe(1);
        expect(task.data.endTime).toBe('2025-08-18 23:59:59');
        expect(task.data.duration).toBe(1);
      });

      it('自由拖拽右缘：非单位起点时刻原样存储，duration 为小数', () => {
        const task = new Task(makeUsageStore({ endOf: 'end' }), new EventBus(), {
          id: 't1', startTime: '2025-08-18', endTime: '2025-08-20'
        });
        // 自由拖拽反推的是右缘时刻，本身已是含尾末尾，不再退 1 秒
        task.updateTime(task.startTime!, dayjs('2025-08-19 14:30:00'), true);
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-19 14:30:00');
        expect(task.duration).toBeCloseTo(1 + (14 * 3600 + 30 * 60 + 1) / 86400, 5);
      });

      it('秒级 format 回写后重新解析，往返一致', () => {
        const store = makeUsageStore({ endOf: 'end' });
        const task = new Task(store, new EventBus(), {
          id: 't1', startTime: '2025-08-18', endTime: '2025-08-20'
        });
        task.updateTime(task.startTime!, dayjs('2025-08-19 00:00:00'), true);
        const reparsed = new Task(store, new EventBus(), { id: 't1', ...task.data });
        expect(reparsed.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-18 23:59:59');
        expect(reparsed.duration).toBe(1);
      });

      it('天级 format 回写后重新解析，往返一致', () => {
        const store = makeUsageStore({ endOf: 'end', format: 'YYYY-MM-DD' });
        const task = new Task(store, new EventBus(), {
          id: 't1', startTime: '2025-08-18', endTime: '2025-08-20'
        });
        task.updateTime(task.startTime!, dayjs('2025-08-19 00:00:00'), true);
        // 天级 format 写出 '2025-08-18'，重解析按 endOf 补回 23:59:59
        expect(task.data.endTime).toBe('2025-08-18');
        const reparsed = new Task(store, new EventBus(), { id: 't1', ...task.data });
        expect(reparsed.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-18 23:59:59');
        expect(reparsed.duration).toBe(1);
      });

      it('updateTime 触发 UPDATE_TASK 事件并回写 data 的起止与 duration 字段', () => {
        const store = makeUsageStore({ endOf: 'end' });
        const bus = new EventBus();
        const handler = vi.fn();
        bus.on(EventName.UPDATE_TASK, handler);
        const task = new Task(store, bus, {
          id: 't1', startTime: '2025-08-18', endTime: '2025-08-20'
        });
        task.updateTime(task.startTime!, dayjs('2025-08-19 00:00:00'), true);
        expect(handler).toHaveBeenCalled();
        expect(task.data.startTime).toBe('2025-08-18 00:00:00');
        expect(task.data.endTime).toBe('2025-08-18 23:59:59');
        expect(task.data.duration).toBe(1);
      });
    });

    // byUnit 拖拽吸附的是位移量，起止保持原始相位节点（如 8:00 起、
    // 20:00:59 止）。松手后 DataManager 会调用 fitWork 按工作日历适配，
    // 适配结果必须还原同样的相位节点，不能进位 1 秒
    describe('相位保持（松手后 fitWork 适配）', () => {
      it('非单位相位任务整体移动后适配，结束时间不进位 1 秒', () => {
        const task = new Task(makeUsageStore({ endOf: 'end' }), new EventBus(), {
          id: 't1', startTime: '2025-08-18 08:00:00', endTime: '2025-08-18 20:00'
        });
        // endTime 20:00 为分钟精度，endOf='end' 补秒位后为 20:00:59
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-18 20:00:59');
        // 整体移动 1 天（duration 不重算），松手后 fitWork 适配
        task.updateTime(dayjs('2025-08-19 08:00:00'), dayjs('2025-08-19 20:00:59'), false);
        task.fitWork('both');
        expect(task.startTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-19 08:00:00');
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-19 20:00:59');
      });

      it('非单位相位任务右缘缩放后适配，保持相位末尾', () => {
        const task = new Task(makeUsageStore({ endOf: 'end' }), new EventBus(), {
          id: 't1', startTime: '2025-08-18 08:00:00', endTime: '2025-08-18 20:00'
        });
        // 右缘扩 1 个单位（duration 重算）
        task.updateTime(dayjs('2025-08-18 08:00:00'), dayjs('2025-08-19 20:00:59'), true);
        expect(task.duration).toBeCloseTo(1.500694, 5);
        task.fitWork('right');
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-19 20:00:59');
      });

      it('非单位相位任务左缘缩放后适配，保持相位起点', () => {
        const task = new Task(makeUsageStore({ endOf: 'end' }), new EventBus(), {
          id: 't1', startTime: '2025-08-18 08:00:00', endTime: '2025-08-18 20:00'
        });
        // 左缘移 1 个单位（duration 重算）
        task.updateTime(dayjs('2025-08-19 08:00:00'), dayjs('2025-08-19 20:00:59'), true);
        task.fitWork('left');
        expect(task.startTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-19 08:00:00');
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-19 20:00:59');
      });
    });

    describe('工作日（skipWeekends）', () => {
      it('周五起 1 天：结束为周五 23:59:59，不为周末扩展到下周一', () => {
        const task = new Task(makeUsageStore({ endOf: 'end', skipWeekends: true }), new EventBus(), {
          id: 't1', startTime: '2025-08-15', duration: 1
        });
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-15 23:59:59');
        expect(task.duration).toBe(1);
      });

      it('周五起 2 天：跨周末后结束为下周一 23:59:59，duration 仍为 2', () => {
        const task = new Task(makeUsageStore({ endOf: 'end', skipWeekends: true }), new EventBus(), {
          id: 't1', startTime: '2025-08-15', duration: 2
        });
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-18 23:59:59');
        expect(task.duration).toBe(2);
      });

      it('周一起 5 天：结束为周五 23:59:59', () => {
        const task = new Task(makeUsageStore({ endOf: 'end', skipWeekends: true }), new EventBus(), {
          id: 't1', startTime: '2025-08-18', duration: 5
        });
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-22 23:59:59');
        expect(task.duration).toBe(5);
      });

      it('fitWork 将周末起始的任务整体移回工作日', () => {
        const task = new Task(makeUsageStore({ endOf: 'end', skipWeekends: true }), new EventBus(), {
          id: 't1', startTime: '2025-08-18', endTime: '2025-08-19'
        });
        // 整体移动落到了周六：fitWork 把开始时间修正到周一，结束按 2 天落在周二末尾
        task.fitWork('both', { start: dayjs('2025-08-16 00:00:00') });
        expect(task.startTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-18 00:00:00');
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-19 23:59:59');
        expect(task.duration).toBe(2);
      });
    });

    describe('里程碑', () => {
      it('里程碑结束时间等于开始时间，不参与含尾收尾', () => {
        const task = new Task(makeUsageStore({ endOf: 'end', milestone: true }), new EventBus(), {
          id: 't1', startTime: '2025-08-18', endTime: '2025-08-20', type: 'milestone'
        });
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-18 00:00:00');
      });
    });

    describe('updateData', () => {
      it('更新起止时间后重算 endTime 与 duration', () => {
        const task = new Task(makeUsageStore({ endOf: 'end' }), new EventBus(), {
          id: 't1', startTime: '2025-08-18', endTime: '2025-08-19'
        });
        expect(task.duration).toBe(2);
        task.updateData({ id: 't1', startTime: '2025-08-20', endTime: '2025-08-22' });
        expect(task.endTime!.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-08-22 23:59:59');
        expect(task.duration).toBe(3);
      });
    });
  });
});
