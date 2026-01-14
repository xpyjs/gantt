<template>
  <div
    class="vue-playground"
    :class="{
      'is-dark': isDark,
      'is-fullscreen': isFullscreen,
      'hide-editor': isFullscreen && !showEditorInFullscreen
    }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- 文件目录树开关按钮（左上角，鼠标悬停时显示） -->
    <button
      v-show="!isFullscreen && (isHovered || showFileExplorer)"
      class="file-explorer-toggle"
      :class="{ active: showFileExplorer }"
      @click="showFileExplorer = !showFileExplorer"
      title="显示/隐藏文件目录"
    >
      <Icon icon="ph:folder-open" width="16" height="16" />
    </button>

    <!-- 全屏时编辑器切换按钮（左上角） -->
    <button
      v-show="isFullscreen"
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
      v-show="isHovered || isFullscreen"
      class="fullscreen-toggle"
      @click="toggleFullscreen"
      :title="isFullscreen ? '退出全屏' : '全屏预览'"
    >
      <Icon
        :icon="isFullscreen ? 'ph:arrows-in' : 'ph:arrows-out'"
        width="16"
        height="16"
      />
    </button>

    <div class="playground-body">
      <!-- 文件目录树 -->
      <div v-if="showFileExplorer && !isFullscreen" class="file-explorer">
        <div class="file-tree">
          <div
            v-for="file in allFiles"
            :key="file"
            class="file-item"
            :class="{ active: activeFile === file }"
            @click="setActiveFile(file)"
          >
            <Icon
              :icon="getFileIcon(file)"
              width="14"
              height="14"
              class="file-icon"
            />
            <span class="file-name">{{ getFileName(file) }}</span>
          </div>
        </div>
      </div>

      <!-- 编辑器和预览区域 -->
      <div class="playground-main">
        <Repl
          v-if="store"
          :store="store"
          :editor="CodeMirror"
          :show-compile-output="false"
          :show-import-map="false"
          :show-ts-config="false"
          :clear-console="true"
          :theme="isDark ? 'dark' : 'light'"
          :preview-theme="false"
          :preview-options="previewOptions"
        />
        <!-- 加载覆盖层 -->
        <div v-if="isLoading" class="playground-loading-overlay">
          <Icon icon="svg-spinners:ring-resize" width="32" height="32" />
          <span>{{ loadingText }}</span>
        </div>
        <!-- 初始加载状态（store 还未创建） -->
        <div v-if="!store" class="playground-loading">
          <Icon icon="svg-spinners:ring-resize" width="32" height="32" />
          <span>正在加载编辑器...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, shallowRef, type Ref } from "vue";
import { Repl, useStore, useVueImportMap, type ReplStore } from "@vue/repl";
import CodeMirror from "@vue/repl/codemirror-editor";
import { Icon } from "@iconify/vue";

interface Props {
  /** 文件内容映射 */
  files: Record<string, string>;
  /** 主文件名 */
  mainFile?: string;
  /** 额外的依赖 */
  dependencies?: Record<string, string>;
  /** 是否暗色主题 */
  isDark?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  mainFile: "src/App.vue",
  dependencies: () => ({}),
  isDark: false
});

// 状态
const showFileExplorer = ref(false);
const isHovered = ref(false); // 鼠标是否悬停在编辑器区域
const isFullscreen = ref(false); // 是否全屏模式
const showEditorInFullscreen = ref(false); // 全屏时是否显示编辑器
const activeFile = ref(props.mainFile);
const store = shallowRef<ReplStore | null>(null);
const isLoading = ref(true); // 加载状态
const loadingText = ref("正在初始化..."); // 加载文案

// 切换全屏模式
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;

  // 全屏时默认隐藏编辑器
  if (isFullscreen.value) {
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
  if (e.key === "Escape" && isFullscreen.value) {
    toggleFullscreen();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
  initStore();
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  // 确保退出时恢复 body 滚动
  document.body.style.overflow = "";
});

// 预览选项
const previewOptions = computed(() => ({
  headHTML: `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/element-plus/dist/index.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@xpyjs/gantt-vue/dist/style.css">
    <style>
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
          "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      }
      html,
      body,
      #app {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      .demo-container {
        width: 100%;
        height: 100%;
      }
      /* 加载中提示 */
      .playground-preview-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #6b7280;
        font-size: 14px;
      }
      .playground-preview-loading::before {
        content: "⏳";
        font-size: 32px;
        margin-bottom: 8px;
      }
    </style>
  `,
  placeholderHTML: `<div class="playground-preview-loading">正在加载预览...</div>`,
  customCode: {
    // 全局注册 Element Plus，解决组件找不到的问题
    importCode: `import ElementPlus from 'element-plus'`,
    useCode: `app.use(ElementPlus)`
  }
}));

// 计算所有文件
const allFiles = computed(() => {
  return Object.keys(props.files).sort((a, b) => {
    // 将 App.vue 放在最前面
    if (a.includes("App.vue")) return -1;
    if (b.includes("App.vue")) return 1;
    return a.localeCompare(b);
  });
});

// 获取文件名
const getFileName = (path: string) => {
  return path.split("/").pop() || path;
};

// 获取文件图标
const getFileIcon = (path: string) => {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "vue":
      return "logos:vue";
    case "ts":
    case "tsx":
      return "logos:typescript-icon";
    case "js":
    case "jsx":
      return "logos:javascript";
    case "css":
      return "logos:css-3";
    case "scss":
      return "logos:sass";
    case "json":
      return "vscode-icons:file-type-json";
    default:
      return "ph:file";
  }
};

// 设置活动文件
const setActiveFile = (file: string) => {
  activeFile.value = file;
  if (store.value) {
    store.value.setActive(file);
  }
};

// 初始化 store
const initStore = async () => {
  // 使用 Vue Import Map
  const { importMap: builtinImportMap, vueVersion } = useVueImportMap({});

  // 创建 store
  const replStore = useStore(
    {
      builtinImportMap,
      vueVersion,
      showOutput: ref(false),
      outputMode: ref("preview" as const)
    }
  );

  // 收集所有文件路径（用于路径解析）
  const allFilePaths = Object.keys(props.files);

  // 设置文件
  const filesMap: Record<string, string> = {};
  for (const [path, content] of Object.entries(props.files)) {
    // 确保路径以 src/ 开头（@vue/repl 的要求）
    // const normalizedPath = path.startsWith("src/") ? path : `src/${path}`;
    const normalizedPath = path;

    // 处理文件内容
    let processedContent = content;

    // 1. 移除 CSS 文件的 import 语句（这些 CSS 已通过 headHTML 加载）
    // 匹配 import '@xpyjs/gantt-vue/style.css' 或 import "@xpyjs/gantt-vue/style.css"
    // 以及其他类似的 CSS 导入语句
    processedContent = processedContent
      .replace(/import\s+['"]@xpyjs\/gantt-vue\/style\.css['"]\s*;?\n?/g, '// CSS 已通过 headHTML 加载\n')
      .replace(/import\s+['"]@xpyjs\/gantt-core\/style\.css['"]\s*;?\n?/g, '// CSS 已通过 headHTML 加载\n')
      .replace(/import\s+['"]element-plus\/dist\/index\.css['"]\s*;?\n?/g, '// CSS 已通过 headHTML 加载\n');

    // 2. 处理特殊问题
    // - 找不到 ../data，转 ./data （data.ts 在 src 下，引用在子文件夹。我觉得是 @vue/repl 解析问题）
    processedContent = processedContent.replace(/from\s+['"]\.\.\/data['"]/g, "from './data'");

    filesMap[normalizedPath] = processedContent;
  }

  // 确保有主文件
  const mainFile = props.mainFile.startsWith("src/")
    ? props.mainFile
    : `src/${props.mainFile}`;

  await replStore.setFiles(filesMap, mainFile);

  // 设置 Import Map（添加第三方依赖）
  // 注意：CSS 文件不能作为 ES 模块导入，需要通过 headHTML 加载
  // 使用 esm.sh CDN，它会自动处理 ESM 模块转换
  // 使用 ?external=vue 避免多个 Vue 实例冲突
  const customImports = {
    // Element Plus - 使用外部 Vue 避免实例冲突
    "element-plus": "https://esm.sh/element-plus@2.11.2?external=vue",
    "@element-plus/icons-vue": "https://esm.sh/@element-plus/icons-vue@2.3.2?external=vue",
    // XGantt Vue - 使用外部 Vue 避免实例冲突
    "@xpyjs/gantt-vue": "https://esm.sh/@xpyjs/gantt-vue?external=vue",
    // 相关依赖
    "@xpyjs/gantt-core": "https://esm.sh/@xpyjs/gantt-core?external=vue",
    "konva": "https://esm.sh/konva@9.3.6",
    // dayjs - 使用 esm.sh 自动处理 ESM 转换
    "dayjs": "https://esm.sh/dayjs@1.11.13",
    "dayjs/": "https://esm.sh/dayjs@1.11.13/",
    // lodash-es
    "lodash-es": "https://esm.sh/lodash-es@4.17.21",
    ...props.dependencies
  };

  // 获取当前 import map 并合并自定义的依赖
  // 自定义的放在后面以便覆盖可能的 null 值
  const currentImportMap = replStore.getImportMap();
  const mergedImportMap = {
    imports: {
      ...currentImportMap.imports,
      ...customImports
    }
  };

  replStore.setImportMap(mergedImportMap, false);

  // 初始化
  replStore.init();

  store.value = replStore;

  // 更新加载状态
  loadingText.value = "正在编译文件...";

  // 监听编译完成：通过监听 errors 数组的变化来判断编译状态
  // 编译过程会触发 errors 数组的变化（即使没有错误也会清空）
  const stopWatch = watch(
    () => replStore.errors,
    () => {
      // 编译完成后，给一个短暂的延迟让预览区域渲染
      loadingText.value = "正在渲染预览...";
      setTimeout(() => {
        isLoading.value = false;
        stopWatch();
      }, 500);
    },
    { deep: true }
  );

  // 设置一个超时，防止无限等待
  setTimeout(() => {
    if (isLoading.value) {
      isLoading.value = false;
      stopWatch();
    }
  }, 10000); // 10秒后强制结束加载
};

// 监听文件变化
watch(
  () => props.files,
  async () => {
    if (store.value) {
      const filesMap: Record<string, string> = {};
      for (const [path, content] of Object.entries(props.files)) {
        const normalizedPath = path.startsWith("src/") ? path : `src/${path}`;
        filesMap[normalizedPath] = content;
      }
      await store.value.setFiles(filesMap);
    }
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.vue-playground {
  display: flex;
  flex-direction: column;
  height: 500px;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-color, #fff);
  position: relative;
  transition: all 0.3s ease;

  &.is-dark {
    --bg-color: #1a1a1a;
    --border-color: #3d3d3d;
    --text-color: #e5e7eb;
    --hover-bg: #2d2d2d;
  }

  /* 全屏模式 */
  &.is-fullscreen {
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
  }
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
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 6px;
  background: var(--bg-color, #fff);
  color: var(--text-color, #6b7280);
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.7;

  &:hover,
  &.active {
    opacity: 1;
    border-color: #b382e7;
    color: #b382e7;
  }
}

/* 全屏按钮（右上角） */
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
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 6px;
  background: var(--bg-color, #fff);
  color: var(--text-color, #6b7280);
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.6;

  &:hover {
    opacity: 1;
    border-color: #b382e7;
    color: #b382e7;
    background: var(--bg-color, #fff);
  }
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
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 6px;
  background: var(--bg-color, #fff);
  color: var(--text-color, #6b7280);
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.7;

  &:hover,
  &.active {
    opacity: 1;
    border-color: #b382e7;
    color: #b382e7;
  }
}

.playground-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.file-explorer {
  width: 200px;
  border-right: 1px solid var(--border-color, #e5e7eb);
  overflow-y: auto;
  background: var(--bg-color, #f9fafb);
  padding-top: 48px; /* 为按钮留出空间 */
}

.file-tree {
  padding: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-color, #374151);
  transition: all 0.15s;

  &:hover {
    background: var(--hover-bg, rgba(0, 0, 0, 0.05));
  }

  &.active {
    background: rgba(179, 130, 231, 0.15);
    color: #b382e7;
  }
}

.file-icon {
  flex-shrink: 0;
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.playground-main {
  flex: 1;
  overflow: hidden;
  position: relative;

  :deep(.vue-repl) {
    height: 100%;
  }

  :deep(.split-pane) {
    height: 100%;
  }

  /* 隐藏编辑器右下角的开关按钮（展示错误/自动保存） */
  :deep(.editor-floating) {
    display: none !important;
  }
}

/* 全屏时隐藏编辑器 */
.vue-playground.hide-editor {
  .playground-main {
    :deep(.split-pane .left) {
      display: none !important;
    }

    :deep(.split-pane .right) {
      width: 100% !important;
      flex: 1 !important;
    }

    /* 隐藏分割线 */
    :deep(.split-pane .divider) {
      display: none !important;
    }
  }
}

.playground-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
  color: var(--text-color, #6b7280);
}

/* 加载覆盖层 - 覆盖在编辑器和预览区域上方 */
.playground-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: var(--bg-color, rgba(255, 255, 255, 0.95));
  color: var(--text-color, #6b7280);
  z-index: 5;
  font-size: 14px;
  transition: opacity 0.3s ease;
}

.is-dark .playground-loading-overlay {
  background: rgba(26, 26, 26, 0.95);
}
</style>
