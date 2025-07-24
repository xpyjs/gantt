<template>
  <div class="api-page">
    <!-- 主内容区 -->
    <section class="api-content">
      <div>
        <div class="api-layout">
          <!-- 侧边菜单 -->
          <aside class="api-sidebar">
            <div class="sidebar-content">
              <div class="sidebar-header">
                <Icon
                  icon="line-md:u-turn-left"
                  width="28"
                  height="28"
                  class="back-icon"
                  @click="$router.push('/api')"
                />
                <h3>事件目录</h3>
              </div>
              <nav class="api-nav">
                <ul class="nav-list">
                  <li>
                    <a
                      href="#overview"
                      :class="{ active: activeSection === 'overview' }"
                      @click="scrollToSection('overview')"
                    >
                      <i class="icon">📖</i> {{ overview.title }}
                    </a>
                  </li>
                  <li v-for="category in categories" :key="category.id">
                    <a
                      :href="`#${category.id}`"
                      :class="{ active: activeSection === category.id }"
                      @click="scrollToSection(category.id)"
                    >
                      <i class="icon">{{ category.icon }}</i>
                      {{ category.title }}
                    </a>
                    <ul class="sub-nav">
                      <li v-for="event in category.events" :key="event.id">
                        <a
                          :href="`#${event.id}`"
                          :class="{ active: activeSection === event.id }"
                          @click="scrollToSection(event.id)"
                        >
                          {{ event.name }} - {{ event.type }}
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a
                      href="#best-practices"
                      :class="{ active: activeSection === 'best-practices' }"
                      @click="scrollToSection('best-practices')"
                    >
                      <i class="icon">💡</i> 最佳实践
                    </a>
                  </li>
                  <li v-if="completeExamples">
                    <a
                      href="#complete-examples"
                      :class="{ active: activeSection === 'complete-examples' }"
                      @click="scrollToSection('complete-examples')"
                    >
                      <i class="icon">🔧</i> 完整示例
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>
          <!-- 主要内容 -->
          <main class="api-main">
            <div class="api-sections">
              <!-- 事件概述 -->
              <div class="section" id="overview">
                <h2>{{ overview.title }}</h2>
                <p>{{ overview.description }}</p>
                <FrameworkCodeBlock :code-blocks="overview.examples" />
              </div>

              <!-- 事件分类 -->
              <div
                v-for="category in categories"
                :key="category.id"
                class="section"
                :id="category.id"
              >
                <h2>{{ category.title }}</h2>
                <p v-if="category.description">{{ category.description }}</p>

                <!-- 事件分组 -->
                <div class="event-category">
                  <div
                    v-for="event in category.events"
                    :key="event.id"
                    class="event-item section"
                    :id="event.id"
                  >
                    <div class="event-header">
                      <h4>{{ event.name }}</h4>
                      <span class="event-type">{{ event.type }}</span>
                    </div>
                    <div class="event-description">
                      <p><strong>触发时机：</strong>{{ event.trigger }}</p>
                      <p v-if="event.parameters.length > 0">
                        <strong>参数：</strong>
                      </p>
                      <ul v-if="event.parameters.length > 0">
                        <li v-for="param in event.parameters" :key="param.name">
                          <code>{{ param.name }}: {{ param.type }}</code> -
                          {{ param.description }}
                        </li>
                      </ul>

                      <!-- 事件备注 -->
                      <div v-if="event.notes && event.notes.length > 0">
                        <template
                          v-for="(note, index) in event.notes"
                          :key="index"
                        >
                          <p v-if="note.includes(':')" style="margin-bottom: 0">
                            <i
                              ><strong>{{ note.split(":")[0] }}：</strong
                              >{{ note.split(":").slice(1).join(":") }}</i
                            >
                          </p>
                          <ul v-else-if="note.includes(' - ')">
                            <li>
                              <code>{{ note.split(" - ")[0] }}</code> -
                              {{ note.split(" - ")[1] }}
                            </li>
                          </ul>
                          <p v-else style="margin-bottom: 0">
                            <i>{{ note }}</i>
                          </p>
                        </template>
                      </div>

                      <!-- 事件代码示例 -->
                      <FrameworkCodeBlock
                        v-if="event.examples && event.examples.length > 0"
                        :code-blocks="event.examples"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- 最佳实践 -->
              <div class="section" id="best-practices">
                <h2>最佳实践</h2>
                <div class="best-practices">
                  <div
                    v-for="practice in bestPractices"
                    :key="practice.id"
                    class="practice-item"
                  >
                    <h4>
                      <i class="icon">{{ practice.icon }}</i>
                      {{ practice.title }}
                    </h4>
                    <ul>
                      <li
                        v-for="(item, index) in practice.content"
                        :key="index"
                      >
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- 完整示例 -->
              <div
                v-if="completeExamples && completeExamples.length > 0"
                class="section"
                id="complete-examples"
              >
                <h2>完整示例</h2>
                <p>以下是在不同框架中使用事件监听的完整示例：</p>
                <FrameworkCodeBlock :code-blocks="completeExamples" />
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>

    <!-- 回到顶部按钮 -->
    <button
      v-show="showBackToTop"
      @click="scrollToTop"
      class="back-to-top"
      title="回到顶部"
    >
      <Icon icon="material-symbols:keyboard-arrow-up" width="24" height="24" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Icon } from "@iconify/vue";
import FrameworkCodeBlock from "@/components/FrameworkCodeBlock.vue";
import { eventsPageConfig } from "@/config/events";

// 当前激活的导航section
const activeSection = ref("overview");

// 显示回到顶部按钮
const showBackToTop = ref(false);

// 从配置中获取数据
const { overview, categories, bestPractices, completeExamples } =
  eventsPageConfig;

// 滚动到指定section
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

// 回到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

// 监听滚动事件，更新激活的导航项
const handleScroll = () => {
  const scrollTop = window.pageYOffset + 150; // 增加偏移量避免被页面头部遮挡
  const sections = document.querySelectorAll(".section");

  // 显示/隐藏回到顶部按钮
  showBackToTop.value = scrollTop > 300;

  // 更新激活状态
  let currentActive = "overview";
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i] as HTMLElement;
    if (section.offsetTop <= scrollTop && section.id) {
      currentActive = section.id;
      break;
    }
  }

  if (currentActive) {
    activeSection.value = currentActive;
  }
};

onMounted(() => {
  // 添加滚动监听
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  // 移除滚动监听
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.api-page {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  max-width: 1200px;
  margin: 0 auto;
}

.api-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.api-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
}

/* 侧边栏样式 */
.api-sidebar {
  position: sticky;
  top: 80px;
  height: fit-content;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.sidebar-content {
  padding: 24px;
}

.sidebar-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
}

.sidebar-header .back-icon {
  vertical-align: middle;
  margin-right: 8px;
  transform: rotate(90deg);
  cursor: pointer;
  transition: all 0.2s;
}

.sidebar-header .back-icon:hover {
  transform: rotate(90deg) translateX(-2px);
  color: var(--accent-color);
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.api-nav {
  font-size: 0.9rem;
}

.nav-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-list > li {
  margin-bottom: 4px;
}

.nav-list a {
  display: block;
  padding: 8px 12px;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;
  font-weight: 500;
}

.nav-list a:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.nav-list a.active {
  background: var(--accent-color);
  color: white;
  font-weight: 600;
}

.sub-nav {
  margin: 4px 0 0 0;
  padding: 0;
  list-style: none;
}

.sub-nav li {
  margin-bottom: 2px;
}

.sub-nav a {
  padding: 6px 12px 6px 24px;
  font-size: 0.85rem;
  font-weight: 400;
  white-space: nowrap;
}

.sub-nav a.active {
  background: var(--accent-color-light);
  color: var(--accent-color);
  font-weight: 600;
}

.icon {
  margin-right: 8px;
  font-size: 1.1em;
}

/* 滚动条样式 */
.api-sidebar::-webkit-scrollbar {
  width: 6px;
}

.api-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.api-sidebar::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.api-sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

/* 主内容区样式 */
.api-main {
  flex: 1;
  min-width: 0;
}

.section {
  margin-bottom: 60px;
}

.section h2 {
  font-size: 2.2rem;
  color: var(--text-primary);
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 3px solid var(--accent-color);
  font-weight: 700;
}

.event-category {
  margin-bottom: 48px;
}

.event-category h3 {
  font-size: 1.6rem;
  color: var(--text-primary);
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
}

.event-item {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border-left: 5px solid var(--accent-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.event-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.event-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.event-header h4 {
  font-size: 1.4rem;
  color: var(--text-primary);
  margin: 0;
  font-family: "JetBrains Mono", "Consolas", "Monaco", monospace;
  background: var(--bg-tertiary);
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  border: 1px solid var(--border-color);
}

.event-type {
  background: var(--accent-color);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.event-description p {
  margin-bottom: 16px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.event-description strong {
  color: var(--text-primary);
  font-weight: 600;
}

.event-description ul {
  margin: 16px 0;
  padding-left: 24px;
}

.event-description li {
  margin-bottom: 8px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.event-description code {
  background: var(--bg-tertiary);
  padding: 3px 8px;
  border-radius: 6px;
  font-family: "JetBrains Mono", "Consolas", "Monaco", monospace;
  color: var(--accent-color);
  font-size: 0.9em;
  font-weight: 500;
  border: 1px solid var(--border-color);
}

.framework-examples {
  display: grid;
  gap: 32px;
}

.best-practices {
  display: grid;
  gap: 28px;
}

.practice-item {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  border-left: 5px solid var(--success-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.practice-item h4 {
  font-size: 1.3rem;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
}

.practice-item ul {
  margin: 0;
  padding-left: 24px;
}

.practice-item li {
  margin-bottom: 10px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 回到顶部按钮 */
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 122, 204, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
}

.back-to-top:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 122, 204, 0.4);
}

.back-to-top:active {
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .api-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .api-sidebar {
    position: relative;
    top: auto;
    max-height: none;
    order: 2;
  }

  .api-main {
    order: 1;
  }
}

@media (max-width: 768px) {
  .api-content {
    padding: 16px;
  }

  .section h2 {
    font-size: 1.8rem;
  }

  .event-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .event-header h4 {
    font-size: 1.2rem;
  }

  .event-category h3 {
    font-size: 1.4rem;
  }

  .practice-item h4 {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .api-content {
    padding: 12px;
  }

  .sidebar-content {
    padding: 16px;
  }

  .event-item,
  .practice-item {
    padding: 20px;
  }

  .section h2 {
    font-size: 1.6rem;
  }
}

/* 深色主题优化 */
@media (prefers-color-scheme: dark) {
  .event-item:hover {
    box-shadow: 0 4px 16px rgba(255, 255, 255, 0.08);
  }

  .practice-item {
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.04);
  }
}
</style>
