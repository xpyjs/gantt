import { VNode } from 'vue';

declare interface ParamHeaderOptions {
  bgColor?: string;
  textColor?: string;
}

declare type GanttColumnSize = 'normal' | 'small' | 'large';

declare interface ParamBodyOptions {
  todayColor?: string;
  weekendColor?: string;
  bgColor?: string;
  textColor?: string;
  hoverColor?: string;
  selectColor?: string;
}

declare interface ParamOptions {
  // columnWidth?: number;
  columnSize?: GanttColumnSize;
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

declare interface HeaderDateOptions {
  /**
   * 单位，显示在表头的上策
   */
  unit: string;
  /**
   * 每一格显示的内容
   */
  one: {
    /**
     * 每一格所包含的天数
     */
    len: number;
    /**
     * 每一格的显示内容
     */
    text: string;
  }[];
}

declare type HeaderDateUnit = 'day' | 'week' | 'month';

declare type Alignment = 'left' | 'center' | 'right';

declare type ColorSelectStr = 'default' | 'dark';
