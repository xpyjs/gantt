<template>
  <div class="tutorials-page">
    <header class="page-header">
      <div class="container">
        <h1>教程文档</h1>
        <p>深入学习 XGantt 的各种功能和 API</p>
      </div>
    </header>

    <div class="tutorials-content">
      <aside class="tutorials-sidebar">
        <nav class="tutorials-nav">
          <div
            v-for="category in navigationData"
            :key="category.id"
            class="nav-section"
          >
            <h3>{{ category.title }}</h3>
            <ul>
              <li v-for="section in category.sections" :key="section.id">
                <a
                  :href="`#${section.id}`"
                  :class="{ active: activeSection === section.id }"
                  @click.prevent="scrollTo(section.id)"
                >
                  {{ section.title }}
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
      <main>
        <!-- 动态渲染所有章节 -->
        <template v-for="category in tutorialConfig" :key="category.id">
          <section class="tutorials-main">
            <h1 class="category-title">{{ category.title }}</h1>
            <div
              v-for="section in category.sections"
              :key="section.id"
              :id="section.id"
              class="tutorial-section"
            >
              <h2>{{ section.title }}</h2>
              <TutorialSection :section="section" />
            </div>
          </section>
        </template>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { tutorialConfig, getNavigationData } from "../config/tutorials/index";
import TutorialSection from "../components/TutorialSection.vue";

// 获取导航数据
const navigationData = getNavigationData();

// 当前活跃的章节
const activeSection = ref<string>("");

// 防抖函数
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

// 获取所有章节ID
const getAllSectionIds = (): string[] => {
  const ids: string[] = [];
  tutorialConfig.forEach(category => {
    category.sections.forEach(section => {
      ids.push(section.id);
    });
  });
  return ids;
};

// 滚动监听器
const handleScroll = debounce(() => {
  const sectionIds = getAllSectionIds();
  const headerOffset = 150; // 增加一点偏移量以便更好地检测

  // 找到当前在视口中的章节
  for (let i = sectionIds.length - 1; i >= 0; i--) {
    const element = document.getElementById(sectionIds[i]);
    if (element) {
      const rect = element.getBoundingClientRect();
      // 如果元素的顶部在视口上方不远处，认为它是当前活跃的
      if (rect.top <= headerOffset) {
        activeSection.value = sectionIds[i];
        break;
      }
    }
  }
}, 100);

const scrollTo = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    const headerOffset = 80;
    const elementPosition = element.offsetTop;
    const offsetPosition = elementPosition - headerOffset;

    // 使用更平滑的滚动
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });

    // 立即更新活跃章节
    activeSection.value = elementId;
  }
};

// 组件挂载时添加滚动监听
onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  // 初始化活跃章节
  handleScroll();
});

// 组件卸载时移除滚动监听
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.tutorials-page {
  min-height: calc(100vh - 64px);
  background: var(--bg-secondary);
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-header h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
}

.page-header p {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.tutorials-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 3rem;
  align-items: start;
}

/* 侧边栏 */
.tutorials-sidebar {
  position: sticky;
  top: 100px;
}

.tutorials-nav {
  background: var(--bg-primary);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-section {
  margin-bottom: 2rem;
}

.nav-section:last-child {
  margin-bottom: 0;
}

.nav-section h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
  border-bottom: 2px solid #007acc;
  padding-bottom: 0.5rem;
}

.nav-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-section li {
  margin-bottom: 0.5rem;
}

.nav-section a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  display: block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  position: relative;
}

.nav-section a:hover {
  color: #007acc;
  background: rgba(0, 122, 204, 0.1);
}

.nav-section a.active {
  color: #007acc;
  background: rgba(0, 122, 204, 0.15);
  font-weight: 600;
}

.nav-section a.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: #007acc;
  border-radius: 0 2px 2px 0;
}

.category-title {
  margin-bottom: 1rem;
  color: var(--accent-color);
  font-weight: bold;
  font-style: italic;
}

/* 主要内容 */
.tutorials-main {
  background: var(--bg-primary);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 4rem;
}

.tutorial-section {
  margin-bottom: 3rem;
  scroll-margin-top: 100px;
}

.tutorial-section:last-child {
  margin-bottom: 0;
}

.tutorial-section h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
  border-bottom: 3px solid #007acc;
  padding-bottom: 0.5rem;
}

.tutorial-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 1rem;
  color: var(--text-primary);
}

.tutorial-section p {
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.tutorial-section ul {
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.tutorial-section li {
  margin-bottom: 0.5rem;
}

/* 代码块 */
.code-block {
  background: var(--bg-secondary);
  border-radius: 6px;
  padding: 1.5rem;
  margin: 1rem 0;
  overflow-x: auto;
  border-left: 4px solid #007acc;
}

.code-block pre {
  margin: 0;
  font-family: "Monaco", "Consolas", "Courier New", "Menlo", "Liberation Mono",
    monospace;
  font-size: 0.875rem;
  line-height: 1.5;
}

.code-block code {
  color: var(--text-primary);
  background: none !important;
  padding: 0 !important;
  border: none !important;
  border-radius: 0 !important;
  font-family: "Monaco", "Consolas", "Courier New", "Menlo", "Liberation Mono",
    monospace;
  font-size: 0.875rem;
}

/* 内联代码 - 只应用于非代码块中的code */
code:not(pre code) {
  background: var(--bg-secondary);
  color: #d73a49;
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
  font-family: "Monaco", "Consolas", "Courier New", "Menlo", "Liberation Mono",
    monospace;
  font-size: 0.875rem;
}

/* 配置表格 */
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
  padding: 0.75rem;
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
}

/* 暗色主题支持 */
:global([data-theme="dark"]) .tutorials-nav {
  background: #2a2a2a;
  color: #ffffff;
}

:global([data-theme="dark"]) .tutorials-main {
  background: #2a2a2a;
  color: #ffffff;
}

:global([data-theme="dark"]) .tutorial-section h2,
:global([data-theme="dark"]) .tutorial-section h3 {
  color: #ffffff;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .tutorials-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .tutorials-sidebar {
    position: static;
  }

  .tutorials-nav {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 3rem 0;
  }

  .page-header h1 {
    font-size: 2.5rem;
  }

  .tutorials-content {
    padding: 2rem 1rem;
  }

  .tutorials-main {
    padding: 1.5rem;
  }

  .tutorial-section h2 {
    font-size: 1.5rem;
  }

  .code-block {
    padding: 1rem;
  }

  .config-table {
    font-size: 0.875rem;
  }

  .config-table th,
  .config-table td {
    padding: 0.5rem;
  }
}
</style>
