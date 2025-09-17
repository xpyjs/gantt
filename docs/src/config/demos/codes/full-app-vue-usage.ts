const dataCode = `import { dayjs } from "@xpyjs/gantt-vue";

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

// ===== 新增：基线数据结构 =====
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
const baselineCount = 5000; // 可调：基线条目数量
// ========================= 固定随机种子，保证刷新数据不变化 =========================
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
`;

const contextComponent = `<template>
  <Teleport :to="teleportTo">
    <Transition name="el-zoom-in-top">
      <div ref="menuRef" v-show="visible" class="xcm-menu" :style="{ top: \`\${position.y}px\`, left: \`\${position.x}px\` }">
        <ul class="xcm-list">
          <template v-for="(item, index) in items" :key="index">
            <li v-if="item.divider" class="xcm-divider"></li>
            <li v-else :class="['xcm-item', { 'is-disabled': item.disabled }]" @click="clickItem(item)">
              <div class="xcm-item__inner">
                <span class="xcm-item__label">{{ item.label }}</span>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
defineOptions({ name: 'ContextMenu' })

// Types
export interface ContextMenuItem {
  label: string
  key?: string | number
  disabled?: boolean
  divider?: boolean
  action?: () => void
}

const props = withDefaults(
  defineProps<{
    /** 是否可见（v-model:visible） */
    visible: boolean
    /** 显示位置（页面坐标） */
    position: { x: number; y: number }
    /** 菜单数据 */
    items: ContextMenuItem[]
    /** Teleport 目标 */
    teleportTo?: string | HTMLElement
  }>(),
  {
    teleportTo: 'body',
  }
)

const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void
}>()

const menuRef = ref<HTMLElement | null>(null);

const visible = computed(() => props.visible)
function close() {
  if (!visible.value) return
  emit('update:visible', false)
}

function clickItem(item: ContextMenuItem) {
  if (item.disabled) return
  if (item.action) {
    item.action()
  }
  close()
}

function onKeydown(e: KeyboardEvent) {
  if (!visible.value) return
  if (e.key === 'Escape') {
    e.stopPropagation()
    close()
  }
}
function onResize() {
  if (!visible.value) return
}
function onScroll() {
  if (!visible.value) return
  close()
}
function onBlur() {
  if (!visible.value) return
  close()
}
function onContextMenu() {
  if (!visible.value) return
  close()
}
function onClick(e: MouseEvent) {
  if (!visible.value) return
  if (e.target === menuRef.value || menuRef.value?.contains(e.target as Node)) {
    return;
  }

  close()
}

function bindGlobal() {
  window.addEventListener('keydown', onKeydown, true)
  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true, capture: true })
  window.addEventListener('contextmenu', onContextMenu, true)
  window.addEventListener('blur', onBlur)
  window.addEventListener('click', onClick, true);
}
function unbindGlobal() {
  window.removeEventListener('keydown', onKeydown, true)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('contextmenu', onContextMenu, true)
  window.removeEventListener('blur', onBlur)
  window.removeEventListener('click', onClick, true);
}

onMounted(() => bindGlobal())
onBeforeUnmount(() => unbindGlobal())
</script>

<style scoped>
.xcm-menu {
  position: fixed;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  box-shadow: var(--el-box-shadow-light);
  min-width: 140px;
  overflow: hidden;
  z-index: 999999;
}

.xcm-list {
  list-style: none;
  padding: 6px 4px;
  margin: 0;
}

.xcm-divider {
  height: 1px;
  margin: 6px 4px;
  background: var(--el-border-color);
}

.xcm-item {
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--el-text-color-regular);
}

.xcm-item.is-disabled {
  color: var(--el-text-color-placeholder);
  cursor: not-allowed;
}

.xcm-item:not(.is-disabled):hover {
  background: var(--el-fill-color-light);
}

.xcm-item__inner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
}

.xcm-item__label {
  flex: 1 1 auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
`

const vueCode = `<template>
  <div class="container">
    <div class="toolbar">
      <el-popover placement="bottom" trigger="click" popper-class="jump-date-popover">
        <template #reference>
          <el-button type="primary">跳转到</el-button>
        </template>
        <el-date-picker-panel v-model="selectedDate"
          :shortcuts="[{ text: '今天', value: () => { return new Date() } }]" />
      </el-popover>

      <el-button type="primary" @click="createTask()">添加任务</el-button>
    </div>

    <XGanttVue ref="ganttRef" :options="ganttOptions" style="flex: 1" @contextmenu:row="onContextmenuRow"
      @contextmenu:slider="onContextmenuSlider" />

    <div class="footer">
      <span>当前数据：{{ (ganttRef?.getInstance() as any)?.context.store.getDataManager().getVisibleSize() }} 条</span>

      <div style="flex: 1; display: flex; align-items: center; justify-content: flex-end; gap: 16px;">
        <span style="color: #999">演示版本 v0.0.1</span>
        <span style="color: #999" id="footer-time">北京时间：{{ currentTime }}</span>
      </div>
    </div>

    <el-dialog title="添加任务" v-model="createTaskDialogVisible" :close-on-click-modal="false" width="30%">
      <el-form :model="form">
        <el-form-item label="任务名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="开始时间" :label-width="formLabelWidth">
          <el-date-picker v-model="form.start" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="结束时间" :label-width="formLabelWidth">
          <el-date-picker v-model="form.end" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="进度(%)" :label-width="formLabelWidth">
          <el-input-number v-model="form.progress" :min="0" :max="100" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createTaskDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addTask">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <ContextMenu v-model:visible="contextMenuVisible" :position="contextMenuPosition" :items="contextMenuItems" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from "vue";
import { XGanttVue, dayjs, IOptions } from "@xpyjs/gantt-vue";
import "@xpyjs/gantt-vue/style.css";
import { data, links, baselines, DATE_FMT, generateId } from './data';
import { ElMessageBox } from "element-plus";
import ContextMenu, { type ContextMenuItem } from "./components/contextMenu/ContextMenu.vue";

const ganttData = reactive(data);

const ganttOptions = reactive<IOptions>({
  primaryColor: '#54bd8a',
  data: ganttData,
  dateFormat: DATE_FMT,
  fields: {
    id: 'id',
    startTime: "start",
    endTime: "end",
    name: 'name',
    progress: 'progress',
    children: "subtask",
    type: 'type'
  },
  links: {
    show: true,
    data: links,
  },
  baselines: {
    show: true,
    data: baselines,
  },
  table: {
    columns: [
      { field: "name", label: "任务名称", width: 230, align: 'left' },
      {
        label: "工期",
        children: [
          { field: "start", label: "开始时间", width: 120 },
          { field: "end", label: "结束时间", width: 120 },
        ]
      },
      { field: "progress", label: "进度(%)", width: 90 }
    ]
  },
  bar: {
    move: {
      enabled: true,
      byUnit: true
    }
  }
})
const ganttRef = ref<InstanceType<typeof XGanttVue> | null>(null);

const selectedDate = ref();
watch(selectedDate, (newVal) => {
  ganttRef.value?.jumpTo(newVal);
})

const createTaskDialogVisible = ref(false);
const formLabelWidth = '80px';
const form = reactive({
  name: '',
  start: '',
  end: '',
  progress: 0,
  parentId: ''
});
function addTask() {
  if (!form.name) {
    ElMessageBox.alert('任务名称不能为空', '提示');
    return;
  }
  if (!form.start) {
    ElMessageBox.alert('开始时间不能为空', '提示');
    return;
  }
  if (!form.end) {
    ElMessageBox.alert('结束时间不能为空', '提示');
    return;
  }
  if (new Date(form.start).getTime() > new Date(form.end).getTime()) {
    ElMessageBox.alert('结束时间不能小于开始时间', '提示');
    return;
  }

  const add = (list: any[]) => {
    list.push({
      id: generateId(),
      name: form.name,
      start: form.start,
      end: form.end,
      progress: form.progress,
      type: 'task'
    });
    createTaskDialogVisible.value = false;
    form.name = '';
    form.start = '';
    form.end = '';
    form.progress = 0;
    form.parentId = '';
  };

  if (form.parentId) {
    const parent = getTaskById(form.parentId, ganttData);
    if (parent) {
      if (!Array.isArray(parent.subtask)) parent.subtask = [];
      add(parent.subtask);
      return;
    }
  }

  add(ganttData);
}

function createTask(parentId?: string) {
  form.parentId = parentId || '';
  createTaskDialogVisible.value = true;
}

const currentTime = ref(dayjs().format(DATE_FMT));
onMounted(() => {
  setInterval(() => {
    currentTime.value = dayjs().format(DATE_FMT);
  }, 1000);
});

function getTaskById(id: string | number, list = data): any | null {
  for (const t of list) {
    if (t.id === id) return t;
    if (Array.isArray(t.subtask) && t.subtask.length) {
      const found = getTaskById(id, t.subtask);
      if (found) return found;
    }
  }
  return null;
}

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

// 右键菜单
const contextMenuVisible = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const contextMenuItems = ref<ContextMenuItem[]>([]);

const onContextmenuRow = (event: MouseEvent, row: any) => {
  contextMenuPosition.value = { x: event.clientX, y: event.clientY };
  contextMenuItems.value = [
    {
      label: '添加子任务',
      action: () => {
        createTask(row.id);
      }
    },
    {
      label: '删除任务',
      action: () => {
        ElMessageBox.confirm('确定删除该任务吗？', '提示', {
          type: 'warning'
        }).then(() => {
          removeTaskById(row.id, ganttData);
        }).catch(() => { });
      }
    }
  ];
  contextMenuVisible.value = true;
};

const onContextmenuSlider = (event: MouseEvent, task: any) => {
  contextMenuPosition.value = { x: event.clientX, y: event.clientY };
  contextMenuItems.value = [
    {
      label: '查看当前所有关联',
      action: () => {
        const dataChain = ganttRef.value?.getDataChain(task.id);
        console.log('当前任务数据链：', dataChain);
        ElMessageBox.alert('在 F12 中查看', '消息');
      }
    }
  ];
  contextMenuVisible.value = true;
};
</script>

<style lang="css">
body,
html,
#app,
.container {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.container {
  display: flex;
  flex-direction: column;
}

.toolbar {
  height: 40px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.footer {
  height: 24px;
  background-color: #f0f0f0;
  border-top: 1px solid #e0e0e0;
  box-sizing: border-box;
  line-height: 24px;
  font-size: 14px;
  color: #888;
  display: flex;
  align-items: center;
  padding: 5px 12px;
}

.jump-date-popover {
  width: unset !important;
  padding: 0 !important;
}
</style>
`

const mainTsCode = `import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App);

app.use(ElementPlus, { locale: zhCn });
app.mount("#app");`

export default {
    dataCode,
    contextComponent,
    vueCode,
    mainTsCode
}