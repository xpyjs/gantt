import { XDate } from '@/models/param/date';
import { isDate, isUndefined } from 'lodash';
import useData from './useData';
import useEvent from './useEvent';
import useGanttHeader from './useGanttHeader';
import useGanttWidth from './useGanttWidth';
import useParam from './useParam';
import useToday from './useToday';
import { baseUnit } from '@/utils/date';
import Variables from '@/constants/vars';
import useElement from './useElement';

export default () => {
  const { isInArea } = useToday();
  const { EmitNoDateError } = useEvent();
  const { ganttHeader } = useGanttHeader();
  const { ganttColumnWidth, currentMillisecond } = useGanttWidth();
  const { ganttRef } = useElement();

  /**
   * 跳转到某个日期
   */
  // function jumpToDate(_date: Date | undefined) {
  //   if (!ganttRef.value) return;

  //   let date: XDate;

  //   // 未定义日期，默认跳转到今天
  //   if (isUndefined(_date) || !isDate(_date)) {
  //     date = new XDate();
  //   } else {
  //     date = new XDate(_date);
  //   }

  //   if (!isInArea(date)) {
  //     EmitNoDateError(date.date);
  //     return;
  //   }

  //   date.startOf(ganttHeader.unit);
  //   const width =
  //     (date.intervalTo(ganttHeader.start) / currentMillisecond.value) *
  //     ganttColumnWidth.value;

  //   let left = 0;
  //   let right = 0;

  //   if (ganttRef.value.$el.scrollLeft < width) {
  //     // 日期在右侧
  //     right = width - ganttRef.value.$el.clientWidth / 3;
  //   } else {
  //     // 日期在左侧
  //     left = Math.abs(ganttRef.value.$el.clientWidth / 6 - width);
  //   }

  //   // 滚动动画，ease-in模式
  //   if (left && right) return;

  //   const duration = 1000;
  //   const distance = left || right;
  //   let oldTimestamp: number | null = null;
  //   let scrollX = 0;
  //   let oldLeft: number | undefined; // 初始不定义，保证第一次不会匹配

  //   function step(newTimestamp: number) {
  //     if (oldTimestamp !== null && ganttRef.value) {
  //       // if duration is 0 scrollX will be -Infinity
  //       if (
  //         ganttRef.value.$el.scrollLeft < left ||
  //         (right > 0 && ganttRef.value.$el.scrollLeft >= right) ||
  //         oldLeft === ganttRef.value.$el.scrollLeft
  //       )
  //         return;

  //       const x = (distance * (newTimestamp - oldTimestamp)) / duration;
  //       if (left) {
  //         scrollX -= x;
  //       } else if (right) {
  //         scrollX += x;
  //       } else {
  //         return;
  //       }
  //       oldLeft = ganttRef.value.$el.scrollLeft;
  //       // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  //       ganttRef.value.$el.scrollLeft += scrollX;
  //     }
  //     oldTimestamp = newTimestamp;
  //     window.requestAnimationFrame(step);
  //   }
  //   window.requestAnimationFrame(step);
  // }

  function easeInOutQuad(t: number, b: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  function jumpToDate(_date: Date | undefined) {
    if (!ganttRef.value) return;

    let date: XDate;

    // 未定义日期，默认跳转到今天
    if (isUndefined(_date) || !isDate(_date)) {
      date = new XDate();
    } else {
      date = new XDate(_date);
    }

    if (!isInArea(date)) {
      EmitNoDateError(date.date);
      return;
    }

    date = date.getOffset(-Variables.time.millisecondOf.day * 5);
    date.startOf(baseUnit(ganttHeader.unit));

    const width =
      (date.intervalTo(ganttHeader.start) / currentMillisecond.value) *
      ganttColumnWidth.value;

    const top = ganttRef.value.$el.scrollTop ?? 0;

    function animateScrollTo(width: number) {
      const duration = 300; // in milliseconds
      const start = ganttRef.value?.$el.scrollLeft ?? 0;
      const change = width - start;
      const increment = 20;
      let currentTime = 0;

      function animateScroll() {
        currentTime += increment;
        const val = easeInOutQuad(currentTime, start, change, duration);
        ganttRef.value?.$el.scrollTo(val, top);
        if (currentTime < duration) {
          setTimeout(animateScroll, increment);
        }
      }

      animateScroll();
    }

    animateScrollTo(width);
  }

  const { $data } = useData();
  const { $param } = useParam();
  function setSelected(data: any) {
    const find = $data.flatData.find(d => d.isSame(data));
    if (!find) return null;

    $param.selectItem = find;
  }

  return {
    setSelected,
    jumpToDate
  };
};
