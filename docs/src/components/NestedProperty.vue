<template>
  <tr>
    <td class="property-name" :style="{ paddingLeft: `${level * 1.5}rem` }">
      <code v-html="highlightText(property.name, searchQuery || '')"></code>
      <span v-if="property.required" class="required">*</span>
    </td>
    <td class="property-type">
      <code v-html="highlightText(property.type, searchQuery || '')"></code>
    </td>
    <td class="property-default">
      <code
        v-if="property.defaultValue"
        v-html="highlightText(property.defaultValue, searchQuery || '')"
      ></code>
      <span v-else class="no-default">-</span>
    </td>
    <td class="property-description">
      <div class="description-content">
        <span
          v-html="highlightText(property.description, searchQuery || '')"
        ></span>
        <div v-if="property.options?.length" class="property-options">
          <strong>可选值:</strong>
          <span
            v-for="option in property.options"
            :key="option"
            class="option-tag"
            v-html="highlightText(option, searchQuery || '')"
          ></span>
        </div>
      </div>
    </td>
  </tr>
  <!-- 递归渲染子属性 -->
  <NestedProperty
    v-for="child in property.children"
    :key="child.name"
    :property="child"
    :level="level + 1"
    :search-query="searchQuery"
  />
</template>

<script setup lang="ts">
import type { ApiProperty } from "@/config/api";

interface Props {
  property: ApiProperty;
  level: number;
  searchQuery?: string;
}

defineProps<Props>();

// 高亮文本
const highlightText = (text: string, search: string): string => {
  if (!search) {
    return text;
  }

  const regex = new RegExp(`(${escapeRegex(search)})`, "gi");
  return text.replace(regex, '<mark class="search-highlight">$1</mark>');
};

// 转义正则表达式特殊字符
const escapeRegex = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
</script>

<style scoped>
.property-name {
  font-weight: 500;
}

.property-name code {
  background: rgba(236, 167, 16, 0.1);
  color: #eca710;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: "Fira Code", "Monaco", "Consolas", monospace;
  font-size: 0.85rem;
}

.required {
  color: #e53e3e;
  font-weight: bold;
  margin-left: 0.25rem;
}

.property-type code {
  background: var(--bg-secondary);
  color: var(--text-primary);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: "Fira Code", "Monaco", "Consolas", monospace;
  font-size: 0.85rem;
  word-break: break-all;
}

.property-default code {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: "Fira Code", "Monaco", "Consolas", monospace;
  font-size: 0.85rem;
}

.no-default {
  color: var(--text-secondary);
  font-style: italic;
}

.description-content {
  line-height: 1.5;
}

.property-options {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
}

.option-tag {
  display: inline-block;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin: 0.25rem 0.5rem 0.25rem 0;
  font-family: "Fira Code", "Monaco", "Consolas", monospace;
}
</style>
