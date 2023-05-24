import type rootProps from '@/components/root/rootProps';
import Variables from '@/constants/vars';
import type RowItem from '@/models/data/row';
import { useStore } from '@/store';
import { isString } from 'lodash';
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
      level: data && data.level + 1
    };
  }

  function flattenData() {
    store.$data.updateFlatData();
    store.$links.update(store.$data.flatData);
  }

  function getProp(data: RowItem, prop?: string, empty?: string) {
    if (isString(prop)) {
      if (prop in data.data) return data.data[prop];
      if (prop.includes('.')) {
        const [l, ...rest] = prop.split('.');
        if (l in data.data)
          return rest.reduce((acc, v) => acc[v], data.data[l]);
      }
    }

    return empty ?? Variables.noData;
  }

  return {
    $data: store.$data,
    initData,
    dateList: computed(() => store.ganttHeader.headers),
    toRowData,
    flattenData,
    getProp
  };
};
