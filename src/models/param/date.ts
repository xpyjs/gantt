import { day, formatDate } from '@/utils/date';

enum DateEnum {
  'year',
  'month',
  'week',
  'day',
  'hour',
  'minute',
  'second',
  'millisecond'
}

/**
 * 内部使用的日期对象，所有日期都是用该对象包装
 */
export class XDate {
  date: Date;

  constructor(date?: Date | number | string) {
    this.date = day(date).toDate();
  }

  /**
   * 设置一个新日期
   */
  setDate(date: Date) {
    this.date = day(date).toDate();
  }

  /**
   * 获取日期的周数文本
   */
  toWeek() {
    return `第 ${day(this.date).week()} 周`;
  }

  /**
   * 获取日期的月份文本
   */
  toMonth() {
    return formatDate(this.date, 'yyyy-MM');
  }

  /**
   * 获取日期在当月的具体日期的文本
   */
  toDate() {
    return day(this.date).date().toString();
  }

  /**
   * 获取两个时间的间隔时间戳
   */
  intervalTo(date?: XDate) {
    return this.date.getTime() - (date?.date.getTime() ?? 0);
  }

  /**
   * 比较大小，返回字符，l 左小，r 右小，e 相等
   */
  compareTo(date: XDate) {
    const l = this.date.getTime();
    const r = date.date.getTime();
    if (l < r) return 'l';
    if (l > r) return 'r';
    return 'e';
  }

  /**
   * 比较日期大小。
   * @param date 要比较的日期
   * @param precision 精度，可以通过不同单位来调整判断精度
   */
  isSame(date: XDate, precision: DateUnit) {
    const t = this.date.toLocaleString().split(/\s|\/|:/);
    t.splice(2, 0, day(this.date).week().toString());
    t.push(this.date.getMilliseconds().toString());

    const d = date.date.toLocaleString().split(/\s|\/|:/);
    d.splice(2, 0, day(date.date).week().toString());
    d.push(date.date.getMilliseconds().toString());

    return (
      t.slice(0, DateEnum[precision] + 1).join('') ===
      d.slice(0, DateEnum[precision] + 1).join('')
    );
  }

  /**
   * 获取一个位移后的日期对象。该对象不会影响原始对象。
   */
  getOffset(offset: number) {
    return new XDate(day(this.date.getTime() + offset).toDate());
  }

  /**
   * 通过不同单位获取当前时间的不同精度值
   */
  getBy(unit: DateUnit) {
    const t = this.date.toLocaleString().split(/\s|\/|:/);
    t.splice(2, 0, day(this.date).week().toString());
    t.push(this.date.getMilliseconds().toString());

    return parseInt(t[DateEnum[unit]]);
  }

  /**
   * 返回一个可格式化的日期字符串
   */
  toString(format: string = 'YYYY-MM-DD') {
    return day(this.date).format(format);
  }

  /**
   * 返回一个全新的日期对象
   */
  clone() {
    return new XDate(this.date);
  }

  /**
   * 该日期是否为周末
   * @returns
   */
  isWeekend() {
    const d = day(this.date).day();
    return d === 6 || d === 0;
  }

  /**
   * 将日期置为当日最开始（0点0分0秒）
   */
  startOf() {
    this.date.setHours(0);
    this.date.setMinutes(0);
    this.date.setSeconds(0);
    this.date.setMilliseconds(0);
  }
}
