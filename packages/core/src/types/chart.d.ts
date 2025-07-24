import { XGanttUnit } from "./options";

export interface IChartOptions {
  /**
   * 开始时间。强制设置开始时间，覆盖数据中的开始时间。
   *
   * @description 给定开始时间后，图表将使用该日期作为起始，而不是数据的起始时间
   */
  startTime?: Date | string;

  /**
   * 结束时间。强制设置结束时间，覆盖数据中的结束时间
   *
   * @description 给定结束时间后，图表将使用该日期作为结束，而不是数据的结束时间
   */
  endTime?: Date | string;

  /**
   * 自适应 cell 宽度。允许右侧部分基于当前宽度，自适应自定义的起止时间。
   *
   * 当起止日期区间过短，会自动撑满整个区域。当日期区间过长，会以 cellWidth 的值作为最小值，绘制整个区域
   *
   * @requires startTime 此功能需要自定义起止时间
   * @requires endTime 此功能需要自定义起止时间
   *
   * @description 此功能会导致 cellWidth 失效。所有 cell 会自动计算宽度
   */
  autoCellWidth: boolean;

  /**
   * 时间单元格宽度
   *
   * @description small | normal | large 会根据当前展示单位，自动计算宽度。或者直接给对象，指定具体每一个单位下 cell 的宽度值
   *
   * @description 如果同时给定了起止时间，则图表则只会渲染给定的时间区间，并且指定宽度将失效。（失效是指：如果给定时间区间范围小于可视范围，则会自动撑满宽度，此时每一格 cell 的宽度则会变为自动；如果时间区间范围大于可视范围，则继续按照当前设定宽度展示，超出部分可通过滚动条移动展示）
   */
  cellWidth:
    | number
    | "small"
    | "normal"
    | "large"
    | Partial<Record<XGanttUnit, number>>;

  /**
   * 表头组（上层）格式化
   *
   * @description 字符串：使用 dayjs 的格式化功能参数。支持 {@link https://day.js.org/docs/en/display/format|默认占位符}，以及所有 {@link https://day.js.org/docs/en/plugin/advanced-format|AdvancedFormat} 的占位符
   * @description 函数：可以根据当前日期和单位，返回自定义的格式化字符串。如果函数返回为空，则回退到默认格式化
   */
  headerGroupFormat?: string | ((date: Date, unit: XGanttUnit) => string);

  /**
   * 表头单元格格式化
   *
   * @description 字符串：使用 dayjs 的格式化功能参数。支持 {@link https://day.js.org/docs/en/display/format|默认占位符}，以及所有 {@link https://day.js.org/docs/en/plugin/advanced-format|AdvancedFormat} 的占位符
   * @description 函数：可以根据当前日期和单位，返回自定义的格式化字符串。如果函数返回为空，则回退到默认格式化
   */
  headerCellFormat?: string | ((date: Date, unit: XGanttUnit) => string);
}
