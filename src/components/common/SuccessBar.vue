<template>
  <div
    class="gt-success-bar"
    :style="{
      height: `${rowHeight}px`,
      top: `${headerHeight + rowHeight * row.__uindex}px`,
      'animation-duration': `${successBarTimeout / 1000}s`
    }"
  />
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import useResize from '@/composables/useResize';
import { Row } from '@/models/data/row';
import useSuccessBar from '@/composables/useSuccessBar';

defineProps({
  row: {
    type: Object as PropType<Row>,
    required: true
  }
});

const { headerHeight, rowHeight } = useResize();
const { successBarTimeout } = useSuccessBar();
</script>

<style scoped lang="scss">
.gt-success-bar {
  position: absolute;
  left: 50%;
  width: 0;
  z-index: 999;
  background-color: #90ee90;
  opacity: 0.2;
  animation-name: spread;
  animation-timing-function: cubic-bezier(0, 0.95, 0.48, 1);
  animation-fill-mode: forwards;
}

@keyframes spread {
  0% {
    width: 0;
  }
  100% {
    left: 0;
    width: 100%;
  }
}
</style>
