import { describe, expect, it, vi } from 'vitest';
import { WorkCalendar } from '../../src/store/workCalendar';
import dayjs from '../../src/utils/time';

// 2026-07-27 is a Monday
const MONDAY_2026_07_27 = new Date('2026-07-27');
const SAT_2026_07_25 = new Date('2026-07-25');
const SUN_2026_07_26 = new Date('2026-07-26');
const FRI_2026_07_31 = new Date('2026-07-31');
const TUE_2026_07_28 = new Date('2026-07-28');
const TUE_2026_08_04 = new Date('2026-08-04');

// WorkCalendar constructor: (weekendOpts, holidayOpts, workTimeOpts)
// Using named-style helper to avoid positional confusion
function W(weekend: object = {}) { return weekend as any; }
function H(holiday: object = {}) { return holiday as any; }
function T(workTime: object = {}) { return workTime as any; }

describe('WorkCalendar', () => {
  describe('constructor & defaults', () => {
    it('should initialize with no options', () => {
      expect(new WorkCalendar()).toBeDefined();
    });

    it('should default to Saturday+Sunday as weekend', () => {
      const cal = new WorkCalendar();
      expect(cal.isWeekend(SAT_2026_07_25)).toBe(true);
      expect(cal.isWeekend(SUN_2026_07_26)).toBe(true);
      expect(cal.isWeekend(MONDAY_2026_07_27)).toBe(false);
    });

    it('should treat all days as work time with default opts (no skipWeekends)', () => {
      const cal = new WorkCalendar();
      expect(cal.isWorkTime(SAT_2026_07_25)).toBe(true);
    });
  });

  describe('isWeekend', () => {
    it('should use default [0, 6] when no options', () => {
      const cal = new WorkCalendar();
      expect(cal.isWeekend(SAT_2026_07_25)).toBe(true);
      expect(cal.isWeekend(SUN_2026_07_26)).toBe(true);
      expect(cal.isWeekend(MONDAY_2026_07_27)).toBe(false);
    });

    it('should support custom weekend days', () => {
      const cal = new WorkCalendar(W({ days: [5, 6] }));
      expect(cal.isWeekend(FRI_2026_07_31)).toBe(true);
      expect(cal.isWeekend(SAT_2026_07_25)).toBe(true);
      expect(cal.isWeekend(SUN_2026_07_26)).toBe(false);
    });

    it('should support no weekends (empty days)', () => {
      const cal = new WorkCalendar(W({ days: [] }));
      expect(cal.isWeekend(SAT_2026_07_25)).toBe(false);
      expect(cal.isWeekend(SUN_2026_07_26)).toBe(false);
    });

    it('should let isWeekend hook override days', () => {
      const hook = vi.fn(() => true);
      const cal = new WorkCalendar(W({ days: [0, 6], isWeekend: hook }));
      expect(cal.isWeekend(MONDAY_2026_07_27)).toBe(true);
      expect(hook).toHaveBeenCalled();
    });

    it('hook returning undefined should fall through to days', () => {
      const cal = new WorkCalendar(W({
        isWeekend: () => undefined,
        days: [0]
      }));
      expect(cal.isWeekend(SUN_2026_07_26)).toBe(true);
      expect(cal.isWeekend(SAT_2026_07_25)).toBe(false);
    });
  });

  describe('isHoliday', () => {
    it('should return false when no holidays configured', () => {
      const cal = new WorkCalendar();
      expect(cal.isHoliday(MONDAY_2026_07_27)).toBe(false);
    });

    it('should detect single holiday date', () => {
      const cal = new WorkCalendar(W(), H({ holidays: [{ date: '2026-07-27' }] }));
      expect(cal.isHoliday(MONDAY_2026_07_27)).toBe(true);
      expect(cal.isHoliday(TUE_2026_07_28)).toBe(false);
    });

    it('should detect holiday as array of dates', () => {
      const cal = new WorkCalendar(W(), H({ holidays: [{ date: ['2026-07-27', '2026-07-28'] }] }));
      expect(cal.isHoliday(MONDAY_2026_07_27)).toBe(true);
      expect(cal.isHoliday(TUE_2026_07_28)).toBe(true);
    });

    it('should let isHoliday hook override holidays list', () => {
      const hook = vi.fn(d => d.toDateString() === new Date('2026-07-27').toDateString());
      const cal = new WorkCalendar(W(), H({ isHoliday: hook }));
      expect(cal.isHoliday(MONDAY_2026_07_27)).toBe(true);
    });

    it('holiday should not be weekend (holiday overrides weekend)', () => {
      const cal = new WorkCalendar(W(), H({ holidays: [{ date: SAT_2026_07_25 }] }));
      expect(cal.isHoliday(SAT_2026_07_25)).toBe(true);
      expect(cal.isWeekend(SAT_2026_07_25)).toBe(false);
    });
  });

  describe('isWorkTime', () => {
    it('should default to true when no skip options', () => {
      const cal = new WorkCalendar();
      expect(cal.isWorkTime(MONDAY_2026_07_27)).toBe(true);
      expect(cal.isWorkTime(SAT_2026_07_25)).toBe(true);
    });

    it('should exclude weekends when skipWeekends is true', () => {
      const cal = new WorkCalendar(W(), H(), T({ skipWeekends: true }));
      expect(cal.isWorkTime(MONDAY_2026_07_27)).toBe(true);
      expect(cal.isWorkTime(SAT_2026_07_25)).toBe(false);
      expect(cal.isWorkTime(SUN_2026_07_26)).toBe(false);
    });

    it('should exclude holidays when skipHolidays is true', () => {
      const cal = new WorkCalendar(W(), H({ holidays: [{ date: '2026-07-27' }] }), T({ skipHolidays: true }));
      expect(cal.isWorkTime(MONDAY_2026_07_27)).toBe(false);
      expect(cal.isWorkTime(TUE_2026_07_28)).toBe(true);
    });

    it('isWorkTime hook overrides everything', () => {
      const cal = new WorkCalendar(W(), H(), T({
        skipWeekends: true,
        skipHolidays: true,
        isWorkTime: () => true
      }));
      expect(cal.isWorkTime(SAT_2026_07_25)).toBe(true);
    });

    it('isWorkTime hook returning false makes day non-work', () => {
      const cal = new WorkCalendar(W(), H(), T({
        skipWeekends: true,
        isWorkTime: () => false
      }));
      expect(cal.isWorkTime(MONDAY_2026_07_27)).toBe(false);
    });
  });

  describe('workOffset', () => {
    it('should move forward n work days (skip weekends)', () => {
      const cal = new WorkCalendar(W(), H(), T({ skipWeekends: true }));
      const r = cal.workOffset(MONDAY_2026_07_27, 1);
      expect(r.day()).toBe(2); // Tuesday
      // Tue + 3 days: Wed, Thu, Fri (skip Sat/Sun)
      const r2 = cal.workOffset(TUE_2026_07_28, 3);
      expect(r2.day()).toBe(5); // Friday
    });

    it('should move backward n work days', () => {
      const cal = new WorkCalendar(W(), H(), T({ skipWeekends: true }));
      const r = cal.workOffset(TUE_2026_07_28, -1);
      expect(r.day()).toBe(1); // Monday
    });

    it('should handle fractional offset', () => {
      const cal = new WorkCalendar(W(), H(), T({ skipWeekends: true }));
      const r = cal.workOffset(MONDAY_2026_07_27, 1.5);
      expect(r.day()).toBe(2);
    });

    it('should handle zero offset', () => {
      const cal = new WorkCalendar(W(), H(), T({ skipWeekends: true }));
      const r = cal.workOffset(MONDAY_2026_07_27, 0);
      expect(r.toDate().toDateString()).toBe(new Date(MONDAY_2026_07_27).toDateString());
    });

    it('should NOT skip weekends when skipWeekends is false', () => {
      const cal = new WorkCalendar();
      const r = cal.workOffset(MONDAY_2026_07_27, 2);
      expect(r.day()).toBe(3); // Wednesday (no skipping)
    });
  });

  describe('workDiff', () => {
    // workDiff = (end - start in days) - restDays, min 0
    it('should compute work days Mon-Fri with skipWeekends', () => {
      const cal = new WorkCalendar(W(), H(), T({ skipWeekends: true }));
      // Mon 07-27 -> Fri 07-31 = 4 calendar days, 0 rest days => 4
      const diff = cal.workDiff(MONDAY_2026_07_27, FRI_2026_07_31);
      expect(diff).toBeCloseTo(4);
    });

    it('should skip weekend in the middle', () => {
      const cal = new WorkCalendar(W(), H(), T({ skipWeekends: true }));
      // Fri 07-31 -> Tue 08-04 = 4 calendar days, 2 rest days (Sat,Sun) => 2
      const diff = cal.workDiff(FRI_2026_07_31, TUE_2026_08_04);
      expect(diff).toBeCloseTo(2);
    });

    it('should handle same start/end (returns 0)', () => {
      const cal = new WorkCalendar(W(), H(), T({ skipWeekends: true }));
      expect(cal.workDiff(MONDAY_2026_07_27, MONDAY_2026_07_27)).toBeCloseTo(0);
    });

    it('should return fractional (not clamped to 1) for less than a full day', () => {
      // 含尾语义：存储的结束时间 23:50:20 差 9 分 41 秒不满一天，时长应为 0.xxx
      const cal = new WorkCalendar();
      const st = dayjs('2025-08-18 00:00:00');
      const et = dayjs('2025-08-18 23:50:20');
      const diff = cal.workDiff(st, et);
      expect(diff).toBeGreaterThan(0.99);
      expect(diff).toBeLessThan(1);
    });

    it('should handle reversed dates (swap internally)', () => {
      const cal = new WorkCalendar(W(), H(), T({ skipWeekends: true }));
      const diff = cal.workDiff(FRI_2026_07_31, MONDAY_2026_07_27);
      expect(diff).toBeCloseTo(4);
    });

    it('round-trip: workOffset(st, workDiff(st, et)) === et (fractional end, skip holidays)', () => {
      // 用户场景：结束时间带秒级尾巴（如 23:59:59）时 duration 为 fractional 2.999988（覆盖 04-28/29/30 三天）。
      // workDiff 保留 6 位小数（4 位会进位成 3），workOffset 的小数部分对齐到秒，
      // workOffset(st, 2.999988) 还原 et = 04-30 23:59:59，而不是跳过 05-01~04 假期到 05-05。
      // 2025-04-28(周一) ~ 2025-04-30(周三) 23:59:59，05-01~03 假期，05-04 周日
      const cal = new WorkCalendar(
        W(),
        H({ holidays: [
          { date: '2025-05-01' }, { date: '2025-05-02' }, { date: '2025-05-03' }
        ]}),
        T({ skipWeekends: true, skipHolidays: true })
      );
      const st = dayjs('2025-04-28 00:00:00');
      const et = dayjs('2025-04-30 23:59:59');
      const diff = cal.workDiff(st, et);
      // fractional 2.999988，不进位成 3
      expect(diff).toBeLessThan(3);
      expect(diff).toBeGreaterThan(2.999);
      const roundTrip = cal.workOffset(st, diff);
      // round-trip 精确回到 04-30 23:59:59
      expect(roundTrip.format('YYYY-MM-DD HH:mm:ss')).toBe('2025-04-30 23:59:59');
    });
  });

  describe('restDays', () => {
    it('should count rest days in a range with skipWeekends', () => {
      const cal = new WorkCalendar(W(), H(), T({ skipWeekends: true }));
      expect(cal.restDays(MONDAY_2026_07_27, FRI_2026_07_31)).toBe(0);
      expect(cal.restDays(FRI_2026_07_31, TUE_2026_08_04)).toBe(2);
    });

    it('should handle reversed dates', () => {
      const cal = new WorkCalendar(W(), H(), T({ skipWeekends: true }));
      expect(cal.restDays(TUE_2026_08_04, FRI_2026_07_31)).toBe(2);
    });
  });

  describe('currentWorkTime', () => {
    it('should return same date if already a work day', () => {
      const cal = new WorkCalendar(W(), H(), T({ skipWeekends: true }));
      const r = cal.currentWorkTime(MONDAY_2026_07_27);
      expect(r.toDate().toDateString()).toBe(new Date(MONDAY_2026_07_27).toDateString());
    });

    it('should find next work day after weekend (direction=after)', () => {
      const cal = new WorkCalendar(W(), H(), T({ skipWeekends: true }));
      const r = cal.currentWorkTime(SUN_2026_07_26);
      expect(r.day()).toBe(1); // Monday
    });

    it('should find previous work day before weekend (direction=before)', () => {
      const cal = new WorkCalendar(W(), H(), T({ skipWeekends: true }));
      const r = cal.currentWorkTime(SAT_2026_07_25, 'before');
      expect(r.day()).toBe(5); // Friday
    });

    it('should default direction to after', () => {
      const cal = new WorkCalendar(W(), H(), T({ skipWeekends: true }));
      expect(cal.currentWorkTime(SUN_2026_07_26).day()).toBe(1);
    });

    it('should return original date after MAX_DAYS not found', () => {
      const cal = new WorkCalendar(
        W({ days: [] }),
        H(),
        T({ skipWeekends: true, skipHolidays: true, isWorkTime: () => false })
      );
      const r = cal.currentWorkTime(MONDAY_2026_07_27);
      expect(r.toDate().toDateString()).toBe(new Date(MONDAY_2026_07_27).toDateString());
    });
  });

  describe('update', () => {
    it('should update weekend options', () => {
      const cal = new WorkCalendar(W({ days: [0, 6] }));
      cal.update({ weekendOpts: { days: [] } });
      expect(cal.isWeekend(SUN_2026_07_26)).toBe(false);
    });

    it('should update workTime options', () => {
      const cal = new WorkCalendar();
      cal.update({ workTimeOpts: { skipWeekends: true } });
      expect(cal.isWorkTime(SUN_2026_07_26)).toBe(false);
    });
  });
});
