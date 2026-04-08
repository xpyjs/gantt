/*
 * @Author: JeremyJone
 * @Date: 2025-04-18 11:02:13
 * @LastEditors: JeremyJone
 * @LastEditTime: 2026-04-08 11:05:49
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
  private separatorLines: Konva.Line[] = []; // 层间分隔线

  private cellCache: Map<string, Konva.Rect> = new Map();

  // 缓冲区跟踪：已渲染的 X 范围
  private renderedStartX: number = 0;
  private renderedEndX: number = 0;
  /** 缓冲区比例：视口宽度的30%，左右各多渲染这么宽 */
  private static readonly BUFFER_FACTOR = 0.3;

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

    // 检查是否滚出缓冲区，仅在滚出时重建 cell 内容
    const visibleStart = -x;
    const visibleEnd = visibleStart + this.width;

    if (visibleStart < this.renderedStartX || visibleEnd > this.renderedEndX) {
      this.renderCells();
    }

    this.layer.batchDraw();
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
    this.buildStructure();
    this.renderCells();

    this.layer.moveToTop();
    this.layer.batchDraw();
  }

  /**
   * 构建表头结构（headerGroups + 分隔线）
   * 仅在 resize 或数据变化时调用
   */
  private buildStructure(): void {
    // 清除旧的结构
    this.clearHeader();

    const timeAxis = this.context.store.getTimeAxis();
    const timeline = timeAxis.getTimeline();
    const layerCount = timeline.length;

    if (layerCount === 0) return;

    const layerHeights = timeAxis.getLayerHeights();
    const borderColor = this.context.getOptions().border.color;

    // 预计算每层的 Y 偏移
    const layerYOffsets: number[] = [];
    let yAccum = 0;
    for (let i = 0; i < layerCount; i++) {
      layerYOffsets.push(yAccum);
      yAccum += layerHeights[i] ?? 0;
    }

    // 创建 N 个表头组
    for (let level = 0; level < layerCount; level++) {
      const group = new Konva.Group({ name: `header-level-${level}` });
      this.headerGroups.push(group);
      this.layer.add(group);
      group.x(this.offsetX);
    }

    // 绘制层间分隔线
    for (let i = 1; i < layerCount; i++) {
      const line = new Konva.Line({
        points: [0, layerYOffsets[i], this.width, layerYOffsets[i]],
        stroke: borderColor,
        strokeWidth: 1
      });
      this.layer.add(line);
      this.separatorLines.push(line);
    }

    // 绘制表头底部分隔线（header 与 body 的分界线）
    const bottomLine = new Konva.Line({
      points: [0, this.height, this.width, this.height],
      stroke: borderColor,
      strokeWidth: 1
    });
    this.layer.add(bottomLine);
    this.separatorLines.push(bottomLine);
  }

  /**
   * 渲染表头 cell 内容（带缓冲区的可视范围裁剪）
   * 滚动超出缓冲区时调用，重建 cells 但保留 group 结构
   */
  private renderCells(): void {
    const timeAxis = this.context.store.getTimeAxis();
    const cellWidth = timeAxis.getCellWidth();
    const timeline = timeAxis.getTimeline();
    const layerCount = timeline.length;

    if (layerCount === 0) return;

    // 各层高度
    const layerHeights = timeAxis.getLayerHeights();

    // 预计算每层的 Y 偏移
    const layerYOffsets: number[] = [];
    let yAccum = 0;
    for (let i = 0; i < layerCount; i++) {
      layerYOffsets.push(yAccum);
      yAccum += layerHeights[i] ?? 0;
    }

    // 计算带缓冲的可视范围
    const buffer = this.width * HeaderLayer.BUFFER_FACTOR;
    const visibleStartX = Math.max(0, -this.offsetX - buffer);
    const visibleEndX = -this.offsetX + this.width + buffer;

    const borderColor = this.context.getOptions().border.color;

    // 清除现有 cells（保留 group 结构）
    for (const group of this.headerGroups) {
      group.destroyChildren();
    }
    this.cellCache.clear();

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

    // 更新已渲染范围
    this.renderedStartX = visibleStartX;
    this.renderedEndX = visibleEndX;
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

    // 清理分隔线
    for (const line of this.separatorLines) {
      line.destroy();
    }
    this.separatorLines = [];

    // 重置缓冲区范围
    this.renderedStartX = 0;
    this.renderedEndX = 0;
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
