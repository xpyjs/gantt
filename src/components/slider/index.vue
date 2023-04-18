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
import { useDraggable } from '@vueuse/core';
import useData from '@/composables/useData';
import useGanttHeader from '@/composables/useGanttHeader';
import useGanttWidth from '@/composables/useGanttWidth';

export default defineComponent({
  name: Variables.name.slider
});
</script>

<script setup lang="ts">
const props = defineProps(sliderProps);
const slots = useSlots();

// left 取决于 data 的 start 日期值

// 滑块的初始偏移量
const { $data } = useData();
const { ganttHeader } = useGanttHeader();
const { ganttColumnWidth } = useGanttWidth();
const sliderLeft = computed(
  () =>
    ((props.data?.start.intervalTo($data.start) ?? 0) /
      Variables.time.millisecondOf[ganttHeader.unit]) *
    ganttColumnWidth.value
);

const sliderWidth = computed(
  () =>
    (props.data!.start.intervalTo(props.data?.end) /
      Variables.time.millisecondOf[ganttHeader.unit]) *
    ganttColumnWidth.value
);

const left = ref(0);
const sliderRef = ref<HTMLElement | null>(null);
const delta = ref(0);
const startDate = props.data?.start.clone();
const endDate = props.data?.end.clone();
useDraggable(sliderRef, {
  onStart: (pos, e) => {
    const rect = sliderRef.value!.getBoundingClientRect();
    delta.value = Math.abs(left.value - rect.left) + e.offsetX;
  },

  onMove: (pos, e) => {
    left.value = e.clientX - delta.value;

    props.data?.setStart(
      startDate!.getOffset(
        (left.value / ganttColumnWidth.value) *
          Variables.time.millisecondOf[ganttHeader.unit]
      ),
      ganttHeader.unit
    );

    props.data?.setEnd(
      endDate!.getOffset(
        (left.value / ganttColumnWidth.value) *
          Variables.time.millisecondOf[ganttHeader.unit]
      ),
      ganttHeader.unit
    );
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
  cursor: move;
}
</style>
