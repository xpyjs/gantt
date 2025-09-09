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
import { IGanttOptions, XGanttUnit } from "@/types/options";

/** 表头项 */
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

  /** 表头的日期列表 */
  private timeline: TimelineItem[] = [];
  private headerGroupFormat?:
    | string
    | ((date: Date, unit: XGanttUnit) => string);
  private headerCellFormat?:
    | string
    | ((date: Date, unit: XGanttUnit) => string);
  private isDirty: boolean = true; // 标记缓存是否需要更新
  /** 是否第一次赋值，如果第一次赋值，允许全部赋值 */
  private isFirstTime = true;

  /** 总宽度 */
  private allWidth: number = 0;
  /** 每一格的宽度 */
  private cellWidth: Record<XGanttUnit, number>;
  /** 用户设定的单位 */
  private unit: XGanttUnit = "day";

  constructor() {
    this.cellWidth = cloneDeep(DEFAULT_CELL_WIDTH().normal);
  }

  public getStartTime() {
    return this.startTime;
  }
  public getEndTime() {
    return this.endTime;
  }

  public getCellWidth() {
    const width = this.cellWidth[this.getChildUnit()];

    if (this.isAuto) {
      const r = this.allWidth / this.getCellCount();
      return Math.max(isNaN(r) ? 0 : r, width);
    }

    return width;
  }

  public getCellCount() {
    return this.timeline.reduce((p, c) => p + (c.children?.length || 0), 0);
  }

  public getCellUnit() {
    return this.getFinelyUnit();
  }

  public setAllWidth(width: number) {
    this.allWidth = width;

    if (!this.strictEnd) {
      // 如果是自动起止时间，需要自动补全
      const cellWidth = this.getCellWidth();
      const count = this.targetEnd.diff(this.startTime, this.getFinelyUnit());
      if (cellWidth * count < this.allWidth) {
        // 长度不足，需要不足
        const distance = this.allWidth - cellWidth * count;
        const diffCount = Math.ceil(distance / cellWidth);
        this.endTime = this.targetEnd.add(diffCount, this.getFinelyUnit());
        this.invalidateCache();
      }
    }
  }

  public getTimeLeft(time: Dayjs) {
    const cellWidth = this.getCellWidth();
    const unit = this.getFinelyUnit();
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
    const unit = this.getFinelyUnit();
    const timePrePixel = (60 * 60 * (unit === "day" ? 24 : 1)) / cellWidth;

    // 计算与起始时间的秒数差异
    const diffSeconds = left * timePrePixel;

    // 返回对应的时间点
    return this.startTime.add(diffSeconds, "second");
  }

  public init(options: IGanttOptions, isFirstTime = true): void {
    this.isDirty = true;
    this.isFirstTime = isFirstTime;

    const { unit, chart } = options;
    this.isAuto = !!chart.autoCellWidth;

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

    if (chart.startTime) {
      this.startTime = dayjs(chart.startTime).startOf(this.getFinelyUnit());
      this.strictStart = true;
    }

    if (chart.endTime) {
      this.endTime = dayjs(chart.endTime).endOf(this.getFinelyUnit());
      this.strictEnd = true;
    }

    if (chart.cellWidth) {
      if (isNumber(chart.cellWidth)) {
        this.cellWidth = {
          hour: chart.cellWidth,
          day: chart.cellWidth,
          week: chart.cellWidth,
          month: chart.cellWidth,
          quarter: chart.cellWidth
        };
      } else if (isString(chart.cellWidth)) {
        this.cellWidth = cloneDeep(
          DEFAULT_CELL_WIDTH()[chart.cellWidth] || DEFAULT_CELL_WIDTH().normal
        );
      } else if (isObject(chart.cellWidth)) {
        this.cellWidth = Object.assign(this.cellWidth, chart.cellWidth);
      }
    }

    this.headerCellFormat = chart.headerCellFormat;
    this.headerGroupFormat = chart.headerGroupFormat;
  }

  public update(options: IGanttOptions): void {
    this.init(options, false);

    this.endTime = this.targetEnd.clone();
  }

  public setDate(start?: Dayjs, end?: Dayjs) {
    if (!this.strictStart) {
      if (start) {
        if (this.isFirstTime || start.isBefore(this.startTime)) {
          this.startTime = start.startOf(this.getFinelyUnit());
        }
      }
    }

    if (!this.strictEnd) {
      if (end) {
        if (this.isFirstTime || end.isAfter(this.endTime)) {
          this.endTime = end.endOf(this.getFinelyUnit());
        }
      }
    }

    // 只有在 endTime 赋标准值时记录
    this.targetEnd = this.endTime.clone();

    this.isFirstTime = false;
    this.invalidateCache();
  }

  /** 获取表头的日期列表 */
  public getTimeline() {
    // 如果缓存有效，直接返回
    if (!this.isDirty && this.timeline.length > 0) {
      return this.timeline;
    }

    const res: TimelineItem[] = [];

    let currentTime = this.startTime.clone();
    res.push({
      date: currentTime,
      label: this.formatterGroupLabel(currentTime),
      children: [
        {
          date: currentTime,
          label: this.formatterCellLabel(currentTime)
        }
      ]
    });

    while (currentTime.isSameOrBefore(this.endTime, this.getFinelyUnit())) {
      const nextTime = currentTime
        .add(1, this.getFinelyUnit())
        .startOf(this.getFinelyUnit())
        .clone();

      const groupLabel = this.formatterGroupLabel(nextTime);
      const item = res.find(t => t.label === groupLabel);
      // 找到上层同一周期的内容
      if (item) {
        if (!item.children) item.children = [];
        item.children.push({
          date: nextTime,
          label: this.formatterCellLabel(nextTime)
        });
      } else {
        res.push({
          date: nextTime,
          label: groupLabel,
          children: [
            {
              date: nextTime,
              label: this.formatterCellLabel(nextTime)
            }
          ]
        });
      }

      currentTime = nextTime;
    }

    this.isDirty = false;
    this.timeline = res;
    return res;
  }

  public clear() {
    this.isDirty = true;
    this.isFirstTime = true;
  }

  /**
   * 缓存失效标记
   */
  private invalidateCache(): void {
    this.isDirty = true;
  }

  /** 获取细粒度单位 */
  private getFinelyUnit() {
    if (this.unit === "hour") return "hour";
    else return "day";
  }

  /** 获取下层单位 */
  private getChildUnit() {
    return this.unit;
  }

  /** 获取上层单位 */
  private getGroupUnit() {
    switch (this.unit) {
      case "hour":
        return "day";
      case "month":
      case "quarter":
        return "year";
      case "day":
      case "week":
      default:
        return "month";
    }
  }

  /** 格式化上层文本 */
  private formatterGroupLabel(date: Dayjs): string {
    if (isFunction(this.headerGroupFormat)) {
      const label = this.headerGroupFormat(date.toDate(), this.unit);

      if (label) return label;
    }

    if (isString(this.headerGroupFormat)) {
      return date.format(this.headerGroupFormat);
    }

    const unit = this.getGroupUnit();
    switch (unit) {
      case "month":
        return date.format("YYYY-MM");
      case "year":
        return date.format("YYYY");
      case "day":
      default:
        return date.format("YYYY-MM-DD");
    }
  }

  /**
   * 格式化下层文本
   */
  private formatterCellLabel(date: Dayjs): string {
    if (isFunction(this.headerCellFormat)) {
      const label = this.headerCellFormat(date.toDate(), this.unit);

      if (label) return label;
    }

    if (isString(this.headerCellFormat)) {
      return date.format(this.headerCellFormat);
    }

    const unit = this.getChildUnit();
    switch (unit) {
      case "hour":
        return date.format("H");
      case "week":
        return date.format("wo");
      case "month":
        return date.format("MMM"); // 显示月份简称
      case "quarter":
        return date.format("[Q]Q");
      case "day":
      default:
        return date.format("Do");
    }
  }

  /**
   * 获取时间轴的总宽度
   * @returns 时间轴总宽度（像素）
   */
  public getTotalWidth(): number {
    return this.getCellCount() * this.getCellWidth();
  }

  public expand(type: "left" | "right" | "all", count: number = 1): void {
    if (type === "left") {
      this.startTime = this.startTime.subtract(count, this.getFinelyUnit());
    } else if (type === "right") {
      this.endTime = this.endTime.add(count, this.getFinelyUnit());
    } else if (type === "all") {
      this.startTime = this.startTime.subtract(count, this.getFinelyUnit());
      this.endTime = this.endTime.add(count, this.getFinelyUnit());
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
}
