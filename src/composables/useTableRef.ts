import { useStore } from '@/store';

export function useInitTableRef() {
  const store = useStore();
  return { tableRef: store.tableRef };
}

export default () => {
  const store = useStore();
  return { tableRef: store.tableRef };
};
