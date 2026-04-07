/*
 * @Author: JeremyJone
 * @Date: 2025-04-18 10:57:49
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-09-05 17:50:04
 * @Description: 时间轴管理
 */

import { cloneDeep, isFunction, isNumber, isObject, isString } from "lodash-es";
import dayjs, { type Dayjs } from "../utils/time";
import { Logger } from "../utils/logger";
import { DurationUnit, IGanttOptions, IScaleConfigBase, IScaleConfigBottom, XGanttUnit } from "@/types/options";

/** 内部标准化后的 scale 配置 */
export interface ParsedScale {
  unit: DurationUnit;
  step: number;
  format?: string | ((date: Date, unit: DurationUnit, step: number) => string);
  cellWidth?: number;
  height?: number;
}

/** 时间线单元格项 */
export interface TimelineCellItem {
  /** 时间对象 */
  date: Dayjs;
  /** 展示的文本 */
  label: string;
  /** 跨越多少个最小渲染单位 */
  span: number;
  /** 是否隐藏 */
  hide?: boolean;
}

/** 时间线层 */
export interface TimelineLayer {
  scale: ParsedScale;
  items: TimelineCellItem[];
}

/** 表头项（旧接口，保持兼容） */
export interface TimelineItem {
  /** 时间对象 */
  date: Dayjs;
  /** 展示的文本，支持自定义 */
  label: string;
  /** 子项内容 */
  children?: TimelineItem[];
  /** 是否隐藏 */
  hide?: boolean;
}

/****** 说明 ******/
/*
/* 所有 cell 宽度均以最大单位（天）计算，只有当单位为 hour 时，才会以 hour 为准。
/* 这样做是为了展示周末以及节假日。同时细粒度的展示，可以控制拖动效果。
/*
/* 但是背景网格线，应当以当前单位作为基准绘制
/*
/*****************/

const DEFAULT_CELL_WIDTH: () => Record<
  "small" | "normal" | "large",
  Record<XGanttUnit, number>
> = () => ({
  small: {
    hour: 15,
    day: 15,
    week: 5,
    month: 3,
    quarter: 3
  },
  normal: {
    hour: 30,
    day: 30,
    week: 10,
    month: 7,
    quarter: 7
  },
  large: {
    hour: 60,
    day: 60,
    week: 20,
    month: 14,
    quarter: 14
  }
});

export class TimeAxis {
  private startTime = dayjs().startOf("day");
  private endTime = dayjs().endOf("day");
  /** 结束的标准时间。切换单位会影响结尾的扩展，需要单独记录一个标准时间 */
  private targetEnd = dayjs().endOf("day");
  /** 固定起始日期 */
  private strictStart = false;
  /** 固定截止日期 */
  private strictEnd = false;
  /** 是否自适应宽度 */
  private isAuto = false;

  /** N 层时间线缓存 */
  private timelineLayers: TimelineLayer[] = [];
  private isDirty: boolean = true;
  /** 是否第一次赋值，如果第一次赋值，允许全部赋值 */
  private isFirstTime = true;

  /** 总宽度 */
  private allWidth: number = 0;

  /** 内部标准化后的 scales */
  private scales: ParsedScale[] = [];

  /** 是否旧模式（未使用 scaleUnit） */
  private isLegacyMode: boolean = true;

  /** 旧模式下的 cellWidth 映射 */
  private legacyCellWidthMap: Record<XGanttUnit, number>;

  /** 新模式下的 cellWidth（px/最小渲染单位） */
  private _resolvedCellWidth: number = 30;

  /** 各层解析后的行高（px） */
  private _resolvedLayerHeights: number[] = [];

  /** 解析后的实际 header 高度（可能因 scaleUnit.height 溢出而扩展） */
  private _resolvedHeaderHeight: number = 80;

  /** 旧模式记录的 unit */
  private unit: XGanttUnit = "day";

  /** 旧模式的 headerGroupFormat / headerCellFormat */
  private headerGroupFormat?:
    | string
    | ((date: Date, unit: XGanttUnit) => string);
  private headerCellFormat?:
    | string
    | ((date: Date, unit: XGanttUnit) => string);

  constructor() {
    this.legacyCellWidthMap = cloneDeep(DEFAULT_CELL_WIDTH().normal);
  }

  public getStartTime() {
    return this.startTime;
  }
  public getEndTime() {
    return this.endTime;
  }

  /** 获取每个最小渲染单位的像素宽度（语义不变） */
  public getCellWidth() {
    const width = this.isLegacyMode
      ? this.legacyCellWidthMap[this.unit]
      : this._resolvedCellWidth;

    if (this.isAuto) {
      const r = this.allWidth / this.getCellCount();
      return Math.max(isNaN(r) ? 0 : r, width);
    }

    return width;
  }

  /** 获取底层 timeline 的总 cell 数 */
  public getCellCount() {
    const layers = this.getTimeline();
    if (layers.length === 0) return 0;
    const bottomLayer = layers[layers.length - 1];
    return bottomLayer.items.length;
  }

  /** 获取最小渲染单位 */
  public getCellUnit(): "hour" | "day" {
    return this.getMinimumUnit();
  }

  /** 获取内部标准化后的 scales */
  public getScales(): ParsedScale[] {
    return this.scales;
  }

  /** 获取底层 scale */
  public getBottomScale(): ParsedScale {
    return this.scales[this.scales.length - 1];
  }

  /** 获取各层解析后的行高（px） */
  public getLayerHeights(): number[] {
    return this._resolvedLayerHeights;
  }

  /** 获取解析后的实际 header 高度 */
  public getResolvedHeaderHeight(): number {
    return this._resolvedHeaderHeight;
  }

  /**
   * 获取底层一格的像素宽度
   * 用于 ChartHeader/Grid 绘制底层 cell 的宽度
   */
  public getBottomCellWidth(date?: Dayjs): number {
    const bottomScale = this.getBottomScale();
    return this.getUnitsPerCell(bottomScale, date) * this.getCellWidth();
  }

  public setAllWidth(width: number) {
    this.allWidth = width;

    if (!this.strictEnd) {
      // 如果是自动起止时间，需要自动补全
      const cellWidth = this.getCellWidth();
      const count = this.targetEnd.diff(this.startTime, this.getMinimumUnit());
      if (cellWidth * count < this.allWidth) {
        // 长度不足，需要补足
        const distance = this.allWidth - cellWidth * count;
        const diffCount = Math.ceil(distance / cellWidth);
        this.endTime = this.targetEnd.add(diffCount, this.getMinimumUnit());
        this.invalidateCache();
      }
    }
  }

  public getTimeLeft(time: Dayjs) {
    const cellWidth = this.getCellWidth();
    const unit = this.getMinimumUnit();
    const timePrePixel = (60 * 60 * (unit === "day" ? 24 : 1)) / cellWidth;
    const diff = time.diff(this.startTime, "second");
    return diff / timePrePixel;
  }

  /**
   * 根据横向位置计算对应的时间
   * @param left 横向位置
   * @returns 对应的时间对象
   */
  public getTimeByLeft(left: number): Dayjs {
    const cellWidth = this.getCellWidth();
    const unit = this.getMinimumUnit();
    const timePrePixel = (60 * 60 * (unit === "day" ? 24 : 1)) / cellWidth;

    // 计算与起始时间的秒数差异
    const diffSeconds = left * timePrePixel;

    // 返回对应的时间点
    return this.startTime.add(diffSeconds, "second");
  }

  public init(options: IGanttOptions, isFirstTime = true): void {
    this.isDirty = true;
    this.isFirstTime = isFirstTime;

    const { unit, chart, scaleUnit } = options;
    this.isAuto = !!chart.autoCellWidth;

    // 解析 scaleUnit 或旧 unit
    if (scaleUnit && scaleUnit.length > 0) {
      // 新模式：使用 scaleUnit
      this.isLegacyMode = false;
      this.scales = scaleUnit.map(s => ({
        unit: s.unit,
        step: s.step ?? 1,
        format: s.format,
        cellWidth: s.cellWidth,
        height: s.height
      }));

      // 解析 cellWidth
      const bottomScale = this.scales[this.scales.length - 1];
      if (bottomScale.cellWidth) {
        // 底层 scale 指定了 cellWidth，反推每最小渲染单位的宽度
        const unitsPerCell = this.getUnitsPerCell(bottomScale);
        this._resolvedCellWidth = unitsPerCell > 0
          ? bottomScale.cellWidth / unitsPerCell
          : 30;
      } else {
        // 从外层 chart.cellWidth 按最小渲染单位取值
        this._resolvedCellWidth = this.resolveCellWidthFromChart(chart);
      }

      // 解析各层行高
      this.resolveLayerHeights(options.header.height);
    } else {
      // 旧模式
      this.isLegacyMode = true;

      const _u = (
        {
          hour: "hour",
          day: "day",
          week: "week",
          month: "month",
          quarter: "quarter"
        } as const
      )[unit];

      if (!_u) {
        Logger.warn(`Unknown unit: [${unit}]. Falling back to "day".`);
      }

      this.unit = _u || "day";

      // 旧 unit → 内部 scales 自动转换
      this.scales = this.legacyUnitToScales(this.unit);

      // 旧模式 cellWidth 处理
      if (chart.cellWidth) {
        if (isNumber(chart.cellWidth)) {
          this.legacyCellWidthMap = {
            hour: chart.cellWidth,
            day: chart.cellWidth,
            week: chart.cellWidth,
            month: chart.cellWidth,
            quarter: chart.cellWidth
          };
        } else if (isString(chart.cellWidth)) {
          this.legacyCellWidthMap = cloneDeep(
            DEFAULT_CELL_WIDTH()[chart.cellWidth] || DEFAULT_CELL_WIDTH().normal
          );
        } else if (isObject(chart.cellWidth)) {
          this.legacyCellWidthMap = Object.assign(
            this.legacyCellWidthMap,
            chart.cellWidth
          );
        }
      }

      this.headerCellFormat = chart.headerCellFormat;
      this.headerGroupFormat = chart.headerGroupFormat;

      // 旧模式：两层均分
      this.resolveLayerHeights(options.header.height);
    }

    if (chart.startTime) {
      this.startTime = dayjs(chart.startTime).startOf(this.getMinimumUnit());
      this.strictStart = true;
    }

    if (chart.endTime) {
      this.endTime = dayjs(chart.endTime).endOf(this.getMinimumUnit());
      this.strictEnd = true;
    }
  }

  public update(options: IGanttOptions): void {
    this.init(options, false);

    this.endTime = this.targetEnd.clone();
  }

  public setDate(start?: Dayjs, end?: Dayjs) {
    if (!this.strictStart) {
      if (start) {
        if (this.isFirstTime || start.isBefore(this.startTime)) {
          this.startTime = start.startOf(this.getMinimumUnit());
        }
      }
    }

    if (!this.strictEnd) {
      if (end) {
        if (this.isFirstTime || end.isAfter(this.endTime)) {
          this.endTime = end.endOf(this.getMinimumUnit());
        }
      }
    }

    // 只有在 endTime 赋标准值时记录
    this.targetEnd = this.endTime.clone();

    this.isFirstTime = false;
    this.invalidateCache();
  }

  /** 获取 N 层时间线数据 */
  public getTimeline(): TimelineLayer[] {
    // 如果缓存有效，直接返回
    if (!this.isDirty && this.timelineLayers.length > 0) {
      return this.timelineLayers;
    }

    const layers: TimelineLayer[] = [];

    for (let levelIdx = 0; levelIdx < this.scales.length; levelIdx++) {
      const scale = this.scales[levelIdx];
      const items: TimelineCellItem[] = [];
      let cursor = this.startTime.clone();

      // 对齐到当前 scale 的 unit 起始
      cursor = this.alignToScaleStart(cursor, scale);

      while (cursor.isSameOrBefore(this.endTime, this.getMinimumUnit())) {
        const cellEnd = this.advanceCursor(cursor, scale);
        const span = this.calculateSpan(cursor, cellEnd);
        const label = this.formatLabel(
          cursor,
          scale,
          levelIdx === 0 && this.scales.length === 1
        );

        if (span > 0) {
          items.push({ date: cursor, label, span });
        }

        cursor = cellEnd;
      }

      layers.push({ scale, items });
    }

    this.isDirty = false;
    this.timelineLayers = layers;
    return layers;
  }

  public clear() {
    this.isDirty = true;
    this.isFirstTime = true;
  }

  /**
   * 获取时间轴的总宽度
   * @returns 时间轴总宽度（像素）
   */
  public getTotalWidth(): number {
    const layers = this.getTimeline();
    if (layers.length === 0) return 0;
    const bottomLayer = layers[layers.length - 1];
    return bottomLayer.items.reduce(
      (acc, item) => acc + item.span * this.getCellWidth(),
      0
    );
  }

  public expand(type: "left" | "right" | "all", count: number = 1): void {
    if (type === "left") {
      this.startTime = this.startTime.subtract(count, this.getMinimumUnit());
    } else if (type === "right") {
      this.endTime = this.endTime.add(count, this.getMinimumUnit());
    } else if (type === "all") {
      this.startTime = this.startTime.subtract(count, this.getMinimumUnit());
      this.endTime = this.endTime.add(count, this.getMinimumUnit());
    }

    // 只有在 endTime 赋标准值时记录
    this.targetEnd = this.endTime.clone();

    this.invalidateCache();
  }

  /**
   * 判定一个时间是否在时间轴上
   * @param time 时间
   * @returns 是否在时间轴上
   */
  public isInTimeAxis(time: Dayjs): boolean {
    return (
      time.isSameOrAfter(this.startTime) && time.isSameOrBefore(this.endTime)
    );
  }

  // ========== 新增公共方法 ==========

  /**
   * 计算一个 scale cell 包含多少个最小渲染单位
   * @param scale scale 配置
   * @param date 日期（用于月/季度等变长单位）
   */
  public getUnitsPerCell(scale: ParsedScale, date?: Dayjs): number {
    const minUnit = this.getMinimumUnit();

    if (minUnit === "hour") {
      switch (scale.unit) {
        case "minute":
          return scale.step / 60;
        case "hour":
          return scale.step;
        case "day":
          return scale.step * 24;
        case "week":
          return scale.step * 7 * 24;
        case "month": {
          const days = date ? date.daysInMonth() : 30;
          return days * scale.step * 24;
        }
        case "quarter": {
          const qDays = this.getQuarterDays(date);
          return qDays * scale.step * 24;
        }
        case "year": {
          const yDays = date?.isLeapYear() ? 366 : 365;
          return yDays * scale.step * 24;
        }
        default:
          return scale.step;
      }
    } else {
      // minUnit === 'day'
      switch (scale.unit) {
        case "minute":
        case "hour":
          // 不应出现，因为有 hour/minute 时 minUnit 应该是 hour
          return scale.step;
        case "day":
          return scale.step;
        case "week":
          return scale.step * 7;
        case "month": {
          const days = date ? date.daysInMonth() : 30;
          return days * scale.step;
        }
        case "quarter": {
          const qDays = this.getQuarterDays(date);
          return qDays * scale.step;
        }
        case "year": {
          const yDays = date?.isLeapYear() ? 366 : 365;
          return yDays * scale.step;
        }
        default:
          return scale.step;
      }
    }
  }

  // ========== 私有方法 ==========

  /** 缓存失效标记 */
  private invalidateCache(): void {
    this.isDirty = true;
  }

  /** 获取最小渲染单位：scales 中含 hour/minute → 'hour'，否则 → 'day' */
  private getMinimumUnit(): "hour" | "day" {
    for (const scale of this.scales) {
      if (scale.unit === "hour" || scale.unit === "minute") {
        return "hour";
      }
    }
    return "day";
  }

  /** 旧 unit → 内部 scales 自动转换 */
  private legacyUnitToScales(unit: XGanttUnit): ParsedScale[] {
    // 旧 headerGroupFormat / headerCellFormat 类型签名为
    // (date: Date, unit: XGanttUnit) => string，需要 cast 为 ParsedScale["format"]
    const gf = this.headerGroupFormat as ParsedScale["format"];
    const cf = this.headerCellFormat as ParsedScale["format"];

    switch (unit) {
      case "hour":
        return [
          { unit: "day", step: 1, format: gf },
          { unit: "hour", step: 1, format: cf }
        ];
      case "day":
        return [
          { unit: "month", step: 1, format: gf },
          { unit: "day", step: 1, format: cf }
        ];
      case "week":
        return [
          { unit: "month", step: 1, format: gf },
          { unit: "week", step: 1, format: cf }
        ];
      case "month":
        return [
          { unit: "year", step: 1, format: gf },
          { unit: "month", step: 1, format: cf }
        ];
      case "quarter":
        return [
          { unit: "year", step: 1, format: gf },
          { unit: "quarter", step: 1, format: cf }
        ];
      default:
        return [
          { unit: "month", step: 1 },
          { unit: "day", step: 1 }
        ];
    }
  }

  /** 每层最小行高 */
  private static readonly MIN_SCALE_ROW_HEIGHT = 20;

  /**
   * 解析各层行高。
   *
   * 规则：
   * - 未指定 height 的层平分剩余空间
   * - 指定的 height < MIN_SCALE_ROW_HEIGHT 时钳位
   * - 所有指定层的 height 之和超过 headerHeight 时，自动扩展 headerHeight
   * - 所有层均指定 height 且总和 < headerHeight 时，上对齐，底部留空白
   */
  private resolveLayerHeights(headerHeight: number): void {
    const layerCount = this.scales.length;
    if (layerCount === 0) {
      this._resolvedLayerHeights = [];
      this._resolvedHeaderHeight = headerHeight;
      return;
    }

    const MIN_H = TimeAxis.MIN_SCALE_ROW_HEIGHT;
    const heights: number[] = new Array(layerCount).fill(0);
    const isSet: boolean[] = new Array(layerCount).fill(false);

    // 第一步：收集已指定高度的层，并钳位
    let fixedSum = 0;
    let unsetCount = 0;
    for (let i = 0; i < layerCount; i++) {
      const h = this.scales[i].height;
      if (h != null) {
        heights[i] = Math.max(Math.floor(h), MIN_H);
        fixedSum += heights[i];
        isSet[i] = true;
      } else {
        unsetCount++;
      }
    }

    // 第二步：计算未指定层的空间
    if (unsetCount > 0) {
      const remaining = headerHeight - fixedSum;
      const perUnset = Math.floor(remaining / unsetCount);

      if (perUnset >= MIN_H) {
        // 剩余空间够用，平分
        let distributed = 0;
        let assignedCount = 0;
        for (let i = 0; i < layerCount; i++) {
          if (!isSet[i]) {
            assignedCount++;
            // 最后一个未指定层吃掉余数
            heights[i] = assignedCount === unsetCount
              ? remaining - distributed
              : perUnset;
            distributed += heights[i];
          }
        }
      } else {
        // 剩余空间不够，每个未指定层给最小值
        for (let i = 0; i < layerCount; i++) {
          if (!isSet[i]) {
            heights[i] = MIN_H;
          }
        }
      }
    }

    // 第三步：计算实际 headerHeight
    const totalLayerHeight = heights.reduce((sum, h) => sum + h, 0);
    // 如果总和超过 headerHeight，扩展；如果小于，保持（上对齐，底部留空白）
    this._resolvedHeaderHeight = Math.max(headerHeight, totalLayerHeight);
    this._resolvedLayerHeights = heights;
  }

  /** 从 chart.cellWidth 解析新模式下的 cellWidth 值 */
  private resolveCellWidthFromChart(chart: IGanttOptions["chart"]): number {
    const minUnit = this.getMinimumUnit();
    const key = minUnit === "hour" ? "hour" : "day";

    if (!chart.cellWidth) {
      return DEFAULT_CELL_WIDTH().normal[key];
    }

    if (isNumber(chart.cellWidth)) {
      return chart.cellWidth;
    }

    if (isString(chart.cellWidth)) {
      const preset = DEFAULT_CELL_WIDTH()[chart.cellWidth];
      return preset ? preset[key] : DEFAULT_CELL_WIDTH().normal[key];
    }

    if (isObject(chart.cellWidth)) {
      return (chart.cellWidth as Record<string, number>)[key] ?? DEFAULT_CELL_WIDTH().normal[key];
    }

    return DEFAULT_CELL_WIDTH().normal[key];
  }

  /**
   * 将 cursor 对齐到 scale 的自然步进边界。
   *
   * step=1 时，直接 startOf(unit)。
   * step>1 时，以"父周期"为锚点，向前找到最近的 step 整数倍边界。
   * 例如 { unit:"hour", step:8 } → 一天内的自然边界为 0:00 / 8:00 / 16:00，
   * cursor=15:00 时对齐到 8:00，首格 8:00→16:00 会被 calculateSpan 裁剪为
   * startTime→16:00 的不完整格，后续格保持不变。
   */
  private alignToScaleStart(cursor: Dayjs, scale: ParsedScale): Dayjs {
    if (scale.step <= 1) {
      // step=1: 直接对齐到单位起始
      if (scale.unit === "quarter") {
        return (cursor as any).startOf("quarter");
      }
      return cursor.startOf(scale.unit as dayjs.OpUnitType);
    }

    // step > 1: 对齐到自然步进边界
    switch (scale.unit) {
      case "minute": {
        const startOfHour = cursor.startOf("hour");
        const offset = cursor.minute();
        return startOfHour.add(
          Math.floor(offset / scale.step) * scale.step,
          "minute"
        );
      }
      case "hour": {
        const startOfDay = cursor.startOf("day");
        const offset = cursor.hour();
        return startOfDay.add(
          Math.floor(offset / scale.step) * scale.step,
          "hour"
        );
      }
      case "day": {
        const startOfMonth = cursor.startOf("month");
        const offset = cursor.date() - 1; // date() 从 1 开始，转为 0-based
        return startOfMonth.add(
          Math.floor(offset / scale.step) * scale.step,
          "day"
        );
      }
      case "week": {
        // 以当年第一周起始为锚点
        const yearWeekStart = cursor.startOf("year").startOf("week");
        const weekDiff = cursor.startOf("week").diff(yearWeekStart, "week");
        return yearWeekStart.add(
          Math.floor(weekDiff / scale.step) * scale.step,
          "week"
        );
      }
      case "month": {
        const startOfYear = cursor.startOf("year");
        const offset = cursor.month(); // 0-based
        return startOfYear.add(
          Math.floor(offset / scale.step) * scale.step,
          "month"
        );
      }
      case "quarter": {
        const startOfYear = cursor.startOf("year");
        const quarter = Math.floor(cursor.month() / 3); // 0-based quarter
        return startOfYear.add(
          Math.floor(quarter / scale.step) * scale.step * 3,
          "month"
        );
      }
      case "year": {
        // 以公元 2000 年为锚点
        const offset = cursor.year() - 2000;
        const alignedYear =
          Math.floor(offset / scale.step) * scale.step + 2000;
        return cursor.year(alignedYear).startOf("year");
      }
      default:
        return cursor.startOf(scale.unit as dayjs.OpUnitType);
    }
  }

  /** 推进 cursor 到下一个 cell */
  private advanceCursor(cursor: Dayjs, scale: ParsedScale): Dayjs {
    if (scale.unit === "quarter") {
      return (cursor as any).add(scale.step, "quarter");
    }
    return cursor.add(scale.step, scale.unit as dayjs.ManipulateType);
  }

  /** 计算 cursor 到 cellEnd 之间跨越了多少个最小渲染单位 */
  private calculateSpan(cursor: Dayjs, cellEnd: Dayjs): number {
    const minUnit = this.getMinimumUnit();

    // 限制 cellEnd 不超过 endTime + 1（防止最后一个 cell 过长）
    const effectiveEnd = cellEnd.isAfter(this.endTime.add(1, minUnit))
      ? this.endTime.add(1, minUnit)
      : cellEnd;

    // 限制 cursor 不早于 startTime
    const effectiveStart = cursor.isBefore(this.startTime)
      ? this.startTime
      : cursor;

    const diff = effectiveEnd.diff(effectiveStart, minUnit);
    return Math.max(0, diff);
  }

  /** 格式化标签 */
  private formatLabel(
    date: Dayjs,
    scale: ParsedScale,
    isTopOrSingle: boolean
  ): string {
    // 优先使用 scale 自身的 format
    if (isFunction(scale.format)) {
      const label = scale.format(date.toDate(), scale.unit, scale.step);
      if (label) return label;
    }

    if (isString(scale.format)) {
      return date.format(scale.format);
    }

    // 默认格式
    return this.getDefaultFormat(date, scale.unit, isTopOrSingle);
  }

  /** 获取默认格式化 */
  private getDefaultFormat(
    date: Dayjs,
    unit: DurationUnit,
    isTopOrSingle: boolean
  ): string {
    switch (unit) {
      case "year":
        return date.format("YYYY");
      case "quarter":
        return date.format("[Q]Q");
      case "month":
        return isTopOrSingle ? date.format("YYYY-MM") : date.format("MMM");
      case "week":
        return date.format("wo");
      case "day":
        return isTopOrSingle ? date.format("YYYY-MM-DD") : date.format("Do");
      case "hour":
        return isTopOrSingle ? date.format("HH:mm") : date.format("H");
      case "minute":
        return date.format("HH:mm");
      default:
        return date.format("YYYY-MM-DD");
    }
  }

  /** 获取一个季度的天数 */
  private getQuarterDays(date?: Dayjs): number {
    if (!date) return 91; // 平均值
    const quarterStart = (date as any).startOf("quarter") as Dayjs;
    const quarterEnd = (quarterStart as any).add(1, "quarter") as Dayjs;
    return quarterEnd.diff(quarterStart, "day");
  }
}
