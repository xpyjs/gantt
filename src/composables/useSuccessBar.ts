/*
 * @Author: JeremyJone
 * @Date: 2021-12-20 14:42:50
 * @LastEditors: JeremyJone
 * @LastEditTime: 2021-12-20 16:06:19
 * @Description: 成功提示条
 */

import { reactive } from 'vue';
import { Row } from '@/models/data/row';

const successBarList: Row[] = reactive([]);
const timeout = 1000; // 提示条消失时间

export default () => {
  function pushSucceessBar(row: Row | Row[]) {
    if (Array.isArray(row)) {
      successBarList.push(...row);
    } else {
      successBarList.push(row);
    }

    setTimeout(() => {
      successBarList.length = 0;
    }, timeout);
  }

  return {
    successBarTimeout: timeout,
    successBarList,
    pushSucceessBar
  };
};
