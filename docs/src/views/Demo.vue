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
            <button @click="viewSource" class="control-btn" title="查看源码">
              <Icon icon="ph:github-logo" width="16" height="16" />
              <span>查看源码</span>
            </button>
            <button @click="downloadCode" class="control-btn" title="下载该代码">
              <Icon icon="ph:download" width="16" height="16" />
              <span>下载</span>
            </button>
            <button @click="copyCode" class="control-btn" title="复制当前代码">
              <Icon icon="ph:copy" width="16" height="16" />
              <span>复制</span>
            </button>
          </div>
        </div>

        <!-- Vue 使用 VuePlayground -->
        <div v-if="currentFramework === 'vue'" class="playground-container" :key="'vue-' + sandpackKey">
          <!-- 文件目录树开关按钮（左上角，由 VuePlayground 组件自己提供） -->
          <VuePlayground
            :files="vuePlaygroundFiles"
            :main-file="vueMainFile"
            :dependencies="vuePlaygroundDependencies"
            :is-dark="isDark"
          />
        </div>

        <!-- JavaScript 和 React 使用 Sandpack -->
        <div
          v-else
          class="sandpack-container"
          :class="{
            'is-fullscreen': isSandpackFullscreen,
            'hide-editor': isSandpackFullscreen && !showEditorInFullscreen
          }"
          :key="'sandpack-' + sandpackKey"
          @mouseenter="isSandpackHovered = true"
          @mouseleave="isSandpackHovered = false"
        >
          <!-- 文件目录树开关按钮（左上角，鼠标悬停时显示） -->
          <button
            v-show="!isSandpackFullscreen && (isSandpackHovered || showFileExplorer)"
            class="file-explorer-toggle"
            :class="{ active: showFileExplorer }"
            @click="showFileExplorer = !showFileExplorer"
            title="显示/隐藏文件目录"
          >
            <Icon icon="ph:folder-open" width="16" height="16" />
          </button>
          <!-- 全屏时编辑器切换按钮（左上角） -->
          <button
            v-show="isSandpackFullscreen"
            class="editor-toggle"
            :class="{ active: showEditorInFullscreen }"
            @click="toggleEditorInFullscreen"
            :title="showEditorInFullscreen ? '隐藏编辑器' : '显示编辑器'"
          >
            <Icon
              :icon="showEditorInFullscreen ? 'ph:code-simple' : 'ph:code'"
              width="16"
              height="16"
            />
          </button>
          <!-- 全屏按钮（右上角，鼠标悬停时显示） -->
          <button
            v-show="isSandpackHovered || isSandpackFullscreen"
            class="fullscreen-toggle"
            @click="toggleSandpackFullscreen"
            :title="isSandpackFullscreen ? '退出全屏' : '全屏预览'"
          >
            <Icon
              :icon="isSandpackFullscreen ? 'ph:arrows-in' : 'ph:arrows-out'"
              width="16"
              height="16"
            />
          </button>
          <SandpackProvider
            :template="sandpackTemplate"
            :theme="sandpackTheme"
            :files="sandpackFiles"
            :custom-setup="sandpackCustomSetup"
            :options="sandpackProviderOptions"
          >
            <SandpackLayout class="sandpack-resizable-layout">
              <SandpackFileExplorer v-if="showFileExplorer && !isSandpackFullscreen" />
              <Splitpanes class="default-theme sandpack-splitpanes">
                <Pane v-show="!isSandpackFullscreen || showEditorInFullscreen" :size="33" :min-size="20">
                  <SandpackCodeEditor
                    :show-tabs="true"
                    :show-line-numbers="true"
                    :show-inline-errors="true"
                    :wrap-content="false"
                    :closable-tabs="false"
                  />
                </Pane>
                <Pane :size="67" :min-size="20">
                  <SandpackPreview
                    :show-refresh-button="true"
                  />
                </Pane>
              </Splitpanes>
            </SandpackLayout>
          </SandpackProvider>
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
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer
} from "sandpack-vue3";
import type { SandpackPredefinedTemplate } from "sandpack-vue3";
import { githubLight, amethyst } from "@codesandbox/sandpack-themes";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import JSZip from "jszip";
import { demoCategories, DIFFICULTY_LEVELS } from "@/config/demos/index";
import { FrameworkKey, useFramework } from "@/composables/useFramework";
import { useTheme } from "@/composables/useTheme";
import { toast } from "@/composables/useToast";
import type { CodeBlock } from "@/types/demo";
import {
  getDemoFiles,
  prepareSandpackFiles,
  BASE_DEMO_PATH
} from "@/utils/demoLoader";
import VuePlayground from "@/components/VuePlayground.vue";

interface DemoProps {
  category?: string;
  name?: string;
}

const props = defineProps<DemoProps>();
const route = useRoute();

const { getFrameworkByKey } = useFramework();
const { isDark } = useTheme();

// 响应式状态
const currentFramework = ref<FrameworkKey>("javascript");
const sandpackKey = ref(0); // 用于强制刷新 Sandpack 或 VuePlayground
const showFileExplorer = ref(false); // 文件目录树开关
const isSandpackHovered = ref(false); // Sandpack 容器鼠标悬停状态
const isSandpackFullscreen = ref(false); // Sandpack 全屏状态
const showEditorInFullscreen = ref(false); // 全屏时是否显示编辑器

// 切换 Sandpack 全屏模式
const toggleSandpackFullscreen = () => {
  isSandpackFullscreen.value = !isSandpackFullscreen.value;

  // 全屏时默认隐藏编辑器
  if (isSandpackFullscreen.value) {
    showEditorInFullscreen.value = false;
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
};

// 切换全屏时编辑器的显示/隐藏
const toggleEditorInFullscreen = () => {
  showEditorInFullscreen.value = !showEditorInFullscreen.value;
};

// ESC 键退出全屏
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && isSandpackFullscreen.value) {
    toggleSandpackFullscreen();
  }
};

import { onUnmounted } from "vue";

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  // 确保退出时恢复 body 滚动
  document.body.style.overflow = "";
});

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

// 当前代码内容
const currentEntry = computed(() => {
  if (!currentDemo.value) return undefined;
  const codeEntry = currentDemo.value.code.find(
    (c: CodeBlock) => c.framework === currentFramework.value
  );
  return codeEntry;
});

// 获取文件夹形式的源码（基于 path 配置）
const filesSource = computed(() => {
  if (!currentEntry.value?.path) return {};
  return getDemoFiles(currentEntry.value.path);
});

// Sandpack 配置
const sandpackTemplate = computed<SandpackPredefinedTemplate>(() => {
  switch (currentFramework.value) {
    case "vue":
      return "vite-vue-ts";
    case "react":
      return "vite-react-ts";
    case "javascript":
    default:
      return "vanilla-ts";
  }
});

const sandpackTheme = computed(() => {
  return isDark.value ? amethyst : githubLight;
});

const sandpackFiles = computed(() => {
  if (!currentEntry.value) return {};

  // 使用文件夹中的文件（path 模式）
  if (Object.keys(filesSource.value).length > 0) {
    return prepareSandpackFiles(filesSource.value, currentFramework.value, currentEntry.value);
  }

  return {};
});

const sandpackCustomSetup = computed(() => {
  const dependencies: Record<string, string> = {};

  // 根据框架添加对应的 gantt 包（Vue 使用 VuePlayground，这里仅针对 React 和 JS）
  switch (currentFramework.value) {
    case "react":
      dependencies["@xpyjs/gantt-react"] = "latest";
      break;
    case "javascript":
    default:
      dependencies["@xpyjs/gantt-core"] = "latest";
      break;
  }

  // 合并代码块中定义的额外依赖
  if (currentEntry.value?.dependencies) {
    Object.assign(dependencies, currentEntry.value.dependencies);
  }

  return { dependencies };
});

// Sandpack Provider 选项（用于自定义布局）
const sandpackProviderOptions = computed(() => ({
  bundlerTimeOut: 120000, // 增加超时时间到 120 秒
  initMode: "lazy" as const
}));

// ============= VuePlayground 相关配置 =============

// VuePlayground 文件（原始文件，不需要 Sandpack 模板包装）
const vuePlaygroundFiles = computed(() => {
  if (!currentEntry.value || currentFramework.value !== 'vue') return {};

  const files: Record<string, string> = {};
  for (const [path, content] of Object.entries(filesSource.value)) {
    if (typeof content === 'string') {
      files[path] = content;
    }
  }
  return files;
});

// VuePlayground 主文件
const vueMainFile = computed(() => {
  return 'src/App.vue';
});

// VuePlayground 依赖
const vuePlaygroundDependencies = computed(() => {
  if (!currentEntry.value?.dependencies) return {};
  return currentEntry.value.dependencies;
});

// 复制代码到剪贴板
const copyCode = async () => {
  // 从文件源获取主入口文件内容
  const files = filesSource.value;
  let codeContent = '';

  // 根据框架类型确定主文件
  switch (currentFramework.value) {
    case 'vue':
      codeContent = files['src/App.vue'] as string || '';
      break;
    case 'react':
      codeContent = files['App.tsx'] as string || '';
      break;
    case 'javascript':
    default:
      codeContent = files['index.ts'] as string || '';
      break;
  }

  if (!codeContent) {
    toast.warning("没有可复制的代码内容");
    return;
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    const copySuccess = await navigator.clipboard
      .writeText(codeContent)
      .then(() => true)
      .catch(error => {
        console.error("现代剪贴板 API 失败:", error);
        return false;
      });

    if (copySuccess) {
      toast.success("代码已复制到剪贴板");
    } else {
      fallbackCopyText(codeContent);
    }
  } else {
    fallbackCopyText(codeContent);
  }
};

/**
 * 降级复制方法
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

// 切换框架
const switchFramework = (framework: FrameworkKey) => {
  currentFramework.value = framework;
  // 强制刷新 Sandpack
  sandpackKey.value++;
};

// 查看源码 - 打开 GitHub 链接
const viewSource = () => {
  if (!currentEntry.value?.path) {
    toast.warning("该示例暂无源码链接");
    return;
  }
  const url = `https://github.com/xpyjs/gantt/tree/master/docs${BASE_DEMO_PATH}${currentEntry.value.path}`;
  window.open(url, "_blank");
};

// 下载代码
const downloadCode = async () => {
  const files = sandpackFiles.value;
  if (!files || Object.keys(files).length === 0) {
    toast.warning("没有可下载的代码内容");
    return;
  }

  try {
    const zip = new JSZip();
    const folderName = `${currentDemo.value?.id || "demo"}-${currentFramework.value}`;

    // 添加所有文件到 zip
    for (const [filePath, content] of Object.entries(files)) {
      // 移除开头的 /
      const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
      zip.file(cleanPath, typeof content === "string" ? content : content.code);
    }

    // 生成 zip 文件
    const blob = await zip.generateAsync({ type: "blob" });

    // 下载
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${folderName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("代码下载成功");
  } catch (error) {
    console.error("下载失败:", error);
    toast.error("下载失败，请重试");
  }
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

// 监听演示变化
watch(
  () => currentDemo.value,
  () => {
    if (currentDemo.value && availableFrameworks.value.length > 0) {
      currentFramework.value = availableFrameworks.value[0].key;
    }
    sandpackKey.value++;
  }
);

// 组件挂载后初始化
onMounted(() => {
  if (currentDemo.value && availableFrameworks.value.length > 0) {
    currentFramework.value = availableFrameworks.value[0].key;
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
  padding: 0.4rem 0.8rem;
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
}

.framework-tab.active {
  background: #007acc;
  border-color: #007acc;
  color: white;
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

/* Sandpack 容器样式 */
.sandpack-container,
.playground-container {
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-top: none;
  background: var(--bg-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  min-height: 500px;
  transition: all 0.3s ease;
}

/* Sandpack 全屏模式 */
.sandpack-container.is-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  border-radius: 0;
  border: none;
  min-height: 100vh;
}

.sandpack-container.is-fullscreen :deep(.sp-layout) {
  height: 100vh !important;
}

/* 全屏按钮 */
.fullscreen-toggle {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.6;
}

.fullscreen-toggle:hover {
  opacity: 1;
  border-color: var(--accent-color);
  color: var(--accent-color);
  background: var(--bg-primary);
}

/* 全屏时编辑器切换按钮（左上角） */
.editor-toggle {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.editor-toggle:hover,
.editor-toggle.active {
  opacity: 1;
  border-color: var(--accent-color);
  color: var(--accent-color);
}

/* 全屏时隐藏编辑器的样式 */
.sandpack-container.hide-editor :deep(.sandpack-splitpanes .splitpanes__pane:first-child) {
  display: none !important;
}

.sandpack-container.hide-editor :deep(.sandpack-splitpanes .splitpanes__splitter) {
  display: none !important;
}

.sandpack-container.hide-editor :deep(.sandpack-splitpanes .splitpanes__pane:last-child) {
  width: 100% !important;
  flex: 1 !important;
}

/* Sandpack 布局高度 */
.sandpack-container :deep(.sp-layout) {
  height: 500px;
  border: none;
  border-radius: 0;
}

/* Sandpack 可拖拽分割面板样式 */
.sandpack-container :deep(.sandpack-splitpanes) {
  flex: 1;
  height: 100%;
}

.sandpack-container :deep(.sandpack-splitpanes .splitpanes__pane) {
  display: flex;
  overflow: hidden;
}

.sandpack-container :deep(.sandpack-splitpanes .splitpanes__splitter) {
  background: var(--border-color);
  position: relative;
  z-index: 1;
  width: 2px;
}

.sandpack-container :deep(.sandpack-splitpanes .splitpanes__splitter:hover) {
  /* background: var(--accent-color); */
}

.sandpack-container :deep(.sandpack-splitpanes .splitpanes__splitter::before) {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 30px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

/* Sandpack 内部组件高度 */
.sandpack-container :deep(.sp-stack) {
  height: 100%;
}

.sandpack-container :deep(.sp-editor) {
  height: 100%;
  flex: 1;
}

.sandpack-container :deep(.sp-preview) {
  height: 100%;
  flex: 2;
}

.sandpack-container :deep(.sp-code-editor) {
  height: 100%;
}

.sandpack-container :deep(.sp-cm) {
  height: 100%;
}

.sandpack-container :deep(.cm-editor) {
  height: 100%;
}

.sandpack-container :deep(.sp-file-explorer) {
  height: 100%;
}

/* 文件目录树开关按钮（左上角） */
.file-explorer-toggle {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.file-explorer-toggle:hover,
.file-explorer-toggle.active {
  opacity: 1;
  border-color: var(--accent-color);
  color: var(--accent-color);
}

/* 隐藏 Sandpack 的底部状态栏和控制按钮 */
.sandpack-container :deep(.sp-preview-container) {
  position: relative;
}

/* 隐藏左下角的地址 */
.sandpack-container :deep(.sp-bridge-frame) {
  display: none !important;
}

/* 隐藏右下角按钮 */
.sandpack-container :deep(.sp-preview-actions) {
  display: none !important;
}

/* 隐藏加载时的终端输出 */
.sandpack-container :deep(.sp-loading) {
  display: none !important;
}

/* 隐藏终端/控制台 */
.sandpack-container :deep(.sp-console) {
  display: none !important;
}

/* 预览区域样式优化 */
.sandpack-container :deep(.sp-preview) {
  background: var(--bg-primary);
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
