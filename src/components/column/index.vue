<template>
  <!-- <td v-if="colspan > 0" class="xg-table-cell" :colspan="colspan">
    <div class="cell">
      <slot v-if="slots.default" v-bind="props.data?.data" />

      <template v-else-if="props.prop">{{
        props.data?.data?.[props.prop]
      }}</template>
    </div>
  </td> -->

  <div
    class="xg-table-cell"
    :style="{
      width: getColumnWidth(props?.width ?? Variables.default.tableColumnWidth),
      ...$styleBox.getBorderColor()
    }"
  >
    <div
      class="cell"
      :style="{ lineHeight: `${rowHeight}px`, height: `${rowHeight}px` }"
    >
      <slot v-if="slots.default" v-bind="props.data?.data" />

      <template v-else-if="props.prop">{{
        props.data?.data?.[props.prop]
      }}</template>
    </div>
  </div>
</template>

<script lang="ts">
import Variables from '@/constants/vars';
import columnProps from './props';
import { defineComponent, useSlots } from 'vue';
import { getColumnWidth } from './util';
import useStyle from '@/composables/useStyle';

export default defineComponent({
  name: Variables.name.column
});
</script>

<script lang="ts" setup>
const props = defineProps(columnProps);
const slots = useSlots();

const { $styleBox, rowHeight } = useStyle();

// TODO: 合并列通过这个实现
// const colspan = ref(1);
</script>

<style lang="scss" scoped>
.xg-table-cell {
  height: 100%;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  border-right: 1px solid;

  .cell {
    width: calc(100% - 12px);
    overflow: hidden;
    white-space: nowrap;
    font-size: 14px;
    vertical-align: middle;
    text-overflow: ellipsis;
    padding: 0 6px;
  }
}
</style>
