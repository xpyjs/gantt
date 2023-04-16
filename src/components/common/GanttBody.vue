<template>
  <div
    class="xg-gantt-body"
    :style="{ height: bodyHeight, width: `${ganttWidth}px` }"
  >
    <div v-for="d in $data.flatData" :key="d.uuid" class="xg-gantt-row">
      <component :is="$slotsBox.slider" :data="d" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import useData from '@/composables/useData';
import useGanttWidth from '@/composables/useGanttWidth';
import useSlotsBox from '@/composables/useSlotsBox';
import useStyle from '@/composables/useStyle';
const { $slotsBox } = useSlotsBox();

const { $data } = useData();

const { bodyHeight } = useStyle();

const { ganttWidth } = useGanttWidth();
</script>

<style lang="scss" scoped>
.xg-gantt-body {
  background-color: darksalmon;

  .xg-gantt-row {
    width: 100%;
    height: 20px;
    background-color: darkkhaki;
    position: relative;
    overflow: hidden;
  }
}
</style>
