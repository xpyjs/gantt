:::demo

```vue
<template>
    <div style="margin-bottom: 10px">
      <x-button @click="() => (isDark = !isDark)">黑暗</x-button>
      <x-button @click="() => (isHighlightDate = !isHighlightDate)">高亮日期</x-button>
      <x-button @click="customStyle">切换颜色</x-button>
    </div>

    <x-gantt :data="dataList" :dark="isDark" :highlight-date="isHighlightDate"  primary-color="#1890FF" :header-style="headerStyle" :body-style="bodyStyle" row-height="40" :level-color="levelColor">
      <x-gantt-column prop="name" />
      <x-gantt-column prop="startDate" date-format="MM/DD" />

      <x-gantt-slider prop="o.t1" move />
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
dataList[0].children = [
  {
    id: 6,
    name: 't6',
    startDate: new Date().setDate(6),
    endDate: new Date().setDate(11),
    o: { t1: 'a6', t2: 'b6' }
  }
];

const levelColor = ['', 'lightcyan'];

const isDark = ref(false);
const isHighlightDate = ref(false);

const randomBgColors = ['#f50', '#2db7f5', '#87d068', '#108ee9', 'transparent'];
const randomColors = ['#000000', '#FF0000',  '#008000',  '#0000FF',  '#FFFF00',  '#00FFFF',  '#FF00FF',  '#C0C0C0',  '#808080',  '#800000',  '#808000',  '#008080',  '#800080',  '#000080'];
const headerStyle = ref({});
const bodyStyle = ref({});
function customStyle() {
  headerStyle.value = {
    bgColor: randomBgColors[Math.floor(Math.random() * randomBgColors.length)],
    textColor: randomColors[Math.floor(Math.random() * randomColors.length)]
  };

  bodyStyle.value = {
    bgColor: randomBgColors[Math.floor(Math.random() * randomBgColors.length)],
    textColor: randomColors[Math.floor(Math.random() * randomColors.length)],
    hoverColor: randomBgColors[Math.floor(Math.random() * randomBgColors.length)],
    selectColor: randomBgColors[Math.floor(Math.random() * randomBgColors.length)],
    todayColor: randomBgColors[Math.floor(Math.random() * randomBgColors.length)],
    weekendColor: randomBgColors[Math.floor(Math.random() * randomBgColors.length)]
  };
}
</script>
```

:::
