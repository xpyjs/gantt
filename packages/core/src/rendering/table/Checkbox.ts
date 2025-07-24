/*
 * @Author: JeremyJone
 * @Date: 2025-06-12 15:40:00
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-06-19 15:43:41
 * @Description: 复选框组件
 */

import { IContext } from "@/types/render";
import { EventName } from "../../event";
import { colorjs } from "../../utils/color";
import type { Task } from "@/models/Task";

export enum CheckboxState {
  UNCHECKED = 0, // 未选中
  CHECKED = 1, // 选中
  INDETERMINATE = 2 // 中间状态
}

export interface CheckboxOptions {
  initialState: CheckboxState;
  size: number;
}

export class Checkbox {
  private element: HTMLDivElement;
  private iconElement: HTMLDivElement;
  private _state: CheckboxState = CheckboxState.UNCHECKED;
  private options: CheckboxOptions;

  constructor(
    private context: IContext,
    private container?: HTMLDivElement,
    private task?: Task
  ) {
    // 创建复选框
    const isChecked = this.task
      ? this.context.store.getDataManager().isTaskChecked(this.task)
      : false;
    const initialState = isChecked
      ? CheckboxState.CHECKED
      : CheckboxState.UNCHECKED;

    this.options = {
      initialState,
      size: 14
    };

    this.element = document.createElement("div");
    this.iconElement = document.createElement("div");

    this._state = this.options.initialState;

    this.createElement();
    this.updateIcon();
    this.bindEvents();

    this.registerEvents();

    this.container?.appendChild(this.element);
  }

  private createElement(): void {
    // 创建容器
    this.element.className = "x-gantt-checkbox";
    this.element.style.width = `${this.options.size}px`;
    this.element.style.height = `${this.options.size}px`;
    this.element.style.setProperty(
      "border",
      `1px solid ${
        this.context.store.getOptionManager().getOptions().border.color
      }`,
      "important"
    );

    // 创建图标容器
    this.iconElement.className = "x-gantt-checkbox__icon";
    this.iconElement.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: #ffffff;
      font-size: ${Math.floor(this.options.size! * 0.75)}px;
      line-height: 1;
    `;

    this.element.appendChild(this.iconElement);

    // 添加悬停效果
    this.element.addEventListener("mouseenter", () => {
      if (this._state === CheckboxState.UNCHECKED) {
        this.element.classList.add("hover");
      }
    });

    this.element.addEventListener("mouseleave", () => {
      if (this._state === CheckboxState.UNCHECKED) {
        this.element.classList.remove("hover");
      }
    });
  }

  private updateIcon(): void {
    const primaryColor = this.context.store
      .getOptionManager()
      .getOptions().primaryColor;

    // 重置样式
    this.iconElement.innerHTML = "";
    let bgColor = "#ffffff";
    let borderColor = colorjs(primaryColor).alpha(0.5).toHex();

    switch (this._state) {
      case CheckboxState.UNCHECKED:
        // 未选中状态 - 空心
        bgColor = "#ffffff";
        borderColor = borderColor;
        break;

      case CheckboxState.CHECKED:
        // 选中状态 - 勾选
        bgColor = primaryColor;
        borderColor = primaryColor;
        this.iconElement.innerHTML = `
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
            <path d="M10.5 1.5L4.5 7.5L1.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
        break;

      case CheckboxState.INDETERMINATE:
        // 中间状态 - 横杠
        bgColor = primaryColor;
        borderColor = primaryColor;
        this.iconElement.innerHTML = `
          <svg width="8" height="2" viewBox="0 0 8 2" fill="none">
            <rect width="8" height="2" fill="currentColor" rx="1"/>
          </svg>
        `;
        break;
    }

    // 更新样式
    this.iconElement.style.setProperty(
      "background-color",
      bgColor,
      "important"
    );
    this.iconElement.style.setProperty(
      "border-color",
      borderColor,
      "important"
    );
  }

  private bindEvents(): void {
    // 左键选单个
    this.element.addEventListener("click", (event: Event) => {
      event.preventDefault();
      event.stopPropagation();

      if (this.task) {
        // 检查 task 是否被选中
        const isChecked = this.context.store
          .getDataManager()
          .isTaskChecked(this.task);
        if (isChecked) {
          this.context.store
            .getDataManager()
            .updateCheckedList(false, this.task);
          this.setState(CheckboxState.UNCHECKED);
        } else {
          this.context.store
            .getDataManager()
            .updateCheckedList(true, this.task);
          this.setState(CheckboxState.CHECKED);
        }

        this.context.event.emit(EventName.CHECK_TASK, [this.task], !isChecked);
      } else {
        // 全选/取消全选
        const isAllChecked =
          this.context.store.getDataManager().getCheckedList().length ===
          this.context.store.getDataManager().getVisibleSize();
        this.setState(
          isAllChecked ? CheckboxState.CHECKED : CheckboxState.UNCHECKED
        );

        this.context.store.getDataManager().toggleAllChecked(!isAllChecked);
        this.context.event.emit(
          EventName.CHECK_TASK,
          this.context.store.getDataManager().getVisibleTasks(),
          !isAllChecked
        );
      }
    });

    // 右键选所有子项
    this.element.addEventListener("contextmenu", (event: Event) => {
      event.preventDefault();
      event.stopPropagation();

      if (this.task) {
        const children = this.task.getAllChildren();
        // 没有子项，不触发右键事件
        if (children.length === 0) return;

        // 如果包含自身，则将自身添加到子项列表中。
        if (
          this.context.store.getOptionManager().getOptions().selection
            .includeSelf
        ) {
          children.unshift(this.task);
        }

        const isAllChecked = children.every(child =>
          this.context.store.getDataManager().isTaskChecked(child)
        );
        if (isAllChecked) {
          // 如果所有子项都选中，则取消选中
          children.forEach(child => {
            this.context.store.getDataManager().updateCheckedList(false, child);
          });
          this.setState(CheckboxState.UNCHECKED);
        } else {
          // 否则选中所有子项
          children.forEach(child => {
            this.context.store.getDataManager().updateCheckedList(true, child);
          });
          this.setState(CheckboxState.CHECKED);
        }

        this.context.event.emit(EventName.CHECK_TASK, children, !isAllChecked);
      } else {
        // 全选/取消全选，左右键操作保持一致
        const isAllChecked =
          this.context.store.getDataManager().getCheckedList().length ===
          this.context.store.getDataManager().getVisibleSize();
        this.setState(
          isAllChecked ? CheckboxState.CHECKED : CheckboxState.UNCHECKED
        );

        this.context.store.getDataManager().toggleAllChecked(!isAllChecked);
        this.context.event.emit(
          EventName.CHECK_TASK,
          this.context.store.getDataManager().getVisibleTasks(),
          !isAllChecked
        );
      }
    });
  }

  private registerEvents(): void {
    // 监听任务选中状态变化
    this.context.event.on(EventName.CHECK_TASK, this.updateState.bind(this));
  }

  /** 获取元素 */
  public getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * 设置状态
   */
  private setState(state: CheckboxState): void {
    if (this._state !== state) {
      this._state = state;
      this.updateIcon();
    }
  }

  /**
   * 更新状态
   */
  private updateState() {
    if (this.task) {
      // 单个
      const isChecked = this.context.store
        .getDataManager()
        .isTaskChecked(this.task);
      this.setState(
        isChecked ? CheckboxState.CHECKED : CheckboxState.UNCHECKED
      );
    } else {
      // 头部全部选中
      const isAllChecked =
        this.context.store.getDataManager().getCheckedList().length ===
        this.context.store.getDataManager().getVisibleSize();
      this.setState(
        isAllChecked ? CheckboxState.CHECKED : CheckboxState.UNCHECKED
      );
    }
  }

  /**
   * 销毁组件
   */
  public destroy(): void {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
