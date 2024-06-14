
:::demo

```vue
<template>
  <x-gantt :data="dataList" :expand-all="false" show-expand>
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
</script>
```

:::
