import { reactive, ref } from 'vue';

let id = 0;

const ganttData = reactive<any>([]);

function onAdd() {
  ganttData.push({
    index: ++id,
    name: 't' + id,
    startDate: new Date(2023, 4, id),
    endDate: new Date(2023, 5, id + 5),
    o: { t1: 'a', t2: 'b' }
  });
}

for (let i = 0; i < 6; i++) {
  onAdd();
}

ganttData[0].children = [
  {
    index: ++id,
    name: 'sub-t' + id,
    startDate: new Date(2023, 3, 5),
    endDate: new Date(2023, 3, 10),
    progress: 0.8,
    o: { t1: 'a', t2: 'b' }
  },
  {
    index: ++id,
    name: 'sub-t' + id,
    startDate: new Date(2023, 3, 6),
    endDate: new Date(2023, 3, 10),
    progress: 0.5,
    o: { t1: 'a', t2: 'b' },
    children: [
      {
        index: ++id,
        name: 'sub-sub-t' + id,
        startDate: new Date(2023, 3, 5),
        endDate: new Date(2023, 3, 10),
        progress: 0.3333333333,
        o: { t1: 'a', t2: 'b' }
      }
    ]
  }
];

let linkId = 1;
const ganttLinks = reactive([
  {
    index: linkId++,
    from: 1,
    to: 2,
    color: 'green'
  },
  {
    index: linkId++,
    from: 2,
    to: 5
  },
  {
    index: linkId++,
    from: 4,
    to: 2,
    color: 'red'
  },
  {
    index: linkId++,
    from: 4,
    to: 3,
    color: '#abc'
  }
]);

const colors = [
  '#eca710',
  '#e31010',
  '#2196F3',
  '#ff0000',
  '#4CAF50',
  '#FFC107'
];

const units = ['month', 'week', 'day', 'hour'];

export const AllData = ganttData;
export const AllLinks = ganttLinks;
export const Colors = colors;
export const Units = units;
