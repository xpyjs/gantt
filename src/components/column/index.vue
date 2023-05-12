<template>
  <div
    class="xg-table-cell"
    :style="{
      // width: `${props.__index === 0 ? firstColumnWidth : realWidth}px`,
      width: `${realWidth}px`,
      ...$styleBox.getBorderColor()
    }"
  >
    <div :style="{ lineHeight: `${rowHeight}px`, height: `${rowHeight}px` }">
      <SelectionVue v-if="props.__index === 0" :data="data" :indent="20" />

      <div
        :class="[
          'cell',
          {
            'cell-center': props.center,
            'cell-ellipsis': props.ellipsis
          },
          props.columnClass
        ]"
        :style="props.columnStyle"
      >
        <slot v-if="slots.default" v-bind="toRowData(props.data)" />

        <template v-else-if="props.prop">{{
          props.dateFormat
            ? formatDate(originData, props.dateFormat)
            : originData
        }}</template>
      </div>
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
import { formatDate } from '@/utils/date';

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
const { toRowData, getProp } = useData();

const originData = computed(() =>
  getProp(props.data!, props.prop, props.emptyData)
);

// #region 计算宽度
const { $slotsBox, isMerge } = useSlotsBox();

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
// #endregion
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
