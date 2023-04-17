import type rootProps from '@/components/root/rootProps';
import { useStore } from '@/store';
import { type ExtractPropTypes, ref, computed } from 'vue';

export default () => {
  const store = useStore();

  const rowHeight = computed(() => store.$styleBox.rowHeight);

  const bodyHeight = ref(`${rowHeight.value * store.$data.length}px`);

  const setStyles = (props: ExtractPropTypes<typeof rootProps>) => {
    store.$styleBox.setBorder(props.border);
    store.$styleBox.setBorderColor(props.borderColor);

    store.$styleBox.ganttColumnSize = props.ganttColumnSize;
    store.$styleBox.unit = props.unit;
    store.$styleBox.rowHeight = props.rowHeight;
  };

  return { rowHeight, bodyHeight, setStyles, $styleBox: store.$styleBox };
};
