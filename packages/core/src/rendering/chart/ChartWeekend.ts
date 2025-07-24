import Konva from "konva";
import dayjs from "../../utils/time";
import { Pattern } from "./Pattern";
import { IContext } from "@/types/render";

/**
 * 周末周末渲染
 * 用于在甘特图中标记周末区域
 */
export class WeekendGroup {
  // 状态变量
  private width: number = 0;
  private height: number = 0;
  private offsetX: number = 0;
  private offsetY: number = 0;

  // 保存周末
  private weekendGroup: Konva.Group;

  private patternImage: HTMLImageElement | null = null;

  constructor(private context: IContext, private layer: Konva.Layer) {
    this.weekendGroup = new Konva.Group();
    this.layer.add(this.weekendGroup);
  }

  /**
   * 检查日期是否为周末
   */
  public isWeekend(date: dayjs.Dayjs): boolean {
    return date.day() === 6 || date.day() === 0;
  }

  /**
   * 调整周末大小
   */
  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;

    // 重新计算周末
    this.calculateWeekend();
  }

  /**
   * 设置偏移量 (响应滚动)
   */
  public setOffset(x: number, y: number): void {
    // 更新偏移量
    this.offsetX = x;
    this.offsetY = y;

    // 应用偏移到周末组
    this.weekendGroup.x(x);
    this.weekendGroup.y(y);

    // 重新计算周末
    this.calculateWeekend();
  }

  /**
   * 渲染周末
   */
  public render(): void {
    // 使用批量绘制，减少重绘次数
    this.layer.batchDraw();
  }

  /**
   * 销毁周末层
   */
  public destroy(): void {
    this.weekendGroup.destroy();
    this.patternImage = null;
  }

  private clearWeekend(): void {
    this.weekendGroup.destroyChildren();
    this.patternImage = null;
  }

  /**
   * 计算周末
   */
  private async calculateWeekend(): Promise<void> {
    this.clearWeekend();
    if (!this.context.getOptions().weekend.show) return;

    const startTime = this.context.store.getTimeAxis().getStartTime();
    const endTime = this.context.store.getTimeAxis().getEndTime();
    const unit = this.context.store.getTimeAxis().getCellUnit();
    const cellWidth = this.context.store.getTimeAxis().getCellWidth();
    const headerHeight = this.context.getOptions().header.height;
    const cellHeight = this.context.getOptions().row.height;
    const totalRows = this.context.store.getDataManager().getVisibleSize();
    const totalHeight = totalRows * cellHeight;

    // 只计算可视范围内
    const visibleStartX = Math.max(0, -this.offsetX);
    const visibleEndX = visibleStartX + this.width;

    for (let time = startTime; time <= endTime; ) {
      let width = cellWidth;
      width = cellWidth * 2 * (unit === "day" ? 1 : 24);

      if (this.isWeekend(time)) {
        const x = this.context.store.getTimeAxis().getTimeLeft(time);
        const y = headerHeight;
        const height = totalHeight;

        // 检查是否在可视范围内。只渲染可视范围内的内容
        const itemEndX = x + width;
        if (itemEndX < visibleStartX) {
          time = time.add(2, "day");
          continue; // 跳过
        }

        if (x > visibleEndX) {
          break; // 已经超过了可视范围，停止
        }

        // 获取图案图片
        if (!this.patternImage && this.context.getOptions().weekend.pattern) {
          this.patternImage = await Pattern.createPattern(
            this.context.getOptions().weekend
          );
        }

        // 创建背景矩形并应用图案填充
        const backgroundRect = new Konva.Rect({
          name: "weekend-rect",
          x,
          y,
          width,
          height,
          // 根据模式设置填充
          ...(this.patternImage
            ? {
                fillPatternImage: this.patternImage,
                fillPatternRepeat: "repeat",
                fillPatternOffset: { x: 0, y: 0 },
                fillPatternScale: { x: 1, y: 1 }
              }
            : {
                fill:
                  this.context.getOptions().weekend.backgroundColor || "#c9c9c9"
              }),
          opacity: this.context.getOptions().weekend.opacity
        });

        this.weekendGroup.add(backgroundRect);

        time = time.add(2, "day");
      } else {
        time = time.add(1, "day");
      }
    }

    // 重新渲染
    this.layer.batchDraw();
  }
}
