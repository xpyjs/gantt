import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import IsoWeek from 'dayjs/plugin/isoWeek';

/** ********************************** */
/** *** 下面方法全部使用 dayjs 实现 **** */
/** ********************************** */

// 添加周数
dayjs.extend(weekOfYear);
dayjs.extend(IsoWeek);

export const day = dayjs;

// /**
//  * 获取两个日期间的所有日期列表
//  * @param startDate
//  * @param endDate
//  * @param format
//  */
// export function dateList(
//   startDate: string | number | Date | null,
//   endDate: string | number | Date | null,
//   unit: HeaderDateUnit
// ): HeaderDateOptions[] {
//   const r: Record<string, Array<{ len: number; text: string }>> = {};
//   const startTime = createDate(startDate).getTime();
//   const endTime = createDate(endDate).getTime();

//   for (let i = startTime; i <= endTime; ) {
//     const year = dayjs(i).year();
//     const month = `${dayjs(i).month() + 1}`.padStart(2, '0');
//     switch (unit) {
//       case 'week':
//         if (Object.hasOwn(r, `${year}-${month}`)) {
//           r[`${year}-${month}`].push({
//             text: getWeekStr(i),
//             len: 7
//           });
//         } else {
//           r[`${year}-${month}`] = [
//             {
//               text: getWeekStr(i),
//               len: i === startTime ? 7 - dayjs(i).day() : 7
//             }
//           ];
//         }

//         i +=
//           i === startTime
//             ? (7 - dayjs(i).day()) * Variables.time.millisecondOfDay
//             : Variables.time.millisecondOfWeek;
//         break;
//       case 'month':
//         if (Object.hasOwn(r, `${year}`)) {
//           r[`${year}`].push({
//             text: getMonthStr(i),
//             len: dayjs(i).daysInMonth()
//           });
//         } else {
//           r[`${year}`] = [
//             {
//               text: getMonthStr(i),
//               len:
//                 i === startTime
//                   ? dayjs(i).daysInMonth() - dayjs(i).date() + 1
//                   : dayjs(i).daysInMonth()
//             }
//           ];
//         }

//         i +=
//           i === startTime
//             ? (dayjs(i).daysInMonth() - dayjs(i).date() + 1) *
//               Variables.time.millisecondOfDay
//             : dayjs(i).daysInMonth() * Variables.time.millisecondOfDay;
//         break;
//       case 'day':
//       default:
//         if (Object.hasOwn(r, `${year}-${month}`)) {
//           r[`${year}-${month}`].push({
//             text: getDayStr(i),
//             len: 1
//           });
//         } else {
//           r[`${year}-${month}`] = [
//             {
//               text: getDayStr(i),
//               len: 1
//             }
//           ];
//         }

//         i += Variables.time.millisecondOfDay;
//     }
//   }

//   const res = [] as HeaderDateOptions[];
//   for (const key in r) {
//     res.push({ unit: key, one: r[key] });
//   }

//   return res;
// }

// type FormatKey = 'M+' | 'd+' | 'h+' | 'H+' | 'm+' | 's+' | 'q+' | 'S';
// export type LanguageKey = 'zh' | 'en';

// /**
//  * 格式化时间
//  * @param date 日期对象，或一个日期字符串，对其进行格式化
//  * @param fmt 格式文本，y:年，q:季度，M:月，d:日，D:星期，H:小时，m:分钟，s:秒，S:毫秒。例：`yyyy-MM-dd`
//  * @param lang 显示星期的文本，中文或者英文
//  * @return 格式化的内容
//  */
// export function formatDate(
//   date: Date | string | number,
//   fmt = 'yyyy-MM-dd',
//   lang: LanguageKey = 'zh'
// ) {
//   const WEEK = {
//     zh: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
//     en: [
//       'Sunday',
//       'Monday',
//       'Tuesday',
//       'Wednesday',
//       'Thursday',
//       'Friday',
//       'Saturday'
//     ]
//   };

//   if (!['zh', 'en'].includes(lang)) lang = 'zh';

//   date = createDate(date);

//   const o: Record<FormatKey, number> = {
//     'M+': date.getMonth() + 1, // 月份
//     'd+': date.getDate(), // 日
//     'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
//     'H+': date.getHours(), // 小时
//     'm+': date.getMinutes(), // 分
//     's+': date.getSeconds(), // 秒
//     'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
//     S: date.getMilliseconds() // 毫秒
//   };

//   let k: keyof Record<FormatKey, number>;
//   // eslint-disable-next-line no-restricted-syntax
//   for (k in o)
//     if (new RegExp(`(${k})`).test(fmt)) {
//       const v = o[k].toString();
//       fmt = fmt.replace(
//         RegExp.$1,
//         RegExp.$1.length === 1 ? v : `00${v}`.substr(`${v}`.length)
//       );
//     }

//   // 年份
//   if (/(y+)/.test(fmt))
//     fmt = fmt.replace(
//       RegExp.$1,
//       `${date.getFullYear()}`.substr(4 - RegExp.$1.length)
//     );
//   // 星期
//   if (/(D+)/.test(fmt)) {
//     fmt = fmt.replace(RegExp.$1, WEEK[lang][date.getDay()]);
//   }
//   return fmt;
// }
