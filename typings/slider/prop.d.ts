import {
  type ObjectEmitsOptions,
  type MethodOptions,
  type PropType,
  type ExtractPropTypes
} from 'vue';

export declare const props: {
  /**
   * 需要展示的字段 key
   */
  prop: string;

  /**
   * 显示文本。如果没有 label，则直接显示 prop 字段的值。它的优先级比 prop 高
   */
  label: string;

  /**
   * 自定义显示日期的格式。
   * 重要，此处不能设置 default 默认值，需要在创建阶段配置默认值 'yyyy-MM-dd'。
   * 如果这里设置了，所有属性都会被格式化。
   */
  dateFormat: string;

  /**
   * 滑块的高度，支持数值（单位 px），以及百分比形式（相对于父元素）
   * @default '50%
   */
  height: [number, string];

  /**
   * 背景颜色
   */
  bgColor: string;

  /**
   * 对齐方式
   * 接收 left, center, right
   * @default left
   */
  alignment: PropType<SliderAlignment>;

  /**
   * 允许移动
   * @default false
   */
  move: PropType<boolean | ((data: RowData) => boolean)>;

  /**
   * 允许左侧移动。只有在设置了 move 属性之后，该属性才会生效
   * @default false
   */
  resizeLeft: PropType<boolean | ((data: RowData) => boolean)>;

  /**
   * 允许右侧移动。只有在设置了 move 属性之后，该属性才会生效
   * @default false
   */
  resizeRight: PropType<boolean | ((data: RowData) => boolean)>;

  /**
   * 允许父子级别移动时大小联动。如果设置为 true，在移动时会计算父子的最大边缘值，保证子内容不会超过父内容。
   */
  linkedResize: boolean;

  /**
   * 允许创建、修改连线。如果设置为 false，不会影响已有连线的展示
   * @default true
   */
  allowLink: boolean;

  /**
   * 空值内容
   * @default '无数据 😢'
   */
  emptyData: string;

  /**
   * 启用进度条显示
   * @default false
   */
  progress: boolean;

  /**
   * 进度条是否启用小数
   * @default false
   */
  progressDecimal: [boolean, number];

  /**
   * 自定义进度条颜色
   */
  progressColor: string;
};

export type SliderProps = ExtractPropTypes<typeof props>;

export declare interface SliderMethods extends MethodOptions {}

export declare interface SliderEmits extends ObjectEmitsOptions {}
