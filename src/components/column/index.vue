<template>
  <div
    v-if="props.__index === 0 || !isMerge($slotsBox.cols[props.__index ?? 1].props?.merge, props.data!)"
    :key="`${props.data!.uuid}_${props.__index}`"
    class="xg-table-cell"
    :style="{
      width: `${realWidth}px`,
      'border-color': $styleBox.borderColor
    }"
  >
    <div :style="{ lineHeight: `${rowHeight}px`, height: `${rowHeight}px` }">
      <div v-if="props.__index === 0" ref="selectionRef" class="prefix">
        <SelectionVue :data="data" :indent="20" />
      </div>

      <div
        :class="[
          'cell',
          {
            'cell-center': props.center,
            'cell-ellipsis': props.ellipsis
          },
          props.columnClass
        ]"
        :style="[props.columnStyle, { width: `calc(100% - ${prefixWidth}px` }]"
      >
        <slot
          v-if="isValidSlots(slots.default, props.data)"
          v-bind="toRowData(props.data)"
        />

        <template v-else-if="props.prop || props.label">{{
          props.dateFormat
            ? day(originData).format(props.dateFormat)
            : originData
        }}</template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Variables from '@/constants/vars';
import columnProps from './props';
import {
  defineComponent,
  useSlots,
  computed,
  ref,
  onMounted,
  watch,
  nextTick
} from 'vue';
import useStyle from '@/composables/useStyle';
import useSlotsBox from '@/composables/useSlotsBox';
import SelectionVue from './selection.vue';
import useData from '@/composables/useData';
import { day } from '@/utils/date';

export default defineComponent({
  name: Variables.name.column
});
</script>

<script lang="ts" setup>
const props = defineProps(columnProps);
const slots = useSlots();

const { $styleBox, rowHeight } = useStyle();
const { toRowData, getProp } = useData();

const originData = computed(() =>
  getProp(props.data!, props.prop, props.emptyData)
);

// #region 计算宽度
const { $slotsBox, isMerge, isValidSlots } = useSlotsBox();

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

const selectionRef = ref(null) as any;
const prefixWidth = ref(0);
onMounted(() => {
  prefixWidth.value = selectionRef.value?.clientWidth ?? 0;
});

watch(
  () => [$styleBox.showCheckbox, $styleBox.showExpand],
  async () => {
    await nextTick();
    prefixWidth.value = selectionRef.value?.clientWidth ?? 0;
  }
);
</script>

<style lang="scss">
@import './style.scss';
</style>
