import { Slots, toRefs, watch, computed } from 'vue';
import { Variables } from '@/constants/vars';
import { parseNumber } from '@/utils/common';
import { getDateInterval, getDateOffset, getMillisecond } from '@/utils/date';
// eslint-disable-next-line import/no-cycle
import useData from './data/useData';
import { HeaderDateUnit } from '@/typings/ParamOptions';
import { Errors } from '@/constants/errors';
import { useStore } from '@/store';

const useParamObject = () => {
  const store = useStore();
  const { GtParam } = store;

  return {
    GtParam,
    oneDayWidth: computed(() => {
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
    })
  };
};

export default () => {
  const { GtParam, oneDayWidth } = useParamObject();
  return {
    GtParam,
    colSize: computed(() => GtParam.ganttOptions.columnSize ?? 'normal'),

    // 一天在 gantt 中的宽度
    oneDayWidth
  };
};

export function useSetGanttHeader() {
  const { GtParam, oneDayWidth } = useParamObject();
  const { GtData } = useData();

  const store = useStore();

  function setHeaders() {
    const start = GtData.start as Date;
    const end = GtData.end as Date;

    let tmpEnd = end as Date | string | number;
    const d =
      getDateInterval(start, tmpEnd) / getMillisecond(GtParam.headerUnit);

    if (d * oneDayWidth.value < store.initGanttWidth.value) {
      const offset =
        (store.initGanttWidth.value - d * oneDayWidth.value) /
        oneDayWidth.value;
      tmpEnd = getDateOffset(
        tmpEnd,
        offset * getMillisecond(GtParam.headerUnit)
      );
    }

    GtParam.setGanttHeaders(start, tmpEnd);
  }

  return {
    initGanttWidth: store.initGanttWidth,
    setHeaders
  };
}

export function useInitParam(props: any, slots: Readonly<Slots>) {
  const { setHeaders } = useSetGanttHeader();
  const { GtParam } = useParamObject();
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
      [Variables.key.body]: bodyStyle.value || {},
      [Variables.key.columnSize]: ganttColumnSize.value
    };

    if (init) {
      GtParam.rowHeight = parseNumber(rowHeight.value);

      GtParam.init({
        colSize: ganttColumnSize.value,
        rowHeight: rowHeight.value ?? Variables.size.defaultContentRowHeight
      });
    }

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

  watch(
    () => [GtParam.headerUnit, GtParam.ganttOptions.columnSize],
    () => {
      setHeaders();
    }
  );
}

export function useExportParamFunc() {
  const { GtParam } = useParamObject();

  function updateGanttHeaderUnit(unit: HeaderDateUnit) {
    if (['day', 'week', 'month'].includes(unit)) {
      GtParam.headerUnit = unit;
    } else {
      console.warn(
        Errors.header,
        Errors.invalidProps,
        `input value '${unit}' is not a valid header unit. It should be 'day', 'week' or 'month'.`
      );

      GtParam.headerUnit = 'day';
    }
  }

  return { updateGanttHeaderUnit };
}
