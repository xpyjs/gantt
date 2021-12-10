import { PropType } from 'vue';
import { Variables } from '@/constants/vars';
import { Alignment } from '@/typings/ParamOptions';

export default {
  /**
   * 设置需要显示的内容字段
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
   * 扁平风格
   */
  flat: {
    type: Boolean,
    default: false
  },

  /**
   * 背景颜色
   */
  bgColor: {
    type: String,
    default: ''
  },

  /**
   * 对齐方式
   * 接收 left, center, right
   */
  alignment: {
    type: String as PropType<Alignment>,
    default: 'left',
    validator: (v: Alignment) => {
      return ['left', 'center', 'right'].includes(v);
    }
  },

  /**
   * 允许移动
   */
  move: {
    type: [Function, Boolean],
    default: () => false
  },

  /**
   * 允许左侧移动
   */
  resizeLeft: {
    type: Boolean,
    default: false
  },

  /**
   * 允许右侧移动
   */
  resizeRight: {
    type: Boolean,
    default: false
  },

  /**
   * 空值内容
   */
  emptyData: {
    type: String,
    default: Variables.noData
  },

  /**
   * 允许父子级别移动时大小联动。如果设置为 true，在移动时会计算父子的最大边缘值，保证子内容不会超过父内容。
   */
  linkedResize: {
    type: Boolean
  },

  /**
   * 启用进度条显示
   */
  progress: {
    type: Boolean,
    default: false
  }
};
