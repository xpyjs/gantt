import { useStore } from '@/store';
import { watch, type Ref } from 'vue';

export default () => {
  const store = useStore();

  // 设置甘特日期头
  function setGanttHeaders() {
    store.ganttHeader.setDate(store.$data.start, store.$data.end);
  }

  function initData(data: Ref<any[]>) {
    store.$data.init(data.value);

    setGanttHeaders();

    watch(
      () => data,
      val => {
        // 更新数据
        store.$data.update(val.value);

        setGanttHeaders();
      },
      { deep: true }
    );
  }

  function getDateList() {
    return store.ganttHeader.headers;
  }

  return { $data: store.$data, initData, getDateList };
};
