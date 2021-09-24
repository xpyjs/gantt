import { Variables } from "@/constants/vars";
import { parseNumber } from "@/utils/common";
import { createDate, formatDate, getDateInterval } from "@/utils/date";
import { isDate, isUndefined } from "@/utils/is";
import { computed } from "vue";
import useData from "./useData";
import { useRootEmit } from "./useEvent";
import useGanttRef from "./useGanttRef";
import useParam from "./useParam";
import useResize from "./useResize";
import { useDark } from "./useStyle";

function _getDateInterval(start: Date, date: Date | number) {
  const sd = new Date(formatDate(start)).setHours(0);
  return getDateInterval(sd, date) / Variables.time.millisecondOfDay;
}

export function useCheckDate() {
  const { GtParam } = useParam();

  function isInArea(date: Date) {
    if (GtParam.ganttHeaders.length === 0) return false;

    const sd = GtParam.startDate.setHours(0);
    const ed = GtParam.endDate.setHours(24);

    return !(date.getTime() < sd || date.getTime() > ed);
  }
  return { isInArea };
}

export function useToday() {
  const { GtParam, colWidth } = useParam();
  const { GtData } = useData();
  const { isInArea } = useCheckDate();
  const { colorSelectStr } = useDark();

  const isTodayInArea = computed(() => {
    return isInArea(createDate());
  });

  const showTodayLine = computed(
    () => isTodayInArea.value && GtParam.ganttOptions.showToday
  );

  const todayLeft = computed(() => {
    const today = new Date().setHours(0);
    return parseNumber(
      _getDateInterval(GtData.start as Date, today) * colWidth.value
    );
  });

  const todayLineStyle = computed(() => {
    return {
      left: `${todayLeft.value}px`,
      width: `${colWidth.value}px`,
      height: "100%",
      "background-color":
        GtParam.ganttOptions.body?.todayColor ||
        Variables.color.today[colorSelectStr.value]
    };
  });

  const arrowWidth = computed(() => {
    return colWidth.value > 50 ? 50 : colWidth.value;
  });

  const todayArrowStyle = computed(() => {
    return {
      left: `${todayLeft.value + (colWidth.value - arrowWidth.value) / 2}px`,
      "border-width": `${arrowWidth.value / 2}px`,
      "border-top-color": GtParam.ganttOptions.body?.todayColor
    };
  });

  return {
    isTodayInArea,
    showTodayLine,
    todayLineStyle,
    todayLeft,
    todayArrowStyle
  };
}

export function useWeekend() {
  const { GtData } = useData();
  const { GtParam, colWidth } = useParam();
  const { ganttWidth } = useResize();
  const { colorSelectStr } = useDark();

  const weekendList = computed(() => {
    const r: Array<number> = [];
    if (!GtParam.ganttOptions.showWeekend) return r;

    const sd = createDate(GtData.start);
    let d = sd.getDay();
    let i = 0;

    // start is Sunday
    if (d === 0) {
      r.push(d);
      d += 6;
      i += 6;
    }

    // start is work day
    while (d > 0 && d < 6) {
      d++;
      i++;
    }

    // Cycle to find Saturday and Sunday
    while (i * colWidth.value < ganttWidth.value) {
      r.push(i);
      r.push(++i);
      ++d;
      d += 6;
      i += 6;
    }

    return r;
  });

  const weekendStyle = computed(() => {
    return function (item: number) {
      return {
        left: `${item * colWidth.value}px`,
        width: `${colWidth.value}px`,
        height: "100%",
        "background-color":
          GtParam.ganttOptions.body?.weekendColor ||
          Variables.color.weekend[colorSelectStr.value]
      };
    };
  });

  return {
    weekendList,
    weekendStyle
  };
}

export function useJumpDate() {
  const { GtData } = useData();
  const { colWidth } = useParam();
  const { isInArea } = useCheckDate();
  const { INoDateError } = useRootEmit();
  const { ganttRef } = useGanttRef();

  /**
   * 跳转到某个日期
   */
  function handleJumpTo(date: Date | undefined) {
    if (!ganttRef.value) return;

    // 未定义日期，默认跳转到今天
    if (isUndefined(date) || !isDate(date)) {
      date = new Date();
    }

    if (!isInArea(date)) {
      INoDateError(date);
      return;
    }

    date.setHours(0);
    const width = parseNumber(
      _getDateInterval(GtData.start as Date, date) * colWidth.value
    );

    let left = 0,
      right = 0;

    if (ganttRef.value.scrollLeft < width) {
      // 日期在右侧
      right = width - ganttRef.value.clientWidth / 3;
    } else {
      // 日期在左侧
      left = Math.abs(ganttRef.value.clientWidth / 6 - width);
    }

    // 滚动动画，ease-in模式
    if (left && right) return;

    const duration = 1000;
    const distance = left || right;
    let oldTimestamp: number | null = null;
    let scrollX = 0;
    let oldLeft: number | undefined; // 初始不定义，保证第一次不会匹配

    function step(newTimestamp: number) {
      if (oldTimestamp !== null && ganttRef.value) {
        // if duration is 0 scrollX will be -Infinity
        if (
          ganttRef.value.scrollLeft < left ||
          (right > 0 && ganttRef.value.scrollLeft >= right) ||
          oldLeft === ganttRef.value.scrollLeft
        )
          return;

        const x = (distance * (newTimestamp - oldTimestamp)) / duration;
        if (left) {
          scrollX -= x;
        } else if (right) {
          scrollX += x;
        } else {
          return;
        }
        oldLeft = ganttRef.value.scrollLeft;
        ganttRef.value.scrollLeft += scrollX;
      }
      oldTimestamp = newTimestamp;
      window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  return { handleJumpTo, ganttRef };
}
