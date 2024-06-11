import Variables from '@/constants/vars';
import useStore from '@/store';
import useParam from './useParam';

export default () => {
  const { $param } = useParam();
  const { tableHeaderRef, ganttHeaderRef, ganttBodyRef, ganttRef } = useStore();

  function getMaxHeaderHeight() {
    return Math.max(
      tableHeaderRef.value?.clientHeight ?? 0,
      ganttHeaderRef.value?.clientHeight ?? 0,
      Variables.default.headerHeight
    );
  }

  function updateHeaderHeight() {
    if (!$param.headerHeight) return;

    // 删除 ref 中 style 的 height 属性，以便获取真实高度
    tableHeaderRef.value?.style.removeProperty('height');
    ganttHeaderRef.value?.style.removeProperty('height');

    const maxHeight = getMaxHeaderHeight();
    if ($param.headerHeight !== maxHeight) {
      $param.headerHeight = maxHeight;
    }

    // 重新设置高度
    tableHeaderRef.value &&
      (tableHeaderRef.value.style.height = `${maxHeight}px`);
    ganttHeaderRef.value &&
      (ganttHeaderRef.value.style.height = `${maxHeight}px`);
  }

  return {
    tableHeaderRef,
    ganttHeaderRef,
    ganttBodyRef,
    ganttRef,
    getMaxHeaderHeight,
    updateHeaderHeight
  };
};
