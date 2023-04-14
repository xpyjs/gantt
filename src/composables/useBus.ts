import { useStore } from '@/store';

export default () => {
  const store = useStore();
  return { $bus: store.$bus };
};
