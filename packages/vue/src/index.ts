/*
 * @Author: JeremyJone
 * @Date: 2025-06-17
 * @Description: Vue 3 wrapper for XGantt
 */

import GanttVue from "./components/GanttVue.vue";
import {
  XGanttVueSlots,
  XGanttVueProps,
  XGanttVueEmits
} from "./components/props";
import type { App } from "vue";

// 导出组件实例类型
export type XGanttInstance = InstanceType<typeof GanttVue>;

// 导出类型
export type { XGanttVueProps, XGanttVueEmits, XGanttVueSlots };

// 添加 install 类型
const XGanttVue = GanttVue as typeof GanttVue & {
  install: (app: App) => void;
};

// 添加 install
XGanttVue.install = (app: App) => {
  app.component("XGanttVue", XGanttVue);
};

// 导出组件
export { XGanttVue };

export default XGanttVue;

// 导出一些类型
export type {
  IOptions,
  IOptionConfig,
  EmitData,
  EventMap,
  ILink,
  ErrorType,
  Dayjs,
  Colorjs,
  XGanttUnit,
  DataChain
} from "@xpyjs/gantt-core";

// 导出核心库的工具函数
export { generateId, dayjs, colorjs } from "@xpyjs/gantt-core";
