import { describe, expect, it, vi } from 'vitest';
import { Baseline } from '../../src/models/Baseline';
import { EventBus } from '../../src/event';
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
  const baselinesFields = {
    id: 'id',
    startTime: 'startTime',
    endTime: 'endTime',
    name: 'name',
    target: 'target',
    highlight: 'highlight'
  };
  const opts = {
    fields,
    baselines: { taskKey: 'taskId', fields: baselinesFields, compare: { tolerance: 0.5 } },
    ...options
  };
  return {
    getOptionManager: () => ({ getOptions: () => opts }),
    getDataManager: () => null,
    getTimeAxis: () => null
  };
}

describe('Baseline', () => {
  describe('constructor', () => {
    it('should parse baseline data', () => {
      const store = makeStore();
      const bl = new Baseline(store, new EventBus(), {
        id: 'bl1',
        taskId: 't1',
        name: 'Baseline',
        startTime: '2026-01-01',
        endTime: '2026-01-10'
      });
      expect(bl.id).toBe('bl1');
      expect(bl.taskId).toBe('t1');
      expect(bl.name).toBe('Baseline');
      expect(bl.startTime).toBeDefined();
      expect(bl.endTime).toBeDefined();
    });

    it('should default highlight to true', () => {
      const store = makeStore();
      const bl = new Baseline(store, new EventBus(), {
        id: 'bl1', taskId: 't1'
      });
      expect(bl.highlight).toBe(true);
    });

    it('should set highlight to false when specified', () => {
      const store = makeStore();
      const bl = new Baseline(store, new EventBus(), {
        id: 'bl1', taskId: 't1', highlight: false
      });
      expect(bl.highlight).toBe(false);
    });

    it('should default target to false', () => {
      const store = makeStore();
      const bl = new Baseline(store, new EventBus(), {
        id: 'bl1', taskId: 't1'
      });
      expect(bl.target).toBe(false);
    });

    it('should set target to true when specified', () => {
      const store = makeStore();
      const bl = new Baseline(store, new EventBus(), {
        id: 'bl1', taskId: 't1', target: true
      });
      expect(bl.target).toBe(true);
    });

    it('should generate id if none provided', () => {
      const store = makeStore();
      const bl = new Baseline(store, new EventBus(), {
        taskId: 't1',
        startTime: '2026-01-01',
        endTime: '2026-01-10'
      });
      expect(bl.id).toBeDefined();
      expect(bl.id.length).toBeGreaterThan(0);
    });
  });

  describe('getField', () => {
    it('should return data by field', () => {
      const store = makeStore();
      const bl = new Baseline(store, new EventBus(), {
        id: 'bl1', name: 'Test', customField: 'value'
      });
      expect(bl.getField('customField')).toBe('value');
    });
  });

  describe('validate', () => {
    it('should return false when taskId missing', () => {
      const store = makeStore();
      const bl = new Baseline(store, new EventBus(), {});
      expect(bl.validate()).toBe(false);
    });

    it('should return false when startTime missing', () => {
      const store = makeStore();
      const bl = new Baseline(store, new EventBus(), {
        taskId: 't1',
        endTime: '2026-01-10'
      });
      expect(bl.validate()).toBe(false);
    });

    it('should return false when endTime missing', () => {
      const store = makeStore();
      const bl = new Baseline(store, new EventBus(), {
        taskId: 't1',
        startTime: '2026-01-01'
      });
      expect(bl.validate()).toBe(false);
    });

    it('should return false when endTime <= startTime', () => {
      const store = makeStore();
      const bl = new Baseline(store, new EventBus(), {
        taskId: 't1',
        startTime: '2026-01-10',
        endTime: '2026-01-01'
      });
      expect(bl.validate()).toBe(false);
    });

    it('should return false when startTime === endTime', () => {
      const store = makeStore();
      const bl = new Baseline(store, new EventBus(), {
        taskId: 't1',
        startTime: '2026-01-01',
        endTime: '2026-01-01'
      });
      expect(bl.validate()).toBe(false);
    });

    it('should return true when valid', () => {
      const store = makeStore();
      const bl = new Baseline(store, new EventBus(), {
        taskId: 't1',
        startTime: '2026-01-01',
        endTime: '2026-01-10'
      });
      expect(bl.validate()).toBe(true);
    });
  });

  describe('getTimeDiff', () => {
    it('should return null when validation fails', () => {
      const store = makeStore();
      const bl = new Baseline(store, new EventBus(), { taskId: 't1' });
      expect(bl.getTimeDiff()).toBeNull();
    });

    it('should return null when task not found', () => {
      const store = makeStore();
      store.getDataManager = () => ({ getTaskById: () => undefined });
      const bl = new Baseline(store, new EventBus(), {
        taskId: 't1',
        startTime: '2026-01-01',
        endTime: '2026-01-10'
      });
      expect(bl.getTimeDiff()).toBeNull();
    });
  });
});
