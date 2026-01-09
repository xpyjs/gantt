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
              <!-- 预览图片区域 -->
              <div class="demo-preview">
                <img
                  :src="getDemoImage(demo.category, demo.id)"
                  :alt="demo.title"
                  class="demo-image"
                  loading="lazy"
                  @error="handleImageError"
                />
              </div>

              <!-- 卡片内容区域 -->
              <div class="demo-card-content">
                <div class="demo-card-header">
                  <h3 class="demo-title">{{ demo.title }}</h3>
                  <span class="demo-difficulty" :class="demo.difficulty">
                    {{ DIFFICULTY_LEVELS[demo.difficulty] }}
                  </span>
                </div>
                <p class="demo-description">{{ demo.description }}</p>

                <!-- 标签行 -->
                <div class="demo-tags">
                  <span v-for="tag in demo.tags.slice(0, 4)" :key="tag" class="demo-tag">
                    {{ tag }}
                  </span>
                  <span v-if="demo.tags.length > 4" class="demo-tag more-tag">
                    +{{ demo.tags.length - 4 }}
                  </span>
                </div>

                <!-- 框架行 -->
                <div class="demo-frameworks">
                  <span
                    v-for="codeBlock in demo.code"
                    :key="codeBlock.framework"
                    class="framework-badge"
                    :class="codeBlock.framework"
                  >
                    {{ getFrameworkByKey(codeBlock.framework as FrameworkKey).label }}
                  </span>
                </div>
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

// 获取 demo 预览图片路径（新路径：demos/{category}/{id}/screenshot.png）
const getDemoImage = (categoryId: string, demoId: string): string => {
  return new URL(`../demos/${categoryId}/${demoId}/screenshot.png`, import.meta.url).href;
};

// 图片加载失败处理
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  // 使用占位图
  img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" fill="%23f5f5f5"><rect width="400" height="100"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="12">暂无预览</text></svg>';
};
</script>

<style scoped>
.demos-page {
  min-height: calc(100vh - 64px);
  background: var(--bg-secondary);
  scroll-behavior: smooth;
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
  scroll-margin-top: 2rem;
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
  scroll-margin-top: 80px;
}

.category-description {
  opacity: 0.9;
}

.demos-grid {
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* 重新设计的 Demo 卡片 */
.demo-card {
  background: var(--bg-primary);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
}

.demo-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.15);
}

/* 预览图片区域 */
.demo-preview {
  position: relative;
  width: 100%;
  height: 120px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
}

.demo-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  /* object-position: top left; */
  object-position: -4px -4px;
  transition: transform 0.4s ease;
}

.demo-card:hover .demo-image {
  transform: scale(1.15);
}

/* 卡片内容区域 */
.demo-card-content {
  padding: 1rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: -30px;
  z-index: 2;
  background: linear-gradient(to bottom, transparent 0, var(--bg-primary) 30px, var(--bg-primary) 100%);
}

.demo-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.demo-title {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  mix-blend-mode: difference;
  margin: 0;
  line-height: 1.4;
}

.demo-difficulty {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;
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

.demo-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 标签行 */
.demo-tags {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.demo-tag {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
  font-size: 0.7rem;
}

.more-tag {
  background: transparent;
  color: var(--text-tertiary);
}

/* 框架行 */
.demo-frameworks {
  display: flex;
  gap: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.framework-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: 600;
}

.framework-badge.javascript {
  background: #f7df1e;
  color: #323330;
}

.framework-badge.vue {
  background: #42b883;
  color: white;
}

.framework-badge.react {
  background: #61dafb;
  color: #20232a;
}

/* 暗色模式适配 */
[data-theme="dark"] .demo-card {
  background: #2d2d2d !important;
  border-color: rgba(255, 255, 255, 0.06) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
}

[data-theme="dark"] .demo-card:hover {
  background: #353535 !important;
  border-color: #667eea !important;
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.2) !important;
}

[data-theme="dark"] .demo-preview {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%) !important;
}

[data-theme="dark"] .demo-frameworks {
  border-top-color: rgba(255, 255, 255, 0.05) !important;
}

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

/* 响应式适配 */
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

  .demo-preview {
    height: 60px;
  }
}

@media (min-width: 1400px) {
  .demos-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
