/*
 * @Author: JeremyJone
 * @Date: 2025-04-18 10:47:28
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-07-07 16:41:27
 * @Description: 项目入口
 */

import "./styles/main.scss"; // 引入全局样式

import { VERSION, printLogo } from "./logo"; // 引入版本信息

// 立即打印 LOGO
printLogo();

// 导出主要组件
export { XGantt } from "./XGantt";

// 导出工具函数
export { generateId } from "./utils/id";
export { default as dayjs } from "./utils/time";
export type { Dayjs } from "./utils/time";
export { colorjs, type Colorjs } from "./utils/color";

// 导出版本信息
export const version = VERSION;

// 导出类型定义
import type { IOptions, IOptionConfig, EmitData } from "./types";
import type { EventMap } from "./types/event";
import type { ILink } from "./types/link";
import type { ErrorType } from "./event";
import type { XGanttUnit } from "./types/options";

export type {
  IOptions,
  IOptionConfig,
  EmitData,
  EventMap,
  ILink,
  ErrorType,
  XGanttUnit
};
