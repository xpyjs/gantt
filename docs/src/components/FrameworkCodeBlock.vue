<template>
  <div class="framework-code-block">
    <!-- 框架切换标签 - 只有多个时显示 -->
    <FrameworkTabs
      v-if="showTabs"
      :tabs="codeBlocks.map(block => block.framework)"
    />

    <!-- 代码块容器 -->
    <div
      class="code-container"
      @mouseenter="showActions = true"
      @mouseleave="showActions = false"
    >
      <!-- 悬浮操作按钮 -->
      <div class="floating-actions" :class="{ visible: showActions }">
        <span class="language-badge">{{
          currentBlock?.language || "code"
        }}</span>
        <button
          @click="copyCode"
          class="floating-btn copy-btn"
          :class="{ copied: copied }"
          title="复制代码"
        >
          <Icon
            :icon="copied ? 'ph:check' : 'ph:copy'"
            width="14"
            height="14"
          />
        </button>
      </div>

      <!-- 代码内容 -->
      <pre class="code-content"><code
        v-html="highlightedCode"
        :class="`language-${currentBlock?.language || 'text'}`"
      ></code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { computed, onUnmounted, ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import FrameworkTabs from "./FrameworkTabs.vue";
import { useFramework } from "../composables/useFramework";
import { useCodeHighlight } from "../composables/useCodeHighlight";
import type { CodeBlock } from "../config/tutorials";

interface Props {
  codeBlocks: CodeBlock[];
}

const props = defineProps<Props>();

const { activeFramework, setActiveFramework } = useFramework();
const { highlightCode } = useCodeHighlight();

// 状态管理
const copied = ref(false);
const showActions = ref(false);

// 是否显示 tabs（多于一个时显示）
const showTabs = computed(() => {
  return props.codeBlocks.length > 1;
});

// 当前活跃的代码块
const currentBlock = computed(() => {
  return (
    props.codeBlocks.find(
      (block: CodeBlock) => block.framework === activeFramework.value
    ) || props.codeBlocks[0]
  );
});

// 高亮后的代码
const highlightedCode = computed(() => {
  const block = currentBlock.value;
  if (!block) return "";
  return highlightCode(block.code, block.language);
});

// 复制代码
const copyCode = async () => {
  const block = currentBlock.value;
  if (!block) return;

  try {
    await navigator.clipboard.writeText(block.code);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("复制失败:", err);
  }
};
</script>

<style scoped>
.framework-code-block {
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

.code-container {
  position: relative;
  border-left: 4px solid #007acc; /* 添加左侧主色线 */
}

/* 悬浮操作区域 */
.floating-actions {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  transform: translateY(-4px);
  transition: all 0.2s ease;
  z-index: 10;
  pointer-events: none;
}

.floating-actions.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

/* 语言标识 */
.language-badge {
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  border-radius: 4px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 悬浮按钮 */
.floating-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  outline: none;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.floating-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.05);
}

.copy-btn.copied {
  background: rgba(16, 185, 129, 0.9);
  border-color: rgba(16, 185, 129, 0.3);
}

.copy-btn.copied:hover {
  background: rgba(16, 185, 129, 1);
}

/* 代码内容 */
.code-content {
  margin: 0;
  padding: 1rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: "Fira Code", Consolas, "Liberation Mono", Menlo, Courier,
    monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  overflow-x: auto;
  white-space: pre;
  border: none;
}

.code-content code {
  background: none;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
}

/* 代码高亮样式 */
.code-content :deep(.hljs-keyword) {
  color: #c678dd;
}

.code-content :deep(.hljs-string) {
  color: #98c379;
}

.code-content :deep(.hljs-number) {
  color: #d19a66;
}

.code-content :deep(.hljs-comment) {
  color: #5c6370;
  font-style: italic;
}

.code-content :deep(.hljs-function) {
  color: #61afef;
}

.code-content :deep(.hljs-variable) {
  color: #e06c75;
}

.code-content :deep(.hljs-attr) {
  color: #d19a66;
}

.code-content :deep(.hljs-tag) {
  color: #e06c75;
}

/* 当没有 tabs 时，确保圆角正确 */
.framework-code-block:not(:has(.framework-tabs)) .code-container {
  border-radius: 8px 8px 8px 4px; /* 左上角保持直角以配合左侧色线 */
}

/* 当有 tabs 时，代码区域不需要上圆角 */
.framework-code-block:has(.framework-tabs) .code-container {
  border-radius: 0 0 8px 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .floating-actions {
    top: 0.5rem;
    right: 0.5rem;
    gap: 0.25rem;
  }

  .language-badge {
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
  }

  .floating-btn {
    width: 24px;
    height: 24px;
  }

  .code-content {
    padding: 0.75rem;
    font-size: 0.8125rem;
  }
}
</style>
