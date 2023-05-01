<template>
  <div
    class="xg-table-cell"
    :style="{
      // width: `${props.__index === 0 ? firstColumnWidth : realWidth}px`,
      width: `${realWidth}px`,
      ...$styleBox.getBorderColor()
    }"
  >
    <div
      class="cell"
      :style="{ lineHeight: `${rowHeight}px`, height: `${rowHeight}px` }"
    >
      <SelectionVue
        v-if="props.__index === 0"
        :data="data"
        :indent="20"
        :show-checkbox="$styleBox.showCheckbox"
      />

      <slot v-if="slots.default" v-bind="toRowData(props.data)" />

      <template v-else-if="props.prop">{{
        props.data?.data?.[props.prop]
      }}</template>
    </div>
  </div>
</template>

<script lang="ts">
import Variables from '@/constants/vars';
import columnProps from './props';
import { defineComponent, useSlots, computed, watch } from 'vue';
import useStyle from '@/composables/useStyle';
import useSlotsBox from '@/composables/useSlotsBox';
import SelectionVue from './selection.vue';
import useData from '@/composables/useData';
// import useData from '@/composables/useData';

export default defineComponent({
  name: Variables.name.column
});
</script>

<script lang="ts" setup>
const props = defineProps(columnProps);
const slots = useSlots();
watch(
  () => slots,
  (o, n) => {
    console.log(o, n);
  }
);

const { $styleBox, rowHeight } = useStyle();
const { $slotsBox, isMerge } = useSlotsBox();
const { toRowData } = useData();

const realWidth = computed(() => {
  let curWidth = $slotsBox.tableHeaders.leafs[props!.__index ?? 1].width;

  for (let i = (props.__index ?? 1) + 1; i < $slotsBox.cols.length; i++) {
    const col = $slotsBox.cols[i];

    if (isMerge(col.props?.merge, props.data!)) {
      curWidth += $slotsBox.tableHeaders.leafs[i].width;
    } else {
      break;
    }
  }

  return curWidth;
});
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
