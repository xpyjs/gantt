import { describe, expect, it, vi } from 'vitest';
import { ColumnManager } from '../../src/store/ColumnManager';
import { EventName } from '../../src/event';

describe('ColumnManager', () => {
  function makeContext(): any {
    const om = { getOptions: () => ({
      drag: { enabled: false },
      selection: { enabled: false },
      expand: { show: true },
      fields: { id: 'id', children: 'children' }
    }) };
    const dm = { dataLevel: 0 };
    return {
      store: {
        getOptionManager: () => om,
        getDataManager: () => dm
      },
      event: { emit: vi.fn() }
    };
  }

  describe('init', () => {
    it('should process columns', () => {
      const cm = new ColumnManager(makeContext());
      cm.init([
        { field: 'name', label: 'Name', width: 150 },
        { field: 'progress', label: 'Progress' }
      ]);
      expect(cm.getColumns()).toHaveLength(2);
      expect(cm.getLeafColumns()).toHaveLength(2);
    });

    it('should process grouped columns', () => {
      const cm = new ColumnManager(makeContext());
      cm.init([
        {
          label: 'Group A',
          children: [
            { field: 'a', width: 100 },
            { field: 'b', width: 120 }
          ]
        }
      ]);
      const cols = cm.getColumns();
      expect(cols).toHaveLength(1);
      expect(cols[0].children).toHaveLength(2);
      expect(cm.getLeafColumns()).toHaveLength(2);
    });

    it('should handle empty columns', () => {
      const cm = new ColumnManager(makeContext());
      cm.init([]);
      expect(cm.getColumns()).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should re-init and clear merge info', () => {
      const cm = new ColumnManager(makeContext());
      cm.init([{ field: 'x' }]);
      cm.addMergeInfo('t1', 0, { task: {} as any, originColumnIndex: 0, colspan: 1, rowspan: 1 });
      cm.update([{ field: 'y' }]);
      expect(cm.getMergeInfo('t1', 0)).toBeUndefined();
    });
  });

  describe('getColumns / getColumn / getLeafColumns', () => {
    it('should find column by key', () => {
      const cm = new ColumnManager(makeContext());
      cm.init([{ field: 'name', width: 200 }]);
      const leaf = cm.getLeafColumns();
      const col = cm.getColumn(leaf[0].key);
      expect(col).toBe(leaf[0]);
    });

    it('getColumn should return undefined for missing key', () => {
      const cm = new ColumnManager(makeContext());
      cm.init([{ field: 'name' }]);
      expect(cm.getColumn('nonexistent')).toBeUndefined();
    });
  });

  describe('width methods', () => {
    it('getTotalWidth should sum leaf widths', () => {
      const cm = new ColumnManager(makeContext());
      cm.init([
        { field: 'a', width: 100 },
        { field: 'b', width: 200 }
      ]);
      expect(cm.getTotalWidth()).toBe(300);
    });

    it('getTotalWidth should be 0 when collapsed', () => {
      const cm = new ColumnManager(makeContext());
      cm.init([{ field: 'a', width: 100 }]);
      cm.collapse();
      expect(cm.getTotalWidth()).toBe(0);
    });

    it('getColumnWidth should return width', () => {
      const cm = new ColumnManager(makeContext());
      cm.init([{ field: 'name', width: 250 }]);
      const leaf = cm.getLeafColumns()[0];
      expect(cm.getColumnWidth(leaf.key)).toBe(250);
    });

    it('getColumnWidth should return 0 for missing key', () => {
      const cm = new ColumnManager(makeContext());
      cm.init([{ field: 'name' }]);
      expect(cm.getColumnWidth('missing')).toBe(0);
    });

    it('setColumnWidth should update and emit event', () => {
      const ctx = makeContext();
      const cm = new ColumnManager(ctx);
      cm.init([{ field: 'name', width: 100 }]);
      const leaf = cm.getLeafColumns()[0];
      cm.setColumnWidth(leaf.key, 300);
      expect(cm.getColumnWidth(leaf.key)).toBe(300);
      expect(ctx.event.emit).toHaveBeenCalledWith(EventName.COLUMN_WIDTH_CHANGE, leaf.key, 300);
    });
  });

  describe('isLastColumn', () => {
    it('should identify last column', () => {
      const cm = new ColumnManager(makeContext());
      cm.init([
        { field: 'a' },
        { field: 'b' },
        { field: 'c' }
      ]);
      const leaves = cm.getLeafColumns();
      expect(cm.isLastColumn(leaves[0].key)).toBe(false);
      expect(cm.isLastColumn(leaves[2].key)).toBe(true);
    });
  });

  describe('merge info', () => {
    it('should add and get merge info', () => {
      const cm = new ColumnManager(makeContext());
      const info = { task: {} as any, originColumnIndex: 0, colspan: 2, rowspan: 1 };
      cm.addMergeInfo('t1', 0, info);
      expect(cm.getMergeInfo('t1', 0)).toBe(info);
    });

    it('clearMergeInfo should clear', () => {
      const cm = new ColumnManager(makeContext());
      cm.addMergeInfo('t1', 0, { task: {} as any, originColumnIndex: 0, colspan: 1, rowspan: 1 });
      cm.clearMergeInfo();
      expect(cm.getMergeInfo('t1', 0)).toBeUndefined();
    });
  });

  describe('handler column', () => {
    it('should have no width when no features enabled', () => {
      const ctx = makeContext();
      const cm = new ColumnManager(ctx);
      cm.init([{ field: 'name' }]);
      expect(cm.getHandlerColumn().width).toBe(0);
    });

    it('should include drag width', () => {
      const ctx = makeContext();
      ctx.store.getOptionManager().getOptions = () => ({
        drag: { enabled: true },
        selection: { enabled: false },
        expand: { show: true }
      });
      const cm = new ColumnManager(ctx);
      cm.init([{ field: 'name' }]);
      expect(cm.getHandlerColumn().width).toBe(40);
    });

    it('should include selection width', () => {
      const ctx = makeContext();
      ctx.store.getOptionManager().getOptions = () => ({
        drag: { enabled: false },
        selection: { enabled: true },
        expand: { show: true }
      });
      const cm = new ColumnManager(ctx);
      cm.init([{ field: 'name' }]);
      expect(cm.getHandlerColumn().width).toBe(40);
    });

    it('should include expand width when multi-level', () => {
      const ctx = makeContext();
      ctx.store.getDataManager().dataLevel = 1;
      ctx.store.getOptionManager().getOptions = () => ({
        drag: { enabled: false },
        selection: { enabled: false },
        expand: { show: true }
      });
      const cm = new ColumnManager(ctx);
      cm.init([{ field: 'name' }]);
      expect(cm.getHandlerColumn().width).toBe(40);
    });
  });

  describe('isMultiHeader / collapse', () => {
    it('should detect multi-header', () => {
      const cm = new ColumnManager(makeContext());
      cm.init([{ label: 'Group', children: [{ field: 'a' }] }]);
      expect(cm.isMultiHeader()).toBe(true);
    });

    it('should not be multi-header for flat columns', () => {
      const cm = new ColumnManager(makeContext());
      cm.init([{ field: 'a' }, { field: 'b' }]);
      expect(cm.isMultiHeader()).toBe(false);
    });

    it('collapse should toggle and emit', () => {
      const ctx = makeContext();
      const cm = new ColumnManager(ctx);
      cm.init([{ field: 'a' }]);
      expect(cm.isCollapsed()).toBe(false);
      cm.collapse();
      expect(cm.isCollapsed()).toBe(true);
      expect(ctx.event.emit).toHaveBeenCalledWith(EventName.TOGGLE_COLLAPSE);
    });
  });
});
