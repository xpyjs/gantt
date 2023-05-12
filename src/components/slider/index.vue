<template>
  <div
    ref="sliderRef"
    :class="['xg-slider', { 'xg-slider-drag': canMove }]"
    :style="{
      left: `${sliderLeft}px`,
      width: `${sliderWidth}px`,
      maxHeight: `${$styleBox.rowHeight}px`,
      backgroundColor: props?.bgColor,
      height: height,
      top:
        height === '100%' ||
        (!/%$/.test(height) && parseFloat(height) >= $styleBox.rowHeight)
          ? 0
          : `calc(calc(100% - ${height}) / 2)`
    }"
  >
    <div
      :class="[
        'xg-slider-anchor',
        'in-anchor',
        {
          'xg-slider-anchor__show': $param.hoverItem?.uuid === props.data?.uuid
        }
      ]"
      @pointerdown="onInAnchorDown"
    ></div>

    <!-- 滑块主体 -->
    <div class="xg-slider-content">
      <!-- 左滑块 -->
      <div
        v-if="props.resizeLeft"
        ref="resizeLeftRef"
        class="xg-slider-resize left"
        :style="{ backgroundColor: resizeColor }"
        @pointerdown.stop="onResizeLeftDown"
      />

      <slot v-if="slots.default" v-bind="props.data?.data" />

      <div
        v-else-if="props.prop"
        class="slider-text"
        :style="{ 'justify-content': props.alignment }"
      >
        {{
          props.dateFormat
            ? formatDate(originData, props.dateFormat)
            : originData
        }}
      </div>

      <!-- 右滑块 -->
      <div
        v-if="props.resizeRight"
        ref="resizeRightRef"
        class="xg-slider-resize right"
        :style="{ backgroundColor: resizeColor }"
        @pointerdown.stop="onResizeRightDown"
      />
    </div>

    <div
      :class="[
        'xg-slider-anchor',
        'out-anchor',
        {
          'xg-slider-anchor__show': $param.hoverItem?.uuid === props.data?.uuid
        }
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
import useStyle from '@/composables/useStyle';
import { formatDate } from '@/utils/date';
import { blend } from '@/utils/colors';
import { isBoolean, isFunction } from 'lodash';

export default defineComponent({
  name: Variables.name.slider
});
</script>

<script setup lang="ts">
const props = defineProps(sliderProps);
const slots = useSlots();
const { $param } = useParam();
const { $styleBox } = useStyle();

const height = computed(() => {
  if (typeof props.height === 'number') {
    return `${props.height}px`;
  }

  if (!/[^0-9.]+/.test(props.height)) {
    return `${parseFloat(props.height)}px`;
  }

  return props.height;
});

const originData = computed(
  () => props.label || (props.data?.data?.[props.prop ?? ''] ?? props.emptyData)
);

const resizeColor = computed(() =>
  blend({ r: 93, g: 68, b: 15, a: 40 }, props?.bgColor || '#eca710')
);

// #region 计算滑块位置
const { toRowData } = useData();
const { ganttHeader } = useGanttHeader();
const { ganttColumnWidth, currentMillisecond } = useGanttWidth();
const sliderLeft = computed(
  () =>
    (props.data!.start.intervalTo(ganttHeader.start) /
      currentMillisecond.value) *
    ganttColumnWidth.value
);

const sliderWidth = computed(
  () =>
    (props.data!.end.intervalTo(props.data?.start) / currentMillisecond.value) *
    ganttColumnWidth.value
);
// #endregion

// #region 移动滑块
const calcMove = (p: boolean | ((data: RowData) => boolean)) => {
  if (isBoolean(p)) return p;
  if (isFunction(p)) {
    return p(toRowData(props.data!));
  }

  return false;
};

const canMove = computed(() => {
  return calcMove(props.move);
});
const disableMove = ref(false);
function handleDisableMove() {
  disableMove.value = true;
}

onMounted(() => {
  document.addEventListener('pointerup', () => {
    disableMove.value = false;
  });
});

let startDate = props.data?.start.clone();
const setStart = (x: number) => {
  props.data?.setStart(
    startDate!.getOffset(
      (x / ganttColumnWidth.value) * currentMillisecond.value
    ),
    ganttHeader.unit
  );
};

let endDate = props.data?.end.clone();
const setEnd = (x: number) =>
  props.data?.setEnd(
    endDate!.getOffset((x / ganttColumnWidth.value) * currentMillisecond.value),
    ganttHeader.unit
  );

const sliderRef = ref(null) as Ref<HTMLElement | null>;
const { onDrag } = useDrag();
onDrag(sliderRef, {
  disabled: () => !canMove.value || disableMove.value,
  reset: true,

  onStart: () => {
    startDate = props.data?.start.clone();
    endDate = props.data?.end.clone();
  },

  onMove: x => {
    setStart(x);
    setEnd(x);
  }
});
// #endregion

// #region 左滑块移动
function onResizeLeftDown() {
  handleDisableMove();
}
const resizeLeftRef = ref(null) as Ref<HTMLElement | null>;
onDrag(resizeLeftRef, {
  reset: true,

  onStart: () => {
    startDate = props.data?.start.clone();
  },

  onMove: x => {
    setStart(x);
  }
});
// #endregion

// #region 右滑块移动
function onResizeRightDown() {
  handleDisableMove();
}
const resizeRightRef = ref(null) as Ref<HTMLElement | null>;
onDrag(resizeRightRef, {
  reset: true,

  onStart: () => {
    endDate = props.data?.end.clone();
  },

  onMove: x => {
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
.xg-slider {
  position: absolute;
  transition: filter 0.2s;

  .xg-slider-content {
    background-color: goldenrod;
    border-radius: 4px;
    font-size: 10px;
    height: 100%;
    padding: 0 12px;
    overflow: hidden;
    position: relative;

    .slider-text {
      height: 100%;
      display: flex;
      align-items: center;
    }

    .xg-slider-resize {
      width: 12px;
      height: 100%;
      position: absolute;
      top: 0;
      z-index: 1;
      cursor: ew-resize;

      &:hover {
        filter: darkness(0.8);
      }
    }

    .xg-slider-resize.left {
      left: 0;
    }

    .xg-slider-resize.right {
      right: 0;
    }
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
