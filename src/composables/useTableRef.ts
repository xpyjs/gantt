import { ref } from "vue";

const tableRef = ref<HTMLDivElement>();

export function useInitTableRef() {
  return { tableRef };
}

export default function () {
  return { tableRef };
}
