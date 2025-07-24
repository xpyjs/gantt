/*
 * @Author: JeremyJone
 * @Date: 2025-04-18 11:01:19
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-07-21 14:46:44
 * @Description: 表格行渲染管理器
 */

import { Logger } from "../../utils/logger";
import { TableCell } from "./TableCell";
import { EventName } from "../../event";
import { IContext } from "@/types/render";
import type { Task } from "@/models/Task";
import { MergeInfo } from "@/store/ColumnManager";

export class TableRow {
  // 行元素
  public element: HTMLDivElement;

  // 行内单元格集合
  private cells: TableCell[] = [];

  /**
   * 创建表格行
   * @param context 上下文
   * @param container 父容器
   * @param task 任务数据
   */
  constructor(
    private context: IContext,
    private container: HTMLDivElement,
    private task: Task,
    private top: number,
    raising = false
  ) {
    // 创建行元素
    this.element = document.createElement("div");
    this.element.className = "x-gantt-table-row";
    this.element.style.display = "flex";
    this.element.style.flexDirection = "row";
    this.element.style.flexWrap = "nowrap";
    this.element.style.position = "absolute";
    this.element.style.pointerEvents = "none";
    this.element.style.width = `${this.context.store
      .getColumnManager()
      .getTotalWidth()}px`;

    if (raising) {
      this.raise();
    }

    // 更新行样式
    this.updateStyles();

    // 添加到容器
    this.container.appendChild(this.element);

    // 添加事件
    this.bindEvents();

    // 注册事件
    this.registerEvents();
  }

  /**
   * 绑定触发事件
   */
  private bindEvents(): void {
    this.element.addEventListener("mouseenter", () => {
      this.context.event.emit(EventName.ROW_HIGHLIGHT, this.task.id);
    });

    this.element.addEventListener("mouseleave", () => {
      this.context.event.emit(EventName.ROW_UNHIGHLIGHT, this.task.id);
    });

    this.element.addEventListener("click", e => {
      if (this.context.store.getDataManager().isTaskSelected(this.task.id))
        return;

      this.context.store.getDataManager().selectTask(this.task.id);
      this.context.event.emit(EventName.ROW_CLICK, e, this.task);
    });

    this.element.addEventListener("dblclick", e => {
      this.context.event.emit(EventName.ROW_DBL_CLICK, e, this.task);
    });

    this.element.addEventListener("contextmenu", e => {
      e.preventDefault();
      this.context.store.getDataManager().selectTask(this.task.id);
      this.context.event.emit(EventName.ROW_CONTEXTMENU, e, this.task.id);
    });
  }

  /**
   * 注册全局接收事件
   */
  private registerEvents() {
    this.context.event.on(EventName.ROW_HIGHLIGHT, (id: string) => {
      if (this.task.id === id) {
        this.element.classList.add("hover");
      } else {
        this.element.classList.remove("hover");
      }
    });

    this.context.event.on(EventName.ROW_UNHIGHLIGHT, (id: string) => {
      if (this.task.id === id) {
        this.element.classList.remove("hover");
      }
    });

    this.context.event.on(EventName.TASK_SELECTED, (task: Task) => {
      if (this.task.id === task.id) {
        this.element.classList.add("selected");
      }
    });

    this.context.event.on(EventName.TASK_UNSELECTED, (id: string) => {
      if (this.task.id === id) {
        this.element.classList.remove("selected");
      }
    });
  }

  /**
   * 更新行样式
   */
  private updateStyles(): void {
    this.updateTop(this.top);

    // 获取任务状态
    const isSelected = this.context.store
      .getDataManager()
      .isTaskSelected(this.task.id);

    // TODO 设置样式
    this.element.style.backgroundColor = this.context.store
      .getOptionManager()
      .getRowBackgroundColor(this.task);
  }

  /**
   * 对元素提级
   */
  raise() {
    this.element.style.zIndex = "2";
  }

  /**
   * 更新 top 值
   */
  updateTop(top: number) {
    this.top = top;
    const rowHeight = this.context.store.getOptionManager().getOptions()
      .row.height;
    this.element.style.top = `${-this.top + this.task.flatIndex * rowHeight}px`;
  }

  /**
   * 创建单元格
   */
  public create(): void {
    // 清除现有单元格
    this.clearCells();

    // 创建操作列
    const handlerColumn = this.context.store
      .getColumnManager()
      .getHandlerColumn();
    if (handlerColumn.width !== 0) {
      // 创建单元格
      const cell = new TableCell(
        this.context,
        this.element,
        handlerColumn,
        this.task,
        this.task.flatIndex,
        -1,
        1,
        1,
        "handler"
      );

      // 将单元格添加到单元格集合
      this.cells.push(cell);
    }

    // 获取列配置
    const columns = this.context.store.getColumnManager().getLeafColumns();

    // 遍历列配置创建单元格
    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      // 跳过已被合并覆盖的位置
      const column = columns[colIndex];

      const mergeInfo = this.context.store
        .getColumnManager()
        .getMergeInfo(this.task.id, colIndex);

      // 合并信息记录了已经存在的合并记录，如果有记录，需要考虑使用合并数据
      if (!mergeInfo) {
        // 处理单元格合并
        let colspan = 1;
        let rowspan = 1;

        const _m = column.column.merge?.(
          this.task.getField(column.column.field),
          this.task.data,
          colIndex,
          this.task.level + 1 // 与 EmitData 保持一致
        );
        if (_m) {
          if (typeof _m.col !== "number") {
            Logger.error("colspan function must returned a number");
          } else {
            colspan = _m.col;
          }

          if (typeof _m.row !== "number") {
            Logger.error("rowspan function must returned a number");
          } else {
            rowspan = _m.row;
          }
        }

        if (colspan > 1 || rowspan > 1) {
          // 有合并的，对整行提级
          // this.raise();

          // 跨行合并，只有同层级数据可以合并
          if (rowspan > 1) {
            for (let i = 1; i < rowspan; i++) {
              const _t = this.context.store.getDataManager().getVisibleTasks()[
                this.task.flatIndex + i
              ];
              if (_t) {
                if (this.task.level !== _t.level) {
                  rowspan = i;
                  break;
                }
              }
            }
          }

          const mergeInfo: MergeInfo = {
            task: this.task,
            originColumnIndex: colIndex,
            colspan,
            rowspan
          };
          // 记录跨行信息
          let _task: Task | undefined = this.task;
          for (let i = rowspan; i > 0; i--) {
            if (_task) {
              for (let j = 0; j < colspan; j++) {
                this.context.store
                  .getColumnManager()
                  .addMergeInfo(_task.id, j + colIndex, mergeInfo);
              }

              _task = this.context.store
                .getDataManager()
                .getVisibleTasks()
                .at(_task.flatIndex + 1);
            }
          }

          // 记录跨列信息（当前任务行）
          for (let i = 0; i < colspan; i++) {
            this.context.store
              .getColumnManager()
              .addMergeInfo(this.task.id, i + colIndex, mergeInfo);
          }
        }

        // 创建单元格
        const cell = new TableCell(
          this.context,
          this.element,
          column,
          this.task,
          this.task.flatIndex,
          colIndex,
          colspan,
          rowspan
        );
        // 将单元格添加到单元格集合
        this.cells.push(cell);
      } else if (mergeInfo.task.id !== this.task.id) {
        // 创建单元格
        const cell = new TableCell(
          this.context,
          this.element,
          column,
          this.task,
          this.task.flatIndex,
          colIndex,
          1,
          1,
          "empty"
        );

        // 将被合并行的背景色置为空
        this.element.style.backgroundColor = "transparent";
        this.raise();

        // 将单元格添加到单元格集合
        this.cells.push(cell);
      } else {
        // 如果是合并行，直接使用合并行的任务数据
        const cell = new TableCell(
          this.context,
          this.element,
          column,
          mergeInfo.task,
          mergeInfo.task.flatIndex,
          colIndex,
          mergeInfo.colspan,
          mergeInfo.rowspan
        );

        // 将单元格添加到单元格集合
        this.cells.push(cell);
      }
    }

    if (this.context.store.getDataManager().isTaskSelected(this.task.id)) {
      this.element.classList.add("selected");
    }
  }

  /**
   * 更新行
   */
  update(task: Task) {
    // 更新任务数据
    this.task = task;

    this.create();
  }

  /**
   * 更新宽度
   */
  updateWidth() {
    this.element.style.width = `${this.context.store
      .getColumnManager()
      .getTotalWidth()}px`;

    this.cells.forEach(cell => cell.updateWidth());
  }

  /**
   * 清除单元格
   */
  private clearCells(): void {
    // 移除所有单元格
    this.cells.forEach(cell => cell.remove());
    this.cells = [];

    // 清空行内容
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
  }

  /**
   * 移除行
   */
  public remove(): void {
    // 清除单元格
    this.clearCells();

    // 移除行元素
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
