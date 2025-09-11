import { XGantt, dayjs } from "@xpyjs/gantt-core";
import "@xpyjs/gantt-core/style.css";
import "./demo6.css";
import { data, links, DATE_FMT, generateId } from './data';

document.body.innerHTML = `<div id="app">
  <div id="btn-group">
    <button id="btn-today">跳转到今天</button>
    <button id="btn-random-add-task">随机新增 1 条任务 (根级)</button>

    <div style="flex: 1; display: flex; align-items: center; justify-content: flex-end">
      <select id="select-primary-color" title="设置主题色">
        <option value="#e7209e" style="color: #e7209e" selected>默认色</option>
        <option value="#eca710" style="color: #eca710">黄色</option>
        <option value="#f5222d" style="color: #f5222d">红色</option>
        <option value="#52c41a" style="color: #52c41a">绿色</option>
        <option value="#1890ff" style="color: #1890ff">蓝色</option>
        <option value="#8a2be2" style="color: #8a2be2">紫色</option>
      </select>
    </div>
  </div>
  <div id="gantt-container"></div>
  <div id="footer-bar">
    <div id="footer-status"></div>
    <div id="footer-selection"></div>
    <div id="footer-checked"></div>
  </div>
</div>`;


const footer = document.getElementById('footer-bar');
// 状态信息
const updateFooterStatusInfo = () => {
  const status = footer!.querySelector('#footer-status') as HTMLElement;
  status.innerText = '当前任务数: ' + (gantt as any)?.context.store.getDataManager().getVisibleSize() + ' 条任务';
}
// 当前选择内容
const updateFooterSelection = () => {
  const selection = footer!.querySelector('#footer-selection') as HTMLElement;
  selection.innerText = '当前选择: ' + (selected ? selected.name : '无');
}
// 当前勾选内容
const updateFooterChecked = () => {
  const checked = footer!.querySelector('#footer-checked') as HTMLElement;
  checked.innerText = '当前勾选: ' + (checkedList.length) + ' 条任务';
}

const ganttContainer = document.getElementById("gantt-container");
if (!ganttContainer) throw new Error("Gantt container not found");

// =============================================
// 初始化 Gantt
// =============================================
const gantt = new XGantt(ganttContainer, {
  data,
  table: {
    columns: [
      { field: "name", label: "任务名称", width: 230, align: 'left' },
      { field: "start", label: "开始时间", width: 180 },
      { field: "end", label: "结束时间", width: 180 },
      { field: "progress", label: "进度(%)", width: 90 }
    ]
  },
  chart: {
    startTime: '2025-07-22',
    endTime: '2026-01-20',
  },
  fields: {
    id: 'id',
    startTime: "start",
    endTime: "end",
    name: 'name',
    progress: 'progress',
    children: "subtask",
    type: 'type'
  },
  expand: { show: true, enabled: true },
  selection: { enabled: true, includeSelf: true },
  border: { show: true },
  primaryColor: "#e7209e",
  dateFormat: DATE_FMT,
  header: { fontSize: 14 },
  row: { indent: 20, height: 34 },
  bar: {
    height: (row: any) => row.type === 'milestone' ? 12 : '42%',
    shadowBlur: 4,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffsetX: 1,
    shadowOffsetY: 1,
    field: "name",
    fontSize: 10,
    move: {
      enabled: true,
      lock: false,
      byUnit: true,
      single: { left: true, right: true },
      link: { child: "scale", parent: "expand" }
    },
    progress: {
      show: true,
      targetVal: 100,
      amount: 30,
      decimal: 0,
      fontSize: 10
    }
  },
  links: {
    data: links,
    show: true,
    create: { enabled: true, mode: 'hover', radius: 3, width: 2, from: true, to: true },
    move: { enabled: true },
    key: 'id',
    distance: 20,
    gap: 5,
    width: 0.2,
    dash: [0],
    arrow: { width: 6, height: 6 },
    radius: 3,
    enableCycleDetection: true
  },
  weekend: { show: true, backgroundColor: "#007acc", opacity: 0.05 },
  milestone: { show: true, shape: 'diamond', border: {} },
  summary: { show: true, move: { enabled: false }, mode: 'expand' },
  today: { show: true, type: 'line', backgroundColor: '#ff3366', opacity: 1, width: 1 },
  unit: 'day',
});

let selected: any = null;
let checkedList: any[] = [];

gantt.on("loaded", () => console.log("Gantt chart loaded", performance.now(), gantt));
gantt.on("error", (err, msg) => console.warn("Gantt error", err, msg));

// 新增连线事件（演示增量）
let dynamicLinkId = links.length + 1;
gantt.on("create:link", (link) => {
  const newLink = { ...link, id: `L${dynamicLinkId++}` };
  links.push(newLink);
});
gantt.on("update:link", (link) => {
  const index = links.findIndex(l => l.id === (link as any).id);
  if (index > -1) {
    links.splice(index, 1, link as any);
  }
});
gantt.on("click:row", (e, item) => {
  selected = item;
  updateFooterSelection();
});
gantt.on("select", (data, checked, all) => {
  checkedList = all;
  updateFooterChecked();
});
gantt.on("select:link", (link, checked, all) => {
  console.log('select:link', link, checked, all);
});

// 交互按钮
const btnGroup = document.getElementById('btn-group');
if (btnGroup) {
  {
    const btn1 = btnGroup.querySelector('#btn-today') as HTMLButtonElement;
    btn1.addEventListener('click', () => {
      gantt.jumpTo();
    });
  }

  {
    const btn2 = btnGroup.querySelector('#btn-random-add-task') as HTMLButtonElement;
    btn2.addEventListener('click', () => {
      const id = generateId();
      const newTask = {
        id,
        name: `新任务 ${id}`,
        start: dayjs().format(DATE_FMT),
        end: dayjs().add(1, 'day').format(DATE_FMT),
        progress: 0,
        subtask: []
      };
      data.push(newTask);
      gantt.update({ data });
      updateFooterStatusInfo();
    });
  }

  {
    const select = btnGroup.querySelector('#select-primary-color') as HTMLSelectElement;
    select.addEventListener('change', () => {
      const color = select.value;
      gantt.update({ primaryColor: color });
    });
  }
}

// 初始化 footer
updateFooterStatusInfo();
updateFooterChecked();
updateFooterSelection();
