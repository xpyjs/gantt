:::demo

```vue
<template>
  <x-gantt :data="dataList.filter(row => !searchVal || row.name.includes(searchVal)).sort(sortFunc)">
    <x-gantt-column prop="id" label="编号">
      <template v-slot:title="{prop, label, level}">
        <div>{{ label }}</div>
        <x-button type="success" style="padding: 4px 8px" @click="isAsc = !isAsc">排序</x-button>
      </template>
    </x-gantt-column>

    <x-gantt-column prop="name" width="120">
      <template v-slot:title="{prop, label, level}">
        <div>{{ label }} - {{ level }}</div>
        <input style="background-color: white; width: 100%;" placeholder="search" v-model="searchVal" />
      </template>
    </x-gantt-column>

    <x-gantt-column prop="startDate" date-format="MM/DD" />
    <x-gantt-column prop="endDate" date-format="MM/DD" />
  </x-gantt>
</template>

<script setup>
import { reactive, ref } from 'vue';

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

const searchVal = ref('');

const isAsc = ref(true);
const sortFunc = (a, b) => isAsc.value ? a.id - b.id : b.id - a.id;
</script>
```

:::
