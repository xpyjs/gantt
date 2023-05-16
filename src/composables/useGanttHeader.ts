import { useStore } from '@/store';
import { watch } from 'vue';
import useGanttWidth from './useGanttWidth';
import useTableWidth from './useTableWidth';

export default () => {
  const store = useStore();
  const { ganttColumnWidth } = useGanttWidth();
  const { tableWidth } = useTableWidth();

  // 设置甘特日期头
  function setGanttHeaders() {
    store.ganttHeader.setDate(
      // 使用 window 的宽度减去 table 的宽度，就是最小需要的列数，再加一个阈值即可
      (window.innerWidth - tableWidth.value) / ganttColumnWidth.value + 5,
      store.$data.start,
      store.$data.end,
      store.$styleBox.unit
    );
  }

  watch(() => store.$styleBox.unit, setGanttHeaders);

  return {
    setGanttHeaders,
    ganttHeader: store.ganttHeader
  };
};
