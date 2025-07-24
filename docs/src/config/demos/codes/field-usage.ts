import { toStr } from "@/utils/common";

const data = [
  {
    id: "1",
    name: "项目规划",
    start: "2025-01-01",
    end: "2025-01-15",
    progress: 80,
    subtask: [
      {
        id: "1-1",
        name: "需求分析",
        start: "2025-01-01",
        end: "2025-01-05",
        progress: 100
      },
      {
        id: "1-2",
        name: "技术选型",
        start: "2025-01-06",
        end: "2025-01-15",
        progress: 90
      }
    ]
  },
  {
    id: "2",
    name: "开发阶段",
    start: "2025-01-16",
    end: "2025-01-28",
    progress: 60,
    subtask: [
      {
        id: "2-1",
        name: "前端开发",
        start: "2025-01-16",
        end: "2025-01-28",
        progress: 80
      },
      {
        id: "2-2",
        name: "后端开发",
        start: "2025-01-20",
        end: "2025-01-28",
        progress: 70
      }
    ]
  },
  {
    id: "3",
    name: "测试阶段",
    start: "2025-01-28",
    end: "2025-02-05",
    progress: 50
  }
];

const options = {
  data,
  table: {
    columns: [
      { field: "name", label: "任务名称", width: 100 },
      { field: "start", label: "开始时间", width: 150 },
      { field: "end", label: "结束时间", width: 150 }
    ]
  },
  fields: {
    startTime: "start",
    endTime: "end",
    children: "subtask"
  },
  expand: {
    show: true,
    enabled: false
  },
  selection: {
    enabled: true,
    includeSelf: true
  }
};

const jsCode = `import { XGantt } from "@xpyjs/gantt-core";
import "@xpyjs/gantt-core/style.css";

const ganttContainer = document.getElementById("gantt-container");
if (!ganttContainer) {
  throw new Error("Gantt container not found");
}

const gantt = new XGantt(ganttContainer, ${toStr(options)});
`;

export default {
  jsCode
};
