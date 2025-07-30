import { XGantt, IOptions, ILink } from "@xpyjs/gantt-core";
import "@xpyjs/gantt-core/style.css";

const ganttContainer = document.getElementById("gantt1");
if (!ganttContainer) {
  throw new Error("Gantt container not found");
}

ganttContainer.innerHTML = "";

// 设置容器样式
ganttContainer.style.cssText = `
  width: 100%;
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// 工具栏
const toolbar = document.createElement("div");
toolbar.style.cssText = `
  display: flex;
  align-items: center;
  padding: 8px;
  background: #f0f0f0;
  box-sizing: border-box;
  border-bottom: 1px solid #d9d9d9;
`;

// 创建甘特图容器
const ganttChart = document.createElement("div");
ganttChart.style.cssText = `
  flex: 1;
  position: relative;
`;

// 将工具栏和甘特图容器添加到主容器
ganttContainer.appendChild(toolbar);
ganttContainer.appendChild(ganttChart);

// 创建一个 toast
const toast = (message: string) => {
  const toastEl = document.createElement("div");
  toastEl.innerText = message;
  toastEl.style.cssText = `
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px 16px;
    border-radius: 4px;
    z-index: 999999;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
  `;
  document.body.appendChild(toastEl);

  // 淡入效果
  setTimeout(() => {
    toastEl.style.opacity = "1";
  }, 10);

  // 淡出效果
  setTimeout(() => {
    toastEl.style.opacity = "0";
  }, 2500);

  // 移除元素
  setTimeout(() => {
    if (document.body.contains(toastEl)) {
      document.body.removeChild(toastEl);
    }
  }, 3000);
};
const createButton = (label: string, onClick: () => void) => {
  const button = document.createElement("button");
  button.textContent = label;
  button.style.cssText = `
      margin-right: 8px;
      padding: 4px 8px;
      background: #1890ff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    `;
  button.addEventListener("click", e => {
    e.stopPropagation();
    onClick();
  });
  button.addEventListener("mouseenter", () => {
    button.style.backgroundColor = "#40a9ff";
  });
  button.addEventListener("mouseleave", () => {
    button.style.backgroundColor = "#1890ff";
  });
  return button;
};
const createSelect = (
  options: { value: any; label: string }[],
  onChange: (value: string) => void
) => {
  const select = document.createElement("select");
  select.style.cssText = `
      margin-right: 8px;
      padding: 4px 8px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      background: white;
      cursor: pointer;
    `;
  options.forEach(option => {
    const opt = document.createElement("option");
    opt.value = option.value;
    opt.textContent = option.label;
    select.appendChild(opt);
  });
  select.addEventListener("change", e => {
    const value = (e.target as HTMLSelectElement).value;
    onChange(value);
  });
  return select;
};

const ganttData: IOptions["data"] = [
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
  },
];

function updateData(data: any) {
  // 递归查找并更新数据，支持多层级结构
  function findAndUpdate(items: any[], targetData: any): boolean {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // 如果找到匹配的项，进行更新
      if (item.id === targetData.id) {
        items[i] = { ...item, ...targetData };
        return true;
      }

      // 如果当前项有子项，递归查找
      if (item.children && Array.isArray(item.children)) {
        const found = findAndUpdate(item.children, targetData);
        if (found) return true;
      }
    }
    return false;
  }

  return findAndUpdate(ganttData!, data);
}

function deleteTaskById(id: string): boolean {
  function findAndDelete(items: any[], id: string): boolean {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // 如果找到匹配的项，删掉它
      if (item.id === id) {
        items.splice(i, 1);
        return true;
      }

      // 如果当前项有子项，递归查找
      if (item.children && Array.isArray(item.children)) {
        const found = findAndDelete(item.children, id);
        if (found) return true;
      }
    }
    return false;
  }

  return findAndDelete(ganttData!, id);
}

let links: ILink[] = [
  { id: 1, from: "1-1", to: "2-1", color: "#eca710" },
  { id: 2, from: "2-1", to: "2-2", color: "#00bfff", width: 5, dash: [5, 0] }
];

// 创建筛选器组件
function createFilterHeader() {
  const filterType = new Set(ganttData?.map(item => item.name) || []);
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
  const options = ganttData?.map(item => item.name) || [];
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
          gantt.update({ data: ganttData });
        } else {
          gantt.update({
            data: ganttData?.filter(item => {
              return filterType.has(item.name);
            })
          });
        }
      }
    });

    dropdown.appendChild(optionEl);
  });

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

const ganttOptions: IOptions = {
  logLevel: "debug",
  data: ganttData,
  locale: "zh",
  table: {
    columns: [
      {
        field: "name",
        label: "任务名称",
        width: 150,
        align: "left",
        merge: (value, data, colIndex, level) => {
          if (level === 1) {
            return { col: 4, row: 1 };
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
                  <div style="width: ${p}; height: 100%; background: var(--x-gantt-primary-color); border-radius: 4px;"></div>
                </div>`;
        }
      }
    ]
  },
  chart: {
    headerGroupFormat: 'MM月 (YYYY年)'
  },
  bar: {
    show: row => {
      return row.data.type !== 's'
    },
    move: {
      enabled: row => row.level > 1,
      byUnit: true,
      single: {
        left: true,
        right: true,
        backgroundColor: '#1890ff',
        opacity: 0.2,
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="#f0f0f0" d="M7 0h2v16H7zM3 5L0 8l3 3V9h3V7H3zm13 3l-3-3v2h-3v2h3v2z"/></svg>'
      },
      link: {
        child: "scale",
        parent: "expand"
      }
    },
    progress: {
      show: row => row.level > 1,
      textAlign: "top"
    },
    height: (row) => row.level === 1 ? '20%' : "40%",
    backgroundColor: row => {
      if (row.level === 1) {
        return "#1890ff";
      } else if (row.$index % 2 === 0) {
        return "#52c41a";
      }
      return "#f5222d";
    },
    radius: row => row.level === 1 ? 0 : 6,
    shadowBlur: 2,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffsetX: 0,
    shadowOffsetY: 2
  },
  links: {
    show: true,
    data: links,
    create: {
      enabled: true,
      mode: "hover",
      from: row => row.level > 1,
      to: (row, from) => {
        return from.level === row.level;
      }
    },
    gap: 10
  },
  scrollbar: {
    track: {
      color: "rgba(0, 0, 0, 0.1)"
    }
  }
};

const gantt = new XGantt(ganttChart, ganttOptions);
gantt.on("loaded", () => {
  toast("甘特图加载完成！");
});

gantt.on("error", error => {
  switch (error) {
    case "LINK_SAME":
      toast("链接不允许连接到自身");
      break;
    case "LINK_NOT_ALLOWED":
      toast("链接不被允许");
      break;
    case "LINK_EXIST":
      toast("链接已存在");
      break;
    default:
      console.error("An error occurred:", error);
  }
});

gantt.on("create:link", (link: ILink) => {
  const newLink = {
    id: performance.now(),
    ...link
  };
  // 创建一个对话框，用于选择一些颜色，供用户选择
  const colorDialog = document.createElement("div");
  colorDialog.style.position = "absolute";
  colorDialog.style.top = "50%";
  colorDialog.style.left = "50%";
  colorDialog.style.transform = "translate(-50%, -50%)";
  colorDialog.style.background = "white";
  colorDialog.style.padding = "16px";
  colorDialog.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
  colorDialog.innerHTML = `
  <h4>选择链接颜色</h4>
  `;
  colorDialog.appendChild(
    createSelect(
      [
        { value: "#eca710", label: "黄色" },
        { value: "#1890ff", label: "蓝色" },
        { value: "#52c41a", label: "绿色" },
        { value: "#f5222d", label: "红色" }
      ],
      value => {
        newLink.color = value;
      }
    )
  );
  colorDialog.appendChild(
    createButton("确定", () => {
      links.push(newLink);
      gantt.update({ links: { data: links } });
      document.body.removeChild(colorDialog);

      toast(`创建了一条关连线: ${newLink.from} > ${newLink.to}`);
    })
  );
  const cancelBtn = createButton("取消", () => {
    document.body.removeChild(colorDialog);
    toast("取消了创建");
  });
  colorDialog.appendChild(cancelBtn);
  document.body.appendChild(colorDialog);
});
gantt.on("update:link", link => {
  const index = links.findIndex(l => l.id === link.id);
  if (index !== -1) {
    links.splice(index, 1, link);
    gantt.update({ links: { data: links } });
    toast(`更新了关连线: ${link.from} > ${link.to}`);
  }
});

gantt.on("contextmenu:slider", (e, data) => {
  // 创建一个右键菜单，里面是一个菜单列表，分别是：
  // - 编辑任务：功能是打开一个对话框，允许用户编辑当前任务的名称、开始时间、结束时间
  // - 标记为完成：功能是将当前数据的 progress 置为 100%
  // - 删除任务：功能是将当前数据从 gantt.data 中删除
  e.preventDefault();
  const menu = document.createElement("div");
  menu.style.position = "absolute";
  menu.style.top = `${e.clientY}px`;
  menu.style.left = `${e.clientX}px`;
  menu.style.background = "white";
  menu.style.border = "1px solid #d9d9d9";
  menu.style.padding = "8px";
  menu.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
  menu.innerHTML = `
  <div style="padding: 4px; cursor: pointer;">编辑任务</div>
  <div style="padding: 4px; cursor: pointer;">标记为完成</div>
  <div style="padding: 4px; cursor: pointer;">删除任务</div>
  `;

  document.addEventListener("click", () => {
    document.body.removeChild(menu);
  });
  document.addEventListener(
    "contextmenu",
    () => {
      document.body.removeChild(menu);
    },
    { capture: true }
  );

  menu.querySelectorAll("div").forEach((item, index) => {
    item.addEventListener("click", e => {
      e.stopPropagation();
      document.body.removeChild(menu);
      switch (index) {
        case 0: // 编辑任务
          const dialog = document.createElement("div");
          dialog.style.cssText = `
            position: absolute;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 16px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            z-index: 999999;
          `;
          dialog.innerHTML = `
            <h4>编辑任务</h4>
            <label>任务名称:</label>
            <input type="text" id="task-name" value="${data.name}" />
            <label>开始时间:</label>
            <input type="text" id="task-start" value="${data.startTime}" />
            <label>结束时间:</label>
            <input type="text" id="task-end" value="${data.endTime}" />
          `;
          const confirmBtn = createButton("确定", () => {
            data.name = (
              document.getElementById("task-name") as HTMLInputElement
            ).value;
            data.startTime = (
              document.getElementById("task-start") as HTMLInputElement
            ).value;
            data.endTime = (
              document.getElementById("task-end") as HTMLInputElement
            ).value;

            const isUpdate = updateData(data);
            if (isUpdate) {
              gantt.update({ data: ganttData });
              toast(`任务 "${data.name || data.id}" 已更新`);
            } else {
              console.warn(`未找到 ID 为 ${data.id} 的任务`);
              toast(`未找到要更新的任务 ${data.name || data.id}`);
            }
            document.body.removeChild(dialog);
          });
          dialog.appendChild(confirmBtn);
          const cancelBtn = createButton("取消", () => {
            document.body.removeChild(dialog);
          });
          dialog.appendChild(cancelBtn);
          document.body.appendChild(dialog);
          break;
        case 1: // 标记为完成
          data.progress = 100;
          data.type = 's';
          updateData(data);
          gantt.update({ data: ganttData });
          toast(`标记任务 "${data.name}" 为完成`);
          break;
        case 2: // 删除任务
          const deleted = deleteTaskById(data.id);
          if (deleted) {
            gantt.update({ data: ganttData });
            toast(`删除了任务 "${data.name}"`);
          } else {
            toast(`未找到要删除的任务 "${data.name}"`);
          }
          break;
      }
    });
  });
  document.body.appendChild(menu);
});

// 添加具体的工具
{
  // 切换颜色
  {
    const colorSelect = createSelect(
      [
        { value: "#eca710", label: "黄色" },
        { value: "#1890ff", label: "蓝色" },
        { value: "#52c41a", label: "绿色" },
        { value: "#f5222d", label: "红色" }
      ],
      value => {
        gantt.update({ primaryColor: value });
      }
    );
    toolbar.appendChild(colorSelect);
  }

  // 切换表格列
  {
    let mode = 0;
    const btn = createButton("详细表格", () => {
      if (mode % 2 === 0) {
        gantt.update({
          table: {
            columns: [
              ganttOptions.table!.columns![0],
              {
                label: "时间",
                children: [
                  { field: "startTime", label: "开始时间", width: 120 },
                  { field: "endTime", label: "结束时间", width: 120 }
                ]
              },
              ganttOptions.table!.columns![1]
            ]
          }
        });
        btn.textContent = "详细表格";
      } else {
        gantt.update({
          table: {
            columns: ganttOptions.table?.columns
          }
        });
        btn.textContent = "精简表格";
      }

      mode++;
    });
    toolbar.appendChild(btn);
  }

  // 删除关连线
  {
    let select: ILink[] = [];
    gantt.on("select:link", (add, cancel, all) => {
      select = all;
      if (select.length === 0) {
        btn.textContent = "删除关连线";
      } else {
        btn.textContent = `删除关连线(当前选中${select.length}条)`;
      }
    });
    const btn = createButton("删除关连线", () => {
      links = links.filter(l => !select.includes(l));
      gantt.update({ links: { data: links } });
      toast(`删除了 ${select.length} 条关连线`);
      select = [];
      btn.textContent = "删除关连线";
    });
    toolbar.appendChild(btn);
  }

  // 创建任务
  {
    const btn = createButton("创建任务", () => {
      // 打开对话框
      const dialog = document.createElement("div");
      dialog.style.cssText = `
        position: absolute;
        top: 20%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        z-index: 999999;
      `;
      document.body.appendChild(dialog);
      const title = document.createElement("h4");
      title.textContent = "创建任务";
      dialog.appendChild(title);

      let level = 1; // 默认一级任务
      let selectItem: string = "";
      const content = document.createElement("div");
      content.innerHTML = `
        <label>任务层级:</label>
        <select id="task-level">
          <option value="1">一级任务</option>
          <option value="2">二级任务</option>
        </select>
        <div style="margin: 12px 0" id="task-level-container"></div>
        <label>任务名称:</label>
        <input type="text" id="task-name" />
        <label>开始时间:</label>
        <input type="text" id="task-start" />
        <label>结束时间:</label>
        <input type="text" id="task-end" />
        <div style="margin-top: 30px" />
      `;
      dialog.appendChild(content);

      const addParentSelector = () => {
        const levelContainer = document.getElementById(
          "task-level-container"
        ) as HTMLDivElement;
        levelContainer.innerHTML = ""; // 清空内容
        if (level === 2) {
          const select = createSelect(
            ganttData.map(item => ({
              value: item.id,
              label: item.name
            })),
            value => {
              selectItem = value;
            }
          );
          select.id = "task-parent";
          levelContainer.innerHTML = "<label>选择一级任务:</label> ";
          levelContainer.appendChild(select);
        }
      };

      // 初始执行一次
      addParentSelector();

      // 监听层级变化
      const levelSelect = document.getElementById(
        "task-level"
      ) as HTMLSelectElement;
      levelSelect.addEventListener("change", () => {
        level = parseInt(levelSelect.value);
        addParentSelector();
      });

      const confirmBtn = createButton("确定", () => {
        // 获取输入值
        const name = (document.getElementById("task-name") as HTMLInputElement)
          .value;
        const startTime = (
          document.getElementById("task-start") as HTMLInputElement
        ).value;
        const endTime = (
          document.getElementById("task-end") as HTMLInputElement
        ).value;

        if (!name) {
          toast("请输入名称");
          document.getElementById("task-name")?.focus();
          return;
        }

        if (level === 2 && !selectItem) {
          toast("创建二级任务需要选择一个一级任务");
          return;
        }

        // 创建任务
        const newTask = {
          id: Date.now().toString(),
          name,
          startTime,
          endTime
        };

        if (level === 1) {
          ganttData.push(newTask);
        } else {
          const parentTask = ganttData.find(item => item.id === selectItem);
          if (parentTask) {
            parentTask.children = parentTask.children || [];
            parentTask.children.push(newTask);
          }
        }

        gantt.update({ data: ganttData });
        document.body.removeChild(dialog);
      });
      dialog.appendChild(confirmBtn);

      const cancelBtn = createButton("取消", () => {
        document.body.removeChild(dialog);
      });
      dialog.appendChild(cancelBtn);
    });
    toolbar.appendChild(btn);
  }
}
