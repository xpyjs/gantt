import { Row } from "@/models/data/row";
import { computed, Ref } from "vue";
import useResize from "./useResize";
import useWheel from "./useWheel";

export default function (data: Ref<Array<Row>>) {
  const { rowHeight } = useResize();
  const { scrollTop, rootHeight } = useWheel();

  // 预加载条数
  const preload = 1;

  // 数据展示最上面的 index
  const top = computed(() => {
    const index = Math.ceil(scrollTop.value / rowHeight.value);
    return index - preload > 0 ? index - preload : 0;
  });

  // 数据展示最下面的 index
  const bottom = computed(() => {
    const count = Math.ceil(rootHeight.value / rowHeight.value);
    const _t = Math.ceil(scrollTop.value / rowHeight.value) + count + preload;
    return _t > data.value.length ? data.value.length : _t;
  });

  // 切出要展示的数据
  const inView = computed(() => data.value.slice(top.value, bottom.value));

  return { inView };
}