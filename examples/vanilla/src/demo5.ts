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

const links = [
  { id: 'link-1', from: '1-1', to: '1-2' },
  { id: 'link-2', from: '1-2', to: '1-3' },
  { id: 'link-4', from: '1-2', to: '1-4' },
  { id: 'link-3', from: '1-3', to: '2-1', color: '#00fc11' },
  { id: 'link-5', from: '1-4', to: '2-1', color: '#8356fc' },
  { id: 'link-6', from: '1-4', to: '2-2', color: '#8356fc' },
  { id: 'link-7', from: '2-1', to: '2-3', color: '#fc0066' },
  { id: 'link-8', from: '2-2', to: '2-3', color: '#fc0066' },
  { id: 'link-9', from: '2-2', to: '2-1', color: '#a19c66' },
  { id: 'link-10', from: '3-1', to: '3-2' },
  { id: 'link-11', from: '3-2', to: '3-1' },
  { id: 'link-12', from: '3-1', to: '2-3' },
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
    data: links,
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

let selectNode: any = null;

console.log("Gantt chart initialized:", performance.now(), gantt);

gantt.on("loaded", () => {
  console.log("Gantt chart loaded successfully", performance.now());
});
gantt.on("error", (err, msg) => {
  console.log("Gantt chart error occurred:", err, msg);
});
gantt.on("create:link", (link) => {
  links.push({ ...link, id: `link-${links.length + 1}` });
})
gantt.on("update:link", (link) => {
  console.log('update link', link);

  const index = links.findIndex(l => l.id === link.id);
  links.splice(index, 1, link as any);
})


const btnGroup = document.getElementById('btn-group');
if (btnGroup) {
  {
    const div = document.createElement('div');
    div.innerText = '';
    btnGroup.appendChild(div);
    gantt.on("click:slider", (event, taskData) => {
      selectNode = taskData;
      div.innerText = `选中节点: ${taskData.name}`;
    });
  }

  {
    const btn1 = document.createElement('button');
    btn1.innerText = '获取节点的完整链路';
    btn1.addEventListener('click', () => {
      if (selectNode.id) {
        const data = gantt.getDataChain(selectNode.id);
        console.log('data chain', data);
      } else {
        console.error('没有找到 id')
      }
    })

    btnGroup.appendChild(btn1);
  }
}