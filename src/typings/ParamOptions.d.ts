import { VNode } from "vue";

declare interface ParamHeaderOptions {
  bgColor?: string;
  textColor?: string;
}

declare interface ParamBodyOptions {
  todayColor?: string;
  weekendColor?: string;
  bgColor?: string;
  textColor?: string;
  hoverColor?: string;
  selectColor?: string;
}

declare interface ParamOptions {
  columnWidth?: number;
  showToday?: boolean;
  showWeekend?: boolean;
  header?: ParamHeaderOptions;
  body?: ParamBodyOptions;
}

declare interface DataOptions {
  isExpand?: boolean;
  startLabel?: string;
  endLabel?: string;
}

declare interface TableHeaderDataOptions {
  key: number;
  label: string;
  text: string;
  width: number;
}

declare interface ColumnNodeDataOptions {
  key: number;
  label: string;
  node: VNode;
  merge: boolean;
}

declare type Alignment = "left" | "center" | "right";

declare type ColorSelectStr = "default" | "dark";
