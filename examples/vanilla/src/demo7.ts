import { XGantt } from "@xpyjs/gantt-core";
import "@xpyjs/gantt-core/style.css";

const ganttContainer = document.getElementById("gantt1");
if (!ganttContainer) {
  throw new Error("Gantt container not found");
}

const data = [
  {
    id: "1",
    name: "项目规划",
    start: "2025-01-01 08:00:00",
    end: "2025-01-15 18:00:00",
    progress: 80,
    subtask: [
      {
        id: "1-1",
        name: "需求分析",
        start: "2025-01-01 08:00:00",
        end: "2025-01-05 18:00:00",
        progress: 100
      },
      {
        id: "1-2",
        name: "项目设计",
        start: "2025-01-06 08:00:00",
        end: "2025-01-10 18:00:00",
        progress: 70
      },
      {
        id: "1-3",
        name: "技术选型",
        start: "2025-01-06 08:00:00",
        end: "2025-01-15 18:00:00",
        progress: 90
      }
    ]
  },
  {
    id: "2",
    name: "开发阶段",
    start: "2025-01-16 08:00:00",
    end: "2025-02-15 18:00:00",
    progress: 60,
    subtask: [
      {
        id: "2-1",
        name: "前端开发",
        start: "2025-01-16 08:00:00",
        end: "2025-02-05 18:00:00",
        progress: 80
      },
      {
        id: "2-2",
        name: "后端开发",
        start: "2025-01-20 08:00:00",
        end: "2025-02-10 18:00:00",
        progress: 70
      },
      {
        id: "2-3",
        name: "联调测试",
        start: "2025-02-10 08:00:00",
        end: "2025-02-15 18:00:00",
        progress: 40
      }
    ]
  },
  {
    id: "3",
    name: "测试上线",
    start: "2025-02-16 08:00:00",
    end: "2025-03-01 18:00:00",
    progress: 30,
    subtask: [
      {
        id: "3-1",
        name: "功能测试",
        start: "2025-02-16 08:00:00",
        end: "2025-02-22 18:00:00",
        progress: 50
      },
      {
        id: "3-2",
        name: "性能测试",
        start: "2025-02-23 08:00:00",
        end: "2025-02-28 18:00:00",
        progress: 20
      },
      {
        id: "3-3",
        name: "部署上线",
        start: "2025-02-28 08:00:00",
        end: "2025-03-01 18:00:00",
        progress: 0
      }
    ]
  }
];

// =============================================
// Demo7: scaleUnit + cellWidth 配置演示
// =============================================
// 重点展示 scaleUnit 自定义时间轴配置
// cellWidth 控制底层 scale 每格的像素宽度

const gantt1 = new XGantt(ganttContainer, {
  data,
  table: {
    columns: [
      { field: "name", label: "任务名称", width: 180 },
      { field: "start", label: "开始时间", width: 130 },
      { field: "end", label: "结束时间", width: 130 }
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
  border: {
    show: true
  },
  primaryColor: "#1890ff",
  dateFormat: "YYYY-MM-DD HH:mm:ss",
  header: {
    color: "#fff",
    fontSize: 13
  },
  row: {
    height: 36,
    indent: 20
  },
  bar: {
    height: "50%",
    field: "name",
    color: "#fff",
    fontSize: 11,
    move: {
      enabled: true,
      byUnit: false
    },
    progress: {
      show: true
    }
  },

  // ★ 重点：scaleUnit 自定义时间轴
  // 两层表头：上层按周，下层按天
  // cellWidth = 50 表示底层每格 50px
  // height 控制每层的行高
  scaleUnit: [
    {
      unit: "week",
      step: 1,
      format: "YYYY 第ww周",
      height: 24
    },
    {
      unit: "day",
      step: 1,
      format: "DD",
      cellWidth: 50,
      height: 30
    }
  ],

  weekend: {
    show: true,
    backgroundColor: "#1890ff",
    opacity: 0.06
  },
  today: {
    show: true
  }
});

console.log("Demo7 Gantt1 (week/day, cellWidth=50) initialized:", gantt1);

// =============================================
// 第二个甘特图：8小时一格，展示更细粒度的 scaleUnit
// =============================================

const gantt2Container = document.getElementById("gantt2");
if (gantt2Container) {
  const gantt2 = new XGantt(gantt2Container, {
    data,
    table: {
      columns: [
        { field: "name", label: "任务名称", width: 180 }
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
    border: {
      show: true
    },
    primaryColor: "#722ed1",
    dateFormat: "YYYY-MM-DD HH:mm:ss",
    header: {
      color: "#fff",
      fontSize: 13
    },
    row: {
      height: 36,
      indent: 20
    },
    bar: {
      height: "50%",
      field: "name",
      color: "#fff",
      fontSize: 10,
      move: {
        enabled: true,
        byUnit: true
      },
      progress: {
        show: true
      }
    },

    // ★ 重点：三层表头 + 8 小时一格 + 自定义每层高度
    // cellWidth = 40 → 每 8 小时 40px
    // height 控制每层的行高，月30层在顶部显示月份
    // 第二层与第三层未指定，从 header.height 剩余空间平分
    scaleUnit: [
      {
        unit: "month",
        step: 1,
        format: "YYYY年MM月",
        height: 30
      },
      {
        unit: "day",
        step: 1,
        format: "MM-DD ddd"
      },
      {
        unit: "hour",
        step: 8,
        format: "HH:mm",
        cellWidth: 40
      }
    ],

    weekend: {
      show: true,
      backgroundColor: "#722ed1",
      opacity: 0.06
    },
    today: {
      show: true
    }
  });

  console.log("Demo7 Gantt2 (month/day/8h, cellWidth=40) initialized:", gantt2);
}
