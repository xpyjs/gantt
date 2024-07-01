import type RowItem from '@/models/data/row';
import { useStore } from '@/store';
import { type LinkProps } from '@/typings/link';
import { debounce, isBoolean } from 'lodash';
import { type Ref, watch } from 'vue';
import useInView from './useInView';

export default () => {
  const { linking, $links } = useStore();
  const { inView } = useInView();

  function initLinks(links: Ref<LinkProps[]>) {
    $links.init(inView, links.value);

    const debouncedUpdate = debounce($inView => {
      $links.update($inView, links.value);
    }, 100);

    watch(
      () => inView,
      () => {
        // 更新数据

        debouncedUpdate(inView);
      },
      {
        immediate: true,
        deep: true
      }
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
