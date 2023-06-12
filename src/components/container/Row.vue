<template>
  <div
    ref="rowRef"
    :class="[
      'xg-row',
      // {
      //   'xg-row__hover':
      //     props.renderStyle && $param.hoverItem?.uuid === props.data?.uuid
      // },
      // {
      //   'xg-row__select':
      //     props.renderStyle && $param.selectItem?.uuid === props.data?.uuid
      // },
      {
        'xg-row__ghost':
          props.renderStyle &&
          $param.moveStartItem &&
          $param.moveStartItem.uuid === props.data?.uuid
      },
      {
        'xg-row__drag-chosen':
          props.renderStyle &&
          $param.moveHoverItem &&
          $param.moveHoverItem.uuid === props.data?.uuid
      },
      { 'xg-row__only': !props.renderStyle }
    ]"
    :style="{
      top: `${(props.data?.flatIndex ?? 0) * rowHeight}px`,
      height: `${rowHeight}px`,
      borderWidth: props.renderStyle ? '1px' : 0,
      '--color': $styleBox.headerStyle?.textColor,
      // backgroundColor: props.renderStyle ? ($styleBox.levelColor[props.data!.level] || $styleBox.headerStyle?.bgColor) : undefined,
      '--backgroundColor': bgColor,
      'border-color': $styleBox.borderColor
    }"
    @mouseenter.capture="onEnter"
    @mouseleave="onLeave"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onUnifyClick } from '@/composables/useClick';
import useEvent from '@/composables/useEvent';
import useExport from '@/composables/useExport';
import useParam from '@/composables/useParam';
import useStyle from '@/composables/useStyle';
import RowItem from '@/models/data/row';
import { blend } from '@/utils/colors';
import { Ref, computed, ref } from 'vue';

const props = defineProps({
  data: RowItem,
  renderStyle: { type: Boolean, default: true },
  longPress: { type: Boolean, default: false }
});

const { rowHeight, $styleBox } = useStyle();

const { $param } = useParam();

// #region set hover
function onEnter() {
  $param.hoverItem = props.data ?? null;
}

function onLeave() {
  if (!props.renderStyle) return;

  $param.hoverItem = null;
}
// #endregion

// #region background color
const bgColor = computed(() => {
  if (!props.renderStyle) return undefined;

  let c =
    $styleBox.levelColor[props.data!.level] || $styleBox.headerStyle?.bgColor;

  if ($param.selectItem?.uuid === props.data?.uuid) {
    c = blend('#ffffff99', $styleBox.bodyStyle?.selectColor ?? '#e0e0e0');
  }

  if ($param.hoverItem?.uuid === props.data?.uuid) {
    c = blend('#ffffff99', $styleBox.bodyStyle?.hoverColor ?? '#f0f0f0');
  }

  return c;
});
// #endregion

// #region 点击事件
const { jumpToDate } = useExport();
const { EmitRowClick, EmitRowDblClick } = useEvent();
const rowRef = ref(null) as Ref<HTMLDivElement | null>;
onUnifyClick(rowRef, {
  click: () => {
    if ($styleBox.sliderIntoView && props.data?.start) {
      jumpToDate(props.data.start.date);
    }

    $param.selectItem = props.data ?? null;
    EmitRowClick(props.data?.data);
  },
  dblClick: () => {
    EmitRowDblClick(props.data?.data);
  }
});
// #endregion
</script>

<style lang="scss">
.xg-row {
  width: 100%;
  position: absolute;
  overflow: hidden;
  border-bottom: 1px solid #e5e5e5;
  box-sizing: border-box;
  color: var(--color);
  background-color: var(--backgroundColor);
}

.xg-row__only {
  pointer-events: none;
}

.xg-row.xg-row__hover {
  background-color: #f0f0f0aa;
}

.xg-row.xg-row__select {
  background-color: #e0e0e0aa;
}
</style>
