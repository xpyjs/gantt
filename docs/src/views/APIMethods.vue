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
                <h3>方法目录</h3>
              </div>
              <nav class="api-nav">
                <ul class="nav-list">
                  <li v-for="navItem in navigation" :key="navItem.id">
                    <a
                      :href="navItem.href"
                      :class="{ active: activeSection === navItem.id }"
                      @click="scrollToSection(navItem.id)"
                    >
                      <i class="icon">{{ navItem.icon }}</i> {{ navItem.title }}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>

          <!-- 主要内容 -->
          <main class="api-main">
            <div class="api-sections">
              <!-- 方法概述 -->
              <div class="section" id="overview">
                <h2>{{ overview.title }}</h2>
                <p>{{ overview.description }}</p>

                <FrameworkCodeBlock :code-blocks="overview.examples" />
              </div>
              <!-- 方法列表 -->
              <div
                v-for="method in methods"
                :key="method.id"
                class="section"
                :id="method.id"
              >
                <div class="event-category">
                  <h2>
                    <i class="icon">{{ method.icon }}</i> {{ method.name }}
                    <span class="event-type">{{ method.type }}</span>
                  </h2>
                  <div class="event-item">
                    <div class="event-description">
                      <p><strong>描述：</strong>{{ method.description }}</p>
                      <p v-if="method.trigger">
                        <strong>触发时机：</strong>{{ method.trigger }}
                      </p>

                      <div
                        v-if="method.parameters && method.parameters.length > 0"
                      >
                        <p><strong>参数：</strong></p>
                        <ul>
                          <li
                            v-for="param in method.parameters"
                            :key="param.name"
                          >
                            <code
                              >{{ param.name }}{{ param.optional ? "?" : "" }}:
                              {{ param.type }}</code
                            >
                            {{ param.optional ? "(可选)" : "" }} -
                            {{ param.description }}
                            <span v-if="param.defaultValue">
                              默认值:
                              <code>{{ param.defaultValue }}</code></span
                            >
                          </li>
                        </ul>
                      </div>

                      <p>
                        <strong>返回值：</strong
                        ><code>{{ method.returnType }}</code>
                        <span v-if="method.returnDescription">
                          - {{ method.returnDescription }}</span
                        >
                      </p>
                      <div v-if="method.notes && method.notes.length > 0">
                        <p><strong>注意事项：</strong></p>
                        <ul>
                          <li v-for="note in method.notes" :key="note">
                            {{ note }}
                          </li>
                        </ul>
                      </div>

                      <div v-if="method.cleanup && method.cleanup.length > 0">
                        <p><strong>清理内容：</strong></p>
                        <ul>
                          <li v-for="cleanup in method.cleanup" :key="cleanup">
                            {{ cleanup }}
                          </li>
                        </ul>
                      </div>

                      <FrameworkCodeBlock :code-blocks="method.examples" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- 框架专用方法 -->
              <div class="section" id="framework">
                <h2>使用框架</h2>
                <p>不同框架的使用方式可能会有一些区别</p>

                <FrameworkCodeBlock :code-blocks="frameworkMethods" />
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>

    <!-- 回到顶部按钮 -->
    <button
      v-show="showBackToTop"
      class="back-to-top"
      @click="scrollToTop"
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
import { methodsPageConfig } from "@/config/methods";

// 当前激活的导航section
const activeSection = ref("overview");

// 显示回到顶部按钮
const showBackToTop = ref(false);

// 从配置中获取数据
const { overview, methods, frameworkMethods } = methodsPageConfig;

// 生成导航数据
const navigation = [
  { id: "overview", title: "方法概述", icon: "📖", href: "#overview" },
  ...methods.map(method => ({
    id: method.id,
    title: method.name.split("(")[0].replace("new ", ""), // 提取方法名
    icon: method.icon,
    href: `#${method.id}`
  })),
  { id: "framework", title: "使用框架", icon: "🔧", href: "#framework" }
];

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
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.api-content {
  min-height: calc(100vh - 120px);
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
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
  background: var(--bg-primary);
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
  background: var(--bg-primary);
  padding: 1.5rem;
  box-sizing: border-box;
  border-radius: 1rem;
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

.event-category h2 {
  font-size: 2.2rem;
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

.event-type {
  background: var(--accent-color);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
  vertical-align: middle;
  margin-left: 12px;
}

.event-description {
  color: var(--text-secondary);
  line-height: 1.6;
}

.event-description p {
  margin-bottom: 12px;
}

.event-description ul {
  margin: 8px 0 16px 20px;
}

.event-description ul li {
  margin-bottom: 4px;
}

.event-description code {
  background: var(--bg-tertiary);
  color: var(--accent-color);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "JetBrains Mono", "Consolas", "Monaco", monospace;
  font-size: 0.9em;
}

/* 回到顶部按钮 */
.back-to-top {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 50px;
  height: 50px;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
}

.back-to-top:hover {
  background: var(--accent-color-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .api-layout {
    grid-template-columns: 250px 1fr;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .api-layout {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .api-sidebar {
    position: static;
    max-height: none;
    margin-bottom: 24px;
  }

  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
  }
}

@media (max-width: 480px) {
  .api-content {
    padding: 12px;
  }

  .section h2 {
    font-size: 1.8rem;
  }

  .event-category h3 {
    font-size: 1.4rem;
  }
}
</style>
