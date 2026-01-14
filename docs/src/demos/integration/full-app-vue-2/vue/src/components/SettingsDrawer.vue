<template>
  <el-drawer
    v-model="visible"
    title="设置"
    direction="rtl"
    size="360px"
    class="settings-drawer"
  >
    <div class="settings-content">
      <!-- 显示设置 -->
      <div class="settings-section">
        <div class="section-title">
          <el-icon><View /></el-icon>
          <span>显示设置</span>
        </div>
        <div class="setting-item">
          <span class="setting-label">显示今天线</span>
          <el-switch v-model="localSettings.showToday" @change="emitChange" />
        </div>
        <div class="setting-item">
          <span class="setting-label">显示周末</span>
          <el-switch v-model="localSettings.showWeekend" @change="emitChange" />
        </div>
        <div class="setting-item">
          <span class="setting-label">显示假期</span>
          <el-switch v-model="localSettings.showHoliday" @change="emitChange" />
        </div>
        <div class="setting-item">
          <span class="setting-label">显示基线</span>
          <el-switch v-model="localSettings.showBaseline" @change="emitChange" />
        </div>
        <div class="setting-item">
          <span class="setting-label">显示连接线</span>
          <el-switch v-model="localSettings.showLinks" @change="emitChange" />
        </div>
      </div>

      <!-- 交互设置 -->
      <div class="settings-section">
        <div class="section-title">
          <el-icon><Pointer /></el-icon>
          <span>交互设置</span>
        </div>
        <div class="setting-item">
          <span class="setting-label">允许拖拽移动</span>
          <el-switch v-model="localSettings.allowMove" @change="emitChange" />
        </div>
        <div class="setting-item">
          <span class="setting-label">允许拖拽调整大小</span>
          <el-switch v-model="localSettings.allowResize" @change="emitChange" />
        </div>
        <div class="setting-item">
          <span class="setting-label">允许拖拽进度</span>
          <el-switch v-model="localSettings.allowProgress" @change="emitChange" />
        </div>
        <div class="setting-item">
          <span class="setting-label">允许创建连接</span>
          <el-switch v-model="localSettings.allowLink" @change="emitChange" />
        </div>
      </div>

      <!-- 外观设置 -->
      <div class="settings-section">
        <div class="section-title">
          <el-icon><Brush /></el-icon>
          <span>外观设置</span>
        </div>
        <div class="setting-item">
          <span class="setting-label">行高</span>
          <el-slider
            v-model="localSettings.rowHeight"
            :min="28"
            :max="60"
            :step="2"
            style="width: 150px"
            @change="emitChange"
          />
        </div>
        <div class="setting-item">
          <span class="setting-label">滑块高度</span>
          <el-slider
            v-model="localSettings.barHeight"
            :min="12"
            :max="32"
            :step="2"
            style="width: 150px"
            @change="emitChange"
          />
        </div>
        <div class="setting-item">
          <span class="setting-label">主题色</span>
          <el-color-picker
            v-model="localSettings.primaryColor"
            :predefine="predefineColors"
            @change="emitChange"
          />
        </div>
        <div class="setting-item">
          <span class="setting-label">默认展开</span>
          <el-switch v-model="localSettings.expandDefault" @change="emitChange" />
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="settings-section">
        <div class="section-title">
          <el-icon><Operation /></el-icon>
          <span>快捷操作</span>
        </div>
        <div class="quick-actions">
          <el-button :icon="RefreshLeft" @click="resetSettings">恢复默认</el-button>
          <el-button type="primary" :icon="Check" @click="applySettings">应用设置</el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import { View, Pointer, Brush, Operation, RefreshLeft, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { GanttSettings } from '../types'

interface Props {
  modelValue: boolean
  settings: GanttSettings
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  'update:settings': [settings: GanttSettings]
  'apply': [settings: GanttSettings]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const localSettings = reactive<GanttSettings>({ ...props.settings })

const predefineColors = [
  '#b382e7',
  '#409eff',
  '#67c23a',
  '#e6a23c',
  '#f56c6c',
  '#909399',
  '#00bcd4',
  '#ff5722'
]

watch(
  () => props.settings,
  (val) => {
    Object.assign(localSettings, val)
  },
  { deep: true }
)

function emitChange() {
  emit('update:settings', { ...localSettings })
}

function resetSettings() {
  const defaults: GanttSettings = {
    showToday: true,
    showWeekend: true,
    showHoliday: true,
    showBaseline: false,
    showLinks: true,
    showMilestone: true,
    showSummary: true,
    allowMove: true,
    allowResize: true,
    allowProgress: true,
    allowLink: true,
    allowDrag: true,
    rowHeight: 36,
    barHeight: 20,
    primaryColor: '#b382e7',
    expandDefault: true
  }
  Object.assign(localSettings, defaults)
  emitChange()
  ElMessage.success('已恢复默认设置')
}

function applySettings() {
  emit('apply', { ...localSettings })
  visible.value = false
  ElMessage.success('设置已应用')
}
</script>

<style scoped>
.settings-drawer :deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
}

.settings-drawer :deep(.el-drawer__body) {
  padding: 0;
}

.settings-content {
  padding: 16px 24px;
}

.settings-section {
  margin-bottom: 28px;
}

.settings-section:last-child {
  margin-bottom: 0;
}

.settings-section .section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.settings-section .section-title .el-icon {
  font-size: 18px;
  color: var(--primary-color);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.setting-item:not(:last-child) {
  border-bottom: 1px dashed var(--border-light);
}

.setting-item .setting-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.quick-actions {
  display: flex;
  gap: 12px;
  padding-top: 8px;
}

.quick-actions .el-button {
  flex: 1;
}
</style>
