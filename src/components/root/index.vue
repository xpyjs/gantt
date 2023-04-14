<template>
  <div class="xg-root">
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
      <TableBody />

      <div
        :style="{
          height: `${scrollGapSize}px`
        }"
      />
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
import { onMounted, onUpdated, ref, toRefs, watch } from 'vue';
import rootProps from './rootProps';
import useData from '@/composables/useData';

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

// #region 处理插槽内容
const { setSlots } = useSlotsBox();

setSlots(props.slots);
// #endregion

// #region 处理数据
const { data } = toRefs(props);

const { initData, updateData } = useData();
initData(data.value);

watch(
  () => data,
  val => {
    // 更新数据
    updateData(val.value);
  },
  { deep: true }
);
// #endregion

// #region 获取表格宽度
const { tableWidth } = useTableWidth();
// #endregion
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
