/*
 * @Author: JeremyJone
 * @Date: 2025-04-18 11:00:12
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-07-18 15:52:24
 * @Description: 表格渲染管理器
 */
import { IContext } from "@/types/render";
import { EventName } from "../../event";
import { TableBody } from "./TableBody";
import { TableHeader } from "./TableHeader";
import type { Task } from "@/models/Task";

export class Table {
  private tableContainer: HTMLElement;
  private tableHeader: TableHeader;
  private tableBody: TableBody;

  constructor(private context: IContext, private container: HTMLElement) {
    // 创建一个用于包含表格组件的容器
    this.tableContainer = document.createElement("div");
    this.tableContainer.className = "x-gantt-table-container";
    this.tableContainer.style.position = "relative";
    this.tableContainer.style.width = "100%";
    this.tableContainer.style.height = "100%";
    this.tableContainer.style.overflow = "hidden"; // 不允许滚动，由外部虚拟滚动条控制

    // 使用flex布局，使表头和表格主体垂直排列
    this.tableContainer.style.display = "flex";
    this.tableContainer.style.flexDirection = "column";

    this.container.appendChild(this.tableContainer);

    // 创建表头和表格体
    this.tableHeader = new TableHeader(context, this.tableContainer);
    this.tableBody = new TableBody(context, this.tableContainer);

    // 监听事件
    this.listenEvents();
  }

  public render(top: number, tasks: Task[]) {
    // 渲染表头
    this.tableHeader.render();

    // 渲染表格体 - 直接传递滚动位置值，表格体内部会根据这个值计算每行位置
    this.refresh(top, tasks);
  }

  public refresh(top: number, tasks: Task[]) {
    this.context.store.getColumnManager().clearMergeInfo();
    this.tableBody.render(top, tasks);
  }

  public updateWidth() {
    this.tableBody.updateWidth();
  }

  public updateTask(task: Task) {
    this.tableBody.updateTask(task);
  }

  private listenEvents() {
    this.context.event.on(EventName.UPDATE_TABLE_HEADER, () => {
      this.tableHeader.render();
    });

    this.context.event.on(EventName.UPDATE_TABLE_BODY, () => {
      this.tableBody.update();
    });
  }
}
