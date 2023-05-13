import { XDate } from '@/models/param/date';
import { computed } from 'vue';
import useGanttHeader from './useGanttHeader';
import useGanttWidth from './useGanttWidth';
import useStyle from './useStyle';

export default () => {
  const { ganttHeader } = useGanttHeader();
  const { ganttColumnWidth, currentMillisecond } = useGanttWidth();
  const { $styleBox } = useStyle();

  const today = new XDate();
  today.startOf(ganttHeader.unit);

  const todayLeft = computed(() => {
    const start = ganttHeader.start?.clone();
    start?.startOf(ganttHeader.unit);
    return (
      (today.intervalTo(start) / currentMillisecond.value) *
      ganttColumnWidth.value
    );
  });

  const showToday = computed(() => {
    function isInArea(date: XDate) {
      if (ganttHeader.dates.length === 0) return false;

      const sd = ganttHeader.start;
      const ed = ganttHeader.end;

      return sd?.compareTo(date) === 'l' && ed?.compareTo(date) === 'r';
    }

    return $styleBox.showToday && isInArea(today);
  });

  return {
    todayLeft,
    showToday
  };
};
