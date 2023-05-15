import Variables from '@/constants/vars';
import { ref } from 'vue';
import useParam from './useParam';

const tableHeaderRef = ref<HTMLElement | null>(null);
const ganttHeaderRef = ref<HTMLElement | null>(null);
const ganttBodyRef = ref<HTMLElement | null>(null);

export default () => {
  const { $param } = useParam();

  function getMaxHeader() {
    return Math.max(
      tableHeaderRef.value?.clientHeight ?? 0,
      ganttHeaderRef.value?.clientHeight ?? 0,
      Variables.default.headerHeight
    );
  }

  function updateHeaderHeight() {
    if (!$param.headerHeight) return;

    $param.headerHeight = getMaxHeader();
  }

  return {
    tableHeaderRef,
    ganttHeaderRef,
    ganttBodyRef,
    getMaxHeader,
    updateHeaderHeight
  };
};
