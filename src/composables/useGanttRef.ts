import { ref } from 'vue';

const ganttRef = ref<HTMLDivElement>();

export function useInitGanttRef() {
  return { ganttRef };
}

export default () => {
  return { ganttRef };
};
