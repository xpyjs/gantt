/*
 * @Author: JeremyJone
 * @Date: 2025-04-18 10:58:36
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-11-04 09:48:07
 * @Description: 事件总线
 */

export class EventBus {
  private events: Map<string, Function[]> = new Map();

  /**
   * 注册事件监听器
   * @param event 事件名称
   * @param callback 回调函数
   */
  public on(event: EventName, callback: Function): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)?.push(callback);
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 参数列表
   */
  public emit(event: string, ...args: any[]): void {
    if (this.events.has(event)) {
      this.events.get(event)?.forEach(cb => cb(...args));
    }
  }

  /**
   * 移除特定事件的特定监听器
   * @param event 事件名称
   * @param callback 要移除的回调函数
   */
  public off(event: string, callback: Function): void {
    if (this.events.has(event)) {
      this.events.set(
        event,
        this.events.get(event)?.filter(cb => cb !== callback) || []
      );
    }
  }

  /**
   * 移除所有事件监听器
   */
  public offAll(): void {
    this.events.clear();
  }
}

// 定义事件名称，方便统一管理
export enum EventName {
  LOADED = "loaded",

  COLUMN_WIDTH_CHANGE = "column-width-change",
  MOVE_GUIDELINE = "move-guideline",
  SHOW_GUIDELINE = "show-guideline",
  HIDE_GUIDELINE = "hide-guideline",
  TOGGLE_COLLAPSE = "toggle-collapse",

  SCROLL = "scroll",
  CHART_OFFSET_CHANGE = "chart_offset_change",
  DATA_UPDATE = "data-update",
  VIEW_UPDATE = "view-update",
  OPTIONS_UPDATE = "options-update",

  // 指定更新内容
  UPDATE_TABLE_HEADER = "update_table_header",
  UPDATE_TABLE_BODY = "update_table_body",
  UPDATE_CHART_HEADER = "update_chart_header",
  UPDATE_TASK = "update_task",
  UPDATE_LINK = "update_link",

  CREATE_LINK = "create_link",

  // 选中相关
  TASK_SELECTED = "task_selected",
  TASK_UNSELECTED = "task_unselected",
  SELECT_LINK = "select_link",
  CHECK_TASK = "check_task",
  CONTEXT_LINK = "context_link",

  ROW_CLICK = "row-click",
  ROW_DBL_CLICK = "row-dbl-click",
  ROW_CONTEXTMENU = "row-contextmenu",
  SLIDER_CLICK = "slider-click",
  SLIDER_DBL_CLICK = "slider-dbl-click",
  SLIDER_CONTEXTMENU = "slider-contextmenu",
  SLIDER_DRAGGING = "slider-dragging",
  SLIDER_ENTER = "slider-enter",
  SLIDER_HOVER = "slider-hover",
  SLIDER_LEAVE = "slider-leave",

  // 闪烁事件，用于特定提醒
  SLIDER_BLINK = "slider-blink",
  LINK_BLINK = "link-blink",

  // 行高亮相关事件
  ROW_HIGHLIGHT = "row-highlight",
  ROW_UNHIGHLIGHT = "row-unhighlight",

  // 任务拖拽相关事件
  TASK_DRAG_START = "task-drag-start",
  TASK_DRAG_MOVE = "task-drag-move",
  TASK_DRAG_END = "task-drag-end",

  // 基线事件
  BASELINE_CLICK = "baseline-click",
  BASELINE_CONTEXTMENU = "baseline-contextmenu",
  BASELINE_MOUSEENTER = "baseline-mouseenter",
  BASELINE_MOUSEMOVE = "baseline-mousemove",
  BASELINE_MOUSEOUT = "baseline-mouseout",

  // 拖拽操作
  ROW_DRAG_START = "row-drag-start",
  ROW_DRAGGING = "row-dragging",
  ROW_DRAG_END = "row-drag-end",

  // 抛出异常事件
  ERROR = "error"
}

// 异常类型
export enum ErrorType {
  /** 无效类型 */
  INVALID_TYPE = "INVALID_TYPE",
  /** 任务不存在 */
  TASK_NOT_FOUND = "TASK_NOT_FOUND",
  /** 连线不被允许 */
  LINK_NOT_ALLOWED = "LINK_NOT_ALLOWED",
  /** 相同节点 */
  LINK_SAME = "LINK_SAME",
  /** 当前关联已存在 */
  LINK_EXIST = "LINK_EXIST",
  /** 无效参数 */
  LINK_INVALID_ARG = "LINK_INVALID_ARG",
  /** 检测到环 */
  LINK_CYCLE = "LINK_CYCLE"
}
