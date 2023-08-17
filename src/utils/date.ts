import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import IsoWeek from 'dayjs/plugin/isoWeek';
import localeData from 'dayjs/plugin/localeData';
import updateLocale from 'dayjs/plugin/updateLocale';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import weekday from 'dayjs/plugin/weekday';
import Variables from '@/constants/vars';
import './lang';

/** ********************************** */
/** *** 下面方法全部使用 dayjs 实现 **** */
/** ********************************** */

// 添加周数
dayjs.extend(weekOfYear);
dayjs.extend(IsoWeek);

// 添加自定义格式化
dayjs.extend(advancedFormat);

// 添加本地化
dayjs.extend(localeData);
dayjs.extend(updateLocale);
dayjs.extend(weekday);

export const day = dayjs;

let L = 'en';

export function setLocale(locale: string) {
  if (L === locale) return;

  L = locale;
  day.locale(locale);
}

/**
 * 更新本地化
 */
export function updateLocaleData() {
  dayjs.updateLocale(L, {
    weekStart: 1
  });
}

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
