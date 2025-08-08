import { XGantt } from "@xpyjs/gantt-core";
import "@xpyjs/gantt-core/style.css";

const ganttContainer = document.getElementById("gantt1");
if (!ganttContainer) {
  throw new Error("Gantt container not found");
}

console.log("initializing gantt chart", performance.now());

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
        name: "项目设计",
        start: "2025-01-06",
        end: "2025-01-10",
        progress: 70
      },
      {
        id: "1-3",
        name: "设计定稿",
        start: "2025-01-10",
        end: "2025-01-20",
        progress: 100,
        type: 'milestone'
      },
      {
        id: "1-4",
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
      },
      {
        id: "2-3",
        name: "开发完成",
        start: "2025-01-28",
        end: "2025-01-30",
        progress: 100
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
];

const gantt = new XGantt(ganttContainer, {
  data,
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
  links: {
    data: [
      { id: 'link-1', from: '1-1', to: '1-2' },
      { id: 'link-2', from: '1-2', to: '1-3' },
      { id: 'link-3', from: '1-3', to: '2-1' },
    ],
    show: true,
    create: {
      enabled: true
    },
    move: {
      enabled: true
    }
  },
  weekend: {
    show: true,
    backgroundColor: "#007acc",
    opacity: 0.05
  },
  milestone: {
    show: true,
    size: 10,
    // shape: 'star',
    color: 'red',
    border: {
      width: 1
    },
    label: {
      show: true,
      // position: 'top-left',
      text: '测试标签',
    }
  }
});

console.log("Gantt chart initialized:", performance.now(), gantt);

gantt.on("loaded", () => {
  console.log("Gantt chart loaded successfully", performance.now());
});


const btnGroup = document.getElementById('btn-group');
if (btnGroup) {
  {
    const btn1 = document.createElement('button');
    btn1.innerText = '切换里程碑显示';
    let show = true;
    btn1.addEventListener('click', () => {
      show = !show;
      gantt.update({ milestone: { show } })
    })

    btnGroup.appendChild(btn1);
  }

  {
    const btn2 = document.createElement('button');
    btn2.innerText = '切换任务里程碑';
    let s = false;
    btn2.addEventListener('click', () => {
      if (s === false) {
        data[1].subtask[2].type = 'milestone';
        s = true;
      } else {
        data[1].subtask[2].type = 'task';
        s = false;
      }

      gantt.update({ data })
    })

    btnGroup.appendChild(btn2);
  }
}