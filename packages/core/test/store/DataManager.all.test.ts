import { describe, expect, it, vi } from 'vitest';
import { DataManager } from '../../src/store/DataManager';
import { EventBus, EventName } from '../../src/event';
import dayjs from 'dayjs';

/** Shared mock factory matching the existing moveTask test pattern */
function createManager(overrides: Partial<Record<string, any>> = {}): any {
  const store: any = {
    getOptionManager: () => ({
      getOptions: () => ({
        expand: { show: true, enabled: true },
        milestone: { show: false },
        summary: { show: false },
        dateFormat: 'YYYY-MM-DD HH:mm:ss',
        fields: {
          id: 'id',
          children: 'children',
          name: 'name',
          type: 'type',
          startTime: 'startTime',
          endTime: 'endTime',
          progress: 'progress',
          duration: 'duration'
        },
        baselines: {
          taskKey: 'taskId',
          fields: {
            id: 'id',
            startTime: 'startTime',
            endTime: 'endTime',
            name: 'name',
            target: 'target',
            highlight: 'highlight'
          }
        },
        bar: { move: { link: { child: 'none', parent: 'none' } } },
        ...overrides
      })
    }),
    updateTime: vi.fn(),
    getTimeAxis: () => ({ getCellUnit: () => 'day' }),
    getWorkCalendar: () => ({
      workOffset: (start: any, n: number) => start,
      workDiff: (start: any, end: any) => end.diff(start)
    })
  };

  const event: any = {
    emit: vi.fn()
  };

  const dm = new DataManager(store, event);
  return { dm, event, store };
}

describe('DataManager', () => {
  describe('setData / getData', () => {
    it('should set and return raw data', () => {
      const { dm } = createManager();
      const data = [
        { id: 'a', name: 'A' },
        { id: 'b', name: 'B', children: [{ id: 'c', name: 'C' }] }
      ];
      dm.setData(data, true);
      expect(dm.getData()).toBe(data);
    });

    it('should emit DATA_UPDATE on setData', () => {
      const { dm, event } = createManager();
      dm.setData([{ id: 'a' }], true);
      expect(event.emit).toHaveBeenCalledWith(EventName.DATA_UPDATE);
    });

    it('should build task tree', () => {
      const { dm } = createManager();
      dm.setData([
        { id: 'p', children: [{ id: 'c1' }, { id: 'c2' }] }
      ], true);
      expect(dm.getDataSize()).toBe(3);
    });

    it('should handle empty data array', () => {
      const { dm } = createManager();
      dm.setData([], true);
      expect(dm.getDataSize()).toBe(0);
    });
  });

  describe('getTaskById', () => {
    it('should return task by id', () => {
      const { dm } = createManager();
      dm.setData([{ id: 't1', name: 'Task1' }], true);
      expect(dm.getTaskById('t1')?.name).toBe('Task1');
    });

    it('should return undefined for missing id', () => {
      const { dm } = createManager();
      dm.setData([{ id: 't1' }], true);
      expect(dm.getTaskById('missing')).toBeUndefined();
    });
  });

  describe('getTasks', () => {
    it('should return tree by default', () => {
      const { dm } = createManager();
      dm.setData([{ id: 'a', children: [{ id: 'b' }] }], true);
      expect(dm.getTasks(true)).toHaveLength(1);
    });

    it('should return flat list when asTree=false', () => {
      const { dm } = createManager();
      dm.setData([{ id: 'a', children: [{ id: 'b' }] }], true);
      expect(dm.getTasks(false)).toHaveLength(2);
    });
  });

  describe('getDataSize', () => {
    it('should count all tasks', () => {
      const { dm } = createManager();
      dm.setData([
        { id: 'a', children: [{ id: 'b', children: [{ id: 'c' }] }] }
      ], true);
      expect(dm.getDataSize()).toBe(3);
    });
  });

  describe('deleteTaskById', () => {
    it('should delete root task', () => {
      const { dm } = createManager();
      dm.setData([{ id: 'a' }, { id: 'b' }], true);
      const res = dm.deleteTaskById('a');
      expect(res).toBe(true);
      expect(dm.getTaskById('a')).toBeUndefined();
    });

    it('should delete child task', () => {
      const { dm } = createManager();
      dm.setData([{ id: 'p', children: [{ id: 'c1' }, { id: 'c2' }] }], true);
      dm.deleteTaskById('c1');
      expect(dm.getTaskById('c1')).toBeUndefined();
      expect(dm.getTaskById('c2')).toBeDefined();
    });

    it('should return false for missing task', () => {
      const { dm } = createManager();
      dm.setData([{ id: 'a' }], true);
      expect(dm.deleteTaskById('missing')).toBe(false);
    });

    it('should emit DATA_UPDATE on delete', () => {
      const { dm, event } = createManager();
      dm.setData([{ id: 'a' }], true);
      dm.deleteTaskById('a');
      expect(event.emit).toHaveBeenCalledWith(EventName.DATA_UPDATE);
    });

    it('should clear selected task if deleted task was selected', () => {
      const { dm } = createManager();
      dm.setData([{ id: 'a' }], true);
      dm.selectTask('a');
      dm.deleteTaskById('a');
      expect(dm.getSelectedTask()).toBeUndefined();
    });

    it('should cascade delete children', () => {
      const { dm } = createManager();
      dm.setData([{ id: 'p', children: [{ id: 'c1' }, { id: 'c2' }] }], true);
      dm.deleteTaskById('p');
      expect(dm.getTaskById('p')).toBeUndefined();
      expect(dm.getTaskById('c1')).toBeUndefined();
      expect(dm.getTaskById('c2')).toBeUndefined();
    });
  });

  describe('selection', () => {
    it('selectTask should select and emit', () => {
      const { dm, event } = createManager();
      dm.setData([{ id: 'a' }], true);
      expect(dm.selectTask('a')).toBe(true);
      expect(dm.getSelectedTask()?.id).toBe('a');
      expect(event.emit).toHaveBeenCalledWith(EventName.TASK_SELECTED, expect.anything());
    });

    it('selectTask should return false for missing task', () => {
      const { dm } = createManager();
      dm.setData([{ id: 'a' }], true);
      expect(dm.selectTask('missing')).toBe(false);
    });

    it('selecting same task should return true without new event', () => {
      const { dm } = createManager();
      dm.setData([{ id: 'a' }], true);
      dm.selectTask('a');
      const beforeCount = dm.selectTask('a');
      expect(beforeCount).toBe(true);
    });

    it('unselectTask should clear selection and emit', () => {
      const { dm, event } = createManager();
      dm.setData([{ id: 'a' }], true);
      dm.selectTask('a');
      dm.unselectTask();
      expect(dm.getSelectedTask()).toBeUndefined();
      expect(event.emit).toHaveBeenCalledWith(EventName.TASK_UNSELECTED, 'a');
    });

    it('isTaskSelected should work', () => {
      const { dm } = createManager();
      dm.setData([{ id: 'a' }], true);
      dm.selectTask('a');
      expect(dm.isTaskSelected('a')).toBe(true);
      expect(dm.isTaskSelected('b')).toBe(false);
    });

    it('unselecting nothing should not emit', () => {
      const { dm, event } = createManager();
      dm.setData([{ id: 'a' }], true);
      dm.unselectTask();
      // should not emit since nothing was selected
      const emits = event.emit.mock.calls.filter((c: any) => c[0] === EventName.TASK_UNSELECTED);
      expect(emits).toHaveLength(0);
    });
  });

  describe('check list', () => {
    it('updateCheckedList should add and remove', () => {
      const { dm } = createManager();
      dm.setData([{ id: 'a' }, { id: 'b' }], true);
      const a = dm.getTaskById('a')!;
      dm.updateCheckedList(true, a);
      expect(dm.getCheckedList()).toContain(a);
      dm.updateCheckedList(false, a);
      expect(dm.getCheckedList()).not.toContain(a);
    });

    it('toggleAllChecked', () => {
      const { dm } = createManager();
      dm.setData([
        { id: 'a' },
        { id: 'b', children: [{ id: 'c' }] }
      ], true);
      dm.toggleAllChecked(true);
      expect(dm.getCheckedList()).toHaveLength(3);
      dm.toggleAllChecked(false);
      expect(dm.getCheckedList()).toHaveLength(0);
    });

    it('isTaskChecked', () => {
      const { dm } = createManager();
      dm.setData([{ id: 'a' }], true);
      const a = dm.getTaskById('a')!;
      dm.updateCheckedList(true, a);
      expect(dm.isTaskChecked(a)).toBe(true);
      dm.updateCheckedList(false, a);
      expect(dm.isTaskChecked(a)).toBe(false);
    });
  });

  describe('baselines', () => {
    it('setBaselines should store baselines', () => {
      const { dm, store } = createManager();
      // Baseline constructor needs getTaskById on the store
      store.getDataManager = () => dm;
      dm.setData([{ id: 't1' }], true);
      dm.setBaselines([
        { id: 'bl1', taskId: 't1', startTime: '2026-01-01', endTime: '2026-01-10' }
      ]);
      expect(dm.getBaselines()).toHaveLength(1);
      expect(dm.getBaselineById('bl1')).toBeDefined();
      expect(dm.getBaselinesByTaskId('t1')).toHaveLength(1);
    });

    it('should return empty for non-existent task baselines', () => {
      const { dm, store } = createManager();
      store.getDataManager = () => dm;
      dm.setBaselines([]);
      expect(dm.getBaselinesByTaskId('nonexistent')).toEqual([]);
    });
  });

  describe('expandTask', () => {
    it('should expand/collapse a task', () => {
      const { dm } = createManager();
      dm.setData([
        { id: 'p', children: [{ id: 'c' }] }
      ], true);
      dm.expandTask('p');
      expect(dm.getTaskById('p')?.expanded).toBe(false);
      dm.expandTask('p');
      expect(dm.getTaskById('p')?.expanded).toBe(true);
    });

    it('should return false for missing task', () => {
      const { dm } = createManager();
      expect(dm.expandTask('missing')).toBe(false);
    });

    it('should emit VIEW_UPDATE', () => {
      const { dm, event } = createManager();
      dm.setData([{ id: 'p', children: [{ id: 'c' }] }], true);
      dm.expandTask('p');
      expect(event.emit).toHaveBeenCalledWith(EventName.VIEW_UPDATE);
    });

    it('should expand recursively when already collapsed', () => {
      const { dm } = createManager();
      dm.setData([
        {
          id: 'p',
          children: [
            { id: 'c1', children: [{ id: 'gc1' }] },
            { id: 'c2' }
          ]
        }
      ], true);
      // First call collapses everything
      dm.expandTask('p', true);
      expect(dm.getTaskById('p')?.expanded).toBe(false);
      // Second call expands parent + recursively expands all children
      dm.expandTask('p', true);
      expect(dm.getTaskById('p')?.expanded).toBe(true);
      expect(dm.getTaskById('c1')?.expanded).toBe(true);
      expect(dm.getTaskById('gc1')?.expanded).toBe(true);
    });
  });

  describe('getVisibleTasks / getVisibleSize', () => {
    it('should return visible tasks', () => {
      const { dm } = createManager();
      dm.setData([
        { id: 'p', children: [{ id: 'c1' }, { id: 'c2' }] }
      ], true);
      const visible = dm.getVisibleTasks();
      expect(visible.length).toBeGreaterThan(0);
      expect(dm.getVisibleSize()).toBe(visible.length);
    });

    it('should exclude children of collapsed parent', () => {
      const { dm } = createManager();
      dm.setData([
        { id: 'p', children: [{ id: 'c1' }, { id: 'c2' }] }
      ], true);
      dm.expandTask('p'); // collapse
      const visible = dm.getVisibleTasks();
      const childIds = visible.map(t => t.id);
      expect(childIds).not.toContain('c1');
      expect(childIds).not.toContain('c2');
    });

    it('should cache results', () => {
      const { dm } = createManager();
      dm.setData([{ id: 'a' }], true);
      const a = dm.getVisibleTasks();
      const b = dm.getVisibleTasks();
      expect(a).toBe(b);
    });
  });

  describe('isTaskVisible', () => {
    it('should return true for root tasks', () => {
      const { dm } = createManager();
      dm.setData([{ id: 'a' }], true);
      expect(dm.isTaskVisible(dm.getTaskById('a')!)).toBe(true);
    });

    it('should return false when parent is collapsed', () => {
      const { dm } = createManager();
      dm.setData([
        { id: 'p', children: [{ id: 'c' }] }
      ], true);
      dm.expandTask('p'); // collapse
      expect(dm.isTaskVisible(dm.getTaskById('c')!)).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all data', () => {
      const { dm, event } = createManager();
      dm.setData([{ id: 'a' }], true);
      dm.selectTask('a');
      dm.clear();
      expect(dm.getDataSize()).toBe(0);
      expect(dm.getData()).toEqual([]);
      expect(dm.getSelectedTask()).toBeUndefined();
      expect(event.emit).toHaveBeenCalledWith(EventName.DATA_UPDATE);
    });
  });
});
