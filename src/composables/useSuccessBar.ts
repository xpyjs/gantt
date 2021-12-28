/*
 * @Author: JeremyJone
 * @Date: 2021-12-20 14:42:50
 * @LastEditors: JeremyJone
 * @LastEditTime: 2021-12-28 10:05:25
 * @Description: 成功提示条
 */

import { Row } from '@/models/data/row';
import { useStore } from '@/store';

export default () => {
  const store = useStore();

  function pushSucceessBar(row: Row | Row[]) {
    if (Array.isArray(row)) {
      store.successBarList.push(...row);
    } else {
      store.successBarList.push(row);
    }

    setTimeout(() => {
      store.successBarList.length = 0;
    }, store.successBarTimeout);
  }

  return {
    successBarTimeout: store.successBarTimeout,
    successBarList: store.successBarList,
    pushSucceessBar
  };
};
