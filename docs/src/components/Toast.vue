<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="visible"
        class="toast-container"
        :class="[`toast-${type}`, position]"
      >
        <div class="toast-content">
          <Icon
            :icon="iconMap[type]"
            class="toast-icon"
            width="20"
            height="20"
          />
          <span class="toast-message">{{ message }}</span>
          <button
            v-if="closable"
            @click="closeToast"
            class="toast-close"
            type="button"
            aria-label="关闭"
          >
            <Icon icon="ph:x" width="14" height="14" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Icon } from "@iconify/vue";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  position?:
    | "top-right"
    | "top-left"
    | "top-center"
    | "bottom-right"
    | "bottom-left"
    | "bottom-center";
  closable?: boolean;
}

const props = withDefaults(defineProps<ToastProps>(), {
  type: "success",
  duration: 3000,
  position: "top-right",
  closable: false
});

const emit = defineEmits<{
  close: [];
}>();

const visible = ref(false);
const timer = ref<number | null>(null);

// 图标映射
const iconMap = {
  success: "ph:check-circle-fill",
  error: "ph:x-circle-fill",
  warning: "ph:warning-circle-fill",
  info: "ph:info-fill"
};

/**
 * 显示 Toast
 */
const showToast = () => {
  visible.value = true;

  if (props.duration > 0) {
    timer.value = setTimeout(() => {
      closeToast();
    }, props.duration) as unknown as number;
  }
};

/**
 * 关闭 Toast
 */
const closeToast = () => {
  visible.value = false;
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }
  setTimeout(() => {
    emit("close");
  }, 300);
};

// 监听 message 变化，自动显示
watch(
  () => props.message,
  newMessage => {
    if (newMessage) {
      showToast();
    }
  }
);

onMounted(() => {
  if (props.message) {
    showToast();
  }
});

// 暴露方法给父组件
defineExpose({
  showToast,
  closeToast
});
</script>

<style scoped>
.toast-container {
  position: fixed;
  z-index: 9999;
  max-width: 400px;
  min-width: 240px;
  pointer-events: auto;
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* 位置样式 */
.toast-container.top-right {
  top: 20px;
  right: 20px;
}

.toast-container.top-left {
  top: 20px;
  left: 20px;
}

.toast-container.top-center {
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.toast-container.bottom-right {
  bottom: 20px;
  right: 20px;
}

.toast-container.bottom-left {
  bottom: 20px;
  left: 20px;
}

.toast-container.bottom-center {
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.875rem;
  line-height: 1.5;
  max-width: 100%;
  word-wrap: break-word;
  position: relative;
}

/* 类型样式 */
.toast-success .toast-content {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.toast-error .toast-content {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.toast-warning .toast-content {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.toast-info .toast-content {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.toast-icon {
  flex-shrink: 0;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.toast-message {
  flex: 1;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: currentColor;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  opacity: 0.8;
  margin-left: 0.5rem;
}

.toast-close:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

/* 动画 */
.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-leave-active {
  transition: all 0.35s cubic-bezier(0.6, -0.28, 0.735, 0.045);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.8) rotate(5deg);
  filter: blur(4px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(120%) scale(0.7) rotate(-5deg);
  filter: blur(6px);
}

/* 左侧位置的动画 */
.toast-container.top-left .toast-enter-from,
.toast-container.bottom-left .toast-enter-from {
  transform: translateX(-100%) scale(0.8) rotate(-5deg);
  filter: blur(4px);
}

.toast-container.top-left .toast-leave-to,
.toast-container.bottom-left .toast-leave-to {
  transform: translateX(-120%) scale(0.7) rotate(5deg);
  filter: blur(6px);
}

/* 中心位置的动画 */
.toast-container.top-center .toast-enter-from,
.toast-container.bottom-center .toast-enter-from {
  transform: translateX(-50%) translateY(-30px) scale(0.8);
  filter: blur(4px);
}

.toast-container.top-center .toast-leave-to,
.toast-container.bottom-center .toast-leave-to {
  transform: translateX(-50%) translateY(-40px) scale(0.6);
  filter: blur(6px);
}

/* 响应式设计 */
@media (max-width: 640px) {
  .toast-container {
    left: 10px !important;
    right: 10px !important;
    max-width: none;
    transform: none;
  }

  .toast-container.top-center,
  .toast-container.bottom-center {
    left: 10px !important;
    transform: none;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .toast-content {
    border-color: rgba(255, 255, 255, 0.1);
  }
}

/* 优化性能 */
.toast-container {
  will-change: transform, opacity;
}

.toast-content {
  will-change: transform, opacity, filter;
}

/* 添加微妙的悬停效果 */
.toast-content:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18), 0 6px 12px rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease;
}
</style>
