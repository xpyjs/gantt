<template>
  <td v-if="colspan > 0" class="xg-table-cell" :colspan="colspan">
    <div class="cell">
      <slot v-if="slots.default" v-bind="props.data?.data" />

      <template v-else-if="props.prop">{{
        props.data?.data?.[props.prop]
      }}</template>
    </div>
  </td>
</template>

<script lang="ts">
import Variables from '@/constants/vars';
import columnProps from './props';
import { defineComponent, ref, useSlots } from 'vue';

export default defineComponent({
  name: Variables.name.column
});
</script>

<script lang="ts" setup>
const props = defineProps(columnProps);
const slots = useSlots();

// TODO: 合并列通过这个实现
const colspan = ref(1);
</script>

<style lang="scss" scoped>
.xg-table-cell {
  box-sizing: border-box;
  position: relative;
  vertical-align: middle;
  text-overflow: ellipsis;

  .cell {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 20px;
    height: 20px;
    font-size: 14px;
  }
}
</style>
