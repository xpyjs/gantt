import { IPattern } from "./styles";

/**
 * 周末配置选项
 */
export interface IWeekendOpts {
  /**
   * 自定义周末日期。默认周六、周日为周末
   *
   * @description 0=周日, 1=周一, ..., 6=周六（dayjs.day() 语义）
   * @default [0, 6]（周六、周日）
   *
   * @example
   * // 周五、周六为周末
   * days: [5, 6]
   *
   * @example
   * // 没有周末
   * days: []
   */
  days?: number[];
  /**
   * 完全自定义周末的判定方法
   *
   * @description 优先级最高
   * @description 返回 true 表示这天是周末。没有被判定的日期可以置空
   */
  isWeekend?: (date: Date) => boolean | undefined;
}

/**
 * 节假日配置选项
 */
export interface IHolidayOpts {
  /**
   * 配置节假日期。可以针对不同节假日配置不同的背景颜色。默认使用统一配置颜色
   */
  holidays?: Array<
    {
      date: Date | number | string | Array<Date | number | string>;
      backgroundColor?: string;
      opacity?: number;
      /**
       * 自定义节假日期的文本
       */
      text?: {
        /** 是否显示文本 */
        show?: boolean;
        /** 文本内容 */
        content?: string;
        /** 文本颜色 */
        color?: string;
        /** 背景颜色 */
        backgroundColor?: string;
        /** 透明度 */
        opacity?: number;
        /** 文本字体大小 */
        fontSize?: number;
        /** 文本字体 */
        fontFamily?: string;
      }
    } & IPattern
  >;
  /**
   * 完全自定义节假日的判定方法
   *
   * @description 优先级高于 holidays 列表
   * @description 返回 true 表示这天是节假日。没有被判定的日期可以置空
   */
  isHoliday?: (date: Date) => boolean | undefined;
}

/**
 * 工时引擎配置选项
 */
export interface IWorkTimeOpts {
  /**
   * 计算日期周期时，是否跳过周末
   * @default false
   * @description 当置为 true 时，任务周期会自动跳过周末。此时可能 duration 时长与 startTime - endTime 长度不一致
   */
  skipWeekends?: boolean;
  /**
   * 计算日期周期时，是否跳过节假日
   * @default false
   * @description 当置为 true 时，任务周期会自动跳过节假日。此时可能 duration 时长与 startTime - endTime 长度不一致
   */
  skipHolidays?: boolean;

  /**
   * 完全自定义工作日的判定方法
   *
   * @description 优先级高于节假日和周末。如果将某个日期判定为工作日，那么它不会再被 holiday 与 weekend 捕获。
   * @returns 返回 true 表示这天是工作日。没有被判定的日期可以置空
   */
  isWorkTime?: (date: Date) => boolean | undefined;
}