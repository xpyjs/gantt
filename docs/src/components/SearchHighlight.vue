<template>
  <span v-html="highlightText"></span>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  text: string;
  search: string;
}

const props = defineProps<Props>();

const highlightText = computed(() => {
  if (!props.search) {
    return props.text;
  }

  const regex = new RegExp(`(${escapeRegex(props.search)})`, "gi");
  return props.text.replace(regex, '<mark class="search-highlight">$1</mark>');
});

const escapeRegex = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
</script>

<style scoped>
:global(.search-highlight) {
  background: rgba(236, 167, 16, 0.3);
  color: #eca710;
  font-weight: 600;
  padding: 0.1em 0.2em;
  border-radius: 2px;
}
</style>
