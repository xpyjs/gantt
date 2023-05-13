<template>
  <div
    :class="[
      'xg-row',
      {
        'xg-row__hover':
          props.renderStyle && $param.hoverItem?.uuid === props.data?.uuid
      },
      {
        'xg-row__select':
          props.renderStyle && $param.selectItem?.uuid === props.data?.uuid
      }
    ]"
    :style="{
      top: `${(props.data?.flatIndex ?? 0) * rowHeight}px`,
      height: `${rowHeight}px`,
      borderWidth: props.renderStyle ? '1px' : 0,
      backgroundColor: props.renderStyle ? ($styleBox.levelColor[props.data!.level] ?? undefined) : undefined,
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
import useEvent from '@/composables/useEvent';
import useParam from '@/composables/useParam';
import useStyle from '@/composables/useStyle';
import RowItem from '@/models/data/row';

const props = defineProps({
  data: RowItem,
  renderStyle: { type: Boolean, default: true }
});

const { rowHeight, $styleBox } = useStyle();

const { $param } = useParam();
function onEnter() {
  $param.hoverItem = props.data ?? null;
}

function onLeave() {
  $param.hoverItem = null;
}

const { EmitRowClick } = useEvent();
function onClick() {
  $param.selectItem = props.data ?? null;
  EmitRowClick(props.data?.data);
}

function onDblClick() {
  // 抛出 data
}
</script>

<style lang="scss" scoped>
.xg-row {
  width: 100%;
  position: absolute;
  overflow: hidden;
  border-bottom: 1px solid #e5e5e5;
  box-sizing: border-box;
}

.xg-row.xg-row__hover {
  background-color: #f0f0f0aa !important;
}

.xg-row__select {
  background-color: #e0e0e0aa !important;
}
</style>
