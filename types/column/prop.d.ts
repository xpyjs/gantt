import {
  type ObjectEmitsOptions,
  type MethodOptions,
  type PropType,
  type ExtractPropTypes
} from 'vue';

export declare const props: {
  /**
   * 每一列的宽度，默认80。单位：px
   * @default 80
   *
   * @see https://docs.xiaopangying.com/gantt/column.html#width
   */
  width: [string, number];

  /**
   * 当前列要展示的字段 key
   *
   * @notice 当用作父级表头时，仅接受 label 字段
   *
   * @see https://docs.xiaopangying.com/gantt/column.html#prop
   */
  prop: string;

  /**
   * 当前列的表头显示文本。如果没有 label，则直接显示 prop 字段名称
   *
   * @notice 当用作父级表头时，仅接受 label 字段
   *
   * @see https://docs.xiaopangying.com/gantt/column.html#label
   */
  label: string;

  /**
   * 是否合并，一个函数，抛出当前数据，接收true / false，true为合并当前行，与前置列合并
   * @default false
   *
   * @see https://docs.xiaopangying.com/gantt/column.html#merge
   */
  merge: PropType<boolean | ((scope: RowData) => boolean)>;

  /**
   * 居中显示
   * @default false
   *
   * @see https://docs.xiaopangying.com/gantt/column.html#center
   */
  center: boolean;

  /**
   * 文本溢出显示省略号
   * @default false
   *
   * @see https://docs.xiaopangying.com/gantt/column.html#ellipsis
   */
  ellipsis: boolean;

  /**
   * 自定义格式化显示日期。如果列内需要显示日期时间，提供一个格式化字符串
   *
   * @notice 如果设置了该值，不论是否为时间，都会被格式化。
   *
   * @see https://docs.xiaopangying.com/gantt/column.html#date-format
   *
   * @description
   * 格式化对接了 dayjs，所以格式化内容可以使用 dayjs 的格式化内容，包括它的 高级格式化。
   * 详看：https://dayjs.gitee.io/docs/zh-CN/display/format
   */
  dateFormat: string;

  /**
   * 设置空数据显示内容。默认 "无数据 😢"
   * @default "无数据 😢"
   *
   * @see https://docs.xiaopangying.com/gantt/column.html#empty-data
   */
  emptyData: string;

  /**
   * 内容样式
   *
   * @see https://docs.xiaopangying.com/gantt/column.html#column-style
   */
  columnStyle: [object, string];

  /**
   * 内容类名
   *
   * @see https://docs.xiaopangying.com/gantt/column.html#column-class
   */
  columnClass: [object, string];
};

export type ColumnProps = ExtractPropTypes<typeof props>;

export declare interface ColumnMethods extends MethodOptions {}

export declare interface ColumnEmits extends ObjectEmitsOptions {}
