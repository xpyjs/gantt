<template>
  <div class="toolbar-card card">
    <div class="toolbar-left">
      <el-button-group>
        <el-tooltip content="添加任务" placement="bottom">
          <el-button type="primary" :icon="Plus" @click="emit('add-task')">
            新建
          </el-button>
        </el-tooltip>
        <el-tooltip content="展开全部" placement="bottom">
          <el-button :icon="Expand" @click="emit('expand-all')" />
        </el-tooltip>
        <el-tooltip content="折叠全部" placement="bottom">
          <el-button :icon="Fold" @click="emit('collapse-all')" />
        </el-tooltip>
      </el-button-group>

      <el-divider direction="vertical" />

      <el-radio-group v-model="localUnit" size="default" @change="handleUnitChange">
        <el-radio-button
          v-for="item in unitOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <div class="toolbar-center">
      <el-input
        v-model="searchText"
        placeholder="搜索任务..."
        :prefix-icon="Search"
        clearable
        style="width: 240px"
        @input="handleSearch"
      />
    </div>

    <div class="toolbar-right">
      <div class="feature-toggles">
        <el-tooltip content="显示连线" placement="bottom">
          <div class="toggle-item">
            <el-icon :class="{ active: localShowLinks }"><Link /></el-icon>
            <el-switch
              v-model="localShowLinks"
              size="small"
              @change="emit('toggle-links', $event as boolean)"
            />
          </div>
        </el-tooltip>
        <el-tooltip content="显示进度" placement="bottom">
          <div class="toggle-item">
            <el-icon :class="{ active: localShowProgress }"><TrendCharts /></el-icon>
            <el-switch
              v-model="localShowProgress"
              size="small"
              @change="emit('toggle-progress', $event as boolean)"
            />
          </div>
        </el-tooltip>
        <el-tooltip content="显示基线" placement="bottom">
          <div class="toggle-item">
            <el-icon :class="{ active: localShowBaseline }"><Grid /></el-icon>
            <el-switch
              v-model="localShowBaseline"
              size="small"
              @change="emit('toggle-baseline', $event as boolean)"
            />
          </div>
        </el-tooltip>
        <el-tooltip content="显示周末" placement="bottom">
          <div class="toggle-item">
            <el-icon :class="{ active: localShowWeekend }"><Calendar /></el-icon>
            <el-switch
              v-model="localShowWeekend"
              size="small"
              @change="emit('toggle-weekend', $event as boolean)"
            />
          </div>
        </el-tooltip>
      </div>

      <el-divider direction="vertical" />

      <el-dropdown trigger="click" @command="handleMoreAction">
        <el-button :icon="MoreFilled" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="refresh" :icon="Refresh">刷新数据</el-dropdown-item>
            <el-dropdown-item command="stats" :icon="DataAnalysis">查看统计</el-dropdown-item>
            <el-dropdown-item command="help" :icon="QuestionFilled">帮助文档</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Plus,
  Expand,
  Fold,
  Search,
  Link,
  TrendCharts,
  Grid,
  Calendar,
  MoreFilled,
  Refresh,
  DataAnalysis,
  QuestionFilled
} from '@element-plus/icons-vue'
import type { XGanttUnit } from '@xpyjs/gantt-vue'

interface Props {
  unit?: XGanttUnit
  showLinks?: boolean
  showProgress?: boolean
  showBaseline?: boolean
  showWeekend?: boolean
  unitOptions?: { label: string; value: XGanttUnit }[]
}

const props = withDefaults(defineProps<Props>(), {
  unit: 'day',
  showLinks: true,
  showProgress: true,
  showBaseline: false,
  showWeekend: true,
  unitOptions: () => [
    { label: '时', value: 'hour' },
    { label: '日', value: 'day' },
    { label: '周', value: 'week' },
    { label: '月', value: 'month' },
    { label: '季', value: 'quarter' }
  ]
})

const emit = defineEmits<{
  'add-task': []
  'expand-all': []
  'collapse-all': []
  'change-unit': [unit: XGanttUnit]
  'search': [text: string]
  'toggle-links': [show: boolean]
  'toggle-progress': [show: boolean]
  'toggle-baseline': [show: boolean]
  'toggle-weekend': [show: boolean]
  'more-action': [command: string]
}>()

const searchText = ref('')
const localUnit = ref<XGanttUnit>(props.unit)
const localShowLinks = ref(props.showLinks)
const localShowProgress = ref(props.showProgress)
const localShowBaseline = ref(props.showBaseline)
const localShowWeekend = ref(props.showWeekend)

watch(
  () => props.unit,
  (val) => {
    localUnit.value = val
  }
)

watch(
  () => props.showLinks,
  (val) => {
    localShowLinks.value = val
  }
)

watch(
  () => props.showProgress,
  (val) => {
    localShowProgress.value = val
  }
)

watch(
  () => props.showBaseline,
  (val) => {
    localShowBaseline.value = val
  }
)

watch(
  () => props.showWeekend,
  (val) => {
    localShowWeekend.value = val
  }
)

function handleUnitChange(val: XGanttUnit) {
  emit('change-unit', val)
}

function handleSearch(val: string) {
  emit('search', val)
}

function handleMoreAction(command: string) {
  emit('more-action', command)
}
</script>

<style scoped>
.toolbar-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  gap: 16px;
}

.toolbar-left,
.toolbar-center,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.el-divider--vertical {
  height: 24px;
  margin: 0 4px;
}

.feature-toggles {
  display: flex;
  align-items: center;
  gap: 12px;
}

.feature-toggles .toggle-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.feature-toggles .toggle-item .el-icon {
  font-size: 16px;
  color: var(--text-tertiary);
  transition: color 0.2s ease;
}

.feature-toggles .toggle-item .el-icon.active {
  color: var(--primary-color);
}

.feature-toggles .toggle-item:hover {
  border-color: var(--primary-light);
}

.el-radio-group :deep(.el-radio-button__inner) {
  padding: 8px 14px;
}

.el-radio-group :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}
</style>
