import { XGantt, type ILink } from "@xpyjs/gantt-core";
import "@xpyjs/gantt-core/style.css";

const wrapper: HTMLElement | null = document.querySelector('.gantt1-container');
if (wrapper) {
  wrapper.style.width = '100%';
}

// ============================================================
// Demo9: 单行多任务（split）
// ============================================================
// 展示内容:
//   1. split 任务：children 内联渲染为同一行的多个时间段
//      - 父任务 start/end 无需提供，由段极值自动派生（包络）
//      - 表格中 split 行不出现展开箭头
//   2. 普通父任务（未标记 split）保持树形展开语义，与 split 共存
//   3. 段与段之间、段与普通任务/里程碑之间的依赖线
//   4. 段级基线（baseline 指向段 id）
//   5. 段重叠策略 split.overlap: free / forbid / merge 运行时切换
//   6. split.enabled 运行时开关：关闭后退化为普通树形展开
const projectData = [
  {
    id: "p1",
    name: "装修施工",
    split: true, // 仅需一个真值标记，父级时间由段极值派生
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

// 依赖线：段与段之间、段与普通任务/里程碑之间均可连线
const links: ILink[] = [
  { id: "lk-1", from: "n1-c1", to: "p1-s1" },
  { id: "lk-2", from: "p1-s1", to: "p1-s2" },
  { id: "lk-3", from: "p1-s2", to: "p1-s3" },
  { id: "lk-4", from: "p1-s3", to: "m1" }
];

// 基线：taskId 指向段 id 时渲染段级基线
const baselineData = [
  { id: "bl-1", taskId: "p1-s2", startTime: "2026-08-01", endTime: "2026-08-06", name: "瓦工基线" },
  { id: "bl-2", taskId: "n1-c2", startTime: "2026-08-01", endTime: "2026-08-08", name: "采购基线" }
];

const gantt1Container = document.getElementById("gantt1");
if (gantt1Container) {
  const gantt = new XGantt(gantt1Container, {
    data: projectData,
    table: {
      columns: [
        { field: "name", label: "任务", width: 180 },
        { field: "start", label: "开始", width: 180 },
        { field: "end", label: "结束", width: 180 }
      ]
    },
    fields: {
      startTime: "start",
      endTime: "end",
      children: "children"
    },
    date: {
      endOf: 'end'
    },
    locale: "zh",

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
        single: { left: true, right: true }
      },
      progress: { show: true }
    },

    // 本次新增功能的核心配置
    split: {
      enabled: true,
      overlap: "free" // free: 任意交叠 | forbid: 边界夹取 | merge: 接触即合并
    },

    links: {
      data: links,
      show: true
    },

    baselines: {
      show: true,
      mode: "line",
      position: "bottom",
      data: baselineData
    },

    weekend: { show: true, days: [0, 6] },
    today: { show: true },
    milestone: { show: true, size: 10, color: "red" }
  });

  gantt.on("move", data => {
    console.log("[Demo9] move:", data);
  });

  // ============================================================
  // 撤销功能：基于 move / update:link / delete:link 事件的新旧数据实现
  // ============================================================
  // 连线变更统一走标准事件，不再有专用的 merge 事件：
  //   update:link (link, old) —— 拖拽连线端点、merge 合并段后重定向
  //   delete:link (link)      —— merge 合并段后自连/重复/成环被移除
  //   move ({ row, old }[])   —— 任务时间变化，段被合并移除时 row 指向保留段
  // merge 拖拽时连线事件先于 move 同步触发，随 move 合并为一步撤销；
  // 单独拖拽连线端点时没有 move 跟随，连线变更延后一步自行入栈
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
    console.log("[Demo9] update:link", { link, old });

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
    console.log("[Demo9] delete:link", { link });

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
    if (!op) {
      console.log("[Demo9] 没有可撤销的操作");
      return;
    }
    op();
    console.log(`[Demo9] 已撤销，剩余 ${undoStack.length} 步`);
  }

  // 调试钩子：浏览器内复现/验证 split 拖拽交互用
  (window as any).__demo9 = { gantt, projectData };

  if (wrapper) {
    // 切换段重叠策略：free → forbid → merge 循环
    const overlapBtn = document.createElement('button');
    overlapBtn.style = `width: 140px;margin-top: 12px;margin-right: 8px;`;
    let overlap: "free" | "forbid" | "merge" = "free";
    overlapBtn.innerText = `重叠策略: ${overlap}`;
    overlapBtn.addEventListener('click', () => {
      overlap = overlap === "free" ? "forbid" : overlap === "forbid" ? "merge" : "free";
      gantt.update({ split: { overlap } });
      overlapBtn.innerText = `重叠策略: ${overlap}`;
      console.log(`[Demo9] split.overlap = ${overlap}`);
    });
    wrapper.appendChild(overlapBtn);

    // 运行时开关 split：关闭后 split 任务退化为普通树形展开行
    const toggleBtn = document.createElement('button');
    toggleBtn.style = `width: 140px;margin-top: 12px;margin-right: 8px;`;
    let enabled = true;
    toggleBtn.innerText = `split: ${enabled ? "开" : "关"}`;
    toggleBtn.addEventListener('click', () => {
      enabled = !enabled;
      gantt.update({ split: { enabled } });
      toggleBtn.innerText = `split: ${enabled ? "开" : "关"}`;
      console.log(`[Demo9] split.enabled = ${enabled}`);
    });
    wrapper.appendChild(toggleBtn);

    // 撤销上一次拖拽（含 merge 合并与连线重定向）
    const undoBtn = document.createElement('button');
    undoBtn.style = `width: 140px;margin-top: 12px;margin-right: 8px;`;
    undoBtn.innerText = '撤销 (Ctrl+Z)';
    undoBtn.addEventListener('click', undo);
    wrapper.appendChild(undoBtn);

    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      }
    });

    // 打印当前数据：验证父级时间 = 段极值包络，数据 = 视图
    const printBtn = document.createElement('button');
    printBtn.style = `width: 140px;margin-top: 12px;`;
    printBtn.innerText = '打印数据';
    printBtn.addEventListener('click', () => {
      console.log("[Demo9] 当前数据:", projectData);
    });
    wrapper.appendChild(printBtn);
  }
}
