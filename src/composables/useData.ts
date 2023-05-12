import type RowItem from '@/models/data/row';
import { useStore } from '@/store';
import { computed, toRaw, watch, type Ref } from 'vue';
import useGanttHeader from './useGanttHeader';

export default () => {
  const store = useStore();
  const { setGanttHeaders } = useGanttHeader();

  function initData(data: Ref<any[]>, props: any) {
    const options: DataOptions = {
      dataId: props.dataId,
      isExpand: !props.showExpand || props.expandAll,
      startLabel: props.startKey,
      endLabel: props.endKey
    };

    store.$data.init(data.value, options);

    setGanttHeaders();

    watch(
      () => data,
      val => {
        // 更新数据
        store.$data.update(val.value, options);

        setGanttHeaders();
      },
      { deep: true }
    );
  }

  function toRowData(data?: RowItem): RowData {
    return {
      row: toRaw(data?.data),
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
