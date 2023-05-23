import {
  type ObjectEmitsOptions,
  type MethodOptions,
  type PropType,
  type ExtractPropTypes
} from 'vue';

export declare const props: {
  /**
   * 数据列表
   * @default []
   */
  data: {
    type: PropType<any[]>;
    default: () => any[];
  };

  /**
   * 连接线列表
   * @default []
   */
  links: {
    type: PropType<any[]>;
    default: () => any[];
  };

  /**
   * 数据索引的label，默认 id。应当确保它是唯一的，如果不是，则会引起渲染错误。
   *  @default 'id'
   */
  dataId: {
    type: PropType<string>;
    default: string;
  };

  /**
   * 数据中起始日期的label，默认值：startDate，如果找不到，则不会渲染甘特条
   * @default 'startDate'
   */
  startKey: {
    type: PropType<string>;
    default: string;
  };

  /**
   * 数据中截止日期的label，默认值：endDate。如果找不到，同时没有起始日期，则不会渲染甘特条
   * @default 'endDate'
   */
  endKey: {
    type: PropType<string>;
    default: string;
  };

  /**
   * 接收一个表头高度，默认值为80。如果高度过小，且表头过于复杂，可能会引起高度异常
   * @default 80
   */
  headerHeight: {
    type: PropType<number | string>;
    default: number;
  };

  /**
   * 接收一个内容的行高，应该保证大于20，默认行高30（含1px的border）
   * @default 30
   */
  rowHeight: [number, string];

  /**
   * 边框尺寸，0 为不显示。默认为 1
   * @default 1
   */
  border: number;

  /**
   * border 颜色
   */
  borderColor: string;

  /**
   * 是否显示复选框，默认为隐藏
   * @default false
   */
  showCheckbox: boolean;

  /**
   * 是否显示展开按钮，如果为否，则全部展开。默认为是
   * @default true
   */
  showExpand: boolean;

  /**
   * 展开所有数据，默认展开。仅当传入了 `showExpand` 才生效
   * @default true
   */
  expandAll: boolean;

  /**
   * 甘特图表的每一列宽度
   * @default 'normal'
   */
  ganttColumnSize: PropType<GanttColumnSize>;

  /**
   * 显示甘特图的今日线
   * @default true
   */
  showToday: boolean;

  /**
   * 显示甘特图的周末背景
   * @default true
   */
  showWeekend: boolean;

  /**
   * 定义层级颜色，循环显示
   * @default []
   */
  levelColor: PropType<string[]>;

  /**
   * 头部样式，一个对象
   */
  headerStyle: PropType<HeaderOptions>;

  /**
   * 内容样式，一个对象
   */
  bodyStyle: PropType<BodyOptions>;

  /**
   * 暗黑模式
   * @default false
   */
  dark: boolean;

  /**
   * 主色。它会显示在表头以及按钮上
   * @default '#eca710'
   */
  primaryColor: string;

  /**
   * 日期单位
   * @default 'day'
   */
  unit: PropType<HeaderDateUnit>;

  /**
   * 允许鼠标悬停高亮表头对应日期
   * @default false
   */
  highlightDate: boolean;
};

export type RootProps = ExtractPropTypes<typeof props>;

export declare interface RootMethods extends MethodOptions {
  /**
   * 设置一个选择项。如果当前数据中找不到，返回 null
   */
  setSelected: (data: any) => null | undefined;

  /**
   * 跳转到指定日期（没有参数跳转到今天）。如果找不到日期，抛出 no-date-error 事件
   */
  jumpToDate: (date: Date | undefined) => void;
}

export declare interface RootEmits extends ObjectEmitsOptions {
  //   'row-click': (data: any) => void;
  //   'row-dbl-click': (data: any) => void;
  //   'row-checked': (state: boolean, data: any) => void;
  //   'move-slider': (data: MoveSliderData[]) => void;
  //   'add-link': (
  //     link: LinkProps,
  //     data: {
  //       from: any;
  //       to: any;
  //     },
  //     cb: (link: LinkProps) => void
  //   ) => void;
  //   'click-link': (link: any) => void;
  //   'no-date-error': (date: Date) => void;
}
