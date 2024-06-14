<template>
  <th
    ref="headerRef"
    class="xg-table-header-cell"
    :style="{ 'border-color': $styleBox.borderColor }"
    :colspan="column.colSpan"
    :rowspan="column.rowSpan"
  >
    <component
      :is="column.node"
      __render-title
      :__render-title-label="column.label"
      :__render-title-props="titleProps"
    />

    <div
      v-if="!column.isLast"
      ref="resizeLineRef"
      class="xg-table-header-cell-resizable"
    ></div>
  </th>
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue';
import useDrag from '@/composables/useDrag';
import useSlotsBox from '@/composables/useSlotsBox';
import useStyle from '@/composables/useStyle';
import Variables from '@/constants/vars';

const props = defineProps({
  column: {
    type: Object,
    required: true
  }
});

const { $slotsBox } = useSlotsBox();
const { $styleBox } = useStyle();
const { onResizeTableColumn } = useDrag();

const curColumn = ref(props.column);
// 如果有children，取最后一个。children 可能有多层
while (curColumn.value.children?.length > 0) {
  curColumn.value =
    curColumn.value.children[curColumn.value.children.length - 1];
}

const index = curColumn.value.node.props.__index;

const headerRef = ref(null) as Ref<HTMLElement | null>;
const resizeLineRef = ref(null) as Ref<HTMLElement | null>;
onResizeTableColumn(resizeLineRef, {
  onEnd: x => {
    const headerLeft = headerRef.value?.offsetLeft ?? 0;

    $slotsBox.tableHeaders.leafs[index].width = Math.max(
      $slotsBox.tableHeaders.leafs[index].width + x - headerLeft,
      Variables.size.minTableColumnWidth
    );
  },

  preMove: x => {
    const headerLeft = headerRef.value?.offsetLeft ?? 0;
    if (
      $slotsBox.tableHeaders.leafs[index].width + x - headerLeft <
      Variables.size.minTableColumnWidth
    )
      return false;
    return true;
  }
});

const titleProps = props.column.isLeaf
  ? {
      prop: props.column.prop,
      label: props.column.label,
      level: props.column.level // 表头层级，从上到下，从1开始
    }
  : {
      label: props.column.label,
      level: props.column.level // 表头层级，从上到下，从1开始
    };
</script>

<style lang="scss">
.xg-table-header-cell {
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
  text-align: center;
  position: relative;
  box-sizing: border-box;
  border-bottom: 1px solid #e5e5e5;
  border-right: 1px solid #e5e5e5;
  padding: 0 12px;
  font-size: 14px;
}

.xg-table-header-cell-resizable {
  &::after {
    content: '';
    position: absolute;
    right: -5px;
    top: 0;
    bottom: 0;
    width: 10px;
    cursor: col-resize;
  }
}
</style>
