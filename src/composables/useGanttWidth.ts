import { useStore } from '@/store';
import { computed } from 'vue';

export default () => {
  const store = useStore();

  const ganttWidth = computed(() => {
    return store.ganttHeader.headers[1].length * 30;
  });

  return { ganttWidth };
};
