<template>
  <div :id="item.id" class="property-item" :class="`level-${level}`">
    <!-- 属性标题 -->
    <component :is="headingTag" class="property-title">
      <span class="property-name">{{ item.key }}</span>
      <span v-if="item.required" class="required">*</span>
      <div class="property-type-info">
        <pre><code v-if="!hasChildren" class="property-type">{{ item.type }}</code></pre>
        <code v-if="item.defaultValue" class="property-default">
          {{ item.defaultValue }}
        </code>
      </div>
    </component>

    <!-- 属性描述 -->
    <div class="property-description">
      <p
        class="description-text"
        v-html="highlightSearchTerm(item.description)"
      ></p>

      <!-- 可选值 -->
      <div v-if="item.options && item.options.length" class="property-options">
        <strong>可选值：</strong>
        <span v-for="option in item.options" :key="option" class="option-tag">
          {{ option }}
        </span>
      </div>
    </div>

    <!-- 子属性 -->
    <div v-if="item.children && item.children.length" class="property-children">
      <PropertyItem
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        :level="level + 1"
        :search-query="searchQuery"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ApiItem } from "@/config/api";

interface Props {
  item: ApiItem;
  level: number;
  searchQuery?: string;
}

const props = defineProps<Props>();

// 动态标题标签
const headingTag = computed(() => {
  const headingLevel = Math.min(props.level + 1, 6);
  return `h${headingLevel}`;
});

// 是否有子项
const hasChildren = computed(() => {
  return Boolean(props.item.children && props.item.children.length > 0);
});

// 高亮搜索词
const highlightSearchTerm = (text: string) => {
  if (!props.searchQuery) {
    return text.replace(/\n/g, "<br>");
  }

  const regex = new RegExp(`(${props.searchQuery})`, "gi");
  return text
    .replace(regex, '<span class="search-highlight">$1</span>')
    .replace(/\n/g, "<br>");
};
</script>

<style scoped>
.property-item {
  margin-bottom: 2rem;
  scroll-margin-top: 100px;
}

.property-item.level-1 {
  border-left: 4px solid var(--accent-color);
  padding-left: 1.5rem;
  margin-bottom: 3rem;
}

.property-item.level-2 {
  border-left: 3px solid var(--warning-color);
  padding-left: 1.25rem;
  margin-bottom: 2.5rem;
}

.property-item.level-3 {
  border-left: 2px solid var(--success-color);
  padding-left: 1rem;
  margin-bottom: 2rem;
}

.property-item.level-4 {
  border-left: 1px solid var(--error-color);
  padding-left: 0.75rem;
  margin-bottom: 1.5rem;
}

.property-item.level-5 {
  border-left: 1px solid var(--accent-hover);
  padding-left: 0.75rem;
  margin-bottom: 1.5rem;
}

/* 属性标题 */
.property-title {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.property-name {
  font-family: "Fira Code", "Monaco", "Consolas", monospace;
  font-weight: 600;
}

h5,h6 {
  .property-name {
    font-size: 14px;
  }
}

.required {
  color: #e53e3e;
  font-weight: bold;
}

.property-type-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  flex-shrink: 0;
}

.property-type {
  background: var(--bg-secondary) !important;
  color: var(--text-secondary) !important;
  padding: 0.25rem 0.5rem !important;
  border-radius: 4px !important;
  font-family: "Fira Code", "Monaco", "Consolas", monospace;
  font-size: 0.85rem;
  font-weight: 500;
}

pre {
  background: var(--bg-secondary) !important;
  padding: 0.25rem 0.5rem !important;
  border-radius: 4px !important;
  font-family: "Fira Code", "Monaco", "Consolas", monospace;
  font-size: 0.85rem;
  font-weight: 500;
}

.property-default {
  background: rgba(0, 122, 204, 0.1);
  color: var(--accent-color);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: "Fira Code", "Monaco", "Consolas", monospace;
  font-size: 0.85rem;
  font-weight: 500;
}

/* 属性描述 */
.property-description {
  margin-bottom: 1rem;
}

.description-text {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.property-options {
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border-left: 4px solid var(--accent-color);
}

/* 内联代码 - 只应用于非代码块中的code */
code:not(pre code) {
  background: var(--bg-secondary);
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
  font-family: "Monaco", "Consolas", "Courier New", "Menlo", "Liberation Mono",
    monospace;
  font-size: 0.875rem;
  border: 1px solid var(--border-color);
}

.option-tag {
  display: inline-block;
  background: var(--bg-primary);
  color: var(--text-secondary);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  margin: 0.25rem 0.5rem 0.25rem 0;
  font-family: "Fira Code", "Monaco", "Consolas", monospace;
  border: 1px solid var(--border-color);
}

/* 子属性 */
.property-children {
  margin-top: 1.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .property-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .property-type-info {
    margin-left: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .property-item.level-1,
  .property-item.level-2,
  .property-item.level-3,
  .property-item.level-4,
  .property-item.level-5 {
    padding-left: 1rem;
  }
}

/* 搜索高亮样式 */
:deep(.search-highlight) {
  background: rgba(0, 122, 204, 0.3);
  color: var(--accent-color);
  font-weight: 600;
  padding: 0.1em 0.2em;
  border-radius: 2px;
}
</style>
