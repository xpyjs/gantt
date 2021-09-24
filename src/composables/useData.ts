import { GanttData } from "@/models/data/data";
import { Row } from "@/models/data/row";
import { ComputedRef, reactive, Ref, computed, watch } from "vue";
import { useRootEmit } from "./useEvent";
import { useSetGanttHeader } from "./useParam";

// 全局共享一个数据对象
const GtData = reactive(new GanttData());

export default function () {
  return { GtData };
}

export function useInitData(
  data: Ref<Array<any>>,
  options: ComputedRef<DataOptions>
) {
  const { setHeaders } = useSetGanttHeader();
  const { IFClickRow } = useRootEmit();

  // 处理数据
  GtData.initData(data.value, options.value);

  const allData = computed(() => GtData.flatData as Row[]);

  // 监听数据变化
  watch(
    () => data,
    data => {
      let item = null as Row | null;

      // 先判断选中的内容
      const select = GtData.selected.index;
      if (select > -1) item = allData.value[select];

      GtData.update(data.value, item);
      setHeaders();

      // 数据发生变化，如果 selectIndex 变为 -1，表示数据已经被删除，选择的行内容需要抛出清空
      if (select > -1 && GtData.selected.index === -1) {
        IFClickRow(undefined);
      }
    },
    { deep: true }
  );

  return {
    allData
  };
}
