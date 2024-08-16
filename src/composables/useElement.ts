import Variables from '@/constants/vars';
import useStore from '@/store';
import useParam from './useParam';
import useStyle from './useStyle';

export default () => {
  const { $param } = useParam();
  const { $styleBox } = useStyle();
  const { tableHeaderRef, ganttHeaderRef, ganttBodyRef, ganttRef } = useStore();

  function getMaxHeaderHeight() {
    return Math.max(
      tableHeaderRef.value?.clientHeight ?? 0,
      ganttHeaderRef.value?.clientHeight ?? 0,
      Variables.size.minHeaderHeight
    );
  }

  function updateHeaderHeight() {
    // 删除 ref 中 style 的 height 属性，以便获取真实高度
    tableHeaderRef.value?.style.removeProperty('height');
    ganttHeaderRef.value?.style.removeProperty('height');

    let maxHeight = getMaxHeaderHeight();
    if ($param.headerHeight !== maxHeight) {
      $param.headerHeight = maxHeight;
    }

    // 重新设置高度
    if ($styleBox.headerHeight) {
      maxHeight = Math.max($styleBox.headerHeight, maxHeight);
    }

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
