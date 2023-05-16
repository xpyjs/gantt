// import type RowItem from '@/models/data/row';
import useStore from '@/store';
// import { computed, ref } from 'vue';

// const _hoverItem = ref<RowItem | null>(null);

export default () => {
  const store = useStore();

  // const hoverItem = computed<RowItem>(() => _hoverItem.value as RowItem);
  // const setHover = (item: RowItem | null) => {
  //   console.log('setHover', item);

  //   _hoverItem.value = item;
  // };

  return {
    $param: store.$param

    // hoverItem,
    // setHover
  };
};
