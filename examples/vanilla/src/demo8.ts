import { XGantt } from "@xpyjs/gantt-core";
import "@xpyjs/gantt-core/style.css";

const wrapper: HTMLElement | null = document.querySelector('.gantt1-container');
if (wrapper) {
  wrapper.style.width = '100%';
}

const projectData = [
  {
    id: "root",
    name: "电商大促项目",
    start: "2025-04-25", // 周五
    end:   "2025-05-15", // 周四（跨 4 个周末 + 3 天假期）
    progress: 0,
    subtask: [
      {
        id: "t1",
        name: "需求评审",
        start: "2025-04-25", // 周五
        end:   "2025-04-30", // 周三
        progress: 100,
        subtask: [
          {
            id: "t1-1", name: "需求讨论",
            start: "2025-04-25", // 周五
            end:   "2025-04-27", // 周日
          },
          {
            id: "t1-2", name: "输出需求文档",
            start: "2025-04-28", // 周一
            end:   "2025-04-30", // 周三
          },
          {
            id: "t1-3", name: "评审会议",
            start: "2025-04-29", // 周二
            end:   "2025-04-30", // 周三
          }
        ]
      },
      {
        id: "t2",
        name: "UI 设计",
        start: "2025-04-29", // 周二
        end:   "2025-05-08", // 周四
        progress: 50
      },
      {
        id: "t3",
        name: "开发联调",
        start: "2025-05-06", // 周二
        end:   "2025-05-12", // 周一
        progress: 30,
        type: 'summary',
        subtask: [
          {
            id: "t3-1", name: "前端开发",
            start: "2025-05-06", // 周二
            end:   "2025-05-09", // 周五
            progress: 40
          },
          {
            id: "t3-2", name: "后端开发",
            start: "2025-05-06", // 周二
            end:   "2025-05-11", // 周六
            progress: 20
          }
        ]
      },
      {
        id: "t4",
        name: "测试上线",
        start: "2025-05-12", // 周一
        end:   "2025-05-15", // 周四
        progress: 0
      }
    ]
  },
  {
    id: 'end',
    name: 'End',
    start: '2025-05-15',
    end: '2025-05-20',
    type: 'milestone'
  }
];

// 节假日（劳动节 5/1-5/3）
const holidayList = [
  { date: "2025-05-01", backgroundColor: "#ff7875", opacity: 0.15, text: { show: true, content: "劳动节" } },
  { date: "2025-05-02", backgroundColor: "#ff7875", opacity: 0.15 },
  { date: "2025-05-03", backgroundColor: "#ff7875", opacity: 0.15 }
];

// ============================================================
// Gantt1: 基础演示 — workTime 引擎
// ============================================================
// 数据形态: endTime
// 期望行为:
//   - bar 跨过周末/节假日（视觉上延伸）
//   - 拖拽端点自动吸附到工作日
//   - 父子联动: 拖动 t3-1 引起 t3、root 扩展
//   - 拖拽后刷新页面数据保留
const gantt1Container = document.getElementById("gantt1");
if (gantt1Container) {
  const gantt = new XGantt(gantt1Container, {
    data: projectData,
    table: {
      columns: [
        { field: "name", label: "任务", width: 180 },
        { field: "start", label: "开始", width: 180 },
        { field: "end", label: "结束", width: 180 },
        { field: "duration", label: "时长", width: 100 },
      ]
    },
    fields: {
      startTime: "start",
      endTime: "end",
      children: "subtask",
      duration: "duration"
    },
    dateFormat: "YYYY-MM-DD HH:mm:ss",
    primaryColor: "#1890ff",

    expand: { show: true, enabled: true },
    row: { height: 34 },
    bar: {
      height: "60%",
      field: "name",
      color: "#fff",
      fontSize: 11,
      move: {
        enabled: true,
        byUnit: true,
        link: {
          child: "scale",   // 子级按比例联动
          parent: "expand"  // 父级自动扩展
        },
        single: {
          left: true,
          right: true
        }
      },
      progress: { show: true }
    },

    weekend: {
      show: true,
      days: [0, 6],
      backgroundColor: "#1890ff",
      opacity: 0.08
    },

    holiday: {
      show: true,
      backgroundColor: "#ff7875",
      opacity: 0.15,
      holidays: holidayList
    },

    workTime: {
      skipWeekends: true,
      skipHolidays: true
    },

    today: { show: true },

    milestone: { show: true, size: 10, color: "red" },
    summary: { show: true }
  });

  gantt.on("move", data => {
    console.log("[Demo8/Gantt1] move:", data);
  });

  if (wrapper) {
    const btn = document.createElement('button');
    btn.style = `width: 100px;margin-top: 12px;`;
    btn.innerText = '打印';
    btn.addEventListener('click', () => { console.log(gantt.context.store) });
    wrapper.appendChild(btn);
  }
}
