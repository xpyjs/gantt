<template>
  <div ref="rootRef" class="gt-root" :style="rootStyle">
    <!-- 悬停操作按钮，外部遮罩一层，用于定位 -->
    <div v-if="showSettingBtn" class="gt-root-btn-mask">
      <JBtn
        icon="more"
        :size="btnSize"
        :style="opBtnStyle"
        @mouseenter.passive="onOpBtnMouseEnter"
        @mouseleave.passive="onOpBtnMouseLeave"
        @click.stop="onOpBtnClick"
      />
    </div>

    <!-- 拖动表头大小的位移线 -->
    <div
      class="gt-column-slider-line"
      :class="sliderLineClass"
      :style="sliderLineStyle"
    />

    <!-- 表格与甘特图之间的移动线 -->
    <div
      class="gt-table-slider-line"
      :style="{ left: `${tableWidth - 2}px` }"
      @mousedown="onResizeTableWidth"
    />

    <JTable :row-data="allData" @table-scroll="tableWheelHandle" />

    <JGantt :row-data="allData" @gantt-scroll="ganttWheelHandle" />

    <!-- 设置抽屉 -->
    <JDrawer :show="isShowOperationDrawer" />

    <!-- 遮罩层 -->
    <div :class="maskClass" @click.stop="onClickMask" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, useSlots } from 'vue';
import { useInitParam } from '@/composables/useParam';
import { useInitRootRef } from '@/composables/useRootRef';
import { Variables } from '@/constants/vars';
import rootProps from './rootProps';
import JTable from '@/components/table/index.vue';
import JGantt from '@/components/gantt/index.vue';
import JBtn from '@/components/common/Btn.vue';
import JDrawer from '@/components/common/Drawer.vue';
import useWheel from '@/composables/useWheel';
import useResize, {
  useBtnPosition,
  useResizeGanttObserver,
  useResizeTableColumn
} from '@/composables/useResize';
import useMask from '@/composables/useMask';
import { useDark } from '@/composables/useStyle';
import useInitEvent from '@/composables/event/useInitEvent';
import useExportEvent from '@/composables/event/useExportEvent';
import { useInitData } from '@/composables/data/useData';
// eslint-disable-next-line import/named
import { CustomCssProperties } from '@/typings/private/CSSProperties';

export default defineComponent({
  name: Variables.name.root
});
</script>

<script lang="ts" setup>
const props = defineProps(rootProps);
const emit = defineEmits<{
  (e: 'row-click', data: any): void;
  (e: 'row-dbl-click', data: any): void;
  (e: 'row-checked', state: boolean, data: any): void;
  (e: 'move-slider', data: any, old: { start: Date; end: Date }): void;
  (e: 'no-date-error'): void;
}>();
const slots = useSlots();

const {
  data,
  border,
  showExpand,
  expandAll,
  startKey,
  endKey,
  borderColor,
  primaryColor,
  showSettingBtn
} = toRefs(props);
// 绑定根元素
const { rootRef } = useInitRootRef();
// 初始化事件
useInitEvent(emit);
// 初始化参数
useInitParam(props, slots);
// 处理数据
const dataOptions = computed(() => {
  return {
    isExpand: showExpand.value ? expandAll.value : true,
    startLabel: startKey.value,
    endLabel: endKey.value
    // eslint-disable-next-line no-undef
  } as DataOptions;
});
const { allData } = useInitData(data, dataOptions);

const { tableWheelHandle, ganttWheelHandle, scrollBarHeight } = useWheel();
const { tableWidth, headerHeight } = useResize();

// 设置表头
useResizeGanttObserver();

const { colorSelectStr } = useDark();
const rootStyle = computed(() => {
  return {
    '--root-border': `${border.value}px`,
    '--table-width': `${tableWidth.value}px`,
    '--scrollbar-width': `${scrollBarHeight.value}px`,
    '--header-height': `${headerHeight.value}px`,
    '--j-content-border-color':
      borderColor.value || Variables.color.border[colorSelectStr.value],
    '--j-primary-color':
      primaryColor.value || Variables.color.primary[colorSelectStr.value],
    '--j-content-bg-color': Variables.color.background[colorSelectStr.value],
    '--j-text-color': Variables.color.text[colorSelectStr.value]
  } as CustomCssProperties;
});

const { sliderLineClass, sliderLineStyle, onResizeTableWidth } =
  useResizeTableColumn();
const { opBtnStyle, btnSize, onOpBtnMouseLeave, onOpBtnMouseEnter } =
  useBtnPosition();

const { maskClass, hideMask, showMask } = useMask();
function onClickMask() {
  hideMask();
  hideOperationDrawer();
}

const isShowOperationDrawer = ref(false);

function showOperationDrawer() {
  isShowOperationDrawer.value = true;
}

function hideOperationDrawer() {
  isShowOperationDrawer.value = false;
}

function onOpBtnClick() {
  showMask();
  showOperationDrawer();
}

// ***** 对外方法 ***** //
const { setSelected, jumpToDate, setHeaderUnit } = useExportEvent();
defineExpose({
  setSelected,
  jumpToDate,
  setHeaderUnit
});
</script>

<style scoped lang="scss">
@use 'sass:color';

.gt-root {
  width: calc(100% - var(--root-border) * 2);
  height: calc(100% - var(--root-border) * 2);
  border: var(--root-border) solid var(--j-content-border-color);
  overflow: hidden;
  font-size: 14px;
  color: var(--j-text-color);
  position: relative;
  display: flex;
  box-sizing: initial;
  background-color: blueviolet;

  .gt-root-btn-mask {
    position: absolute;
    width: calc(100% - var(--scrollbar-width));
    height: 100%;
    overflow: hidden;
    min-width: var(--table-width);
  }

  .gt-column-slider-line {
    width: 1px;
    height: 100%;
    border-right: 1px dotted var(--j-text-color);
    opacity: 0.5;
    position: absolute;
    z-index: 9;
  }

  .gt-table-slider-line {
    width: 2px;
    height: 100%;
    background-color: var(--j-content-border-color);
    position: absolute;
    z-index: 9;
    cursor: w-resize;
    transition: filter 0.2s;

    &:hover {
      box-shadow: 0px 0px 2px var(--j-content-border-color);
      filter: blur(1px) invert(1);
      opacity: 0.5;
    }
  }

  .gt-mask {
    width: 100%;
    height: 100%;
    z-index: 998;
    position: absolute;
    background-color: grey;
    opacity: 0.5;
    transition: all 0.2s;
  }

  .gt-mask-show {
    width: 100%;
    height: 100%;
    z-index: 998;
    position: absolute;
    background-color: grey;
    opacity: 0.5;
    transition: opacity 0.2s;
  }

  .gt-mask-hide {
    opacity: 0;
    transition: opacity 0.2s;
  }
}
</style>
