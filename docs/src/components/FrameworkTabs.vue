<template>
  <div class="framework-tabs">
    <button
      v-for="framework in frameworks.filter(f => props.tabs.includes(f.key))"
      :key="framework.key"
      @click="setActiveFramework(framework.key)"
      :class="['framework-tab', { active: checkActive(framework.key) }]"
      :style="{ '--framework-color': framework.color }"
    >
      <Icon
        :icon="framework.icon"
        class="framework-icon"
        width="16"
        height="16"
      />
      <span class="framework-label">{{ framework.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useFramework } from "../composables/useFramework";

const props = defineProps<{
  tabs: string[];
}>();

const { activeFramework, setActiveFramework, frameworks } = useFramework();

const checkActive = (key: string) => {
  if (props.tabs.includes(activeFramework.value)) {
    return activeFramework.value === key;
  }

  return key === props.tabs[0];
};
</script>

<style scoped>
.framework-tabs {
  display: inline-flex;
  background: var(--bg-secondary);
  border-radius: 6px 6px 0 0;
  padding: 4px;
  margin-bottom: 0;
  border-bottom: none;
  width: fit-content;
  border-left: 4px solid #007acc;
}

.framework-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.8125rem;
  white-space: nowrap;
  outline: none !important;
}

.framework-tab:first-child {
  border-radius: 4px 0 0 4px;
}

.framework-tab:last-child {
  border-radius: 0 4px 4px 0;
}

.framework-tab:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.framework-tab.active {
  background: #007acc;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.framework-icon {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
}

.framework-label {
  font-size: 0.8125rem;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .framework-tab {
    padding: 0.375rem 0.5rem;
  }

  .framework-label {
    display: none;
  }
}
</style>
