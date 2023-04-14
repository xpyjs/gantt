import { useStore } from '@/store';
import { type Slots } from 'vue';
import useTableWidth from './useTableWidth';

export default () => {
  const store = useStore();

  const { setTableWidth } = useTableWidth();

  function setSlots(slots: Slots) {
    store.$slotsBox.setSlots(slots);

    // 设置宽度
    setTableWidth(store.$slotsBox.cols);
  }

  return { $slotsBox: store.$slotsBox, setSlots };
};
