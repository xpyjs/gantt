import { Variables } from "@/constants/vars";
import { HeaderDateOptions, HeaderDateUnit } from "@/typings/ParamOptions";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { isDate } from "./is";

/**
 * 判断给定的日期是否有效
 * @param date 日期
 */
export function isValidDate(date: number | Date | string) {
  return isDate(date) || typeof date === "number"
    ? true
    : isNaN(Date.parse(date as string)) === false;
}

/**
 * 获取两个时间的间隔时间戳
 * @param startDate 起始日期
 * @param endDate 截止日期
 */
export function getDateInterval(
  startDate: string | number | Date,
  endDate: string | number | Date
) {
  return createDate(endDate).getTime() - createDate(startDate).getTime();
}

/**
 * 比较大小，返回字符，l 左小，r 右小，e 相等
 * @param date1 左日期
 * @param date2 右日期
 */
export function compareDate(
  date1: string | number | Date,
  date2: string | number | Date
) {
  const l = createDate(date1).getTime();
  const r = createDate(date2).getTime();
  if (l < r) return "l";
  else if (l > r) return "r";
  else return "e";
}

/**
 * 计算日期偏移值，给定一个偏移值，返回新日期的时间戳
 * @param  date 日期
 * @param offset 日期偏移值的时间戳
 */
export function getDateOffset(date: string | number | Date, offset: number) {
  const currentTime = createDate(date).getTime() + offset;
  return createDate(currentTime).getTime();
}

/**
 * 判断两个日期是否相等
 * @param date1
 * @param date2
 */
export function sameDate(
  date1: string | number | Date,
  date2: string | number | Date
) {
  const d1 = createDate(date1);
  const d2 = createDate(date2);
  if (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
    return true;
  return false;
}

/**
 * 检测给出了内容是否可以转成一个日期对象，如果可以，返回日期对象，如果不能，返回null
 * @param date
 */
export function checkDate(date: string | number | Date): Date | null {
  if (typeof date === "string" || typeof date === "number") {
    try {
      date = createDate(date);
    } catch (error) {
      return null;
    }
  }
  return date;
}

type FormatKey = "M+" | "d+" | "h+" | "H+" | "m+" | "s+" | "q+" | "S";
export type LanguageKey = "zh" | "en";

/**
 * 格式化时间
 * @param date 日期对象，或一个日期字符串，对其进行格式化
 * @param fmt 格式文本，y:年，q:季度，M:月，d:日，D:星期，H:小时，m:分钟，s:秒，S:毫秒。例：`yyyy-MM-dd`
 * @param lang 显示星期的文本，中文或者英文
 * @return 格式化的内容
 */
export function formatDate(
  date: Date | string | number,
  fmt = "yyyy-MM-dd",
  lang: LanguageKey = "zh"
) {
  const WEEK = {
    zh: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    en: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ]
  };

  if (["zh", "en"].indexOf(lang) === -1) lang = "zh";

  date = createDate(date);

  const o: Record<FormatKey, number> = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, //小时
    "H+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds() //毫秒
  };

  let k: keyof Record<FormatKey, number>;
  for (k in o)
    if (new RegExp("(" + k + ")").test(fmt)) {
      const v = o[k].toString();
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? v : ("00" + v).substr(("" + v).length)
      );
    }

  // 年份
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  // 星期
  if (/(D+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, WEEK[lang][date.getDay()]);
  }
  return fmt;
}

export function getMillisecond(unit: HeaderDateUnit) {
  switch (unit) {
    case "week":
    case "month":
    case "day":
    default:
      return Variables.time.millisecondOfDay;
  }
}

// TODO: 上面的方法有时间改成 dayjs 的
/*************************************/
/***** 下面方法全部使用 dayjs 实现 *****/
/*************************************/

// 添加周数
dayjs.extend(weekOfYear);

/**
 * 创建日期的工厂函数，生成一个指定日期，如果无效，返回当日日期
 * @param date 日期
 */
export function createDate(date?: string | number | Date | null): Date {
  return dayjs(date).toDate();
}

/**
 * 获取两个日期间的所有日期列表
 * @param startDate
 * @param endDate
 * @param format
 */
export function dateList(
  startDate: string | number | Date,
  endDate: string | number | Date,
  unit: HeaderDateUnit
): HeaderDateOptions[] {
  const r = {} as { [key: string]: { len: number; text: string }[] };
  const startTime = createDate(startDate).getTime();
  const endTime = createDate(endDate).getTime();

  for (let i = startTime; i <= endTime; ) {
    const year = dayjs(i).year();
    const month = dayjs(i).month() + 1;
    console.log(dayjs(i).daysInMonth());
    switch (unit) {
      case "week":
        if (r[`${year}-${month}`]) {
          r[`${year}-${month}`].push({
            text: `第 ${dayjs(i).week()} 周`,
            len: 7
          });
        } else {
          r[`${year}-${month}`] = [
            {
              text: `第 ${dayjs(i).week()} 周`,
              len: 7
            }
          ];
        }

        i += Variables.time.millisecondOfWeek;
        break;
      case "month":
        if (r[`${year}`]) {
          r[`${year}`].push({
            text: `${month} 月`,
            len: dayjs(i).daysInMonth()
          });
        } else {
          r[`${year}`] = [
            {
              text: `${month} 月`,
              len: dayjs(i).daysInMonth()
            }
          ];
        }

        i += dayjs(i).daysInMonth() * Variables.time.millisecondOfDay;
        break;
      case "day":
      default:
        if (r[`${year}-${month}`]) {
          r[`${year}-${month}`].push({
            text: dayjs(i).date().toString(),
            len: 1
          });
        } else {
          r[`${year}-${month}`] = [
            {
              text: dayjs(i).date().toString(),
              len: 1
            }
          ];
        }

        i += Variables.time.millisecondOfDay;
    }
  }

  const res = [] as HeaderDateOptions[];
  for (const key in r) {
    res.push({ unit: key, one: r[key] });
  }

  return res;
}
