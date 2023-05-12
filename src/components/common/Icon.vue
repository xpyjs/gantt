<template>
  <svg class="xg-icon" aria-hidden="true">
    <use :xlink:href="icon"></use>
  </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import '@/assets/iconfont/iconfont.js';

const props = defineProps({
  name: {
    type: String,
    required: true
  }
});

const icon = computed(() => `#icon-${props.name}`);
</script>

<style scoped lang="scss">
.xg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
