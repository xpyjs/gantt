import { XDate } from '@/models/param/date';
import { isDate, isUndefined } from 'lodash';
import { type Ref, type DefineComponent } from 'vue';
import useData from './useData';
import useEvent from './useEvent';
import useGanttHeader from './useGanttHeader';
import useGanttWidth from './useGanttWidth';
import useParam from './useParam';
import useToday from './useToday';

export default (ganttRef: Ref<DefineComponent | null>) => {
  const { isInArea } = useToday();
  const { EmitNoDateError } = useEvent();
  const { ganttHeader } = useGanttHeader();
  const { ganttColumnWidth, currentMillisecond } = useGanttWidth();

  /**
   * 跳转到某个日期
   */
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

    date.startOf(ganttHeader.unit);
    const width =
      (date.intervalTo(ganttHeader.start) / currentMillisecond.value) *
      ganttColumnWidth.value;

    let left = 0;
    let right = 0;

    if (ganttRef.value.$el.scrollLeft < width) {
      // 日期在右侧
      right = width - ganttRef.value.$el.clientWidth / 3;
    } else {
      // 日期在左侧
      left = Math.abs(ganttRef.value.$el.clientWidth / 6 - width);
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
          ganttRef.value.$el.scrollLeft < left ||
          (right > 0 && ganttRef.value.$el.scrollLeft >= right) ||
          oldLeft === ganttRef.value.$el.scrollLeft
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
        oldLeft = ganttRef.value.$el.scrollLeft;
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        ganttRef.value.$el.scrollLeft += scrollX;
      }
      oldTimestamp = newTimestamp;
      window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
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
