import { XGantt } from "@xpyjs/gantt-core";
import "@xpyjs/gantt-core/style.css";

const container = document.getElementById("gantt-container");
if (!container) {
  throw new Error("Container not found");
}

// 设置容器样式
container.style.width = "100%";
container.style.height = "350px";

const gantt = new XGantt(container, {
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
});
