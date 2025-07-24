<template>
  <li class="nav-item" :class="`level-${item.level}`">
    <div class="nav-link-wrapper">
      <a
        :href="`#${item.id}`"
        class="nav-link"
        :class="{ active: activeSection === item.id }"
        @click.prevent.stop="$emit('navigate', item.id)"
      >
        <span class="nav-title" v-html="highlightText(item.title)"></span>
        <span v-if="item.required" class="required-indicator" title="必填项"
          >*</span
        >
      </a>
      <button
        v-if="item.hasChildren"
        class="expand-toggle"
        @click="$emit('toggle', item.id)"
        :title="item.expanded ? '收起' : '展开'"
      >
        <Icon
          :icon="
            item.expanded
              ? 'material-symbols:keyboard-arrow-down'
              : 'material-symbols:keyboard-arrow-right'
          "
          width="16"
          height="16"
        />
      </button>
    </div>
    <!-- 递归渲染子菜单 -->
    <transition name="expand">
      <ul v-if="item.hasChildren && item.expanded" class="nav-sublist">
        <MenuItemComponent
          v-for="child in item.children"
          :key="child.id"
          :item="child"
          :active-section="activeSection"
          :search-query="searchQuery"
          @toggle="$emit('toggle', $event)"
          @navigate="$emit('navigate', $event)"
        />
      </ul>
    </transition>
  </li>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

interface MenuItem {
  id: string;
  title: string;
  path: string;
  level: number;
  hasChildren: boolean;
  expanded: boolean;
  required: boolean;
  children: MenuItem[];
}

interface Props {
  item: MenuItem;
  activeSection: string;
  searchQuery?: string;
}

const props = defineProps<Props>();
defineEmits<{
  toggle: [id: string];
  navigate: [id: string];
}>();

// 高亮搜索关键词
const highlightText = (text: string) => {
  if (!props.searchQuery) {
    return text;
  }

  const query = props.searchQuery.toLowerCase();
  const lowerText = text.toLowerCase();
  const index = lowerText.indexOf(query);

  if (index === -1) {
    return text;
  }

  const before = text.substring(0, index);
  const match = text.substring(index, index + query.length);
  const after = text.substring(index + query.length);

  return `${before}<mark class="search-highlight">${match}</mark>${after}`;
};
</script>

<style scoped>
.nav-link-wrapper {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-link {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  line-height: 1.4;
}

.nav-title {
  display: inline;
}

.required-indicator {
  color: #ff8c42;
  font-weight: 700;
  font-size: 1em;
  margin-left: 0.125rem;
  opacity: 0.8;
  transition: all 0.2s ease;
}

.nav-item.level-0 .nav-link {
  font-weight: 600;
  padding: 0.625rem 0.875rem;
}

.nav-item.level-1 .nav-link {
  font-weight: 500;
  padding-left: 1.5rem;
}

.nav-item.level-2 .nav-link {
  padding-left: 2.25rem;
  font-size: 0.85rem;
}

.nav-item.level-3 .nav-link {
  padding-left: 3rem;
  font-size: 0.8rem;
}

.nav-item.level-4 .nav-link {
  padding-left: 3.75rem;
  font-size: 0.8rem;
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
}

.nav-link:hover .required-indicator {
  opacity: 1;
  color: #ff7425;
}

.nav-link.active {
  color: var(--accent-color);
  background: rgba(0, 122, 204, 0.1);
  font-weight: 600;
}

.expand-toggle {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.expand-toggle:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
}

.nav-sublist {
  list-style: none;
  padding: 0;
  margin: 0.25rem 0 0 0;
}

/* 搜索高亮样式 */
:deep(.search-highlight) {
  background: rgba(255, 235, 59, 0.6);
  color: var(--text-primary);
  padding: 0.1em 0.2em;
  border-radius: 3px;
  font-weight: 600;
}

/* 展开/收起动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
