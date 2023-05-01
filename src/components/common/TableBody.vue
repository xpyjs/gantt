<template>
  <div class="xg-table-body" :style="{ height: bodyHeight }">
    <template v-for="d in inView" :key="d.uuid">
      <RowVue class="xg-table-row" :data="d">
        <template
          v-for="(c, i) in $slotsBox.cols.filter(
            v => !isMerge(v.props?.merge, d)
          )"
          :key="i"
        >
          <component :is="c" :data="d" />
        </template>
      </RowVue>
    </template>
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
import RowVue from './Row.vue';

const props = defineProps<{ gap: number }>();

const { $slotsBox, isMerge } = useSlotsBox();
const { bodyHeight } = useStyle();
const { inView } = useInView();
</script>

<style lang="scss" scoped>
.xg-table-body {
  width: 100%;
  position: relative;

  .xg-table-row {
  }
}
</style>
