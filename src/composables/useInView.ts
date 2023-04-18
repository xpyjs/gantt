import useStore from '@/store';
import { computed, reactive, watch } from 'vue';
import useStyle from './useStyle';
import type RowItem from '@/models/data/row';

export default () => {
  const store = useStore();

  const currentTop = computed(() => store.$param.currentTop);

  const { rowHeight } = useStyle();

  // 预加载条数
  const preload = 5;

  // 数据展示最上面的 index
  const top = computed(() => {
    const index = Math.ceil(currentTop.value / rowHeight.value);
    return Math.max(index - preload, 0);
  });

  // 数据展示最下面的 index
  const bottom = computed(() => {
    const count = Math.ceil(store.$param.rootHeight / rowHeight.value);
    const t = Math.ceil(currentTop.value / rowHeight.value) + count + preload;
    return Math.min(t, store.$data.length);
  });

  // 切出要展示的数据
  const inView = reactive<RowItem[]>([]);
  watch(
    () => [top.value, bottom.value],
    () => {
      for (let i = inView.length - 1; i >= 0; i--) {
        if (
          inView[i].flatIndex < top.value ||
          inView[i].flatIndex > bottom.value
        ) {
          inView.splice(i, 1);
        }
      }

      for (let i = top.value; i < bottom.value; i++) {
        if (!~inView.findIndex(v => v.flatIndex === i)) {
          inView.push(store.$data.flatData[i]);
        }
      }
    }
  );

  return {
    inView: inView as RowItem[]
  };
};
