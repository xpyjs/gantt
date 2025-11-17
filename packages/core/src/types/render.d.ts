import { Store } from "@/store";
import { EventBus } from "../event";
import { Scrollbar } from "../rendering/scrollbar";
import { IGanttOptions } from "./options";

export interface IContext {
  /**
   * 获取 Store 实例
   */
  store: Store;

  /**
   * 获取事件总线实例
   */
  event: EventBus;

  /**
   * 获取滚动条实例
   */
  getScrollbar: () => Scrollbar;

  /**
   * 获取根元素
   */
  getRootElement: () => HTMLElement;

  /**
   * 获取选项
   */
  getOptions: () => IGanttOptions;
}
