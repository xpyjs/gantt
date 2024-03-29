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
  let index = 0;
  for (let i = 0; i < 10; i++) {
    dataList.push({
      index: ++index,
      name: `task${index}`,
      status: `status${index}`,
      priority: `priority${index}`,
      startDate: new Date(2024, 2, index),
      endDate: new Date(2024, 2, index + 5)
    });
  }
};

onMounted(() => {
  onAdd();
});
</script>
