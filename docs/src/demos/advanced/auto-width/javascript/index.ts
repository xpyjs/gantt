import { XGantt } from "@xpyjs/gantt-core";
import "@xpyjs/gantt-core/style.css";

const ganttContainer = document.getElementById("gantt-container");
if (!ganttContainer) {
  throw new Error("Gantt container not found");
}

const gantt = new XGantt(ganttContainer, {
  data: [
    {
      id: "1",
      name: "项目规划",
      startTime: "2025-01-01",
      endTime: "2025-01-05",
      progress: 80
    },
    {
      id: "2",
      name: "开发阶段",
      startTime: "2025-01-05",
      endTime: "2025-01-10",
      progress: 45
    },
    {
      id: "3",
      name: "测试发布",
      startTime: "2025-01-10",
      endTime: "2025-01-12",
      progress: 10
    }
  ],
  table: {
    columns: [
      { field: "name", label: "任务名称", width: 100 },
      { field: "startTime", label: "开始时间", width: 150 },
      { field: "endTime", label: "结束时间", width: 150 }
    ]
  },
  chart: {
    autoCellWidth: true,
    startTime: "2024-12-30",
    endTime: "2025-01-15"
  }
});
