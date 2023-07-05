import {
  type ObjectEmitsOptions,
  type MethodOptions,
  type PropType,
  type ExtractPropTypes
} from 'vue';

export declare const props: {
  /**
   * 数据列表。它应当是一个响应式的数组。
   *
   * 数组中的每一个对象都应当包含以下属性：
   * @member id - 全局唯一的 id 值，需要确保它的存在并且唯一，否则会引起渲染错误。该键可以通过 [{@link https://docs.xiaopangying.com/gantt/root.html#data-id | #data-id}] 配置。
   * @member startDate - 任务的开始日期。它应当是一个 Date 对象，或者可以转为 Date 的数字或字符串。该键可以通过 [{@link https://docs.xiaopangying.com/gantt/root.html#start-key | #start-key}] 配置。
   * @member endDate - 任务的截止日期。它应当是一个 Date 对象，或者可以转为 Date 的数字或字符串。该键可以通过 [{@link https://docs.xiaopangying.com/gantt/root.html#end-key | #end-key}] 配置。
   *
   * @notice 当修改（拖动等）对象时，`startDate` 和 `endDate` 会默认转为 Date 对象。请在使用时确保它们的类型正确。
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#data
   * @example
   * <script>
   *    const dataList = reactive([
   *      {
   *        id: 1,
   *        name: 'xxx',
   *        startDate: '2023-05-20',
   *        endDate: '2023-05-21'
   *      }
   *    ]);
   * </script>
   *
   * <template>
   *    <x-gantt :data="dataList" />
   * </template>
   */
  data: {
    type: PropType<any[]>;
    default: () => [];
  };

  /**
   * 连接线列表。它应当是一个响应式的数组。
   *
   * 每一个对象都应当包含 `from`、`to` 两个属性，表示连线的起止位置，它们都应当是 `data` 中指定的 `data-id` 唯一值。
   *
   * @notice 如果要使用连线功能，则至少传入一个空数组，否则新增连线也是不生效的，因为它会基于这个数组进行渲染。
   * @notice 当 `from` 和 `to` 一样时，不会连线。
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#links
   *
   * @example
   * const links = reactive([
   *    {
   *      from: 1,
   *      to: 2
   *    }
   * ])
   */
  links: {
    type: PropType<
      Array<{
        from: unknown;
        to: unknown;
        color?: string;
        [key: string]: unknown;
      }>
    >;
  };

  /**
   * 数据索引的label，默认 id。应当确保它是唯一的，如果不是，则可能会引起渲染错误。
   *  @default 'id'
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#data-id
   */
  dataId: {
    type: PropType<string>;
  };

  /**
   * 数据中起始日期的label，默认值：startDate，如果找不到，则不会渲染甘特条
   * @default 'startDate'
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#start-key
   */
  startKey: {
    type: PropType<string>;
  };

  /**
   * 数据中截止日期的label，默认值：endDate。如果找不到，同时没有起始日期，则不会渲染甘特条
   * @default 'endDate'
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#end-key
   */
  endKey: {
    type: PropType<string>;
  };

  /**
   * 接收一个表头高度，默认值为80。如果高度过小，且表头过于复杂，可能会引起高度异常
   * @default 80
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#header-height
   */
  headerHeight: {
    type: PropType<number | string>;
  };

  /**
   * 接收一个内容的行高，应该保证大于20，默认行高30（含1px的border）
   * @default 30
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#row-height
   */
  rowHeight: [number, string];

  /**
   * 边框尺寸，0 为不显示。默认为 1。不显示的仅仅是整个甘特图的边框，不包括表头和内容的 border。
   * @default 1
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#border
   */
  border: number;

  /**
   * border 颜色
   *
   * @default '#e5e5e5'
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#border-color
   */
  borderColor: string;

  /**
   * 是否显示复选框，默认为隐藏
   * @default false
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#show-checkbox
   */
  showCheckbox: boolean;

  /**
   * 是否显示展开按钮，如果为否，则全部展开。默认展开
   * @default true
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#show-expand
   */
  showExpand: boolean;

  /**
   * 展开所有数据，默认展开。仅当传入了 `showExpand` 才生效
   * @default true
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#expand-all
   */
  expandAll: boolean;

  /**
   * 甘特图表的每一列宽度
   * @default 'normal'
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#gantt-column-size
   */
  ganttColumnSize: PropType<GanttColumnSize>;

  /**
   * 显示甘特图的今日线
   * @default true
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#show-today
   */
  showToday: boolean;

  /**
   * 显示甘特图的周末背景
   * @default true
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#show-weekend
   */
  showWeekend: boolean;

  /**
   * 定义层级颜色。
   *
   * 在渲染时，对应层级的数据会在该数组中查找对应的背景颜色，如果存在，那么就会渲染，否则渲染普通背景颜色。
   *
   * @default []
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#level-color
   */
  levelColor: PropType<string[]>;

  /**
   * 头部样式，一个对象
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#header-style
   */
  headerStyle: PropType<HeaderOptions>;

  /**
   * 内容样式，一个对象
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#body-style
   */
  bodyStyle: PropType<BodyOptions>;

  /**
   * 暗黑模式
   * @default false
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#dark
   */
  dark: boolean;

  /**
   * 主色。它会显示在表头以及按钮上
   * @default '#eca710'
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#primary-color
   */
  primaryColor: string;

  /**
   * 日期单位
   * @default 'day'
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#unit
   */
  unit: PropType<HeaderDateUnit>;

  /**
   * 允许鼠标悬停高亮表头对应日期
   * @default false
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#highlight-date
   */
  highlightDate: boolean;

  /**
   * 点击行时，是否将当前行滚动到视图中
   * @default false
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#slider-into-view
   */
  sliderIntoView: boolean;

  /**
   * 允许拖拽行顺序。它将改变原始数据的顺序
   * @default false
   *
   * @description 开启该属性，允许对甘特图中的每行任务进行拖拽排序。默认情况下，仅允许拖拽同层内容的顺序。如果需要任意层级的拖拽时，可以传递一个对象，将参数配置为：`{ level: 'all' }` 即可。
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#draggable
   *
   * @notice 这是一个预览功能，如果出现任何 bug，或者您希望有所改进，欢迎给我们提出 [issue](https://github.com/xpyjs/gantt/issues)
   */
  draggable: boolean | DraggableOptions;

  /**
   * 国际化显示
   *
   * @default 'en'
   *
   * @see https://docs.xiaopangying.com/gantt/root.html#locale
   */
  locale: string;
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
  // 'row-click': (data: any) => void;
  // 'row-dbl-click': (data: any) => void;
  // 'row-checked': (state: boolean, data: any, list: any[]) => void;
  // 'move-slider': (data: MoveSliderData[]) => void;
  // 'add-link': (
  //   link: LinkProps,
  //   data: {
  //     from: any;
  //     to: any;
  //   },
  //   cb: (link: LinkProps) => void
  // ) => void;
  // 'click-link': (link: any) => void;
  // 'no-date-error': (date: Date) => void;
}
