import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import IsoWeek from 'dayjs/plugin/isoWeek';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import Variables from '@/constants/vars';

/** ********************************** */
/** *** 下面方法全部使用 dayjs 实现 **** */
/** ********************************** */

// 添加周数
dayjs.extend(weekOfYear);
dayjs.extend(IsoWeek);

// 添加自定义格式化
dayjs.extend(advancedFormat);

export const day = dayjs;

/**
 * 获取对应单位的毫秒数
 * @param unit
 * @param date 所在月的日期，用于计算月份的时间
 * @returns
 */
export function getMillisecondBy(unit: HeaderDateUnit, date?: Date | number) {
  if (unit === 'month') {
    return dayjs(date).daysInMonth() * Variables.time.millisecondOf.day;
  }

  return Variables.time.millisecondOf[unit];
}

/**
 * 根据传入的单位，获取内部支持的基本单位
 */
export function baseUnit(unit: HeaderDateUnit) {
  switch (unit) {
    case 'hour':
      return 'hour';
    case 'day':
    case 'week':
    case 'month':
    default:
      return 'day';
  }
}
