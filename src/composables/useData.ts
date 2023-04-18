import type RowItem from '@/models/data/row';
import { useStore } from '@/store';
import { computed, watch, type Ref } from 'vue';
import useGanttHeader from './useGanttHeader';

export default () => {
  const store = useStore();
  const { setGanttHeaders } = useGanttHeader();

  function initData(data: Ref<any[]>) {
    store.$data.init(data.value);

    setGanttHeaders();

    watch(
      () => data,
      val => {
        // 更新数据
        store.$data.update(val.value);

        setGanttHeaders();
      },
      { deep: true }
    );
  }

  function toRowData(data: RowItem) {
    return {
      row: data.data,
      $index: data.flatIndex
    };
  }

  return {
    $data: store.$data,
    initData,
    dateList: computed(() => store.ganttHeader.headers),
    toRowData
  };
};
