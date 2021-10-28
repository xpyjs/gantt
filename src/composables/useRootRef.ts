import { ref, readonly } from 'vue';

const rootRef = ref<HTMLDivElement>();

export function useInitRootRef() {
  return { rootRef };
}

export default () => {
  return { rootRef: readonly(rootRef) };
};
