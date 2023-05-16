import Variables from '@/constants/vars';
import { useStore } from '@/store';
import { computed } from 'vue';

export default () => {
  const store = useStore();

  const ganttColumnWidth = computed(() => {
    const size = store.$styleBox.ganttColumnSize;
    return Variables.size.ganttColumnWidth[size][store.ganttHeader.unit];
  });

  const ganttWidth = computed(() => {
    return store.ganttHeader.headers[1].length * ganttColumnWidth.value;
  });

  const currentMillisecond = computed(
    () => Variables.time.millisecondOf[store.ganttHeader.unit]
  );

  return { ganttWidth, ganttColumnWidth, currentMillisecond };
};
