import { useStore } from '@/store';
import { ref } from 'vue';

export default () => {
  const store = useStore();

  const bodyHeight = ref(`${20 * store.$data.length}px`);

  return { bodyHeight };
};
