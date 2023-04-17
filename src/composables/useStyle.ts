import type rootProps from '@/components/root/rootProps';
import { useStore } from '@/store';
import { type ExtractPropTypes, ref } from 'vue';

export default () => {
  const store = useStore();

  const bodyHeight = ref(`${20 * store.$data.length}px`);

  const setStyles = (props: ExtractPropTypes<typeof rootProps>) => {
    store.$styleBox.setBorder(props.border);
    store.$styleBox.setBorderColor(props.borderColor);

    store.$styleBox.ganttColumnSize = props.ganttColumnSize;
    store.$styleBox.unit = props.unit;
  };

  return { bodyHeight, setStyles, $styleBox: store.$styleBox };
};
