:::demo

```vue
<template>
  <div style="margin-bottom: 10px">
    <x-button @click="alignment='left'">左对齐</x-button>
    <x-button @click="alignment='center'">居中对齐</x-button>
    <x-button @click="alignment='right'">右对齐</x-button>
  </div>

  <x-gantt :data="dataList">
    <x-gantt-column prop="name" />
    <x-gantt-slider prop="o.t1" :alignment="alignment" />
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
    o: { t1: 'a' + i, t2: 'b' + i }
  });
}

const alignment = ref('left');
</script>
```

:::
