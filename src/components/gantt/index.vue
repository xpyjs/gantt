<template>
  <div
    ref="ganttRef"
    class="gt-gantt"
    @wheel.passive="onMouseWheel"
    @DOMMouseScroll.passive="onMouseWheel"
    @scroll.passive="onMouseWheel"
  >
    <!-- 表头 -->
    <GanttHeader :style="{ width: `${ganttWidth}px` }" />

    <!-- 甘特内容 -->
    <div
      class="gt-gantt-row-wrap"
      :style="{
        width: `${ganttWidth}px`,
        height: `${rowHeight * rowData.length}px`,
        position: 'relative'
      }"
    >
      <RowWrap :data="rowData" :name="Variables.name.ganttRow" />

      <!-- 时间线 - 今天 -->
      <div v-if="showTodayLine" class="gt-today-line" :style="todayLineStyle" />

      <!-- 时间线 - 周末 -->
      <div
        v-for="item in weekendList"
        :key="item"
        class="gt-weekend-line"
        :style="weekendStyle(item)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Row } from "@/models/data/row";
import useResize from "@/composables/useResize";
import GanttHeader from "./Header.vue";
import RowWrap from "@/components/rowWrap/index.vue";
import { Variables } from "@/constants/vars";
import { useInitGanttRef } from "@/composables/useGanttRef";
import { useToday, useWeekend } from "@/composables/useDate";

defineProps<{ rowData: Array<Row> }>();

const emit = defineEmits<{
  (e: "gantt-scroll", event: UIEvent): void;
}>();

function onMouseWheel(e: UIEvent) {
  emit("gantt-scroll", e);
}

const { rowHeight, ganttWidth } = useResize();
const { showTodayLine, todayLineStyle } = useToday();
const { weekendList, weekendStyle } = useWeekend();

const { ganttRef } = useInitGanttRef();
</script>

<style scoped lang="scss">
.gt-gantt {
  z-index: 2;
  overflow: auto;
  position: relative;
  width: calc(100% - var(--table-width));
  height: 100%;

  .gt-gantt-row-wrap {
    min-height: 100px;
    z-index: 2;
    position: relative;
  }

  .gt-weekend-line {
    top: 0;
    position: absolute;
    opacity: 0.3;
    pointer-events: none;
    background-color: lightgrey;
  }

  .gt-today-line {
    top: 0;
    position: absolute;
    z-index: 6;
    opacity: 0.5;
    pointer-events: none;
    background-color: lightblue;
  }
}
</style>
