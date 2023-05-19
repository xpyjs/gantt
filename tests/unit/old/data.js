import { reactive, computed } from 'vue';
import { GanttData } from '@/models/data/data';

// 测试数据
export const dataList = reactive([]);
export let dataCount = 0;

let s = 2;
let e = 15;
for (let i = 0; i < 1000; i++) {
  dataCount++;

  if (s > e) {
    const t = s;
    s = e;
    e = t;
  }
  dataList.push({
    index: i,
    startDate: `2021-06-${s++}`,
    endDate: `2021-08-${e++}`,
    ttt: {
      a: 'aaa',
      b: 'bbb'
    },
    name: '我的数据: ' + s,
    children: []
  });
  if (s > 30) s = 2;
  if (e > 30) e = 5;
}
// 二级数据
for (let i = 0; i < 50; i++) {
  dataCount++;

  if (s > e) {
    const t = s;
    s = e;
    e = t;
  }
  [0, 1, 3, 4, 5, 7, 9].forEach(index => {
    dataList[index]['children'].push({
      index: i,
      startDate: `2021-06-${s++}`,
      endDate: `2021-07-${e++}`,
      name: '子数据: ' + s,
      ttt: {
        a: 's-aaa',
        b: 's-bbb'
      },
      children: []
    });
  });
  if (s > 30) s = 2;
  if (e > 30) e = 5;
}
// 三级数据
for (let i = 0; i < 50; i++) {
  dataCount++;

  if (s > e) {
    const t = s;
    s = e;
    e = t;
  }
  [0, 2].forEach(index => {
    dataList[0]['children'][index]['children'].push({
      index: i,
      startDate: `2021-07-${s++}`,
      endDate: `2021-08-${e++}`,
      name: '孙数据: ' + s,
      ttt: {
        a: 'gs-aaa',
        b: 'gs-bbb'
      },
      children: []
    });
  });
  if (s > 30) s = 2;
  if (e > 30) e = 5;
}

const dataOptions = {
  isExpand: true,
  startLabel: 'startDate',
  endLabel: 'endDate'
};

// 处理数据
const GtData = reactive(new GanttData());
GtData.initData(dataList, dataOptions);
export const allData = computed(() => GtData.flatData);
