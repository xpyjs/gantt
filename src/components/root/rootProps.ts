import { type PropType, type Slots } from 'vue';
import { Errors } from '@/constants/errors';
import { Variables } from '@/constants/vars';
import { parseNumber } from '@/utils/common';

export default {
  // 内部使用
  slots: { type: Object as PropType<Slots>, default: () => ({}) },

  /**
   * 数据列表
   */
  data: {
    type: Array as PropType<any[]>,
    default: () => []
  },

  links: {
    type: Array as PropType<any[]>,
    default: () => []
  },

  /**
   * 数据索引的label，默认 id。应当确保它是唯一的，如果不是，则会引起渲染错误。
   */
  dataId: {
    type: String,
    default: Variables.default.idKey
  },

  /**
   * 数据中起始日期的label，默认值：startDate，如果找不到，则不会渲染甘特条
   */
  startKey: {
    type: String,
    default: Variables.default.startKey
  },

  /**
   * 数据中截止日期的label，默认值：endDate。如果找不到，同时没有起始日期，则不会渲染甘特条
   */
  endKey: {
    type: String,
    default: Variables.default.endKey
  },

  /**
   * 接收一个表头高度，默认值为80。如果高度过小，且表头过于复杂，可能会引起高度异常
   */
  headerHeight: {
    type: [Number, String],
    default: Variables.default.headerHeight,
    validator: (v: number | string) => {
      const r = parseNumber(v) >= Variables.size.minHeaderHeight;
      if (!r) {
        throw Errors.propsError(
          `"headerHeight" should be at least ${Variables.size.minHeaderHeight}.`
        );
      }
      return r;
    }
  },

  /**
   * 接收一个内容的行高，应该保证大于20，默认行高30（含1px的border）
   */
  rowHeight: {
    type: [Number, String],
    default: Variables.default.rowHeight,
    validator: (v: number | string) => {
      const minR = parseNumber(v) >= Variables.size.minContentRowHeight;
      if (!minR) {
        throw Errors.propsError(
          `"rowHeight" should be at least ${Variables.size.minContentRowHeight}.`
        );
      }

      const maxR = parseNumber(v) <= Variables.size.maxContentRowHeight;
      if (!maxR) {
        throw Errors.propsError(
          `"rowHeight" should be no more than ${Variables.size.maxContentRowHeight}.`
        );
      }
      return minR && maxR;
    }
  },

  /**
   * 边框尺寸，0 为不显示。默认为 1
   */
  border: {
    type: Number,
    default: 1,
    validator: (v: number) => {
      const r = parseNumber(v) >= 0;
      if (!r) {
        throw Errors.propsError(`"border" should be a nonnegative integer.`);
      }
      return r;
    }
  },

  /**
   * border 颜色
   */
  borderColor: {
    type: String
  },

  /**
   * 是否显示复选框，默认为隐藏
   */
  showCheckbox: {
    type: Boolean
  },

  /**
   * 是否显示展开按钮，如果为否，则全部展开。默认为是
   */
  showExpand: {
    type: Boolean,
    default: true
  },

  /**
   * 展开所有数据，默认展开。仅当传入了 `showExpand` 才生效
   */
  expandAll: {
    type: Boolean,
    default: true
  },

  /**
   * 甘特图表的每一列宽度
   */
  ganttColumnSize: {
    type: [String, Object] as PropType<GanttColumnSize>,
    default: 'normal',
    validator: (v: GanttColumnSize) => {
      return typeof v === 'object' || ['small', 'normal', 'large'].includes(v);
    }
  },

  /**
   * 显示甘特图的今日线
   */
  showToday: {
    type: Boolean,
    default: true
  },

  /**
   * 显示甘特图的周末背景
   */
  showWeekend: {
    type: Boolean,
    default: true
  },

  /**
   * 定义层级颜色，循环显示
   */
  levelColor: {
    type: Array as PropType<string[]>,
    default: () => {
      return [];
    }
  },

  /**
   * 头部样式，一个对象
   */
  headerStyle: {
    type: Object as PropType<HeaderOptions>,
    default: () => {
      return {};
    }
  },

  /**
   * 内容样式，一个对象
   */
  bodyStyle: {
    type: Object as PropType<BodyOptions>,
    default: () => {
      return {};
    }
  },

  /**
   * 暗黑模式
   */
  dark: {
    type: Boolean,
    default: false
  },

  /**
   * 主色。它会显示在表头以及按钮上
   */
  primaryColor: {
    type: String,
    default: '#eca710'
  },

  /**
   * 日期单位
   */
  unit: {
    type: String as PropType<HeaderDateUnit>,
    default: 'day',
    validator: (v: HeaderDateUnit) => {
      return ['month', 'week', 'day', 'hour'].includes(v);
    }
  },

  /**
   * 允许鼠标悬停高亮表头对应日期
   */
  highlightDate: {
    type: Boolean,
    default: false
  },

  /**
   * 允许点击行时，将甘特进度条滚动到可视区域
   */
  sliderIntoView: {
    type: Boolean,
    default: false
  },

  /**
   * 允许拖拽
   */
  draggable: {
    type: [Object, Boolean] as PropType<boolean | Partial<DraggableOptions>>,
    default: false
  },

  /**
   * 国际化
   */
  locale: {
    type: String,
    default: 'en'
  },

  /**
   * 自定义节日
   */
  holidays: {
    type: Array as PropType<
      Array<{ date: LikeDate | LikeDate[]; color?: string }>
    >,
    default: () => []
  },

  /**
   * 自定义日期头格式化
   */
  formatGanttHeader: {
    type: String
  }
};
