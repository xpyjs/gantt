const cssCode = `html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}

#app {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

#btn-group {
    padding: 8px 12px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

#gantt-container {
    flex: 1;
    overflow: hidden;
}

#footer-bar {
    background-color: rgb(226, 226, 226);
    height: 24px;
    padding: 2px 12px;
    box-sizing: border-box;
    display: flex;
    gap: 16px;
    align-items: center;
    font-size: 12px;
    color: #333;
    border-top: 1px solid #b1b1b1;
}

button {
    padding: 4px 12px 6px;
    border: none;
    border-radius: 4px;
    background-color: #007acc;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 13px;
    line-height: 1.2;
}
button:hover:not(:disabled) {
    background-color: #009ee7;
}
button:active:not(:disabled) {
    background-color: #005c99;
}
button:disabled {
    background-color: #9aa7b1;
    cursor: not-allowed;
    opacity: 0.75;
}

select {
    padding: 2px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
    font-size: 13px;
}

/* ================= 任务对话框 ================= */
.task-dialog-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.35);
    z-index: 9999;
    animation: fadeIn 0.15s ease;
    font-family: system-ui, Arial, sans-serif;
}

.task-dialog-panel {
    background: #fff;
    width: 420px;
    max-width: 94%;
    border-radius: 8px;
    padding: 18px 20px 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    animation: scaleIn 0.18s ease;
}

.task-dialog-title {
    margin: 0 0 4px;
    font-size: 16px;
    font-weight: 600;
    color: #222;
}

.task-dialog-close {
    position: absolute;
    top: 6px;
    right: 8px;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    padding: 2px 6px;
    color: #555;
    border-radius: 4px;
}
.task-dialog-close:hover {
    background: #f2f2f2;
}

.task-dialog-fields {
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-size: 13px;
}

.field-row {
    display: flex;
    gap: 8px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
}

.field-label {
    font-size: 12px;
    color: #444;
}

.task-dialog-panel input[type="text"],
.task-dialog-panel input[type="date"],
.task-dialog-panel input[type="number"],
.task-dialog-panel select {
    padding: 6px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
    font-size: 13px;
    transition: border-color .15s, box-shadow .15s;
    background: #fff;
}
.task-dialog-panel input:focus,
.task-dialog-panel select:focus {
    border-color: #1677ff;
    box-shadow: 0 0 0 2px rgba(22,119,255,0.15);
}

.task-dialog-footer {
    margin-top: 8px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.btn-primary {
    background: #1677ff;
    border: 1px solid #1677ff;
    padding: 6px 16px;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    font-size: 13px;
}
.btn-primary:hover {
    background: #3c8dff;
}
.btn-primary:active {
    background: #0d5fcf;
}

.btn-secondary {
    background: #f0f0f0;
    border: 1px solid #d9d9d9;
    padding: 6px 14px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
}
.btn-secondary:hover {
    background: #e6e6e6;
}
.btn-secondary:active {
    background: #d8d8d8;
}

/* ================ 多消息提示系统 ================== */
#tooltip {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 10000;
    pointer-events: none;
    max-width: clamp(260px, 60vw, 480px);
    width: max-content;
    align-items: center;
}

.tooltip-item {
    position: relative;
    background: #fff;
    border: 1px solid #d9d9d9;
    box-shadow: 0 4px 14px rgba(0,0,0,0.14);
    border-radius: 6px;
    padding: 10px 14px 10px 14px;
    font-size: 13px;
    line-height: 1.4;
    color: #333;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    animation: tipIn .18s ease;
    pointer-events: auto;
    overflow: hidden;
    max-width: 100%;
}

.tooltip-item.leaving {
    animation: tipOut .16s ease forwards;
}

.tooltip-item .tooltip-content {
    flex: 1;
    word-break: break-word;
}

.tooltip-item .tooltip-close {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    color: #666;
    padding: 2px 4px;
    border-radius: 4px;
}
.tooltip-item .tooltip-close:hover {
    background: #f2f2f2;
}

.tooltip-progress {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 3px;
    width: 100%;
    background: rgba(0,0,0,0.08);
    overflow: hidden;
}
.tooltip-progress::after {
    content: "";
    position: absolute;
    inset: 0;
    background: currentColor;
    animation: tipBar linear forwards;
    transform-origin: left center;
}

.tooltip-info {
    border-color: #91caff;
    color: #1677ff;
}
.tooltip-success {
    border-color: #95de64;
    color: #52c41a;
}
.tooltip-warning {
    border-color: #ffd666;
    color: #faad14;
}
.tooltip-error {
    border-color: #ff9c6e;
    color: #f5222d;
}

@keyframes tipIn {
    from { opacity: 0; transform: translateY(-6px) scale(.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes tipOut {
    to { opacity: 0; transform: translateY(-6px) scale(.96); }
}
@keyframes tipBar {
    from { transform: scaleX(1); }
    to { transform: scaleX(0); }
}

/* ================ 通用动画 ================== */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
@keyframes scaleIn {
    from { opacity: 0; transform: translateY(4px) scale(.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

/* ============== Context Menu ============== */
.context-menu {
    position: fixed;
    min-width: 168px;
    background: #fff;
    border: 1px solid #dadada;           /* 更淡的边框 */
    box-shadow: 0 6px 20px -4px rgba(0,0,0,0.18),
                0 2px 8px -2px rgba(0,0,0,0.12);
    border-radius: 8px;
    padding: 6px 4px;
    display: flex;
    flex-direction: column;
    z-index: 10001;
    font-size: 13px;
    animation: cmFade .12s ease;
    outline: none;                       /* 去掉默认 focus 外框 */
}
.context-menu:focus {
    outline: none;
}
.context-menu-item {
    text-align: left;
    background: transparent;
    border: none;
    width: 100%;
    cursor: pointer;
    font-size: 13px;
    padding: 7px 12px;
    border-radius: 6px;
    color: #333;
    display: flex;
    gap: 6px;
    align-items: center;
    line-height: 1.25;
    transition: background .12s, color .12s;
}
.context-menu-item:hover:not(.disabled) {
    background: #1677ff15;
    color: #1677ff;
}
.context-menu-item.danger {
    color: #f5222d;
}
.context-menu-item.danger:hover:not(.disabled) {
    background: #fff1f0;
    color: #cf1322;
}
.context-menu-item.disabled {
    color: #b8b8b8;      /* 更浅更柔和的置灰 */
    opacity: 1;          /* 去掉整体透明，避免发灰发浑 */
    cursor: not-allowed;
    background: transparent;
}
.context-menu-item.disabled:hover {
    background: transparent; /* 禁止 hover 变色 */
    color: #b8b8b8;
}
.context-menu-divider {
    height: 1px;
    margin: 6px 8px;
    background: #ededed;
    border-radius: 1px;
}

@keyframes cmFade {
    from { opacity: 0; transform: translateY(-4px) scale(.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes cmOut {
    to { opacity: 0; transform: translateY(-4px) scale(.96); }
}

/* 链接编辑对话框附加样式 */
.link-dialog-panel {
    width: 440px;
    max-width: 96%;
}

.radio-group {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}
.radio-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #f5f5f5;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 4px 10px;
    cursor: pointer;
    font-size: 12px;
    user-select: none;
    line-height: 1.2;
    transition: background .15s, border-color .15s, color .15s;
}
.radio-chip input {
    display: none;
}
.radio-chip input:checked + span {
    color: #1677ff;
    font-weight: 600;
}
.radio-chip:hover {
    background: #ececec;
}
.radio-chip input:checked ~ span,
.radio-chip input:checked + span {
    position: relative;
}
.radio-chip input:checked + span::after {
    content: '';
    position: absolute;
    left: -6px;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    background: #1677ff;
    border-radius: 50%;
}

.color-swatch-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 2px 0;
}
.color-swatch {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    position: relative;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 2px solid transparent;
    transition: transform .15s, border-color .15s;
}
.color-swatch input {
    display: none;
}
.color-swatch span {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    background: var(--sw);
    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.15);
}
.color-swatch:hover {
    transform: scale(1.05);
}
.color-swatch input:checked + span {
    outline: 2px solid #1677ff;
    outline-offset: 1px;
}

.link-dialog-panel input[disabled] {
    background: #f8f8f8;
    color: #666;
    cursor: default;
}

.checkbox {
    font-size: 14px;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 4px;
}
input[type="checkbox"] {
    width: 14px;
    height: 14px;
    cursor: pointer;
    accent-color: #1677ff;
    margin: 0;
    padding: 0;
}

.multi-panel-wrapper {
    position: relative;
}
.multi-panel {
    position: absolute;
    margin-top: 4px;
    border: 1px solid #d9d9d9;
    background: #fff;
    border-radius: 6px;
    padding: 6px 8px;
    box-shadow: 0 6px 18px rgba(0,0,0,.15);
    min-width: 140px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    z-index: 999;
    display: none;
}
.option label {
    font-size: 13px;
    cursor: pointer;
    display: flex;
    gap: 6px;
    align-items: center;
    padding: 4px 4px;
    border-radius: 4px;
}
.option[aria-selected="true"] {
    background: #1677ff11;
}
.option:hover {
    background: #f5f5f5;
}`

const dataCode = `import { dayjs } from "@xpyjs/gantt-core";

export interface TaskNode {
    id: string;
    name: string;
    start: string; // 使用 dateFormat: YYYY-MM-DD
    end: string;
    progress: number; // 0-100
    type?: 'task' | 'milestone' | 'summary';
    subtask?: TaskNode[];
    // 额外模拟字段，可扩展
    owner?: string;
    riskLevel?: string;
    module?: string;
}

export interface LinkRow {
    id: string;
    from: string;
    to: string;
    type?: 'FS' | 'FF' | 'SS' | 'SF';
    label?: string;
    note?: string;
    color?: string;
}

export interface BaselineRow {
    id: string;
    taskId: string;      // 关联任务 ID（与任务 id 对应）
    startTime: string;   // 计划开始
    endTime: string;     // 计划结束
    name: string;        // 基线名称
    highlight?: boolean; // 是否参与对比高亮（可省略，默认 true）
    target?: boolean;    // 是否作为指示器对比目标
}

const dataCount = 10000;
const linkCount = 1000;
const baselineCount = 5000;
const RNG_SEED = 'DEMO6_SEED_V1';
function hashSeed(str: string): number {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }
    return (h >>> 0);
}
function mulberry32(seed: number) {
    return function () {
        seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
}
const rng = mulberry32(hashSeed(RNG_SEED));
// 随机工具（基于种子）
const rand = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]) => arr[rand(0, arr.length - 1)];

// 语料，用于生成更真实的任务名称
const projectPhases = ["立项", "需求分析", "原型设计", "UI 设计", "架构设计", "后端开发", "前端开发", "接口联调", "集成测试", "性能优化", "安全加固", "试运行", "用户培训", "上线部署", "运维监控", "版本迭代", "复盘总结"];
const activityTypes = ["模块", "子系统", "任务", "里程碑", "交付", "验收", "节点", "阶段", "集成点", "检查点", "准备", "评审", "规划", "包装", "推广", "市场预热", "风险评估"];
const owners = ["Alice", "Bob", "Charlie", "David", "Eve", "Grace", "Heidi", "Ivan", "Judy", "Mallory", "Olivia", "Peggy", "Sybil", "Trent", "Victor", "Wendy"];
const risks = ["低", "中", "高", "可忽略"]; // 简单风险标签
const modules = ["平台", "核心引擎", "监控", "权限", "数据仓库", "API 网关", "移动端", "可视化", "AI 引擎", "任务调度", "日志系统", "缓存层", "消息总线"];

// 时间范围：今天前 60 天 ~ 后 120 天 (dayjs 实现)
export const DATE_FMT = 'YYYY-MM-DD HH:mm:ss';
const today = dayjs();
const startBase = today.subtract(60, 'day');
const dateToStr = (d: dayjs.Dayjs) => d.format(DATE_FMT);

export const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
}

// 创建单个任务（含递归子任务）
function createTask(depth: number, maxDepth: number, remainRef: { val: number }): TaskNode {
    const id = generateId();
    // 时间
    const startOffset = rand(0, 180); // 约 6 个月跨度
    let duration = rand(1, 30); // 天
    // 里程碑：5% 概率
    let isMilestone = rng() < 0.05;
    if (isMilestone) duration = 0;
    const startDate = startBase.add(startOffset, 'day');
    const rawEnd = startDate.add(Math.max(duration, 0), 'day');
    // 对持续型任务：结束时间减 1 秒（跨天时包含结束日），里程碑保留 startDate
    const endDate = duration > 0 ? rawEnd.subtract(1, 'second') : startDate;

    const node: TaskNode = {
        id,
        name: \`\${pick(projectPhases)}-\${pick(activityTypes)}-\${id}\`,
        start: dateToStr(startDate),
        end: dateToStr(endDate),
        progress: isMilestone ? 100 : rand(0, 100),
        type: isMilestone ? 'milestone' : 'task',
        owner: pick(owners),
        riskLevel: pick(risks),
        module: pick(modules)
    };

    remainRef.val -= 1;

    // 决定是否生成子任务（需剩余数量 & 深度限制 & 排除里程碑）
    const canChildren = depth < maxDepth && remainRef.val > 0 && !isMilestone;
    if (canChildren && rng() < 0.32) { // 32% 概率生成子层（固定种子）
        const maxChildren = Math.min(remainRef.val, rand(2, 6));
        node.subtask = [];
        for (let i = 0; i < maxChildren && remainRef.val > 0; i++) {
            node.subtask.push(createTask(depth + 1, maxDepth, remainRef));
        }
        // 标记为 summary
        node.type = 'summary';
        // 汇总时间/进度
        const all = node.subtask;
        const minStart = all.reduce((m, c) => dayjs(c.start).isBefore(m) ? dayjs(c.start) : m, dayjs(all[0].start));
        const maxEnd = all.reduce((m, c) => dayjs(c.end).isAfter(m) ? dayjs(c.end) : m, dayjs(all[0].end));
        node.start = minStart.format(DATE_FMT);
        node.end = maxEnd.format(DATE_FMT);
        node.progress = Math.round(all.reduce((s, c) => s + c.progress, 0) / all.length);
    }

    return node;
}

export function generateData(total: number, maxDepth = 5): TaskNode[] {
    const remain = { val: total };
    const roots: TaskNode[] = [];
    while (remain.val > 0) {
        roots.push(createTask(1, maxDepth, remain));
    }

    // 确保包含“今天”节点（若无则追加一个里程碑）
    const todayStr = dateToStr(today);
    const hasToday = roots.some(r => r.start === todayStr || r.end === todayStr || (r.subtask && r.subtask.some(c => c.start === todayStr || c.end === todayStr)));
    if (!hasToday) {
        roots.push({
            id: generateId(),
            name: \`项目里程碑-当日节点\`,
            start: todayStr,
            end: todayStr,
            progress: 100,
            type: 'milestone',
            owner: pick(owners),
            riskLevel: '低',
            module: pick(modules)
        });
    }
    return roots;
}

// 将树拍平，方便生成依赖
function flatten(list: TaskNode[], out: TaskNode[] = []): TaskNode[] {
    for (const n of list) {
        out.push(n);
        if (n.subtask) flatten(n.subtask, out);
    }
    return out;
}

export const data: TaskNode[] = generateData(dataCount, 5);
const flat = flatten(data);

// 生成连线：规则尽量保证 from 的开始时间早于 to，避免环的概率
function generateLinks(count: number, tasks: TaskNode[]): LinkRow[] {
    const result: LinkRow[] = [];
    const set = new Set<string>();
    const types: LinkRow['type'][] = ['FS', 'FF', 'SS', 'SF'];
    const colorPool = ['#c0392b', '#8e44ad', '#16a085', '#2980b9', '#d35400', '#2c3e50'];

    // 为加速，按开始日期排序
    const sorted = [...tasks].sort((a, b) => dayjs(a.start).valueOf() - dayjs(b.start).valueOf());

    let attempts = 0;
    while (result.length < count && attempts < count * 10) {
        attempts++;
        const fromIndex = rand(0, sorted.length - 2);
        const toIndex = rand(fromIndex + 1, Math.min(sorted.length - 1, fromIndex + 500)); // 控制跨度，增强逻辑性（种子确定）
        const from = sorted[fromIndex];
        const to = sorted[toIndex];
        if (!from || !to || from.id === to.id) continue;
        const key = \`\${from.id}->\${to.id}\`;
        if (set.has(key)) continue;
        set.add(key);
        const link: LinkRow = {
            id: \`L\${result.length + 1}\`,
            from: from.id,
            to: to.id,
            type: pick(types),
            label: rng() < 0.15 ? \`依赖-\${result.length + 1}\` : undefined,
            note: rng() < 0.05 ? '关键路径候选' : undefined,
            color: rng() < 0.1 ? pick(colorPool) : undefined
        };
        result.push(link);
    }
    return result;
}

export const links: LinkRow[] = generateLinks(linkCount, flat);

// ===== 新增：生成基线数据 =====
function generateBaselines(count: number, tasks: TaskNode[]): BaselineRow[] {
    if (count <= 0) return [];
    // 优先选择非 summary（叶子或里程碑 / 普通任务），summary 也可以生成但一般意义不大
    const candidates = tasks.filter(t => t.type !== 'summary');
    if (!candidates.length) return [];
    const result: BaselineRow[] = [];
    const targetUsed = new Set<string>(); // 记录已设置 target 的任务

    // 使用与任务/链接相同的 rng，保证可复现
    let attempts = 0;
    while (result.length < count && attempts < count * 5) {
        attempts++;
        const task = candidates[Math.floor(rng() * candidates.length)];
        if (!task) continue;

        const realStart = dayjs(task.start);
        const realEnd = dayjs(task.end);
        const duration = Math.max(realEnd.diff(realStart, 'second'), 0);

        // 基线：模拟计划早/晚的情况
        // 开始偏移：[-7, 3] 天
        const startShiftDays = Math.floor(rng() * (3 - (-7) + 1)) - 7; // -7 ~ 3
        let baselineStart = realStart.add(startShiftDays, 'day');

        let baselineEnd: dayjs.Dayjs;
        if (task.type === 'milestone') {
            // 里程碑：保持同一天或略微提前/延后（-1 ~ +1）
            const msShift = Math.floor(rng() * 3) - 1;
            baselineStart = realStart.add(msShift, 'day');
            baselineEnd = baselineStart;
        } else {
            // 结束偏移：[-3, 7] 天
            const endShiftDays = Math.floor(rng() * (7 - (-3) + 1)) - 3;
            // 原计划结束 = 开始 + 原持续时间 + 偏移
            baselineEnd = baselineStart.add(duration, 'millisecond').add(endShiftDays, 'day');
            if (baselineEnd.isBefore(baselineStart)) {
                // 保底：至少不反向
                baselineEnd = baselineStart;
            }
        }

        const row: BaselineRow = {
            id: \`B\${result.length + 1}\`,
            taskId: task.id,
            startTime: baselineStart.format(DATE_FMT),
            endTime: baselineEnd.format(DATE_FMT),
            name: \`基线-\${result.length + 1}\`,
            highlight: true,
            // 第一条指向某个任务的基线设为 target（指示器基准）
            target: !targetUsed.has(task.id)
        };
        if (!targetUsed.has(task.id)) targetUsed.add(task.id);

        result.push(row);
    }
    return result;
}

export const baselines: BaselineRow[] = generateBaselines(baselineCount, flat);
`

const jsCode = `import { XGantt, dayjs } from "@xpyjs/gantt-core";
import "@xpyjs/gantt-core/style.css";
import "./style.css";
import { data, links, baselines, DATE_FMT, generateId } from './data';

document.body.innerHTML = \`<div id="app">
  <div id="btn-group">
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
      <span style="color: #999" id="footer-time">北京时间：\${dayjs().format(DATE_FMT)}</span>
    </div>
  </div>
</div>
<div id="tooltip" aria-live="polite" aria-atomic="false"></div>
\`;

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
      { field: "name", label: "任务名称", width: 230, align: 'left' },
      { field: "start", label: "开始时间", width: 120 },
      { field: "end", label: "结束时间", width: 120 },
      { field: "progress", label: "进度(%)", width: 90 }
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
          text: (diff, row) => \`领先 \${diff.toFixed(1)} 天\`
        },
        delayed: {
          text: (diff, row) => {
            return \`超期 \${-diff.toFixed(1)} 天\`;
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
  el.className = \`tooltip-item tooltip-\${type}\`;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  el.innerHTML = \`
    <div class="tooltip-content">\${escapeHTML(message)}</div>
    \${closable ? '<button class="tooltip-close" aria-label="关闭">×</button>' : ''}
    <div class="tooltip-progress"></div>
  \`;
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
    (el.querySelector('.tooltip-progress') as HTMLElement).style.animationDuration = \`\${duration}ms\`;
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
  const newLink = { ...link, id: \`L\${dynamicLinkId++}\` };
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
gantt.on("click:row", (_e, item) => {
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
  panel.innerHTML = \`
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
  \`;
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
  panel.innerHTML = \`
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
            \${ALLOW_TYPES.map(t => \`
              <label class="radio-chip">
                <input type="radio" name="linkType" value="\${t}" />
                <span>\${t}</span>
              </label>\`).join('')}
          </div>
        </label>
        <label class="field">
          <span class="field-label">颜色</span>
          <div class="color-swatch-group" data-role="color-group">
            \${COLORS.map(c => \`
              <label class="color-swatch" style="--sw:\${c}">
                <input type="radio" name="linkColor" value="\${c}">
                <span></span>
              </label>\`).join('')}
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
  \`;
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
    (form.querySelector<HTMLInputElement>(\`input[name="linkType"][value="\${typeVal}"]\`) || form.querySelector<HTMLInputElement>('input[name="linkType"]')!)!.checked = true;
    const colorVal = COLORS.includes(link.color) ? link.color : COLORS[0];
    (form.querySelector<HTMLInputElement>(\`input[name="linkColor"][value="\${colorVal}"]\`) || form.querySelector<HTMLInputElement>('input[name="linkColor"]')!)!.checked = true;
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
function removeTaskById(id: string | number, list = data): boolean {
  const idx = list.findIndex(t => t.id === id);
  if (idx > -1) { list.splice(idx, 1); return true; }
  for (const t of list) {
    if (Array.isArray(t.subtask) && t.subtask.length) {
      if (removeTaskById(id, t.subtask)) return true;
    }
  }
  return false;
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
    if (real.progress === val) return notify('info', \`进度已是 \${val}%\`);
    real.progress = val;
    gantt.update({ data });
    notify('success', \`进度已设为 \${val}%\`);
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
});`

export default {
  jsCode,
  cssCode,
  dataCode
};
