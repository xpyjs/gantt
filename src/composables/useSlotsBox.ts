import type RowItem from '@/models/data/row';
import { useStore } from '@/store';
import { type Slots, type Slot, isVNode, Comment } from 'vue';
import useData from './useData';

export default () => {
  const store = useStore();

  function setSlots(slots: Slots) {
    store.$slotsBox.setSlots(slots);
  }

  const { toRowData } = useData();

  function isMerge(
    m: boolean | undefined | ((data: RowData) => boolean),
    data: RowItem
  ) {
    return typeof m === 'function' ? m(toRowData(data)) : !!m;
  }

  function isValidSlots(slots?: Slot<any>, data?: RowItem) {
    if (!slots) return false;

    return (
      slots?.(toRowData(data))?.filter(
        item => !(isVNode(item) && item.type === Comment)
      ).length > 0
    );
  }

  return { $slotsBox: store.$slotsBox, setSlots, isMerge, isValidSlots };
};
