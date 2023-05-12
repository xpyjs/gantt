import Variables from '@/constants/vars';
import { useStore } from '@/store';
import { computed } from 'vue';

export default () => {
  const store = useStore();

  const ganttColumnWidth = computed(() => {
    const size = store.$styleBox.ganttColumnSize;
    switch (size) {
      case 'small':
        if (store.$styleBox.unit === 'week') return 7;
        return 20;
      case 'large':
        if (store.$styleBox.unit === 'week') return 30;
        return 60;
      case 'normal':
      default:
        if (store.$styleBox.unit === 'week') return 15;
        return 30;
    }
  });

  const ganttWidth = computed(() => {
    return store.ganttHeader.headers[1].length * ganttColumnWidth.value;
  });

  const currentMillisecond = computed(
    () => Variables.time.millisecondOf[store.ganttHeader.unit]
  );

  return { ganttWidth, ganttColumnWidth, currentMillisecond };
};
