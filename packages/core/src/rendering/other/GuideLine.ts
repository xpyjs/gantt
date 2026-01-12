/*
 * @Author: JeremyJone
 * @Date: 2025-04-25 16:35:01
 * @LastEditors: JeremyJone
 * @LastEditTime: 2026-01-12 17:01:08
 * @Description: 全局指示线
 */

import { IContext } from "@/types/render";
import { EventName } from "../../event";

/**
 * 全局指示线类
 * 用于在拖拽调整大小时显示垂直参考线
 */
export class GuideLine {
  private element: HTMLElement;
  private container: HTMLElement;
  private visible: boolean = false;

  /**
   * @param container 指示线的容器元素
   */
  constructor(private context: IContext, container: HTMLElement) {
    if (!container) {
      throw new Error("Container is required for GuideLine instance");
    }

    this.container = container;
    this.element = document.createElement("div");
    this.initElement();
    this.initEvents();
  }

  /**
   * 初始化指示线元素
   */
  private initElement(): void {
    this.element.className = "x-gantt-guide-line";
    this.element.style.position = "absolute";
    this.element.style.top = "0";
    this.element.style.left = "0";
    this.element.style.width = "0";
    this.element.style.height = "100%";
    this.element.style.setProperty(
      "border-left",
      `1px dashed ${this.context.getOptions().border.color}`,
      "important"
    );
    this.element.style.zIndex = "9999";
    this.element.style.pointerEvents = "none"; // 确保指示线不会干扰鼠标事件
    this.element.style.display = "none"; // 初始隐藏
    this.element.style.transform = "translateX(-0.5px)";

    // 确保容器有定位属性，以便指示线可以相对于它定位
    if (getComputedStyle(this.container).position === "static") {
      this.container.style.position = "relative";
    }

    this.container.appendChild(this.element);
  }

  /**
   * 初始化事件监听
   */
  private initEvents(): void {
    // 监听显示指示线事件
    this.context.event.on(EventName.SHOW_GUIDELINE, (left: number) => {
      this.show(left);
    });

    // 监听隐藏指示线事件
    this.context.event.on(EventName.HIDE_GUIDELINE, () => {
      this.hide();
    });

    // 监听移动指示线事件
    this.context.event.on(EventName.MOVE_GUIDELINE, (left: number) => {
      this.setLeft(left);
    });

    // 监听更新事件
    this.context.event.on(EventName.OPTIONS_UPDATE, () => {
      this.updateOptions();
    });
  }

  /**
   * 设置指示线容器
   * @param container 新的容器元素
   */
  public setContainer(container: HTMLElement): void {
    // 从当前容器中移除
    if (this.element.parentElement) {
      this.element.parentElement.removeChild(this.element);
    }

    this.container = container;

    // 确保容器有定位属性
    if (getComputedStyle(this.container).position === "static") {
      this.container.style.position = "relative";
    }

    // 添加到新容器
    this.container.appendChild(this.element);
  }

  /**
   * 设置指示线左侧位置
   * @param left 左侧位置值，单位px
   */
  public setLeft(left: number): void {
    // 添加边界限制，防止指示线超出容器范围
    const containerWidth = this.container.clientWidth;

    // 限制在 0 到容器宽度之间。最右侧让出 20
    const limitedLeft = Math.max(0, Math.min(containerWidth - 20, left));

    // this.element.style.left = `${limitedLeft}px`;
    this.element.style.transform = `translateX(${limitedLeft - 0.5}px)`;
  }

  /**
   * 显示指示线
   * @param left 可选参数，显示时设置的左侧位置
   */
  public show(left?: number): void {
    if (left !== undefined) {
      this.setLeft(left);
    }
    this.element.style.display = "block";
    this.visible = true;
  }

  /**
   * 隐藏指示线
   */
  public hide(): void {
    this.element.style.display = "none";
    this.visible = false;
  }

  /**
   * 检查指示线是否可见
   */
  public isVisible(): boolean {
    return this.visible;
  }

  /**
   * 获取当前位置
   */
  public getLeft() {
    return this.element.offsetLeft;
  }

  /**
   * 更新参数
   */
  public updateOptions(): void {
    this.element.style.setProperty(
      "border-left",
      `1px dashed ${this.context.getOptions().border.color}`,
      "important"
    );
  }
}
