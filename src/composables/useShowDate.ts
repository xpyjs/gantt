import { reactive, readonly } from 'vue';

const showDateList = reactive<Date[]>([]);

export default () => {
  function clearShowDateList() {
    showDateList.length = 0;
  }

  function addShowDate(showDate: Date) {
    showDateList.push(showDate);
  }

  return {
    clearShowDateList,
    addShowDate,

    showDateList: readonly(showDateList)
  };
};
