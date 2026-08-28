import { XGantt, type ILink } from "@xpyjs/gantt-core";
import "@xpyjs/gantt-core/style.css";

const ganttContainer = document.getElementById("gantt-container");
if (!ganttContainer) {
  throw new Error("Gantt container not found");
}

// ============================================================
// 单行多任务（split / segment）
// ============================================================
// 数据中标记 split: true 的任务，其直接子级（段）将内联渲染在同一行：
//   1. 父任务无需提供 start/end，时间由所有段的极值自动派生（包络）
//   2. 表格中 split 行不出现展开箭头，展开配置对其无效
//   3. 未标记 split 的父任务保持普通树形展开语义，与 split 共存
const projectData = [
  {
    id: "p1",
    name: "装修施工",
    split: true,
    children: [
      { id: "p1-s1", name: "水电改造", start: "2026-07-20", end: "2026-07-25", progress: 100 },
      { id: "p1-s2", name: "瓦工进场", start: "2026-08-03", end: "2026-08-08", progress: 60 },
      { id: "p1-s3", name: "木工收尾", start: "2026-08-17", end: "2026-08-20", progress: 0 }
    ]
  },
  {
    id: "n1",
    name: "设计采购",
    start: "2026-07-20",
    end: "2026-08-10",
    children: [
      { id: "n1-c1", name: "方案设计", start: "2026-07-20", end: "2026-07-30", progress: 100 },
      { id: "n1-c2", name: "材料采购", start: "2026-08-01", end: "2026-08-10", progress: 40 }
    ]
  },
  { id: "m1", name: "竣工验收", start: "2026-08-20", end: "2026-08-20", type: "milestone" }
];

// 依赖线：段与段、段与普通任务之间均可连线
const links: ILink[] = [
  { id: "lk-1", from: "n1-c1", to: "p1-s1" },
  { id: "lk-2", from: "p1-s1", to: "p1-s2" },
  { id: "lk-3", from: "p1-s2", to: "p1-s3" },
  { id: "lk-4", from: "p1-s3", to: "m1" }
];

// 基线：taskId 指向段 id 时渲染段级基线
const baselines = [
  { id: "bl-1", taskId: "p1-s2", startTime: "2026-08-01", endTime: "2026-08-06", name: "瓦工基线" },
  { id: "bl-2", taskId: "n1-c2", startTime: "2026-08-01", endTime: "2026-08-08", name: "采购基线" }
];

const gantt = new XGantt(ganttContainer, {
  data: projectData,
  table: {
    columns: [
      { field: "name", label: "任务", width: 160 },
      { field: "start", label: "开始", width: 130 },
      { field: "end", label: "结束", width: 130 }
    ]
  },
  fields: {
    startTime: "start",
    endTime: "end",
    children: "children"
  },
  locale: "zh",
  row: { height: 34 },
  bar: {
    height: "60%",
    field: "name",
    color: "#fff",
    fontSize: 11,
    move: {
      enabled: true,
      byUnit: true,
      single: { left: true, right: true }
    },
    progress: { show: true }
  },

  // 核心配置：单行多任务
  split: {
    enabled: true,
    overlap: "merge" // free: 任意交叠 | forbid: 边界夹取 | merge: 接触即合并
  },

  links: { data: links, show: true },
  baselines: { show: true, mode: "line", position: "bottom", data: baselines },
  weekend: { show: true, days: [0, 6] },
  today: { show: true }
});

// ============================================================
// 撤销功能：基于 move / update:link / delete:link 事件的新旧数据实现
// ============================================================
// 连线变更统一走标准事件，携带变更前旧数据：
//   update:link (link, old) - 拖拽连线端点、merge 合并段后连线重定向
//   delete:link (link)      - merge 合并段后自连/重复/成环被移除
//   move ({ row, old }[])   - 任务时间变化
// merge 拖拽时连线事件先于 move 同步触发，两者合并为一步撤销；
// 单独拖拽连线端点时没有 move 跟随，连线变更延后自行入栈
const undoStack: Array<() => void> = [];
let pendingLinkUndo: Array<() => void> = [];
let pendingFlushTimer: number | null = null;

const takePendingLinkUndo = (): Array<() => void> => {
  if (pendingFlushTimer !== null) {
    clearTimeout(pendingFlushTimer);
    pendingFlushTimer = null;
  }
  const linkUndo = pendingLinkUndo;
  pendingLinkUndo = [];
  return linkUndo;
};

const queueLinkUndo = (undo: () => void) => {
  pendingLinkUndo.push(undo);
  if (pendingFlushTimer !== null) clearTimeout(pendingFlushTimer);
  pendingFlushTimer = window.setTimeout(() => {
    const linkUndo = takePendingLinkUndo();
    if (linkUndo.length > 0) {
      undoStack.push(() => linkUndo.forEach(fn => fn()));
    }
  }, 0);
};

gantt.on("update:link", (link, old) => {
  // 同步外部数据源：用新连线替换旧连线
  const idx = links.findIndex(l => l.id === old.id);
  if (idx > -1) links[idx] = link;
  else links.push(link);

  // 撤销：恢复为旧连线
  queueLinkUndo(() => {
    const i = links.findIndex(l => l.id === link.id);
    if (i > -1) links.splice(i, 1, old);
  });
});

gantt.on("delete:link", link => {
  // 同步外部数据源：移除被删连线
  const idx = links.findIndex(l => l.id === link.id);
  if (idx > -1) links.splice(idx, 1);

  // 撤销：重新插回被删除的连线
  queueLinkUndo(() => {
    if (!links.some(l => l.id === link.id)) links.push(link);
  });
});

gantt.on("move", entries => {
  // merge 拖拽中先到的连线变更，与本次移动合并为一步撤销
  const linkUndo = takePendingLinkUndo();

  undoStack.push(() => {
    // 1. 连线恢复到变更前
    linkUndo.forEach(fn => fn());

    // 2. 任务恢复到拖拽前
    entries.forEach(({ row, old }) => {
      if (!old) return;
      if (row && row.id === old.id) {
        // 普通移动 / 未被合并的段：直接恢复旧时间
        row.start = old.start;
        row.end = old.end;
      } else {
        // 段被 merge 合并移除：old 为被移除段旧数据，
        // 重新插入其父级 children（row 为保留段数据）
        const parent = projectData.find(
          p =>
            Array.isArray(p.children) &&
            p.children.some(c => c.id === row?.id)
        );
        const siblings = parent?.children;
        if (parent && Array.isArray(siblings)) {
          const seg = { ...old };
          const idx = siblings.findIndex(
            c => c.start && seg.start && c.start > seg.start
          );
          if (idx === -1) siblings.push(seg);
          else siblings.splice(idx, 0, seg);
        }
      }
    });

    gantt.update({ data: projectData, links: { data: links } });
  });

  if (undoStack.length > 50) undoStack.shift();
});

function undo(): void {
  const op = undoStack.pop();
  if (!op) return;
  op();
}

// ============================================================
// 控制按钮：开关 segment / 切换重叠策略 / 撤销
// ============================================================
const btnContainer = document.getElementById("btn-container");
if (btnContainer) {
  // 运行时开关：关闭后 split 任务退化为普通树形展开行
  const toggleBtn = document.createElement("button");
  let enabled = true;
  toggleBtn.textContent = `split: ${enabled ? "开" : "关"}`;
  toggleBtn.addEventListener("click", () => {
    enabled = !enabled;
    gantt.update({ split: { enabled } });
    toggleBtn.textContent = `split: ${enabled ? "开" : "关"}`;
  });
  btnContainer.appendChild(toggleBtn);

  // 切换段重叠策略：free → forbid → merge 循环
  const overlapBtn = document.createElement("button");
  let overlap: "free" | "forbid" | "merge" = "merge";
  overlapBtn.textContent = `重叠策略: ${overlap}`;
  overlapBtn.addEventListener("click", () => {
    overlap = overlap === "free" ? "forbid" : overlap === "forbid" ? "merge" : "free";
    gantt.update({ split: { overlap } });
    overlapBtn.textContent = `重叠策略: ${overlap}`;
  });
  btnContainer.appendChild(overlapBtn);

  // 撤销上一次拖拽（含 merge 合并与连线重定向）
  const undoBtn = document.createElement("button");
  undoBtn.textContent = "撤销 (Ctrl+Z)";
  undoBtn.addEventListener("click", undo);
  btnContainer.appendChild(undoBtn);

  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      undo();
    }
  });

  // 打印当前数据：验证父级时间 = 段极值包络，数据 = 视图
  const printBtn = document.createElement("button");
  printBtn.textContent = "打印数据";
  printBtn.addEventListener("click", () => {
    console.log("[split demo] 当前数据:", projectData);
  });
  btnContainer.appendChild(printBtn);
}
