<template>
  <div>
    <x-gantt
      ref="ganttRef"
      data-id="index"
      :data="dataList"
      :body-style="bodyStyle"
      :border="0"
      :header-height="40"
      style="height: 100vh"
      :header-style="headerStyle"
      :level-color="['#ffffff']"
      locale="zh-cn"
      primary-color="#F1F2FF"
      row-height="46"
      show-today
    >
      <x-gantt-column prop="index">
        <template #title>
          <div></div>
        </template>
      </x-gantt-column>
      <x-gantt-column prop="name">
        <template #title> 任务 </template>
        <template #default="{ row }">
          {{ row.name }}
        </template>
      </x-gantt-column>
      <x-gantt-column prop="status" label="状态" width="150">
        <template #default="{ row }">
          <el-tag>{{ row.status }}</el-tag>
        </template>
      </x-gantt-column>
      <x-gantt-column
        prop="priority"
        label="优先级"
        width="150"
      ></x-gantt-column>
      <x-gantt-slider move linked-resize resize-left resize-right />
    </x-gantt>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import type { XGanttComponent } from '../types';
const ganttRef = ref<XGanttComponent>();

const dataList = reactive<any>([]);

const bodyStyle = {
  bgColor: '#F8F8F8',
  hoverColor: '#e42411',
  selectColor: '#9ea2ff',
  textColor: '#999999'
};

const headerStyle = {
  bgColor: '#F1F2FF',
  textColor: '#333333'
};

const onAdd = () => {
  // let index = 0;
  // for (let i = 0; i < 10; i++) {
  //   dataList.push({
  //     index: ++index,
  //     name: `task${index}`,
  //     status: `status${index}`,
  //     priority: `priority${index}`,
  //     startDate: new Date(2024, 2, index),
  //     endDate: new Date(2024, 2, index + 5)
  //   });
  // }

  dataList.push({
    index: 1,
    name: 'task1',
    status: 'status1',
    priority: 'priority1',
    startDate: new Date(2024, 2, 1),
    endDate: new Date(2024, 2, 6),
    children: [
      {
        index: 11,
        name: 'task11',
        status: 'status11',
        priority: 'priority11',
        startDate: new Date(2024, 2, 1),
        endDate: new Date(2024, 2, 3)
      },
      {
        index: 12,
        name: 'task12',
        status: 'status12',
        priority: 'priority12',
        startDate: new Date(2024, 2, 4),
        endDate: new Date(2024, 2, 6)
      }
    ]
  });

  dataList.push({
    index: 2,
    name: 'task2',
    status: 'status2',
    priority: 'priority2',
    startDate: new Date(2024, 2, 2),
    endDate: new Date(2024, 2, 7),
    children: [
      {
        index: 21,
        name: 'task21',
        status: 'status21',
        priority: 'priority21',
        startDate: new Date(2024, 2, 2),
        endDate: new Date(2024, 2, 4)
      },
      {
        index: 22,
        name: 'task22',
        status: 'status22',
        priority: 'priority22',
        startDate: new Date(2024, 2, 5),
        endDate: new Date(2024, 2, 7)
      },
      {
        index: 23,
        name: 'task23',
        status: 'status23',
        priority: 'priority23',
        startDate: new Date(2024, 2, 6),
        endDate: new Date(2024, 2, 7),
        children: [
          {
            index: 231,
            name: 'task231',
            status: 'status231',
            priority: 'priority231',
            startDate: new Date(2024, 2, 6),
            endDate: new Date(2024, 2, 7)
          },
          {
            index: 232,
            name: 'task232',
            status: 'status232',
            priority: 'priority232',
            startDate: new Date(2024, 2, 6),
            endDate: new Date(2024, 2, 7)
          }
        ]
      }
    ]
  });
};

onMounted(() => {
  onAdd();
});
</script>
