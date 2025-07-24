import dayjs from "dayjs";

import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import localeData from "dayjs/plugin/localeData";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjsUpdateLocale from "dayjs/plugin/updateLocale";
import isoWeek from "dayjs/plugin/isoWeek";
import Timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Logger } from "./logger";

export type { Dayjs } from "dayjs";

/**
 * 自动语言订阅插件
 */
const autoLocalePlugin = (o: any, c: any) => {
  const proto = c.prototype;

  proto.setLocale = function (str?: string) {
    this.$locale = str || dayjs().locale();
    this.$L = this.$locale;
    return this;
  };

  const originFormat = proto.format;
  proto.format = function (formatStr: any) {
    // 在格式化时自动应用当前语言
    this.$L = dayjs().locale();

    return originFormat.bind(this)(formatStr);
  };
};

// 加载插件
dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(weekOfYear);
dayjs.extend(localeData);
dayjs.extend(weekYear);
dayjs.extend(advancedFormat);
dayjs.extend(dayjsUpdateLocale);
dayjs.extend(isoWeek);
dayjs.extend(Timezone);
dayjs.extend(utc);
dayjs.extend(autoLocalePlugin);

export default dayjs;

// 文件顶部导入常用语言
import "dayjs/locale/en";
import "dayjs/locale/zh";

/**
 * 设置全局语言
 */
export function setLocale(locale: string): void {
  try {
    if (dayjs.locale() === locale) return;

    // 设置 dayjs 全局语言
    const l = dayjs.locale(locale);
    if (l !== locale) throw Error();
    Logger.info(`Locale set to ${locale}`);
  } catch (error) {
    Logger.warn(`Failed to set locale ${locale}, fallback to en`);
    dayjs.locale("en");
  }
}
