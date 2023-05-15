import type RowItem from '@/models/data/row';
import { useStore } from '@/store';
import { type LinkingItem } from '@/typings/link';
import { isBoolean } from 'lodash';
import { reactive, watch, type Ref } from 'vue';

const linking = reactive({
  startPos: { x: 0, y: 0 },
  endPos: { x: 0, y: 0 },
  isLinking: false,
  startRow: null as RowItem | null,
  endRow: null as RowItem | null
}) as LinkingItem;

export default () => {
  const store = useStore();

  function initLinks(links: Ref<any[]>) {
    store.$links.init(store.$data.flatData, links.value);

    watch(
      () => [links, store.$data.flatData],
      () => {
        // 更新数据
        store.$links.init(store.$data.flatData, links.value);
      },
      { deep: true }
    );
  }

  function setLinking(params: {
    isLinking?: boolean;
    startPos?: { x: number; y: number };
    endPos?: { x: number; y: number };
    startRow?: RowItem | null;
    endRow?: RowItem | null;
  }) {
    if (isBoolean(params.isLinking)) linking.isLinking = params.isLinking;
    if (params.startPos) linking.startPos = params.startPos;
    if (params.endPos) linking.endPos = params.endPos;
    if (params.startRow !== undefined) linking.startRow = params.startRow;
    if (params.endRow !== undefined) linking.endRow = params.endRow;
  }

  return {
    $links: store.$links,
    initLinks,
    linking,
    setLinking
  };
};
