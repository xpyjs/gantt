import type { SlotsType } from "vue";
import type { IOptions, ILink, ErrorType } from "@xpyjs/gantt-core";

export type XGanttVueEmits = {
  loaded: [];
  error: [error: ErrorType];
  "update:link": [link: ILink];
  "create:link": [link: ILink];
  "select:link": [add: ILink | null, cancel: ILink | null, all: ILink[]];
  "contextmenu:link": [e: MouseEvent, link: ILink];
  select: [data: any[], checked: boolean, all: any[]];
  "click:row": [e: MouseEvent, data: any];
  "dblclick:row": [e: MouseEvent, data: any];
  "contextmenu:row": [e: MouseEvent, data: any];
  "click:slider": [e: MouseEvent, data: any];
  "dblclick:slider": [e: MouseEvent, data: any];
  "contextmenu:slider": [e: MouseEvent, data: any];
  move: [data: { row: any; old: any }[]];
  "enter:slider": [e: MouseEvent, data: any];
  "hover:slider": [e: MouseEvent, data: any];
  "leave:slider": [e: MouseEvent, data: any];
  "click:baseline": [e: MouseEvent, data: any, baseline: any];
  "contextmenu:baseline": [e: MouseEvent, data: any, baseline: any];
  "enter:baseline": [e: MouseEvent, data: any, baseline: any];
  "hover:baseline": [e: MouseEvent, data: any, baseline: any];
  "leave:baseline": [e: MouseEvent, data: any, baseline: any];
};

export interface XGanttVueProps {
  /**
   * XGantt 图表的配置选项
   *
   * @description
   * 该选项包含所有 XGantt 图表的配置参数
   */
  options: IOptions;
}

export type XGanttVueSlots = SlotsType<{
  //   /**
  //    * 默认插槽，用于显示按钮的主要内容
  //    */
  //   default?: Slot;
  //   /**
  //    * loading 状态的图标插槽
  //    */
  //   loading?: Slot;
  //   /**
  //    * 图标插槽，用于显示按钮的前置图标
  //    */
  //   icon?: Slot;
}>;
