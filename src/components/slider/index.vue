<template>
  <div
    ref="sliderRef"
    :class="['xg-slider', 'xg-slider-drag']"
    :style="{ left: `${sliderLeft}px`, width: `${sliderWidth}px` }"
  >
    <slot v-if="slots.default" v-bind="props.data?.data" />

    <span v-else-if="props.prop">{{ props.data?.data?.[props.prop] }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, useSlots, ref, computed } from 'vue';
import Variables from '@/constants/vars';
import sliderProps from './props';
import useData from '@/composables/useData';
import useGanttHeader from '@/composables/useGanttHeader';
import useGanttWidth from '@/composables/useGanttWidth';
import useDrag from '@/composables/useDrag';

export default defineComponent({
  name: Variables.name.slider
});
</script>

<script setup lang="ts">
const props = defineProps(sliderProps);
const slots = useSlots();
const { $data } = useData();
const { ganttHeader } = useGanttHeader();
const { ganttColumnWidth, currentMillisecond } = useGanttWidth();

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

const sliderRef = ref<HTMLElement | null>(null);
const { onDrag } = useDrag();
onDrag(sliderRef, {
  onMove: x => {
    setStart(x);
    setEnd(x);
  }
});
</script>

<style lang="scss" scoped>
@use 'sass:math';

.xg-slider {
  background-color: darkgoldenrod;
  position: absolute;
  $h: 70%;
  height: $h;
  border-radius: 4px;
  font-size: 12px;
  top: math.div(100% - $h, 2);
}

.xg-slider.xg-slider-drag {
  cursor: ew-resize;
}
</style>
