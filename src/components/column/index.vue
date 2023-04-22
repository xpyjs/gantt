<template>
  <div
    class="xg-table-cell"
    :style="{
      width: `${realWidth}px`,
      ...$styleBox.getBorderColor()
    }"
  >
    <div
      class="cell"
      :style="{ lineHeight: `${rowHeight}px`, height: `${rowHeight}px` }"
    >
      <div class="level-block" :style="{ width: `${data!.level * 20}px` }" />

      <div
        v-if="props.__index === 0 && !!data?.children?.length"
        :class="['expand-icon', { 'expand-icon__expanded': data?.isExpand }]"
        @click="
          () => {
            data?.setExpand(!data.isExpand);
            $data.updateFlatData();
          }
        "
      >
        <svg
          t="1682094638676"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1386"
          :width="`${rowHeight / 2}px`"
          :height="`${rowHeight / 2}px`"
        >
          <path
            d="M384 210.773333l278.613333 278.613334a32 32 0 0 1 0 45.226666L384 813.226667 338.773333 768l256-256-256-256L384 210.773333z"
            p-id="1387"
            fill="#9f9f9f"
          ></path>
        </svg>
      </div>

      <div
        v-else
        class="expand-icon"
        :style="{ width: `${rowHeight / 2}px` }"
      />

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
import { defineComponent, useSlots, computed } from 'vue';
import useStyle from '@/composables/useStyle';
import useSlotsBox from '@/composables/useSlotsBox';
import useData from '@/composables/useData';

export default defineComponent({
  name: Variables.name.column
});
</script>

<script lang="ts" setup>
const props = defineProps(columnProps);
const slots = useSlots();
const { $styleBox, rowHeight } = useStyle();
const { $slotsBox, isMerge } = useSlotsBox();

const { $data } = useData();

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
// TODO: 合并列通过这个实现
// const colspan = ref(1);
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
