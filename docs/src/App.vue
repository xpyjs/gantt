<template>
  <div id="app">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <RouterLink to="/" class="nav-logo">
          <img src="/logo.png" alt="XGantt" class="logo-img" />
          <span class="logo-text">XGantt</span>
        </RouterLink>

        <!-- 桌面端菜单 -->
        <div class="nav-menu desktop-menu">
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

        <!-- 移动端菜单按钮 -->
        <button
          class="mobile-menu-btn"
          @click="toggleMobileMenu"
          :class="{ 'is-active': isMobileMenuOpen }"
          aria-label="菜单"
        >
          <span class="hamburger-box">
            <span class="hamburger-inner"></span>
          </span>
        </button>

        <!-- 移动端下拉菜单 -->
        <Transition name="dropdown">
          <div v-if="isMobileMenuOpen" class="mobile-menu" @click.self="closeMobileMenu">
            <div class="mobile-menu-content">
              <!-- 导航分类 -->
              <div class="mobile-menu-section">
                <div class="mobile-menu-label">导航</div>
                <RouterLink to="/" class="mobile-menu-item" @click="closeMobileMenu">
                  <Icon icon="solar:home-2-bold-duotone" width="20" height="20" />
                  <span>首页</span>
                </RouterLink>
                <RouterLink to="/demos" class="mobile-menu-item" @click="closeMobileMenu">
                  <Icon icon="solar:gallery-bold-duotone" width="20" height="20" />
                  <span>演示</span>
                </RouterLink>
                <RouterLink to="/tutorials" class="mobile-menu-item" @click="closeMobileMenu">
                  <Icon icon="solar:book-bold-duotone" width="20" height="20" />
                  <span>教程</span>
                </RouterLink>
                <RouterLink to="/api" class="mobile-menu-item" @click="closeMobileMenu">
                  <Icon icon="solar:code-bold-duotone" width="20" height="20" />
                  <span>API</span>
                </RouterLink>
              </div>

              <div class="mobile-menu-divider"></div>

              <!-- 外部链接分类 -->
              <div class="mobile-menu-section">
                <div class="mobile-menu-label">链接</div>
                <a
                  href="https://github.com/xpyjs/gantt"
                  target="_blank"
                  class="mobile-menu-item"
                  @click="closeMobileMenu"
                >
                  <Icon icon="mdi:github" width="20" height="20" />
                  <span>GitHub</span>
                  <Icon icon="solar:arrow-right-up-linear" width="14" height="14" class="external-icon" />
                </a>
                <a
                  href="https://docs.xiaopangying.com/gantt/docs/"
                  target="_blank"
                  class="mobile-menu-item"
                  @click="closeMobileMenu"
                >
                  <Icon icon="solar:document-bold-duotone" width="20" height="20" />
                  <span>旧版文档（vue3）</span>
                  <Icon icon="solar:arrow-right-up-linear" width="14" height="14" class="external-icon" />
                </a>
              </div>

              <div class="mobile-menu-divider"></div>

              <!-- 主题切换 -->
              <div class="mobile-menu-section">
                <div class="mobile-menu-label">外观</div>
                <button class="mobile-menu-item theme-switch" @click="handleThemeToggle">
                  <Icon
                    :icon="isDark ? 'solar:sun-bold-duotone' : 'solar:moon-bold-duotone'"
                    width="20"
                    height="20"
                    :class="isDark ? 'sun-icon' : 'moon-icon'"
                  />
                  <span>{{ isDark ? '切换到亮色模式' : '切换到暗色模式' }}</span>
                </button>
              </div>
            </div>
          </div>
        </Transition>
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
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { Icon } from "@iconify/vue";
import { useTheme } from "@/composables/useTheme";
import ToastContainer from "@/components/ToastContainer.vue";

const { isDark, toggleTheme } = useTheme();

// 移动端菜单状态
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  // 打开菜单时禁止滚动
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  document.body.style.overflow = '';
};

const handleThemeToggle = () => {
  toggleTheme();
};

// 监听窗口大小变化，超过 700px 时自动关闭移动端菜单
const handleResize = () => {
  if (window.innerWidth > 700 && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

// 监听 ESC 键关闭菜单
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});
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

/* 移动端菜单按钮 - 汉堡菜单 */
.mobile-menu-btn {
  display: none;
  background: transparent;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  z-index: 101;
}

.hamburger-box {
  width: 24px;
  height: 18px;
  display: inline-block;
  position: relative;
}

.hamburger-inner {
  display: block;
  top: 50%;
  margin-top: -1.5px;
}

.hamburger-inner,
.hamburger-inner::before,
.hamburger-inner::after {
  width: 24px;
  height: 3px;
  background-color: var(--text-primary);
  border-radius: 3px;
  position: absolute;
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55),
    opacity 0.15s ease;
}

.hamburger-inner::before,
.hamburger-inner::after {
  content: "";
  display: block;
}

.hamburger-inner::before {
  top: -8px;
}

.hamburger-inner::after {
  bottom: -8px;
}

/* 汉堡菜单激活状态 - 变成 X */
.mobile-menu-btn.is-active .hamburger-inner {
  transform: rotate(45deg);
}

.mobile-menu-btn.is-active .hamburger-inner::before {
  top: 0;
  opacity: 0;
  transform: rotate(0deg);
}

.mobile-menu-btn.is-active .hamburger-inner::after {
  bottom: 0;
  transform: rotate(-90deg);
}

/* 移动端下拉菜单 */
.mobile-menu {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 99;
}

.mobile-menu-content {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 8px 32px var(--shadow-color);
  max-height: calc(100vh - 64px);
  overflow-y: auto;
  padding: 0.5rem 0;
}

.mobile-menu-section {
  padding: 0.25rem 0;
}

.mobile-menu-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.5rem 1.5rem;
  margin-bottom: 0.25rem;
}

.mobile-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  color: var(--text-primary);
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  background: transparent;
  width: 100%;
  font-size: 1rem;
  cursor: pointer;
  text-align: left;
}

.mobile-menu-item:hover,
.mobile-menu-item:focus {
  background: var(--bg-secondary);
  color: var(--accent-color);
}

.mobile-menu-item.router-link-active {
  color: var(--accent-color);
  background: var(--bg-secondary);
  font-weight: 500;
}

.mobile-menu-item .external-icon {
  margin-left: auto;
  opacity: 0.5;
}

.mobile-menu-divider {
  height: 1px;
  background: var(--border-color);
  margin: 0.5rem 1rem;
}

.mobile-menu-item.theme-switch .sun-icon {
  color: #f59e0b;
}

.mobile-menu-item.theme-switch .moon-icon {
  color: #6366f1;
}

/* 下拉菜单动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.25s ease;
}

.dropdown-enter-active .mobile-menu-content,
.dropdown-leave-active .mobile-menu-content {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.25s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
}

.dropdown-enter-from .mobile-menu-content,
.dropdown-leave-to .mobile-menu-content {
  transform: translateY(-10px);
  opacity: 0;
}

.dropdown-enter-to .mobile-menu-content,
.dropdown-leave-from .mobile-menu-content {
  transform: translateY(0);
  opacity: 1;
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

  .footer-container {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

/* 移动端响应式 - 700px 以下显示移动菜单 */
@media (max-width: 700px) {
  .desktop-menu {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }
}
</style>
