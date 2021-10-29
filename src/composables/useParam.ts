import { reactive, Slots, toRefs, watch, ref, computed } from 'vue';
import { Variables } from '@/constants/vars';
import { ParamData } from '@/models/param/param';
import { parseNumber } from '@/utils/common';
import { getDateInterval, getDateOffset, getMillisecond } from '@/utils/date';
// eslint-disable-next-line import/no-cycle
import useData from './data/useData';

// 全局共享一个参数对象
const GtParam = reactive(new ParamData());
const oneDayWidth = computed(() => {
  const size = GtParam.ganttOptions.columnSize ?? 'normal';
  switch (size) {
    case 'small':
      if (GtParam.headerUnit === 'week') return 7;
      if (GtParam.headerUnit === 'month') return 4;
      return 15;
    case 'large':
      if (GtParam.headerUnit === 'week') return 30;
      if (GtParam.headerUnit === 'month') return 15;
      return 60;
    case 'normal':
    default:
      if (GtParam.headerUnit === 'week') return 15;
      if (GtParam.headerUnit === 'month') return 8;
      return 30;
  }
});

export default () => {
  return {
    GtParam,
    colSize: computed(() => GtParam.ganttOptions.columnSize ?? 'normal'),

    // 一天在 gantt 中的宽度
    oneDayWidth
  };
};

export function useInitParam(props: any, slots: Readonly<Slots>) {
  const {
    showCheckbox,
    showExpand,
    headerHeight,
    levelColor,
    dark,
    ganttColumnSize,
    showToday,
    showWeekend,
    headerStyle,
    bodyStyle,
    rowHeight
  } = toRefs(props);

  function saveParams(init = false) {
    GtParam.showCheckbox = showCheckbox.value;
    GtParam.showExpand = showExpand.value;
    GtParam.headerHeight = parseNumber(headerHeight.value);
    GtParam.levelColor = levelColor.value;
    GtParam.dark = dark.value;

    const opts = {
      [Variables.key.showToday]: showToday.value,
      [Variables.key.showWeekend]: showWeekend.value,
      [Variables.key.header]: headerStyle.value || {},
      [Variables.key.body]: bodyStyle.value || {}
    };

    if (init) {
      GtParam.rowHeight = parseNumber(rowHeight.value);
    } else {
      opts[Variables.key.columnSize] = GtParam.ganttOptions.columnSize;
    }

    GtParam.init({
      colSize: ganttColumnSize.value,
      rowHeight: rowHeight.value ?? Variables.size.defaultContentRowHeight
    });
    GtParam.setGanttOptions(opts);
  }

  // 处理 slot 组件
  if (slots?.default) GtParam.setNodes(slots.default());

  // 接收命名组件
  // eslint-disable-next-line no-restricted-syntax
  for (const name in Variables.slots) {
    if (slots?.[name]) GtParam.addSlot(name, slots?.[name]);
  }

  // 保存其他参数
  saveParams(true);

  // 监听以下参数发生变化时重新保存参数内容
  watch(
    () => [
      props.bodyStyle,
      props.borderColor,
      props.primaryColor,
      props.levelColor,
      props.showCheckbox,
      props.showExpand,
      props.headerHeight,
      props.rowHeight,
      props.ganttColumnSize,
      props.showToday,
      props.showWeekend,
      props.headerStyle,
      props.bodyStyle,
      props.dark
    ],
    () => {
      saveParams();
    }
  );

  watch(
    () => [GtParam.headerUnit],
    () => {
      saveParams(true);
    }
  );
}

const initGanttWidth = ref(0);
export function useSetGanttHeader() {
  const { GtData } = useData();

  function setHeaders() {
    const start = GtData.start as Date;
    const end = GtData.end as Date;

    let tmpEnd = end as Date | string | number;
    const d =
      getDateInterval(start, tmpEnd) / getMillisecond(GtParam.headerUnit);

    console.log(tmpEnd, d, initGanttWidth.value);

    if (d * oneDayWidth.value < initGanttWidth.value) {
      const offset =
        (initGanttWidth.value - d * oneDayWidth.value) / oneDayWidth.value;
      tmpEnd = getDateOffset(
        tmpEnd,
        offset * getMillisecond(GtParam.headerUnit)
      );
    }

    GtParam.setGanttHeaders(start, tmpEnd);
  }

  return {
    initGanttWidth,
    setHeaders
  };
}
