import Variables from '@/constants/vars';
import RowItem from '@/models/data/row';

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

  // ********* 内部参数 ********* //
  data: RowItem
};
