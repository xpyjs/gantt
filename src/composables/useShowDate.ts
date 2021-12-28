import { readonly } from 'vue';
import { useStore } from '@/store';

export default () => {
  const store = useStore();

  function clearShowDateList() {
    store.showDateList.length = 0;
  }

  function addShowDate(showDate: Date) {
    store.showDateList.push(showDate);
  }

  return {
    clearShowDateList,
    addShowDate,

    showDateList: readonly(store.showDateList)
  };
};
