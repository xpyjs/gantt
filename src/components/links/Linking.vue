<template>
  <g v-show="linking.isLinking">
    <path
      :d="path"
      fill="transparent"
      stroke="red"
      stroke-width="2"
      stroke-dasharray="5,5"
      :marker-end="`url(#${id})`"
    />

    <defs>
      <marker
        :id="id"
        markerWidth="5"
        markerHeight="4"
        refX="5"
        refY="2"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M0,0 L0,4 L5,2 z" fill="red" />
      </marker>
    </defs>
  </g>
</template>

<script lang="ts" setup>
import useLinks from '@/composables/useLinks';
import { uuid } from '@/utils/common';
import { computed } from 'vue';

const { linking } = useLinks();

const id = uuid();

const path = computed(
  () =>
    `M ${linking.startPos.x} ${linking.startPos.y} L ${linking.endPos.x} ${linking.endPos.y}`
);
</script>
