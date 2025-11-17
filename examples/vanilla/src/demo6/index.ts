import { XGantt, dayjs } from "@xpyjs/gantt-core";
import "@xpyjs/gantt-core/style.css";
import "./demo6.css";
import { data, links, baselines, DATE_FMT, generateId } from './data';

document.body.innerHTML = `<div id="app">
  <div id="btn-group">
    <button id="get-instance">获取实例</button>
    <button id="btn-today">跳转到今天</button>
    <button id="btn-open-create-dialog">创建任务</button>
    <button id="btn-open-create-child-dialog" disabled>创建子任务</button>
    <button id="btn-open-edit-dialog" disabled>编辑所选任务</button>

    <div style="flex: 1; display: flex; align-items: center; justify-content: flex-end; gap: 16px;">
      <div class="multi-panel-wrapper">
        <button id="baseline-multi-btn" class="multi-btn" aria-haspopup="listbox" aria-expanded="false">基线</button>
        <div id="baseline-multi-panel" class="multi-panel" role="listbox" aria-multiselectable="true" hidden>
          <div class="option" role="option" data-value="show-baseline" aria-selected="false">
            <label><input type="checkbox" checked id="chk-show-baseline">显示基线</label>
          </div>
          <div class="option" role="option" data-value="show-compare" aria-selected="false">
            <label><input type="checkbox" checked id="chk-show-compare">显示对比</label>
          </div>
          <div class="option" role="option" data-value="show-indicator" aria-selected="false">
            <label><input type="checkbox" checked id="chk-show-indicator">显示指示器</label>
          </div>
        </div>
      </div>
      <div class="checkbox">
        <input type="checkbox" id="chk-show-holiday" checked>显示假期</checkbox>
      </div>
      <div class="checkbox">
        <input type="checkbox" id="chk-show-weekend" checked>显示周末</checkbox>
      </div>
      <select id="select-locale" title="设置语言">
        <option value="zh" selected>中文</option>
        <option value="en">英文</option>
      </select>
      <select id="select-unit" title="设置单位">
        <option value="day" selected>日视图</option>
        <option value="week">周视图</option>
        <option value="month">月视图</option>
        <option value="quarter">季度视图</option>
        <option value="hour">小时视图</option>
      </select>
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

    <div style="flex: 1; display: flex; align-items: center; justify-content: flex-end; gap: 16px;">
      <span style="color: #999">演示版本 v0.0.1</span>
      <span style="color: #999" id="footer-time">北京时间：${dayjs().format(DATE_FMT)}</span>
    </div>
  </div>
</div>
<div id="tooltip" aria-live="polite" aria-atomic="false"></div>
`;

const footer = document.getElementById('footer-bar');
const updateFooterStatusInfo = () => {
  const status = footer!.querySelector('#footer-status') as HTMLElement;
  status.innerText = '当前任务数: ' + (gantt as any)?.context.store.getDataManager().getVisibleSize() + ' 条任务';
};
const updateFooterSelection = () => {
  const selection = footer!.querySelector('#footer-selection') as HTMLElement;
  selection.innerText = '当前选择: ' + (selected ? selected.name : '无');
};
const updateFooterChecked = () => {
  const checked = footer!.querySelector('#footer-checked') as HTMLElement;
  checked.innerText = '当前勾选: ' + (checkedList.length) + ' 条任务';
};
(() => {
  const time = footer!.querySelector('#footer-time') as HTMLElement;
  setInterval(() => {
    time.innerText = '北京时间：' + dayjs().format(DATE_FMT);
  }, 1000);
})()

const ganttContainer = document.getElementById("gantt-container");
if (!ganttContainer) throw new Error("Gantt container not found");

// 初始化甘特
const gantt = new XGantt(ganttContainer, {
  data,
  table: {
    columns: [
      { field: "name", label: "任务名称", width: 230 },
      { field: "index", label: "索引", width: 60, render(row) {
        return `${row.$index}`
      }, },
      { field: "start", label: "开始时间", width: 120 },
      { field: "end", label: "结束时间", width: 120 },
      { field: "progress", label: "进度(%)", width: 90, align: 'center' }
    ]
  },
  chart: {
    // startTime: '2025-07-22',
    // endTime: '2026-01-20',
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
  drag: { enabled: true },
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
  milestone: { show: true, shape: 'diamond' },
  summary: { show: true, move: { enabled: false }, mode: 'expand' },
  baselines: {
    show: true,
    data: baselines,
    mode: 'line',
    position: 'bottom',
    height: 6,
    backgroundColor: '#007acc',
    compare: {
      enabled: true,
      ahead: {
        backgroundColor: '#52c41a',
      },
      delayed: {
        backgroundColor: '#ff4d4f',
      },
      indicator: {
        show: true,
        ahead: {
          opacity: 0.5,
          text: (diff, row) => `领先 ${diff.toFixed(1)} 天`
        },
        delayed: {
          text: (diff, row) => {
            return `超期 ${-diff.toFixed(1)} 天`;
          }
        },
      }
    }
  },
  today: { show: true, type: 'line', backgroundColor: '#ff3366', opacity: 1, width: 1 },
  unit: 'day',
  locale: 'zh',
  holiday: {
    show: true,
    holidays: [
      {
        date: '2025-09-03',
        text: {
          show: true,
          content: '抗日战争胜利纪念日',
          backgroundColor: '#f5222dcc',
        },
        pattern: 'custom',
        opacity: 0.2,
        patternOptions: {
          image: 'https://picsum.photos/id/383/50',
        }
      }
    ]
  }
});

let selected: any = null;
let checkedList: any[] = [];

// 提示系统
type NotifyType = 'info' | 'success' | 'warning' | 'error';
interface NotifyOptions { duration?: number; closable?: boolean; id?: string; }
const tooltipHost = document.getElementById('tooltip')!;
function notify(type: NotifyType, message: string, options: NotifyOptions = {}) {
  const { duration = 3200, closable = true } = options;
  const el = document.createElement('div');
  el.className = `tooltip-item tooltip-${type}`;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  el.innerHTML = `
    <div class="tooltip-content">${escapeHTML(message)}</div>
    ${closable ? '<button class="tooltip-close" aria-label="关闭">×</button>' : ''}
    <div class="tooltip-progress"></div>
  `;
  tooltipHost.appendChild(el);
  let removed = false;
  const remove = () => {
    if (removed) return;
    removed = true;
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 180);
  };
  if (closable) el.querySelector<HTMLButtonElement>('.tooltip-close')?.addEventListener('click', remove);
  if (duration > 0) {
    (el.querySelector('.tooltip-progress') as HTMLElement).style.animationDuration = `${duration}ms`;
    setTimeout(remove, duration);
  }
  return remove;
}
function escapeHTML(str: string) {
  return str.replace(/[&<>"']/g, s => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[s] as string));
}

gantt.on("loaded", () => { });
gantt.on("error", (err, msg) => {
  console.warn("Gantt error", err, msg);
});

// 连线增量
let dynamicLinkId = links.length + 1;
gantt.on("create:link", (link) => {
  const newLink = { ...link, id: `L${dynamicLinkId++}` };
  links.push(newLink);
  notify('success', '已创建依赖关系');
});
gantt.on("update:link", (link) => {
  const index = links.findIndex(l => l.id === (link as any).id);
  if (index > -1) {
    links.splice(index, 1, link as any);
    notify('info', '已更新依赖关系');
  }
});
gantt.on("click:row", (_e, item, time) => {
  selected = item;
  updateFooterSelection();
  updateActionBtnState();
});
gantt.on("select", (_data, _checked, all) => {
  checkedList = all;
  updateFooterChecked();
});

// 查找任务
function findTaskById(id: string | number, list = data): any | null {
  for (const t of list) {
    if (t.id === id) return t;
    if (Array.isArray(t.subtask) && t.subtask.length) {
      const r = findTaskById(id, t.subtask);
      if (r) return r;
    }
  }
  return null;
}

// 任务对话框
interface TaskFormValues {
  name: string;
  start: string;
  end: string;
  progress: number;
  type: 'task' | 'milestone';
}
type DialogMode = 'create' | 'edit' | 'createChild';

const taskDialog = (() => {
  const overlay = document.createElement('div');
  overlay.id = 'task-dialog-overlay';
  overlay.className = 'task-dialog-overlay';
  overlay.style.display = 'none';

  const panel = document.createElement('div');
  panel.className = 'task-dialog-panel';
  panel.innerHTML = `
    <h3 class="task-dialog-title"></h3>
    <form id="task-form" autocomplete="off" novalidate>
      <div class="task-dialog-fields">
        <label class="field">
          <span class="field-label">名称</span>
          <input name="name" type="text" maxlength="120" required />
        </label>
        <div class="field-row">
          <label class="field">
            <span class="field-label">开始时间</span>
            <input name="start" type="date" required />
          </label>
          <label class="field">
            <span class="field-label">结束时间</span>
            <input name="end" type="date" required />
          </label>
        </div>
        <label class="field">
          <span class="field-label">进度 (0-100)</span>
          <input name="progress" type="number" min="0" max="100" value="0" />
        </label>
        <label class="field">
          <span class="field-label">类型</span>
            <select name="type">
              <option value="task">普通任务</option>
              <option value="milestone">里程碑</option>
            </select>
        </label>
      </div>
      <div class="task-dialog-footer">
        <button type="button" data-action="cancel" class="btn-secondary">取消</button>
        <button type="submit" class="btn-primary" data-role="submit-btn">创建</button>
      </div>
    </form>
    <button type="button" class="task-dialog-close" aria-label="关闭" data-action="close">×</button>
  `;
  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  const form = panel.querySelector<HTMLFormElement>('#task-form')!;
  const titleEl = panel.querySelector<HTMLHeadingElement>('.task-dialog-title')!;
  const btnCancel = panel.querySelector<HTMLButtonElement>('button[data-action="cancel"]')!;
  const btnClose = panel.querySelector<HTMLButtonElement>('button[data-action="close"]')!;
  const submitBtn = panel.querySelector<HTMLButtonElement>('button[data-role="submit-btn"]')!;
  const nameInput = form.querySelector<HTMLInputElement>('input[name="name"]')!;
  const startInput = form.querySelector<HTMLInputElement>('input[name="start"]')!;
  const endInput = form.querySelector<HTMLInputElement>('input[name="end"]')!;
  const progressInput = form.querySelector<HTMLInputElement>('input[name="progress"]')!;
  const typeSelect = form.querySelector<HTMLSelectElement>('select[name="type"]')!;

  let mode: DialogMode = 'create';
  let currentTask: any = null;
  let parentTask: any = null;

  const escHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') hide(); };

  function sanitize(str: string) { return str.replace(/[<>]/g, ''); }
  function setMode(m: DialogMode) {
    mode = m;
    if (m === 'create') { titleEl.innerText = '创建任务'; submitBtn.innerText = '创建'; }
    else if (m === 'edit') { titleEl.innerText = '编辑任务'; submitBtn.innerText = '保存'; }
    else { titleEl.innerText = '创建子任务'; submitBtn.innerText = '创建'; }
  }
  function syncMilestone() {
    if (typeSelect.value === 'milestone') {
      endInput.disabled = true;
      endInput.value = startInput.value || dayjs().format('YYYY-MM-DD');
    } else endInput.disabled = false;
  }
  typeSelect.addEventListener('change', syncMilestone);
  startInput.addEventListener('change', () => {
    if (typeSelect.value === 'milestone') endInput.value = startInput.value;
  });
  function baseInit() {
    const today = dayjs().format('YYYY-MM-DD');
    nameInput.value = '';
    startInput.value = today;
    endInput.value = today;
    progressInput.value = '0';
    typeSelect.value = 'task';
    endInput.disabled = false;
  }
  function showCreate() { currentTask = null; parentTask = null; setMode('create'); baseInit(); open(); }
  function showCreateChild(parent: any) { currentTask = null; parentTask = parent; setMode('createChild'); baseInit(); open(); }
  function showEdit(task: any) {
    if (!task) return;
    currentTask = task; parentTask = null; setMode('edit');
    const startVal = task.start || task.startTime || '';
    const endVal = task.end || task.endTime || startVal;
    nameInput.value = task.name || '';
    startInput.value = dayjs(startVal).format('YYYY-MM-DD');
    endInput.value = dayjs(endVal).format('YYYY-MM-DD');
    progressInput.value = String(task.progress ?? 0);
    typeSelect.value = task.type === 'milestone' ? 'milestone' : 'task';
    syncMilestone();
    open();
  }
  function open() {
    overlay.style.display = 'flex';
    document.addEventListener('keydown', escHandler);
    nameInput.focus();
  }
  function hide() {
    overlay.style.display = 'none';
    document.removeEventListener('keydown', escHandler);
  }
  btnCancel.addEventListener('click', hide);
  btnClose.addEventListener('click', hide);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const values: TaskFormValues = {
      name: sanitize(nameInput.value.trim()),
      start: startInput.value,
      end: endInput.value,
      progress: Number(progressInput.value || 0),
      type: (typeSelect.value as any) === 'milestone' ? 'milestone' : 'task'
    };
    if (!values.name) return notify('error', '名称不能为空');
    if (!values.start) return notify('error', '开始时间不能为空');
    if (values.type === 'milestone') values.end = values.start;
    else {
      if (!values.end) return notify('error', '结束时间不能为空');
      if (dayjs(values.end).isBefore(dayjs(values.start))) return notify('error', '结束时间不能早于开始时间');
    }
    if (Number.isNaN(values.progress) || values.progress < 0 || values.progress > 100)
      return notify('error', '进度需为 0-100 的数字');

    if (mode === 'create') {
      const id = generateId();
      data.push({
        id,
        name: values.name,
        start: dayjs(values.start).format(DATE_FMT),
        end: dayjs(values.end).format(DATE_FMT),
        progress: values.progress,
        subtask: [],
        type: values.type
      });
      gantt.update({ data });
      updateFooterStatusInfo();
      notify('success', '已创建任务');
      hide();
    } else if (mode === 'edit' && currentTask) {
      currentTask.name = values.name;
      currentTask.start = dayjs(values.start).format(DATE_FMT);
      currentTask.end = dayjs(values.end).format(DATE_FMT);
      currentTask.progress = values.progress;
      currentTask.type = values.type;
      if (currentTask.type === 'milestone') currentTask.end = currentTask.start;
      gantt.update({ data });
      notify('success', '已保存任务');
      hide();
    } else if (mode === 'createChild' && parentTask) {
      const id = generateId();
      const child = {
        id,
        name: values.name,
        start: dayjs(values.start).format(DATE_FMT),
        end: dayjs(values.end).format(DATE_FMT),
        progress: values.progress,
        subtask: [],
        type: values.type
      };
      if (!Array.isArray(parentTask.subtask)) parentTask.subtask = [];
      parentTask.subtask.push(child);
      gantt.update({ data });
      updateFooterStatusInfo();
      notify('success', '已创建子任务');
      hide();
    }
  });

  return { showCreate, showCreateChild, showEdit, hide };
})();

// ==== 新增：链接编辑对话框 ====
interface LinkFormValues {
  type: 'FS' | 'FF' | 'SS' | 'SF';
  color: string;
  lag: number;
}
const linkDialog = (() => {
  const ALLOW_TYPES: LinkFormValues['type'][] = ['FS', 'FF', 'SS', 'SF'];
  const COLORS = ['#e7209e', '#eca710', '#f5222d', '#52c41a', '#1890ff', '#8a2be2'];
  const overlay = document.createElement('div');
  overlay.className = 'task-dialog-overlay';
  overlay.style.display = 'none';
  const panel = document.createElement('div');
  panel.className = 'task-dialog-panel link-dialog-panel';
  panel.innerHTML = `
    <h3 class="task-dialog-title">编辑依赖</h3>
    <form id="link-form" autocomplete="off" novalidate>
      <div class="task-dialog-fields">
        <div class="field-row">
          <label class="field">
            <span class="field-label">From</span>
            <input name="from" type="text" disabled />
          </label>
          <label class="field">
            <span class="field-label">To</span>
            <input name="to" type="text" disabled />
          </label>
        </div>
        <label class="field">
          <span class="field-label">类型 (依赖关系)</span>
          <div class="radio-group" data-role="type-group">
            ${ALLOW_TYPES.map(t => `
              <label class="radio-chip">
                <input type="radio" name="linkType" value="${t}" />
                <span>${t}</span>
              </label>`).join('')}
          </div>
        </label>
        <label class="field">
          <span class="field-label">颜色</span>
          <div class="color-swatch-group" data-role="color-group">
            ${COLORS.map(c => `
              <label class="color-swatch" style="--sw:${c}">
                <input type="radio" name="linkColor" value="${c}">
                <span></span>
              </label>`).join('')}
          </div>
        </label>
        <label class="field">
          <span class="field-label">延迟 (天, 可负数)</span>
          <input name="lag" type="number" step="1" min="-365" max="365" value="0" />
        </label>
      </div>
      <div class="task-dialog-footer">
        <button type="button" class="btn-secondary" data-action="cancel">取消</button>
        <button type="submit" class="btn-primary" data-role="submit">保存</button>
      </div>
    </form>
    <button type="button" class="task-dialog-close" aria-label="关闭" data-action="close">×</button>
  `;
  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  const form = panel.querySelector<HTMLFormElement>('#link-form')!;
  const fromInput = form.querySelector<HTMLInputElement>('input[name="from"]')!;
  const toInput = form.querySelector<HTMLInputElement>('input[name="to"]')!;
  const lagInput = form.querySelector<HTMLInputElement>('input[name="lag"]')!;
  const btnCancel = form.querySelector<HTMLButtonElement>('button[data-action="cancel"]')!;
  const btnClose = panel.querySelector<HTMLButtonElement>('button[data-action="close"]')!;

  let currentLink: any = null;

  const escHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') hide(); };

  function show(link: any) {
    currentLink = link;
    fromInput.value = String(link.from ?? link.source ?? '');
    toInput.value = String(link.to ?? link.target ?? '');
    const typeVal: string = ALLOW_TYPES.includes(link.type) ? link.type : 'FS';
    (form.querySelector<HTMLInputElement>(`input[name="linkType"][value="${typeVal}"]`) || form.querySelector<HTMLInputElement>('input[name="linkType"]')!)!.checked = true;
    const colorVal = COLORS.includes(link.color) ? link.color : COLORS[0];
    (form.querySelector<HTMLInputElement>(`input[name="linkColor"][value="${colorVal}"]`) || form.querySelector<HTMLInputElement>('input[name="linkColor"]')!)!.checked = true;
    lagInput.value = String(Number(link.lag ?? 0));
    overlay.style.display = 'flex';
    document.addEventListener('keydown', escHandler);
    lagInput.focus();
  }
  function hide() {
    overlay.style.display = 'none';
    document.removeEventListener('keydown', escHandler);
  }

  btnCancel.addEventListener('click', hide);
  btnClose.addEventListener('click', hide);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentLink) return;
    const typeRadio = form.querySelector<HTMLInputElement>('input[name="linkType"]:checked');
    const colorRadio = form.querySelector<HTMLInputElement>('input[name="linkColor"]:checked');
    const rawLag = lagInput.value.trim();
    const lagNum = Number(rawLag);
    if (!typeRadio || !ALLOW_TYPES.includes(typeRadio.value as any)) {
      return notify('error', '请选择合法依赖类型');
    }
    if (!colorRadio || !COLORS.includes(colorRadio.value)) {
      return notify('error', '请选择合法颜色');
    }
    if (!Number.isFinite(lagNum) || lagNum < -365 || lagNum > 365) {
      return notify('error', '延迟需在 -365 ~ 365 之间');
    }

    currentLink.type = typeRadio.value as LinkFormValues['type'];
    currentLink.color = colorRadio.value;
    currentLink.lag = lagNum;

    // 刷新链接
    gantt.update({ links: { data: links } as any });
    notify('success', '依赖已保存');
    hide();
  });

  return { show, hide };
})();

// 交互按钮
const btnGroup = document.getElementById('btn-group');
let editBtn: HTMLButtonElement | null = null;
let createChildBtn: HTMLButtonElement | null = null;
function updateActionBtnState() {
  if (editBtn) editBtn.disabled = !selected;
  if (createChildBtn) createChildBtn.disabled = !selected;
}

if (btnGroup) {
  const getInstanceBtn = btnGroup.querySelector('#get-instance') as HTMLButtonElement;
  getInstanceBtn.addEventListener('click', () => {
    console.log('当前 Gantt 实例：', gantt);
    notify('info', '实例已打印到控制台');
  });

  const btnToday = btnGroup.querySelector('#btn-today') as HTMLButtonElement;
  btnToday.addEventListener('click', () => {
    gantt.jumpTo();
    notify('info', '已跳转到今天');
  });
  const btnCreate = btnGroup.querySelector('#btn-open-create-dialog') as HTMLButtonElement;
  btnCreate.addEventListener('click', () => taskDialog.showCreate());
  createChildBtn = btnGroup.querySelector('#btn-open-create-child-dialog') as HTMLButtonElement;
  createChildBtn.addEventListener('click', () => {
    if (!selected) return;
    const real = findTaskById(selected.id) || selected;
    if (real.type === 'milestone') return notify('warning', '里程碑下不能创建子任务');
    taskDialog.showCreateChild(real);
  });
  editBtn = btnGroup.querySelector('#btn-open-edit-dialog') as HTMLButtonElement;
  editBtn.addEventListener('click', () => {
    if (!selected) return;
    const realTask = findTaskById(selected.id) || selected;
    taskDialog.showEdit(realTask);
  });
  const colorSelect = btnGroup.querySelector('#select-primary-color') as HTMLSelectElement;
  colorSelect.addEventListener('change', () => {
    gantt.update({ primaryColor: colorSelect.value });
    notify('info', '主题色已更新');
  });
  const localeSelect = btnGroup.querySelector('#select-locale') as HTMLSelectElement;
  localeSelect.addEventListener('change', () => {
    gantt.update({ locale: localeSelect.value });
    notify('info', '语言已更新');
  });
  const unitSelect = btnGroup.querySelector('#select-unit') as HTMLSelectElement;
  unitSelect.addEventListener('change', () => {
    gantt.update({ unit: unitSelect.value as any });
    notify('info', '视图单位已更新');
  });

  const holidayChk = btnGroup.querySelector('#chk-show-holiday') as HTMLInputElement;
  holidayChk.addEventListener('change', () => {
    gantt.update({ holiday: { show: holidayChk.checked } });
    notify('info', '假期显示已更新');
  });
  const weekendChk = btnGroup.querySelector('#chk-show-weekend') as HTMLInputElement;
  weekendChk.addEventListener('change', () => {
    gantt.update({ weekend: { show: weekendChk.checked } });
    notify('info', '周末显示已更新');
  });

  const baselineBtn = document.getElementById('baseline-multi-btn') as HTMLButtonElement;
  const baselinePanel = document.getElementById('baseline-multi-panel') as HTMLDivElement;
  baselineBtn.addEventListener('click', () => {
    const open = baselinePanel.hasAttribute('hidden');
    if (open) {
      baselinePanel.removeAttribute('hidden');
      baselinePanel.style.display = 'block';
    } else {
      baselinePanel.setAttribute('hidden', '');
      baselinePanel.style.display = 'none';
    }
    baselineBtn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('mousedown', e => {
    if (!baselinePanel.contains(e.target as any) && e.target !== baselineBtn) {
      baselinePanel.setAttribute('hidden', '');
      baselinePanel.style.display = 'none';
      baselineBtn.setAttribute('aria-expanded', 'false');
    }
  });
  const baselineShowChk = btnGroup.querySelector('#chk-show-baseline') as HTMLInputElement;
  baselineShowChk.addEventListener('change', () => {
    gantt.update({ baselines: { show: baselineShowChk.checked } });
    notify('info', baselineShowChk.checked ? '基线显示已开启' : '基线显示已关闭');
  });
  const baselineCompareChk = btnGroup.querySelector('#chk-show-compare') as HTMLInputElement;
  baselineCompareChk.addEventListener('change', () => {
    gantt.update({ baselines: { compare: { enabled: baselineCompareChk.checked } } });
    notify('info', baselineCompareChk.checked ? '基线对比已开启' : '基线对比已关闭');
  });
  const baselineIndicatorChk = btnGroup.querySelector('#chk-show-indicator') as HTMLInputElement;
  baselineIndicatorChk.addEventListener('change', () => {
    gantt.update({ baselines: { compare: { indicator: { show: baselineIndicatorChk.checked } } } });
    notify('info', baselineIndicatorChk.checked ? '基线对比指示器已开启' : '基线对比指示器已关闭');
  });
}

// 初始化 footer
updateFooterStatusInfo();
updateFooterChecked();
updateFooterSelection();
updateActionBtnState();

// 删除任务
function removeTaskById(id: string): boolean {
  return gantt.removeDataById(id);
}

// 上下文菜单系统
interface ContextMenuItem {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}
let activeContextMenu: HTMLElement | null = null;
function closeContextMenu() {
  if (!activeContextMenu) return;
  activeContextMenu.classList.add('closing');
  const el = activeContextMenu;
  activeContextMenu = null;
  setTimeout(() => el.remove(), 120);
  window.removeEventListener('mousedown', outsideHandler, true);
  window.removeEventListener('scroll', closeContextMenu, true);
  window.removeEventListener('resize', closeContextMenu, true);
  window.removeEventListener('contextmenu', closeContextMenu, true);
  window.removeEventListener('keydown', escHandlerForMenu, true);
}
function escHandlerForMenu(e: KeyboardEvent) { if (e.key === 'Escape') closeContextMenu(); }
function outsideHandler(e: MouseEvent) {
  if (!activeContextMenu) return;
  if (!activeContextMenu.contains(e.target as Node)) closeContextMenu();
}
function createContextMenu(items: ContextMenuItem[], x: number, y: number) {
  closeContextMenu();
  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.setAttribute('role', 'menu');
  menu.tabIndex = -1;
  items.forEach(item => {
    if (item.divider) {
      const hr = document.createElement('div');
      hr.className = 'context-menu-divider';
      menu.appendChild(hr);
      return;
    }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'context-menu-item';
    if (item.danger) btn.classList.add('danger');
    if (item.disabled) btn.classList.add('disabled');
    btn.innerText = item.label || '';
    btn.disabled = !!item.disabled;
    if (!item.disabled && item.onClick) {
      btn.addEventListener('click', () => {
        try { item.onClick!(); } finally { closeContextMenu(); }
      });
    }
    menu.appendChild(btn);
  });
  document.body.appendChild(menu);
  activeContextMenu = menu;
  menu.style.left = '-9999px'; menu.style.top = '-9999px'; menu.style.opacity = '0';
  requestAnimationFrame(() => {
    const rect = menu.getBoundingClientRect();
    let left = x; let top = y; const pad = 4;
    if (left + rect.width > window.innerWidth - pad) left = Math.max(pad, window.innerWidth - rect.width - pad);
    if (top + rect.height > window.innerHeight - pad) top = Math.max(pad, window.innerHeight - rect.height - pad);
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';
    menu.style.opacity = '1';
    menu.focus();
  });
  window.addEventListener('mousedown', outsideHandler, true);
  window.addEventListener('scroll', closeContextMenu, true);
  window.addEventListener('resize', closeContextMenu, true);
  window.addEventListener('contextmenu', closeContextMenu, true);
  window.addEventListener('keydown', escHandlerForMenu, true);
}

// 行菜单
function buildRowMenu(row: any, e: MouseEvent) {
  const real = findTaskById(row.id) || row;
  const isMilestone = real.type === 'milestone';
  const canConvertToMilestone = !isMilestone && Number(real.progress) === 100;
  const items: ContextMenuItem[] = [
    { label: '编辑任务', onClick: () => taskDialog.showEdit(real) },
    {
      label: '创建子任务',
      disabled: isMilestone,
      onClick: () => {
        if (isMilestone) return notify('warning', '里程碑下不能创建子任务');
        taskDialog.showCreateChild(real);
      }
    },
    {
      label: isMilestone ? '转为普通任务' : (canConvertToMilestone ? '设为里程碑' : '设为里程碑 (需100%)'),
      disabled: !isMilestone && !canConvertToMilestone,
      onClick: () => {
        if (isMilestone) {
          real.type = 'task';
          notify('success', '已还原为普通任务');
        } else {
          if (!canConvertToMilestone) return notify('warning', '进度未完成，不能设为里程碑');
          real.type = 'milestone';
          notify('success', '已设为里程碑');
        }
        gantt.update({ data });
      }
    },
    { divider: true },
    {
      label: '删除任务', danger: true, onClick: () => {
        if (removeTaskById(real.id)) {
          if (selected && selected.id === real.id) selected = null;
          gantt.update({ data });
          updateFooterStatusInfo();
          updateFooterSelection();
          updateActionBtnState();
          notify('success', '任务已删除');
        } else notify('error', '删除失败：未找到任务');
      }
    }
  ];
  createContextMenu(items, e.clientX, e.clientY);
}

// Slider 菜单
function buildSliderMenu(row: any, e: MouseEvent) {
  const real = findTaskById(row.id) || row;
  const isMilestone = real.type === 'milestone';
  const canConvertToMilestone = !isMilestone && Number(real.progress) === 100;
  const quickSet = (val: number) => {
    if (real.progress === val) return notify('info', `进度已是 ${val}%`);
    real.progress = val;
    gantt.update({ data });
    notify('success', `进度已设为 ${val}%`);
  };
  const items: ContextMenuItem[] = [
    { label: '进度 0%', onClick: () => quickSet(0) },
    { label: '进度 50%', onClick: () => quickSet(50) },
    { label: '进度 100%', onClick: () => quickSet(100) },
    { divider: true },
    { label: '编辑任务', onClick: () => taskDialog.showEdit(real) },
    {
      label: isMilestone ? '转为普通任务' : (canConvertToMilestone ? '设为里程碑' : '设为里程碑 (需100%)'),
      disabled: !isMilestone && !canConvertToMilestone,
      onClick: () => {
        if (isMilestone) {
          real.type = 'task';
          notify('success', '已还原为普通任务');
        } else {
          if (!canConvertToMilestone) return notify('warning', '进度未完成，不能设为里程碑');
          real.type = 'milestone';
          notify('success', '已设为里程碑');
        }
        gantt.update({ data });
      }
    },
    { divider: true },
    {
      label: '查看当前所有关联', onClick: () => {
        const dataChain = gantt.getDataChain(real.id);
        console.log('当前任务数据链：', dataChain);
      }
    },
    { divider: true },
    {
      label: '删除任务', danger: true, onClick: () => {
        if (removeTaskById(real.id)) {
          if (selected && selected.id === real.id) selected = null;
          gantt.update({ data });
          updateFooterStatusInfo();
          updateFooterSelection();
          updateActionBtnState();
          notify('success', '任务已删除');
        } else notify('error', '删除失败：未找到任务');
      }
    }
  ];
  createContextMenu(items, e.clientX, e.clientY);
}

// Link 菜单（调用链接对话框）
function buildLinkMenu(link: any, e: MouseEvent) {
  const items: ContextMenuItem[] = [
    { label: '编辑依赖', onClick: () => linkDialog.show(link) },
    {
      label: '删除依赖', danger: true, onClick: () => {
        const idx = links.findIndex(l => l.id === link.id);
        if (idx > -1) {
          links.splice(idx, 1);
          gantt.update({ links: { data: links } as any });
          notify('success', '依赖已删除');
        } else notify('error', '未找到该依赖');
      }
    },
    {
      divider: true
    },
    {
      label: '查看起始任务', onClick: () => {
        gantt.scrollTo(link.from, true);
      }
    },
    {
      label: '查看目标任务', onClick: () => {
        gantt.scrollTo(link.to, true);
      }
    }
  ];
  createContextMenu(items, e.clientX, e.clientY);
}

// 绑定右键
gantt.on('contextmenu:row', (e, row) => {
  e.preventDefault();
  buildRowMenu(row, e);
});
gantt.on('contextmenu:slider', (e, row) => {
  e.preventDefault();
  buildSliderMenu(row, e);
});
gantt.on('contextmenu:link', (e, link) => {
  e.preventDefault();
  buildLinkMenu(link, e);
});

// 添加 Slider 悬浮提示
let infoDialog: any = null;
gantt.on("hover:slider", (e, data) => {
  if (infoDialog) {
    infoDialog.style.top = `${e.pageY + 10}px`;
    infoDialog.style.left = `${e.pageX}px`;
    return;
  }
  infoDialog = document.createElement("div");
  infoDialog.style.position = "absolute";
  infoDialog.style.top = `${e.pageY + 10}px`;
  infoDialog.style.left = `${e.pageX}px`;
  infoDialog.style.background = "white";
  infoDialog.style.border = "1px solid #d9d9d9";
  infoDialog.style.padding = "8px";
  infoDialog.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
  infoDialog.innerHTML = `
    <strong>任务信息</strong><br>
    <strong>名称:</strong> ${data.name}<br>
    <strong>开始时间:</strong> ${data.start}<br>
    <strong>结束时间:</strong> ${data.end}<br>
    <strong>进度:</strong> ${data.progress || 0}%
  `;
  document.body.appendChild(infoDialog);
})
gantt.on("leave:slider", () => {
  if (infoDialog) {
    document.body.removeChild(infoDialog);
    infoDialog = null;
  }
});
