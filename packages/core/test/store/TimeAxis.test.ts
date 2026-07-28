import { describe, expect, it, vi } from 'vitest';
import { TimeAxis } from '../../src/store/TimeAxis';
import dayjs from 'dayjs';

function makeDefaultOptions(overrides: Record<string, any> = {}): any {
  const defaults = {
    data: [],
    links: { show: false, key: 'id', data: [], distance: 20, dash: [0], width: 1, gap: 5, arrow: { width: 6, height: 8 }, radius: 3, create: { enabled: false, mode: 'hover', radius: 3, width: 2, from: true, to: true }, move: { enabled: false }, enableCycleDetection: true },
    baselines: { data: [], taskKey: 'taskId', show: false, fields: { startTime: 'startTime', endTime: 'endTime', name: 'name', id: 'id', target: 'target', highlight: 'highlight' }, mode: 'line', position: 'bottom', backgroundColor: '#999', opacity: 0.6, radius: 2, label: { show: false, forceDisplay: false, color: '#666', fontSize: 10, position: 'right', fontFamily: 'Arial' }, compare: { enabled: false, tolerance: 0.5, mode: 'both', target: 'end', delayed: { backgroundColor: '#ff4444', opacity: 0.8 }, ahead: { backgroundColor: '#44ff44', opacity: 0.8 }, indicator: { show: true, position: 'top', fontFamily: 'Arial', fontSize: 10, size: 6, delayed: { show: true, color: '#af1b1b', opacity: 1 }, ahead: { show: true, color: '#1baf1b', opacity: 1 }, ontime: { show: false, color: '#999', opacity: 1 } } } },
    milestone: { show: false, shape: 'diamond', border: { width: 1 }, label: { show: true, text: '', fontSize: 10, fontFamily: 'Arial', position: 'top-right' } },
    summary: { show: false, mode: 'expand', move: { enabled: false } },
    fields: { id: 'id', startTime: 'startTime', endTime: 'endTime', name: 'name', progress: 'progress', children: 'children', duration: 'duration', type: 'type' },
    selection: { enabled: false, includeSelf: true },
    expand: { show: true, enabled: true },
    drag: { enabled: false, color: '#999', targetOpacity: 0.2 },
    dateFormat: 'YYYY-MM-DD HH:mm:ss',
    locale: 'en',
    unit: 'day',
    table: { width: 100, ellipsis: true, align: 'left', headerAlign: 'center', emptyText: '-' },
    chart: { autoCellWidth: false, cellWidth: 'normal', showVerticalLine: true },
    primaryColor: '#eca710',
    border: { color: '#e5e5e5' },
    collapse: { show: true, backgroundColor: '#fff', radius: 6 },
    header: { height: 80, color: 'auto', fontSize: 14, fontWeight: 600, fontFamily: 'Arial' },
    row: { height: 30, indent: 16, hover: { backgroundColor: '#000', opacity: 0.05 }, select: { backgroundColor: '#000', opacity: 0.1 } },
    bar: { height: 20, show: true, move: { byUnit: false, link: { child: 'none', parent: 'none' } } },
    today: { show: true, type: 'line', backgroundColor: 'lightblue', opacity: 1, width: 1 },
    weekend: { show: true, backgroundColor: '#c9c9c9', opacity: 0.1, days: [0, 6] },
    holiday: { opacity: 0.1 }
  };
  return Object.assign({}, defaults, overrides);
}

describe('TimeAxis', () => {
  describe('init', () => {
    it('should initialize with default options', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions());
      expect(axis.getStartTime()).toBeDefined();
      expect(axis.getEndTime()).toBeDefined();
    });

    it('should parse legacy unit into scales', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions({ unit: 'day' }));
      const scales = axis.getScales();
      expect(scales.length).toBe(2);
      expect(scales[0].unit).toBe('month');
      expect(scales[1].unit).toBe('day');
    });

    it('should handle hour unit', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions({ unit: 'hour' }));
      const scales = axis.getScales();
      expect(scales[1].unit).toBe('hour');
      expect(axis.getCellUnit()).toBe('hour');
    });

    it('should use scaleUnit new mode', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions({
        scaleUnit: [
          { unit: 'year' as any, step: 1 },
          { unit: 'month' as any, step: 1 },
          { unit: 'day' as any, step: 1 }
        ]
      } as any));
      expect(axis.getScales().length).toBe(3);
    });

    it('should respect startTime/endTime in chart config', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions({
        chart: { startTime: '2026-01-01', endTime: '2026-01-31', cellWidth: 'normal', showVerticalLine: true }
      }));
      expect(axis.getStartTime().format('YYYY-MM-DD')).toBe('2026-01-01');
      expect(axis.getEndTime().format('YYYY-MM-DD')).toBe('2026-01-31');
    });
  });

  describe('setDate', () => {
    it('should expand range to include new dates', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions());
      axis.setDate(dayjs('2020-01-01'), dayjs('2030-12-31'));
      expect(axis.getStartTime().format('YYYY-MM-DD')).toBe('2020-01-01');
      expect(axis.getEndTime().format('YYYY-MM-DD')).toBe('2030-12-31');
    });

    it('should not override strict dates', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions({
        chart: { startTime: '2026-06-01', endTime: '2026-06-30', cellWidth: 'normal', showVerticalLine: true }
      }));
      axis.setDate(dayjs('2020-01-01'), dayjs('2030-12-31'));
      expect(axis.getStartTime().format('YYYY-MM-DD')).toBe('2026-06-01');
    });
  });

  describe('getTimeline', () => {
    it('should return non-empty timeline layers', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions());
      axis.setDate(dayjs('2026-07-01'), dayjs('2026-07-31'));
      expect(axis.getTimeline().length).toBeGreaterThan(0);
    });

    it('should return cached result on second call', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions());
      axis.setDate(dayjs('2026-07-01'), dayjs('2026-07-31'));
      const a = axis.getTimeline();
      expect(axis.getTimeline()).toBe(a);
    });

    it('should have items in bottom layer', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions());
      axis.setDate(dayjs('2026-07-01'), dayjs('2026-07-31'));
      const layers = axis.getTimeline();
      expect(layers[layers.length - 1].items.length).toBeGreaterThan(0);
    });
  });

  describe('getCellCount / getTotalWidth', () => {
    it('should report cell count', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions());
      axis.setDate(dayjs('2026-07-01'), dayjs('2026-07-31'));
      expect(axis.getCellCount()).toBeGreaterThan(0);
    });

    it('should report total width', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions());
      axis.setDate(dayjs('2026-07-01'), dayjs('2026-07-07'));
      expect(axis.getTotalWidth()).toBeGreaterThan(0);
    });
  });

  describe('getCellWidth', () => {
    it('should return a positive cell width', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions());
      axis.setDate(dayjs('2026-07-01'), dayjs('2026-07-07'));
      expect(axis.getCellWidth()).toBeGreaterThan(0);
    });

    it('should honor custom cellWidth object', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions({
        chart: { cellWidth: { day: 50, hour: 20, week: 10, month: 5, quarter: 5 }, showVerticalLine: true }
      }));
      axis.setDate(dayjs('2026-07-01'), dayjs('2026-07-07'));
      expect(axis.getCellWidth()).toBe(50);
    });
  });

  describe('getTimeLeft / getTimeByLeft', () => {
    it('should convert time to left offset', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions());
      const start = dayjs('2026-07-01');
      axis.setDate(start, dayjs('2026-07-31'));
      expect(axis.getTimeLeft(start)).toBeCloseTo(0);
    });

    it('getTimeByLeft should return a valid date', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions());
      axis.setDate(dayjs('2026-07-01'), dayjs('2026-07-31'));
      expect(axis.getTimeByLeft(0).isValid()).toBe(true);
    });

    it('getTimeLeft and getTimeByLeft should roundtrip approximately', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions());
      const start = dayjs('2026-07-15');
      axis.setDate(start, dayjs('2026-08-15'));
      const left = axis.getTimeLeft(start);
      const back = axis.getTimeByLeft(left);
      expect(Math.abs(start.diff(back))).toBeLessThan(1000 * 60 * 60 * 24 * 2);
    });
  });

  describe('isInTimeAxis', () => {
    it('should return true for dates within range', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions());
      axis.setDate(dayjs('2026-07-01'), dayjs('2026-07-31'));
      expect(axis.isInTimeAxis(dayjs('2026-07-15'))).toBe(true);
    });

    it('should return false for dates outside range', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions());
      axis.setDate(dayjs('2026-07-01'), dayjs('2026-07-31'));
      expect(axis.isInTimeAxis(dayjs('2025-01-01'))).toBe(false);
      expect(axis.isInTimeAxis(dayjs('2027-01-01'))).toBe(false);
    });
  });

  describe('expand', () => {
    it('should expand right', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions());
      axis.setDate(dayjs('2026-07-01'), dayjs('2026-07-07'));
      const before = axis.getEndTime();
      axis.expand('right', 3);
      expect(axis.getEndTime().isAfter(before)).toBe(true);
    });

    it('should expand left', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions());
      axis.setDate(dayjs('2026-07-01'), dayjs('2026-07-07'));
      const before = axis.getStartTime();
      axis.expand('left', 3);
      expect(axis.getStartTime().isBefore(before)).toBe(true);
    });

    it('should expand both', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions());
      axis.setDate(dayjs('2026-07-01'), dayjs('2026-07-07'));
      const beforeStart = axis.getStartTime();
      const beforeEnd = axis.getEndTime();
      axis.expand('all', 1);
      expect(axis.getStartTime().isBefore(beforeStart)).toBe(true);
      expect(axis.getEndTime().isAfter(beforeEnd)).toBe(true);
    });
  });

  describe('clear', () => {
    it('should reset cache and rebuild on next getTimeline call', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions());
      axis.setDate(dayjs('2026-07-01'), dayjs('2026-07-07'));
      const beforeClear = axis.getTimeline();
      axis.clear();
      // 缓存已清空，getTimeline 应重新构建，返回新的引用（不是旧缓存）
      const afterClear = axis.getTimeline();
      expect(afterClear).not.toBe(beforeClear);
      expect(afterClear.length).toBeGreaterThan(0);
    });
  });

  describe('setAllWidth', () => {
    it('should set allWidth', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions({ chart: { autoCellWidth: true, cellWidth: 'normal', showVerticalLine: true } }));
      axis.setDate(dayjs('2026-07-01'), dayjs('2026-07-07'));
      axis.setAllWidth(1000);
    });
  });

  describe('getScales / getBottomScale', () => {
    it('should return 2 scales in legacy mode', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions());
      expect(axis.getScales()).toHaveLength(2);
    });

    it('getBottomScale should be last scale', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions());
      expect(axis.getBottomScale()).toBe(axis.getScales()[1]);
    });
  });

  describe('getUnitsPerCell', () => {
    it('should compute units for day scale', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions());
      axis.setDate(dayjs('2026-07-01'), dayjs('2026-07-07'));
      expect(axis.getUnitsPerCell(axis.getBottomScale())).toBe(1);
    });

    it('should compute units for month (variable)', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions());
      axis.setDate(dayjs('2026-01-01'), dayjs('2026-01-31'));
      const monthScale = axis.getScales().find(s => s.unit === 'month');
      if (monthScale) {
        expect(axis.getUnitsPerCell(monthScale, dayjs('2026-01-15'))).toBe(31);
      }
    });
  });

  describe('getResolvedHeaderHeight / getLayerHeights', () => {
    it('should have default header height', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions());
      expect(axis.getResolvedHeaderHeight()).toBeGreaterThanOrEqual(40);
      expect(axis.getLayerHeights().length).toBe(2);
    });

    it('should expand header height when layers exceed', () => {
      const axis = new TimeAxis();
      axis.init(makeDefaultOptions({
        header: { height: 20, color: 'auto', fontSize: 14, fontWeight: 600, fontFamily: 'Arial' }
      }));
      expect(axis.getResolvedHeaderHeight()).toBeGreaterThanOrEqual(40);
    });
  });
});
