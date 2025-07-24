import { toStr } from "@/utils/common";

const data = [
  {
    id: 1,
    name: "项目规划",
    startTime: "2025-01-01",
    endTime: "2025-01-15",
    progress: 100
  },
  {
    id: 2,
    name: "开发阶段",
    startTime: "2025-01-16",
    endTime: "2025-02-28",
    progress: 45
  }
];

const jsCode = `import { XGantt } from '@xpyjs/gantt-core'

// 创建甘特图实例
const gantt = new XGantt({
  container: '#gantt-container',
  data: ${toStr(data, "  ")}
})`;

const vueCode = `<template>
  <div>
    <XGanttVue :options="ganttOptions" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { XGanttVue } from '@xpyjs/gantt-vue'

const ganttOptions = ref({
  data: ${toStr(data, "  ")}
})
</script>`;

const reactCode = `import React from 'react'
import { XGanttReact } from '@xpyjs/gantt-react'

function App() {
  const ganttOptions = {
    data: ${toStr(data, "    ")}
  }

  return (
    <div>
      <XGanttReact options={ganttOptions} />
    </div>
  )
}

export default App`;

export default { jsCode, vueCode, reactCode };
