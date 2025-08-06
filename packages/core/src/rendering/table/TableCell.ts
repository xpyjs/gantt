/*
 * @Author: JeremyJone
 * @Date: 2025-04-25 10:30:00
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-08-06 17:40:31
 * @Description: 表格单元格渲染，使用td元素支持合并
 */

import { IContext } from "@/types/render";
import { Logger } from "../../utils/logger";
import { wrapSize } from "../../utils/size";
import { Checkbox } from "./Checkbox";
import { ITableColumnStandard } from "@/types/table";
import type { Task } from "@/models/Task";
import { IColumn } from "@/store/ColumnManager";

export class TableCell {
  private element: HTMLDivElement;

  private isEmpty = false;
  private isHandler = false;

  /**
   * 创建表格单元格
   * @param container 父容器（tr元素）
   * @param column 列配置
   * @param task 任务数据
   * @param level 任务层级
   * @param rowIndex 行索引
   * @param colIndex 列索引
   * @param colspan 横向合并的列数
   * @param rowspan 纵向合并的行数
   */
  constructor(
    private context: IContext,
    private container: HTMLDivElement,
    private column: IColumn<ITableColumnStandard>,
    private task: Task,
    private rowIndex: number,
    private colIndex: number,
    private colspan: number = 1,
    private rowspan: number = 1,
    type?: "empty" | "handler"
  ) {
    this.isEmpty = type === "empty";
    this.isHandler = type === "handler";

    this.element = document.createElement("div");
    this.element.className = "x-gantt-table-cell";
    this.element.style.boxSizing = "border-box";
    this.element.style.display = "inline-flex";
    this.element.style.flexShrink = "0";
    this.element.style.flexGrow = "0";
    this.element.style.flexBasis = "auto";
    this.element.style.pointerEvents = "all";
    this.element.style.setProperty(
      "border-color",
      this.context.getOptions().border.color,
      "important"
    );

    // 设置对齐方式
    this.element.style.textAlign =
      this.column.column.align || this.context.getOptions().table.align;
    // 如果最后一列不是当前列，添加右边框
    if (
      !this.context.store.getColumnManager().isLastColumn(this.column.key) &&
      this.context.getOptions().border.show &&
      !this.isEmpty
    ) {
      this.element.classList.add("border");
    }

    // 设置宽高
    this.updateWidth();
    this.updateHeight();

    if (this.isEmpty) {
      this.element.style.borderBottom = "none";
      this.element.style.pointerEvents = "none";
      this.element.style.backgroundColor = "transparent";
      this.element.style.setProperty(
        "border-color",
        "transparent",
        "important"
      );
    } else if (this.isHandler) {
      this.setHandler();
    } else {
      this.setContent();
    }

    this.container.appendChild(this.element);
  }

  private setContent() {
    const cellContent = document.createElement("div");
    cellContent.className = "x-gantt-table-cell__content";
    cellContent.style.overflow = "hidden";
    if (
      this.column.column.ellipsis ??
      this.context.getOptions().table.ellipsis ??
      true
    ) {
      cellContent.style.textOverflow = "ellipsis";
    }
    cellContent.style.whiteSpace = "nowrap";
    cellContent.style.flex = "1";
    cellContent.style.height = "100%";
    cellContent.style.alignContent = "center";

    if (this.colIndex === 0) {
      cellContent.style.paddingLeft = wrapSize(
        this.task.level * this.context.getOptions().row.indent,
        "16px"
      );
    }

    // 使用自定义渲染或默认字段值
    if (typeof this.column.column.render === "function") {
      try {
        const content = this.column.column.render(this.task.getEmitData());
        if (typeof content === "string") {
          cellContent.innerHTML = content; // 允许HTML内容
        } else if (content instanceof HTMLElement) {
          cellContent.appendChild(content);
        } else {
          Logger.warn(
            "Table cell render function does not return a valid value.",
            content
          );
        }
      } catch (error) {
        Logger.error("Table cell render error:", error);
        cellContent.textContent =
          this.task.getField(this.column.column.field) ??
          this.context.getOptions().table.emptyText;
      }
    } else {
      // 默认渲染
      cellContent.textContent =
        this.task.getField(this.column.column.field) ??
        this.context.getOptions().table.emptyText;
    }

    // 应用自定义样式
    if (this.column.column.customStyle) {
      Object.assign(cellContent.style, this.column.column.customStyle);
    }

    this.element.appendChild(cellContent);
  }

  private setHandler() {
    const cellHandler = document.createElement("div");
    cellHandler.className = "x-gantt-table-cell__content";
    cellHandler.style.overflow = "hidden";
    cellHandler.style.whiteSpace = "nowrap";
    cellHandler.style.display = "inline-flex";
    cellHandler.style.flex = "1";
    cellHandler.style.height = "100%";

    // 创建选择框
    if (this.context.getOptions().selection.enabled) {
      const checkboxContainer = document.createElement("div");
      checkboxContainer.style.display = "flex";
      checkboxContainer.style.flex = "0.5";
      checkboxContainer.style.justifyContent = "center";
      checkboxContainer.style.alignItems = "center";

      new Checkbox(this.context, checkboxContainer, this.task);

      // 添加到容器
      cellHandler.appendChild(checkboxContainer);
    }

    // 创建展开图标
    if (
      this.context.getOptions().expand.show &&
      this.task.children &&
      this.task.children.length > 0
    ) {
      const expandContainer = document.createElement("div");
      expandContainer.className = "x-gantt-table-cell__expand";
      expandContainer.style.display = "flex";
      expandContainer.style.flex = "0.5";
      expandContainer.style.color = this.context.getOptions().primaryColor;
      expandContainer.style.alignItems = "center";
      expandContainer.style.justifyContent = "center";
      expandContainer.style.height = "100%";
      expandContainer.style.width = "14px";
      expandContainer.style.height = "100%";
      expandContainer.style.cursor = "pointer";
      expandContainer.innerHTML = `<svg t="1746693752280" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2612" width="14" height="14"><path d="M724.48 521.728c-1.8432 7.7824-5.7344 14.848-11.3664 20.48l-341.9136 342.016c-16.6912 16.6912-43.7248 16.6912-60.3136 0s-16.6912-43.7248 0-60.3136L622.6944 512 310.8864 200.0896c-16.6912-16.6912-16.6912-43.7248 0-60.3136 16.6912-16.6912 43.7248-16.6912 60.3136 0l341.9136 341.9136c10.8544 10.8544 14.6432 26.112 11.3664 40.0384z" fill="currentColor" p-id="2613"></path></svg>`;
      expandContainer.style.transform = this.task.expanded
        ? "rotate(90deg)"
        : "";

      expandContainer.addEventListener("click", e => {
        e.stopPropagation(); // 阻止事件冒泡，避免触发行点击事件
        // 点击展开/收起子层
        this.context.store.getDataManager().expandTask(this.task.id, false);
      });

      cellHandler.appendChild(expandContainer);
    }

    this.element.appendChild(cellHandler);
  }

  /**
   * 移除单元格
   */
  public remove(): void {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  /**
   * 更新宽度
   */
  updateWidth() {
    if (this.isHandler) {
      this.element.style.width = wrapSize(
        this.context.store.getColumnManager().getHandlerColumn().width
      );
      return;
    }

    const width = this.context.store
      .getColumnManager()
      .getLeafColumns()
      .slice(this.colIndex, this.colIndex + Math.max(1, this.colspan))
      .reduce((p, c) => p + (c.width as number), 0);
    this.element.style.width = wrapSize(width);
  }

  /**
   * 更新高度
   */
  updateHeight() {
    const rowHeight = this.context.getOptions().row.height;
    this.element.style.height = wrapSize(rowHeight * Math.max(1, this.rowspan));
  }
}
