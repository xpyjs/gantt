import { ref } from 'vue';

const rootRef = ref<HTMLElement | null>(null);
const tableHeaderRef = ref<HTMLElement | null>(null);

export default () => {
  return { rootRef, tableHeaderRef };
};
