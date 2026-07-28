import { describe, expect, it } from 'vitest';
import { OptionManager } from '../../src/store/OptionManager';

describe('OptionManager', () => {
  describe('getOptions / setOptions defaults', () => {
    it('should provide default options', () => {
      const om = new OptionManager();
      const opts = om.getOptions();
      expect(opts.fields.id).toBe('id');
      expect(opts.fields.startTime).toBe('startTime');
      expect(opts.locale).toBe('en');
      expect(opts.unit).toBe('day');
      expect(opts.primaryColor).toBe('#eca710');
    });

    it('should merge user options on setOptions', () => {
      const om = new OptionManager();
      om.setOptions({ primaryColor: '#ff0000', locale: 'zh-cn' });
      const opts = om.getOptions();
      expect(opts.primaryColor).toBe('#ff0000');
      expect(opts.locale).toBe('zh-cn');
      // defaults preserved
      expect(opts.fields.id).toBe('id');
    });

    it('should replace all options when merge=false', () => {
      const om = new OptionManager();
      om.setOptions({ primaryColor: '#ff0000' }, { merge: false });
      // merge=false means merge(DEFAULT_OPTIONS(), options) — no current options merged
      // primaryColor should be set, rest come from DEFAULT_OPTIONS
      const opts = om.getOptions();
      expect(opts.primaryColor).toBe('#ff0000');
    });
  });

  describe('update', () => {
    it('should apply new options via update', () => {
      const om = new OptionManager();
      om.update({ unit: 'week' });
      expect(om.getOptions().unit).toBe('week');
    });
  });

  describe('holiday sanitization (setOptions)', () => {
    it('should split non-consecutive holiday date arrays', () => {
      const om = new OptionManager();
      om.setOptions({
        holiday: {
          holidays: [
            { date: ['2026-01-01', '2026-01-02', '2026-01-05', '2026-01-06'] }
          ]
        }
      });
      const hols = om.getOptions().holiday.holidays;
      expect(hols.length).toBe(2); // split at the gap
      expect(hols[0].date).toHaveLength(2);
      expect(hols[1].date).toHaveLength(2);
    });

    it('should keep consecutive dates together', () => {
      const om = new OptionManager();
      om.setOptions({
        holiday: {
          holidays: [
            { date: ['2026-01-01', '2026-01-02', '2026-01-03'] }
          ]
        }
      });
      const hols = om.getOptions().holiday.holidays;
      expect(hols.length).toBe(1);
      expect(hols[0].date).toHaveLength(3);
    });

    it('should leave single-date holidays unchanged', () => {
      const om = new OptionManager();
      om.setOptions({
        holiday: {
          holidays: [{ date: '2026-01-01' }]
        }
      });
      expect(om.getOptions().holiday.holidays.length).toBe(1);
    });
  });

  describe('weekend.days validation', () => {
    it('should filter invalid day numbers', () => {
      const om = new OptionManager();
      om.setOptions({ weekend: { days: [-1, 1, 2, 7] } });
      expect(om.getOptions().weekend.days).toEqual([1, 2]);
    });
  });

  describe('showVerticalLine legacy compat', () => {
    it('should default to true when unit=day and not explicitly set', () => {
      const om = new OptionManager();
      om.setOptions({ unit: 'day' });
      expect(om.getOptions().chart.showVerticalLine).toBe(true);
    });

    it('should default to true when unit=hour', () => {
      const om = new OptionManager();
      om.setOptions({ unit: 'hour' });
      expect(om.getOptions().chart.showVerticalLine).toBe(true);
    });

    it('should respect explicit false', () => {
      const om = new OptionManager();
      om.setOptions({ unit: 'day', chart: { showVerticalLine: false } });
      expect(om.getOptions().chart.showVerticalLine).toBe(false);
    });
  });

  describe('getRowBackgroundColor', () => {
    // Need a mock Task with level and getEmitData
    function makeTask(level: number, data: any = {}) {
      return { level, getEmitData: () => ({ data, $index: 0, level: level + 1 }) } as any;
    }

    it('should return string backgroundColor directly', () => {
      const om = new OptionManager();
      om.setOptions({ row: { backgroundColor: '#fafafa' } });
      expect(om.getRowBackgroundColor(makeTask(0))).toBe('#fafafa');
    });

    it('should return backgroundColor by level from array', () => {
      const om = new OptionManager();
      om.setOptions({ row: { backgroundColor: ['#fff', '#eee', '#ddd'] } });
      expect(om.getRowBackgroundColor(makeTask(0))).toBe('#fff');
      expect(om.getRowBackgroundColor(makeTask(1))).toBe('#eee');
      expect(om.getRowBackgroundColor(makeTask(2))).toBe('#ddd');
    });

    it('should return empty string for empty array', () => {
      const om = new OptionManager();
      om.setOptions({ row: { backgroundColor: [] } });
      expect(om.getRowBackgroundColor(makeTask(0))).toBe('');
    });

    it('should call function backgroundColor', () => {
      const om = new OptionManager();
      const fn = vi.fn(() => '#abcdef');
      om.setOptions({ row: { backgroundColor: fn } });
      expect(om.getRowBackgroundColor(makeTask(0, { id: 1 }))).toBe('#abcdef');
      expect(fn).toHaveBeenCalled();
    });
  });

  describe('unpackFunc', () => {
    it('should return value directly when not a function', () => {
      const om = new OptionManager();
      expect(om.unpackFunc('hello', {} as any)).toBe('hello');
      expect(om.unpackFunc(42, {} as any)).toBe(42);
    });

    it('should call function with getEmitData()', () => {
      const om = new OptionManager();
      const fn = vi.fn(() => 'computed');
      expect(om.unpackFunc(fn, { getEmitData: () => ({ data: {} }) } as any)).toBe('computed');
      expect(fn).toHaveBeenCalled();
    });
  });
});
