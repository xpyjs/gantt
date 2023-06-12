<template>
  <div ref="tableBodyRef" class="xg-table-body" :style="{ height: bodyHeight }">
    <template v-for="d in inView" :key="d.id">
      <RowVue class="xg-table-row" :data="d">
        <template v-for="(c, i) in $slotsBox.cols" :key="`${d.uuid}_${i}`">
          <component :is="c" :data="d" />
        </template>
      </RowVue>
    </template>
  </div>

  <div
    :style="{
      height: `${props.gap}px`,
      width: '100%'
    }"
  />
</template>

<script lang="ts" setup>
import { reactive, ref, Ref, watchEffect, WatchStopHandle } from 'vue';
import useInView from '@/composables/useInView';
import useSlotsBox from '@/composables/useSlotsBox';
import useStyle from '@/composables/useStyle';
import { useMouseInElement } from '@vueuse/core';
import { useSortable } from '@vueuse/integrations/useSortable';
import RowVue from './Row.vue';
import useData from '@/composables/useData';
import useParam from '@/composables/useParam';

type UseMouseInElement = ReturnType<typeof useMouseInElement>;

const props = defineProps<{ gap: number }>();

const { bodyHeight, rowHeight, $styleBox } = useStyle();
const { inView } = useInView();

const { $slotsBox } = useSlotsBox();

// #region 拖拽 row
const { $data } = useData();
const { $param } = useParam();
const tableBodyRef = ref(null) as Ref<HTMLElement | null>;
let mouse = null as UseMouseInElement | null;
let mouseWatch: WatchStopHandle;

useSortable(tableBodyRef, [], {
  handle: '.drag-icon',
  draggable: '.xg-row',
  dragClass: 'xg-row-dragging',
  dragoverBubble: true,

  onStart: function (e) {
    if (!e.item.classList.contains('xg-row')) return;

    const flatIndex = Math.ceil(e.item.offsetTop / rowHeight.value);
    $param.moveStartItem = $data.flatData[flatIndex];

    mouse = reactive(
      useMouseInElement(tableBodyRef)
    ) as unknown as UseMouseInElement;

    mouseWatch = watchEffect(() => {
      const y = ref(mouse?.elementY);

      if (typeof y.value === 'number') {
        const flatIndex = Math.floor(y.value / rowHeight.value);
        const data = $data.flatData[flatIndex];

        if ($param.moveHoverItem?.uuid !== data?.uuid) {
          if (
            !(
              $param.moveHoverItem &&
              $styleBox.draggable.level === 'current' &&
              $param.moveHoverItem.level !== data?.level
            )
          ) {
            $param.moveHoverItem = data;
          }
        }
      }
    });
  },

  onEnd: function (e) {
    if (e.item.classList.contains('xg-row__ghost')) {
      e.item.parentElement?.removeChild(e.item);
    }

    const moveLastData = $param.moveHoverItem;
    const originData = $param.moveStartItem;

    $param.moveStartItem = null;
    $param.moveHoverItem = null;
    mouse?.stop();
    mouseWatch?.();

    if (!moveLastData || !originData || moveLastData.id === originData.id)
      return;

    $data.swap(moveLastData, originData);
  }
});
// #endregion
</script>

<style lang="scss">
.xg-table-body {
  width: 100%;
  position: relative;

  .xg-table-row.xg-row.xg-row-dragging {
    background-color: var(--primary-color);
    border: 1px dashed #ccc;
    border-radius: 4px;
    box-shadow: 0 0 10px #ccc;
    cursor: grabbing;
  }
}

.xg-row.xg-row__ghost {
  background-color: var(--primary-color);
  opacity: 0.5;
  transition: all 0.3s ease;
}

.xg-row.xg-row__drag-chosen {
  background-color: green;
  transition: all 0.3s ease;
  animation: bling 1s forwards;
}

@keyframes bling {
  0% {
    opacity: 0.3;
  }
  40% {
    opacity: 0.3;
  }
  55% {
    opacity: 0.8;
  }
  70% {
    opacity: 0.3;
  }
  85% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.3;
  }
}
</style>
