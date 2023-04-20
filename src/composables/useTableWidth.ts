import { useStore } from '@/store';
import { computed } from 'vue';

export default () => {
  const store = useStore();

  const tableWidth = computed(() => {
    return store.$slotsBox.cols.reduce(
      (p, c) => p + store.$slotsBox.tableHeaders.leafs[c.props!.__index].width,
      0
    );
  });

  return { tableWidth };
};
