/*
 * @Author: JeremyJone
 * @Date: 2025-06-03 09:10:40
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-06-16 16:15:11
 * @Description: 渲染今日线
 */

import Konva from "konva";
import { colorjs } from "../../utils/color";
import dayjs from "../../utils/time";
import { IContext } from "@/types/render";

export class ChartToday {
  private arrowAnimation?: Konva.Animation;

  private todayLine?: Konva.Line;
  private triangle?: Konva.RegularPolygon;

  // 状态变量
  private width: number = 0;
  private height: number = 0;
  private offsetX: number = 0;
  private offsetY: number = 0;

  constructor(
    private context: IContext,
    private bgLayer: Konva.Layer,
    private headerLayer: Konva.Layer
  ) {}

  /**
   * 调整大小
   */
  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;

    this.render();
  }

  /**
   * 设置偏移量 (响应滚动)
   */
  public setOffset(x: number, y: number): void {
    if (x === this.offsetX) return;

    // 更新偏移量
    this.offsetX = x;

    this.render();
  }

  /**
   * 渲染今日线
   */
  public render(): void {
    const todayStyle = Object.assign(
      {
        show: true,
        type: "line",
        backgroundColor: colorjs("lightblue").toHex(),
        opacity: 1,
        width: 1
      },
      this.context.getOptions().today || {}
    );

    if (!todayStyle.show) return;

    let today = dayjs();
    const unit = this.context.store.getTimeAxis().getCellUnit();
    if (todayStyle.type === "block") {
      today = today.startOf(unit);
    }
    const start = this.context.store.getTimeAxis().getTimeLeft(today);
    const cellWidth = this.context.store.getTimeAxis().getCellWidth();
    const headerHeight = this.context.getOptions().header.height;
    const color = colorjs(todayStyle.backgroundColor)
      .alpha(todayStyle.opacity)
      .toHex();

    const left =
      (todayStyle.type === "block" ? start + cellWidth / 2 : start) +
      this.offsetX;

    const points = [left, headerHeight, left, this.height];
    const strokeWidth =
      todayStyle.type === "line" ? todayStyle.width : cellWidth;
    if (!this.todayLine) {
      this.todayLine = new Konva.Line({
        points,
        stroke: color,
        strokeWidth
      });

      this.bgLayer.add(this.todayLine);
    } else {
      this.todayLine.points(points);
      this.todayLine.stroke(color);
      this.todayLine.strokeWidth(strokeWidth);
    }

    // 如果 type 为 line，则创建箭头标记
    if (todayStyle.type === "line") {
      if (!this.triangle) {
        this.triangle = new Konva.RegularPolygon({
          x: left,
          y: headerHeight - 8,
          sides: 3,
          radius: 8,
          fill: color,
          rotation: 180,
          name: "today-triangle"
        });

        this.arrowAnimation = new Konva.Animation(frame => {
          const y =
            Math.sin((frame!.time * 4 * Math.PI) / 2000) + headerHeight - 8;
          this.triangle?.y(y);
        }, this.headerLayer);

        this.headerLayer.add(this.triangle);
        this.triangle.moveToTop();

        this.arrowAnimation.start();
      } else {
        this.triangle.x(left);
        this.triangle.fill(color);
      }
    }

    // 使用批量绘制，减少重绘次数
    this.bgLayer.batchDraw();
  }

  /**
   * 销毁今日线
   */
  public destroy(): void {
    this.todayLine?.destroy();
    this.triangle?.destroy();
    this.arrowAnimation?.stop();
    this.arrowAnimation = undefined;
  }
}
