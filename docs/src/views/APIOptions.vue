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
                <div style="display: flex">
                  <Icon
                    icon="line-md:u-turn-left"
                    width="28"
                    height="28"
                    class="back-icon"
                    @click="$router.push('/api')"
                  />
                  <h3>目录</h3>
                </div>
                <!-- 搜索框 -->
                <div class="search-box">
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="搜索配置项..."
                    class="search-input"
                  />
                  <Icon
                    v-if="!searchQuery"
                    icon="material-symbols:search"
                    class="search-icon"
                    width="18"
                    height="18"
                  />
                  <button
                    v-else
                    @click="clearSearch"
                    class="clear-button"
                    title="清空搜索"
                  >
                    <Icon
                      icon="material-symbols:close"
                      width="16"
                      height="16"
                    />
                  </button>
                </div>
              </div>
              <nav class="api-nav">
                <!-- 搜索模式下显示过滤结果，保持层级结构 -->
                <template v-if="searchQuery">
                  <ul class="nav-list">
                    <template
                      v-for="item in generateSearchMenuItems"
                      :key="item.id"
                    >
                      <MenuItemComponent
                        :item="item"
                        :active-section="activeSection"
                        :search-query="searchQuery"
                        @toggle="toggleMenuExpand"
                        @navigate="scrollToSection"
                      />
                    </template>
                  </ul>
                </template>

                <!-- 正常模式下显示层级菜单 -->
                <template v-else>
                  <ul class="nav-list">
                    <template v-for="item in generateMenuItems" :key="item.id">
                      <MenuItemComponent
                        :item="item"
                        :active-section="activeSection"
                        @toggle="toggleMenuExpand"
                        @navigate="scrollToSection"
                      />
                    </template>
                  </ul>
                </template>
              </nav>
            </div>
          </aside>
          <!-- 主要内容 -->
          <main class="api-main">
            <div class="api-sections">
              <template v-for="item in filteredItems" :key="item.id">
                <PropertyItem
                  :item="item"
                  :level="1"
                  :search-query="searchQuery"
                />
              </template>
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
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Icon } from "@iconify/vue";
import { apiItems } from "@/config/api";
import type { ApiItem } from "@/config/api";
import PropertyItem from "@/components/PropertyItem.vue";
import MenuItemComponent from "@/components/MenuItemComponent.vue";

// 当前激活的节点
const activeSection = ref("");

// 搜索关键词
const searchQuery = ref("");

// 显示回到顶部按钮
const showBackToTop = ref(false);

// 菜单展开状态管理
const menuExpandState = ref<Record<string, boolean>>({});

// 初始化菜单展开状态
const initializeMenuState = () => {
  const state: Record<string, boolean> = {};
  const processItem = (item: ApiItem) => {
    state[item.id] = false; // 默认收起

    if (item.children) {
      item.children.forEach((child: ApiItem) => {
        processItem(child);
      });
    }
  };

  apiItems.forEach((item: ApiItem) => {
    processItem(item);
  });

  menuExpandState.value = state;
};

// 切换菜单展开状态
const toggleMenuExpand = (id: string) => {
  menuExpandState.value[id] = !menuExpandState.value[id];
};

// 生成菜单结构
const generateMenuItems = computed(() => {
  const processItem = (item: ApiItem, level: number = 0) => {
    const hasChildren = Boolean(item.children && item.children.length > 0);
    const menuItem = {
      id: item.id,
      title: item.key,
      path: item.id,
      level,
      hasChildren,
      expanded: menuExpandState.value[item.id] || false,
      required: item.required || false,
      children: [] as any[]
    }; // 如果展开，添加子项
    if (hasChildren && menuExpandState.value[item.id]) {
      item.children!.forEach((child: ApiItem) => {
        menuItem.children.push(processItem(child, level + 1));
      });
    }

    return menuItem;
  };

  return apiItems.map((item: ApiItem) => processItem(item));
});

// 生成搜索模式下的菜单结构（在搜索时自动展开包含匹配项的父级）
const generateSearchMenuItems = computed(() => {
  if (!searchQuery.value) {
    return [];
  }

  const processItem = (item: ApiItem, level: number = 0) => {
    const hasChildren = Boolean(item.children && item.children.length > 0);
    const menuItem = {
      id: item.id,
      title: item.key,
      path: item.id,
      level,
      hasChildren,
      expanded: true, // 搜索模式下自动展开所有匹配的层级
      required: item.required || false,
      children: [] as any[]
    }; // 如果有子项，添加子项
    if (hasChildren && item.children) {
      item.children.forEach((child: ApiItem) => {
        menuItem.children.push(processItem(child, level + 1));
      });
    }

    return menuItem;
  };

  return filteredItems.value.map((item: ApiItem) => processItem(item));
});

// 过滤后的items（用于搜索和显示）
const filteredItems = computed(() => {
  if (!searchQuery.value) {
    return apiItems;
  }

  const query = searchQuery.value.toLowerCase();
  // 检查项目是否匹配搜索条件
  const isMatch = (item: ApiItem): boolean => {
    return (
      item.key.toLowerCase().includes(query) ||
      item.title.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      (item.defaultValue?.toLowerCase().includes(query) ?? false)
    );
  };

  // 检查项目或其子项是否有匹配
  const hasMatchInSubtree = (item: ApiItem): boolean => {
    if (isMatch(item)) {
      return true;
    }
    if (item.children) {
      return item.children.some((child: ApiItem) => hasMatchInSubtree(child));
    }
    return false;
  };

  // 过滤并保留层级结构
  const filterWithHierarchy = (items: ApiItem[]): ApiItem[] => {
    return items.reduce((acc: ApiItem[], item: ApiItem) => {
      if (hasMatchInSubtree(item)) {
        const filteredItem: ApiItem = { ...item };

        // 如果有子项，递归过滤子项
        if (item.children && item.children.length > 0) {
          filteredItem.children = filterWithHierarchy(item.children);
        }

        acc.push(filteredItem);
      }
      return acc;
    }, []);
  };

  return filterWithHierarchy(apiItems);
});

// 清除搜索
const clearSearch = () => {
  searchQuery.value = "";
  // 触发滚动事件来更新当前激活的菜单项
  setTimeout(() => {
    handleScroll();
  }, 50);
};

// 滚动到指定节点
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const navbarHeight = 90; // 导航栏高度
    const elementPosition = element.offsetTop - navbarHeight;
    window.scrollTo({
      top: elementPosition,
      behavior: "smooth"
    });
  }
};

// 回到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

// 处理滚动事件，更新激活状态
const handleScroll = () => {
  const scrollTop = window.pageYOffset + 150; // 增加偏移量
  const sections = document.querySelectorAll(".property-item");

  // 更新激活状态
  let currentActive = "";
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

  // 控制回到顶部按钮显示
  showBackToTop.value = window.pageYOffset > 400;
};

onMounted(() => {
  initializeMenuState();
  window.addEventListener("scroll", handleScroll);
  // 检查URL中的hash
  if (window.location.hash) {
    const sectionId = window.location.hash.substring(1);
    setTimeout(() => {
      scrollToSection(sectionId);
    }, 100);
  }
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.api-page {
  background: var(--bg-secondary);
}

/* 主布局 */
.api-content {
  min-height: calc(100vh - 120px);
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.api-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 3rem;
  max-width: 1400px;
  margin: 0 auto;
  align-items: start;
}

/* 侧边栏 */
.api-sidebar {
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.sidebar-content {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.sidebar-header h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
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

.search-box {
  position: relative;
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(0, 122, 204, 0.1);
}

.search-input::placeholder {
  color: var(--text-tertiary);
  opacity: 0.6;
}

.search-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  pointer-events: none;
}

.clear-button {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 3px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-button:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: block;
  padding: 0.625rem 0.875rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 400;
  font-size: 0.9rem;
  line-height: 1.4;
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
}

.nav-link.active {
  color: var(--accent-color);
  background: rgba(0, 122, 204, 0.1);
}

.item-title {
  color: var(--text-tertiary);
  font-size: 0.8rem;
  margin-left: 0.5rem;
}

/* 主内容区 */
.api-main {
  min-width: 0;
  background: var(--bg-primary);
  padding: 1.5rem;
  box-sizing: border-box;
  border-radius: 1rem;
}

/* 滚动条样式 */
.api-sidebar::-webkit-scrollbar {
  width: 6px;
}

.api-sidebar::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 3px;
}

.api-sidebar::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.api-sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
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
</style>
