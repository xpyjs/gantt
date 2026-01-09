import { XGantt } from "@xpyjs/gantt-core";
import "@xpyjs/gantt-core/style.css";

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
        startTime: "2025-01-16",
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

const filterType = new Set(["项目规划", "开发阶段", "测试阶段"]);
// 下拉面板
const dropdown = document.createElement("div");
dropdown.style.cssText = `
    position: fixed;
    min-width: 180px;
    background: white;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 999999;
    display: none;
    padding: 8px;
    margin-top: 4px;
    transform: translateX(30%);
  `;

// 创建选项列表
const options = ["项目规划", "开发阶段", "测试阶段"];
options.forEach(option => {
  const optionEl = document.createElement("div");
  optionEl.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    `;

  optionEl.innerHTML = `
      <input type="checkbox" id="filter-${option}" ${
    filterType.has(option) ? "checked" : ""
  } style="margin: 0;">
      <label for="filter-${option}" style="cursor: pointer; user-select: none; flex: 1;">${option}</label>
    `;

  // 鼠标悬停效果
  optionEl.addEventListener("mouseenter", () => {
    optionEl.style.backgroundColor = "#f5f5f5";
  });
  optionEl.addEventListener("mouseleave", () => {
    optionEl.style.backgroundColor = "";
  });

  // 点击事件
  optionEl.addEventListener("click", e => {
    e.stopPropagation();
    const checkbox = optionEl.querySelector("input") as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
      // 更新筛选状态
      const isChecked = checkbox.checked;
      if (isChecked) {
        // 添加到筛选类型
        filterType.add(option);
      } else {
        // 从筛选类型中移除
        filterType.delete(option);
      }

      // 更新甘特图数据
      if (filterType.size === 0) {
        // 如果没有选中任何类型，显示所有数据
        gantt.update({ data });
      } else {
        gantt.update({
          data: data.filter(item => {
            return filterType.has(item.name);
          })
        });
      }
    }
  });

  dropdown.appendChild(optionEl);
});

// 创建筛选器组件
function createFilterHeader() {
  // 标题和下拉按钮
  const header = document.createElement("div");
  header.style.cssText = `
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    user-select: none;
  `;
  header.innerHTML = `
    <span>任务名称</span>
    <svg width="16" height="16" viewBox="0 0 16 16" style="transition: transform 0.2s">
      <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
    </svg>
  `;

  // 点击头部切换下拉面板
  header.addEventListener("click", e => {
    e.stopPropagation();

    dropdown.style.top = header.getBoundingClientRect().bottom + "px";
    dropdown.style.left = header.getBoundingClientRect().left + "px";

    const isVisible = dropdown.style.display === "block";
    dropdown.style.display = isVisible ? "none" : "block";

    // 旋转箭头
    const arrow = header.querySelector("svg");
    if (arrow) {
      arrow.style.transform = isVisible ? "rotate(0deg)" : "rotate(180deg)";
    }
  });

  // 点击外部关闭下拉面板
  document.addEventListener("click", () => {
    dropdown.style.display = "none";
    const arrow = header.querySelector("svg");
    if (arrow) {
      arrow.style.transform = "rotate(0deg)";
    }
  });
  document.addEventListener("scroll", () => {
    dropdown.style.top = header.getBoundingClientRect().bottom + "px";
    dropdown.style.left = header.getBoundingClientRect().left + "px";
  });

  document.body.appendChild(dropdown);
  return header;
}

const ganttContainer = document.getElementById("gantt-container");
if (!ganttContainer) {
  throw new Error("Gantt container not found");
}

const gantt = new XGantt(ganttContainer, {
  width: 800,
  height: 400,
  data,
  table: {
    columns: [
      {
        field: "name",
        label: "任务名称",
        width: 150,
        align: "left",
        merge: (value, data, colIndex, level) => {
          if (level === 1) {
            return { col: 2, row: 1 };
          }
        },
        render: row => {
          // 自定义渲染函数
          if (row.level === 1) {
            const cell = document.createElement("div");
            cell.innerHTML = `<span style="color: ${
              row.data.progress > 50 ? "green" : "red"
            }">${row.data.name}</span>`;
            return cell;
          } else {
            return row.data.name;
          }
        },
        // 自定义表头渲染函数
        headerRender: createFilterHeader
      },
      {
        field: "progress",
        label: "进度",
        width: 100,
        render: row => {
          const p = `${row.data.progress || 0}%`;
          return `<div style="width: 100%; height: 10px; background: #f0f0f0; border-radius: 4px;">
                  <div style="width: ${p}; height: 100%; background: #1890ff; border-radius: 4px;"></div>
                </div>`;
        }
      }
    ]
  }
});
