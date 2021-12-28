import { useStore } from '@/store';

export default (emit: any) => {
  const store = useStore();
  store.rootEmit.value = emit;
  return {};
};

export function useGetRootEmit() {
  const store = useStore();
  return store.rootEmit;
}
