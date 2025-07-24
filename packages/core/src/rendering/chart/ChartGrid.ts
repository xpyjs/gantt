/*
 * @Author: JeremyJone
 * @Date: 2025-05-09 16:52:26
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-06-23 10:11:19
 * @Description: 背景网格
 */
import { IContext } from "@/types/render";
import Konva from "konva";

export class GridGroup {
  // 网格线组
  private verticalLines: Konva.Group;
  private horizontalLines: Konva.Group;

  // 状态变量
  private width: number = 0;
  private height: number = 0;
  private offsetX: number = 0;
  private offsetY: number = 0;

  constructor(private context: IContext, private layer: Konva.Layer) {
    // 创建网格线组
    this.verticalLines = new Konva.Group({ name: "vertical-grid-lines" });
    this.horizontalLines = new Konva.Group({ name: "horizontal-grid-lines" });

    this.layer.add(this.verticalLines);
    this.layer.add(this.horizontalLines);
  }

  /**
   * 调整网格大小
   */
  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;

    // 清除旧的网格线
    this.clearGrid();

    // 重新计算网格
    this.calculateGrid();
  }

  /**
   * 设置偏移量 (响应滚动)
   */
  public setOffset(x: number, y: number): void {
    // 更新偏移量
    this.offsetX = x;
    this.offsetY = y;

    // 应用偏移到网格组
    this.verticalLines.x(x);
    this.horizontalLines.y(y);

    // 如果需要重新计算网格
    this.calculateGrid();
  }

  /**
   * 渲染网格
   */
  public render(): void {
    // 使用批量绘制，减少重绘次数
    this.layer.batchDraw();
  }

  /**
   * 销毁网格层
   */
  public destroy(): void {
    this.layer.destroy();
  }

  /**
   * 计算网格位置
   */
  private calculateGrid(): void {
    // 清除现有网格线
    this.clearGrid();

    // 获取一些参数
    const headerHeight = this.context.getOptions().header.height;
    const totalWidth = this.width;
    const cellWidth = this.context.store.getTimeAxis().getCellWidth();
    const cellHeight = this.context.getOptions().row.height;
    const totalRows = this.context.store.getDataManager().getVisibleSize();
    const totalHeight = totalRows * cellHeight;

    // 计算可视区域的范围
    const visibleStartCol = Math.max(
      0,
      Math.floor(-this.offsetX / cellWidth) - 2
    ); // 多渲染2列作为缓冲
    const visibleEndCol = Math.min(
      this.context.store.getTimeAxis().getCellCount(),
      Math.ceil((-this.offsetX + this.width) / cellWidth) + 2
    );

    const visibleStartRow = Math.max(
      0,
      Math.floor((-this.offsetY + headerHeight) / cellHeight) - 2
    );
    const visibleEndRow = Math.min(
      totalRows,
      Math.ceil((-this.offsetY + this.height) / cellHeight) + 2
    );

    if (
      this.context.getOptions().border.show &&
      ["day", "hour"].includes(this.context.getOptions().unit)
    ) {
      // 绘制垂直网格线 - 不要在这里考虑偏移，偏移由 this.verticalLines.x(x) 处理
      for (let i = visibleStartCol; i <= visibleEndCol; i++) {
        // 注意这里不再添加 visibleStartX
        const x = i * cellWidth;

        // 创建垂直线
        const line = new Konva.Line({
          points: [x, headerHeight, x, totalHeight + headerHeight],
          stroke: this.context.getOptions().border.color,
          strokeWidth: 0.5,
          name: "vertical-grid-line"
        });

        this.verticalLines.add(line);
      }
    }

    // 绘制水平网格线 - 同样，不要在这里考虑偏移
    for (let i = visibleStartRow; i <= visibleEndRow; i++) {
      const y = i * cellHeight + headerHeight;

      // 创建水平线
      const line = new Konva.Line({
        points: [0, y, Math.max(this.width, totalWidth), y],
        stroke: this.context.getOptions().border.color,
        strokeWidth: 0.5,
        name: "horizontal-grid-line"
      });

      this.horizontalLines.add(line);
    }
  }

  /**
   * 清除网格线
   */
  private clearGrid(): void {
    this.verticalLines.destroyChildren();
    this.horizontalLines.destroyChildren();
  }
}
