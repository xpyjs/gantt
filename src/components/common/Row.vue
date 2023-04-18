<template>
  <div
    :class="[
      'xg-row',
      { 'xg-row__hover': $param.hoverId === props.data.uuid },
      { 'xg-row__select': $param.selectId === props.data.uuid }
    ]"
    :style="{
      top: `${props.data.flatIndex * rowHeight}px`,
      height: `${rowHeight}px`,
      ...$styleBox.getBorderColor()
    }"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @click="onClick"
    @dblclick="onDblClick"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import useParam from '@/composables/useParam';
import useStyle from '@/composables/useStyle';
import RowItem from '@/models/data/row';

const props = defineProps<{ data: RowItem }>();

const { rowHeight, $styleBox } = useStyle();

const { $param } = useParam();
function onEnter() {
  $param.hoverId = props.data.uuid;
}

function onLeave() {
  $param.hoverId = '';
}

function onClick() {
  $param.selectId = props.data.uuid;
}

function onDblClick() {
  // 抛出 data
}
</script>

<style lang="scss" scoped>
.xg-row {
  width: 100%;
  position: absolute;
  background-color: #fafafa;
  overflow: hidden;
  border-bottom: 1px solid;
  box-sizing: border-box;
}

.xg-row.xg-row__hover {
  background-color: #f0f0f0;
}

.xg-row__select {
  background-color: #e0e0e0;
}
</style>
