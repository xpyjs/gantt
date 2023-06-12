<template>
  <!-- <svg class="xg-icon" aria-hidden="true">
    <use :xlink:href="icon"></use>
  </svg> -->

  <i class="iconfont xg-icon" :class="icon"></i>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
// import '@/assets/iconfont/iconfont.js';
import '@/assets/iconfont/iconfont.css';

const props = defineProps({
  name: {
    type: String,
    required: true
  }
});

const icon = computed(() => `icon-${props.name}`);
</script>

<style lang="scss">
// .xg-icon {
//   width: 1em;
//   height: 1em;
//   vertical-align: -0.15em;
//   fill: currentColor;
//   overflow: hidden;
// }

.xg-icon {
  color: #999;
  display: inline-block;
  font-size: 14px;
  width: 1em;
  height: 1em;
}
</style>
