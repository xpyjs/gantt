/**
 * 工作日引擎工具。提供周末、节假日的判定函数，以及工作日计算能力
 */

import dayjs, { type Dayjs } from '../utils/time';
import type { IHolidayOpts, IWeekendOpts, IWorkTimeOpts } from '../types/calendar';
import { isBoolean, round } from 'lodash-es';
import { Logger } from '../utils/logger';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * 工作日历统一管理类
 *
 * @description 统一管理所有日期属性。可以判定、计算工作日、节假日、周末等
 */
export class WorkCalendar {
  private weekendOpts?: IWeekendOpts;
  private holidayOpts?: IHolidayOpts;
  private workTimeOpts?: IWorkTimeOpts;

  constructor(
    weekendOpts?: IWeekendOpts,
    holidayOpts?: IHolidayOpts,
    workTimeOpts?: IWorkTimeOpts
  ) {
    this.weekendOpts = weekendOpts;
    this.holidayOpts = holidayOpts;
    this.workTimeOpts = workTimeOpts;
  }

  update(opts: {
    weekendOpts?: IWeekendOpts,
    holidayOpts?: IHolidayOpts,
    workTimeOpts?: IWorkTimeOpts
  }) {
    if (opts.weekendOpts) {
      this.weekendOpts = opts.weekendOpts;
    }

    if (opts.holidayOpts) {
      this.holidayOpts = opts.holidayOpts;
    }

    if (opts.workTimeOpts) {
      this.workTimeOpts = opts.workTimeOpts;
    }
  }

  /** 只有显式置条件判定为周末的，才会标记为周末。完整判定需要与其他方法共同完成 */
  private _isWeekend(date: Date | Dayjs): boolean {
    const d = dayjs(date);

    // 检查 isWeekend 钩子
    if (this.weekendOpts?.isWeekend) {
      const res = this.weekendOpts.isWeekend(d.toDate());
      if (res === true) return true;
    }

    // 检查 days
    const days = this.weekendOpts?.days || [0, 6];
    return days.includes(d.day());
  }

  /** 只有显式条件判定为节假日的，才会标记为节假日。完整判定需要与其他方法共同完成 */
  private _isHoliday(date: Date | Dayjs): boolean {
    const d = dayjs(date);

    // 检查 isHoliday 钩子
    if (this.holidayOpts?.isHoliday) {
      const res = this.holidayOpts.isHoliday(d.toDate());
      if (res === true) return true;
    }

    // 检查 holidays 列表
    if (!this.holidayOpts?.holidays || this.holidayOpts.holidays.length === 0) {
      return false;
    }

    return this.holidayOpts.holidays.some(h => {
      if (Array.isArray(h.date)) {
        return h.date.some(hd => dayjs(hd).isSame(d, 'day'));
      }
      return dayjs(h.date).isSame(d, 'day');
    });
  }

  /** 只做特殊日期的标记，对于普通未标记的日期返回 undefined。完整判定需要与其他方法共同完成 */
  private _isWorkTime(date: Date | Dayjs): boolean | undefined {
    const d = dayjs(date);

    // 检查 isWorkTime 钩子
    if (this.workTimeOpts?.isWorkTime) {
      return this.workTimeOpts.isWorkTime(d.toDate());
    }
  }

  /**
   * 判断日期是否为工作时间
   *
   * @description 优先级：isWorkTime 钩子 > 节假日 > 周末
   */
  isWorkTime(date: Date | Dayjs): boolean {
    if (this.workTimeOpts?.isWorkTime) {
      const r = this._isWorkTime(date);
      if (isBoolean(r)) return r;
    }

    if (this.workTimeOpts?.skipHolidays && this._isHoliday(date)) {
      return false;
    }

    if (this.workTimeOpts?.skipWeekends && this._isWeekend(date)) {
      return false;
    }

    return true;
  }

  /**
   * 判断日期是否为周末
   *
   * @description 判定优先级: isWeekend 钩子 > days > 默认 [0, 6]
   */
  isWeekend(date: Date | Dayjs, skipHoliday = false): boolean {
    // 检查 isWorkTime 钩子。如果是工作日，则优先级最高
    if (this.workTimeOpts?.isWorkTime) {
      if (this._isWorkTime(date)) return false;
    }

    if ((skipHoliday || this.holidayOpts?.show) && this._isHoliday(date)) return false;
    return this._isWeekend(date);
  }

  /**
   * 判断日期是否为节假日
   *
   * @description 判定优先级: isHoliday 钩子 > holidays 列表
   */
  isHoliday(date: Date | Dayjs): boolean {
    // 检查 isWorkTime 钩子。如果是工作日，则优先级最高
    if (this.workTimeOpts?.isWorkTime) {
      if (this._isWorkTime(date)) return false;
    }
    return this._isHoliday(date);
  }

  /**
   * 基于一个日期，获取指定时长后的工作日期
   *
   * @param start - 起始日期
   * @param n - 工作日时长（正数向后，负数向前，可为分数）
   * @returns 目标日期
   */
  workOffset(start: Date | Dayjs, n: number): Dayjs {
    const step = n >= 0 ? 1 : -1;
    const absN = Math.abs(n);
    const intPart = Math.floor(absN);
    const fracPart = absN - intPart;

    let d = dayjs(start);
    for (let i = 1; i <= intPart; i++) {
      d = d.add(step, 'day'); // 向后或向前
      if (!this.isWorkTime(d)) {
        i--;
      }
    }

    return d.add(fracPart * MS_PER_DAY * step, 'millisecond');
  }

  /**
   * 基于两个日期，计算之间的工作日时长
   *
   * @param start - 起始日期
   * @param end - 结束日期
   */
  workDiff(start: Date | Dayjs, end: Date | Dayjs): number {
    let st = dayjs(start);
    let et = dayjs(end);

    if (st.isSameOrAfter(et)) [st, et] = [et, st];

    const count = this.restDays(st, et);

    // 使用两个日期的详细 diff 差值，减去非工作日天数，得到详细的工作时长
    return Math.max(round(et.diff(st) / MS_PER_DAY - count, 4), 1);
  }

  /**
   * 基于两个日期，计算其中包含的非工作天数
   */
  restDays(start: Date | Dayjs, end: Date | Dayjs): number {
    let st = dayjs(start);
    let et = dayjs(end);

    if (st.isSameOrAfter(et)) [st, et] = [et, st];

    let day = st.clone();
    let count = 0; // 非工作日天数
    while (day.isBefore(et)) {
      if (!this.isWorkTime(day)) {
        count++;
      }
      day = day.add(1, 'day');
    }

    return count;
  }

  /**
   * 基于某个日期获取最近的工作日(默认向后)
   */
  currentWorkTime(date: Date | Dayjs, direction: 'after' | 'before' = 'after'): Dayjs {
    const d = dayjs(date);
    if (this.isWorkTime(d)) return d;

    const MAX_DAYS = 365; // 最大搜索天数，防止无限循环

    if (direction === 'after') {
      for (let i = 1; i <= MAX_DAYS; i++) {
        const next = d.add(i, 'day');
        if (this.isWorkTime(next)) {
          // return next.set('hour', d.hour())
          //   .set('minute', d.minute())
          //   .set('second', d.second())
          //   .set('millisecond', d.millisecond());
          return next;
        }
      }
    } else {
      for (let i = 1; i <= MAX_DAYS; i++) {
        const prev = d.subtract(i, 'day');
        if (this.isWorkTime(prev)) {
          // return prev.set('hour', d.hour())
          //   .set('minute', d.minute())
          //   .set('second', d.second())
          //   .set('millisecond', d.millisecond());
          return prev;
        }
      }
    }

    Logger.error(`Unable to find a workday within ${MAX_DAYS} days from ${d.format('YYYY-MM-DD')}`);

    return d;
  }
}
