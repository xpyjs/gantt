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

    $param.headerHeight = getMaxHeaderHeight();
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
