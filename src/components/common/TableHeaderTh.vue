<template>
  <th
    ref="headerRef"
    :class="[
      'xg-table-header-cell',
      {
        'xg-table-header-cell-resizable': !column.isLast
      }
    ]"
    :style="{ 'border-color': $styleBox.borderColor }"
    :colspan="column.colSpan"
    :rowspan="column.rowSpan"
  >
    {{ column.label }}
  </th>
</template>

<script lang="ts" setup>
import useDrag from '@/composables/useDrag';
import useSlotsBox from '@/composables/useSlotsBox';
import useStyle from '@/composables/useStyle';
import Variables from '@/constants/vars';
import { Ref, ref } from 'vue';

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
onResizeTableColumn(headerRef, {
  onEnd: x => {
    $slotsBox.tableHeaders.leafs[index].width = Math.max(
      $slotsBox.tableHeaders.leafs[index].width + x,
      Variables.size.minTableColumnWidth
    );
  },

  preMove: (x, clientX) => {
    if (
      $slotsBox.tableHeaders.leafs[index].width + x <
      Variables.size.minTableColumnWidth
    )
      return false;
    return true;
  }
});
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
  pointer-events: none;
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
    pointer-events: auto;
  }
}
</style>
