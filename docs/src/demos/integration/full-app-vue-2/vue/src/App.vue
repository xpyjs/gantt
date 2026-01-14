<template>
  <div class="app-container">
    <!-- 顶部头部 -->
    <AppHeader :project-name="projectName" :current-time="currentTime" :stats="stats" :is-dark="isDark"
      @jump-today="handleJumpToday" @open-settings="settingsVisible = true" @export="handleExport"
      @toggle-theme="handleToggleTheme" />

    <!-- 主内容区域 -->
    <div class="app-main">
      <!-- 左侧统计面板 -->
      <aside class="sidebar">
        <StatsPanel :stats="stats" />

        <!-- 快捷操作 -->
        <div class="quick-actions card">
          <h3>快捷操作</h3>
          <div class="action-list">
            <el-button type="primary" :icon="Plus" @click="handleAddTask" block>
              新建任务
            </el-button>
            <el-button :icon="Aim" @click="handleJumpToday" block>
              返回今天
            </el-button>
            <el-button :icon="Expand" @click="handleExpandAll" block>
              展开信息
            </el-button>
            <el-button :icon="Fold" @click="handleCollapseAll" block>
              缩略信息
            </el-button>
          </div>
        </div>

        <!-- 图例说明 -->
        <div class="legend card">
          <h3>图例说明</h3>
          <div class="legend-list">
            <div class="legend-item">
              <span class="legend-color" style="background: #67c23a"></span>
              <span>已完成</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background: #409eff"></span>
              <span>进行中</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background: #e6a23c"></span>
              <span>待开始</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background: #f56c6c"></span>
              <span>已超期</span>
            </div>
            <div class="legend-item">
              <span class="legend-color">⭐</span>
              <span>里程碑</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- 右侧主内容 -->
      <div class="content-area">
        <!-- 工具栏 -->
        <Toolbar :unit="currentUnit" :show-links="settings.showLinks" :show-progress="settings.allowProgress"
          :show-baseline="settings.showBaseline" :show-weekend="settings.showWeekend" :unit-options="unitOptions"
          @add-task="handleAddTask" @expand-all="handleExpandAll" @collapse-all="handleCollapseAll"
          @change-unit="handleChangeUnit" @search="handleSearch" @toggle-links="handleToggleLinks"
          @toggle-progress="handleToggleProgress" @toggle-baseline="handleToggleBaseline"
          @toggle-weekend="handleToggleWeekend" @more-action="handleMoreAction" />

        <!-- 甘特图主体 -->
        <div class="gantt-wrapper card">
          <XGanttVue ref="ganttRef" :options="ganttOptions" @loaded="handleLoaded" @click:row="handleRowClick"
            @dblclick:row="handleRowDblClick" @contextmenu:row="handleContextMenu" @click:slider="handleSliderClick"
            @contextmenu:slider="handleSliderContextMenu" @move="handleMove" @update:link="handleUpdateLink"
            @create:link="handleCreateLink" @select:link="handleSelectLink" />
        </div>

        <!-- 状态栏 -->
        <div class="status-bar card">
          <div class="status-left">
            <el-tag effect="plain" size="small">
              <el-icon>
                <Document />
              </el-icon>
              共 {{ stats.total }} 项任务
            </el-tag>
            <el-tag effect="plain" type="success" size="small">
              <el-icon>
                <CircleCheckFilled />
              </el-icon>
              {{ stats.completed }} 已完成
            </el-tag>
            <el-tag effect="plain" type="primary" size="small"
              style="--el-tag-text-color: #409eff; --el-tag-border-color: #b4d8fd;">
              <el-icon>
                <Loading />
              </el-icon>
              {{ stats.inProgress }} 进行中
            </el-tag>
            <el-tag v-if="stats.overdue > 0" effect="dark" type="danger" size="small">
              <el-icon>
                <WarningFilled />
              </el-icon>
              {{ stats.overdue }} 已超期
            </el-tag>
          </div>
          <div class="status-right">
            <span class="zoom-label">缩放级别：</span>
            <el-tag type="info" size="small">{{ getUnitLabel(currentUnit) }}</el-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 任务对话框 -->
    <TaskDialog v-model="taskDialogVisible" :task="currentTask" @submit="handleTaskSubmit" />

    <!-- 设置抽屉 -->
    <SettingsDrawer v-model="settingsVisible" :settings="settings" @update:settings="handleSettingsUpdate"
      @apply="handleSettingsApply" />

    <!-- 右键菜单 -->
    <ContextMenu v-model="contextMenuVisible" :task="contextMenuTask" :position="contextMenuPosition"
      @action="handleContextAction" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, defineComponent, h, render } from 'vue'
import { ElIcon, ElMessage, ElMessageBox, ElTooltip } from 'element-plus'
import {
  Plus,
  Aim,
  Expand,
  Fold,
  Document,
  CircleCheckFilled,
  Loading,
  WarningFilled,
  QuestionFilled
} from '@element-plus/icons-vue'
import { XGanttVue, dayjs, type XGanttUnit, type XGanttVueProps } from '@xpyjs/gantt-vue'

// 组件
import AppHeader from './components/AppHeader.vue'
import Toolbar from './components/Toolbar.vue'
import StatsPanel from './components/StatsPanel.vue'
import TaskDialog from './components/TaskDialog.vue'
import ContextMenu from './components/ContextMenu.vue'
import SettingsDrawer from './components/SettingsDrawer.vue'

// hooks
import { useGanttRef, useViewUnit, useTaskStats, useCurrentTime } from './hooks/useGantt'

// 数据
import {
  projectData,
  projectLinks,
  projectBaselines,
  holidays,
  defaultSettings
} from './data'

// 类型
import type { TaskData, GanttSettings } from './types'

// 样式
import './styles/index.css'
import "@xpyjs/gantt-vue/style.css";

// ===== 基础数据 =====
const projectName = ref('XGantt Pro 演示项目')
const tasks = ref<TaskData[]>([...projectData])
const links = ref([...projectLinks])
const baselines = ref([...projectBaselines])

// ===== Hooks =====
const { ganttRef, jumpTo, scrollTo, removeDataById, getInstance } = useGanttRef()
const { currentUnit, unitOptions, setUnit } = useViewUnit('day')
const { stats } = useTaskStats(tasks)
const { currentTime, start: startTimer, stop: stopTimer } = useCurrentTime()

// ===== UI 状态 =====
const taskDialogVisible = ref(false)
const settingsVisible = ref(false)
const contextMenuVisible = ref(false)
const currentTask = ref<TaskData | null>(null)
const contextMenuTask = ref<TaskData | null>(null)
const contextMenuPosition = ref({ x: 0, y: 0 })
const isDark = ref(false)

// ===== 设置 =====
const settings = reactive<GanttSettings>({ ...defaultSettings })

// ===== 甘特图配置 =====
type TC = NonNullable<NonNullable<XGanttVueProps['options']['table']>['columns']>[number] & { __show?: boolean };
const expandAll = ref(true);
const tableColumns = computed(() => ([
  {
    field: 'name',
    label: '任务名称',
    width: 220,
  },
  {
    field: 'assignee',
    label: '负责人',
    width: 80,
    align: 'center' as const
  },
  {
    __show: expandAll.value,
    label: '时间范围',
    children: [
      {
        field: 'startTime',
        label: '开始时间',
        width: 100,
        align: 'center' as const,
        render: row => dayjs(row.data.startTime).format('MM-DD')
      },
      {
        field: 'endTime',
        label: '结束时间',
        width: 100,
        align: 'center' as const,
        render: row => {
          const fullTime = dayjs(row.data.endTime).format('YYYY-MM-DD HH:mm')
          const shortTime = dayjs(row.data.endTime).format('MM-DD')

          // 1. 创建一个原生的 div 容器
          const container = document.createElement('div')

          // 2. 使用 Vue 的 h 函数创建组件虚拟节点
          const vnode = h(ElTooltip, {
            content: fullTime,
            placement: 'top',
            showAfter: 300
          }, {
            default: () => h('span', {
            }, shortTime)
          })

          // 3. 将虚拟节点渲染到容器中
          render(vnode, container)

          // 4. 返回原生 DOM 元素
          return container
        },
        headerRender() {
          const container = document.createElement('div')
          // 在 结束时间 后面写一个 问号图标，鼠标移入显示 tooltip 提示内容：结束时间以实际为准，如果为 25号0点0分，则会显示在25号。如果需要全天，请使用 24号23点59分59秒（实际根据你需要的时间精度）。
          const vnode = h('span', {}, [
            '结束时间',
            h(ElTooltip, {
              content: '结束时间以实际为准，如果为 25号0点0分，则会显示在25号。如果需要全天，请使用 24号23点59分59秒（实际根据你需要的时间精度）。',
              placement: 'top',
              showAfter: 300
            }, {
              default: () => h(ElIcon, {
                style: 'cursor: pointer; margin-left: 2px'
              }, {
                default: () => h(QuestionFilled)
              })
            })
          ])
          render(vnode, container)
          return container
        },
      }
    ]
  },
  {
    __show: expandAll.value,
    field: 'progress',
    label: '进度',
    width: 80,
    align: 'center' as const,
    render: row => `${row.data.progress ?? 0}%`
  }
] as TC[]).filter(col => col.__show !== false));

const ganttOptions = computed<XGanttVueProps['options']>(() => ({
  // 数据源
  data: tasks.value,

  // 字段映射
  fields: {
    id: 'id',
    name: 'name',
    startTime: 'startTime',
    endTime: 'endTime',
    progress: 'progress',
    children: 'children',
    type: 'type'
  },

  resize: {
    enabled: true
  },

  // 主题色
  primaryColor: settings.primaryColor,

  // 边框样式
  border: {
    color: isDark.value ? '#3d3d3d' : '#e5e5e5',
  },

  // 收起按钮样式
  collapse: {
    backgroundColor: isDark.value ? '#2c2c2c' : '#fff',
  },

  // 时间单位
  unit: currentUnit.value,

  // 链接配置
  links: {
    data: links.value,
    show: settings.showLinks,
    move: {
      enabled: settings.allowMove
    },
    create: {
      enabled: settings.allowLink,
      mode: 'hover' as const,
      from: 'F' as const,
      to: 'S' as const
    }
  },

  // 基线配置
  baselines: {
    data: baselines.value,
    show: settings.showBaseline,
    taskKey: 'taskId',
    height: 2,
    compare: {
      enabled: true,
      tolerance: 0,
      indicator: {
        show: 'end',
        position: 'top',
        ahead: {
          text: (diff, e) => `提前${Math.abs(diff)}天`
        },
        delayed: {
          text: (diff, e) => `滞后${Math.abs(diff)}天`
        }
      }
    }
  },

  // 表格配置
  table: {
    show: true,
    columns: tableColumns.value
  },

  chart: {
    endTime: '2026-02-15'
  },

  // 行配置
  row: {
    height: settings.rowHeight
  },

  // 条形图配置
  bar: {
    height: settings.barHeight,
    // 使用函数返回自定义标签
    label: (row: { data: TaskData }) => {
      const task = row.data
      const progress = task.progress ?? 0
      if (progress === 100) return '✅'
      if (progress > 0) return `${task.name} (${progress}%)`
      return task.name
    },
    move: {
      enabled: settings.allowMove,
      byUnit: true,
      link: {
        child: 'none' as const,
        parent: 'none' as const
      }
    },
    backgroundColor(row) {
      const task = row.data
      if (task.type === 'milestone') return task.color;
      if (task.status === 'completed') return '#67c23a' // 绿色
      if (task.status === 'active') return '#409eff' // 蓝色
      if (task.status === 'pending') return '#e6a23c' // 橙色
    },
    progress: {
      show: settings.allowProgress,
      color: 'transparent'
    }
  },

  flag: {
    show: true,
    data: [
      {
        date: '2026-02-13',
        content: '🚩上线',
        backgroundColor: '#f56c6c'
      }
    ]
  },

  // 其他配置
  today: {
    show: settings.showToday
  },
  weekend: {
    show: settings.showWeekend
  },
  holiday: {
    data: holidays,
    show: settings.showHoliday
  },
  expand: {
    show: true,
    enabled: settings.expandDefault
  },
  milestone: {
    show: settings.showMilestone,
    size: 13,
    shape: 'star',
    color: row => row.data.color
  },
  summary: {
    show: settings.showSummary
  },
  scrollbar: {
    thumb: {
      color: isDark.value ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
    }
  }
}))

// ===== 方法 =====

function getUnitLabel(unit: XGanttUnit): string {
  const map: Record<XGanttUnit, string> = {
    hour: '小时',
    day: '天',
    week: '周',
    month: '月',
    quarter: '季度'
  }
  return map[unit] || unit
}

// 跳转到今天
function handleJumpToday() {
  jumpTo()
  ElMessage.success('已跳转到今天')
}

// 添加任务
function handleAddTask() {
  currentTask.value = null
  taskDialogVisible.value = true
}

// 展开全部
function handleExpandAll() {
  expandAll.value = true
  ElMessage.success('已展开表格')
}

// 折叠全部
function handleCollapseAll() {
  expandAll.value = false
  ElMessage.success('已折叠表格')
}

// 切换单位
function handleChangeUnit(unit: XGanttUnit) {
  setUnit(unit)
  ElMessage.info(`已切换为 ${getUnitLabel(unit)} 视图`)
}

// 搜索
function handleSearch(keyword: string) {
  if (!keyword) {
    ElMessage.info('搜索已清空')
    return
  }

  // 查找并高亮匹配的任务
  const findTask = (items: TaskData[]): TaskData | null => {
    for (const item of items) {
      if (item.name.toLowerCase().includes(keyword.toLowerCase())) {
        return item
      }
      if (item.children?.length) {
        const found = findTask(item.children)
        if (found) return found
      }
    }
    return null
  }

  const found = findTask(tasks.value)
  if (found) {
    scrollTo(found.id, true)
    ElMessage.success(`找到任务: ${found.name}`)
  } else {
    ElMessage.warning('未找到匹配的任务')
  }
}

// 切换开关
function handleToggleLinks(show: boolean) {
  settings.showLinks = show
}

function handleToggleProgress(show: boolean) {
  settings.allowProgress = show
}

function handleToggleBaseline(show: boolean) {
  settings.showBaseline = show
}

function handleToggleWeekend(show: boolean) {
  settings.showWeekend = show
}

// 更多操作
function handleMoreAction(command: string) {
  switch (command) {
    case 'refresh':
      tasks.value = [...projectData]
      links.value = [...projectLinks]
      ElMessage.success('数据已刷新')
      break
    case 'stats':
      ElMessageBox.alert(
        `<div style="line-height: 2">
          <p><strong>总任务数：</strong>${stats.value.total}</p>
          <p><strong>已完成：</strong>${stats.value.completed}</p>
          <p><strong>进行中：</strong>${stats.value.inProgress}</p>
          <p><strong>待开始：</strong>${stats.value.pending}</p>
          <p><strong>已超期：</strong>${stats.value.overdue}</p>
          <p><strong>里程碑：</strong>${stats.value.milestones}</p>
          <p><strong>整体进度：</strong>${stats.value.overallProgress}%</p>
        </div>`,
        '项目统计',
        { dangerouslyUseHTMLString: true }
      )
      break
    case 'help':
      ElMessageBox.alert(
        `<div style="line-height: 1.8">
          <p><strong>🎯 XGantt 功能演示</strong></p>
          <p>• 拖拽任务条可以移动任务时间</p>
          <p>• 拖拽任务条两端可以调整时间范围</p>
          <p>• 拖拽进度条可以调整任务进度</p>
          <p>• 从任务条边缘拖出可以创建连接线</p>
          <p>• 右键点击任务可以打开操作菜单</p>
          <p>• 双击任务可以编辑任务详情</p>
        </div>`,
        '使用帮助',
        { dangerouslyUseHTMLString: true }
      )
      break
  }
}

// 导出
function handleExport() {
  ElMessage.info('导出功能开发中...')
}

// 切换主题
function handleToggleTheme() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  ElMessage.success(isDark.value ? '已切换到暗色模式' : '已切换到亮色模式')
}

// 甘特图事件处理
function handleLoaded() {
  console.log('甘特图实例:', getInstance())
  ElMessage.success('甘特图加载完成')
}

function handleRowClick(_e: MouseEvent, data: TaskData) {
  console.log('点击行:', data.name)
}

function handleRowDblClick(_e: MouseEvent, data: TaskData) {
  currentTask.value = { ...data }
  taskDialogVisible.value = true
}

function handleContextMenu(e: MouseEvent, data: TaskData) {
  contextMenuTask.value = data
  contextMenuPosition.value = { x: e.clientX, y: e.clientY }
  contextMenuVisible.value = true
}

function handleSliderClick(_e: MouseEvent, data: TaskData) {
  console.log('点击滑块:', data.name)
}

function handleSliderContextMenu(e: MouseEvent, data: TaskData) {
  // 滑块右键菜单与行右键菜单共用
  contextMenuTask.value = data
  contextMenuPosition.value = { x: e.clientX, y: e.clientY }
  contextMenuVisible.value = true
}

function handleMove(data: { row: TaskData; old: TaskData }[]) {
  if (data.length > 0) {
    const task = data[0].row
    ElMessage.success(`任务 "${task.name}" 时间已更新`)
  }
}

function handleUpdateLink(link: unknown) {
  console.log('链接更新:', link)
}

function handleCreateLink(link: unknown) {
  ElMessage.success('链接创建成功')
  console.log('新链接:', link)
}

function handleSelectLink(add: unknown, cancel: unknown, all: unknown[]) {
  console.log('选中链接:', { add, cancel, all })
}

// 任务对话框提交
function handleTaskSubmit(data: Partial<TaskData>) {
  if (currentTask.value) {
    // 编辑模式
    const updateTask = (items: TaskData[]) => {
      for (const item of items) {
        if (item.id === currentTask.value?.id) {
          Object.assign(item, data)
          return true
        }
        if (item.children?.length && updateTask(item.children)) {
          return true
        }
      }
      return false
    }
    updateTask(tasks.value)
    tasks.value = [...tasks.value]
    ElMessage.success('任务更新成功')
  } else {
    // 新增模式
    const newTask: TaskData = {
      id: `task-${Date.now()}`,
      name: data.name || '新任务',
      startTime: data.startTime || dayjs().format('YYYY-MM-DD HH:mm:ss'),
      endTime: data.endTime || dayjs().add(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
      progress: data.progress || 0,
      type: data.type || 'task',
      assignee: data.assignee,
      priority: data.priority,
      status: data.status
    }
    tasks.value.push(newTask)
    tasks.value = [...tasks.value]
    ElMessage.success('任务创建成功')
  }
}

// 设置更新
function handleSettingsUpdate(newSettings: GanttSettings) {
  Object.assign(settings, newSettings)
}

function handleSettingsApply(newSettings: GanttSettings) {
  Object.assign(settings, newSettings)

  // 如果主题色变化，更新 CSS 变量
  if (newSettings.primaryColor !== defaultSettings.primaryColor) {
    document.documentElement.style.setProperty('--primary-color', newSettings.primaryColor)
  }
}

// 右键菜单操作
function handleContextAction(action: string, task: TaskData | null) {
  if (!task) return

  switch (action) {
    case 'view':
      ElMessageBox.alert(
        `<div style="line-height: 1.8">
          <p><strong>任务ID：</strong>${task.id}</p>
          <p><strong>任务名称：</strong>${task.name}</p>
          <p><strong>开始时间：</strong>${dayjs(task.startTime).format('YYYY-MM-DD HH:mm')}</p>
          <p><strong>结束时间：</strong>${dayjs(task.endTime).format('YYYY-MM-DD HH:mm')}</p>
          <p><strong>进度：</strong>${task.progress ?? 0}%</p>
          <p><strong>负责人：</strong>${task.assignee || '未分配'}</p>
          <p><strong>状态：</strong>${task.status || '未知'}</p>
        </div>`,
        '任务详情',
        { dangerouslyUseHTMLString: true }
      )
      break
    case 'edit':
      currentTask.value = { ...task }
      taskDialogVisible.value = true
      break
    case 'addChild':
      currentTask.value = null
      taskDialogVisible.value = true
      break
    case 'duplicate':
      const newTask: TaskData = {
        ...task,
        id: `task-${Date.now()}`,
        name: `${task.name} (副本)`
      }
      tasks.value.push(newTask)
      tasks.value = [...tasks.value]
      ElMessage.success('任务已复制')
      break
    case 'jumpTo':
      scrollTo(task.id)
      break
    case 'highlight':
      scrollTo(task.id, true)
      ElMessage.success(`已高亮显示任务: ${task.name}`)
      break
    case 'delete':
      ElMessageBox.confirm(
        `确定要删除任务 "${task.name}" 吗？`,
        '删除确认',
        { type: 'warning' }
      ).then(() => {
        removeDataById(task.id)
        // 同步删除本地数据
        const deleteTask = (items: TaskData[]): boolean => {
          const index = items.findIndex(item => item.id === task.id)
          if (index !== -1) {
            items.splice(index, 1)
            return true
          }
          for (const item of items) {
            if (item.children?.length && deleteTask(item.children)) {
              return true
            }
          }
          return false
        }
        deleteTask(tasks.value)
        tasks.value = [...tasks.value]
        ElMessage.success('任务已删除')
      }).catch(() => {
        // 取消删除
      })
      break
  }
}

// ===== 生命周期 =====
onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: var(--bg-secondary);
}

.app-main {
  flex: 1;
  display: flex;
  padding: 16px;
  gap: 16px;
  overflow: hidden;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.gantt-wrapper {
  flex: 1;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.quick-actions {
  padding: 16px;
}
.quick-actions h3 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}
.quick-actions .action-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.quick-actions .action-list .el-button {
  width: 100%;
  justify-content: flex-start;
  margin-left: 0;
}

.legend {
  padding: 16px;
}
.legend h3 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.legend-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}
.legend .legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
}
.status-bar.status-left,
.status-bar.status-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.status-bar .el-tag {
  display: flex;
  align-items: center;
  gap: 4px;
}
.status-bar .zoom-label {
  font-size: 13px;
  color: var(--text-tertiary);
}

.card {
  background: var(--bg-card);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: background-color 0.3s ease;
}

.dark .app-container {
  background: var(--bg-secondary);
}

.dark .card {
  background: var(--bg-card);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.dark .quick-actions h3,
.dark .legend h3 {
  color: var(--text-primary);
}

.dark .legend-item {
  color: var(--text-secondary);
}
</style>
