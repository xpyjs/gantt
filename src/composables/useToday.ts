import { XDate } from '@/models/param/date';
import { computed } from 'vue';
import useData from './useData';
import useGanttHeader from './useGanttHeader';
import useGanttWidth from './useGanttWidth';

export default () => {
  const { ganttHeader } = useGanttHeader();
  const { $data } = useData();
  const { ganttColumnWidth, currentMillisecond } = useGanttWidth();

  const today = new XDate();
  today.startOf();

  const todayLeft = computed(() => {
    const start = $data.start?.clone();
    start?.startOf();
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

    return isInArea(today);
  });

  return {
    todayLeft,
    showToday
  };
};
