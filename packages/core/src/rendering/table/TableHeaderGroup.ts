/*
 * @Author: JeremyJone
 * @Date: 2025-04-25 14:21:32
 * @LastEditors: JeremyJone
 * @LastEditTime: 2026-01-10 19:31:38
 * @Description: 表格分组表头
 */

import { IContext } from "@/types/render";
import { wrapSize } from "../../utils/size";
import { TableHeaderCell } from "./TableHeaderCell";
import { ITableColumnStandard } from "@/types/table";
import { IColumn } from "@/store/ColumnManager";
import { autoColor } from "../../utils/color";

export class TableHeaderGroup {
  private groupElement: HTMLElement;
  private titleContainer: HTMLElement;
  private childContainer: HTMLElement;
  private children: Array<TableHeaderCell | TableHeaderGroup> = [];

  constructor(
    private context: IContext,
    private root: HTMLElement,
    private container: HTMLElement,
    private column: IColumn
  ) {
    this.groupElement = document.createElement("div");
    this.titleContainer = document.createElement("div");
    this.childContainer = document.createElement("div");
    this.initElement();
    this.initChildren();
    this.container.appendChild(this.groupElement);
  }

  private initElement() {
    // 根据层级和最大层级计算标题和子容器的高度比例
    const headerHeight = this.context.getOptions().header.height;
    const levelHeight = headerHeight / this.column.maxLevel;

    this.groupElement.className = "x-gantt-table-header-group";
    if (
      this.context.store.getColumnManager().isMultiHeader() ||
      this.context.getOptions().border.show
    ) {
      this.groupElement.classList.add("border");
    }
    this.groupElement.style.display = "flex";
    this.groupElement.style.flexShrink = "0";
    this.groupElement.style.flexGrow = "0";
    this.groupElement.style.flexDirection = "column";
    this.groupElement.style.height = "100%";
    this.groupElement.style.overflow = "hidden";
    this.groupElement.style.boxSizing = "border-box";

    // 设置标题样式
    this.titleContainer.className = "x-gantt-table-header-cell";
    if (
      this.context.store.getColumnManager().isMultiHeader() ||
      this.context.getOptions().border.show
    ) {
      this.titleContainer.classList.add("border");
    }
    this.titleContainer.style.height = `${levelHeight}px`;
    this.titleContainer.style.flex = "0 0 auto";
    this.titleContainer.style.display = "flex";
    this.titleContainer.style.alignItems =
      this.context.getOptions().table.headerAlign;
    this.titleContainer.style.justifyContent = "center";
    this.titleContainer.style.padding = "0 8px";
    this.titleContainer.style.boxSizing = "border-box";
    this.titleContainer.style.overflow = "hidden";
    this.titleContainer.style.whiteSpace = "nowrap";
    if (this.context.getOptions().table.ellipsis) {
      this.titleContainer.style.textOverflow = "ellipsis";
    }
    this.titleContainer.style.borderBottom = `1px solid ${
      this.context.getOptions().border.color
    }`;
    this.titleContainer.style.setProperty(
      "border-color",
      this.context.getOptions().border.color,
      "important"
    );
    this.titleContainer.style.fontWeight = `${
      this.context.getOptions().header.fontWeight
    }`;
    this.titleContainer.style.fontSize = wrapSize(
      this.context.getOptions().header.fontSize
    );
    this.titleContainer.style.fontFamily =
      this.context.getOptions().header.fontFamily;
    this.titleContainer.style.setProperty(
      "color",
      autoColor(this.context.getOptions().header.color, this.context.getOptions().header.backgroundColor || this.context.getOptions().primaryColor),
      "important"
    );

    this.titleContainer.textContent = this.column.label || "";

    // 设置子列容器样式
    this.childContainer.className = "x-gantt-table-header-children";
    this.childContainer.style.flex = "1 0 auto";
    this.childContainer.style.display = "flex";
    this.childContainer.style.width = "100%";

    this.groupElement.appendChild(this.titleContainer);
    this.groupElement.appendChild(this.childContainer);
  }

  private initChildren() {
    this.column.children.forEach(child => {
      if (child.isLeaf) {
        // 处理叶子列
        const column = new TableHeaderCell(
          this.context,
          this.root,
          this.childContainer,
          child as unknown as IColumn<ITableColumnStandard>
        );
        this.children.push(column);
      } else {
        if (child.children.length > 0) {
          // 处理子组
          const group = new TableHeaderGroup(
            this.context,
            this.root,
            this.childContainer,
            child
          );
          this.children.push(group);
        }
      }
    });
  }
}
