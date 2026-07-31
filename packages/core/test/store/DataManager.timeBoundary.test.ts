import { describe, expect, it, vi } from 'vitest';
import { DataManager } from '../../src/store/DataManager';
import dayjs from 'dayjs';

/**
 * 与 DataManager.all.test.ts 一致的 mock 工厂
 * 仅为时间边界测试提供最小化的 Store 依赖
 */
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

  const event: any = { emit: vi.fn() };
  const dm = new DataManager(store, event);
  return { dm, event, store };
}

/**
 * resizeTimeAxis 的核心逻辑位于 DataManager 的时间边界方法中：
 * - updateTimeBoundary: 记录并扩展任务时间边界（最左/最右时间）
 * - resetTimeBoundary:  从可视任务重新计算时间边界
 * - getTimeBoundary:     获取当前时间边界
 *
 * 这些方法由 Store.reloadTime() 在 resizeTimeAxis 中调用。
 */
describe('DataManager - time boundary (resizeTimeAxis)', () => {
  describe('updateTimeBoundary', () => {
    it('should record the first boundary when unset', () => {
      const { dm } = createManager();
      const start = dayjs('2024-01-01');
      const end = dayjs('2024-01-10');
      dm.updateTimeBoundary(start, end);
      expect(dm.getTimeBoundary()).toEqual([start, end]);
    });

    it('should expand left when an earlier start is given', () => {
      const { dm } = createManager();
      dm.updateTimeBoundary(dayjs('2024-01-05'), dayjs('2024-01-10'));
      dm.updateTimeBoundary(dayjs('2023-12-01'), dayjs('2024-01-08'));
      const [left] = dm.getTimeBoundary();
      expect(left.isSame(dayjs('2023-12-01'))).toBe(true);
    });

    it('should expand right when a later end is given', () => {
      const { dm } = createManager();
      dm.updateTimeBoundary(dayjs('2024-01-01'), dayjs('2024-01-10'));
      dm.updateTimeBoundary(dayjs('2024-01-05'), dayjs('2024-02-01'));
      const [, right] = dm.getTimeBoundary();
      expect(right.isSame(dayjs('2024-02-01'))).toBe(true);
    });

    it('should not shrink when a narrower boundary is given', () => {
      const { dm } = createManager();
      dm.updateTimeBoundary(dayjs('2024-01-01'), dayjs('2024-02-01'));
      dm.updateTimeBoundary(dayjs('2024-01-10'), dayjs('2024-01-20'));
      const [left, right] = dm.getTimeBoundary();
      expect(left.isSame(dayjs('2024-01-01'))).toBe(true);
      expect(right.isSame(dayjs('2024-02-01'))).toBe(true);
    });
  });

  describe('resetTimeBoundary', () => {
    it('should recompute boundary from visible tasks', () => {
      const { dm } = createManager();
      dm.setData(
        [
          { id: 'a', startTime: '2024-03-01 00:00:00', endTime: '2024-03-10 00:00:00' },
          { id: 'b', startTime: '2024-02-01 00:00:00', endTime: '2024-04-01 00:00:00' }
        ],
        true
      );
      // 填充 visibleTasksCache，resetTimeBoundary 依赖该缓存
      dm.getVisibleTasks();
      dm.resetTimeBoundary();
      const [left, right] = dm.getTimeBoundary();
      expect(left.isSame(dayjs('2024-02-01 00:00:00'))).toBe(true);
      expect(right.isSame(dayjs('2024-04-01 00:00:00'))).toBe(true);
    });

    it('should override a previously recorded boundary', () => {
      const { dm } = createManager();
      // 先记录一个人工边界
      dm.updateTimeBoundary(dayjs('2020-01-01'), dayjs('2030-01-01'));
      dm.setData(
        [{ id: 'a', startTime: '2024-01-01 00:00:00', endTime: '2024-01-05 00:00:00' }],
        true
      );
      dm.getVisibleTasks();
      dm.resetTimeBoundary();
      const [left, right] = dm.getTimeBoundary();
      expect(left.isSame(dayjs('2024-01-01 00:00:00'))).toBe(true);
      expect(right.isSame(dayjs('2024-01-05 00:00:00'))).toBe(true);
    });
  });

  describe('getTimeBoundary default', () => {
    it('should return current time when no boundary recorded', () => {
      const { dm } = createManager();
      const before = dayjs();
      const [left, right] = dm.getTimeBoundary();
      const after = dayjs();
      expect(left).toBeTruthy();
      expect(right).toBeTruthy();
      // 未记录边界时，默认返回当前时间
      expect(left.isAfter(before.subtract(1, 'second'))).toBe(true);
      expect(left.isBefore(after.add(1, 'second'))).toBe(true);
      expect(right.isAfter(before.subtract(1, 'second'))).toBe(true);
      expect(right.isBefore(after.add(1, 'second'))).toBe(true);
    });
  });
});
