<template>
  <div class="tutorial-content">
    <!-- 描述 -->
    <p v-if="section.description" class="section-description">
      {{ section.description }}
    </p>

    <!-- 子章节 -->
    <template v-if="section.subsections">
      <div
        v-for="(subsection, index) in section.subsections"
        :key="index"
        class="subsection"
      >
        <!-- 子标题 -->
        <h3 v-if="subsection.title" class="subsection-title" :id="subsection.title">
          {{ subsection.title }}
        </h3>

        <!-- 子描述 -->
        <p v-if="subsection.description" class="subsection-description">
          {{ subsection.description }}
        </p>

        <!-- 列表 -->
        <ul v-if="subsection.list" class="content-list">
          <li
            v-for="(item, itemIndex) in subsection.list"
            :key="itemIndex"
            v-html="formatListItem(item)"
          />
        </ul>

        <!-- 表格 -->
        <div v-if="subsection.table" class="config-table">
          <table>
            <thead>
              <tr>
                <th v-for="header in subsection.table.headers" :key="header">
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in subsection.table.rows" :key="row.property">
                <td>
                  <code>{{ row.property }}</code>
                </td>
                <td>{{ row.type }}</td>
                <td>{{ row.default }}</td>
                <td>{{ row.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 子章节的代码块 -->
        <FrameworkCodeBlock
          v-if="subsection.code"
          :codeBlocks="subsection.code"
        />

        <!-- 自定义内容 -->
        <div
          v-if="subsection.customContent"
          v-html="processCustomContent(subsection.customContent)"
          class="custom-content"
          @click="handleLinkClick"
        />
      </div>
    </template>

    <!-- 主章节的代码块 -->
    <FrameworkCodeBlock v-if="section.code" :codeBlocks="section.code" />

    <!-- 自定义内容 -->
    <div
      v-if="section.customContent"
      v-html="processCustomContent(section.customContent)"
      class="custom-content"
      @click="handleLinkClick"
    />
  </div>
</template>

<script setup lang="ts">
import type { TutorialSection } from "../config/tutorials";
import { useRouter } from 'vue-router';
import FrameworkCodeBlock from "./FrameworkCodeBlock.vue";

interface Props {
  section: TutorialSection;
}

defineProps<Props>();

const router = useRouter();

// 处理列表项中的markdown格式
const formatListItem = (item: string): string => {
  // 处理反引号包围的代码
  let formatted = item.replace(/`([^`]+)`/g, "<code>$1</code>");

  // 处理双星号包围的粗体文字
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  return processCustomContent(formatted);
};

// 处理自定义内容中的链接和图片路径
const processCustomContent = (content: string): string => {
  if (!content) return '';

  const baseUrl = import.meta.env.BASE_URL || '/';

  // 处理链接：将以 / 开头的内部链接添加 base URL
  let processedContent = content.replace(/href="(\/[^"]*)"/g, (match, href) => {
    // 确保不会重复添加 baseUrl
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    const cleanHref = href.startsWith('/') ? href : `/${href}`;
    return `href="${cleanBaseUrl}${cleanHref}"`;
  });

  // 处理图片：将以 / 开头的图片路径添加 base URL
  processedContent = processedContent.replace(/src="(\/[^"]*)"/g, (match, src) => {
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    const cleanSrc = src.startsWith('/') ? src : `/${src}`;
    return `src="${cleanBaseUrl}${cleanSrc}"`;
  });

  return processedContent;
};

// 处理链接点击事件，使用路由导航
const handleLinkClick = (event: Event) => {
  const target = event.target as HTMLElement;
  if (target.tagName === 'A') {
    const href = (target as HTMLAnchorElement).getAttribute('href');
    if (href) {
      const url = new URL(href, window.location.origin);

      // 如果是内部链接（同源），使用路由导航
      if (url.origin === window.location.origin) {
        event.preventDefault();

        // 移除 base URL 前缀，得到实际的路由路径
        const baseUrl = import.meta.env.BASE_URL || '/';
        let routePath = url.pathname;

        if (baseUrl !== '/' && routePath.startsWith(baseUrl)) {
          routePath = routePath.substring(baseUrl.length);
        }

        router.push(routePath + url.search + url.hash);
      }
      // 外部链接正常跳转
    }
  }
};
</script>

<style>
.tutorial-content {
  line-height: 1.6;
}

.section-description {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.subsection {
  margin-bottom: 2rem;
}

.subsection:last-child {
  margin-bottom: 0;
}

.subsection-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 1rem;
  color: var(--text-primary);
}

.subsection-description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

/* 列表样式 */
.content-list {
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.content-list li {
  margin-bottom: 0.5rem;
}

/* 通用内联代码样式 - 只应用于非代码块中的code */
tutorial-content code:not(pre code) {
  font-family: "Monaco", "Consolas", "Courier New", "Menlo", "Liberation Mono",
    monospace;
  font-size: 0.875rem;
  background: #f6f8fa;
  color: #d73a49;
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
  border: 1px solid #e1e4e8;
}

/* 列表中的内联代码样式 - 只应用于非代码块中的code */
.content-list code:not(pre code) {
  background: #f6f8fa;
  color: #d73a49;
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
  font-family: "Monaco", "Consolas", "Courier New", "Menlo", "Liberation Mono",
    monospace;
  font-size: 0.875rem;
  border: 1px solid #e1e4e8;
}

/* 列表中的粗体样式 */
.content-list strong {
  color: var(--text-primary);
  font-weight: 600;
}

/* 配置表格样式 */
.config-table {
  overflow-x: auto;
  margin: 1rem 0;
}

.config-table table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
}

.config-table th,
.config-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.config-table th {
  background: var(--bg-secondary);
  font-weight: 600;
  color: var(--text-primary);
}

.config-table td {
  color: var(--text-secondary);
}

.config-table tr:last-child td {
  border-bottom: none;
}

.config-table code {
  background: #e6f7ff;
  color: #1890ff;
  font-family: "Monaco", "Consolas", "Courier New", "Menlo", "Liberation Mono",
    monospace;
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
  font-size: 0.875rem;
}

/* 代码块样式 */
.code-block {
  position: relative;
  background: var(--bg-secondary);
  border-radius: 6px;
  padding: 1.5rem;
  margin: 1rem 0;
  overflow-x: auto;
  border-left: 4px solid #007acc;
}

.code-block .code-actions {
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(4px);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.code-block:hover .code-actions {
  opacity: 1;
}

.code-block .code-language {
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.75rem;
}

.code-block .copy-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 3px;
  transition: all 0.2s ease;
  font-size: 0.75rem;
}

.code-block .copy-button:hover {
  background: rgba(0, 122, 204, 0.1);
  color: #007acc;
}

.code-block .copy-button:active {
  transform: scale(0.95);
}

.code-block .copy-button svg {
  transition: all 0.2s ease;
  width: 14px;
  height: 14px;
}

.code-block pre {
  margin: 0;
  font-family: "Monaco", "Consolas", "Courier New", "Menlo", "Liberation Mono",
    monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* 代码块中的code样式 - 只需要字体设置，移除所有内联样式 */
.code-block pre code,
pre code {
  color: var(--text-primary);
  background: none !important;
  padding: 0 !important;
  border: none !important;
  border-radius: 0 !important;
  font-family: "Monaco", "Consolas", "Courier New", "Menlo", "Liberation Mono",
    monospace;
  font-size: 0.875rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* 框架代码块组合样式 */
.framework-code-section {
  margin: 1rem 0;
}

.framework-code-section .framework-tabs {
  margin-bottom: 0;
}

.framework-code-section .framework-code-block {
  margin-top: 0;
}

.custom-content {
  color: var(--text-secondary);
}

.custom-content img {
  width: 100%;
}
</style>
