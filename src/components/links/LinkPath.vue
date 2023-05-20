<template>
  <g
    ref="svgRef"
    :class="['xg-link', { 'xg-link__selected': selected }]"
    @click.stop="onClick"
  >
    <path
      :d="path"
      fill="transparent"
      :stroke="link.color"
      stroke-width="2"
      stroke-dasharray="4,4"
      :marker-end="`url(#triangle_${link.color})`"
      :marker-start="`url(#circle_${link.color})`"
    />

    <defs>
      <marker
        :id="`triangle_${link.color}`"
        markerWidth="5"
        markerHeight="4"
        refX="2"
        refY="2"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M0,0 L0,4 L5,2 z" :fill="link.color" />
      </marker>

      <marker
        :id="`circle_${link.color}`"
        markerWidth="5"
        markerHeight="4"
        refX="3"
        refY="2"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <circle cx="2" cy="2" r="2" :fill="link.color" />
      </marker>
    </defs>
  </g>
</template>

<script lang="ts" setup>
import useGanttHeader from '@/composables/useGanttHeader';
import useGanttWidth from '@/composables/useGanttWidth';
import useStyle from '@/composables/useStyle';
import { LinkItem } from '@/models/data/links';
import { computed, PropType, Ref, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import useEvent from '@/composables/useEvent';

const props = defineProps({
  link: {
    type: Object as PropType<LinkItem>,
    default: () => ({})
  }
});

const { EmitClickLink } = useEvent();

const selected = ref(false);
function onClick() {
  selected.value = true;
  EmitClickLink(props.link.originLink);
}

const svgRef = ref(null) as Ref<SVGGElement | null>;
onClickOutside(svgRef, () => {
  if (!selected.value) return;

  selected.value = false;
  EmitClickLink(null);
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

const down = computed(() => (y2.value > y.value ? 1 : -1));

const path = computed(
  () =>
    `M ${x.value + 10} ${y.value} H ${x.value + 20} V${
      x2.value - 20 >= x.value + 20
        ? y.value
        : y.value + (rowHeight.value / 2) * down.value
    } H ${x2.value - 20} V ${y2.value} H ${x2.value - 10}`
);
</script>

<style lang="scss">
.xg-link {
  cursor: pointer;
  transition: filter 0.2s;
  pointer-events: auto;

  path {
    transition: stroke-width 0.2s;
  }

  &:hover {
    filter: brightness(1.2);
  }
}

.xg-link__selected {
  path {
    stroke-width: 3;
  }
}
</style>
