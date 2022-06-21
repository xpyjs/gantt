<template>
  <svg
    t="1594609520750"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="6884"
    data-darkreader-inline-fill=""
    :width="size"
    :height="size"
    :style="{ fill: 'var(--x-primary-color)' }"
    :class="{
      'gt-animation': true,
      up: up,
      down: down,
      left: left,
      right: right
    }"
  >
    <path
      d="M823.110667 437.542194L302.873052 81.236186c-59.893088-41.026392-141.257188 1.871627-141.257188 74.457805v712.610994c0 72.586179 81.364099 115.484198 141.257188 74.457806l520.237615-356.304985c52.364625-35.8413 52.364625-113.074312 0-148.915612z"
      p-id="6885"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from 'vue';

type Direction = 'up' | 'down' | 'left' | 'right';

export default defineComponent({
  name: 'GanttArrowIcon'
});
</script>

<script lang="ts" setup>
const props = defineProps({
  size: {
    type: Number,
    default: 15
  },

  direction: {
    type: String as PropType<Direction>,
    default: 'right',
    validator: (v: Direction) => {
      return ['up', 'down', 'left', 'right'].includes(v);
    }
  }
});

const up = ref(false);
const down = ref(false);
const left = ref(false);
const right = ref(true);

function checkDirection() {
  up.value = false;
  down.value = false;
  left.value = false;
  right.value = false;

  switch (props.direction) {
    case 'up':
      up.value = true;
      break;
    case 'down':
      down.value = true;
      break;
    case 'left':
      left.value = true;
      break;
    default:
      right.value = true;
      break;
  }
}

onMounted(() => {
  checkDirection();
});

watch(
  () => props.direction,
  direction => {
    checkDirection();
  }
);
</script>

<style scoped>
.right {
  transform: rotate(0);
}

.down {
  transform: rotate(90deg);
}

.up {
  transform: rotate(-90deg);
}

.left {
  transform: rotate(-180deg);
}
</style>
