/*
 * @Author: JeremyJone
 * @Date: 2025-04-23 14:54:51
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-06-18 09:25:52
 * @Description: 自定义滚动区域。为了优化滚动样式
 */

import { merge, throttle } from "lodash-es";
import { Logger } from "../../utils/logger";
import { EventName } from "../../event"; // 使用实际的事件管理器类型
import { IGanttOptions } from "@/types/options";
import { IContext } from "@/types/render";

type ScrollbarOptions = NonNullable<IGanttOptions["scrollbar"]>;

/**
 * 滚动事件数据
 */
interface ScrollEventData {
  x: number;
  y: number;
  source: "drag" | "wheel" | "api" | "track";
}

/**
 * 自定义滚动区域，用于替代原生滚动条，提供更好的样式控制和交互体验。
 * 负责容器元素的滚动条显示、隐藏、拖拽滚动、程序化滚动等。
 * 监听整个根元素的滚动事件，实现平滑统一的滚动效果。
 *
 * @example
 * // 实例化
 * const scrollbar = new Scrollbar(rootElement, ganttInstance.events, options);
 *
 * // 当内容或视口尺寸变化时更新
 * scrollbar.updateSize(viewportWidth, viewportHeight, contentWidth, contentHeight);
 *
 * // 程序化滚动 (会平滑滚动)
 * scrollbar.scrollTo({x: 100, y: 100});
 *
 * // 获取当前滚动位置
 * const { x, y } = scrollbar.getScrollPosition();
 *
 * // 销毁
 * scrollbar.destroy();
 */
export class Scrollbar {
  private rootElement: HTMLElement;
  private options: Required<ScrollbarOptions>;

  // 滚动条元素
  private hScrollbar!: HTMLDivElement;
  private vScrollbar!: HTMLDivElement;
  private hScrollThumb!: HTMLDivElement;
  private vScrollThumb!: HTMLDivElement;
  private scrollbarContainer!: HTMLDivElement;

  // 内容尺寸和滚动位置
  private viewportWidth: number = 0;
  private viewportHeight: number = 0;
  private contentWidth: number = 0;
  private contentHeight: number = 0;
  private scrollLeft: number = 0;
  private scrollTop: number = 0;

  // 滚动条状态
  private isDraggingHScroll: boolean = false;
  private isDraggingVScroll: boolean = false;
  private isMouseOverRoot: boolean = false;
  private isMouseOverScrollbar: boolean = false;
  private hideTimeout: number | null = null;
  private showTimeout: number | null = null; // 新增：显示计时器
  private isVisible: boolean = false;

  // 拖拽状态
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private thumbStartScrollLeft: number = 0;
  private thumbStartScrollTop: number = 0;

  // 动画状态
  private isAnimating: boolean = false;
  private animationFrameId: number | null = null;
  private animationStartTime: number = 0;
  private animationStartScrollLeft: number = 0;
  private animationStartScrollTop: number = 0;
  private animationTargetScrollLeft: number = 0;
  private animationTargetScrollTop: number = 0;
  private animationSource: ScrollEventData["source"] = "api"; // 记录动画触发源

  // 节流处理
  private throttledHandleMouseMove: (e: MouseEvent) => void;
  private throttledHandleWheel: (e: WheelEvent) => void;

  constructor(
    private root: IContext,
    rootElement: HTMLElement,
    options?: Partial<ScrollbarOptions>
  ) {
    this.rootElement = rootElement;
    this.options = merge(
      {
        showHorizontal: true,
        showVertical: true,
        track: {
          size: 8,
          radius: 4,
          color: "transparent"
        },
        thumb: {
          size: 30,
          radius: 4,
          color: "rgba(0, 0, 0, 0.4)"
        },
        showDelay: 0, // 延迟显示时间 (ms)
        hideDelay: 500, // 延迟隐藏时间 (ms)
        animationDuration: 100, // 平滑滚动动画时长 (ms)
        showDuration: 200, // 滚动条显示动画时长 (ms)
        hideDuration: 200 // 滚动条隐藏动画时长 (ms)
      },
      options
    );

    this.throttledHandleMouseMove = throttle(
      this.handleMouseMove.bind(this),
      16
    );
    this.throttledHandleWheel = throttle(this.handleWheel.bind(this), 16, {
      leading: true,
      trailing: false
    });

    this.createElements();
    this.applyStyles();
    this.bindEvents();

    if (this.rootElement.matches(":hover")) {
      this.handleMouseEnter();
    } else {
      this.clearTimeouts();
      this.hideScrollbars(true);
    }
  }

  // --- 元素创建与管理 ---

  private createElements(): void {
    this.scrollbarContainer = document.createElement("div");
    this.scrollbarContainer.className = "x-gantt-scrollbar-container";
    this.rootElement.appendChild(this.scrollbarContainer);

    this.hScrollbar = this.createScrollbarElement("horizontal");
    this.hScrollThumb = this.createScrollThumbElement("horizontal");
    this.hScrollbar.appendChild(this.hScrollThumb);

    this.vScrollbar = this.createScrollbarElement("vertical");
    this.vScrollThumb = this.createScrollThumbElement("vertical");
    this.vScrollbar.appendChild(this.vScrollThumb);

    this.scrollbarContainer.appendChild(this.hScrollbar);
    this.scrollbarContainer.appendChild(this.vScrollbar);
  }

  private createScrollbarElement(
    direction: "horizontal" | "vertical"
  ): HTMLDivElement {
    const scrollbar = document.createElement("div");
    scrollbar.className = `x-gantt-scrollbar x-gantt-${direction}-scrollbar`;
    return scrollbar;
  }

  private createScrollThumbElement(
    direction: "horizontal" | "vertical"
  ): HTMLDivElement {
    const thumb = document.createElement("div");
    thumb.className = `x-gantt-scrollbar-thumb x-gantt-${direction}-thumb`;
    return thumb;
  }

  // --- 样式应用 ---

  private applyStyles(): void {
    const containerStyle = this.scrollbarContainer.style;
    containerStyle.position = "absolute";
    containerStyle.top = "0";
    containerStyle.left = "0";
    containerStyle.width = "100%";
    containerStyle.height = "100%";
    containerStyle.pointerEvents = "none"; // 容器不接收事件，让下层元素接收
    containerStyle.zIndex = "100"; // 确保在内容之上

    this.applyScrollbarStyles(this.hScrollbar, "horizontal");
    this.applyScrollbarStyles(this.vScrollbar, "vertical");
    this.applyThumbStyles(this.hScrollThumb, "horizontal");
    this.applyThumbStyles(this.vScrollThumb, "vertical");
  }

  private applyScrollbarStyles(
    element: HTMLElement,
    direction: "horizontal" | "vertical"
  ): void {
    const style = element.style;
    style.position = "absolute";
    style.backgroundColor = this.options.track.color!;
    style.borderRadius = `${this.options.track.size! / 2}px`; // 圆角通常是轨道宽度一半
    style.opacity = "0";
    style.transition = `opacity ${this.options.hideDuration / 1000}s ease-out`;
    style.pointerEvents = "auto"; // 滚动条轨道本身可以接收点击事件

    if (direction === "horizontal") {
      style.bottom = "0px";
      style.left = "0px"; // 初始位置，会被 updateSize 调整
      style.height = `${this.options.track.size!}px`;
      style.width = "0px"; // 初始宽度，会被 updateSize 调整
    } else {
      style.right = "0px";
      style.top = "0px"; // 初始位置，会被 updateSize 调整
      style.width = `${this.options.track.size!}px`;
      style.height = "0px"; // 初始高度，会被 updateSize 调整
    }
  }

  private applyThumbStyles(
    element: HTMLElement,
    direction: "horizontal" | "vertical"
  ): void {
    const style = element.style;
    style.position = "absolute";
    style.backgroundColor = this.options.thumb.color!;
    style.borderRadius = `${this.options.thumb.radius!}px`;
    style.cursor = "pointer";
    style.transition = "background-color 0.2s";
    style.pointerEvents = "auto"; // 滑块接收事件

    if (direction === "horizontal") {
      style.height = "100%";
      style.top = "0";
      style.left = "0";
    } else {
      style.width = "100%";
      style.left = "0";
      style.top = "0";
    }
  }

  // --- 事件绑定 ---

  private bindEvents(): void {
    this.rootElement.addEventListener("mouseenter", this.handleMouseEnter);
    this.rootElement.addEventListener("mouseleave", this.handleMouseLeave);
    // 使用 rootElement 监听 mousemove 来显示，而不是 container，避免事件穿透问题
    this.rootElement.addEventListener("mousemove", this.handleRootMouseMove);

    this.hScrollThumb.addEventListener(
      "mousedown",
      this.handleHorizontalThumbMouseDown
    );
    this.vScrollThumb.addEventListener(
      "mousedown",
      this.handleVerticalThumbMouseDown
    );

    this.hScrollbar.addEventListener(
      "mousedown",
      this.handleHorizontalTrackMouseDown
    );
    this.vScrollbar.addEventListener(
      "mousedown",
      this.handleVerticalTrackMouseDown
    );

    // 鼠标悬停在滚动条上时也需要保持显示
    this.hScrollbar.addEventListener(
      "mouseenter",
      this.handleScrollbarMouseEnter
    );
    this.vScrollbar.addEventListener(
      "mouseenter",
      this.handleScrollbarMouseEnter
    );
    this.hScrollbar.addEventListener(
      "mouseleave",
      this.handleScrollbarMouseLeave
    );
    this.vScrollbar.addEventListener(
      "mouseleave",
      this.handleScrollbarMouseLeave
    );

    this.rootElement.addEventListener("wheel", this.throttledHandleWheel, {
      passive: false
    });
  }

  private unbindEvents(): void {
    this.rootElement.removeEventListener("mouseenter", this.handleMouseEnter);
    this.rootElement.removeEventListener("mouseleave", this.handleMouseLeave);
    this.rootElement.removeEventListener("mousemove", this.handleRootMouseMove);

    this.hScrollThumb.removeEventListener(
      "mousedown",
      this.handleHorizontalThumbMouseDown
    );
    this.vScrollThumb.removeEventListener(
      "mousedown",
      this.handleVerticalThumbMouseDown
    );

    this.hScrollbar.removeEventListener(
      "mousedown",
      this.handleHorizontalTrackMouseDown
    );
    this.vScrollbar.removeEventListener(
      "mousedown",
      this.handleVerticalTrackMouseDown
    );

    this.hScrollbar.removeEventListener(
      "mouseenter",
      this.handleScrollbarMouseEnter
    );
    this.vScrollbar.removeEventListener(
      "mouseenter",
      this.handleScrollbarMouseEnter
    );
    this.hScrollbar.removeEventListener(
      "mouseleave",
      this.handleScrollbarMouseLeave
    );
    this.vScrollbar.removeEventListener(
      "mouseleave",
      this.handleScrollbarMouseLeave
    );

    this.rootElement.removeEventListener("wheel", this.throttledHandleWheel);

    // 移除全局监听（如果存在）
    document.removeEventListener("mousemove", this.throttledHandleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

  // --- 事件处理 ---

  private handleRootMouseMove = (): void => {
    // 鼠标在根元素内移动，如果滚动条不可见，则计划显示
    if (!this.isVisible && this.isMouseOverRoot) {
      this.scheduleShow(); // 改为计划显示
    }
    // 如果可见，重置隐藏计时器 (如果鼠标不在滚动条上)
    else if (this.isVisible && !this.isMouseOverScrollbar) {
      this.scheduleHide();
    }
  };

  private handleScrollbarMouseEnter = (): void => {
    this.isMouseOverScrollbar = true;
    this.scheduleShow(); // 悬停时计划显示（会清除隐藏定时器）
  };

  private handleScrollbarMouseLeave = (): void => {
    this.isMouseOverScrollbar = false;
    // 鼠标离开滚动条，但还在根元素内，则重置隐藏计时器
    // 如果鼠标也离开了根元素，则 scheduleHide 会处理
    if (this.isMouseOverRoot) {
      this.scheduleHide();
    }
  };

  private handleMouseEnter = (): void => {
    this.isMouseOverRoot = true;
    this.scheduleShow(); // 计划显示
  };

  private handleMouseLeave = (): void => {
    this.isMouseOverRoot = false;
    // 鼠标离开根元素，如果不在拖拽且不在滚动条上，则计划隐藏
    if (
      !this.isDraggingHScroll &&
      !this.isDraggingVScroll &&
      !this.isMouseOverScrollbar
    ) {
      this.clearTimeouts(true, false); // 清除显示计时器
      this.scheduleHide(); // 计划隐藏
    }
  };

  private handleHorizontalThumbMouseDown = (e: MouseEvent): void => {
    e.preventDefault(); // 防止文本选择
    e.stopPropagation(); // 防止触发轨道点击

    this.isDraggingHScroll = true;
    this.dragStartX = e.clientX;
    this.thumbStartScrollLeft = this.scrollLeft;
    this.hScrollThumb.style.backgroundColor = this.options.thumb.color!;
    this.scheduleShow(); // 拖拽时保持显示

    document.addEventListener("mousemove", this.throttledHandleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);
  };

  private handleVerticalThumbMouseDown = (e: MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    this.isDraggingVScroll = true;
    this.dragStartY = e.clientY;
    this.thumbStartScrollTop = this.scrollTop;
    this.vScrollThumb.style.backgroundColor = this.options.thumb.color!;
    this.scheduleShow(); // 拖拽时保持显示

    document.addEventListener("mousemove", this.throttledHandleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);
  };

  private handleHorizontalTrackMouseDown = (e: MouseEvent): void => {
    if (e.target !== this.hScrollbar) return; // 确保点击的是轨道本身
    e.preventDefault();

    const trackRect = this.hScrollbar.getBoundingClientRect();
    const thumbWidth = this.hScrollThumb.offsetWidth;
    const clickX = e.clientX - trackRect.left; // 相对于轨道的点击位置
    const trackWidth = this.hScrollbar.clientWidth; // 可用轨道宽度
    const scrollableWidth = this.contentWidth - this.viewportWidth;
    const maxThumbPos = trackWidth - thumbWidth;

    // 计算目标滚动位置： (点击位置 - 滑块宽度一半) / 最大可移动距离 * 总可滚动距离
    const targetScrollLeft =
      ((clickX - thumbWidth / 2) / maxThumbPos) * scrollableWidth;

    this.scrollTo({ x: targetScrollLeft, y: this.scrollTop }, "track");
  };

  private handleVerticalTrackMouseDown = (e: MouseEvent): void => {
    if (e.target !== this.vScrollbar) return;
    e.preventDefault();

    const trackRect = this.vScrollbar.getBoundingClientRect();
    const thumbHeight = this.vScrollThumb.offsetHeight;
    const clickY = e.clientY - trackRect.top;
    const trackHeight = this.vScrollbar.clientHeight;
    const scrollableHeight = this.contentHeight - this.viewportHeight;
    const maxThumbPos = trackHeight - thumbHeight;

    const targetScrollTop =
      ((clickY - thumbHeight / 2) / maxThumbPos) * scrollableHeight;

    this.scrollTo({ x: this.scrollLeft, y: targetScrollTop }, "track");
  };

  private handleMouseMove(e: MouseEvent): void {
    if (!this.isDraggingHScroll && !this.isDraggingVScroll) return;
    this.scheduleShow(); // 拖拽移动时确保显示

    if (this.isDraggingHScroll) {
      const deltaX = e.clientX - this.dragStartX;
      const trackWidth = this.hScrollbar.clientWidth;
      const thumbWidth = this.hScrollThumb.offsetWidth;
      const maxThumbPos = Math.max(0, trackWidth - thumbWidth);
      const maxScrollLeft = Math.max(0, this.contentWidth - this.viewportWidth);

      if (maxThumbPos === 0 || maxScrollLeft === 0) return; // 不可滚动

      // 通过滑块移动距离比例计算内容滚动距离
      const scrollDelta = (deltaX / maxThumbPos) * maxScrollLeft;
      const newScrollLeft = this.thumbStartScrollLeft + scrollDelta;
      this.scrollTo({ x: newScrollLeft, y: this.scrollTop }, "drag");
    }

    if (this.isDraggingVScroll) {
      const deltaY = e.clientY - this.dragStartY;
      const trackHeight = this.vScrollbar.clientHeight;
      const thumbHeight = this.vScrollThumb.offsetHeight;
      const maxThumbPos = Math.max(0, trackHeight - thumbHeight);
      const maxScrollTop = Math.max(
        0,
        this.contentHeight - this.viewportHeight
      );

      if (maxThumbPos === 0 || maxScrollTop === 0) return;

      const scrollDelta = (deltaY / maxThumbPos) * maxScrollTop;
      const newScrollTop = this.thumbStartScrollTop + scrollDelta;
      this.scrollTo({ x: this.scrollLeft, y: newScrollTop }, "drag");
    }
  }

  private handleMouseUp = (): void => {
    if (this.isDraggingHScroll || this.isDraggingVScroll) {
      const wasDraggingH = this.isDraggingHScroll;
      const wasDraggingV = this.isDraggingVScroll;
      this.isDraggingHScroll = false;
      this.isDraggingVScroll = false;
      if (wasDraggingH)
        this.hScrollThumb.style.backgroundColor = this.options.thumb.color!;
      if (wasDraggingV)
        this.vScrollThumb.style.backgroundColor = this.options.thumb.color!;

      document.removeEventListener("mousemove", this.throttledHandleMouseMove);
      document.removeEventListener("mouseup", this.handleMouseUp);

      // 拖拽结束，如果鼠标已离开区域，则计划隐藏
      if (!this.isMouseOverRoot && !this.isMouseOverScrollbar) {
        this.scheduleHide();
      } else {
        // 否则，只是重置隐藏计时器 (因为鼠标还在内部)
        this.scheduleHide();
      }
    }
  };

  private handleWheel(e: WheelEvent): void {
    // 检查滚动是否主要发生在根元素或其直接子元素上，避免处理内部可滚动元素的事件
    if (
      e.target !== this.rootElement &&
      !this.rootElement.contains(e.target as Node)
    ) {
      Logger.debug(
        "Wheel event ignored, target not root or descendant:",
        e.target
      );
      // return; // 如果需要更严格的控制，可以取消注释此行
    }

    // 只在鼠标悬停在根元素或滚动条上时处理滚轮事件
    if (!this.isMouseOverRoot && !this.isMouseOverScrollbar) {
      Logger.debug("Wheel event ignored, mouse not over root or scrollbar");
      return;
    }

    const needHScroll = this.canScrollHorizontal();
    const needVScroll = this.canScrollVertical();

    // 如果没有可滚动方向，则不处理
    if (!needHScroll && !needVScroll) {
      return;
    }

    e.preventDefault(); // 阻止页面滚动

    let deltaX = e.deltaX;
    let deltaY = e.deltaY;

    // 模拟 macOS 的 Shift + Wheel 行为（水平滚动）
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY) && e.shiftKey && needHScroll) {
      deltaX = deltaY;
      deltaY = 0; // Shift 优先水平滚动
    }

    // 创建平滑滚动动画而不是立即更新
    const newScrollLeft = this.scrollLeft + deltaX;
    const newScrollTop = this.scrollTop + deltaY;

    // 使用动画滚动到目标位置
    // this.animateWheelScroll(newScrollLeft, newScrollTop);

    // TODO 动画待优化，先不用动画了。
    // ↑↑↑↑↑ 主要问题：滚动后，不够丝滑，尤其是横向滚动。感觉上滚动有迟滞
    this.scrollLeft = newScrollLeft;
    this.scrollTop = newScrollTop;
    this.updateThumbStyles();
    this.root.event.emit(EventName.SCROLL, {
      x: this.scrollLeft,
      y: this.scrollTop,
      source: "wheel"
    });
  }

  // 处理滚轮滚动的平滑动画
  private animateWheelScroll(
    targetScrollLeft: number,
    targetScrollTop: number
  ): void {
    // 取消任何现有动画
    this.cancelAnimation();

    // 确保目标位置在有效范围内
    const clampedPos = this.clampScroll({
      x: targetScrollLeft,
      y: targetScrollTop
    });

    // 如果目标位置与当前位置相同，无需动画
    if (this.scrollLeft === clampedPos.x && this.scrollTop === clampedPos.y) {
      return;
    }

    // 设置动画状态
    this.isAnimating = true;
    this.animationStartTime = performance.now();
    this.animationStartScrollLeft = this.scrollLeft;
    this.animationStartScrollTop = this.scrollTop;
    this.animationTargetScrollLeft = clampedPos.x;
    this.animationTargetScrollTop = clampedPos.y;
    this.animationSource = "wheel"; // 标记为滚轮滚动来源

    // 使用固定的较短动画时长，确保滚轮滚动反应迅速但仍然平滑
    const wheelAnimationDuration = 150; // 150ms 的动画时长

    // 创建动画步骤函数
    const animateStep = (timestamp: number): void => {
      if (!this.isAnimating) return;

      const elapsedTime = timestamp - this.animationStartTime;
      const progress = Math.min(1, elapsedTime / wheelAnimationDuration);

      // 使用 easeOutQuad 缓动函数
      const easedProgress = progress * (2 - progress);

      const newScrollLeft =
        this.animationStartScrollLeft +
        (this.animationTargetScrollLeft - this.animationStartScrollLeft) *
          easedProgress;
      const newScrollTop =
        this.animationStartScrollTop +
        (this.animationTargetScrollTop - this.animationStartScrollTop) *
          easedProgress;

      const changedX = this.scrollLeft !== newScrollLeft;
      const changedY = this.scrollTop !== newScrollTop;

      if (changedX || changedY) {
        this.scrollLeft = newScrollLeft;
        this.scrollTop = newScrollTop;
        this.updateThumbStyles();
        this.root.event.emit(EventName.SCROLL, {
          x: this.scrollLeft,
          y: this.scrollTop,
          source: "wheel"
        });
      }

      // 检查动画是否完成
      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animateStep);
      } else {
        // 动画结束，确保最终位置精确
        this.isAnimating = false;
        this.animationFrameId = null;

        // 确保最终位置精确
        if (
          this.scrollLeft !== this.animationTargetScrollLeft ||
          this.scrollTop !== this.animationTargetScrollTop
        ) {
          this.scrollLeft = this.animationTargetScrollLeft;
          this.scrollTop = this.animationTargetScrollTop;
          this.updateThumbStyles();
          this.root.event.emit(EventName.SCROLL, {
            x: this.scrollLeft,
            y: this.scrollTop,
            source: "wheel"
          });
        }

        // 动画结束，重新计划隐藏
        this.scheduleHide();
      }
    };

    // 启动动画
    this.animationFrameId = requestAnimationFrame(animateStep);
  }

  // --- 滚动条显隐 ---

  private clearTimeouts(
    clearShow: boolean = true,
    clearHide: boolean = true
  ): void {
    if (clearShow && this.showTimeout !== null) {
      window.clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    if (clearHide && this.hideTimeout !== null) {
      window.clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  private scheduleShow(): void {
    // 如果已经在显示或计划显示，则无需操作
    if (this.isVisible || this.showTimeout !== null) {
      // 但如果正在计划隐藏，需要取消隐藏
      if (this.hideTimeout !== null) {
        this.clearTimeouts(false, true); // 只清除隐藏
      }
      return;
    }
    this.clearTimeouts(true, true); // 清除所有现有计时器

    if (this.options.showDelay! <= 0) {
      this.showScrollbars(); // 立即显示
    } else {
      this.showTimeout = window.setTimeout(() => {
        this.showScrollbars();
        this.showTimeout = null;
      }, this.options.showDelay!);
    }
  }

  private showScrollbars(): void {
    this.clearTimeouts(); // 清除所有计时器
    this.isVisible = true;

    // 设置过渡效果，使用固定的渐入动画时间
    this.hScrollbar.style.transition = `opacity ${
      this.options.showDuration / 1000
    }s ease-in`;
    this.vScrollbar.style.transition = `opacity ${
      this.options.showDuration / 1000
    }s ease-in`;

    // 使用 requestAnimationFrame 确保渐变效果生效
    requestAnimationFrame(() => {
      // 只有在需要滚动时才设置 opacity 为 1
      if (this.canScrollHorizontal() && this.options.showHorizontal) {
        this.hScrollbar.style.opacity = "1";
      } else {
        this.hScrollbar.style.opacity = "0"; // 确保不需要时不显示
      }
      if (this.canScrollVertical() && this.options.showVertical) {
        this.vScrollbar.style.opacity = "1";
      } else {
        this.vScrollbar.style.opacity = "0"; // 确保不需要时不显示
      }

      // 显示完成后，重置为隐藏过渡效果，为下次隐藏做准备
      setTimeout(() => {
        // 只有当滚动条仍然可见时，才更新隐藏过渡效果
        if (this.isVisible) {
          this.hScrollbar.style.transition = `opacity ${
            this.options.hideDuration / 1000
          }s ease-out`;
          this.vScrollbar.style.transition = `opacity ${
            this.options.hideDuration / 1000
          }s ease-out`;
        }
      }, this.options.showDuration);
    });

    // 显示后，如果鼠标不在内部，则计划隐藏
    this.scheduleHide();
  }

  private scheduleHide(): void {
    // 如果正在拖拽或鼠标在滚动条上，则不隐藏
    if (
      this.isDraggingHScroll ||
      this.isDraggingVScroll ||
      this.isMouseOverScrollbar
    ) {
      this.clearTimeouts(true, true); // 清除隐藏和显示计时器
      return;
    }
    // 如果鼠标仍在根元素内，也可能不隐藏（除非配置了很短的隐藏延迟）
    // 当前逻辑：只要不满足上述条件，就开始计时隐藏
    // 如果已经计划隐藏，则不重复
    if (this.hideTimeout !== null) return;

    this.clearTimeouts(true, false); // 清除显示计时器

    this.hideTimeout = window.setTimeout(() => {
      // 再次检查状态
      if (
        !this.isMouseOverRoot &&
        !this.isDraggingHScroll &&
        !this.isDraggingVScroll &&
        !this.isMouseOverScrollbar
      ) {
        this.hideScrollbars();
      }
      this.hideTimeout = null;
    }, this.options.hideDelay!);
  }

  private hideScrollbars(force: boolean = false): void {
    // 如果正在拖拽或鼠标在滚动条上，则不隐藏（除非强制）
    if (
      !force &&
      (this.isDraggingHScroll ||
        this.isDraggingVScroll ||
        this.isMouseOverScrollbar)
    ) {
      return;
    }
    this.clearTimeouts(true, true); // 清除显示和隐藏计时器
    this.isVisible = false;
    // 使用 CSS transition 来隐藏
    this.hScrollbar.style.opacity = "0";
    this.vScrollbar.style.opacity = "0";
  }

  // --- 尺寸更新与计算 ---

  /**
   * 更新视口和内容尺寸，并重新计算滚动条状态。
   * @param viewportWidth 可见区域宽度
   * @param viewportHeight 可见区域高度
   * @param contentWidth 内容总宽度
   * @param contentHeight 内容总高度
   * @param tableWidth 左侧表格宽度 (用于调整水平滚动条的起始位置和宽度)
   * @param headerHeight 头部高度 (用于调整垂直滚动条的起始位置和高度)
   */
  public updateSize(
    viewportWidth: number,
    viewportHeight: number,
    contentWidth: number,
    contentHeight: number,
    tableWidth: number = 0, // 甘特图左侧表格宽度
    headerHeight: number = 0 // 甘特图头部高度
  ): void {
    this.viewportWidth = Math.max(0, viewportWidth);
    this.viewportHeight = Math.max(0, viewportHeight);
    // 内容尺寸至少是视口尺寸
    this.contentWidth = Math.max(this.viewportWidth, contentWidth);
    this.contentHeight = Math.max(this.viewportHeight, contentHeight);

    const needHScroll =
      this.canScrollHorizontal() && this.options.showHorizontal;
    const needVScroll = this.canScrollVertical() && this.options.showVertical;

    // 调整水平滚动条轨道位置和尺寸
    if (needHScroll) {
      const hScrollbarWidth =
        this.viewportWidth - (needVScroll ? this.options.track.size! : 0);
      this.hScrollbar.style.display = "block";
      this.hScrollbar.style.left = `${tableWidth}px`;
      this.hScrollbar.style.width = `${Math.max(0, hScrollbarWidth)}px`;
      this.hScrollbar.style.bottom = "0px"; // 贴底
      // 如果垂直滚动条也显示，则右边留出空间
      this.hScrollbar.style.right = needVScroll
        ? `${this.options.track.size!}px`
        : "0px";
    } else {
      this.hScrollbar.style.display = "none";
    }

    // 调整垂直滚动条轨道位置和尺寸
    if (needVScroll) {
      const vScrollbarHeight =
        this.viewportHeight -
        headerHeight -
        (needHScroll ? this.options.track.size! : 0);
      this.vScrollbar.style.display = "block";
      this.vScrollbar.style.top = `${headerHeight}px`;
      this.vScrollbar.style.height = `${Math.max(0, vScrollbarHeight)}px`;
      this.vScrollbar.style.right = "0px"; // 贴右
      // 如果水平滚动条也显示，则底部留出空间
      this.vScrollbar.style.bottom = needHScroll
        ? `${this.options.track.size!}px`
        : "0px";
    } else {
      this.vScrollbar.style.display = "none";
    }

    // 更新滑块样式（尺寸和位置）
    this.updateThumbStyles();

    // 确保当前滚动位置在更新后的有效范围内
    const clampedScroll = this.clampScroll({
      x: this.scrollLeft,
      y: this.scrollTop
    });
    if (
      clampedScroll.x !== this.scrollLeft ||
      clampedScroll.y !== this.scrollTop
    ) {
      this.scrollLeft = clampedScroll.x;
      this.scrollTop = clampedScroll.y;
      this.updateThumbStyles(); // 更新滑块位置
      this.root.event.emit(EventName.SCROLL, {
        // 触发一次校准事件
        x: this.scrollLeft,
        y: this.scrollTop,
        source: "api"
      });
    }

    // 根据新尺寸决定是否显示滚动条
    if (
      this.isMouseOverRoot ||
      this.isDraggingHScroll ||
      this.isDraggingVScroll
    ) {
      this.scheduleShow(); // 如果鼠标在内部或正在拖拽，计划显示
    } else {
      // 否则，根据是否需要滚动来决定是否强制隐藏
      if (!needHScroll && !needVScroll) {
        this.hideScrollbars(true); // 强制隐藏
      } else if (!this.isVisible) {
        // 如果之前不可见，保持隐藏状态
        this.hideScrollbars(true);
      } else {
        // 如果之前可见，但现在尺寸变了，重新判断显隐
        this.scheduleShow(); // 尝试显示，如果不需要会立即隐藏
      }
    }
  }

  private updateThumbStyles(): void {
    // 水平滑块
    if (this.canScrollHorizontal() && this.options.showHorizontal) {
      const trackWidth = this.hScrollbar.clientWidth;
      // 滑块宽度 = 轨道宽度 * (视口宽度 / 内容宽度)，且不小于最小值
      const thumbWidth = Math.max(
        this.options.thumb.size!,
        trackWidth * (this.viewportWidth / this.contentWidth) // 注意这里是用总视口宽度算比例
      );
      // 确保滑块宽度不超过轨道宽度
      const actualThumbWidth = Math.min(trackWidth, thumbWidth);
      this.hScrollThumb.style.width = `${actualThumbWidth}px`;

      // 滑块位置 = (滚动距离 / 最大滚动距离) * 最大可移动距离
      const maxScrollLeft = this.contentWidth - this.viewportWidth;
      const maxThumbPos = trackWidth - actualThumbWidth;
      const thumbLeft =
        maxScrollLeft > 0 ? (this.scrollLeft / maxScrollLeft) * maxThumbPos : 0;
      this.hScrollThumb.style.transform = `translateX(${Math.max(
        0,
        Math.min(thumbLeft, maxThumbPos)
      )}px)`; // 使用 transform 提高性能
      this.hScrollThumb.style.left = "0px"; // left 固定为 0
    } else {
      this.hScrollThumb.style.width = "0px";
    }

    // 垂直滑块
    if (this.canScrollVertical() && this.options.showVertical) {
      const trackHeight = this.vScrollbar.clientHeight;
      const thumbHeight = Math.max(
        this.options.thumb.size!,
        trackHeight * (this.viewportHeight / this.contentHeight) // 注意用总视口高度
      );
      const actualThumbHeight = Math.min(trackHeight, thumbHeight);
      this.vScrollThumb.style.height = `${actualThumbHeight}px`;

      const maxScrollTop = this.contentHeight - this.viewportHeight;
      const maxThumbPos = trackHeight - actualThumbHeight;
      const thumbTop =
        maxScrollTop > 0 ? (this.scrollTop / maxScrollTop) * maxThumbPos : 0;
      this.vScrollThumb.style.transform = `translateY(${Math.max(
        0,
        Math.min(thumbTop, maxThumbPos)
      )}px)`; // 使用 transform
      this.vScrollThumb.style.top = "0px"; // top 固定为 0
    } else {
      this.vScrollThumb.style.height = "0px";
    }
  }

  private canScrollHorizontal(): boolean {
    return this.contentWidth > this.viewportWidth;
  }

  private canScrollVertical(): boolean {
    return this.contentHeight > this.viewportHeight;
  }

  private clampScroll(pos: { x: number; y: number }): { x: number; y: number } {
    const maxScrollLeft = Math.max(0, this.contentWidth - this.viewportWidth);
    const maxScrollTop = Math.max(0, this.contentHeight - this.viewportHeight);
    return {
      x: Math.max(0, Math.min(pos.x, maxScrollLeft)),
      y: Math.max(0, Math.min(pos.y, maxScrollTop))
    };
  }

  // --- 滚动控制 ---

  /**
   * 滚动到指定位置
   * @param pos 目标滚动位置 {x, y}
   * @param source 滚动来源
   */
  public scrollTo(
    pos: { x?: number; y?: number },
    source: ScrollEventData["source"] = "api"
  ): void {
    this.scheduleShow(); // 尝试滚动时就计划显示
    const clampedPos = this.clampScroll(merge(this.getScrollPosition(), pos));

    // 如果目标位置与当前位置相同，则无需操作
    if (this.scrollLeft === clampedPos.x && this.scrollTop === clampedPos.y) {
      // 如果正在进行的动画目标也是这里，也无需打断
      if (
        this.isAnimating &&
        this.animationTargetScrollLeft === clampedPos.x &&
        this.animationTargetScrollTop === clampedPos.y
      ) {
        return;
      }
      // 如果没有动画，或者动画目标不同，则取消现有动画（如果目标一致则动画会自然结束）
      this.cancelAnimation();
      return;
    }

    // --- 判断是否需要动画 ---
    const useAnimation =
      (source === "api" || source === "track") &&
      this.options.animationDuration! > 0;

    // --- 取消现有动画 ---
    this.cancelAnimation();

    if (useAnimation) {
      // --- 启动动画 ---
      this.isAnimating = true;
      this.animationStartTime = performance.now();
      this.animationStartScrollLeft = this.scrollLeft;
      this.animationStartScrollTop = this.scrollTop;
      this.animationTargetScrollLeft = clampedPos.x;
      this.animationTargetScrollTop = clampedPos.y;
      this.animationSource = source; // 记录触发源

      // 启动动画循环
      this.animationFrameId = requestAnimationFrame(this.animationStep);
    } else {
      // --- 立即滚动 ---
      this.isAnimating = false; // 确保动画状态为 false
      const changedX = this.scrollLeft !== clampedPos.x;
      const changedY = this.scrollTop !== clampedPos.y;

      if (changedX || changedY) {
        this.scrollLeft = clampedPos.x;
        this.scrollTop = clampedPos.y;
        this.updateThumbStyles(); // 立即更新滑块
        this.root.event.emit(EventName.SCROLL, {
          // 触发滚动事件
          x: this.scrollLeft,
          y: this.scrollTop,
          source
        });
      }
    }
  }

  // --- 动画处理 ---

  private animationStep = (timestamp: number): void => {
    if (!this.isAnimating) return;

    const elapsedTime = timestamp - this.animationStartTime;
    const duration = this.options.animationDuration!;

    // 使用 easeOutQuad 缓动函数
    const progress = Math.min(1, elapsedTime / duration);
    const easedProgress = progress * (2 - progress); // t * (2 - t)

    const newScrollLeft =
      this.animationStartScrollLeft +
      (this.animationTargetScrollLeft - this.animationStartScrollLeft) *
        easedProgress;
    const newScrollTop =
      this.animationStartScrollTop +
      (this.animationTargetScrollTop - this.animationStartScrollTop) *
        easedProgress;

    const changedX = this.scrollLeft !== newScrollLeft;
    const changedY = this.scrollTop !== newScrollTop;

    if (changedX || changedY) {
      this.scrollLeft = newScrollLeft;
      this.scrollTop = newScrollTop;
      this.updateThumbStyles(); // 更新滑块位置以匹配动画
      this.root.event.emit(EventName.SCROLL, {
        // 触发滚动事件
        x: this.scrollLeft,
        y: this.scrollTop,
        source: this.animationSource // 使用动画触发源
      });
    }

    // 检查动画是否结束
    if (progress < 1) {
      this.animationFrameId = requestAnimationFrame(this.animationStep);
    } else {
      // 动画结束，确保最终位置精确
      this.isAnimating = false;
      this.animationFrameId = null;
      if (
        this.scrollLeft !== this.animationTargetScrollLeft ||
        this.scrollTop !== this.animationTargetScrollTop
      ) {
        this.scrollLeft = this.animationTargetScrollLeft;
        this.scrollTop = this.animationTargetScrollTop;
        this.updateThumbStyles();
        this.root.event.emit(EventName.SCROLL, {
          x: this.scrollLeft,
          y: this.scrollTop,
          source: this.animationSource
        });
      }
      // 动画结束，重新计划隐藏
      this.scheduleHide();
    }
  };

  private cancelAnimation(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.isAnimating = false;
  }

  /**
   * 获取当前滚动位置
   */
  public getScrollPosition(): { x: number; y: number } {
    return { x: this.scrollLeft, y: this.scrollTop };
  }

  // --- 销毁 ---

  public destroy(): void {
    this.unbindEvents();
    this.clearTimeouts();
    this.cancelAnimation(); // 确保取消动画

    if (this.scrollbarContainer.parentNode) {
      this.scrollbarContainer.parentNode.removeChild(this.scrollbarContainer);
    }
    // @ts-ignore
    this.rootElement = null;
    // @ts-ignore
    this.eventManager = null;
    // @ts-ignore
    this.hScrollbar = null;
    // @ts-ignore
    this.vScrollbar = null;
    // @ts-ignore
    this.hScrollThumb = null;
    // @ts-ignore
    this.vScrollThumb = null;
    // @ts-ignore
    this.scrollbarContainer = null;

    Logger.debug("Scrollbar destroyed");
  }
}
