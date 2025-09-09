/*
 * @Author: JeremyJone
 * @Date: 2025-04-18 11:02:13
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-09-09 14:42:18
 * @Description: 图表部分的表头渲染层
 */
import Konva from "konva";
import { isArray } from "lodash-es";
import { EventName } from "../../event";
import { colorjs } from "../../utils/color";
import { IContext } from "@/types/render";
import { type Task } from "@/models/Task";

export class HeaderLayer {
  private background: Konva.Rect; // 表头背景
  private groupHeader: Konva.Group; // 主表头 (年/月)
  private cellHeader: Konva.Group; // 次表头 (月/日)

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

    // 创建表头组
    this.groupHeader = new Konva.Group({ name: "primary-header" });
    this.cellHeader = new Konva.Group({ name: "secondary-header" });

    this.layer.add(this.groupHeader);
    this.layer.add(this.cellHeader);

    // 注册事件
    this.registerEvents();
  }

  /**
   * 调整表头大小
   */
  public resize(width: number): void {
    this.width = width;
    this.height = this.context.getOptions().header.height;

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

    // 应用偏移到表头组
    this.groupHeader.x(x);
    this.cellHeader.x(x);

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

    // 只计算可视范围内
    const visibleStartX = Math.max(0, -this.offsetX);
    const visibleEndX = visibleStartX + this.width;

    // 每一行（共两行）的高度
    const rowHeight = Math.floor(this.height / 2);

    // 获取一些变量
    const borderColor = this.context.getOptions().border.color;

    // 绘制中线
    this.layer.add(
      new Konva.Line({
        points: [0, rowHeight, this.width, rowHeight],
        stroke: borderColor,
        strokeWidth: 1
      })
    );

    // 绘制底线
    this.layer.add(
      new Konva.Line({
        points: [0, this.height, this.width, this.height],
        stroke: borderColor,
        strokeWidth: 1
      })
    );

    // 绘制内容
    const timeline = timeAxis.getTimeline();
    let startX = 0;
    for (let i = 0; i < timeline.length; i++) {
      const item = timeline[i];

      // 上层宽度 = 子项数量 * 每一格宽度
      const groupWidth = cellWidth * (item.children?.length ?? 0);

      // 检查是否在可视范围内。只渲染可视范围内的内容
      const itemEndX = startX + groupWidth;
      if (itemEndX < visibleStartX) {
        startX += groupWidth;
        continue; // 跳过
      }

      if (startX > visibleEndX) {
        break; // 已经超过了可视范围，停止
      }

      // 绘制上层单元格
      const group = this.createCell(
        `group-${item.date.format("YYYY-MM-DD")}`,
        startX,
        0,
        groupWidth,
        rowHeight,
        borderColor,
        item.label
      );
      this.groupHeader.add(group);

      // 绘制下层单元格
      if (isArray(item.children) && item.children.length > 0) {
        let childStartX = startX;

        for (let j = 0; j < item.children.length;) {
          const child = item.children[j];

          // 判断 label 内容相同的，直接合并
          let _x = 1;
          while (
            item.children[j + _x] &&
            child.label === item.children[j + _x].label
          ) {
            _x++;
          }
          j += _x;

          // 存在跨单位（上层）相同内容的情况（周展示，会有跨月的周），也需要合并处理
          if (
            j >= item.children.length &&
            timeline[i + 1] &&
            timeline[i + 1].children
          ) {
            let _i = 0;
            while (timeline[i + 1].children![_i]) {
              if (child.label === timeline[i + 1].children![_i].label) {
                timeline[i + 1].children![_i].hide = true;
                _i++;
              } else {
                break;
              }
            }

            if (_i > 0) {
              _x += _i;
            }
          }

          const _cellWidth = cellWidth * _x;

          // 同样检查是否在可视范围
          const childEndX = childStartX + _cellWidth;
          if (childEndX < visibleStartX) {
            childStartX += _cellWidth;
            continue; // 跳过
          }

          if (childStartX > visibleEndX) {
            break; // 停止
          }

          const cell = this.createCell(
            `cell-${child.date.format("YYYY-MM-DD")}`,
            childStartX,
            rowHeight,
            _cellWidth,
            rowHeight,
            child.hide ? "transparent" : borderColor,
            child.hide ? "" : child.label
          );
          this.cellHeader.add(cell);
          if (child.hide) {
            cell.visible(false);
          }

          childStartX += _cellWidth;
        }
      }

      startX += groupWidth;
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
      fill: this.context.getOptions().header.color,
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
    this.groupHeader.destroyChildren();
    this.cellHeader.destroyChildren();
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

    // 仅针对 day 单位生效
    if (this.context.getOptions().unit !== "day") return;

    const startCell = this.cellCache.get(
      `cell-${task?.startTime?.format("YYYY-MM-DD")}`
    );
    const endCell = this.cellCache.get(
      `cell-${task?.endTime?.format("YYYY-MM-DD")}`
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
