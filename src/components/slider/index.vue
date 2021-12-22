<script lang="ts">
import { isNumber, isSymbol } from 'lodash';
import {
  computed,
  defineComponent,
  ref,
  toRaw,
  toRefs,
  useAttrs,
  useSlots
} from 'vue';
import useParam, { useSetGanttHeader } from '@/composables/useParam';
import useRender from '@/composables/useRender';
import { Variables } from '@/constants/vars';
import { Row } from '@/models/data/row';
import {
  compareDate,
  createDate,
  getDateInterval,
  getDateOffset,
  getMillisecond
} from '@/utils/date';
import { isBoolean, isFunction } from '@/utils/is';
import sliderProps from './props';
import useRootEmit from '@/composables/event/useRootEmit';
import useData from '@/composables/data/useData';
import useShowDate from '@/composables/useShowDate';

export default defineComponent({
  name: Variables.name.slider
});
</script>

<script lang="ts" setup>
const props = defineProps(sliderProps);
const slots = useSlots();
const attrs = useAttrs();

const data = attrs.data as Row;
const {
  alignment,
  label,
  move,
  dateFormat,
  emptyData,
  bgColor,
  resizeLeft,
  resizeRight,
  linkedResize,
  progress,
  progressDecimal
} = toRefs(props);

const { oneDayWidth, GtParam } = useParam();
const { GtData } = useData();

const startOfData = computed(() => data.start as Date);
const startOfEnd = computed(() => data.end as Date);
const progressValue = computed(() => {
  let v = data.progress ?? 0;
  if (v > 1) v = 1;
  else if (v < 0) v = 0;

  // 显示方式，默认整数
  if (isNumber(progressDecimal.value)) {
    let fixed = Math.floor(progressDecimal.value);
    if (fixed < 0) fixed = 0;
    else if (fixed > 10) fixed = 10;
    return (v * 100).toFixed(fixed);
  }

  return progressDecimal.value ? (v * 100).toFixed(2) : Math.floor(v * 100);
});

// 滑块的宽度
const sliderWidth = computed(
  () =>
    (getDateInterval(startOfData.value, startOfEnd.value) /
      getMillisecond(GtParam.headerUnit)) *
    oneDayWidth.value
);

const canMove = computed(() => {
  if (isBoolean(move.value)) return move.value;
  if (isFunction(move.value)) {
    return move.value({ level: data.level + 1, data: toRaw(data.data) });
  }
  return false;
});

// 滑块的初始偏移量
const sliderLeft = computed(() => {
  // 最左侧一定是一个整天的宽度，将时间调整为0时，保证没有位移。非0会产生位移
  const sd = createDate(GtData.start);
  const sdTime = sd.setHours(0);

  return (
    (getDateInterval(sdTime, startOfData.value) /
      getMillisecond(GtParam.headerUnit)) *
    oneDayWidth.value
  );
});

// 判断用户是否提供了默认插槽
// const customDefaultScoped = computed(() => {
//   let slot;
//   // eslint-disable-next-line prefer-destructuring
//   if (slots?.default) slot = slots.default(scopeData(dateFormat?.value))[0];
//   return slot && isSymbol(slot.type) ? undefined : slot;
// });

// 判断用户是否提供了 content 插槽
const customContentScoped = computed(() => {
  let slot;
  // eslint-disable-next-line prefer-destructuring
  if (slots?.content) slot = slots.content(scopeData(dateFormat?.value))[0];
  return slot && isSymbol(slot.type) ? undefined : slot;
});

// 判断用户是否提供了左侧插槽
const isCustomLeftChunkScoped = computed(() => !!slots?.left);

// 判断用户是否提供了右侧插槽
const isCustomRightChunkScoped = computed(() => !!slots?.right);

// 滑块内容
const { scopeData, textData } = useRender(data);
const sliderSlot = computed(() => {
  let slot;
  // eslint-disable-next-line prefer-destructuring
  if (slots?.content) slot = slots.content(scopeData(dateFormat?.value))[0];
  else if (slots?.default)
    // eslint-disable-next-line prefer-destructuring
    slot = slots.default(scopeData(dateFormat?.value))[0];

  return slot && isSymbol(slot.type) ? undefined : slot;
});

// 左侧移动块内容
const leftChunkSlot = computed(() => {
  return slots?.left && slots.left(scopeData(dateFormat?.value))[0];
});

// 右侧移动块内容
const rightChunkSlot = computed(() => {
  return slots?.right && slots.right(scopeData(dateFormat?.value))[0];
});

const contentClass = computed(() => {
  return {
    'gt-slider-content': !customContentScoped.value,
    'gt-custom-slider-content': customContentScoped.value,
    'gt-noselect': true,
    'gt-text-nowrap': true
  };
});

const realAlignment = computed(() => {
  switch (alignment.value) {
    case 'center':
      return 'center';
    case 'right':
      return 'flex-end';
    default:
      return 'flex-start';
  }
});

const backgroundColor = computed(() => {
  return bgColor.value || 'var(--j-primary-color)';
});

const isProgress = computed(() => {
  return !customContentScoped.value && progress.value;
});

const contentStyle = computed(() => {
  return {
    justifyContent: realAlignment.value,
    borderRadius: '3px',
    padding: `0px ${
      customContentScoped.value || realAlignment.value === 'center' ? 0 : 20
    }px`
  };
});

const progressStyle = computed(() => {
  return {
    backgroundColor: backgroundColor.value,
    width: `${progressValue.value}%`,
    borderRadius: '3px',
    justifyContent: 'end'
  };
});

const progressBackStyle = computed(() => {
  return {
    filter: isProgress.value ? 'sepia(1)' : 'none',
    borderRadius: '3px',
    backgroundColor: !customContentScoped.value ? backgroundColor.value : ''
  };
});

const leftChunkClass = computed(() => {
  return {
    'gt-slider-ctrl__left': !isCustomLeftChunkScoped.value
  };
});

const rightChunkClass = computed(() => {
  return {
    'gt-slider-ctrl__right': !isCustomRightChunkScoped.value
  };
});

// 移动滑块样式函数
function getMoveChunkStyle(v: boolean) {
  return v ? { opacity: 1, height: '100%' } : { opacity: 0 };
}

const rightChunkStyle = computed(() =>
  isCustomRightChunkScoped.value
    ? {
        transition: 'all 0.2s',
        right: '0',
        ...getMoveChunkStyle(showCtrlChunk.value && resizeRight.value)
      }
    : {
        backgroundColor: backgroundColor.value,
        ...getMoveChunkStyle(showCtrlChunk.value && resizeRight.value)
      }
);

const leftChunkStyle = computed(() =>
  isCustomLeftChunkScoped.value
    ? {
        transition: 'all 0.2s',
        left: '0',
        ...getMoveChunkStyle(showCtrlChunk.value && resizeLeft.value)
      }
    : {
        backgroundColor: backgroundColor.value,
        ...getMoveChunkStyle(showCtrlChunk.value && resizeLeft.value)
      }
);

const sliderText = computed(() =>
  textData(label?.value, dateFormat?.value, emptyData.value)
);

const sliderStyle = computed(() => {
  return {
    width: `${sliderWidth.value}px`,
    left: `${sliderLeft.value}px`,
    backgroundColor:
      !customContentScoped.value && !progress.value ? backgroundColor.value : ''
    // cursor: canMove.value ? "ew-resize" : "not-allowed"
  };
});

const showCtrlChunk = ref(false);
const showProgressBtn = ref(false);

const { addShowDate, clearShowDateList } = useShowDate();

function onMouseEnter() {
  showProgressBtn.value = true;

  addShowDate(data.start);
  addShowDate(data.end);

  if (!canMove.value) return;
  showCtrlChunk.value = true;
}

function onMouseLeave() {
  showProgressBtn.value = false;

  clearShowDateList();

  if (!canMove.value) return;
  showCtrlChunk.value = false;
}

function onMouseDown(e: MouseEvent) {
  if (!canMove.value) return;
  sliderMoveHandle(e, 'move');
}

function onLeftChunkMouseDown(e: MouseEvent) {
  if (!canMove.value) return;
  sliderMoveHandle(e, 'left');
}

function onRightChunkMouseDown(e: MouseEvent) {
  if (!canMove.value) return;
  sliderMoveHandle(e, 'right');
}

const { IFMoveSlider, IFMoveProgress } = useRootEmit();
const { setHeaders } = useSetGanttHeader();

/**
 * 移动处理
 */
function sliderMoveHandle(e: MouseEvent, flag = '') {
  const srcX = e.pageX;
  const srcStartDate = createDate(data.start);
  const srcEndDate = createDate(data.end);
  const modifyArr = [data.data];

  document.onmousemove = e => {
    let targetX = e.pageX;
    // 如果鼠标离从左侧离开浏览器, 那么鼠标的位置停留在浏览器最左侧的位置, 也就是targetX = 0.
    if (targetX < 0) {
      targetX = 0;
    }

    const offset =
      ((targetX - srcX) / oneDayWidth.value) *
      getMillisecond(GtParam.headerUnit);

    if (flag === 'move' || flag === 'left') {
      data.setStart(
        createDate(getDateOffset(srcStartDate, offset)),
        GtParam.headerUnit,
        linkedResize.value,
        modifyArr
      );
    }

    if (flag === 'move' || flag === 'right') {
      data.setEnd(
        createDate(getDateOffset(srcEndDate, offset)),
        GtParam.headerUnit,
        linkedResize.value,
        modifyArr
      );
    }
  };

  document.onmouseup = () => {
    document.onmousemove = null;
    document.onmouseup = null;

    // 日期没有变动，不执行移动事件
    if (
      compareDate(data.start as Date, srcStartDate) === 'e' &&
      compareDate(data.end as Date, srcEndDate) === 'e'
    )
      return;

    IFMoveSlider(modifyArr, { start: srcStartDate, end: srcEndDate });
    setBetweenDate();
  };
}

function setBetweenDate() {
  // 左边界
  if (compareDate(data.start as Date, GtData.start as Date) === 'l') {
    GtData.setStart(data.start);
  }

  // 右边界
  if (compareDate(data.end as Date, GtData.end as Date) === 'r') {
    GtData.setEnd(data.end);
  }

  // 重新调整表头
  setHeaders();
}

function onProgressBtnMouseDown(e: MouseEvent) {
  if (!canMove.value) return;
  const srcX = e.pageX;
  const originProgress = data.progress ?? 0;

  document.onmousemove = e => {
    let targetX = e.pageX;
    // 如果鼠标离从左侧离开浏览器, 那么鼠标的位置停留在浏览器最左侧的位置, 也就是targetX = 0.
    if (targetX < 0) {
      targetX = 0;
    }

    const p = originProgress + (targetX - srcX) / sliderWidth.value;
    data.setProgress(p);
  };

  document.onmouseup = () => {
    document.onmousemove = null;
    document.onmouseup = null;

    // 抛出更新后的数据
    IFMoveProgress(data, originProgress);
  };
}
</script>

<template>
  <div
    class="gt-slider"
    :class="{ 'gt-shadow': !flat }"
    :style="sliderStyle"
    @mousedown.stop="onMouseDown"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <!-- 进度条 -->
    <div v-if="isProgress" :class="contentClass" :style="progressBackStyle" />
    <div v-if="isProgress" :class="contentClass" :style="progressStyle">
      <span style="color: gray; margin-right: 3px; transform: scale(0.7)">
        {{ progressValue }}%
      </span>
    </div>

    <!-- 内容 -->
    <div :class="contentClass" :style="contentStyle" @selectstart="() => false">
      <component :is="sliderSlot" v-if="sliderSlot" />
      <template v-else>
        {{ sliderText }}
      </template>
    </div>

    <!-- 左滑块 -->
    <div
      class="gt-slider-chunk"
      :class="leftChunkClass"
      :style="leftChunkStyle"
      @mousedown.stop="e => (resizeLeft ? onLeftChunkMouseDown(e) : null)"
    >
      <component :is="leftChunkSlot" v-if="isCustomLeftChunkScoped" />
    </div>

    <!-- 右滑块 -->
    <div
      class="gt-slider-chunk"
      :class="rightChunkClass"
      :style="rightChunkStyle"
      @mousedown.stop="e => (resizeRight ? onRightChunkMouseDown(e) : null)"
    >
      <component :is="rightChunkSlot" v-if="isCustomRightChunkScoped" />
    </div>

    <!-- 进度条拉块 -->
    <div
      v-if="isProgress && data.children.length === 0"
      class="gt-slider-progress-btn"
      :style="{ left: `${progressValue}%`, opacity: showProgressBtn ? 1 : 0 }"
      @mousedown.stop="onProgressBtnMouseDown"
    />
  </div>
</template>

<style scoped lang="scss">
@use 'sass:math';

$default-slider-border-radius: 3px;

@mixin slider-ctrl-chunk {
  z-index: 1;
  width: 10px;
  position: absolute;
  filter: brightness(0.8) invert(0.1);
  transition: all 0.2s;
}

.gt-slider {
  $h: 70%;
  position: absolute;
  height: $h;
  border-radius: $default-slider-border-radius;
  font-size: 12px;
  // top: ((100% - $h) / 2); // `/` 作为除号，在 2.0 即将被移除
  top: math.div(100% - $h, 2);

  .gt-slider-content {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    padding: 0;
    display: flex;
    align-items: center;
  }

  .gt-slider-chunk {
    position: absolute;
    z-index: 1;
  }

  .gt-slider-ctrl__left {
    @include slider-ctrl-chunk;
    left: 0;
    border-top-left-radius: $default-slider-border-radius;
    border-bottom-left-radius: $default-slider-border-radius;
  }

  .gt-slider-ctrl__right {
    @include slider-ctrl-chunk;
    right: 0;
    border-top-right-radius: $default-slider-border-radius;
    border-bottom-right-radius: $default-slider-border-radius;
  }

  .gt-custom-slider-content {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    padding: 0;

    & > * {
      height: 100%;
    }
  }

  .gt-slider-progress-btn {
    height: 100%;
    width: 2px;
    position: absolute;
    top: 0;
    background: darkslategray;
    border-color: darkslategray;
    opacity: 0;
    z-index: 2;
    transition: opacity 0.2s;

    &:hover {
      filter: brightness(1.2) invert(0.1);
      cursor: w-resize;
    }

    &:before {
      content: '';
      position: absolute;
      top: 0;
      right: -3px;
      border-style: solid;
      border-width: 4px;
      border-color: transparent;
      border-top-color: inherit;
    }

    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      right: -3px;
      border-style: solid;
      border-width: 4px;
      border-color: transparent;
      border-bottom-color: inherit;
    }
  }
}
</style>
