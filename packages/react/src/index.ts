/*
 * @Author: JeremyJone
 * @Date: 2025-06-24
 * @Description: React wrapper for XGantt
 */

// 导出主要组件
export { XGanttReact } from "./components/XGanttReact";

// 导出 Hooks
export { useXGantt } from "./hooks";

// 导出类型
export type { XGanttReactProps, XGanttReactRef } from "./types";

// 重新导出核心库的类型，方便使用
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

// 重新导出核心库的工具函数
export { generateId, dayjs, colorjs } from "@xpyjs/gantt-core";

// 默认导出
export { XGanttReact as default } from "./components/XGanttReact";
