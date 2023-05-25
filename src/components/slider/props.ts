import Variables from '@/constants/vars';
import RowItem from '@/models/data/row';
import { type PropType } from 'vue';

export default {
  /**
   * 需要展示的字段 key
   */
  prop: String,

  /**
   * 显示文本。如果没有 label，则直接显示 prop 字段的值。它的优先级比 prop 高
   */
  label: {
    type: String
  },

  /**
   * 自定义显示日期的格式。
   */
  dateFormat: {
    type: String
    // 重要，此处不能设置 default 默认值，需要在创建阶段配置默认值 'yyyy-MM-dd'。
    // 如果这里设置了，所有属性都会被格式化。
  },

  /**
   * 滑块的高度，支持数值（单位 px），以及百分比形式（相对于父元素）
   */
  height: {
    type: [Number, String],
    default: '50%'
  },

  /**
   * 背景颜色
   */
  bgColor: {
    type: String
  },

  /**
   * 对齐方式
   * 接收 left, center, right
   */
  alignment: {
    type: String as PropType<SliderAlignment>,
    default: 'left',
    validator: (v: SliderAlignment) => {
      return ['left', 'center', 'right'].includes(v);
    }
  },

  /**
   * 允许移动
   */
  move: {
    type: [Function, Boolean] as PropType<
      boolean | ((data: RowData) => boolean)
    >,
    default: () => false
  },

  /**
   * 允许左侧移动
   */
  resizeLeft: {
    type: [Function, Boolean] as PropType<
      boolean | ((data: RowData) => boolean)
    >,
    default: () => false
  },

  /**
   * 允许右侧移动
   */
  resizeRight: {
    type: [Function, Boolean] as PropType<
      boolean | ((data: RowData) => boolean)
    >,
    default: () => false
  },

  /**
   * 允许父子级别移动时大小联动。如果设置为 true，在移动时会计算父子的最大边缘值，保证子内容不会超过父内容。
   */
  linkedResize: {
    type: Boolean
  },

  /**
   * 允许创建、修改连线。如果设置为 false，不会影响已有连线的展示
   */
  allowLink: {
    type: Boolean,
    default: true
  },

  /**
   * 空值内容
   */
  emptyData: {
    type: String,
    default: Variables.noData
  },

  /**
   * 启用进度条显示
   */
  progress: {
    type: Boolean,
    default: false
  },

  /**
   * 进度条是否启用小数
   */
  progressDecimal: {
    type: [Boolean, Number],
    default: false,
    validator: (v: boolean | number) => {
      if (typeof v === 'number') {
        return v >= 0 && v <= 10;
      }
      return true;
    }
  },

  /**
   * 自定义进度条颜色
   */
  progressColor: {
    type: String
  },

  // ****** 内部参数 ****** //
  data: RowItem
};
