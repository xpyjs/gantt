import { IGanttOptions } from "./options";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type IOptions = DeepPartial<IGanttOptions>;

export type IOptionConfig = {
  /** 是否合并选项 */
  merge?: boolean;
};

export interface EmitData {
  /** 原始数据 */
  data: any;
  /** 当前数据的索引 */
  $index: number;
  /** 当前数据的层级。 1 开始 */
  level: number;
}

export interface EmitBaseline {
  /** 原始数据 */
  data: any;
  /** 基线数据 */
  baseline: any;
  /** 当前数据的索引 */
  $index: number;
  /** 当前数据的层级。 1 开始 */
  level: number;
}
