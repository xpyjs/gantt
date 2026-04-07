/*
 * @Author: JeremyJone
 * @Date: 2025-04-18 11:02:13
 * @LastEditors: JeremyJone
 * @LastEditTime: 2026-01-10 19:29:39
 * @Description: 图表部分的表头渲染层
 */
import Konva from "konva";
import { EventName } from "../../event";
import { autoColor, colorjs } from "../../utils/color";
import { IContext } from "@/types/render";
import { type Task } from "@/models/Task";

export class HeaderLayer {
  private background: Konva.Rect; // 表头背景
  private headerGroups: Konva.Group[] = []; // N 层表头组

  private cellCache: Map<string, Konva.Rect> = new Map();

  // 状态变量
  private width: number = 0;
  private height: number = 0;
  private offsetX: number = 0;

  constructor(private context: IContext, private layer: Konva.Layer) {
    // 背景
    this.background = new Konva.Rect({
      fill:
        this.context.getOptions().header.backgroundColor ||
        this.context.getOptions().primaryColor,
      name: "header-background"
    });
    this.layer.add(this.background);

    // 注册事件
    this.registerEvents();
  }

  /**
   * 调整表头大小
   */
  public resize(width: number): void {
    this.width = width;

    // 优先使用 TimeAxis 解析后的 header 高度（考虑 scaleUnit 各层 height 配置）
    const timeAxis = this.context.store.getTimeAxis();
    this.height = timeAxis.getResolvedHeaderHeight();

    this.background.width(width);
    this.background.height(this.height);

    // 重新绘制表头
    this.render();
  }

  /**
   * 设置偏移量 (响应滚动)
   * 表头只需要水平滚动，不需要垂直滚动
   */
  public setOffset(x: number, y: number): void {
    if (this.offsetX === x) return;

    // 更新水平偏移量
    this.offsetX = x;

    // 应用偏移到所有表头组
    for (const group of this.headerGroups) {
      group.x(x);
    }

    // // 检查是否需要重新计算表头
    this.render();
  }

  /**
   * 注册事件监听
   */
  private registerEvents(): void {
    // 监听行高亮事件
    this.context.event.on(EventName.ROW_HIGHLIGHT, (id: string) => {
      this.highlightDate(id);
    });

    // 监听取消高亮事件
    this.context.event.on(EventName.ROW_UNHIGHLIGHT, (id: string) => {
      this.unhighlightDate(id);
    });

    // 更新数据时，也更新高亮
    this.context.event.on(EventName.UPDATE_TASK, (task: Task) => {
      this.highlightDate(task.id);
    });
  }

  /**
   * 渲染表头
   */
  public render(): void {
    this.calculateHeader();

    // if (this.highlightRect) {
    //   this.highlightRect.destroy();
    //   this.highlightRect = null;
    // }

    this.layer.moveToTop();
    this.layer.batchDraw();
  }

  /**
   * 计算并绘制表头
   */
  private calculateHeader(): void {
    // 清除现有表头
    this.clearHeader();

    const timeAxis = this.context.store.getTimeAxis();
    const cellWidth = timeAxis.getCellWidth();
    const timeline = timeAxis.getTimeline();
    const layerCount = timeline.length;

    if (layerCount === 0) return;

    // 只计算可视范围内
    const visibleStartX = Math.max(0, -this.offsetX);
    const visibleEndX = visibleStartX + this.width;

    // 各层高度（来自 TimeAxis 解析结果）
    const layerHeights = timeAxis.getLayerHeights();

    // 预计算每层的 Y 偏移
    const layerYOffsets: number[] = [];
    let yAccum = 0;
    for (let i = 0; i < layerCount; i++) {
      layerYOffsets.push(yAccum);
      yAccum += layerHeights[i] ?? 0;
    }

    // 获取一些变量
    const borderColor = this.context.getOptions().border.color;

    // 创建 N 个表头组
    for (let level = 0; level < layerCount; level++) {
      const group = new Konva.Group({ name: `header-level-${level}` });
      this.headerGroups.push(group);
      this.layer.add(group);

      // 应用当前偏移
      group.x(this.offsetX);
    }

    // 绘制层间分隔线（仅绘制层与层之间的线，不绘制最底部的线）
    for (let i = 1; i < layerCount; i++) {
      this.layer.add(
        new Konva.Line({
          points: [0, layerYOffsets[i], this.width, layerYOffsets[i]],
          stroke: borderColor,
          strokeWidth: 1
        })
      );
    }

    // 绘制表头底部分隔线（header 与 body 的分界线）
    this.layer.add(
      new Konva.Line({
        points: [0, this.height, this.width, this.height],
        stroke: borderColor,
        strokeWidth: 1
      })
    );

    // 绘制每一层的内容
    for (let level = 0; level < layerCount; level++) {
      const layerData = timeline[level];
      const headerGroup = this.headerGroups[level];
      const y = layerYOffsets[level];
      const currentRowHeight = layerHeights[level] ?? 0;
      const isBottomLayer = level === layerCount - 1;
      let startX = 0;

      for (let i = 0; i < layerData.items.length; i++) {
        const item = layerData.items[i];
        const itemWidth = item.span * cellWidth;

        // 可视范围裁剪
        const itemEndX = startX + itemWidth;
        if (itemEndX < visibleStartX) {
          startX += itemWidth;
          continue;
        }
        if (startX > visibleEndX) {
          break;
        }

        const cellId = isBottomLayer
          ? `cell-${item.date.format("YYYY-MM-DD-HH")}`
          : `group-${level}-${item.date.format("YYYY-MM-DD-HH")}`;

        const cell = this.createCell(
          cellId,
          startX,
          y,
          itemWidth,
          currentRowHeight,
          item.hide ? "transparent" : borderColor,
          item.hide ? "" : item.label
        );
        headerGroup.add(cell);
        if (item.hide) {
          cell.visible(false);
        }

        startX += itemWidth;
      }
    }

    // 高效绘制
    this.layer.batchDraw();
  }

  private createCell(
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    borderColor?: string,
    text?: string
  ) {
    const group = new Konva.Group();
    group.x(x);
    group.y(y);

    const bg = new Konva.Rect({
      id,
      x: 0,
      y: 0,
      width: width,
      height: height,
      fill:
        this.context.getOptions().header.backgroundColor ||
        this.context.getOptions().primaryColor,
      name: "header-cell-bg"
    });
    group.add(bg);

    let fontSize = this.context.getOptions().header.fontSize;
    if (id.startsWith("cell-")) {
      this.cellCache.set(id, bg);
      fontSize -= 2;
    }

    // 右侧边框
    const rightBorder = new Konva.Line({
      points: [width, 0, width, height],
      stroke: borderColor,
      strokeWidth: 1,
      name: "header-cell-right-border"
    });
    group.add(rightBorder);

    // 文本
    const label = new Konva.Text({
      x: 0,
      y: 0,
      width: width,
      height: height,
      text: text,
      fontSize: fontSize,
      fontFamily: this.context.getOptions().header.fontFamily,
      fontStyle: `${this.context.getOptions().header.fontWeight}`,
      fill: autoColor(this.context.getOptions().header.color, this.context.getOptions().header.backgroundColor || this.context.getOptions().primaryColor),
      align: "center",
      verticalAlign: "middle",
      wrap: "none",
      ellipsis: true,
      name: "header-cell-text"
    });
    group.add(label);

    return group;
  }

  /**
   * 清除表头内容
   */
  private clearHeader(): void {
    for (const group of this.headerGroups) {
      group.destroy();
    }
    this.headerGroups = [];
    this.cellCache.clear();
  }

  /**
   * 销毁表头层
   */
  public destroy(): void {
    this.layer.destroy();
    this.cellCache.clear();
  }

  /**
   * 高亮日期
   */
  private highlightDate(id: string): void {
    const task = this.context.store.getDataManager().getTaskById(id);

    if (task && task.startTime && task.endTime) {
      this.handleHighlight("in", task);
    }
  }

  /**
   * 取消高亮日期
   */
  private unhighlightDate(id: string): void {
    const task = this.context.store.getDataManager().getTaskById(id);

    if (task && task.startTime && task.endTime) {
      this.handleHighlight("out", task);
    }
  }

  // 拖拽块的高亮动画
  private handleHighlight(type: "in" | "out", task?: Task) {
    if (!this.context.getOptions().highlight) return;

    // 对底层 scale 为 day 时生效
    const timeAxis = this.context.store.getTimeAxis();
    const bottomScale = timeAxis.getBottomScale();
    if (bottomScale.unit !== "day" || bottomScale.step !== 1) return;

    const startCell = this.cellCache.get(
      `cell-${task?.startTime?.format("YYYY-MM-DD-HH")}`
    );
    const endCell = this.cellCache.get(
      `cell-${task?.endTime?.format("YYYY-MM-DD-HH")}`
    );

    const bgColor =
      this.context.getOptions().header.backgroundColor ||
      this.context.getOptions().primaryColor;

    if (!bgColor) return;

    this.cellCache.forEach(child => {
      new Konva.Tween({
        node: child,
        fill: bgColor,
        duration: 0.02
      }).play();
    });

    if (type === "in") {
      if (startCell) {
        new Konva.Tween({
          node: startCell,
          fill: colorjs(bgColor).brighten(30).toHex(),
          duration: 0.02
        }).play();
      }

      if (endCell) {
        new Konva.Tween({
          node: endCell,
          fill: colorjs(bgColor).brighten(30).toHex(),
          duration: 0
        }).play();
      }
    }
  }
}
