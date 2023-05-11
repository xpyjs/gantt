<template>
  <div
    class="xg-gantt-body"
    :style="{ height: bodyHeight, width: `${ganttWidth}px` }"
  >
    <!-- 滑动条 -->
    <template v-for="d in inView" :key="d.uuid">
      <RowVue :data="d" class="xg-gantt-row">
        <component :is="$slotsBox.slider" :data="d" />
      </RowVue>
    </template>

    <!-- 连线 -->
    <svg class="xg-gantt-body-line-wrap" :style="{ width: `${ganttWidth}px` }">
      <!-- <path stroke="red" fill="transparent" d="M 200 2 H 400 V 102"></path> -->
      <LinkPath v-for="link in $links.links" :key="link.uuid" :link="link" />
    </svg>

    <!-- 周末 -->
    <template v-for="(date, i) in ganttHeader.dates">
      <div
        v-if="date.isWeekend()"
        :key="i"
        class="xg-gantt-body-date-line weekend"
        :style="{
          width: `${ganttColumnWidth}px`,
          left: `${ganttColumnWidth * i}px`,
          backgroundColor: '#ccc'
        }"
      ></div>
    </template>

    <!-- 今天 -->
    <div
      v-if="showToday"
      class="xg-gantt-body-date-line today"
      :style="{
        width: `${ganttColumnWidth}px`,
        left: `${todayLeft}px`,
        backgroundColor: '#87CEFA'
      }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import useGanttHeader from '@/composables/useGanttHeader';
import useGanttWidth from '@/composables/useGanttWidth';
import useInView from '@/composables/useInView';
import useSlotsBox from '@/composables/useSlotsBox';
import useStyle from '@/composables/useStyle';
import useToday from '@/composables/useToday';
import RowVue from './Row.vue';
import LinkPath from './LinkPath.vue';
import useLinks from '@/composables/useLinks';

const { $slotsBox } = useSlotsBox();
const { bodyHeight } = useStyle();
const { ganttWidth, ganttColumnWidth } = useGanttWidth();
const { inView } = useInView();
const { todayLeft, showToday } = useToday();
const { ganttHeader } = useGanttHeader();
const { $links } = useLinks();
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
    z-index: 2;
    height: 100%;
    position: absolute;
    top: 0;
    opacity: 0.6;
  }

  .xg-gantt-body-line-wrap {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 5;
  }
}
</style>
