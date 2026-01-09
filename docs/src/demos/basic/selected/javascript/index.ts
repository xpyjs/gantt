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
  ],
  table: {
    columns: [
      { field: "name", label: "任务名称", width: 100 },
      { field: "startTime", label: "开始时间", width: 150 },
      { field: "endTime", label: "结束时间", width: 150 }
    ]
  },
  expand: {
    show: true,
    enabled: true
  },
  selection: {
    enabled: true,
    includeSelf: true
  }
});

gantt.on('select', (data, checked, all) => {
  if (checked) {
    console.log('选中了任务:', data.map(item => item.name));
    log('选中了任务:', data.map(item => item.name));
  } else {
    console.log('取消选中任务:', data.map(item => item.name));
    log('取消选中任务:', data.map(item => item.name));
  }
  console.log('当前总共选中:', all.length, '个任务');
  log('当前总共选中:', all.length, '个任务');
});

const logContainer = document.getElementById("log-container");
function log(...msg: any[]) {
  if (!logContainer) return;
  const p = document.createElement("p");
  p.textContent = msg.join(" ");
  logContainer.appendChild(p);
}
