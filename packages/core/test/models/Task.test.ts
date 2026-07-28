import { describe, expect, it, vi } from 'vitest';
import { Task } from '../../src/models/Task';
import { EventBus, EventName } from '../../src/event';
import { generateId } from '../../src/utils/id';

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
    getWorkCalendar: () => null
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
});
