/*
 * @Author: JeremyJone
 * @Date: 2025-05-14 10:15:23
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-11-06 15:54:46
 * @Description: 图表部分的主体渲染层
 */
import Konva from "konva";
import { EventName } from "../../event";
import { colorjs } from "../../utils/color";
import { ChartRow } from "./ChartRow";
import { generateId } from "../../utils/id";
import { IContext } from "@/types/render";
import { type Task } from "@/models/Task";
import { type Dayjs } from "dayjs";

export class BodyGroup {
  private tasks: Task[] = []; // 当前渲染的任务列表

  private rowsGroup: Konva.Group; // 包含所有行的容器
  private rowsCache: Map<string, ChartRow> = new Map();

  private rowBgGroup: Konva.Group; // 行背景容器

  // 状态变量
  private width: number = 0;
  private height: number = 0;
  private offsetX: number = 0;
  private offsetY: number = 0;

  // 高亮相关
  private highlightedRowId: string | null = null;
  private highlightRect: Konva.Rect | null = null;

  // 选中相关
  private selectedRowId: string | null = null;
  private selectedRect: Konva.Rect | null = null;

  constructor(
    private context: IContext,
    private stage: Konva.Stage,
    private layer: Konva.Layer,
    private bgLayer: Konva.Layer
  ) {
    // 创建行容器
    this.rowsGroup = new Konva.Group({ name: "chart-body-rows" });
    this.layer.add(this.rowsGroup);

    this.rowBgGroup = new Konva.Group({ name: "chart-body-row-bgs" });
    this.bgLayer.add(this.rowBgGroup);

    // 注册事件监听
    this.registerEvents();

    // 添加事件
    this.bindEvents();
  }

  /**
   * 调整大小
   */
  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  /**
   * 设置偏移量 (响应滚动)
   */
  public setOffset(x: number, y: number): void {
    const diff = y - this.offsetY;
    // 更新偏移量
    this.offsetX = x;
    this.offsetY = y;

    this.rowsGroup.x(x);
    this.rowsGroup.y(y);

    // 更新高亮矩形的位置（如果存在）
    this.updateHighlightPosition(diff);

    // 更新选中矩形的位置（如果存在）
    this.updateSelectedPosition(diff);
  }

  /**
   * 渲染主体内容
   * @param tasks 任务数据
   */
  public render(tasks: Task[]): void {
    this.tasks = tasks;
    const rowHeight = this.context.getOptions().row.height;
    const currentKey = generateId();

    this.rowBgGroup.destroyChildren();

    this.tasks.forEach((task, index) => {
      const rowId = `chart-row-${task.id}`;
      let rowRect = this.rowsCache.get(rowId);
      const rowY = task.flatIndex * rowHeight;
      const y = rowY + this.context.getOptions().header.height;
      if (!rowRect) {
        rowRect = new ChartRow(
          this.context,
          task,
          rowId,
          0,
          y,
          this.width,
          rowHeight
        );
        rowRect.setOffset(this.offsetX, this.offsetY);
        this.rowsGroup.add(rowRect.row);
        this.rowsCache.set(rowId, rowRect);
      } else {
        rowRect.update(0, y);
        rowRect.setOffset(this.offsetX, this.offsetY);
      }
      rowRect.cacheKey = currentKey;

      if (this.context.store.getDataManager().isTaskSelected(task.id)) {
        this.selectRow(task.id);
      }

      // 创建行背景矩形
      const rowBg = new Konva.Rect({
        x: 0,
        y: y + this.offsetY,
        width: this.width,
        height: rowHeight,
        fill: this.context.store.getOptionManager().getRowBackgroundColor(task),
        id: `chart-row-bg-${task.id}`,
        listening: false // 不需要监听事件
      });
      this.rowBgGroup.add(rowBg);
      this.rowBgGroup.moveToBottom();
    });

    // 清除缓存中不存在的行
    this.rowsCache.forEach((row, key) => {
      if (row.cacheKey !== currentKey) {
        row.destroy();
        this.rowsCache.delete(key);
      }
    });

    this.layer.batchDraw();
  }

  /**
   * 更新任务
   */
  public updateTask(task: Task) {
    const row = this.rowsCache.get(`chart-row-${task.id}`);
    if (row) {
      row.update(
        0,
        task.flatIndex * this.context.getOptions().row.height +
        this.context.getOptions().header.height
      );
    }
  }

  /**
   * 添加 body 事件
   */
  private bindEvents(): void {
    this.stage.on("mousemove", this.handleMouseMove.bind(this));
    this.stage.on("mouseleave", this.handleMouseLeave.bind(this));

    this.stage.on("click", this.handleClick.bind(this));
    this.stage.on("dblclick", this.handleDblClick.bind(this));
    this.stage.on("contextmenu", this.handleContextMenu.bind(this));
  }

  /**
   * 注册事件监听
   */
  private registerEvents(): void {
    // 监听行高亮事件
    this.context.event.on(EventName.ROW_HIGHLIGHT, (id: string) => {
      this.highlightRow(id);
    });

    // 监听取消高亮事件
    this.context.event.on(EventName.ROW_UNHIGHLIGHT, (id: string) => {
      this.unhighlightRow(id);
    });

    // 监听任务选中事件
    this.context.event.on(EventName.TASK_SELECTED, (task: Task) => {
      this.selectRow(task.id);
    });

    // 监听任务取消选中事件
    this.context.event.on(EventName.TASK_UNSELECTED, (id: string) => {
      this.unselectRow(id);
    });
  }

  /**
   * 处理鼠标移动
   */
  private handleMouseMove(e: Konva.KonvaEventObject<MouseEvent>) {
    const pos = this.stage.getPointerPosition();
    if (!pos) return;

    const task = this.getTaskByPosition(pos);

    if (this.highlightedRowId) {
      if (task && task.id !== this.highlightedRowId) {
        this.context.event.emit(
          EventName.ROW_UNHIGHLIGHT,
          this.highlightedRowId
        );
      }
    }

    if (task) {
      this.context.event.emit(EventName.ROW_HIGHLIGHT, task.id);
    }
  }

  /**
   * 处理鼠标离开
   */
  private handleMouseLeave(e: Konva.KonvaEventObject<MouseEvent>) {
    this.unhighlightRow();
  }

  /**
   * 处理点击
   */
  private handleClick(e: Konva.KonvaEventObject<MouseEvent>) {
    if (e.evt.button !== 0) return; // 确保是左键点击

    const pos = this.stage.getPointerPosition();
    if (!pos) return;

    const task = this.getTaskByPosition(pos);
    if (task) {
      if (!this.context.store.getDataManager().isTaskSelected(task.id)) {
        this.context.store.getDataManager().selectTask(task.id);
      }

      const time = this.getTimeByPosition(pos);
      this.context.event.emit(EventName.ROW_CLICK, e.evt, task, time);
    }
  }

  /**
   * 处理双击
   */
  private handleDblClick(e: Konva.KonvaEventObject<MouseEvent>) {
    if (e.evt.button !== 0) return; // 确保是左键双击

    const pos = this.stage.getPointerPosition();
    if (!pos) return;

    const task = this.getTaskByPosition(pos);
    if (task) {
      const time = this.getTimeByPosition(pos);
      this.context.event.emit(EventName.ROW_DBL_CLICK, e.evt, task, time);
    }
  }

  /**
   * 处理右键菜单
   */
  private handleContextMenu(e: Konva.KonvaEventObject<MouseEvent>) {
    if (e.evt.button !== 2) return; // 确保是右键点击
    e.evt.preventDefault(); // 阻止默认右键菜单
    e.cancelBubble = true; // 阻止事件冒泡

    const pos = this.stage.getPointerPosition();
    if (!pos) return;

    const task = this.getTaskByPosition(pos);
    if (task) {
      const time = this.getTimeByPosition(pos);
      this.context.event.emit(EventName.ROW_CONTEXTMENU, e.evt, task, time);
    }
  }

  /**
   * 按照位置获取任务
   */
  private getTaskByPosition(pos: { x: number; y: number }): Task | null {
    const headerHeight = this.context.getOptions().header.height;
    if (pos.y <= headerHeight) return null;

    const adjustedY = pos.y - this.offsetY;
    const flatIndex = Math.floor(
      (adjustedY - headerHeight) / this.context.getOptions().row.height
    );

    const visibleTasks = this.context.store.getDataManager().getVisibleTasks();
    return visibleTasks[flatIndex] || null;
  }

  /**
   * 按照位置获取时间
   */
  private getTimeByPosition(pos: { x: number; y: number }): Dayjs {
    return this.context.store.getTimeAxis().getTimeByLeft(pos.x - this.offsetX);
  }

  /**
   * 高亮指定行
   */
  private highlightRow(id: string): void {
    if (this.highlightedRowId === id) return;

    this.highlightedRowId = id;

    // 查找对应行的位置
    const rowNode = this.rowsCache.get(`chart-row-${id}`);
    if (!rowNode) return;

    // 清除旧的高亮
    if (this.highlightRect) {
      this.highlightRect.destroy();
    }

    // 如果选中行与高亮行相同，则不创建高亮矩形
    if (this.selectedRowId === id) return;

    const task = this.context.store.getDataManager().getTaskById(id);
    if (task) {
      const rowY = task.flatIndex * this.context.getOptions().row.height;
      const y = rowY + this.context.getOptions().header.height;

      // 创建高亮矩形
      this.highlightRect = new Konva.Rect({
        x: 0,
        y: y + this.offsetY,
        width: this.width,
        height: this.context.getOptions().row.height,
        fill: colorjs(this.context.getOptions().row.hover.backgroundColor)
          .alpha(this.context.getOptions().row.hover.opacity)
          .toHex(),
        name: "highlight-rect"
      });

      // 添加到层中，但确保在行组之下
      this.layer.add(this.highlightRect);
      this.highlightRect.moveToBottom();

      this.layer.batchDraw();
    }
  }

  /**
   * 取消行高亮
   */
  private unhighlightRow(id?: string): void {
    if (this.highlightedRowId !== id) return;

    this.highlightedRowId = null;

    if (this.highlightRect) {
      this.highlightRect.destroy();
      this.highlightRect = null;
      this.layer.batchDraw();
    }
  }

  /**
   * 更新高亮矩形的位置
   */
  private updateHighlightPosition(diff?: number): void {
    if (!this.highlightRect || this.highlightedRowId === null) return;

    const rowNode = this.rowsCache.get(`chart-row-${this.highlightedRowId}`);
    if (!rowNode) {
      this.clearHighlight();
      return;
    }

    if (diff) {
      this.highlightRect.y(this.highlightRect.y() + diff);
    } else {
      const task = this.context.store.getDataManager().getTaskById(rowNode.task.id);
      if (!task) {
        this.clearHighlight();
        return;
      }
      const rowY = task.flatIndex * this.context.getOptions().row.height;
      const y = rowY + this.context.getOptions().header.height;
      this.highlightRect.y(y + this.offsetY);
    }

    this.layer.batchDraw();
  }

  /**
   * 清除内容
   */
  private clearHighlight(): void {
    // 也清除高亮状态
    if (this.highlightRect) {
      this.highlightRect.destroy();
      this.highlightRect = null;
    }

    this.highlightedRowId = null;
  }

  /**
   * 选中指定行
   */
  private selectRow(id: string): void {
    this.selectedRowId = id;

    const rowNode = this.rowsCache.get(`chart-row-${id}`);
    if (!rowNode) return;

    // 清除旧的选中
    if (this.selectedRect) {
      this.selectedRect.destroy();
    }

    // 不能移除高亮矩形，否则 stage 不会触发双击事件。特殊处理成透明颜色，与 table 颜色保持一致
    if (this.selectedRowId === this.highlightedRowId) {
      this.highlightRect?.fill("transparent");
    }

    const task = this.context.store.getDataManager().getTaskById(id);
    if (!task) return;
    const rowY = task.flatIndex * this.context.getOptions().row.height;
    const y = rowY + this.context.getOptions().header.height;

    // 创建新的选中矩形
    this.selectedRect = new Konva.Rect({
      x: 0,
      y: y + this.offsetY,
      width: this.width,
      height: this.context.getOptions().row.height,
      fill: colorjs(this.context.getOptions().row.select.backgroundColor)
        .alpha(this.context.getOptions().row.select.opacity)
        .toHex(),
      name: "selected-rect"
    });

    // 添加到层中，但确保在行组之下
    this.layer.add(this.selectedRect);
    this.selectedRect.moveToBottom();

    this.layer.batchDraw();
  }

  /**
   * 取消选中指定行
   */
  private unselectRow(id?: string): void {
    if (this.selectedRowId !== id) return;

    this.selectedRowId = null;

    if (this.selectedRect) {
      this.selectedRect.destroy();
      this.selectedRect = null;
      this.layer.batchDraw();
    }
  }

  /**
   * 更新选中矩形的位置
   */
  private updateSelectedPosition(diff: number): void {
    if (!this.selectedRect || this.selectedRowId === null) return;

    const rowNode = this.rowsCache.get(`chart-row-${this.selectedRowId}`);
    if (!rowNode) {
      return;
    }

    if (this.context.store.getDataManager().isTaskVisible(rowNode.task)) {
      const rowY =
        rowNode.task.flatIndex * this.context.getOptions().row.height;
      const y = rowY + this.context.getOptions().header.height;

      this.selectedRect.y(y + this.offsetY);
      this.layer.batchDraw();
    } else {
      // 如果行不可见，直接销毁选中矩形
      this.selectedRect.destroy();
      this.selectedRect = null;
      this.selectedRowId = null;
    }
  }

  /**
   * 销毁层
   */
  public destroy(): void {
    this.rowsCache.clear();
    this.rowsGroup.destroy();
    this.rowBgGroup.destroy();
  }
}
