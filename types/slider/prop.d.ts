import {
  type ObjectEmitsOptions,
  type MethodOptions,
  type PropType,
  type ExtractPropTypes
} from 'vue';

export declare const props: {
  /**
   * 需要展示的字段 key
   *
   * @see https://docs.xiaopangying.com/gantt/slider.html#prop
   */
  prop: string;

  /**
   * 显示文本。如果没有 label，则直接显示 prop 字段的值。它的优先级比 prop 高
   *
   * @see https://docs.xiaopangying.com/gantt/slider.html#label
   */
  label: string;

  /**
   * 自定义显示日期的格式。
   *
   * @notice 如果设置了该值，不论是否为时间，都会被格式化。
   *
   * @see https://docs.xiaopangying.com/gantt/slider.html#date-format
   *
   * @description
   * | format | description |
   * | :----: | :---------: |
   * |   y    |     年      |
   * |   q    |    季度     |
   * |   M    |     月      |
   * |   d    |     日      |
   * |   H    |     时      |
   * |   m    |     分      |
   * |   s    |     秒      |
   * |   S    |    毫秒     |
   */
  dateFormat: string;

  /**
   * 滑块的高度，支持数值（单位 px），以及百分比形式（相对于父元素）
   * @default '50%
   *
   * @see https://docs.xiaopangying.com/gantt/slider.html#height
   */
  height: [number, string];

  /**
   * 背景颜色
   *
   * @see https://docs.xiaopangying.com/gantt/slider.html#bg-color
   */
  bgColor: string;

  /**
   * 对齐方式
   * 接收 left, center, right
   * @default left
   *
   * @see https://docs.xiaopangying.com/gantt/slider.html#alignment
   */
  alignment: PropType<SliderAlignment>;

  /**
   * 允许移动
   * @default false
   *
   * @see https://docs.xiaopangying.com/gantt/slider.html#move
   */
  move: PropType<boolean | ((data: RowData) => boolean)>;

  /**
   * 允许左侧移动。只有在设置了 move 属性之后，该属性才会生效
   * @default false
   *
   * @see https://docs.xiaopangying.com/gantt/slider.html#resize-left
   */
  resizeLeft: PropType<boolean | ((data: RowData) => boolean)>;

  /**
   * 允许右侧移动。只有在设置了 move 属性之后，该属性才会生效
   * @default false
   *
   * @see https://docs.xiaopangying.com/gantt/slider.html#resize-right
   */
  resizeRight: PropType<boolean | ((data: RowData) => boolean)>;

  /**
   * 允许父子级别移动时大小联动。如果设置为 true，在移动时会计算父子的最大边缘值，保证子内容不会超过父内容。
   * @default false
   *
   * @see https://docs.xiaopangying.com/gantt/slider.html#linked-resize
   */
  linkedResize: boolean;

  /**
   * 允许创建、修改连线。如果设置为 false，不会影响已有连线的展示
   *
   * @notice 如果在根组件中不传 [{@link https://docs.xiaopangying.com/gantt/root.html#links | #links}] 属性，是不会成功创建连线的。
   *
   * @default true
   *
   * @see https://docs.xiaopangying.com/gantt/slider.html#allow-link
   */
  allowLink: boolean;

  /**
   * 空值内容
   * @default '无数据 😢'
   *
   * @see https://docs.xiaopangying.com/gantt/slider.html#empty-data
   */
  emptyData: string;

  /**
   * 启用进度条显示
   * @default false
   *
   * @see https://docs.xiaopangying.com/gantt/slider.html#progress
   */
  progress: boolean;

  /**
   * 进度条是否启用小数
   * @default false
   *
   * @see https://docs.xiaopangying.com/gantt/slider.html#progress-decimal
   */
  progressDecimal: [boolean, number];

  /**
   * 自定义进度条颜色
   * @see https://docs.xiaopangying.com/gantt/slider.html#progress-color
   */
  progressColor: string;
};

export type SliderProps = ExtractPropTypes<typeof props>;

export declare interface SliderMethods extends MethodOptions {}

export declare interface SliderEmits extends ObjectEmitsOptions {}
