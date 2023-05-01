<template>
  <div
    class="xg-gantt-body"
    :style="{ height: bodyHeight, width: `${ganttWidth}px` }"
  >
    <template v-for="d in inView" :key="d.uuid">
      <RowVue :data="d" class="xg-gantt-row">
        <component :is="$slotsBox.slider" :data="d" />
      </RowVue>
    </template>

    <div
      v-for="(l, i) in [5, 6, 10, 11]"
      :key="i"
      class="xg-gantt-body-date-line weekend"
      :style="{
        width: `${ganttColumnWidth}px`,
        left: `${ganttColumnWidth * l}px`,
        backgroundColor: '#ccc'
      }"
    ></div>

    <div
      v-if="showToday"
      class="xg-gantt-body-date-line today"
      :style="{
        width: `${ganttColumnWidth}px`,
        left: `${todayLeft}px`,
        backgroundColor: '#87CEFA'
      }"
    ></div>

    <div class="xg-gantt-body-line-wrap"></div>
  </div>
</template>

<script lang="ts" setup>
import useGanttWidth from '@/composables/useGanttWidth';
import useInView from '@/composables/useInView';
import useSlotsBox from '@/composables/useSlotsBox';
import useStyle from '@/composables/useStyle';
import useToday from '@/composables/useToday';
import RowVue from './Row.vue';

const { $slotsBox } = useSlotsBox();
const { bodyHeight } = useStyle();
const { ganttWidth, ganttColumnWidth } = useGanttWidth();
const { inView } = useInView();
const { todayLeft, showToday } = useToday();
</script>

<style lang="scss" scoped>
.xg-gantt-body {
  position: relative;
  // background-color: darkkhaki;
  z-index: 9;

  .xg-gantt-row {
    z-index: 99;
    // width: 100%;
    // position: absolute;
    // overflow: hidden;
    // border-bottom: 1px solid;
    // box-sizing: border-box;
  }

  .xg-gantt-body-date-line {
    z-index: 9;
    height: 100%;
    position: absolute;
    top: 0;
    opacity: 0.6;
  }

  .xg-gantt-body-line-wrap {
    width: 100%;
    height: 100%;
  }
}
</style>
