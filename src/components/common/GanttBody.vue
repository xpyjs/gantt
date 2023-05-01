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

    <div class="xg-gantt-body-date-line"></div>

    <div class="xg-gantt-body-line-wrap"></div>
  </div>
</template>

<script lang="ts" setup>
import useGanttWidth from '@/composables/useGanttWidth';
import useInView from '@/composables/useInView';
import useSlotsBox from '@/composables/useSlotsBox';
import useStyle from '@/composables/useStyle';
import RowVue from './Row.vue';

const { $slotsBox } = useSlotsBox();
const { bodyHeight } = useStyle();
const { ganttWidth } = useGanttWidth();
const { inView } = useInView();
</script>

<style lang="scss" scoped>
.xg-gantt-body {
  position: relative;

  .xg-gantt-row {
    z-index: 99;
    // width: 100%;
    // background-color: darkkhaki;
    // position: absolute;
    // overflow: hidden;
    // border-bottom: 1px solid;
    // box-sizing: border-box;
  }

  .xg-gantt-body-date-line {
    z-index: 9;
    height: 100%;
    width: 20px;
    position: absolute;
    top: 0;
    left: 40px;
    background-color: aqua;
    opacity: 0.6;
  }

  .xg-gantt-body-line-wrap {
    width: 100%;
    height: 100%;
  }
}
</style>
