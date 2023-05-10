import { ref, toRaw } from 'vue';

const rootEmit: any = ref(null);

export default () => {
  function setRootEmit(emit: any) {
    rootEmit.value = emit;
  }

  function EmitClickRow(row: any) {
    rootEmit.value?.('row-click', toRaw(row));
  }

  return {
    setRootEmit,
    EmitClickRow
  };
};
