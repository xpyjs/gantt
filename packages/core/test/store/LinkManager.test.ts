import { describe, expect, it, vi } from 'vitest';
import { LinkManager } from '../../src/store/LinkManager';
import { ErrorType, EventBus } from '../../src/event';

// Minimal mock task
function makeTask(id: string): any {
  return {
    id,
    getEmitData: () => ({ data: { id }, $index: 0, level: 1 })
  };
}

function makeStore(tasks: any[] = []): any {
  return {
    getDataManager: () => ({
      getTaskById: (id: string) => tasks.find(t => t.id === id),
      getTasks: (_asTree: boolean) => tasks
    })
  };
}

describe('LinkManager', () => {
  describe('data management', () => {
    it('should store and return links', () => {
      const store = makeStore([makeTask('a'), makeTask('b')]);
      const event = new EventBus();
      const lm = new LinkManager(store, event);
      lm.setLinks([{ from: 'a', to: 'b' }]);
      expect(lm.getLinks()).toHaveLength(1);
    });

    it('getLinksByTaskId should return links involving the task', () => {
      const store = makeStore([makeTask('a'), makeTask('b'), makeTask('c')]);
      const lm = new LinkManager(store, new EventBus());
      lm.setLinks([
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' }
      ]);
      const links = lm.getLinksByTaskId('b');
      expect(links).toHaveLength(2);
    });

    it('isLinkExist should check existence', () => {
      const store = makeStore([makeTask('a'), makeTask('b')]);
      const lm = new LinkManager(store, new EventBus());
      lm.setLinks([{ from: 'a', to: 'b' }]);
      expect(lm.isLinkExist('a', 'b')).toBe(true);
      expect(lm.isLinkExist('b', 'a')).toBe(false);
      expect(lm.isLinkExist('a', 'b', 'FF')).toBe(false);
    });
  });

  describe('validateLinkType / convertPointsToLinkType', () => {
    const lm = new LinkManager(makeStore(), new EventBus());

    it('should validate valid link types', () => {
      expect(lm.validateLinkType('FS')).toBe(true);
      expect(lm.validateLinkType('FF')).toBe(true);
      expect(lm.validateLinkType('SS')).toBe(true);
      expect(lm.validateLinkType('SF')).toBe(true);
    });

    it('should reject invalid link types', () => {
      expect(lm.validateLinkType('XY' as any)).toBe(false);
    });

    it('convertPointsToLinkType', () => {
      expect(lm.convertPointsToLinkType('F' as any, 'S' as any)).toBe('FS');
      expect(lm.convertPointsToLinkType('S' as any, 'F' as any)).toBe('SF');
    });
  });

  describe('validateLink', () => {
    it('should reject null/missing endpoints', () => {
      const lm = new LinkManager(makeStore(), new EventBus());
      const r = lm.validateLink({ from: null as any, to: 'b' });
      expect(r.ok).toBe(false);
      expect(r.reason).toBe(ErrorType.LINK_INVALID_ARG);
    });

    it('should reject self-link', () => {
      const store = makeStore([makeTask('a')]);
      const lm = new LinkManager(store, new EventBus());
      const r = lm.validateLink({ from: 'a', to: 'a' });
      expect(r.ok).toBe(false);
      expect(r.reason).toBe(ErrorType.LINK_SAME);
    });

    it('should reject unknown task', () => {
      const store = makeStore([makeTask('a')]);
      const lm = new LinkManager(store, new EventBus());
      const r = lm.validateLink({ from: 'a', to: 'unknown' });
      expect(r.ok).toBe(false);
      expect(r.reason).toBe(ErrorType.TASK_NOT_FOUND);
    });

    it('should reject invalid type', () => {
      const store = makeStore([makeTask('a'), makeTask('b')]);
      const lm = new LinkManager(store, new EventBus());
      const r = lm.validateLink({ from: 'a', to: 'b', type: 'XY' as any });
      expect(r.ok).toBe(false);
      expect(r.reason).toBe(ErrorType.INVALID_TYPE);
    });

    it('should reject duplicate link', () => {
      const store = makeStore([makeTask('a'), makeTask('b')]);
      const lm = new LinkManager(store, new EventBus());
      lm.setLinks([{ from: 'a', to: 'b' }]);
      const r = lm.validateLink({ from: 'a', to: 'b' });
      expect(r.ok).toBe(false);
      expect(r.reason).toBe(ErrorType.LINK_EXIST);
    });

    it('should accept valid link', () => {
      const store = makeStore([makeTask('a'), makeTask('b')]);
      const lm = new LinkManager(store, new EventBus());
      lm.setLinks([]);
      const r = lm.validateLink({ from: 'a', to: 'b' });
      expect(r.ok).toBe(true);
    });
  });

  describe('validateChain (cycle detection)', () => {
    it('should detect cycle when adding link creates one', () => {
      const store = makeStore([makeTask('a'), makeTask('b'), makeTask('c')]);
      const lm = new LinkManager(store, new EventBus());
      lm.setLinks([
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' }
      ]);
      // a -> b -> c; adding c -> a creates a cycle
      const r = lm.validateChain('c', 'a');
      expect(r.ok).toBe(false);
      expect(r.reason).toBe(ErrorType.LINK_CYCLE);
    });

    it('should detect cycle for a->b and b->a', () => {
      const store = makeStore([makeTask('a'), makeTask('b')]);
      const lm = new LinkManager(store, new EventBus());
      lm.setLinks([{ from: 'a', to: 'b' }]);
      const r = lm.validateChain('b', 'a');
      expect(r.ok).toBe(false);
      expect(r.reason).toBe(ErrorType.LINK_CYCLE);
    });

    it('should skip cycle check when disabled', () => {
      const store = makeStore([makeTask('a'), makeTask('b')]);
      const lm = new LinkManager(store, new EventBus());
      lm.setCycleDetection(false);
      lm.setLinks([{ from: 'a', to: 'b' }]);
      // a->b and b->a would be cycle but detection is disabled
      const r = lm.validateChain('b', 'a');
      expect(r.ok).toBe(true);
    });
  });

  describe('validateLinks (batch)', () => {
    it('should separate valid and invalid links', () => {
      const store = makeStore([makeTask('a'), makeTask('b'), makeTask('c')]);
      const lm = new LinkManager(store, new EventBus());
      const result = lm.validateLinks([
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' },
        { from: 'a', to: 'a' } // self-link
      ]);
      expect(result.valid).toHaveLength(2);
      expect(result.invalid).toHaveLength(1);
      expect(result.totalCount).toBe(3);
    });
  });

  describe('task connection queries', () => {
    it('getTaskLinks should return incoming and outgoing', () => {
      const store = makeStore([makeTask('a'), makeTask('b'), makeTask('c')]);
      const lm = new LinkManager(store, new EventBus());
      lm.setLinks([
        { from: 'a', to: 'b' },
        { from: 'c', to: 'b' }
      ]);
      const r = lm.getTaskLinks('b');
      expect(r.incoming).toHaveLength(2);
      expect(r.outgoing).toHaveLength(0);
    });

    it('getTaskPredecessors', () => {
      const store = makeStore([makeTask('a'), makeTask('b')]);
      const lm = new LinkManager(store, new EventBus());
      lm.setLinks([{ from: 'a', to: 'b' }]);
      const pred = lm.getTaskPredecessors('b');
      expect(pred.tasks).toHaveLength(1);
      expect(pred.tasks[0].id).toBe('a');
    });

    it('getTaskSuccessors', () => {
      const store = makeStore([makeTask('a'), makeTask('b')]);
      const lm = new LinkManager(store, new EventBus());
      lm.setLinks([{ from: 'a', to: 'b' }]);
      const succ = lm.getTaskSuccessors('a');
      expect(succ.tasks).toHaveLength(1);
      expect(succ.tasks[0].id).toBe('b');
    });

    it('getDirectlyConnectedTasks should deduplicate', () => {
      const store = makeStore([makeTask('a'), makeTask('b')]);
      const lm = new LinkManager(store, new EventBus());
      lm.setLinks([
        { from: 'a', to: 'b' },
        { from: 'b', to: 'a' }
      ]);
      const connected = lm.getDirectlyConnectedTasks('a');
      expect(connected).toHaveLength(1);
      expect(connected[0].id).toBe('b');
    });
  });

  describe('hasConnectionPath', () => {
    it('should find path through chain', () => {
      const store = makeStore([makeTask('a'), makeTask('b'), makeTask('c')]);
      const lm = new LinkManager(store, new EventBus());
      lm.setLinks([
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' }
      ]);
      expect(lm.hasConnectionPath('a', 'c')).toBe(true);
    });

    it('should return true for same task', () => {
      const store = makeStore([makeTask('a')]);
      const lm = new LinkManager(store, new EventBus());
      expect(lm.hasConnectionPath('a', 'a')).toBe(true);
    });

    it('should return false when no path', () => {
      const store = makeStore([makeTask('a'), makeTask('b')]);
      const lm = new LinkManager(store, new EventBus());
      expect(lm.hasConnectionPath('a', 'b')).toBe(false);
    });
  });

  describe('hasCycle / detectAllCycles', () => {
    it('should detect cycle with a->b->a', () => {
      const store = makeStore([makeTask('a'), makeTask('b')]);
      const lm = new LinkManager(store, new EventBus());
      lm.setLinks([
        { from: 'a', to: 'b' },
        { from: 'b', to: 'a' }
      ]);
      expect(lm.hasCycle()).toBe(true);
      const report = lm.detectAllCycles(false);
      expect(report.hasCycle).toBe(true);
    });

    it('should report no cycle for DAG', () => {
      const store = makeStore([makeTask('a'), makeTask('b'), makeTask('c')]);
      const lm = new LinkManager(store, new EventBus());
      lm.setLinks([
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' }
      ]);
      expect(lm.hasCycle()).toBe(false);
    });

    it('should detect three-node cycle', () => {
      const store = makeStore([makeTask('a'), makeTask('b'), makeTask('c')]);
      const lm = new LinkManager(store, new EventBus());
      lm.setLinks([
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' },
        { from: 'c', to: 'a' }
      ]);
      expect(lm.hasCycle()).toBe(true);
    });

    it('getCycleReport should return last report', () => {
      const store = makeStore([makeTask('a')]);
      const lm = new LinkManager(store, new EventBus());
      lm.setLinks([]);
      expect(lm.getCycleReport()).toBeNull();
    });
  });

  describe('detectLinkConflicts / hasConflictingLinks', () => {
    it('should detect FS-SF conflict', () => {
      const store = makeStore([makeTask('a'), makeTask('b')]);
      const lm = new LinkManager(store, new EventBus());
      lm.setLinks([
        { from: 'a', to: 'b', type: 'FS' },
        { from: 'a', to: 'b', type: 'SF' }
      ]);
      const r = lm.detectLinkConflicts('a', 'b');
      expect(r.hasConflict).toBe(true);
      expect(lm.hasConflictingLinks('a', 'b')).toBe(true);
    });

    it('should report no conflict for single type', () => {
      const store = makeStore([makeTask('a'), makeTask('b')]);
      const lm = new LinkManager(store, new EventBus());
      lm.setLinks([{ from: 'a', to: 'b', type: 'FS' }]);
      expect(lm.detectLinkConflicts('a', 'b').hasConflict).toBe(false);
    });
  });

  describe('getDebugInfo', () => {
    it('should return debug info', () => {
      const store = makeStore([makeTask('a'), makeTask('b')]);
      const lm = new LinkManager(store, new EventBus());
      lm.setLinks([{ from: 'a', to: 'b' }]);
      const info = lm.getDebugInfo();
      expect(info.totalLinks).toBe(1);
      expect(info.totalTasks).toBe(2);
      expect(Array.isArray(info.topologicalOrder)).toBe(true);
    });

    it('topologicalOrder should be null when cycle exists', () => {
      const store = makeStore([makeTask('a'), makeTask('b')]);
      const lm = new LinkManager(store, new EventBus());
      lm.setLinks([
        { from: 'a', to: 'b' },
        { from: 'b', to: 'a' }
      ]);
      const info = lm.getDebugInfo();
      expect(info.topologicalOrder).toBeNull();
    });
  });

  describe('getCachePerformanceStats', () => {
    it('should return stats', () => {
      const lm = new LinkManager(makeStore(), new EventBus());
      const stats = lm.getCachePerformanceStats();
      expect(stats.totalCacheSize).toBeDefined();
      expect(typeof stats.hitRate).toBe('number');
      expect(typeof stats.memoryUsage).toBe('string');
    });
  });
});
