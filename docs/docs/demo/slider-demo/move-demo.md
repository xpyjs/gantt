:::demo

```vue
<template>
  <div style="margin-bottom: 10px">
    <x-button @click="linked = !linked">{{ linked ? '已联动' : '未联动' }}</x-button>
    <x-button @click="moveByUnit = !moveByUnit">{{ moveByUnit ? '按单位移动' : '按像素移动' }}</x-button>
  </div>

  <x-gantt :data="dataList">
    <x-gantt-column prop="name" />
    <x-gantt-slider
      prop="o.t1"
      :move="true"
      :linked-resize="linked"
      :resize-left="true"
      :resize-right="({level}) => level === 2"
      :move-by-unit="moveByUnit"
    />
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
dataList[0].children = [
  {
    id: 4,
    name: 't4',
    startDate: new Date().setDate(4),
    endDate: new Date().setDate(6),
    o: { t1: 'a4', t2: 'b4' }
  }
];

const linked = ref(true);
const moveByUnit = ref(false)
</script>
```

:::
