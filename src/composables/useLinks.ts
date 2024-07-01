import type RowItem from '@/models/data/row';
import { useStore } from '@/store';
import { type LinkProps } from '@/typings/link';
import { isBoolean } from 'lodash';
import { type Ref, watchEffect } from 'vue';

export default () => {
  const { linking, $links, $data } = useStore();

  function initLinks(links: Ref<LinkProps[]>) {
    $links.init($data.flatData, links.value);

    watchEffect(() => {
      // 更新数据
      $links.update($data.flatData, links.value);
    });
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
