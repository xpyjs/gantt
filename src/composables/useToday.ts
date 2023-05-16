import { XDate } from '@/models/param/date';
import { computed } from 'vue';
import useGanttHeader from './useGanttHeader';
import useGanttWidth from './useGanttWidth';
import useStyle from './useStyle';

export default () => {
  const { ganttHeader } = useGanttHeader();
  const { ganttColumnWidth, currentMillisecond } = useGanttWidth();
  const { $styleBox } = useStyle();

  const generateToday = computed(() => {
    const today = new XDate();
    today.startOf(ganttHeader.unit);
    return today;
  });

  const todayLeft = computed(() => {
    const start = ganttHeader.start?.clone();
    start?.startOf(ganttHeader.unit);

    return (
      (generateToday.value.intervalTo(start) / currentMillisecond.value) *
      ganttColumnWidth.value
    );
  });

  function isInArea(date: XDate) {
    if (ganttHeader.dates.length === 0) return false;

    const sd = ganttHeader.dates[0];
    const ed = ganttHeader.dates[ganttHeader.dates.length - 1];

    return sd?.compareTo(date) === 'l' && ed?.compareTo(date) === 'r';
  }

  const showToday = computed(() => {
    return $styleBox.showToday && isInArea(generateToday.value);
  });

  return {
    todayLeft,
    showToday
  };
};
