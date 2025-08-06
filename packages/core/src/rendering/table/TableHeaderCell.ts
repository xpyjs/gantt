/*
 * @Author: JeremyJone
 * @Date: 2025-04-25 14:21:32
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-06-19 15:54:21
 * @Description: 表格列表头
 */

import { ITableColumnStandard } from "@/types/table";
import { EventName } from "../../event";
import { wrapSize } from "../../utils/size";
import { IContext } from "@/types/render";
import { IColumn } from "@/store/ColumnManager";

export class TableHeaderCell {
  private columnElement: HTMLElement;

  constructor(
    private context: IContext,
    private root: HTMLElement,
    private container: HTMLElement,
    private column: IColumn<ITableColumnStandard>
  ) {
    this.columnElement = document.createElement("div");
    this.initElement();
    this.container.appendChild(this.columnElement);
  }

  private initElement() {
    // 从 ColumnManager 获取列宽
    const columnManager = this.context.store.getColumnManager();
    const width = columnManager.getColumnWidth(this.column.key);
    const align =
      this.column.column.headerAlign ||
      this.context.getOptions().table.headerAlign;
    const ellipsis =
      this.column.column.ellipsis ??
      this.context.getOptions().table.ellipsis ??
      true

    this.columnElement.className = "x-gantt-table-header-cell";
    if (
      columnManager.isMultiHeader() ||
      this.context.getOptions().border.show
    ) {
      this.columnElement.classList.add("border");
    }
    this.columnElement.style.height = "100%";
    this.columnElement.style.width = `${width}px`;
    this.columnElement.style.display = "flex";
    this.columnElement.style.flexShrink = "0";
    this.columnElement.style.alignItems = "center";
    this.columnElement.style.padding = "0 8px";
    this.columnElement.style.boxSizing = "border-box";
    this.columnElement.style.setProperty(
      "border-color",
      this.context.getOptions().border.color,
      "important"
    );

    const cellContent = document.createElement("div");
    cellContent.className = "x-gantt-table-header-cell__content";
    cellContent.style.flex = "1";
    cellContent.style.textAlign = align;
    cellContent.style.overflow = "hidden";
    cellContent.style.whiteSpace = "nowrap";
    if (ellipsis) {
      cellContent.style.textOverflow = "ellipsis";
    }
    cellContent.style.position = "relative";
    cellContent.style.fontWeight = `${
      this.context.getOptions().header.fontWeight
    }`;
    cellContent.style.fontSize = wrapSize(
      this.context.getOptions().header.fontSize
    );
    cellContent.style.setProperty(
      "color",
      this.context.getOptions().header.color,
      "important"
    );
    cellContent.style.fontFamily = this.context.getOptions().header.fontFamily;

    // 自定义表头渲染
    if (this.column.column.headerRender) {
      const content = this.column.column.headerRender();
      if (typeof content === "string") {
        cellContent.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        cellContent.innerHTML = "";
        cellContent.appendChild(content);
      }
    } else {
      cellContent.textContent =
        this.column.label || this.column.column.label || "";
    }

    // 应用自定义样式
    if (this.column.column.customStyle) {
      Object.assign(cellContent.style, this.column.column.customStyle);
    }

    this.columnElement.appendChild(cellContent);

    this.addResizeHandle();
  }

  /**
   * 设置列宽
   */
  private setWidth(width: number) {
    this.columnElement.style.width = `${width}px`;

    // 同步更新到 ColumnManager
    this.context.store
      .getColumnManager()
      .setColumnWidth(this.column.key, width);
  }

  /**
   * 添加拖拽把手
   */
  private addResizeHandle() {
    if (
      this.column.column.resizable === false ||
      this.context.store.getColumnManager().isLastColumn(this.column.key)
    )
      return;

    const resizeHandle = document.createElement("div");
    resizeHandle.className = "x-gantt-column-resize-handle";
    resizeHandle.style.position = "absolute";
    resizeHandle.style.top = "0";
    resizeHandle.style.right = "0";
    resizeHandle.style.width = "5px";
    resizeHandle.style.height = "100%";
    resizeHandle.style.cursor = "col-resize";
    resizeHandle.style.zIndex = "2";

    this.columnElement.appendChild(resizeHandle);

    let startX = 0;
    let startWidth = 0;
    let rootRect: DOMRect | null = null;
    let guidelineLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      startX = e.clientX;
      startWidth = this.columnElement.offsetWidth;
      rootRect = this.root.getBoundingClientRect();

      const mouseMoveHandler = (e: MouseEvent) => onMouseMove(e);
      const mouseUpHandler = (e: MouseEvent) =>
        onMouseUp(e, mouseMoveHandler, mouseUpHandler);

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);

      // 精确计算指示线位置，考虑鼠标在拖拽把手上的位置
      guidelineLeft = startX - rootRect.left;

      // 触发显示指示线事件
      this.context.event.emit(EventName.SHOW_GUIDELINE, guidelineLeft);
    };

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();

      if (!rootRect) return;

      // 计算鼠标移动的距离
      const deltaX = e.clientX - startX;
      // 计算拖动后的预期宽度
      const potentialNewWidth = startWidth + deltaX;
      // 应用最小宽度限制（50px）
      const constrainedWidth = Math.max(50, potentialNewWidth);

      // 计算列的起始左侧位置（相对于 root）
      // 初始右侧位置 = startX - rootRect.left
      // 初始左侧位置 = 初始右侧位置 - startWidth
      const columnStartLeftRelativeToRoot = startX - rootRect.left - startWidth;

      // 获取容器宽度，添加右侧限制
      const containerWidth = this.root.clientWidth;
      const maxLeft = containerWidth - 20; // 右侧保留20px的间距

      // 计算引导线的新位置（列的右边界相对于 root 的位置）
      let guidelineLeft = columnStartLeftRelativeToRoot + constrainedWidth;

      // 限制引导线位置不超过最大值
      guidelineLeft = Math.min(maxLeft, guidelineLeft);

      // 更新指示线位置
      this.context.event.emit(EventName.MOVE_GUIDELINE, guidelineLeft);
    };

    const onMouseUp = (
      e: MouseEvent,
      mouseMoveHandler: (e: MouseEvent) => void,
      mouseUpHandler: (e: MouseEvent) => void
    ) => {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);

      // 隐藏指示线
      this.context.event.emit(EventName.HIDE_GUIDELINE);

      // 计算最终宽度，考虑鼠标偏移
      const diff = e.clientX - startX;
      const newWidth = Math.max(50, startWidth + diff);
      this.setWidth(newWidth);
    };

    resizeHandle.addEventListener("mousedown", onMouseDown);
  }
}
