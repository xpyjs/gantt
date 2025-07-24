import Konva from "konva";
import dayjs from "../../utils/time";
import { Pattern } from "./Pattern";
import { isArray } from "lodash-es";
import { IContext } from "@/types/render";

/**
 * 假期渲染
 * 用于在甘特图中标记假期区域
 */
export class HolidayGroup {
  // 状态变量
  private width: number = 0;
  private height: number = 0;
  private offsetX: number = 0;
  private offsetY: number = 0;

  // 保存假期
  private holidayGroup: Konva.Group;
  private patternImage = new WeakMap<any, HTMLImageElement | null>();

  constructor(private context: IContext, private layer: Konva.Layer) {
    this.holidayGroup = new Konva.Group();
    this.layer.add(this.holidayGroup);
  }

  /**
   * 调整假期大小
   */
  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;

    // 重新计算假期
    this.calculateHoliday();
  }

  /**
   * 设置偏移量 (响应滚动)
   */
  public setOffset(x: number, y: number): void {
    // 更新偏移量
    this.offsetX = x;
    this.offsetY = y;

    // 应用偏移到假期组
    this.holidayGroup.x(x);
    this.holidayGroup.y(y);

    // 重新计算假期
    this.calculateHoliday();
  }

  /**
   * 渲染假期
   */
  public render(): void {
    // 使用批量绘制，减少重绘次数
    this.layer.batchDraw();
  }

  /**
   * 销毁假期层
   */
  public destroy(): void {
    this.holidayGroup.destroy();
  }

  private clearHoliday(): void {
    this.holidayGroup.destroyChildren();
  }

  /**
   * 计算假期
   */
  private async calculateHoliday(): Promise<void> {
    this.clearHoliday();
    if (!this.context.getOptions().holiday.show) return;

    const holidays = this.context.getOptions().holiday.holidays;
    if (!holidays || holidays.length === 0) return;

    // 只计算可视范围内
    const visibleStartX = Math.max(0, -this.offsetX);
    const visibleEndX = visibleStartX + this.width;

    const startTime = this.context.store.getTimeAxis().getStartTime();
    const endTime = this.context.store.getTimeAxis().getEndTime();
    const unit = this.context.store.getTimeAxis().getCellUnit();
    const cellWidth = this.context.store.getTimeAxis().getCellWidth();
    const headerHeight = this.context.getOptions().header.height;
    const cellHeight = this.context.getOptions().row.height;
    const totalRows = this.context.store.getDataManager().getVisibleSize();
    const totalHeight = totalRows * cellHeight;

    for (let time = startTime; time <= endTime; time = time.add(1, "day")) {
      const holiday = holidays.find(h => {
        if (isArray(h.date)) {
          if (h.date.some(d => dayjs(d).isSame(time, "day"))) {
            return h;
          }
        } else {
          if (dayjs(h.date).isSame(time, "day")) {
            return h;
          }
        }
      });

      if (holiday) {
        const x = this.context.store.getTimeAxis().getTimeLeft(time);
        const y = headerHeight;
        const height = totalHeight;

        // 检查是否在可视范围内。只渲染可视范围内的内容
        const itemEndX = x + cellWidth;
        if (itemEndX < visibleStartX) {
          continue; // 跳过
        }

        if (x > visibleEndX) {
          break; // 已经超过了可视范围，停止
        }

        // 获取图案图片
        if (
          !this.patternImage.has(holiday) &&
          (holiday.pattern || this.context.getOptions().holiday.pattern)
        ) {
          this.patternImage.set(
            holiday,
            await Pattern.createPattern({
              backgroundColor: this.context.getOptions().primaryColor,
              ...holiday,
              ...this.context.getOptions().holiday
            })
          );
        }

        // 创建背景矩形并应用图案填充
        const backgroundRect = new Konva.Rect({
          name: "holiday-rect",
          x,
          y,
          width: cellWidth,
          height,
          // 根据模式设置填充
          ...(this.patternImage.get(holiday)
            ? {
                fillPatternImage: this.patternImage.get(holiday) ?? undefined,
                fillPatternRepeat: "repeat",
                fillPatternOffset: { x: 0, y: 0 },
                fillPatternScale: { x: 1, y: 1 },
                opacity:
                  holiday.opacity || this.context.getOptions().holiday.opacity
              }
            : {
                fill:
                  holiday.backgroundColor ||
                  this.context.getOptions().holiday.backgroundColor ||
                  this.context.getOptions().primaryColor,
                opacity:
                  holiday.opacity || this.context.getOptions().holiday.opacity
              })
        });

        this.holidayGroup.add(backgroundRect);
      }
    }

    // 重新渲染
    this.layer.batchDraw();
  }
}
