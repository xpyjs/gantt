<template>
  <div
    class="xg-gantt-body"
    :style="{ height: bodyHeight, width: `${ganttWidth}px` }"
  >
    <div
      v-for="d in inView"
      :key="d.uuid"
      class="xg-gantt-row"
      :style="{
        top: `${d.flatIndex * rowHeight}px`,
        height: `${rowHeight}px`,
        ...$styleBox.getBorderColor()
      }"
    >
      <component :is="$slotsBox.slider" :data="d" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import useGanttWidth from '@/composables/useGanttWidth';
import useInView from '@/composables/useInView';
import useSlotsBox from '@/composables/useSlotsBox';
import useStyle from '@/composables/useStyle';

const { $slotsBox } = useSlotsBox();
const { bodyHeight, $styleBox, rowHeight } = useStyle();
const { ganttWidth } = useGanttWidth();
const { inView } = useInView();
</script>

<style lang="scss" scoped>
.xg-gantt-body {
  position: relative;

  .xg-gantt-row {
    width: 100%;
    background-color: darkkhaki;
    position: absolute;
    overflow: hidden;
    border-bottom: 1px solid;
    box-sizing: border-box;
  }
}
</style>
