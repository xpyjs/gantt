<template>
  <div ref="containerRef" class="x-gantt-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import { XGantt } from "@xpyjs/gantt-core";
import { XGanttVueProps, XGanttVueEmits } from "./props";
import "@xpyjs/gantt-core/style.css";

/**
 * 甘特图组件的 props 类型
 *
 * 不需要默认参数，都在 core 中定义好了
 */
const props = withDefaults(defineProps<XGanttVueProps>(), {
  options: () => ({})
});

// 定义 emits
const emit = defineEmits<XGanttVueEmits>();

// 模板引用
const containerRef = ref<HTMLElement>();

// 甘特图实例
let ganttInstance: XGantt | null = null;

// 初始化甘特图
const initGantt = async () => {
  if (!containerRef.value) return;

  // 确保容器已渲染
  await nextTick();

  // 创建甘特图实例
  ganttInstance = new XGantt(containerRef.value, props.options);
  // 注册事件监听器
  registerEventListeners();
};

// 注册事件监听器
const registerEventListeners = () => {
  if (!ganttInstance) return;

  // 所有事件只需要在这里注册名字就可以
  const eventNames: Array<keyof XGanttVueEmits> = [
    "loaded",
    "error",
    "update:link",
    "create:link",
    "select:link",
    "contextmenu:link",
    "select",
    "click:row",
    "dblclick:row",
    "contextmenu:row",
    "click:slider",
    "dblclick:slider",
    "contextmenu:slider",
    "move"
  ];

  // 遍历注册
  eventNames.forEach(eventName => {
    ganttInstance!.on(
      eventName,
      (...args: XGanttVueEmits[typeof eventName]) => {
        // @ts-ignore
        emit(eventName, ...args);
      }
    );
  });
};

// 监听 props 变化，更新甘特图
watch(
  () => props,
  v => {
    if (ganttInstance) {
      ganttInstance.update(v.options);
    }
  },
  { deep: true }
);

// 暴露方法给父组件
defineExpose({
  /**
   * 获取甘特图实例
   */
  getInstance: () => {
    return ganttInstance;
  },

  /**
   * 跳转日期
   */
  jumpTo: (date?: any) => {
    if (ganttInstance) {
      ganttInstance.jumpTo(date);
    }
  }
});

// 组件挂载时初始化
onMounted(() => {
  initGantt();
});

// 组件卸载时清理
onUnmounted(() => {
  if (ganttInstance) {
    ganttInstance.destroy();
    ganttInstance = null;
  }
});
</script>

<style scoped>
.x-gantt-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
