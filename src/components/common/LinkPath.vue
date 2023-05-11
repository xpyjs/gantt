<template>
  <path stroke="red" fill="transparent" :d="path"></path>
</template>

<script lang="ts" setup>
import useGanttHeader from '@/composables/useGanttHeader';
import useGanttWidth from '@/composables/useGanttWidth';
import useStyle from '@/composables/useStyle';
import { LinkItem } from '@/models/data/links';
import { computed, PropType } from 'vue';

const props = defineProps({
  link: {
    type: Object as PropType<LinkItem>,
    default: () => ({})
  }
});

const { ganttHeader } = useGanttHeader();
const { ganttColumnWidth, currentMillisecond } = useGanttWidth();
const { rowHeight } = useStyle();

const x = computed(
  () =>
    (props.link.fromRow.end.intervalTo(ganttHeader.start) /
      currentMillisecond.value) *
    ganttColumnWidth.value
);

const y = computed(
  () => props.link.fromRow.flatIndex * rowHeight.value + rowHeight.value / 2
);

const x2 = computed(
  () =>
    (props.link.toRow.start.intervalTo(ganttHeader.start) /
      currentMillisecond.value) *
    ganttColumnWidth.value
);

const y2 = computed(
  () => props.link.toRow.flatIndex * rowHeight.value + rowHeight.value / 2
);

const path = computed(
  () =>
    `M ${x.value + 10} ${y.value} H ${x.value + 50} V ${
      y.value + rowHeight.value / 2
    } H ${x2.value - 10} V ${y2.value}`
);
</script>

<style scoped lang="scss"></style>
