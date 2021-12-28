import { useStore } from '@/store';

export function useInitGanttRef() {
  const store = useStore();
  return { ganttRef: store.ganttRef };
}

export default () => {
  const store = useStore();
  return { ganttRef: store.ganttRef };
};
