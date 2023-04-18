<template>
  <div class="xg-table-body" :style="{ height: bodyHeight }">
    <div
      v-for="d in inView"
      :key="d.uuid"
      class="xg-table-row"
      :style="{
        top: `${d.flatIndex * rowHeight}px`,
        height: `${rowHeight}px`,
        ...$styleBox.getBorderColor()
      }"
    >
      <template
        v-for="(c, i) in $slotsBox.cols.filter(
          v => !isMerge(v.props?.merge, d as any)
        )"
        :key="i"
      >
        <component :is="c" :data="d" />
      </template>
    </div>
  </div>

  <div
    :style="{
      height: `${props.gap}px`,
      width: '100%'
    }"
  />
</template>

<script lang="ts" setup>
import useInView from '@/composables/useInView';
import useSlotsBox from '@/composables/useSlotsBox';
import useStyle from '@/composables/useStyle';

const props = defineProps<{ gap: number }>();

const { $slotsBox, isMerge } = useSlotsBox();
const { bodyHeight, rowHeight, $styleBox } = useStyle();
const { inView } = useInView();
</script>

<style lang="scss" scoped>
.xg-table-body {
  width: 100%;
  position: relative;

  .xg-table-row {
    width: 100%;
    position: absolute;
    background-color: darkkhaki;
    overflow: hidden;
    border-bottom: 1px solid;
    box-sizing: border-box;
  }
}
</style>
