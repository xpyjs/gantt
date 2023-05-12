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

    <div class="xg-slider-block">
      <!-- 滑块主体 -->
      <slot
        v-if="slots.content"
        name="content"
        v-bind="toRowData(props.data)"
      />
      <div v-else class="xg-slider-content">
        <slot v-if="slots.default" v-bind="toRowData(props.data)" />

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
      </div>

      <!-- 左滑块 -->
      <div
        v-if="canResizeLeft"
        ref="resizeLeftRef"
        class="xg-slider-resize left"
        @pointerdown.stop="onResizeLeftDown"
      >
        <slot v-if="slots.left" name="left" v-bind="toRowData(props.data)" />
        <div v-else class="resize-chunk" />
      </div>

      <!-- 右滑块 -->
      <div
        v-if="canResizeRight"
        ref="resizeRightRef"
        class="xg-slider-resize right"
        @pointerdown.stop="onResizeRightDown"
      >
        <slot v-if="slots.right" name="right" v-bind="toRowData(props.data)" />
        <div v-else class="resize-chunk" />
      </div>
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

const { toRowData, getProp } = useData();
const originData = computed(
  () => props.label || getProp(props.data!, props.prop, props.emptyData)
);

// #region 计算滑块位置
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
    ganttHeader.unit,
    props.linkedResize
  );
};

let endDate = props.data?.end.clone();
const setEnd = (x: number) =>
  props.data?.setEnd(
    endDate!.getOffset((x / ganttColumnWidth.value) * currentMillisecond.value),
    ganttHeader.unit,
    props.linkedResize
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
const canResizeLeft = computed(() => {
  return calcMove(props.resizeLeft);
});
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
const canResizeRight = computed(() => {
  return calcMove(props.resizeRight);
});
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

  .xg-slider-block {
    overflow: hidden;
    position: relative;
    font-size: 12px;
    height: 100%;

    .xg-slider-content {
      background-color: goldenrod;
      border-radius: 4px;
      height: 100%;
      padding: 0 12px;

      .slider-text {
        height: 100%;
        display: flex;
        align-items: center;
      }
    }

    .xg-slider-resize {
      height: 100%;
      position: absolute;
      top: 0;
      z-index: 1;
      cursor: ew-resize;

      .resize-chunk {
        background-color: #b18424;
        width: 12px;
        height: 100%;
        opacity: 0;
      }
    }

    .xg-slider-resize.left {
      left: 0;

      .resize-chunk {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
    }

    .xg-slider-resize.right {
      right: 0;

      .resize-chunk {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
  }

  &:hover {
    filter: brightness(1.2);

    .xg-slider-resize {
      .resize-chunk {
        opacity: 1;
      }
    }
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
