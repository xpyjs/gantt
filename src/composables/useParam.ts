import { Variables } from "@/constants/vars";
import { ParamData } from "@/models/param/param";
import { parseNumber } from "@/utils/common";
import { getDateInterval, getDateOffset } from "@/utils/date";
import { reactive, Slots, toRefs, watch, ref, computed } from "vue";
import useData from "./useData";

// 全局共享一个参数对象
const GtParam = reactive(new ParamData());
export default function () {
  return {
    GtParam,
    colWidth: computed(() => GtParam.ganttOptions.columnWidth as number)
  };
}

export function useInitParam(props: any, slots: Readonly<Slots>) {
  const {
    showCheckbox,
    showExpand,
    headerHeight,
    levelColor,
    dark,
    ganttColumnWidth,
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
      [Variables.key.columnWidth]: ganttColumnWidth.value,
      [Variables.key.showToday]: showToday.value,
      [Variables.key.showWeekend]: showWeekend.value,
      [Variables.key.header]: headerStyle.value || {},
      [Variables.key.body]: bodyStyle.value || {}
    };

    if (init) {
      GtParam.rowHeight = parseNumber(rowHeight.value);
    } else {
      opts[Variables.key.columnWidth] = GtParam.ganttOptions.columnWidth;
    }

    GtParam.init({
      colWidth: ganttColumnWidth.value ?? Variables.size.minGanttColumnWidth,
      rowHeight: rowHeight.value ?? Variables.size.defaultContentRowHeight
    });
    GtParam.setGanttOptions(opts);
  }

  // 处理 slot 组件
  slots?.default && GtParam.setNodes(slots.default());

  // 接收命名组件
  for (const name in Variables.slots) {
    slots?.[name] && GtParam.addSlot(name, slots?.[name]);
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
      props.ganttColumnWidth,
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
}

const initGanttWidth = ref(0);
export function useSetGanttHeader() {
  const { GtData } = useData();

  function setHeaders() {
    const start = GtData.start as Date,
      end = GtData.end as Date;

    let _end = end as Date | string | number;
    const d = getDateInterval(start, _end) / Variables.time.millisecondOfDay;

    if (
      d * parseNumber(GtParam.ganttOptions.columnWidth) <
      initGanttWidth.value
    ) {
      const offset =
        (initGanttWidth.value -
          d * parseNumber(GtParam.ganttOptions.columnWidth)) /
        parseNumber(GtParam.ganttOptions.columnWidth);
      _end = getDateOffset(_end, offset * Variables.time.millisecondOfDay);
    }

    GtParam.setGanttHeaders(start, _end);
  }

  return {
    initGanttWidth,
    setHeaders
  };
}
