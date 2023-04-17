import Variables from '@/constants/vars';
import RowItem from '@/models/data/row';
import { type PropType } from 'vue';

export default {
  /**
   * 每一列的宽度，默认80。单位：px
   */
  width: {
    type: [String, Number],
    default: Variables.default.tableColumnWidth
  },

  /**
   * 当前列要展示的字段 key
   */
  prop: String,

  /**
   * 当前列的表头显示文本。如果没有 label，则直接显示 prop 字段名称
   */
  label: String,

  /**
   * 是否合并，一个函数，抛出当前数据，接收true / false，true为合并当前行，与前置列合并
   */
  merge: {
    type: [Function, Boolean] as PropType<boolean | ((data: any) => boolean)>,
    default: () => false
  },

  // ********* 内部参数 ********* //
  data: RowItem,
  __index: Number
};
