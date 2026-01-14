<template>
  <teleport to="body">
    <transition name="context-menu">
      <div
        v-if="visible"
        class="context-menu"
        :style="{ left: position.x + 'px', top: position.y + 'px' }"
        @contextmenu.prevent
      >
        <div class="context-menu-content">
          <div class="menu-item" @click="handleAction('view')">
            <el-icon><View /></el-icon>
            <span>查看详情</span>
          </div>
          <div class="menu-item" @click="handleAction('edit')">
            <el-icon><Edit /></el-icon>
            <span>编辑任务</span>
          </div>
          <div class="menu-divider"></div>
          <div class="menu-item" @click="handleAction('addChild')">
            <el-icon><Plus /></el-icon>
            <span>添加子任务</span>
          </div>
          <div class="menu-item" @click="handleAction('duplicate')">
            <el-icon><CopyDocument /></el-icon>
            <span>复制任务</span>
          </div>
          <div class="menu-divider"></div>
          <div class="menu-item" @click="handleAction('jumpTo')">
            <el-icon><Aim /></el-icon>
            <span>跳转到任务</span>
          </div>
          <div class="menu-item" @click="handleAction('highlight')">
            <el-icon><Star /></el-icon>
            <span>高亮显示</span>
          </div>
          <div class="menu-divider"></div>
          <div class="menu-item danger" @click="handleAction('delete')">
            <el-icon><Delete /></el-icon>
            <span>删除任务</span>
          </div>
        </div>
      </div>
    </transition>
    <div
      v-if="visible"
      class="context-menu-overlay"
      @click="close"
      @contextmenu.prevent="close"
    ></div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import {
  View,
  Edit,
  Plus,
  CopyDocument,
  Aim,
  Star,
  Delete
} from '@element-plus/icons-vue'
import type { TaskData } from '../types'

interface Props {
  modelValue: boolean
  task?: TaskData | null
  position?: { x: number; y: number }
}

const props = withDefaults(defineProps<Props>(), {
  position: () => ({ x: 0, y: 0 })
})

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  'action': [action: string, task: TaskData | null]
}>()

const visible = ref(props.modelValue)
const position = ref(props.position)

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
  }
)

watch(
  () => props.position,
  (val) => {
    position.value = val
  }
)

function close() {
  visible.value = false
  emit('update:modelValue', false)
}

function handleAction(action: string) {
  emit('action', action, props.task || null)
  close()
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && visible.value) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped lang="scss">
.context-menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 1999;
}

.context-menu {
  position: fixed;
  z-index: 2000;
  min-width: 160px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12), 0 3px 6px rgba(0, 0, 0, 0.08);
  padding: 6px 0;
  animation: context-menu-in 0.15s ease-out;
}

@keyframes context-menu-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.context-menu-content {
  .menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    cursor: pointer;
    font-size: 14px;
    color: var(--text-primary);
    transition: background 0.2s;

    .el-icon {
      font-size: 16px;
      color: var(--text-secondary);
    }

    &:hover {
      background: var(--bg-secondary);

      .el-icon {
        color: var(--primary-color);
      }
    }

    &.danger {
      color: var(--el-color-danger);

      .el-icon {
        color: var(--el-color-danger);
      }

      &:hover {
        background: rgba(var(--el-color-danger-rgb), 0.1);
      }
    }
  }

  .menu-divider {
    height: 1px;
    background: var(--border-color);
    margin: 6px 0;
  }
}

.context-menu-enter-active,
.context-menu-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}

.context-menu-enter-from,
.context-menu-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
