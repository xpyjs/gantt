<template>
  <th
    ref="headerRef"
    :class="[
      'xg-table-header-cell',
      {
        'cell-resizable': !props.column.isLast
      }
    ]"
    :style="{ ...$styleBox.getBorderColor() }"
    :colspan="props.column.colSpan"
    :rowspan="props.column.rowSpan"
  >
    {{ props.column.label }}
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

const column = ref(props.column);
// 如果有children，取最后一个。children 可能有多层
while (column.value.children?.length > 0) {
  column.value = column.value.children[column.value.children.length - 1];
}

const index = column.value.node.props.__index;

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

<style lang="scss" scoped>
.xg-table-header {
  width: 100%;
  height: 80px;
  background-color: blueviolet;
  table-layout: fixed;
  border-collapse: separate;
  top: 0;
  position: sticky;
  z-index: 10;
  overflow: hidden;

  .xg-table-header-cell {
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    text-align: left;
    position: relative;
    box-sizing: border-box;
    border-bottom: 1px solid;
    border-right: 1px solid;
    padding: 0 20px;
    font-size: 14px;
    pointer-events: none;
  }

  .cell-resizable {
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
}
</style>
