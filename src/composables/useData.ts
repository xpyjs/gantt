import { useStore } from '@/store';

export default () => {
  const store = useStore();

  function initData(data: any[]) {
    store.$data.init(data);
  }

  function updateData(data: any[]) {
    store.$data.update(data);
  }

  return { $data: store.$data, initData, updateData };
};
