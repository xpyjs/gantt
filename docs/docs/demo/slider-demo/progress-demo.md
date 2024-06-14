:::demo

```vue
<template>
  <div style="margin-bottom: 10px">
    <x-button @click="show = !show">{{ show ? '隐藏进度' : '显示进度' }}</x-button>
  </div>

  <x-gantt :data="dataList">
    <x-gantt-column prop="name" />
    <x-gantt-slider prop="o.t1" :progress="show" progress-color="#10d353" :progress-decimal="true" />
  </x-gantt>
</template>

<script setup>
import { reactive, ref } from 'vue';

const dataList = reactive([]);
for (let i = 1; i <= 3; i++) {
  dataList.push({
    id: i,
    name: 't' + i,
    startDate: new Date().setDate(i),
    endDate: new Date().setDate(i + 5),
    progress: Math.random(),
    o: { t1: 'a' + i, t2: 'b' + i }
  });
}
dataList[0].children = [
  {
    id: 4,
    name: 't4',
    startDate: new Date().setDate(4),
    endDate: new Date().setDate(6),
    progress: Math.random(),
    o: { t1: 'a4', t2: 'b4' }
  },
  {
    id: 5,
    name: 't5',
    startDate: new Date().setDate(5),
    endDate: new Date().setDate(6),
    progress: Math.random(),
    o: { t1: 'a5', t2: 'b5' }
  }
];

const show = ref(true);
</script>
```

:::
