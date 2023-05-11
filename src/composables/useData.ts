import type RowItem from '@/models/data/row';
import { useStore } from '@/store';
import { computed, watch, type Ref } from 'vue';
import useGanttHeader from './useGanttHeader';

export default () => {
  const store = useStore();
  const { setGanttHeaders } = useGanttHeader();

  // TODO 这里还需要加 options 的监听
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

  function toRowData(data?: RowItem) {
    return {
      row: data?.data,
      $index: data?.flatIndex
    };
  }

  function flattenData() {
    store.$data.updateFlatData();
    store.$links.update(store.$data.flatData);
  }

  return {
    $data: store.$data,
    initData,
    dateList: computed(() => store.ganttHeader.headers),
    toRowData,
    flattenData
  };
};
