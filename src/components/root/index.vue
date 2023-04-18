<template>
  <div
    class="xg-root"
    :style="{ ...$styleBox.getBorder(), ...$styleBox.getBorderColor() }"
  >
    <!-- 左侧表格 -->
    <sync-scroll-container
      ref="tableRef"
      vertical
      class="table-container"
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

    <div class="mid-separate-line" />

    <!-- 右侧甘特 -->
    <sync-scroll-container
      ref="ganttRef"
      vertical
      horizontal
      class="gantt-container"
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
import TableHeader from '@/components/common/TableHeader.vue';
import TableBody from '@/components/common/TableBody.vue';
import GanttHeader from '@/components/common/GanttHeader.vue';
import GanttBody from '@/components/common/GanttBody.vue';
import useSlotsBox from '@/composables/useSlotsBox';
import useTableWidth from '@/composables/useTableWidth';
import { uuid } from '@/utils/common';
import { getCurrentInstance, onMounted, onUpdated, ref, toRefs } from 'vue';
import rootProps from './rootProps';
import useData from '@/composables/useData';
import useStyle from '@/composables/useStyle';
import { useResizeObserver } from '@vueuse/core';
import useParam from '@/composables/useParam';
import useGanttHeader from '@/composables/useGanttHeader';

const containerId = uuid(10);
const props = defineProps(rootProps);

// #region 获取表格下方的滚动条 gap
const tableRef = ref<any>(null);
const ganttRef = ref<any>(null);
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
onMounted(() => {
  $param.rootHeight = Math.max(
    ganttRef.value.$el.offsetHeight,
    ganttRef.value.$el.clientHeight
  );
});
// #endregion

// #region 处理样式参数
const { setStyles, $styleBox } = useStyle();
setStyles(props);
// #endregion

// #region 处理插槽内容
const { setSlots } = useSlotsBox();

setSlots(props.slots);
// #endregion

// #region 获取表格宽度
const { tableWidth } = useTableWidth();
// #endregion

// #region 处理数据
const { data } = toRefs(props);

const { initData } = useData();
initData(data);
// #endregion

// #region 监听 gantt 尺寸变化，表头和宽度需要重新渲染
const { setGanttHeaders } = useGanttHeader();
onMounted(() => useResizeObserver(ganttRef.value?.$el, setGanttHeaders));
// #endregion

console.log('.....root', getCurrentInstance());
</script>

<style scoped lang="scss">
.xg-root {
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.table-container {
  height: 100%;
  display: inline-block;
  position: relative;
}

.mid-separate-line {
  width: 3px;
  height: 100%;
  display: inline-block;
  background-color: black;
}

.gantt-container {
  height: 100%;
  display: inline-block;
}
</style>
