<template>
  <div class="api-page">
    <div class="api-content">
      <div class="api-layout">
        <!-- 侧边导航 -->
        <aside class="api-sidebar">
          <div class="sidebar-content">
            <div class="sidebar-header">
              <Icon
                icon="line-md:u-turn-left"
                class="back-icon"
                width="28"
                height="28"
                @click="goBack"
              />
              <h3>类型索引</h3>
            </div>
            <nav class="api-nav">
              <ul class="nav-list">
                <li>
                  <a
                    :class="{ active: activeSection === 'overview' }"
                    @click="scrollToSection('overview')"
                  >概述</a>
                </li>
                <li v-for="t in types" :key="t.id">
                  <a
                    :class="{ active: activeSection === t.id }"
                    @click="scrollToSection(t.id)"
                  >{{ t.name }}</a>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        <!-- 主体内容 -->
        <main class="api-main">
          <!-- 概述 -->
            <section id="overview" class="section">
              <h2>{{ overview.title }}</h2>
              <p class="intro">{{ overview.description }}</p>
            </section>

            <!-- 类型列表 -->
            <section
              v-for="t in types"
              :id="t.id"
              :key="t.id"
              class="section type-section"
            >
              <div class="type-header">
                <h3>{{ t.name }}</h3>
                <a class="anchor" :href="`#${t.id}`">#</a>
              </div>
              <p class="type-desc">{{ t.description }}</p>
              <FrameworkCodeBlock
                :codeBlocks="t.code"
              />
            </section>
        </main>
      </div>
    </div>

    <!-- 回到顶部按钮 -->
    <button v-if="showBackToTop" class="back-to-top" @click="scrollToTop">
      <Icon icon="material-symbols:arrow-upward" width="24" height="24" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import FrameworkCodeBlock from '@/components/FrameworkCodeBlock.vue';
import { typesPageConfig } from '@/config/types';

const router = useRouter();
const { overview, types } = typesPageConfig;

const activeSection = ref('overview');
const showBackToTop = ref(false);

const goBack = () => router.push('/api');

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 90;
  window.scrollTo({ top, behavior: 'smooth' });
};

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

const handleScroll = () => {
  const offset = window.scrollY + 120;
  showBackToTop.value = offset > 400;
  const sections = document.querySelectorAll('.section');
  let current = 'overview';
  for (let i = 0; i < sections.length; i++) {
    const s = sections[i] as HTMLElement;
    if (s.offsetTop <= offset) current = s.id;
  }
  activeSection.value = current;
};

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<style scoped>
.api-page { min-height: 100vh; background: var(--bg-primary); color: var(--text-primary); max-width: 1200px; margin: 0 auto; }

.api-content { padding: 20px; }

.api-layout { display: grid; grid-template-columns: 280px 1fr; gap: 40px; }

.api-sidebar { position: sticky; top: 80px; height: fit-content; max-height: calc(100vh - 120px); overflow-y: auto; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; }
.sidebar-content { padding: 24px; }

.sidebar-header { display: flex; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border-color); }
.sidebar-header h3 { margin: 0; font-size: 1rem; font-weight: 600; }
.back-icon { margin-right: 8px; cursor: pointer; transition: .2s; transform: rotate(90deg); }
.back-icon:hover { color: var(--accent-color); transform: rotate(90deg) translateX(-2px); }

.nav-list { list-style: none; padding: 0; margin: 0; }
.nav-list li { margin-bottom: 4px; }
.nav-list a { display: block; padding: 8px 10px; border-radius: 6px; color: var(--text-secondary); font-size: .85rem; cursor: pointer; transition: .2s; }
.nav-list a:hover { background: var(--bg-tertiary); color: var(--text-primary); }
.nav-list a.active { background: var(--accent-color); color: #fff; font-weight: 600; }

.api-main { min-width: 0; }
.section { margin-bottom: 60px; }
.section h2 { font-size: 2rem; margin-bottom: 20px; border-bottom: 3px solid var(--accent-color); padding-bottom: 12px; }

/* 类型卡片样式 */
.type-section { background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 24px 24px 28px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,.05); }
.type-section:hover { box-shadow: 0 4px 14px rgba(0,0,0,.08); }

.type-section h3 { font-size: 1.4rem; margin: 0 0 12px; display: inline-block; }
.type-header { display:flex; align-items:center; gap:8px; }
.type-header .anchor { opacity:0; text-decoration:none; color: var(--accent-color); transition:.2s; font-weight:600; }
.type-header:hover .anchor { opacity:1; }
.type-desc { color: var(--text-secondary); margin: 0 0 14px; line-height:1.6; }

.intro { color: var(--text-secondary); line-height:1.7; font-size:1rem; }

.back-to-top { position: fixed; right: 40px; bottom: 40px; width: 48px; height: 48px; border-radius: 50%; background: var(--accent-color); color: #fff; display:flex; align-items:center; justify-content:center; border:none; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,.15); transition:.25s; }
.back-to-top:hover { transform: translateY(-4px); }
.back-to-top:active { transform: scale(.92); }

@media (max-width: 1024px) { .api-layout { grid-template-columns: 1fr; } .api-sidebar { position: static; max-height:none; } }
@media (max-width: 640px) { .section h2 { font-size:1.6rem; } }
</style>
