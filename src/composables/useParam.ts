/* eslint-disable indent */
import { Variables } from "@/constants/vars";
import { ParamData } from "@/models/param/param";
import { parseNumber } from "@/utils/common";
import { getDateInterval, getDateOffset, getMillisecond } from "@/utils/date";
import { reactive, Slots, toRefs, watch, ref, computed } from "vue";
import useData from "./useData";

// 全局共享一个参数对象
const GtParam = reactive(new ParamData());
const oneDayWidth = computed(() => {
  const size = GtParam.ganttOptions.columnSize ?? "normal";
  switch (size) {
    case "small":
      return GtParam.headerUnit === "week"
        ? 7
        : GtParam.headerUnit === "month"
        ? 4
        : 15;
    case "large":
      return GtParam.headerUnit === "week"
        ? 30
        : GtParam.headerUnit === "month"
        ? 15
        : 60;
    case "normal":
    default:
      return GtParam.headerUnit === "week"
        ? 15
        : GtParam.headerUnit === "month"
        ? 8
        : 30;
  }
});

export default function () {
  return {
    GtParam,
    // colWidth: computed(() => GtParam.ganttOptions.columnWidth as number)
    colSize: computed(() => GtParam.ganttOptions.columnSize ?? "normal"),

    // 一天在 gantt 中的宽度
    oneDayWidth
  };
}

export function useInitParam(props: any, slots: Readonly<Slots>) {
  const {
    showCheckbox,
    showExpand,
    headerHeight,
    levelColor,
    dark,
    // ganttColumnWidth,
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

    // const columnWidth = ref<number>(
    //   GtParam.headerUnit === "day"
    //     ? ganttColumnWidth.value ?? Variables.size.minGanttColumnWidth
    //     : 100
    // );

    const opts = {
      // [Variables.key.columnWidth]: columnWidth.value,
      [Variables.key.showToday]: showToday.value,
      [Variables.key.showWeekend]: showWeekend.value,
      [Variables.key.header]: headerStyle.value || {},
      [Variables.key.body]: bodyStyle.value || {}
    };

    if (init) {
      GtParam.rowHeight = parseNumber(rowHeight.value);
    } else {
      // opts[Variables.key.columnWidth] = GtParam.ganttOptions.columnWidth;
      opts[Variables.key.columnSize] = GtParam.ganttOptions.columnSize;
    }

    GtParam.init({
      // colWidth: columnWidth.value,
      colSize: ganttColumnSize.value,
      rowHeight: rowHeight.value ?? Variables.size.defaultContentRowHeight
    });
    GtParam.setGanttOptions(opts);

    console.log(GtParam);
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
      // props.ganttColumnWidth,
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
    const start = GtData.start as Date,
      end = GtData.end as Date;

    let _end = end as Date | string | number;
    const d = getDateInterval(start, _end) / getMillisecond(GtParam.headerUnit);

    if (
      // d * parseNumber(GtParam.ganttOptions.columnWidth) <
      // initGanttWidth.value
      d * oneDayWidth.value <
      initGanttWidth.value
    ) {
      // const offset =
      //   (initGanttWidth.value -
      //     d * parseNumber(GtParam.ganttOptions.columnWidth)) /
      //   parseNumber(GtParam.ganttOptions.columnWidth);

      const offset =
        (initGanttWidth.value - d * oneDayWidth.value) / oneDayWidth.value;
      _end = getDateOffset(_end, offset * getMillisecond(GtParam.headerUnit));
    }

    GtParam.setGanttHeaders(start, _end);
  }

  return {
    initGanttWidth,
    setHeaders
  };
}
