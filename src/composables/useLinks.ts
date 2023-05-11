import { useStore } from '@/store';
import { watch, type Ref } from 'vue';

export default () => {
  const store = useStore();

  function initLinks(links: Ref<any[]>) {
    store.$links.init(store.$data.flatData, links.value);

    watch(
      () => links,
      val => {
        // 更新数据
        store.$links.update(store.$data.flatData, val.value);
      },
      { deep: true }
    );
  }

  return {
    $links: store.$links,
    initLinks
  };
};
