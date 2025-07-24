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
      { field: "name", label: "任务名称", width: 120 },
      { field: "startTime", label: "开始时间", width: 100 },
      { field: "endTime", label: "结束时间", width: 100 }
    ]
  },
  expand: {
    show: true
  },
  selection: {
    enabled: true
  },
  primaryColor: "#007acc",
  dateFormat: "YYYY-MM-DD",
  row: {
    indent: 24,
    height: 36,
    backgroundColor: row => (row.level === 1 ? "#d4edda" : "")
  },
  bar: {
    height: "36%",
    shadowBlur: 4,
    shadowColor: "rgba(0, 0, 0, 0.4)",
    shadowOffsetX: 2,
    shadowOffsetY: 2,
    field: "name",
    color: "#e5eef0",
    fontSize: 10,
    move: {
      enabled: true,
      lock: false,
      byUnit: true,
      single: {
        left: true,
        right: true
      },
      link: {
        child: "scale",
        parent: "expand"
      }
    }
  },
  height: 400
};

const jsCode = `import { XGantt } from "@xpyjs/gantt-core";
import "@xpyjs/gantt-core/style.css";

const ganttContainer = document.getElementById("gantt-container");
if (!ganttContainer) {
  throw new Error("Gantt container not found");
}

const gantt = new XGantt(ganttContainer, ${toStr(options)});

// 监听移动事件
gantt.on("move", data => {
  console.log('任务移动:', data);

  // 数据格式为 { row: 移动后的数据, old: 移动前的数据 }[]
  data.forEach(item => {
    console.log('任务移动:', {
      task: item.row.name,
      oldStartDate: item.old.startTime,
      newStartDate: item.row.startTime,
      oldEndDate: item.old.endTime,
      newEndDate: item.row.endTime
    });
  });
});
`;

export default {
  jsCode
};
