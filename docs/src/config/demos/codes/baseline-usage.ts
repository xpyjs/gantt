const jsCode = `import { XGantt } from "@xpyjs/gantt-core";
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
      progress: 50,
      subtask: [
        {
          id: "3-1",
          name: "功能测试",
          start: "2025-01-28",
          end: "2025-02-02",
          progress: 60
        },
        {
          id: "3-2",
          name: "性能测试",
          start: "2025-02-03",
          end: "2025-02-05",
          progress: 40
        }
      ]
    }
  ],
  table: {
    columns: [
      { field: "name", label: "任务名称", width: 150 },
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
    enabled: true
  },
  selection: {
    enabled: true,
    includeSelf: true
  },
  border: {
    show: true
  },
  primaryColor: "#007acc",
  dateFormat: "YYYY-MM-DD",
  header: {
    color: "#f8f9fa",
    fontSize: 14
  },
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
  weekend: {
    show: true,
    backgroundColor: "#007acc",
    opacity: 0.05
  },
  baselines: {
    show: true,
    offset: -5,
    backgroundColor: '#999',
    data: [
      {
        id: "baseline1",
        taskId: "1",
        startTime: "2025-01-01",
        endTime: "2025-01-15",
        name: "Baseline 1",
        highlight: false
      },
      {
        id: "baseline1-1",
        taskId: "1",
        startTime: "2025-01-16",
        endTime: "2025-01-18",
        name: "Baseline 1-1",
        target: true
      },
      {
        id: "baseline2",
        taskId: "2",
        startTime: "2025-01-16",
        endTime: "2025-01-28",
        name: "Baseline 2"
      },
      {
        id: "baseline3",
        taskId: "3-2",
        startTime: "2025-02-03",
        endTime: "2025-02-05",
        name: "Baseline 3"
      }
    ],
    mode: 'shadow',
    label: {
      show: true,
      position: 'left'
    },
    compare: {
      enabled: true,
      indicator: {
        show: true,
        ahead: {
          opacity: 0.5,
          text: (diff, row) => \`领先 \${diff} 天\`
        },
        delayed: {
          text: (diff, row) => {
            return \`超期 \${-diff} 天\`;
          }
        },
      }
    }
  }
});

gantt.on('click:baseline', (e, task, baseline) => {
  console.log('点击基线:', task, baseline);
});
gantt.on('contextmenu:baseline', (e, task, baseline) => {
  console.log('右键菜单基线:', task, baseline);
});
gantt.on('hover:baseline', (e, task, baseline) => {
  console.log('悬停基线:', task, baseline);
});
gantt.on('leave:baseline', (e, task, baseline) => {
  console.log('离开基线:', task, baseline);
});
`;

export default {
  jsCode
};
