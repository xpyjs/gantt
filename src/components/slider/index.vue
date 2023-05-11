<template>
  <div
    ref="sliderRef"
    :class="['xg-slider', 'xg-slider-drag']"
    :style="{ left: `${sliderLeft}px`, width: `${sliderWidth}px` }"
  >
    <div
      :class="[
        'xg-slider-anchor',
        'in-anchor',
        { 'xg-slider-anchor__show': $param.hoverId === props.data?.uuid }
      ]"
      @pointerdown="onInAnchorDown"
    ></div>

    <slot v-if="slots.default" v-bind="props.data?.data" />

    <span v-else-if="props.prop" class="xg-slider-text">{{
      props.data?.data?.[props.prop]
    }}</span>

    <div
      :class="[
        'xg-slider-anchor',
        'out-anchor',
        { 'xg-slider-anchor__show': $param.hoverId === props.data?.uuid }
      ]"
      @pointerdown="onOutAnchorDown"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, useSlots, ref, computed, onMounted, Ref } from 'vue';
import Variables from '@/constants/vars';
import sliderProps from './props';
import useData from '@/composables/useData';
import useGanttHeader from '@/composables/useGanttHeader';
import useGanttWidth from '@/composables/useGanttWidth';
import useDrag from '@/composables/useDrag';
import useParam from '@/composables/useParam';

export default defineComponent({
  name: Variables.name.slider
});
</script>

<script setup lang="ts">
const props = defineProps(sliderProps);
const slots = useSlots();
const { $data } = useData();
const { $param } = useParam();
const { ganttHeader } = useGanttHeader();
const { ganttColumnWidth, currentMillisecond } = useGanttWidth();

// #region 计算滑块位置
const sliderLeft = computed(
  () =>
    (props.data!.start.intervalTo($data.start) / currentMillisecond.value) *
    ganttColumnWidth.value
);

const sliderWidth = computed(
  () =>
    (props.data!.end.intervalTo(props.data?.start) / currentMillisecond.value) *
    ganttColumnWidth.value
);
// #endregion

// #region 移动滑块
const disableMove = ref(false);
function handleDisableMove() {
  disableMove.value = true;
}

onMounted(() => {
  document.addEventListener('pointerup', () => {
    disableMove.value = false;
  });
});

const setStart = (() => {
  const startDate = props.data?.start.clone();
  return (x: number) => {
    props.data?.setStart(
      startDate!.getOffset(
        (x / ganttColumnWidth.value) * currentMillisecond.value
      ),
      ganttHeader.unit
    );
  };
})();

const setEnd = (() => {
  const endDate = props.data?.end.clone();
  return (x: number) =>
    props.data?.setEnd(
      endDate!.getOffset(
        (x / ganttColumnWidth.value) * currentMillisecond.value
      ),
      ganttHeader.unit
    );
})();

const sliderRef = ref(null) as Ref<HTMLElement | null>;
const { onDrag } = useDrag();
onDrag(sliderRef, {
  disabled: () => disableMove.value,

  onMove: x => {
    setStart(x);
    setEnd(x);
  }
});
// #endregion

// #region inAnchor
function onInAnchorDown() {
  handleDisableMove();
}
// #endregion

// #region outAnchor
function onOutAnchorDown() {
  handleDisableMove();

  console.log('outAnchorDown', props.data);
}
// #endregion
</script>

<style lang="scss" scoped>
@use 'sass:math';

.xg-slider {
  background-color: goldenrod;
  position: absolute;
  $h: 70%;
  height: $h;
  border-radius: 4px;
  font-size: 10px;
  top: math.div(100% - $h, 2);
  padding: 0 12px;
  transition: filter 0.2s;

  .xg-slider-text {
    vertical-align: middle;
  }

  &:hover {
    filter: brightness(1.2);
  }
}

.xg-slider.xg-slider-drag {
  cursor: ew-resize;
}

.xg-slider-anchor {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #fff;
  border: 2px solid goldenrod;
  position: absolute;
  top: calc(50% - 3px);
  cursor: pointer;
  opacity: 0;
  transition: transform 0.2s, opacity 0.2s;

  &:hover {
    transform: scale(1.5);
  }
}

.xg-slider-anchor__show {
  opacity: 1;
}

.in-anchor {
  left: -12px;
}

.out-anchor {
  right: -12px;
}
</style>
