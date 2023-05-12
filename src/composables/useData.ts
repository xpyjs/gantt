import type rootProps from '@/components/root/rootProps';
import type RowItem from '@/models/data/row';
import { useStore } from '@/store';
import { computed, type ExtractPropTypes, toRaw, watch, type Ref } from 'vue';
import useGanttHeader from './useGanttHeader';

export default () => {
  const store = useStore();
  const { setGanttHeaders } = useGanttHeader();

  function initData(
    data: Ref<any[]>,
    props: ExtractPropTypes<typeof rootProps>
  ) {
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

    watch(
      () => props.showExpand,
      () => {
        store.$data.updateExpand(true);
        store.$links.update(store.$data.flatData);
      }
    );

    watch(
      () => props.expandAll,
      val => {
        store.$data.updateExpand(!props.showExpand || val);
        store.$links.update(store.$data.flatData);
      }
    );
  }

  function toRowData(data?: RowItem): RowData {
    return {
      row: toRaw(data?.data),
      $index: data?.flatIndex,
      level: data?.level
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
