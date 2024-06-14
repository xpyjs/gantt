:::demo

```vue
<template>
  <div style="margin-bottom: 10px; font-size: 14px; color: #666; font-style: italic;">这个示例展示了如何合并具有子项的父级项。</div>

  <x-gantt :data="dataList">
    <x-gantt-column prop="id" />
    <x-gantt-column prop="name" :merge="true"  /> // [!code focus]
    <x-gantt-column prop="startDate" date-format="MM/DD" :merge="({row, level}) => level === 1 && row.children" /> // [!code focus]
    <x-gantt-column prop="endDate" date-format="MM/DD" :merge="({row, level}) => level === 1 && row.children" /> // [!code focus]
  </x-gantt>
</template>

<script setup>
import { reactive } from 'vue';

const dataList = reactive([]);
for (let i = 1; i <= 3; i++) {
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
