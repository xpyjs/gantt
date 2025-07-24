<template>
  <div class="home-page">
    <!-- Hero 区域 -->
    <section class="hero">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text">XGantt</span>
            <br />
            强大的甘特图组件
          </h1>
          <p class="hero-description">
            基于 JavaScript 和 Canvas 的高性能甘特图组件，
            提供丰富的功能和灵活的配置选项。支持 Vue、React 等主流框架
          </p>
          <div class="hero-actions">
            <RouterLink to="/demos" class="btn btn-primary"
              >查看演示</RouterLink
            >
            <RouterLink to="/tutorials" class="btn btn-secondary">
              学习教程
            </RouterLink>
          </div>
        </div>
        <div class="hero-demo">
          <!-- 这里可以放一个简单的甘特图预览 -->
          <div class="demo-placeholder">
            <div class="demo-header">XGantt 演示</div>
            <div class="demo-content">
              <div class="demo-table">
                <div
                  v-for="(task, index) in demoTasks"
                  :key="index"
                  class="demo-row"
                >
                  <div class="demo-cell">{{ task.name }}</div>
                  <div class="demo-cell">{{ Math.round(task.progress) }}%</div>
                </div>
              </div>
              <div class="demo-chart">
                <div
                  v-for="(task, index) in demoTasks"
                  :key="index"
                  class="demo-bar"
                  :style="{
                    width: `${task.progress}%`,
                    background: task.color
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 特性介绍 -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">核心特性</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3>高性能渲染</h3>
            <p>基于 Canvas 和 Konva.js，支持大数据量流畅渲染</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>丰富交互</h3>
            <p>支持拖拽、缩放、选择等多种交互操作</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3>灵活定制</h3>
            <p>支持自定义样式、主题和组件配置</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>多框架支持</h3>
            <p>适配 Vue、React，支持多种主流框架</p>
          </div>
        </div>
      </div>
    </section>
    <!-- 演示案例 -->
    <section id="demos" class="demos">
      <div class="container">
        <h2 class="section-title">演示案例</h2>
        <div class="demos-showcase">
          <div class="demos-content">
            <p class="demos-description">
              探索 XGantt 的强大功能，我们提供了丰富的演示案例，
              涵盖整个库的所有功能。
            </p>
            <div class="demos-stats">
              <div class="stat-item">
                <div
                  class="stat-number"
                  id="categories-counter"
                  :data-target="demoCategories.length"
                >
                  {{ demoCategories.length }}
                </div>
                <div class="stat-label">演示分类</div>
              </div>
              <div class="stat-item">
                <div
                  class="stat-number"
                  id="demos-counter"
                  :data-target="totalDemos"
                >
                  {{ totalDemos }}
                </div>
                <div class="stat-label">演示案例</div>
              </div>
            </div>
            <div class="demos-action">
              <RouterLink to="/demos" class="btn btn-primary btn-large">
                查看所有演示
              </RouterLink>
            </div>
          </div>
          <div class="demos-preview">
            <div class="preview-grid">
              <RouterLink
                v-for="category in demoCategories.slice(0, 4)"
                :key="category.id"
                :to="`/demos#category-${category.id}`"
                class="preview-card"
              >
                <div class="card-icon">{{ category.icon }}</div>
                <div class="card-title">{{ category.title }}</div>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 快速开始 -->
    <section class="quick-start">
      <div class="container">
        <h2 class="section-title">快速开始</h2>
        <div class="start-steps">
          <div class="step">
            <div class="step-number">1</div>
            <h3>安装</h3>
            <FrameworkCodeBlock
              :codeBlocks="[
                {
                  framework: 'javascript',
                  code: 'npm install @xpyjs/gantt-core',
                  language: 'bash'
                }
              ]"
            />
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>导入</h3>
            <FrameworkCodeBlock
              :codeBlocks="[
                {
                  framework: 'javascript',
                  code: 'import { XGantt } from \'@xpyjs/gantt-core\';',
                  language: 'javascript'
                }
              ]"
            />
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>创建实例</h3>
            <FrameworkCodeBlock
              :codeBlocks="[
                {
                  framework: 'javascript',
                  code: 'const gantt = new XGantt(container, options);',
                  language: 'javascript'
                }
              ]"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { demoCategories } from "@/config/demos/index";
import { reactive, onMounted, onUnmounted } from "vue";
import { toast } from "@/composables/useToast";
import FrameworkCodeBlock from "@/components/FrameworkCodeBlock.vue";

// 甘特图演示数据
interface DemoTask {
  name: string;
  progress: number;
  targetProgress: number;
  minProgress: number;
  maxProgress: number;
  color: string;
  speed: number;
}

// 使用响应式数据
const demoTasks = reactive<DemoTask[]>([
  {
    name: "项目规划",
    progress: 75,
    targetProgress: 85,
    minProgress: 65,
    maxProgress: 95,
    color: "#007acc",
    speed: 0.5
  },
  {
    name: "开发阶段",
    progress: 45,
    targetProgress: 50,
    minProgress: 35,
    maxProgress: 65,
    color: "#40a9ff",
    speed: 0.7
  },
  {
    name: "测试发布",
    progress: 15,
    targetProgress: 20,
    minProgress: 5,
    maxProgress: 35,
    color: "#91d5ff",
    speed: 0.3
  }
]);

let animationId: number | null = null;

// 甘特图动画
const animateGanttDemo = () => {
  demoTasks.forEach((task: DemoTask) => {
    // 如果接近目标值，随机选择新的目标值
    if (Math.abs(task.progress - task.targetProgress) < 1) {
      task.targetProgress =
        task.minProgress +
        Math.random() * (task.maxProgress - task.minProgress);
    }

    // 朝着目标值平滑移动
    const diff = task.targetProgress - task.progress;
    task.progress += diff * task.speed * 0.02; // 控制动画速度
  });

  animationId = requestAnimationFrame(animateGanttDemo);
};

// 计算总演示数量
const totalDemos = demoCategories.reduce(
  (total, category) => total + category.demos.length,
  0
);

// 数字递增动画
const animateCounters = () => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const element = entry.target as HTMLElement;
        const targetValue = parseInt(element.dataset.target || "0");

        if (entry.isIntersecting) {
          // 元素进入视口，开始动画
          let currentValue = 0;
          const duration = 2000; // 2秒动画
          const increment = targetValue / (duration / 16); // 60fps

          // 使用 transition 实现平滑动画
          element.style.transition = "all 0.3s ease";

          const updateCounter = () => {
            if (currentValue < targetValue) {
              currentValue = Math.min(currentValue + increment, targetValue);
              element.textContent = Math.floor(currentValue).toString();
              requestAnimationFrame(updateCounter);
            } else {
              element.textContent = targetValue.toString();
            }
          };

          element.textContent = "0";
          setTimeout(updateCounter, 200); // 稍微延迟开始
        } else {
          // 元素离开视口，重置为目标值
          element.textContent = targetValue.toString();
        }
      });
    },
    { threshold: 0.3 }
  );
  // 页面加载后延迟执行，确保DOM已准备好
  setTimeout(() => {
    const categoriesEl = document.getElementById("categories-counter");
    const demosEl = document.getElementById("demos-counter");

    if (categoriesEl) observer.observe(categoriesEl);
    if (demosEl) observer.observe(demosEl);
  }, 100);
};

// Toast 测试函数
const testSuccess = () => {
  toast.success("复制成功！代码已复制到剪贴板", { duration: 3000 });
};

const testError = () => {
  toast.error("操作失败！请稍后重试", { duration: 4000 });
};

const testWarning = () => {
  toast.warning("请注意！文件大小超过限制", { duration: 3500 });
};

const testInfo = () => {
  toast.info("新功能已上线，快来体验吧！", { duration: 3000 });
};

// 生命周期管理
onMounted(() => {
  animateCounters();
  animateGanttDemo(); // 启动甘特图动画
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
});
</script>

<style scoped>
.home-page {
  overflow-x: hidden;
}

/* Hero 区域 */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  min-height: 600px;
  display: flex;
  align-items: center;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  line-height: 1.6;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
}

.btn {
  padding: 0.75rem 2rem;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-primary {
  background: #007acc;
  color: white;
}

.btn-primary:hover {
  background: #067cd6;
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

/* 演示预览 */
.demo-placeholder {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.demo-header {
  background: #f8f9fa;
  padding: 1rem;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e5e5e5;
}

.demo-content {
  display: flex;
  height: 200px;
}

.demo-table {
  flex: 1;
  border-right: 1px solid #e5e5e5;
}

.demo-row {
  display: flex;
  height: 33.33%;
  border-bottom: 1px solid #e5e5e5;
}

.demo-cell {
  flex: 1;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  color: #333;
  font-size: 0.875rem;
}

.demo-chart {
  flex: 2;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.demo-bar {
  height: 20px;
  border-radius: 4px;
  transition: width 0.3s ease;
  animation: growBar 2s ease-out;
}

@keyframes growBar {
  from {
    width: 0;
  }
}

/* 特性区域 */
.features {
  padding: 4rem 0;
  background: var(--bg-secondary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: var(--text-primary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: var(--bg-primary);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 演示区域 */
.demos {
  padding: 4rem 0;
  background: var(--bg-primary);
}

.demos-showcase {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.demos-content {
  text-align: left;
}

.demos-description {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.demos-stats {
  display: flex;
  gap: 3rem;
  margin-bottom: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #007acc;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.demos-action {
  margin-top: 2rem;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.demos-preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
  max-width: 320px;
}

.preview-card {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: var(--bg-tertiary);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  color: inherit;
}

.preview-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.card-icon {
  font-size: 2rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  flex-shrink: 0;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
}

/* 快速开始 */
.quick-start {
  padding: 4rem 0;
  background: var(--bg-secondary);
}

.start-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.step {
  background: var(--bg-primary);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.step-number {
  width: 40px;
  height: 40px;
  background: #007acc;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin: 0 auto 1rem;
}

.step h3 {
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
  .demos-showcase {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .demos-stats {
    justify-content: center;
  }

  .preview-grid {
    max-width: 280px;
    gap: 0.75rem;
  }

  .preview-card {
    padding: 1rem;
  }

  .card-icon {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.5rem;
  }

  .card-title {
    font-size: 0.8rem;
  }

  .start-steps {
    grid-template-columns: 1fr;
  }
}
</style>
