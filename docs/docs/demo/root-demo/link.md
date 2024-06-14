:::demo

```vue
<template>
  <x-gantt :data="dataList" :links="linkList" @add-link="onAddLink">
    <x-gantt-column prop="name" />
    <x-gantt-column prop="startDate" date-format="MM/DD" />

    <x-gantt-slider prop="o.t1" move />
  </x-gantt>
</template>

<script setup>
import { reactive } from 'vue';

const dataList = reactive([]);
for (let i = 1; i <= 5; i++) {
  dataList.push({
    id: i,
    name: 't' + i,
    startDate: new Date().setDate(i),
    endDate: new Date().setDate(i + 5),
    o: { t1: 'a' + i, t2: 'b' + i }
  });
}
dataList[0].children = [
  {
    id: 6,
    name: 't6',
    startDate: new Date().setDate(6),
    endDate: new Date().setDate(11),
    o: { t1: 'a6', t2: 'b6' }
  }
];

const linkList = reactive([
  {
    index: 1,
    from: 1,
    to: 2,
    color: 'green'
  },
  {
    index: 2,
    from: 2,
    to: 5
  },
  {
    index: 3,
    from: 4,
    to: 3,
    color: '#abc'
  }
]);

function onAddLink(link, data, cb) {
  const _link = {
    index: linkList.length + 1,
    from: link.from,
    to: link.to,
    color: 'green'
  };
  linkList.push(_link);

  cb(_link);
};
</script>
```

:::
