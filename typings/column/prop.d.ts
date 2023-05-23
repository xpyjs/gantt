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
   */
  width: [string, number];

  /**
   * 当前列要展示的字段 key
   */
  prop: string;

  /**
   * 当前列的表头显示文本。如果没有 label，则直接显示 prop 字段名称
   */
  label: string;

  /**
   * 是否合并，一个函数，抛出当前数据，接收true / false，true为合并当前行，与前置列合并
   * @default false
   */
  merge: PropType<boolean | ((data: any) => boolean)>;

  /**
   * 居中显示
   * @default false
   */
  center: boolean;

  /**
   * 文本溢出显示省略号
   * @default false
   */
  ellipsis: boolean;

  /**
   * 自定义格式化显示日期。如果列内需要显示日期时间，提供一个格式化字符串
   */
  dateFormat: string;

  /**
   * 设置空数据显示内容。默认 "无数据 😢"
   * @default "无数据 😢"
   */
  emptyData: string;

  /**
   * 内容样式
   */
  columnStyle: [object, string];

  /**
   * 内容类名
   */
  columnClass: [object, string];
};

export type ColumnProps = ExtractPropTypes<typeof props>;

export declare interface ColumnMethods extends MethodOptions {}

export declare interface ColumnEmits extends ObjectEmitsOptions {}
