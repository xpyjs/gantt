import Variables from '@/constants/vars';
import { useStore } from '@/store';
import { type VNode } from 'vue';

export default () => {
  const store = useStore();

  function setTableWidth(columns: VNode[]) {
    store.tableWidth.value = columns.reduce(
      (p, c) =>
        p +
        (Number.parseInt(c.props?.width) || Variables.default.tableColumnWidth),
      0
    );
  }

  return { tableWidth: store.tableWidth, setTableWidth };
};
