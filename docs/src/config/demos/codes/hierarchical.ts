import { toStr } from "@/utils/common";

const data = [
  {
    id: "1",
    name: "项目规划",
    startTime: "2025-01-01",
    endTime: "2025-01-15",
    progress: 80,
    children: [
      {
        id: "1-1",
        name: "需求分析",
        startTime: "2025-01-01",
        endTime: "2025-01-05",
        progress: 100
      },
      {
        id: "1-2",
        name: "技术选型",
        startTime: "2025-01-06",
        endTime: "2025-01-15",
        progress: 90
      }
    ]
  },
  {
    id: "2",
    name: "开发阶段",
    startTime: "2025-01-16",
    endTime: "2025-01-28",
    progress: 60,
    children: [
      {
        id: "2-1",
        name: "前端开发",
        startTime: "2025-01-16",
        endTime: "2025-01-28",
        progress: 80
      },
      {
        id: "2-2",
        name: "后端开发",
        startTime: "2025-01-20",
        endTime: "2025-01-28",
        progress: 70
      }
    ]
  },
  {
    id: "3",
    name: "测试阶段",
    startTime: "2025-01-28",
    endTime: "2025-02-05",
    progress: 50
  }
];

const options = {
  data,
  table: {
    columns: [
      { field: "name", label: "任务名称", width: 100 },
      { field: "startTime", label: "开始时间", width: 150 },
      { field: "endTime", label: "结束时间", width: 150 }
    ]
  },
  expand: {
    show: true,
    enabled: false
  }
}

const jsCode = `import { XGantt } from "@xpyjs/gantt-core";
import "@xpyjs/gantt-core/style.css";

const ganttContainer = document.getElementById("gantt-container");
if (!ganttContainer) {
  throw new Error("Gantt container not found");
}

const gantt = new XGantt(ganttContainer, ${toStr(options)});
`;

const vueCode = `<template>
  <div class="demo-container">
    <XGanttVue :options="ganttOptions" />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { XGanttVue } from '@xpyjs/gantt-vue'
import '@xpyjs/gantt-vue/style.css'

const ganttOptions = reactive(${toStr(options)})
</script>`;

const reactCode = `import React from 'react'
import { XGanttReact } from '@xpyjs/gantt-react'
import '@xpyjs/gantt-react/style.css'

const GanttComponent: React.FC = () => {
  const ganttOptions = ${toStr(options, "  ")}

  return (
    <div className="demo-container">
      <XGanttReact
        options={ganttOptions}
      />
    </div>
  )
}

export default GanttComponent`;


export default {
  jsCode,
  vueCode,
  reactCode
};
