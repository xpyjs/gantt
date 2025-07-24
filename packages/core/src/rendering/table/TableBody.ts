/*
 * @Author: JeremyJone
 * @Date: 2025-04-18 11:01:19
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-07-18 15:13:47
 * @Description: 表格主体渲染管理器，使用table元素支持单元格合并
 */

import { IContext } from "@/types/render";
import { TableRow } from "./TableRow";
import type { Task } from "@/models/Task";

export class TableBody {
  private element: HTMLDivElement;

  private rows: Map<string, TableRow> = new Map();
  private mergeRows: Map<string, TableRow> = new Map();

  constructor(private context: IContext, private container: HTMLElement) {
    // 创建表格元素
    this.element = document.createElement("div");
    this.element.className = "x-gantt-table-body";
    this.element.style.width = "100%";
    this.element.style.position = "relative";

    this.container.appendChild(this.element);
  }

  public render(top: number, tasks: Task[]) {
    // 每次渲染，都需要移除临时合并的数据行
    this.mergeRows.forEach(row => row.remove());
    this.mergeRows.clear();

    // 获取需要渲染的任务ID集合
    const needRenderKeys = new Set<string>();
    tasks.forEach(task => {
      needRenderKeys.add(task.id);
    });

    // 找出需要移除的行
    const toRemove: string[] = [];
    this.rows.forEach((_, key) => {
      if (!needRenderKeys.has(key)) {
        toRemove.push(key);
      }
    });

    // 移除不需要的行
    toRemove.forEach(key => {
      const row = this.rows.get(key);
      if (row) {
        row.remove();
      }
      this.rows.delete(key);
    });

    // 创建或更新行
    tasks.forEach((task, index) => {
      const taskId = task.id;

      // 如果行已存在，更新单元格
      if (this.rows.has(taskId)) {
        const row = this.rows.get(taskId)!;
        row.update(task);
        row.updateTop(top);
      } else {
        // 创建新行
        const row = new TableRow(this.context, this.element, task, top);
        // 创建单元格
        row.create();

        this.rows.set(taskId, row);
      }

      // 添加合并的行。用于补充可视范围之外的合并行的数据（向下滚动，会出现合并行数据移出可视范围，合并后的 cell 数据丢失）
      this.context.store
        .getColumnManager()
        .getLeafColumns()
        .forEach((c, i) => {
          const info = this.context.store
            .getColumnManager()
            .getMergeInfo(task.id, i);
          if (info && info.rowspan > 1) {
            // 跨行才做
            const id = info.task.id;
            if (!this.rows.has(id) && !this.mergeRows.has(id)) {
              const row = new TableRow(
                this.context,
                this.element,
                info.task,
                top,
                true
              );
              row.create();
              this.mergeRows.set(id, row);
            }
          }
        });
    });
  }

  /**
   * 刷新所有行
   */
  public refresh(top: number, tasks: Task[]) {
    this.rows.forEach(row => {
      row.remove();
    });
    this.rows.clear();

    this.render(top, tasks);
  }

  /**
   * 更新任务
   */
  public updateTask(task: Task) {
    if (this.rows.has(task.id)) {
      const row = this.rows.get(task.id)!;
      row.update(task);
    }
  }

  /** 更新全部行 */
  public update() {
    this.rows.forEach(row => {
      row.create();
    });
  }

  /**
   * 更新列宽
   */
  public updateWidth() {
    this.rows.forEach(row => {
      row.updateWidth();
    });

    this.mergeRows.forEach(row => {
      row.updateWidth();
    });
  }
}
