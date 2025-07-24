<template>
  <div class="demos-page">
    <div class="demos-header">
      <div class="container">
        <h1 class="demos-title">演示案例</h1>
        <p class="demos-description">探索 XGantt 的强大功能和最佳实践</p>
      </div>
    </div>

    <div class="container">
      <div class="demos-content">
        <div
          v-for="category in demoCategories"
          :key="category.id"
          class="category-section"
        >
          <div class="category-header">
            <div class="category-icon">{{ category.icon }}</div>
            <div>
              <h2 :id="`category-${category.id}`" class="category-title">
                {{ category.title }}
              </h2>
              <p class="category-description">{{ category.description }}</p>
            </div>
          </div>

          <div class="demos-grid">
            <RouterLink
              v-for="demo in category.demos"
              :key="demo.id"
              class="demo-card"
              :to="`/demo/${category.id}/${demo.id}`"
            >
              <div class="demo-card-header">
                <h3 class="demo-title">{{ demo.title }}</h3>
                <span class="demo-difficulty" :class="demo.difficulty">
                  {{ DIFFICULTY_LEVELS[demo.difficulty] }}
                </span>
              </div>
              <p class="demo-description">{{ demo.description }}</p>

              <div class="demo-tags">
                <span v-for="tag in demo.tags" :key="tag" class="demo-tag">
                  {{ tag }}
                </span>
              </div>
              <div class="demo-frameworks">
                <span
                  v-for="codeBlock in demo.code"
                  :key="codeBlock.framework"
                  class="framework-badge"
                  :class="codeBlock.framework"
                >
                  {{
                    getFrameworkByKey(codeBlock.framework as FrameworkKey).label
                  }}
                </span>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { demoCategories, DIFFICULTY_LEVELS } from "@/config/demos/index";
import { useFramework, type FrameworkKey } from "@/composables/useFramework";

const { getFrameworkByKey } = useFramework();
</script>

<style scoped>
.demos-page {
  min-height: calc(100vh - 64px);
  background: var(--bg-secondary);
  scroll-behavior: smooth; /* 启用平滑滚动 */
}

.demos-header {
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

.demos-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.demos-description {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.demos-content {
  padding: 4rem 0;
}

.category-section {
  background: var(--bg-primary);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 3rem;
  scroll-margin-top: 2rem; /* 为锚点跳转预留空间 */
}

.category-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-icon {
  font-size: 2.5rem;
}

.category-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  scroll-margin-top: 80px; /* 为锚点跳转预留空间 */
}

.category-description {
  opacity: 0.9;
}

.demos-grid {
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.demo-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.demo-card:hover {
  background: #ffffff;
  border-color: #007acc;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* 暗色模式下的卡片样式 */
[data-theme="dark"] .demo-card {
  background: #2d2d2d !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
}

[data-theme="dark"] .demo-card:hover {
  background: #353535 !important;
  border-color: #40a9ff !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3) !important;
}

.demo-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.demo-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.demo-difficulty {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
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

/* 暗色模式下的难度标签适配 */
[data-theme="dark"] .demo-difficulty.basic {
  background: rgba(24, 144, 255, 0.15) !important;
  color: #69c0ff !important;
}

[data-theme="dark"] .demo-difficulty.intermediate {
  background: rgba(250, 140, 22, 0.15) !important;
  color: #ffc069 !important;
}

[data-theme="dark"] .demo-difficulty.advanced {
  background: rgba(245, 34, 45, 0.15) !important;
  color: #ff7875 !important;
}

.demo-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.demo-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.demo-tag {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.demo-frameworks {
  display: flex;
  gap: 0.5rem;
}

.framework-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.framework-badge.javascript {
  background: #fff7e6;
  color: #fa8c16;
}

.framework-badge.vue {
  background: #f0f9e8;
  color: #52c41a;
}

.framework-badge.react {
  background: #e6f7ff;
  color: #1890ff;
}

/* 暗色模式下的框架徽章适配 */
[data-theme="dark"] .framework-badge.javascript {
  background: rgba(250, 140, 22, 0.15) !important;
  color: #ffc069 !important;
}

[data-theme="dark"] .framework-badge.vue {
  background: rgba(82, 196, 26, 0.15) !important;
  color: #95de64 !important;
}

[data-theme="dark"] .framework-badge.react {
  background: rgba(24, 144, 255, 0.15) !important;
  color: #69c0ff !important;
}

@media (max-width: 768px) {
  .demos-title {
    font-size: 2rem;
  }

  .demos-description {
    font-size: 1rem;
  }

  .demos-grid {
    grid-template-columns: 1fr;
    padding: 1.5rem;
  }

  .category-header {
    padding: 1.5rem;
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }

  .demo-card {
    padding: 1.5rem;
  }
}
</style>
