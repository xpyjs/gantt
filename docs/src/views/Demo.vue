<template>
  <div class="demo-page">
    <div v-if="!currentDemo" class="demo-not-found">
      <div class="not-found-content">
        <h1>什么也没找到~~~</h1>
        <p>您访问的演示样例不存在，请检查 URL 是否正确。</p>
        <RouterLink to="/demos" class="btn btn-primary"
          >返回演示列表</RouterLink
        >
      </div>
    </div>

    <div v-else class="demo-container">
      <!-- 面包屑导航 -->
      <header class="demo-header">
        <div class="breadcrumb">
          <RouterLink to="/demos" class="breadcrumb-item">演示</RouterLink>
          <span class="breadcrumb-separator">›</span>
          <RouterLink
            class="breadcrumb-item clickable"
            :to="'/demos#category-' + (categoryInfo?.id || category)"
          >
            {{ categoryInfo?.title }}
          </RouterLink>
          <span class="breadcrumb-separator">›</span>
          <div
            class="breadcrumb-dropdown"
            @mouseenter="handleDropdownEnter"
            @mouseleave="handleDropdownLeave"
          >
            <span
              class="breadcrumb-item current"
              :class="{ 'dropdown-active': showDropdown }"
            >
              {{ currentDemo.title }}
            </span>
            <div
              v-if="showDropdown && categoryInfo"
              class="dropdown-menu"
              @mouseenter="handleDropdownEnter"
              @mouseleave="handleDropdownLeave"
            >
              <RouterLink
                v-for="demo in categoryInfo.demos"
                :key="demo.id"
                :to="`/demo/${categoryInfo.id}/${demo.id}`"
                class="dropdown-item"
                :class="{ active: demo.id === currentDemo.id }"
              >
                {{ demo.title }}
              </RouterLink>
            </div>
          </div>
        </div>
        <div class="demo-meta">
          <div class="demo-info">
            <div class="demo-header-content">
              <div class="demo-title-line">
                <h1 class="demo-title">{{ currentDemo.title }}</h1>
                <span class="demo-difficulty" :class="currentDemo.difficulty">
                  {{ DIFFICULTY_LEVELS[currentDemo.difficulty] }}
                </span>
              </div>
              <p class="demo-description">{{ currentDemo.description }}</p>
              <div class="demo-tags">
                <span
                  v-for="tag in currentDemo.tags"
                  :key="tag"
                  class="demo-tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- 主要内容区域 -->
      <div class="demo-content">
        <!-- 框架选择器 -->
        <div class="framework-selector">
          <div class="framework-tabs">
            <button
              v-for="framework in availableFrameworks"
              :key="framework.key"
              :class="[
                'framework-tab',
                { active: currentFramework === framework.key }
              ]"
              @click="switchFramework(framework.key)"
            >
              <Icon
                :icon="framework.icon"
                class="framework-icon"
                width="16"
                height="16"
              />
              <span class="framework-label">{{ framework.label }}</span>
            </button>
          </div>

          <div class="demo-controls">
            <button @click="copyCode" class="control-btn" title="复制代码">
              <Icon icon="ph:copy" width="16" height="16" />
              复制代码
            </button>
            <button @click="resetCode" class="control-btn" title="重置代码">
              <Icon icon="ph:arrow-counter-clockwise" width="16" height="16" />
              重置
            </button>
            <button @click="downloadCode" class="control-btn" title="下载代码">
              <Icon icon="ph:download" width="16" height="16" />
              下载
            </button>
          </div>
        </div>

        <!-- StackBlitz 编辑器和预览区域 -->
        <div class="stackblitz-container">
          <div v-if="isStackBlitzLoading" class="stackblitz-loading">
            <Icon icon="eos-icons:loading" width="32" height="32" />
            <p>正在加载 StackBlitz 编辑器...</p>
          </div>
          <div v-else-if="stackBlitzError" class="stackblitz-error">
            <Icon icon="ph:warning" width="32" height="32" />
            <p>{{ stackBlitzError }}</p>
            <button @click="initStackBlitz" class="retry-btn">重试</button>
          </div>
          <div
            class="stackblitz-editor"
            :style="{ opacity: isStackBlitzLoading || stackBlitzError ? 0 : 1 }"
          >
            <div id="stackblitz-editor"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { RouterLink } from "vue-router";
import { Icon } from "@iconify/vue";
import { demoCategories, DIFFICULTY_LEVELS } from "@/config/demos/index";
import { FrameworkKey, useFramework } from "@/composables/useFramework";
import { useTheme } from "@/composables/useTheme";
import { toast } from "@/composables/useToast";
import type { CodeBlock } from "@/types/demo";
import sdk, { UiViewOption, type VM } from "@stackblitz/sdk";
import { createVueProjectFiles } from "@/template/vue";
import { createReactProjectFiles } from "@/template/react";
import { createJavaScriptProjectFiles } from "@/template/vanilla";
import JSZip from "jszip";

interface DemoProps {
  category?: string;
  name?: string;
}

const props = defineProps<DemoProps>();
const route = useRoute();

const { getFrameworkByKey } = useFramework();

// 响应式状态
const currentFramework = ref<FrameworkKey>("javascript");
const categoryInfo = demoCategories.find(
  cat => cat.id === props.category || cat.id === route.params.category
);
const currentDemo = computed(() => {
  return categoryInfo?.demos.find(
    demo => demo.id === props.name || demo.id === route.params.name
  );
});
const availableFrameworks = computed(() => {
  return (
    currentDemo.value?.code.map((c: CodeBlock) =>
      getFrameworkByKey(c.framework as FrameworkKey)
    ) || []
  );
});

// StackBlitz 相关状态
const isStackBlitzLoading = ref(false);
const stackBlitzError = ref<string | null>(null);
const stackBlitzProject = ref<VM>();

// 当前代码内容
const currentEntry = computed(() => {
  if (!currentDemo.value) return undefined;
  const codeEntry = currentDemo.value.code.find(
    (c: CodeBlock) => c.framework === currentFramework.value
  );
  return codeEntry;
});

const { currentTheme } = useTheme();
watch(
  () => currentTheme.value,
  v => {
    stackBlitzProject.value?.editor?.setTheme(v);
  }
);

// 初始化 StackBlitz
const initStackBlitz = async () => {
  if (!currentDemo.value || !currentEntry.value?.code) return;

  if (stackBlitzProject.value) {
    stackBlitzProject.value = undefined;
  }

  isStackBlitzLoading.value = true;
  stackBlitzError.value = null;

  try {
    const container = document.getElementById("stackblitz-editor");
    if (!container) {
      throw new Error("StackBlitz 容器未找到");
    }

    // 生成项目文件
    let files: Record<string, string>;
    let title: string;
    let openFile: string;
    let view: UiViewOption = 'default';

    switch (currentFramework.value) {
      case "vue":
        files = createVueProjectFiles(currentEntry.value);
        title = `${currentDemo.value.title} - Vue`;
        openFile = "src/App.vue";
        break;
      case "react":
        files = createReactProjectFiles(currentEntry.value);
        title = `${currentDemo.value.title} - React`;
        openFile = "src/App.tsx";
        break;
      case "javascript":
      default:
        files = createJavaScriptProjectFiles(currentEntry.value);
        title = `${currentDemo.value.title} - JavaScript`;
        openFile = "src/main.ts";
        view = currentEntry.value.view || 'default';
        break;
    }

    // 嵌入 StackBlitz 编辑器
    stackBlitzProject.value = await sdk.embedProject(
      container,
      {
        title,
        description: currentDemo.value.description,
        template: "node",
        files
      },
      {
        openFile,
        view,
        hideNavigation: true,
        hideDevTools: true,
        hideExplorer: true,
        showSidebar: false,
        theme: currentTheme.value,
        height: 600
      }
    );

    setTimeout(() => {
      isStackBlitzLoading.value = false;
    }, 3000);
  } catch (error) {
    console.error("初始化 StackBlitz 失败:", error);
    stackBlitzError.value = `加载失败: ${
      error instanceof Error ? error.message : "未知错误"
    }`;
    toast.error("编辑器加载失败");
    isStackBlitzLoading.value = false;
  }
};

// 复制代码到剪贴板
const copyCode = async () => {
  if (!currentEntry.value?.code) {
    toast.warning("没有可复制的代码内容");
    return;
  }

  // 检查是否支持现代剪贴板 API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    // 使用现代剪贴板 API
    const copySuccess = await navigator.clipboard
      .writeText(currentEntry.value.code)
      .then(() => true)
      .catch(error => {
        console.error("现代剪贴板 API 失败:", error);
        return false;
      });

    if (copySuccess) {
      toast.success("代码已复制到剪贴板");
    } else {
      // 如果现代 API 失败，降级到传统方法
      fallbackCopyText(currentEntry.value.code);
    }
  } else {
    // 降级到传统复制方法
    fallbackCopyText(currentEntry.value.code);
  }
};

/**
 * 降级复制方法
 * @param text - 要复制的文本
 */
const fallbackCopyText = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.top = "-9999px";
  textArea.style.left = "-9999px";
  textArea.style.opacity = "0";
  textArea.style.pointerEvents = "none";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  if (document.execCommand("copy")) {
    toast.success("代码已复制到剪贴板");
  } else {
    toast.error("复制失败，请手动复制");
  }

  document.body.removeChild(textArea);
};

// 重置代码
const resetCode = () => {
  initStackBlitz();
};

// 下载代码
const downloadCode = async () => {
  if (!currentDemo.value || !stackBlitzProject.value) {
    toast.warning("没有可下载的内容");
    return;
  }

  try {
    const snapshot = await stackBlitzProject.value.getFsSnapshot();
    if (!snapshot) {
      toast.error("获取项目快照失败");
      return;
    }

    const zip = new JSZip();
    Object.entries(snapshot).forEach(([filePath, content]) => {
      zip.file(filePath, content);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentDemo.value.title}-${currentFramework.value}.zip`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("代码包下载成功");
  } catch (error) {
    console.error("下载失败:", error);
    toast.error("下载失败，请稍后重试");
  }
};

// 切换框架
const switchFramework = (framework: FrameworkKey) => {
  currentFramework.value = framework;
};

// 下拉菜单交互处理
const showDropdown = ref(false);
const dropdownTimer = ref<number | null>(null);

function handleDropdownEnter() {
  if (dropdownTimer.value) {
    clearTimeout(dropdownTimer.value);
    dropdownTimer.value = null;
  }
  showDropdown.value = true;
}

function handleDropdownLeave() {
  dropdownTimer.value = setTimeout(() => {
    showDropdown.value = false;
    dropdownTimer.value = null;
  }, 300) as unknown as number;
}

// 监听框架切换
watch(currentFramework, () => {
  initStackBlitz();
});

// 监听演示变化
// watch(
//   () => currentDemo.value,
//   newDemo => {
//     if (newDemo && availableFrameworks.value.length > 0) {
//       // 设置默认框架
//       // currentFramework.value = availableFrameworks.value[0].key;
//     }
//   },
//   { immediate: true }
// );

watch(
  () => currentDemo.value,
  () => {
    // 每次演示变化时重新初始化 StackBlitz
    initStackBlitz();
  }
);

// 组件挂载后初始化
onMounted(() => {
  if (currentDemo.value && availableFrameworks.value.length > 0) {
    // 设置默认框架
    currentFramework.value = availableFrameworks.value[0].key;

    initStackBlitz();
  }
});
</script>

<style scoped>
.demo-page {
  min-height: calc(100vh - 64px);
  background: var(--bg-secondary);
}

.demo-not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
  color: var(--text-secondary);
}

.not-found-content h1 {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s ease;
  font-weight: 500;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: var(--accent-color);
  color: white;
  border: 1px solid var(--accent-color);
}

.btn-primary:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

.demo-container {
  max-width: 1600px;
  margin: 0 auto;
}

.demo-header {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 2rem;
}

.breadcrumb {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.breadcrumb-item {
  color: var(--accent-color);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-item:hover {
  color: var(--accent-hover);
}

.breadcrumb-item.current {
  color: var(--text-secondary);
  cursor: default;
  transition: color 0.2s ease;
}

.breadcrumb-item.current.dropdown-active {
  color: var(--accent-color);
}

.breadcrumb-item.clickable {
  color: var(--accent-color);
  text-decoration: none;
  cursor: pointer;
}

.breadcrumb-item.clickable:hover {
  text-decoration: underline;
}

.breadcrumb-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  max-width: 300px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  animation: dropdownFadeIn 0.2s ease-out;
  transform-origin: top center;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-item:hover {
  background: var(--bg-secondary);
  color: var(--accent-color);
  transform: translateX(2px);
}

.dropdown-item.active {
  background: var(--accent-color);
  color: white;
}

.dropdown-item.active:hover {
  background: var(--accent-hover);
  transform: translateX(0);
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: var(--text-secondary);
}

.demo-header-content {
  max-width: 800px;
}

.demo-title-line {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.demo-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.demo-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.demo-tags {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.demo-difficulty {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.demo-difficulty.basic {
  background: #e6f7ff;
  color: #1890ff;
}

.demo-difficulty.intermediate {
  background: #fff7e6;
  color: #fa8c16;
}

.demo-difficulty.advanced {
  background: #fff2f0;
  color: #f5222d;
}

.demo-tag {
  padding: 0.25rem 0.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.demo-content {
  padding: 2rem;
}

.framework-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px 8px 0 0;
  border: 1px solid var(--border-color);
}

.framework-tabs {
  display: flex;
  gap: 0.5rem;
}

.framework-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
}

.framework-tab:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
  transform: translateY(-1px);
}

.framework-tab.active {
  background: #007acc;
  border-color: #007acc;
  color: white;
  transform: translateY(-1px);
}

.framework-tab.active:hover {
  background: #0066a6;
  border-color: #0066a6;
}

.framework-icon {
  font-size: 1rem;
}

.framework-label {
  font-size: 0.875rem;
  font-weight: 500;
}

.demo-controls {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
}

.control-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
  transform: translateY(-1px);
}

/* StackBlitz 容器样式 */
.stackblitz-container {
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 600px;
  position: relative;
}

.stackblitz-editor {
  width: 100%;
  height: 600px;
  border: none;
  border-radius: 4px;
  background: var(--bg-primary);
}

.stackblitz-loading,
.stackblitz-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 600px;
  color: var(--text-secondary);
  gap: 1rem;
  z-index: 2;
}

.stackblitz-loading {
  background: var(--bg-primary);
}

.stackblitz-error {
  background: var(--bg-primary);
  color: var(--error-color, #f5222d);
}

.retry-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

/* StackBlitz iframe 样式优化 */
.stackblitz-container :deep(iframe) {
  border: none;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .framework-selector {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .framework-tabs {
    justify-content: center;
  }

  .demo-controls {
    justify-content: center;
    flex-wrap: wrap;
  }

  .stackblitz-loading,
  .stackblitz-error {
    height: 500px;
  }
}

@media (max-width: 768px) {
  .demo-header {
    padding: 1rem;
  }

  .demo-content {
    padding: 1rem;
  }

  .demo-title {
    font-size: 1.5rem;
  }

  .demo-title-line {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .framework-tabs {
    flex-direction: column;
    width: 100%;
  }

  .framework-tab {
    justify-content: center;
  }

  .stackblitz-loading,
  .stackblitz-error {
    height: 400px;
  }

  .control-btn span {
    display: none;
  }

  .control-btn {
    justify-content: center;
    padding: 0.5rem;
    min-width: 2.5rem;
  }
}
</style>
