<template>
  <div class="app-header">
    <div class="header-left">
      <div class="logo">
        <el-icon class="logo-icon">
          <Calendar />
        </el-icon>
        <span class="logo-text">XGantt Demo</span>
      </div>
      <el-tag type="success" effect="plain" size="small" class="version-tag">
        v1.0.0
      </el-tag>
    </div>

    <div class="header-center">
      <div class="project-info">
        <h1 class="project-title">{{ projectName }}</h1>
        <el-tag :type="getStatusType()" size="small" effect="light" class="status-tag">
          {{ getStatusText() }}
        </el-tag>
      </div>
    </div>

    <div class="header-right">
      <div class="time-display">
        <el-icon><Clock /></el-icon>
        <span>{{ currentTime }}</span>
      </div>
      <el-divider direction="vertical" />
      <el-button-group class="action-buttons">
        <el-tooltip content="返回今天" placement="bottom">
          <el-button :icon="Aim" @click="emit('jump-today')" />
        </el-tooltip>
        <el-tooltip content="设置" placement="bottom">
          <el-button :icon="Setting" @click="emit('open-settings')" />
        </el-tooltip>
        <el-tooltip content="导出" placement="bottom">
          <el-button :icon="Download" @click="emit('export')" />
        </el-tooltip>
        <el-tooltip :content="isDark ? '切换到亮色模式' : '切换到暗色模式'" placement="bottom">
          <el-button :icon="isDark ? Sunny : Moon" @click="emit('toggle-theme')" />
        </el-tooltip>
      </el-button-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Calendar, Clock, Aim, Setting, Download, Sunny, Moon } from '@element-plus/icons-vue'
import type { StatsData } from '../types'

interface Props {
  projectName?: string
  currentTime?: string
  stats?: StatsData
  isDark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  projectName: '项目甘特图',
  currentTime: '',
  isDark: false
})

const emit = defineEmits<{
  'jump-today': []
  'open-settings': []
  'export': []
  'toggle-theme': []
}>()

function getStatusType() {
  if (!props.stats) return 'info'
  if (props.stats.overdue > 0) return 'danger'
  if (props.stats.overallProgress >= 100) return 'success'
  if (props.stats.overallProgress > 50) return 'primary'
  return 'warning'
}

function getStatusText() {
  if (!props.stats) return '加载中...'
  if (props.stats.overdue > 0) return `${props.stats.overdue} 项超期`
  if (props.stats.overallProgress >= 100) return '已完成'
  if (props.stats.overallProgress > 0) return `进度 ${props.stats.overallProgress}%`
  return '未开始'
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 60px;
  background: linear-gradient(135deg, #b382e7 0%, #9463c9 100%);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 100;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo .logo-icon {
  font-size: 28px;
}

.logo .logo-text {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.version-tag {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  color: #fff !important;
}

.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.project-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.project-info .project-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  color: #fff;
}

.project-info .status-tag {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  color: #fff !important;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.time-display {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  opacity: 0.9;
}

.el-divider--vertical {
  height: 20px;
  border-color: rgba(255, 255, 255, 0.3);
}

.action-buttons :deep(.el-button) {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #fff;
}

.action-buttons :deep(.el-button:hover) {
  background: rgba(255, 255, 255, 0.25);
}

.action-buttons :deep(.el-button:active) {
  background: rgba(255, 255, 255, 0.35);
}
</style>
