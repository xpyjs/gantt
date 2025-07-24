<template>
  <div class="toast-container">
    <TransitionGroup name="toast-list" tag="div">
      <Toast
        v-for="toast in toasts"
        :key="toast.id"
        :message="toast.message"
        :type="toast.type"
        :duration="3000"
        :position="toast.position"
        :closable="toast.closable"
        @close="removeToast(toast.id)"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Toast from "./Toast.vue";
import { useToast } from "@/composables/useToast";

const { toasts: toastsRef, removeToast } = useToast();

// 计算属性来获取响应式的 toasts
const toasts = computed(() => toastsRef.value);
</script>

<style scoped>
.toast-container {
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

/* 列表动画 */
.toast-list-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-list-leave-active {
  transition: all 0.35s cubic-bezier(0.6, -0.28, 0.735, 0.045);
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.8) rotate(3deg);
  filter: blur(2px);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateX(120%) scale(0.7) rotate(-3deg);
  filter: blur(4px);
}

.toast-list-move {
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
</style>
