/*
 * @Author: JeremyJone
 * @Date: 2025-06-12 15:40:00
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-11-17 10:15:33
 * @Description: 拖拽组件
 */

import { IContext } from "@/types/render";
import { colorjs } from "../../utils/color";
import { Logger } from "../../utils/logger";
import type { Task } from "@/models/Task";
import { isFunction } from "lodash-es";

export class DragHandler {
  private element: HTMLDivElement;
  private isDragging = false;
  private dragStartY = 0;
  private dragStartIndex = -1;
  private currentIndex = -1;
  private dragType: 'before' | 'after' | 'inside' = 'inside';
  private canDrop = false;
  private ghostElement: HTMLDivElement | null = null;
  private placeholderElement: HTMLDivElement | null = null;
  private animationFrameId: number | null = null;
  private rowElement: HTMLElement | null = null;

  constructor(
    private context: IContext,
    private container?: HTMLDivElement,
    private task?: Task
  ) {
    this.element = document.createElement("div");

    this.createElement();
    this.bindEvents();

    this.container?.appendChild(this.element);
  }

  private createElement(): void {
    this.element.className = 'x-gantt-drag-handle';
    this.element.style.color = this.context.getOptions().drag.color || "#999";
    this.element.innerHTML = `<svg t="1746781386866" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3253" width="14" height="14"><path d="M384 128m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="currentColor" p-id="3254"></path><path d="M384 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="currentColor" p-id="3255"></path><path d="M384 896m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="currentColor" p-id="3256"></path><path d="M704 128m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="currentColor" p-id="3257"></path><path d="M704 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="currentColor" p-id="3258"></path><path d="M704 896m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 -0Z" fill="currentColor" p-id="3259"></path></svg>`;
  }

  private bindEvents(): void {
    this.element.addEventListener('mousedown', this.handleMouseDown);
    // 防止拖拽时选中文本
    this.element.addEventListener('selectstart', (e) => e.preventDefault());
  }

  private handleMouseDown = (e: MouseEvent): void => {
    if (!this.task || !this.container) {
      Logger.warn('DragHandler: task or container is not defined');
      return;
    }

    // 找到当前行元素
    this.rowElement = this.container.closest('.x-gantt-table-row');
    if (!this.rowElement) {
      Logger.warn('Row element not found', this.container);
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    this.isDragging = true;
    this.dragStartY = e.clientY + this.context.getScrollbar().getScrollPosition().y;
    this.dragStartIndex = this.task.flatIndex;
    this.currentIndex = this.dragStartIndex;


    // 创建跟随影像
    this.createGhostElement(e);
    // 创建占位符
    this.createPlaceholderElement(e);

    // 绑定全局事件
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
    // 按下 Esc 键取消拖拽
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape' && this.isDragging) {
        this.cleanup();
      }
    });

    Logger.debug(`Drag started for task ${this.task.id} at index ${this.dragStartIndex}`);
  };

  private handleMouseMove = (e: MouseEvent): void => {
    if (!this.isDragging || !this.task || !this.container) return;

    // 使用 requestAnimationFrame 优化性能
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.animationFrameId = requestAnimationFrame(() => {
      // 获取根元素边界信息
      const rootElement = this.context.getRootElement();
      if (!rootElement) return;

      const rootRect = rootElement.getBoundingClientRect();
      const headerHeight = this.context.getOptions().header.height;
      const rowHeight = this.context.getOptions().row.height;
      const scrollPosition = this.context.getScrollbar().getScrollPosition();

      // 计算鼠标相对于甘特图内容区域的位置（包含滚动偏移）
      const mouseYInContent = e.clientY - rootRect.top - headerHeight + scrollPosition.y;

      // 计算目标行索引
      const targetRowIndex = Math.max(0, Math.min(
        Math.floor(mouseYInContent / rowHeight),
        this.context.store.getDataManager().getVisibleSize() - 1
      ));

      // 计算在目标行内的相对位置
      const yInRow = mouseYInContent % rowHeight;
      let dropPosition: 'before' | 'after' | 'inside';

      if (yInRow < rowHeight * 0.25) {
        dropPosition = 'before';
      } else if (yInRow > rowHeight * 0.75) {
        dropPosition = 'after';
      } else {
        dropPosition = 'inside';
      }
      this.dragType = dropPosition;

      // 更新 ghost 位置（相对于视口）
      this.updateGhostPosition(e.clientY - rootRect.top);

      // 判断是否可以放置在此位置
      this.canDrop = false;
      const targetTask = this.context.store.getDataManager().getVisibleTasks()[targetRowIndex];
      if (this.context.getOptions().drag.drop?.crossLevel === true) {
        if (dropPosition == 'inside') {
          this.canDrop = !this.task!.isSomeoneChildren(targetTask);
        } else {
          this.canDrop = this.task!.id !== targetTask.id && !this.task!.isSomeoneChildren(targetTask.parent);
        }
      } else {
        if (dropPosition !== 'inside') {
          this.canDrop = this.task!.parent?.id === targetTask.parent?.id && this.task!.id !== targetTask.id;
        }
      }

      if (this.canDrop === true) {
        if (this.context.getOptions().drag.drop?.allowed) {
          this.canDrop = this.context.getOptions().drag.drop!.allowed!(targetTask.getEmitData(), this.task!.getEmitData());
        }
      }

      // 更新占位符位置（相对于根容器内容区）
      this.updatePlaceholderPosition(targetRowIndex, dropPosition, rootRect, scrollPosition, this.canDrop);

      // 触发拖拽事件
      if (this.currentIndex !== targetRowIndex) {
        this.currentIndex = targetRowIndex;
      }
    });
  };

  private handleMouseUp = (e: MouseEvent): void => {
    if (!this.isDragging || !this.task) return;

    // 更新数据
    if (this.canDrop) {
      this.context.store.getDataManager().moveTask(this.dragType, this.task, this.currentIndex);
    }

    this.cleanup();
  };

  /**
  * 创建拖拽跟随影像
  */
  private createGhostElement(e: MouseEvent): void {
    if (!this.container || !this.task || !this.rowElement) return;

    this.ghostElement = document.createElement('div');
    this.ghostElement.className = 'x-gantt-drag-ghost';
    this.ghostElement.innerHTML = this.rowElement.innerHTML;

    const rootElement = this.context.getRootElement();
    if (!rootElement) return;

    const rootRect = rootElement.getBoundingClientRect();
    const rowRect = this.rowElement.getBoundingClientRect();
    const chartWidth = this.context.store.getTimeAxis().getTotalWidth();

    // 设置初始位置（相对于根容器）
    this.ghostElement.style.position = 'absolute';
    this.ghostElement.style.left = '0px';
    this.ghostElement.style.top = `${e.clientY - rootRect.top - rowRect.height / 2}px`;
    this.ghostElement.style.width = `${rootRect.width}px`;
    this.ghostElement.style.height = `${rowRect.height}px`;
    this.ghostElement.style.pointerEvents = 'none';
    this.ghostElement.style.zIndex = '10000';
    this.ghostElement.style.opacity = '0.8';
    this.ghostElement.style.borderRadius = '4px';
    this.ghostElement.style.overflow = 'hidden';
    this.ghostElement.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';

    // 添加渐变遮罩
    const gradientOverlay = document.createElement('div');
    gradientOverlay.style.cssText = `
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(to right,
        rgba(255,255,255,0) 0%,
        rgba(255,255,255,0.3) 50%,
        rgba(255,255,255,0.9) 100%);
      pointer-events: none;
    `;

    // 添加 DOM
    const container = this.context.getRootElement() || document.body;
    container.appendChild(this.ghostElement);

    Logger.debug('Ghost element created');
  }

  /**
   * 更新 ghost 元素位置
   */
  private updateGhostPosition(top: number): void {
    if (!this.ghostElement || !this.rowElement) return;

    const rootElement = this.context.getRootElement();
    if (!rootElement) return;

    const rootRect = rootElement.getBoundingClientRect();
    const rowHeight = this.context.getOptions().row.height;

    // 限制 ghost 在根容器内
    const minTop = 0;
    const maxTop = rootRect.height - rowHeight;
    const constrainedTop = Math.max(minTop, Math.min(top - rowHeight / 2, maxTop));

    this.ghostElement.style.top = `${constrainedTop}px`;
  }

  /**
   * 创建插入占位符元素
   */
  private createPlaceholderElement(e: MouseEvent): void {
    if (!this.rowElement) return;

    this.placeholderElement = document.createElement('div');
    this.placeholderElement.className = 'x-gantt-drag-placeholder';

    // 设置基础样式（相对于根容器定位）
    this.placeholderElement.style.cssText = `
      position: absolute;
      left: 0;
      top: ${e.clientY}px;
      opacity: 0;
      width: 100%;
      height: ${this.context.getOptions().row.height}px;
      background-color: ${colorjs(this.context.getOptions().drag.targetBackgroundColor || this.context.getOptions().primaryColor).toString()};
      pointer-events: none;
      z-index: 9999;
      transition: all 0.1s ease;
      box-sizing: border-box;
    `;

    // 添加 DOM
    const container = this.context.getRootElement();
    container.appendChild(this.placeholderElement);
  }

  /**
   * 更新占位符的位置
   */
  private updatePlaceholderPosition(
    targetRowIndex: number,
    dropPosition: 'before' | 'after' | 'inside',
    rootRect: DOMRect,
    scrollPosition: { x: number; y: number },
    canDrop: boolean
  ): void {
    if (!this.placeholderElement) return;

    if (!canDrop) {
      this.placeholderElement.style.opacity = '0';
      this.context.getRootElement().style.setProperty('cursor', 'not-allowed', 'important');
      return;
    }

    this.context.getRootElement().style.setProperty('cursor', 'grabbing', 'important');

    const headerHeight = this.context.getOptions().header.height;
    const rowHeight = this.context.getOptions().row.height;

    // 计算目标行在内容中的绝对位置
    let targetTopInContent = headerHeight + targetRowIndex * rowHeight;

    // 根据插入位置调整
    if (dropPosition === 'after') {
      targetTopInContent += rowHeight;
    }

    // 转换为相对于当前视口的位置（减去滚动偏移）
    const placeholderTop = targetTopInContent - scrollPosition.y;

    // 设置占位符样式
    const height = dropPosition === 'inside' ? rowHeight : 2;

    this.placeholderElement.style.top = `${placeholderTop}px`;
    this.placeholderElement.style.height = `${height}px`;

    if (this.placeholderElement.style.opacity === '0') {
      this.placeholderElement.style.opacity = this.context.getOptions().drag.targetOpacity?.toString() || '0.2';
    }

    // 根据插入类型设置不同的样式
    if (dropPosition === 'inside') {
      this.placeholderElement.style.backgroundColor = colorjs(
        this.context.getOptions().drag.targetBackgroundColor ||
        this.context.getOptions().primaryColor
      ).alpha(0.1).toString();
      this.placeholderElement.style.border = `2px dashed ${colorjs(
        this.context.getOptions().drag.targetBackgroundColor ||
        this.context.getOptions().primaryColor
      ).toString()}`;
    } else {
      this.placeholderElement.style.backgroundColor = colorjs(
        this.context.getOptions().drag.targetBackgroundColor ||
        this.context.getOptions().primaryColor
      ).toString();
      this.placeholderElement.style.border = 'none';
    }
  }

  /**
   * 清理拖拽状态
   */
  private cleanup(): void {
    this.isDragging = false;

    // 取消动画帧
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // 移除占位符
    if (this.ghostElement && this.ghostElement.parentNode) {
      this.ghostElement.parentNode.removeChild(this.ghostElement);
      this.ghostElement = null;
    }

    if (this.placeholderElement && this.placeholderElement.parentNode) {
      this.placeholderElement.parentNode.removeChild(this.placeholderElement);
      this.placeholderElement = null;
    }

    this.rowElement = null;

    // 移除全局事件监听
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  /** 获取元素 */
  public getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * 销毁组件
   */
  public destroy(): void {
    this.cleanup();

    // 移除事件监听
    this.element.removeEventListener('mousedown', this.handleMouseDown);
    this.element.removeEventListener('selectstart', (e) => e.preventDefault());

    // 移除DOM元素
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    Logger.debug('DragHandler destroyed');
  }
}
