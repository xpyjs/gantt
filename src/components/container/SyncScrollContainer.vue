<template>
  <div
    ref="divRef"
    class="xg-scroll-container"
    :class="{ 'xg-scroll-container__hide-scroll': hideScroll }"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
// This component idea from https://github.com/metawin-m/vue-scroll-sync
import useBus from '@/composables/useBus';
import { uuid } from '@/utils/common';
import { onMounted, reactive, ref } from 'vue';
import useParam from '@/composables/useParam';

const props = defineProps({
  // 按比例滚动
  proportional: { type: Boolean },
  // 垂直
  vertical: { type: Boolean },
  // 横向
  horizontal: { type: Boolean },
  // 组名，同组一起滚动
  group: { type: String, default: undefined },
  // 隐藏滚动条
  hideScroll: { type: Boolean },
  // 禁用横向滚动
  disableHorizontal: { type: Boolean },
  // 禁用纵向滚动
  disableVertical: { type: Boolean }
});

const scrollAction = reactive({ x: 0, y: 0 });
const direction = ref('');

const uid = uuid(5); // from https://github.com/vuejs/vue/issues/5886
const eventName = 'scroll-event';

const { $bus } = useBus();
const divRef = ref<HTMLDivElement>();

// 判断页面上下左右的移动方向
function scrollFunc(e: any) {
  const diffX = scrollAction.x - e.target?.scrollLeft;
  const diffY = scrollAction.y - e.target?.scrollTop;

  if (diffX < 0) {
    direction.value = 'right';
  } else if (diffX > 0) {
    direction.value = 'left';
  } else if (diffY < 0) {
    direction.value = 'down';
  } else if (diffY > 0) {
    direction.value = 'up';
  }

  scrollAction.x = e.target.scrollLeft;
  scrollAction.y = e.target.scrollTop;
}

const { $param } = useParam();

function handleScroll(e: any) {
  // 禁用条件
  if (props.disableHorizontal && ['left', 'right'].includes(direction.value)) {
    return;
  }

  if (props.disableVertical && ['up', 'down'].includes(direction.value)) {
    return;
  }

  window.requestAnimationFrame(() => {
    const {
      scrollTop,
      scrollHeight,
      clientHeight,
      scrollLeft,
      scrollWidth,
      clientWidth,
      offsetHeight,
      offsetWidth
    } = e.target;

    // 发出事件
    $bus.emit(eventName, {
      scrollTop,
      scrollHeight,
      clientHeight,
      scrollLeft,
      scrollWidth,
      clientWidth,
      barHeight: offsetHeight - clientHeight,
      barWidth: offsetWidth - clientWidth,
      emitter: uid,
      group: props.group,
      disableHorizontal: props.disableHorizontal,
      disableVertical: props.disableVertical
    });
  });
}

onMounted(() => {
  const container = divRef.value;

  // 注册滚动事件
  container?.addEventListener('scroll', scrollFunc);

  // 接收事件
  $bus.on(eventName, (data: any) => {
    if (data.emitter === uid || data.group !== props.group) {
      return;
    }

    // from https://github.com/okonet/react-scroll-sync
    const scrollTopOffset = data.scrollHeight - data.clientHeight;
    const scrollLeftOffset = data.scrollWidth - data.clientWidth;
    /* Calculate the actual pane height */
    const paneHeight = container?.scrollHeight! - data.clientHeight;
    const paneWidth = container?.scrollWidth! - data.clientWidth;
    /* Adjust the scrollTop position of it accordingly */
    container!.onscroll = null;
    if (
      !data.disableVertical &&
      props.vertical &&
      scrollTopOffset > data.barHeight
    ) {
      container!.scrollTop = props.proportional
        ? (paneHeight * data.scrollTop) / scrollTopOffset
        : data.scrollTop;

      $param.currentTop = container!.scrollTop;
    }
    if (
      !data.disableHorizontal &&
      props.horizontal &&
      scrollLeftOffset > data.barWidth
    ) {
      container!.scrollLeft = props.proportional
        ? (paneWidth * data.scrollLeft) / scrollLeftOffset
        : data!.scrollLeft;
    }
    window.requestAnimationFrame(() => {
      container!.onscroll = handleScroll;
    });
  });

  container!.onscroll = handleScroll;
});
</script>

<style lang="scss">
.xg-scroll-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
}

.xg-scroll-container__hide-scroll::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
