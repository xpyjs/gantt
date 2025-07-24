/*
 * @Author: JeremyJone
 * @Date: 2025-05-09 17:06:07
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-06-18 09:26:09
 * @Description: 表格和图表中间的移动线
 */

import { IContext } from "@/types/render";
import { EventName } from "../../event";

export class MiddleResizeLine {
  private line: HTMLDivElement;
  private initialX: number = 0;
  private initialWidth: number = 0;

  constructor(private root: IContext, private container: HTMLElement) {
    // 创建一个用于包含表格组件的容器
    this.line = document.createElement("div");
    this.line.className = "x-gantt-middle-resize-line";
    this.line.style.position = "absolute";
    this.line.style.zIndex = "99";
    this.line.style.width = "5px";
    this.line.style.height = "100%";
    this.line.style.borderLeft = "2px solid";
    this.line.style.setProperty(
      "border-left-color",
      this.root.store.getOptionManager().getOptions().border.color,
      "important"
    );
    this.line.style.cursor = "col-resize";

    this.container.appendChild(this.line);

    // 添加拖拽功能
    this.addDragEvents();
  }

  public setOffset(x: number) {
    this.line.style.left = `${x - 2}px`;
    this.initialX = x;
  }

  /**
   * 添加拖拽事件
   */
  private addDragEvents() {
    let startX = 0;
    let rootRect: DOMRect | null = null;
    const columnManager = this.root.store.getColumnManager();
    const leafColumns = columnManager.getLeafColumns();

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // 记录初始鼠标位置
      startX = e.clientX;
      // 获取容器相对于视口的位置
      rootRect = this.container.getBoundingClientRect();
      // 获取最后一列的初始宽度
      const lastColumnKey = leafColumns[leafColumns.length - 1].key;
      this.initialWidth = columnManager.getColumnWidth(lastColumnKey);

      // 显示指导线
      const guidelineLeft = parseInt(this.line.style.left) + 2; // 加回偏移量
      this.root.event.emit(EventName.SHOW_GUIDELINE, guidelineLeft);

      // 添加移动和抬起事件监听
      const mouseMoveHandler = (e: MouseEvent) => onMouseMove(e);
      const mouseUpHandler = (e: MouseEvent) =>
        onMouseUp(e, mouseMoveHandler, mouseUpHandler);

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    };

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();

      if (!rootRect) return;

      // 计算鼠标移动的距离
      const deltaX = e.clientX - startX;

      // 获取最后一列
      const lastColumnKey = leafColumns[leafColumns.length - 1].key;

      // 限制移动范围，防止最后一列宽度小于50px
      const minDeltaX = 50 - this.initialWidth;

      // 计算最大允许移动距离
      // 防止超出右侧边界，考虑在rootRect.width的基础上，而不是container的宽度
      // 最大位置应该是rootRect.width - 20
      const maxLeft = rootRect.width - 20; // 右侧保留20px的间距
      const maxDeltaX = maxLeft - this.initialX;

      // 双向限制：不能小于最小宽度，也不能超过最大宽度
      const limitedDeltaX = Math.max(minDeltaX, Math.min(maxDeltaX, deltaX));

      // 计算新位置（当前位置 + 受限的鼠标移动距离）
      const newLeft = this.initialX + limitedDeltaX;

      // 更新指导线位置
      this.root.event.emit(EventName.MOVE_GUIDELINE, newLeft);
    };

    const onMouseUp = (
      e: MouseEvent,
      mouseMoveHandler: (e: MouseEvent) => void,
      mouseUpHandler: (e: MouseEvent) => void
    ) => {
      // 移除事件监听
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);

      // 隐藏指导线
      this.root.event.emit(EventName.HIDE_GUIDELINE);

      // 计算最终位置
      const deltaX = e.clientX - startX;

      // 获取最后一列
      const lastColumnKey = leafColumns[leafColumns.length - 1].key;

      // 计算新宽度（考虑最小宽度限制）
      const newWidth = Math.max(50, this.initialWidth + deltaX);

      // 更新最后一列宽度
      columnManager.setColumnWidth(lastColumnKey, newWidth);

      // 更新表头
      this.root.event.emit(EventName.UPDATE_TABLE_HEADER);
    };

    // 添加鼠标按下事件监听
    this.line.addEventListener("mousedown", onMouseDown);
  }
}
