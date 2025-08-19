/*
 * @Author: JeremyJone
 * @Date: 2025-06-03 09:10:40
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-08-19 10:41:22
 * @Description: 渲染今日线
 */

import Konva from "konva";
import { colorjs } from "../../utils/color";
import dayjs from "../../utils/time";
import { IContext } from "@/types/render";

export class ChartToday {
  private arrowAnimation?: Konva.Animation;

  private todayLine?: Konva.Line;
  private todayTextGroup?: Konva.Group;
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
  ) { }

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

    if (this.context.getOptions().today.text?.show) {
      const fontSize = this.context.getOptions().today.text?.fontSize || 10;
      const fontFamily = this.context.getOptions().today.text?.fontFamily || 'Arial';
      const textContent = this.context.getOptions().today.text?.content || '今天';
      const textSize = new Konva.Text({ fontSize, fontFamily }).measureSize(textContent);

      const textColor = this.context.getOptions().today.text?.color || 'white';
      const textBackgroundColor = this.context.getOptions().today.text?.backgroundColor || color;
      if (!this.todayTextGroup) {
        this.todayTextGroup = new Konva.Group({
          x: start + this.offsetX + strokeWidth,
          y: headerHeight,
          opacity: this.context.getOptions().today.text?.opacity,
        });

        this.todayTextGroup.add(new Konva.Rect({
          x: 0,
          y: 0,
          width: textSize.width + 12,
          height: textSize.height + 8,
          fill: textBackgroundColor,
          cornerRadius: 0,
          name: "today-text-bg"
        }))

        this.todayTextGroup.add(new Konva.Text({
          x: 0,
          y: 0,
          text: textContent,
          fontSize,
          fontFamily,
          padding: 5,
          fill: textColor,
          align: "center",
          verticalAlign: "middle",
          name: "today-text"
        }));

        this.bgLayer.add(this.todayTextGroup);
      } else {
        this.todayTextGroup.x(start + this.offsetX + strokeWidth);

        const textDom = this.todayTextGroup.findOne('.today-text') as Konva.Text;
        textDom?.setAttrs({
          text: textContent,
          fill: textColor,
          fontSize,
          fontFamily,
          padding: 5
        });

        const bgDom = this.todayTextGroup.findOne('.today-text-bg') as Konva.Rect;
        bgDom?.setAttrs({
          width: textSize.width + 12,
          height: textSize.height + 8,
          fill: textBackgroundColor
        })
      }
    } else if (this.todayTextGroup) {
      // 如果不显示文本，则销毁文本组
      this.todayTextGroup.destroy();
      this.todayTextGroup = undefined;
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
    this.todayTextGroup?.destroy();
    this.arrowAnimation?.stop();
    this.arrowAnimation = undefined;
  }
}
