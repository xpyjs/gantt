import { XGantt, dayjs } from "@xpyjs/gantt-core";
import "@xpyjs/gantt-core/style.css";
import "./demo6.css";
import { data, links, DATE_FMT, generateId, type TaskNode, type LinkRow } from './data';

document.body.innerHTML = `<div id="app">
  <div id="btn-group" style="margin-bottom: 8px;"></div>
  <div id="gantt-container"></div>
  <div id="footer-bar"></div>
</div>`;


const footer = document.getElementById('footer-bar');
// 状态信息
const updateFooterStatusInfo = () => {
  if (footer) {
    let status = document.getElementById('footer-status');
    if (!status) {
      status = document.createElement('div');
      status.id = 'footer-status';
      footer.appendChild(status);
    }
    status.innerText = '当前任务数: ' + (gantt as any)?.context.store.getDataManager().getVisibleSize() + ' 条任务';
  }
}
// 当前选择内容
const updateFooterSelection = () => {
  if (footer) {
    let selection = document.getElementById('footer-selection');
    if (!selection) {
      selection = document.createElement('div');
      selection.id = 'footer-selection';
      footer.appendChild(selection);
    }
    selection.innerText = '当前选择: ' + (selected ? selected.name : '无');
  }
}
// 当前勾选内容
const updateFooterChecked = () => {
  if (footer) {
    let checked = document.getElementById('footer-checked');
    if (!checked) {
      checked = document.createElement('div');
      checked.id = 'footer-checked';
      footer.appendChild(checked);
    }
    checked.innerText = '当前勾选: ' + (checkedList.length) + ' 条任务';
  }
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
      { field: "start", label: "开始时间", width: 120 },
      { field: "end", label: "结束时间", width: 120 },
      { field: "progress", label: "进度(%)", width: 90 }
    ]
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
  logLevel: 'info'
});

let selected: any = null;
let checkedList: any[] = [];

gantt.on("loaded", () => console.log("Gantt chart loaded", performance.now(), gantt));
gantt.on("error", (err, msg) => console.warn("Gantt error", err, msg));

// 新增连线事件（演示增量）
let dynamicLinkId = links.length + 1;
gantt.on("create:link", (link) => {
  const newLink = { ...link, id: `L${dynamicLinkId++}` } as any;
  links.push(newLink);
  console.log('create:link', newLink);
});
gantt.on("update:link", (link) => {
  const index = links.findIndex(l => l.id === (link as any).id);
  if (index > -1) {
    links.splice(index, 1, link as any);
    console.log('update:link', link);
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
    const btn1 = document.createElement('button');
    btn1.innerText = '跳转到今天';
    btn1.addEventListener('click', () => {
      gantt.jumpTo();
    });
    btnGroup.appendChild(btn1);
  }

  {
    const btn2 = document.createElement('button');
    btn2.innerText = '随机新增 1 条任务 (根级)';
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
    btnGroup.appendChild(btn2);
  }
}

// 初始化 footer
updateFooterStatusInfo();
updateFooterChecked();
updateFooterSelection();
