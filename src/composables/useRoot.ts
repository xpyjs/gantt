import { ref } from 'vue';

const rootRef = ref<HTMLElement | null>(null);

export default () => {
  return {
    rootRef
  };
};