<template>
  <Teleport :to="teleportTo">
    <Transition name="el-zoom-in-top">
      <div ref="menuRef" v-show="visible" class="xcm-menu" :style="{ top: `${position.y}px`, left: `${position.x}px` }">
        <ul class="xcm-list">
          <template v-for="(item, index) in items" :key="index">
            <li v-if="item.divider" class="xcm-divider"></li>
            <li v-else :class="['xcm-item', { 'is-disabled': item.disabled }]" @click="clickItem(item)">
              <div class="xcm-item__inner">
                <span class="xcm-item__label">{{ item.label }}</span>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
defineOptions({ name: 'ContextMenu' })

// Types
export interface ContextMenuItem {
  label: string
  key?: string | number
  disabled?: boolean
  divider?: boolean
  action?: () => void
}

const props = withDefaults(
  defineProps<{
    /** 是否可见（v-model:visible） */
    visible: boolean
    /** 显示位置（页面坐标） */
    position: { x: number; y: number }
    /** 菜单数据 */
    items: ContextMenuItem[]
    /** Teleport 目标 */
    teleportTo?: string | HTMLElement
  }>(),
  {
    teleportTo: 'body',
  }
)

const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void
}>()

const menuRef = ref<HTMLElement | null>(null);

const visible = computed(() => props.visible)
function close() {
  if (!visible.value) return
  emit('update:visible', false)
}

function clickItem(item: ContextMenuItem) {
  if (item.disabled) return
  if (item.action) {
    item.action()
  }
  close()
}

function onKeydown(e: KeyboardEvent) {
  if (!visible.value) return
  if (e.key === 'Escape') {
    e.stopPropagation()
    close()
  }
}
function onResize() {
  if (!visible.value) return
}
function onScroll() {
  if (!visible.value) return
  close()
}
function onBlur() {
  if (!visible.value) return
  close()
}
function onContextMenu() {
  if (!visible.value) return
  close()
}
function onClick(e: MouseEvent) {
  if (!visible.value) return
  if (e.target === menuRef.value || menuRef.value?.contains(e.target as Node)) {
    return;
  }

  close()
}

function bindGlobal() {
  window.addEventListener('keydown', onKeydown, true)
  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true, capture: true })
  window.addEventListener('contextmenu', onContextMenu, true)
  window.addEventListener('blur', onBlur)
  window.addEventListener('click', onClick, true);
}
function unbindGlobal() {
  window.removeEventListener('keydown', onKeydown, true)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('contextmenu', onContextMenu, true)
  window.removeEventListener('blur', onBlur)
  window.removeEventListener('click', onClick, true);
}

onMounted(() => bindGlobal())
onBeforeUnmount(() => unbindGlobal())
</script>

<style scoped>
.xcm-menu {
  position: fixed;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  box-shadow: var(--el-box-shadow-light);
  min-width: 140px;
  overflow: hidden;
  z-index: 999999;
}

.xcm-list {
  list-style: none;
  padding: 6px 4px;
  margin: 0;
}

.xcm-divider {
  height: 1px;
  margin: 6px 4px;
  background: var(--el-border-color);
}

.xcm-item {
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--el-text-color-regular);
}

.xcm-item.is-disabled {
  color: var(--el-text-color-placeholder);
  cursor: not-allowed;
}

.xcm-item:not(.is-disabled):hover {
  background: var(--el-fill-color-light);
}

.xcm-item__inner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
}

.xcm-item__label {
  flex: 1 1 auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
