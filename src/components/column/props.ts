import { Errors } from '@/constants/errors';
import { Variables } from '@/constants/vars';
import { parseNumber } from '@/utils/common';

export default {
  /**
   * 数据键
   */
  label: {
    type: String,
    required: true
  },

  /**
   * 表头显示的文字，如果没有，则显示label
   */
  name: String,

  // 列宽
  width: {
    type: [Number, String],
    validator: (v: number | string) => {
      const r = parseNumber(v) > Variables.size.minTableColumnWidth;
      if (!r) {
        console.error(
          Errors.header,
          Errors.invalidProps,
          `column width should be more than "${Variables.size.minTableColumnWidth}".`
        );
      }
      return r;
    }
  },

  /**
   * 居中显示
   */
  center: {
    type: Boolean,
    default: false
  },

  /**
   * 是否合并，一个函数，抛出当前数据，接收true / false，true为合并当前行，与前置列合并
   */
  merge: {
    type: [Function, Boolean],
    default: () => false
  },

  /**
   * 自定义格式化显示日期。如果列内需要显示日期时间，提供一个格式化字符串
   * * 只有提供了该字段才会生效。哪怕只给了key，会使用 yyyy-MM-dd 进行解析
   * * 注意，这里不能提供默认值，否则所有数据都会被作为日期解析
   */
  dateFormat: String,

  /**
   * 设置空数据显示内容。默认 "无数据 😢"
   */
  emptyData: {
    type: String,
    default: Variables.noData
  },

  /**
   * 是否可以选择文本
   */
  selectable: {
    type: Boolean,
    default: false
  },

  /**
   * 内容样式
   */
  columnStyle: {
    type: [Object, String],
    default: () => ({})
  },

  /**
   * 内容类名
   */
  columnClass: {
    type: [Object, String],
    default: () => ({})
  }
};
