import type RowItem from '@/models/data/row';
import { useStore } from '@/store';
import { isBoolean } from 'lodash';
import { watch, type Ref } from 'vue';

export default () => {
  const { linking, $links, $data } = useStore();

  function initLinks(links: Ref<any[]>) {
    $links.init($data.flatData, links.value);

    watch(
      () => [links, $data.flatData],
      () => {
        // 更新数据
        $links.init($data.flatData, links.value);
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
    $links,
    initLinks,
    linking,
    setLinking
  };
};
