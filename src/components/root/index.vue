<template>
  <div
    ref="rootRef"
    :class="[
      'xg-root',
      { 'xg-root-dragging': mousedown, 'xg-root__dark': isDark }
    ]"
    :style="[
      $styleBox.getBorder(),
      { 'border-color': $styleBox.borderColor },
      { '--primary-color': $styleBox.primaryColor }
    ]"
  >
    <!-- 左侧表格 -->
    <sync-scroll-container
      ref="tableRef"
      vertical
      class="xg-table-container"
      :style="{ width: tableWidth + 'px' }"
      hide-scroll
      disable-horizontal
      :group="containerId"
    >
      <!-- 表头 -->
      <TableHeader />

      <!-- 表内容 -->
      <TableBody :gap="scrollGapSize" />
    </sync-scroll-container>

    <!-- 中分线 -->
    <div
      ref="midLineRef"
      :class="[
        'xg-mid-separate-line',
        { 'xg-mid-separate-line__dark': isDark }
      ]"
      :style="{ height: separateLineHeight + 'px' }"
    />
    <!-- 移动示意线 -->
    <div
      v-show="showLine"
      class="xg-move-line"
      :style="{ left: lineLeft + 'px' }"
    />

    <!-- 右侧甘特 -->
    <sync-scroll-container
      ref="ganttRef"
      vertical
      horizontal
      class="xg-gantt-container"
      :group="containerId"
      :style="{ width: `calc(100% - ${tableWidth}px - 3px)` }"
    >
      <!-- 甘特头 -->
      <GanttHeader />

      <!-- 甘特内容 -->
      <GanttBody />
    </sync-scroll-container>
  </div>
</template>

<script lang="ts" setup>
import SyncScrollContainer from '@/components/container/SyncScrollContainer.vue';
import TableHeader from '@/components/container/TableHeader.vue';
import TableBody from '@/components/container/TableBody.vue';
import GanttHeader from '@/components/container/GanttHeader.vue';
import GanttBody from '@/components/container/GanttBody.vue';
import useSlotsBox from '@/composables/useSlotsBox';
import useTableWidth from '@/composables/useTableWidth';
import { uuid } from '@/utils/common';
import {
  DefineComponent,
  nextTick,
  onMounted,
  onUpdated,
  Ref,
  ref,
  toRefs,
  watch
} from 'vue';
import rootProps from './rootProps';
import useData from '@/composables/useData';
import useStyle from '@/composables/useStyle';
import { useResizeObserver } from '@vueuse/core';
import useParam from '@/composables/useParam';
import useGanttHeader from '@/composables/useGanttHeader';
import useDrag from '@/composables/useDrag';
import useRoot from '@/composables/useRoot';
import useLinks from '@/composables/useLinks';
import Variables from '@/constants/vars';
import useExport from '@/composables/useExport';
import useElement from '@/composables/useElement';
import { setLocale } from '@/utils/date';
import useStore from '@/store';

const containerId = uuid(10);
const props = defineProps(rootProps);

// 本地化
watch(
  () => props.locale,
  () => setLocale(props.locale),
  {
    immediate: true
  }
);
// setLocale(props.locale);

// #region 挂载实例
const { rootRef } = useRoot();
// #endregion

// #region 获取表格下方的滚动条 gap
const tableRef = ref<DefineComponent | null>(null);
const { ganttRef } = useElement();
const scrollGapSize = ref(0);

function getScrollGapSize() {
  if (tableRef.value && ganttRef.value) {
    scrollGapSize.value = Math.abs(
      Math.min(
        ganttRef.value.$el.offsetHeight,
        ganttRef.value.$el.clientHeight
      ) - tableRef.value.$el.offsetHeight
    );
  }
}
onMounted(getScrollGapSize);
onUpdated(getScrollGapSize);
// #endregion

// #region 得到组件高度，并保存
const { $param } = useParam();
const store = useStore();
const separateLineHeight = ref(0);
onMounted(() => {
  const getHeight = () =>
    Math.max(
      ganttRef.value!.$el.offsetHeight,
      ganttRef.value!.$el.clientHeight
    );

  $param.rootHeight = getHeight();
  separateLineHeight.value = getHeight();

  // 切换数据时，如果没有固定高度，那么整个高度应该随之变化。rootHeight 会决定渲染行数
  watch(
    () => props.data,
    val => {
      if (val.length !== store.$data.length) {
        $param.rootHeight = getHeight();
        nextTick(() => {
          separateLineHeight.value = getHeight();
        });
      }
    }
  );
});
// #endregion

// #region 处理样式参数
const { setStyles, $styleBox, isDark } = useStyle();
setStyles(props);
// #endregion

// #region 处理插槽内容
const { setSlots, $slotsBox } = useSlotsBox();

setSlots(props.slots);
// #endregion

// #region 获取表格宽度
const { tableWidth } = useTableWidth();
// #endregion

// #region 初始化各种数据
const { data, links } = toRefs(props);

const { initData } = useData();
initData(data, props);

const { initLinks } = useLinks();
initLinks(links);
// #endregion

// #region 监听 gantt 尺寸变化，表头和宽度需要重新渲染
const { setGanttHeaders } = useGanttHeader();
onMounted(() => useResizeObserver(ganttRef.value?.$el, setGanttHeaders));
// #endregion

// #region 加载示意线
const { showLine, lineLeft, onResizeTableColumn, mousedown } = useDrag();

const midLineRef = ref(null) as Ref<HTMLElement | null>;
onResizeTableColumn(midLineRef, {
  onEnd: x => {
    $slotsBox.tableHeaders.leafs[
      $slotsBox.tableHeaders.leafs.length - 1
    ].width = Math.max(
      $slotsBox.tableHeaders.leafs[$slotsBox.tableHeaders.leafs.length - 1]
        .width + x,
      Variables.size.minTableColumnWidth
    );
  },

  preMove: (x, clientX) => {
    const tableRect = tableRef.value?.$el.getBoundingClientRect();
    const ganttRect = ganttRef.value?.$el.getBoundingClientRect();

    if (
      $slotsBox.tableHeaders.leafs[$slotsBox.tableHeaders.leafs.length - 1]
        .width +
        x <
      Variables.size.minTableColumnWidth
    )
      return false;

    if (clientX < tableRect.left) {
      return false;
    }

    if (clientX > ganttRect.right - 100) {
      return false;
    }

    return true;
  }
});
// #endregion

// console.log('.....root', getCurrentInstance());

// #region 暴露方法
const exports = useExport();
defineExpose(exports);
// #endregion
</script>

<style lang="scss">
.xg-root {
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid #e5e5e5;
  text-align: left !important;

  transition: background-color 0.1s, color 0.1s, border-color 0.1s;

  .xg-table-container {
    height: 100%;
    display: inline-block;
    position: relative;
    vertical-align: top;
  }

  .xg-mid-separate-line {
    width: 3px;
    height: 100%;
    max-height: 100%;
    display: inline-block;
    position: relative;
    background-color: #e5e5e5;
    transition: background-color 0.1s, box-shadow 0.1s;
    cursor: col-resize;
    z-index: 11;

    &:hover {
      background-color: #d5d5d5;
      box-shadow: 0 0 10px #d5d5d5;
    }

    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 10px;
    }
  }

  .xg-mid-separate-line__dark {
    background-color: #6e7074;

    &:hover {
      background-color: #87898d;
      box-shadow: 0 0 10px #87898d;
    }
  }

  .xg-move-line {
    position: absolute;
    top: 0;
    height: 100%;
    width: 0px;
    z-index: 100;
    border-left: 1px dashed #d5d5d5;
  }

  .xg-gantt-container {
    height: 100%;
    display: inline-block;
    vertical-align: top;
  }
}

.xg-root__dark {
  color: #fff;
  background-color: #303133;
}

.xg-root-dragging {
  user-select: none;
}
</style>
