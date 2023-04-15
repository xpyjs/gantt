import { useStore } from '@/store';
import { watch, type Ref } from 'vue';

export default () => {
  const store = useStore();

  function initData(data: Ref<any[]>) {
    store.$data.init(data.value);

    watch(
      () => data,
      val => {
        // 更新数据
        store.$data.update(val.value);
      },
      { deep: true }
    );
  }

  return { $data: store.$data, initData };
};
