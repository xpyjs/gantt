<template>
  <div class="demo-container">
    <XGanttVue :options="ganttOptions" />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { XGanttVue } from '@xpyjs/gantt-vue'
import '@xpyjs/gantt-vue/style.css'

const ganttOptions = reactive({
  data: [
    {
      id: "1",
      name: "项目规划",
      startTime: "2025-01-01",
      endTime: "2025-01-10",
      progress: 80
    },
    {
      id: "2",
      name: "开发阶段",
      startTime: "2025-01-11",
      endTime: "2025-01-20",
      progress: 45
    },
    {
      id: "3",
      name: "测试发布",
      startTime: "2025-01-21",
      endTime: "2025-02-03",
      progress: 10
    }
  ],
  table: {
    columns: [
      { field: "name", label: "任务名称", width: 100 },
      { field: "startTime", label: "开始时间", width: 150 },
      { field: "endTime", label: "结束时间", width: 150 }
    ]
  }
})
</script>
