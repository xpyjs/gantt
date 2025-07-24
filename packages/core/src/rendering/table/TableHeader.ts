/*
 * @Author: JeremyJone
 * @Date: 2025-04-25 14:21:32
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-06-19 15:54:30
 * @Description: 表格表头
 */

import { IContext } from "@/types/render";
import { TableHeaderCell } from "./TableHeaderCell";
import { TableHeaderGroup } from "./TableHeaderGroup";
import { ITableColumnStandard } from "@/types/table";
import { IColumn } from "@/store/ColumnManager";

export class TableHeader {
  private headerElement: HTMLElement;
  private headerColumns: Array<TableHeaderCell | TableHeaderGroup> = [];

  constructor(private context: IContext, private container: HTMLElement) {
    // 创建表头容器 - 保留div结构，以保持现有功能
    this.headerElement = document.createElement("div");
    this.initElement();
    this.container.appendChild(this.headerElement);
  }

  private initElement() {
    this.headerElement.className = "x-gantt-table-header";
    this.headerElement.style.display = "flex";
    this.headerElement.style.height = `${
      this.context.getOptions().header.height
    }px`;
    this.headerElement.style.minHeight = `${Math.max(
      this.context.getOptions().header.height,
      30
    )}px`; // 确保在flex布局中不被压缩
    this.headerElement.style.setProperty(
      "background-color",
      this.context.getOptions().header.backgroundColor ||
        this.context.getOptions().primaryColor,
      "important"
    );
    this.headerElement.style.setProperty(
      "color",
      this.context.getOptions().header.color,
      "important"
    );
    this.headerElement.style.fontSize = `${
      this.context.getOptions().header.fontSize
    }px`;
    this.headerElement.style.fontWeight = `${
      this.context.getOptions().header.fontWeight
    }`;
    this.headerElement.style.zIndex = "10"; // 降低z-index但仍保持在表格主体之上
    this.headerElement.style.width = "100%";
    this.headerElement.style.flexShrink = "0"; // 防止在flex布局中被压缩

    // 确保边框样式与表格一致
    this.headerElement.style.borderBottom = `1px solid ${
      this.context.getOptions().border.color
    }`;
    this.headerElement.style.setProperty(
      "border-color",
      this.context.getOptions().border.color,
      "important"
    );
  }

  /**
   * 渲染表头
   */
  public render(): void {
    this.headerColumns = [];
    this.headerElement.innerHTML = "";

    this.initElement();

    // 从 ColumnManager 获取列数据
    const columnManager = this.context.store.getColumnManager();
    const columns = columnManager.getColumns();

    // 先渲染操作列
    if (columnManager.getHandlerColumn().width !== 0) {
      const handlerColumn = new TableHeaderCell(
        this.context,
        this.headerElement,
        this.headerElement,
        columnManager.getHandlerColumn()
      );
      this.headerColumns.push(handlerColumn);
    }

    // 渲染列
    columns.forEach(column => {
      if (column.isLeaf) {
        const headerColumn = new TableHeaderCell(
          this.context,
          this.headerElement,
          this.headerElement,
          column as unknown as IColumn<ITableColumnStandard>
        );
        this.headerColumns.push(headerColumn);
      } else {
        if (column.children.length > 0) {
          const group = new TableHeaderGroup(
            this.context,
            this.headerElement,
            this.headerElement,
            column
          );
          this.headerColumns.push(group);
        }
      }
    });
  }
}
