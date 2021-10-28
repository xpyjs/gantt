import { ref } from 'vue';

const rootEmit = ref();

export default (emit: any) => {
  rootEmit.value = emit;
  return {};
};

export function useGetRootEmit() {
  return rootEmit;
}
