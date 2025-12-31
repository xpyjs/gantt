import { describe, expect, it, vi } from 'vitest';

import { DataManager } from '../../src/store/DataManager';
import { EventName } from '../../src/event';

/**
 * 这些测试专门防止 moveTask 时 rawData/children 数组“换引用”(reassign)。
 * 在 Vue/React 包装层里，如果 rawData 引用变了，外部传入的 data 不会联动，
 * 下一次 update(options) 会把旧 data 覆盖回来，导致排序回滚。
 */

describe('DataManager.moveTask', () => {
  const createManager = (data: any[]) => {
    const store: any = {
      getOptionManager: () => ({
        getOptions: () => ({
          expand: {
            show: true,
            enabled: true
          },
          milestone: {
            show: false
          },
          dateFormat: 'YYYY-MM-DD HH:mm:ss',
          fields: {
            id: 'id',
            children: 'children',
            name: 'name',
            type: 'type',
            startTime: 'startTime',
            endTime: 'endTime',
            progress: 'progress'
          }
        })
      }),
      updateTime: () => void 0,
      getTimeAxis: () => ({ getCellUnit: () => 'day' })
    };

    const event: any = {
      emit: vi.fn()
    };

    const dm = new DataManager(store, event);
    dm.setData(data, true);

    return { dm, event };
  };

  it('should keep root rawData array reference when moving root items', () => {
    const external = [
      { id: 'a', name: 'A' },
      { id: 'b', name: 'B' },
      { id: 'c', name: 'C' }
    ];

    const { dm } = createManager(external);

    const rawBefore = dm.getData();
    expect(rawBefore).toBe(external);

    const taskB = dm.getTaskById('b');
    expect(taskB).toBeTruthy();

    // 把 b 移到 a 前面
    dm.moveTask('before', taskB, 0);

    const rawAfter = dm.getData();
    expect(rawAfter).toBe(external);
    expect(external.map(i => i.id)).toEqual(['b', 'a', 'c']);
  });

  it('should keep children array reference when moving a child item', () => {
    const external = [
      {
        id: 'p',
        name: 'P',
        children: [
          { id: 'c1', name: 'C1' },
          { id: 'c2', name: 'C2' },
          { id: 'c3', name: 'C3' }
        ]
      }
    ];

    const { dm } = createManager(external);

    const parent = dm.getTaskById('p')!;
    const childListBefore = external[0].children;

    expect(Array.isArray(childListBefore)).toBe(true);

    const taskC2 = dm.getTaskById('c2');
    expect(taskC2?.parent?.id).toBe('p');

    // 可视列表顺序：p, c1, c2, c3； targetIndex=1 => c1
    dm.moveTask('before', taskC2, 1);

    expect(external[0].children).toBe(childListBefore);
    expect(external[0].children.map(i => i.id)).toEqual(['c2', 'c1', 'c3']);
  });

  it('should emit VIEW_UPDATE and ROW_DRAG_END when moved', () => {
    const external = [
      { id: 'a', name: 'A' },
      { id: 'b', name: 'B' }
    ];

    const { dm, event } = createManager(external);
    const taskB = dm.getTaskById('b')!;

    dm.moveTask('before', taskB, 0);

    expect(event.emit).toHaveBeenCalledWith(EventName.VIEW_UPDATE);
    // ROW_DRAG_END: (target, task)
    expect(event.emit).toHaveBeenCalledWith(
      EventName.ROW_DRAG_END,
      expect.anything(),
      expect.anything()
    );
  });
});
