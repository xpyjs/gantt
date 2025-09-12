<template>
  <div class="api-page">
    <!-- 页面标题 -->
    <section class="page-header">
      <div class="container">
        <h1>API 文档</h1>
        <p>完整的 API 文档、配置选项、事件和方法</p>
      </div>
    </section>

    <!-- 主内容区 -->
    <section class="api-content">
      <div class="container">
        <!-- 方法接口 -->
        <div class="api-section">
          <div class="section-header" @click="navigateToPage('/api/methods')">
            <h2>
              <Icon icon="codicon:symbol-method" width="28" height="28" />
              方法接口
            </h2>
            <Icon
              icon="material-symbols:arrow-forward"
              width="20"
              height="20"
              class="nav-arrow"
            />
          </div>
          <p class="section-description">程序化操作甘特图的各种方法和API接口</p>
          <div class="category-grid">
            <div class="category-card">
              <div class="category-header">
                <div class="category-icon methods-icon">
                  <Icon
                    icon="material-symbols:functions"
                    width="24"
                    height="24"
                  />
                </div>
                <h4>核心方法</h4>
              </div>
              <div class="category-items">
                <span
                  v-for="item in methodItems"
                  :key="item.id"
                  class="item-link"
                  @click="navigateToAnchor('/api/methods', item.anchor)"
                >
                  {{ item.name }}
                </span>
              </div>
            </div>

            <div class="category-card">
              <div class="category-header">
                <div class="category-icon assist-icon">
                  <Icon
                    icon="material-symbols:build-circle"
                    width="24"
                    height="24"
                  />
                </div>
                <h4>辅助方法</h4>
              </div>
              <div class="category-items">
                <span
                  v-for="item in assistItems"
                  :key="item.id"
                  class="item-link"
                  @click="navigateToAnchor('/api/assist', item.anchor)"
                >
                  {{ item.name }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 配置选项 -->
        <div class="api-section">
          <div class="section-header" @click="navigateToPage('/api/options')">
            <h2>
              <Icon icon="material-symbols:settings" width="28" height="28" />
              配置选项
            </h2>
            <Icon
              icon="material-symbols:arrow-forward"
              width="20"
              height="20"
              class="nav-arrow"
            />
          </div>
          <p class="section-description">
            配置甘特图的数据源、样式、布局和功能选项
          </p>
          <div class="category-grid">
            <div
              v-for="category in configCategories"
              :key="category.id"
              class="category-card"
            >
              <div class="category-header">
                <div class="category-icon" :class="category.iconClass">
                  <Icon :icon="category.icon" width="24" height="24" />
                </div>
                <h4>{{ category.title }}</h4>
              </div>
              <div class="category-items">
                <span
                  v-for="item in category.items"
                  :key="item.id"
                  class="item-link"
                  @click="navigateToAnchor('/api/options', item.anchor)"
                >
                  {{ item.name }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 事件处理 -->
        <div class="api-section">
          <div class="section-header" @click="navigateToPage('/api/events')">
            <h2>
              <Icon
                icon="material-symbols:notifications"
                width="28"
                height="28"
              />
              事件处理
            </h2>
            <Icon
              icon="material-symbols:arrow-forward"
              width="20"
              height="20"
              class="nav-arrow"
            />
          </div>
          <p class="section-description">
            监听用户操作和甘特图状态变化的各种事件
          </p>
          <div class="category-grid">
            <div
              v-for="category in eventCategories"
              :key="category.id"
              class="category-card"
            >
              <div class="category-header">
                <div class="category-icon" :class="category.iconClass">
                  <Icon :icon="category.icon" width="24" height="24" />
                </div>
                <h4>{{ category.title }}</h4>
              </div>
              <div class="category-items">
                <span
                  v-for="item in category.items"
                  :key="item"
                  class="item-link"
                  @click="navigateToAnchor('/api/events', item)"
                >
                  {{ item }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- TypeScript -->
        <div class="api-section">
          <div class="section-header" @click="navigateToPage('/api/types')">
            <h2>
              <Icon icon="material-symbols:code" width="28" height="28" />
              TypeScript
            </h2>
            <Icon
              icon="material-symbols:arrow-forward"
              width="20"
              height="20"
              class="nav-arrow"
            />
          </div>
          <p class="section-description">核心公共类型声明，辅助更好地进行二次开发与类型推导</p>
          <div class="category-grid">
            <div class="category-card">
              <div class="category-header">
                <div class="category-icon structure-icon">
                  <Icon icon="material-symbols:data-object" width="24" height="24" />
                </div>
                <h4>核心类型</h4>
              </div>
              <div class="category-items">
                <span
                  v-for="item in typeItems"
                  :key="item.id"
                  class="item-link"
                  @click="navigateToAnchor('/api/types', item.anchor)"
                >
                  {{ item.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { methodsPageConfig } from "@/config/methods";
import eventsPageConfig from "@/config/events";
import { getConfigCategories } from "@/config/api";
import { assistPageConfig } from "@/config/assist";
import { typesPageConfig } from "@/config/types";

const router = useRouter();

// 配置分类 - 从配置文件中动态生成
const configCategories = computed(() => {
  return getConfigCategories();
});

// 事件分类 - 从配置文件中动态生成
const eventCategories = computed(() => {
  return eventsPageConfig.categories.map(category => {
    // 根据分类ID设置图标类名
    const iconClassMap: Record<string, string> = {
      "task-events": "selection-icon",
      "interaction-events": "click-icon",
      "movement-events": "movement-icon",
      "link-events": "link-icon",
      "baseline-events": "baseline-icon",
      "system-events": "system-icon"
    };

    return {
      id: category.id,
      title: category.title,
      icon: getIconByCategory(category.id),
      iconClass: iconClassMap[category.id] || "selection-icon",
      items: category.events.map(event => event.name)
    };
  });
});

// 根据分类ID获取对应的图标
const getIconByCategory = (categoryId: string): string => {
  const iconMap: Record<string, string> = {
    "task-events": "material-symbols:check-box",
    "interaction-events": "material-symbols:mouse",
    "movement-events": "material-symbols:drag-indicator",
    "link-events": "material-symbols:account-tree",
    "baseline-events": "material-symbols:straighten",
    "system-events": "material-symbols:error"
  };
  return iconMap[categoryId] || "material-symbols:check-box";
};

// 方法列表
const methodItems = methodsPageConfig.methods.map(item => {
  return { id: item.id, name: item.id, anchor: item.id };
});

// 辅助列表
const assistItems = assistPageConfig.methods.map(item => {
  return { id: item.id, name: item.id, anchor: item.id };
});

// 类型列表
const typeItems = typesPageConfig.types.map(t => ({ id: t.id, name: t.name, anchor: t.id }));

// 导航到页面
const navigateToPage = (route: string) => {
  router.push(route);
};

// 导航到锚点
const navigateToAnchor = (route: string, anchor: string) => {
  router.push(`${route}#${anchor}`);
};
</script>

<style scoped>
.api-page {
  background: var(--bg-secondary);
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.page-header h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.page-header p {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* 主内容区 */
.api-content {
  padding: 3rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* API 章节 */
.api-section {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.api-section:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

/* 章节头部 */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 1rem;
  margin: -1rem -1rem 1.5rem -1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.section-header:hover {
  background: var(--bg-secondary);
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-primary);
}

.section-header h2 .iconify {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 6px;
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

/* 为不同章节的图标设置不同的渐变色 */
.api-section:nth-child(1) .section-header h2 .iconify {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.api-section:nth-child(2) .section-header h2 .iconify {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.api-section:nth-child(3) .section-header h2 .iconify {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

.section-header:hover h2 .iconify {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.nav-arrow {
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.section-header:hover .nav-arrow {
  color: var(--accent-color);
  transform: translateX(4px);
}

/* 章节描述 */
.section-description {
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

/* 分类网格 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* 分类卡片 */
.category-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.category-card:hover {
  border-color: var(--accent-color);
  box-shadow: 0 4px 16px rgba(0, 122, 204, 0.1);
  transform: translateY(-2px);
}

/* 分类头部 */
.category-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.data-icon {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white;
}

.structure-icon {
  background: linear-gradient(135deg, #10b981, #047857);
  color: white;
}

.style-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.interaction-icon {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.advanced-icon {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  color: white;
}

.selection-icon {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
}

.click-icon {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
}

.movement-icon {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
}

.link-icon {
  background: linear-gradient(135deg, #a855f7, #9333ea);
  color: white;
}

.system-icon {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.methods-icon {
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
}

.baseline-icon {
  background: linear-gradient(135deg, #f5550b, #d4380e);
  color: white;
}

.assist-icon {
  background: linear-gradient(135deg, #3bf63b, #22c522);
  color: white;
}

.category-header h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* 分类项目 */
.category-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.item-link {
  background: var(--bg-primary);
  color: var(--text-secondary);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.item-link:hover {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .api-section {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .section-header {
    padding: 0.75rem;
    margin: -0.75rem -0.75rem 1rem -0.75rem;
  }

  .section-header h2 {
    font-size: 1.5rem;
  }

  .category-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .category-card {
    padding: 1rem;
  }

  .category-icon {
    width: 36px;
    height: 36px;
  }

  .page-header {
    padding: 3rem 0;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .page-header p {
    font-size: 1rem;
  }

  .section-description {
    font-size: 1rem;
  }
}
</style>
