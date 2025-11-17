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
    "drag:row",
    "click:slider",
    "dblclick:slider",
    "contextmenu:slider",
    "move",
    "enter:slider",
    "hover:slider",
    "leave:slider",
    "click:baseline",
    "contextmenu:baseline",
    "enter:baseline",
    "hover:baseline",
    "leave:baseline"
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
  },

  /**
   * 获取指定任务的所有相关联的完整路径，包含所有连接线与任务节点
   */
  getDataChain: (taskId: string) => {
    if (ganttInstance) {
      return ganttInstance.getDataChain(taskId);
    }
  },

  /**
   * 滚动到指定任务位置
   */
  scrollTo: (id?: string, highlight?: boolean) => {
    if (ganttInstance) {
      ganttInstance.scrollTo(id, highlight);
    }
  },

  /**
   * 获取某一条数据
   */
  getDataById: (id: string) => {
    if (ganttInstance) {
      return ganttInstance.getDataById(id);
    }
  },

  /**
   * 获取当前数据集合的数量
   */
  getDataSize: () => {
    if (ganttInstance) {
      return ganttInstance.getDataSize();
    }
  },

  /**
   * 移除指定 ID 的数据。该操作会直接修改当前数据源，并且不可逆，请谨慎使用
   * @param id 数据 ID
   * @returns 是否成功移除
   *
   * @example
   * ```typescript
   * const success = gantt.removeDataById('task-1');
   * ```
   */
  removeDataById(id: string): boolean {
    return ganttInstance?.removeDataById(id) || false;
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
