/*
 * @Author: JeremyJone
 * @Date: 2025-05-09 17:06:07
 * @LastEditors: JeremyJone
 * @LastEditTime: 2026-01-12 17:15:24
 * @Description: 表格和图表中间的移动线
 */

import { IContext } from "@/types/render";
import { EventName } from "../../event";

const leftIcon = '<svg style="transition: all 0.3s" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M8.293 12.707a1 1 0 0 1 0-1.414l5.657-5.657a1 1 0 1 1 1.414 1.414L10.414 12l4.95 4.95a1 1 0 0 1-1.414 1.414z"/></g></svg>';

export class MiddleResizeLine {
  private line: HTMLDivElement;
  private initialX: number = 0;
  private initialWidth: number = 0;

  private collapseButton: HTMLDivElement | null = null;

  constructor(private root: IContext, private container: HTMLElement) {
    // 创建一个用于包含表格组件的容器
    this.line = document.createElement("div");
    this.line.className = "x-gantt-middle-resize-line";
    this.line.style.position = "absolute";
    this.line.style.zIndex = "99";
    this.line.style.width = "5px";
    this.line.style.height = "100%";
    this.line.style.borderLeft = "2px solid";
    this.line.style.setProperty(
      "border-left-color",
      this.root.store.getOptionManager().getOptions().border.color,
      "important"
    );
    this.line.style.cursor = "col-resize";

    // 添加收起按钮
    if (this.root.store.getOptionManager().getOptions().collapse.show) {
      this.collapseButton = document.createElement("div");
      this.collapseButton.className = "x-gantt-collapse-button";
      this.collapseButton.style.position = "absolute";
      this.collapseButton.style.top = "50%";
      this.collapseButton.style.left = "0";
      this.collapseButton.style.transform = "translateY(-50%)";
      this.collapseButton.style.cursor = "pointer";

      // 设置折叠按钮的样式
      this.collapseButton.style.width = "16px";
      this.collapseButton.style.height = "30px";
      this.collapseButton.style.backgroundColor = this.root.store.getOptionManager().getOptions().collapse.backgroundColor || "#fff";
      this.collapseButton.style.borderRadius = `0 ${this.root.store.getOptionManager().getOptions().collapse.radius}px ${this.root.store.getOptionManager().getOptions().collapse.radius}px 0`;
      this.collapseButton.style.boxShadow = "0 0 2px rgba(0, 0, 0, 0.2)";
      this.collapseButton.style.display = "flex";
      this.collapseButton.style.alignItems = "center";
      this.collapseButton.style.justifyContent = "center";
      // 设置折叠按钮的图标
      this.collapseButton.innerHTML = leftIcon;

      // 点击折叠按钮时触发事件
      this.collapseButton.addEventListener("click", e => {
        e.stopPropagation();
        this.root.store.getColumnManager().collapse();
      });

      this.line.appendChild(this.collapseButton);
    }

    this.container.appendChild(this.line);

    // 添加拖拽功能
    this.addDragEvents();

    this.initEvents();
  }

  /**
   * 初始化事件
   */
  private initEvents() {
    // 监听更新事件
    this.root.event.on(EventName.OPTIONS_UPDATE, () => {
      this.updateOptions();
    });
  }

  public setOffset(x: number) {
    // this.line.style.left = `${x - 2}px`;
    this.line.style.transform = `translateX(${x - 2}px)`;
    this.initialX = x;

    // 更新图标
    if (this.collapseButton) {
      if (this.root.store.getColumnManager().isCollapsed()) {
        this.collapseButton.querySelector('svg')!.style.transform = "rotate(180deg)";
      } else {
        this.collapseButton.querySelector('svg')!.style.transform = "rotate(0deg)";
      }
    }
  }

  /**
   * 添加拖拽事件
   */
  private addDragEvents() {
    let startX = 0;
    let rootRect: DOMRect | null = null;
    const columnManager = this.root.store.getColumnManager();
    const leafColumns = columnManager.getLeafColumns();

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // 记录初始鼠标位置
      startX = e.clientX;
      // 获取容器相对于视口的位置
      rootRect = this.container.getBoundingClientRect();
      // 获取最后一列的初始宽度
      const lastColumnKey = leafColumns[leafColumns.length - 1].key;
      this.initialWidth = columnManager.getColumnWidth(lastColumnKey);

      // 显示指导线
      const guidelineLeft = this.initialX;
      this.root.event.emit(EventName.SHOW_GUIDELINE, guidelineLeft);

      // 添加移动和抬起事件监听
      const mouseMoveHandler = (e: MouseEvent) => onMouseMove(e);
      const mouseUpHandler = (e: MouseEvent) =>
        onMouseUp(e, mouseMoveHandler, mouseUpHandler);

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    };

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();

      if (!rootRect) return;

      // 计算鼠标移动的距离
      const deltaX = e.clientX - startX;

      // 获取最后一列
      const lastColumnKey = leafColumns[leafColumns.length - 1].key;

      // 限制移动范围，防止最后一列宽度小于50px
      const minDeltaX = 50 - this.initialWidth;

      // 计算最大允许移动距离
      // 防止超出右侧边界，考虑在rootRect.width的基础上，而不是container的宽度
      // 最大位置应该是rootRect.width - 20
      const maxLeft = rootRect.width - 20; // 右侧保留20px的间距
      const maxDeltaX = maxLeft - this.initialX;

      // 双向限制：不能小于最小宽度，也不能超过最大宽度
      const limitedDeltaX = Math.max(minDeltaX, Math.min(maxDeltaX, deltaX));

      // 计算新位置（当前位置 + 受限的鼠标移动距离）
      const newLeft = this.initialX + limitedDeltaX;

      // 更新指导线位置
      this.root.event.emit(EventName.MOVE_GUIDELINE, newLeft);
    };

    const onMouseUp = (
      e: MouseEvent,
      mouseMoveHandler: (e: MouseEvent) => void,
      mouseUpHandler: (e: MouseEvent) => void
    ) => {
      // 移除事件监听
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);

      // 隐藏指导线
      this.root.event.emit(EventName.HIDE_GUIDELINE);

      // 计算最终位置
      const deltaX = e.clientX - startX;

      // 获取最后一列
      const lastColumnKey = leafColumns[leafColumns.length - 1].key;

      // 计算新宽度（考虑最小宽度限制）
      const newWidth = Math.max(50, this.initialWidth + deltaX);

      // 更新最后一列宽度
      columnManager.setColumnWidth(lastColumnKey, newWidth);

      // 更新表头
      this.root.event.emit(EventName.UPDATE_TABLE_HEADER);
    };

    // 添加鼠标按下事件监听
    this.line.addEventListener("mousedown", onMouseDown);
  }

  /**
   * 更新配置
   */
  private updateOptions() {
    // 更新边框颜色
    this.line.style.setProperty(
      "border-left-color",
      this.root.store.getOptionManager().getOptions().border.color,
      "important"
    );

    // 更新按钮样式
    if (this.collapseButton) {
      this.collapseButton.style.backgroundColor = this.root.store.getOptionManager().getOptions().collapse.backgroundColor || "#fff";
      this.collapseButton.style.borderRadius = `0 ${this.root.store.getOptionManager().getOptions().collapse.radius}px ${this.root.store.getOptionManager().getOptions().collapse.radius}px 0`;
    }
  }
}
