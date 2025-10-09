<template>
  <div id="app">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <RouterLink to="/" class="nav-logo">
          <img src="/logo.png" alt="XGantt" class="logo-img" />
          <span class="logo-text">XGantt</span>
        </RouterLink>
        <div class="nav-menu">
          <RouterLink to="/" class="nav-link">首页</RouterLink>
          <RouterLink to="/demos" class="nav-link">演示</RouterLink>
          <RouterLink to="/tutorials" class="nav-link">教程</RouterLink>
          <RouterLink to="/api" class="nav-link">API</RouterLink>
          <button
            @click="toggleTheme"
            class="theme-toggle"
            :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
          >
            <!-- 太阳图标 (亮色模式时显示) -->
            <Icon
              v-if="isDark"
              icon="solar:sun-bold-duotone"
              class="theme-icon sun-icon"
              width="20"
              height="20"
            />
            <!-- 月亮图标 (暗色模式时显示) -->
            <Icon
              v-else
              icon="solar:moon-bold-duotone"
              class="theme-icon moon-icon"
              width="20"
              height="20"
            />
          </button>
          <a
            href="https://github.com/xpyjs/gantt"
            target="_blank"
            class="nav-link github-link"
          >
            <Icon
              icon="mdi:github"
              class="github-icon"
              width="18"
              height="18"
            />
            GitHub
          </a>
          <a href="https://docs.xiaopangying.com/gantt/docs/" target="_blank" class="nav-link docs-link">去看旧版（vue3）</a>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <RouterView />
    </main>

    <!-- Toast 容器 -->
    <ToastContainer />

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-container">
        <p>&copy; {{ new Date().getFullYear() }} XPYJS & JEREMY JONE</p>
        <div class="footer-links">
          <a href="https://github.com/xpyjs/gantt" target="_blank">GitHub</a>
          <a
            href="https://www.npmjs.com/package/@xpyjs/gantt-core"
            target="_blank"
            >NPM</a
          >
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { Icon } from "@iconify/vue";
import { useTheme } from "@/composables/useTheme";
import ToastContainer from "@/components/ToastContainer.vue";

const { isDark, toggleTheme } = useTheme();
</script>

<style scoped>
.navbar {
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: saturate(100%) blur(4px);
  background-image: radial-gradient(transparent 1px, var(--navbar-bg) 1px);
  background-size: 4px 4px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.nav-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.logo-img {
  width: 32px;
  height: 32px;
  margin-right: 0.5rem;
}

.logo-text {
  background: linear-gradient(135deg, #007acc, #40a9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  transition: color 0.3s ease;
  padding: 0.5rem 0;
  position: relative;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #007acc;
}

.nav-link.router-link-active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #007acc;
}

.github-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.github-icon {
  transition: transform 0.3s ease;
}

.github-link:hover .github-icon {
  transform: scale(1.1);
}

.theme-toggle {
  background: transparent;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  background: var(--bg-secondary);
  color: #007acc;
}

.theme-icon {
  transition: transform 0.3s ease;
}

.sun-icon {
  color: #f59e0b;
}

.moon-icon {
  color: #6366f1;
}

.theme-toggle:hover .theme-icon {
  transform: rotate(15deg) scale(1.1);
}

.main-content {
  min-height: calc(100vh - 64px - 80px);
}

.footer {
  background: var(--footer-bg);
  border-top: 1px solid var(--border-color);
  padding: 2rem 0;
  margin-top: 4rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--text-secondary);
}

.footer-links {
  display: flex;
  gap: 1rem;
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #007acc;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }

  .nav-menu {
    gap: 1rem;
  }

  .footer-container {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
