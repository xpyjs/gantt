import type RowItem from '@/models/data/row';
import { useStore } from '@/store';
import { type Slots } from 'vue';
import useData from './useData';
import useTableWidth from './useTableWidth';

export default () => {
  const store = useStore();

  const { setTableWidth } = useTableWidth();

  function setSlots(slots: Slots) {
    store.$slotsBox.setSlots(slots);

    // 设置宽度
    setTableWidth(store.$slotsBox.cols);
  }

  const { toRowData } = useData();

  function isMerge(
    m: boolean | undefined | ((data: any) => boolean),
    data: RowItem
  ) {
    return typeof m === 'function' ? m(toRowData(data)) : !!m;
  }

  return { $slotsBox: store.$slotsBox, setSlots, isMerge };
};
