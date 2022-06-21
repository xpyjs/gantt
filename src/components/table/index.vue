<template>
  <div
    ref="tableRef"
    class="gt-table"
    @wheel.passive="onMouseWheel"
    @DOMMouseScroll.passive="onMouseWheel"
  >
    <!-- 表头 -->
    <TableHeader />

    <!-- 表格内容 -->
    <div
      class="gt-table-row-wrap"
      :style="{
        height: `${rowHeight * rowData.length}px`,
        position: 'relative'
      }"
    >
      <RowWrap :data="rowData" :name="Variables.name.tableRow" />
    </div>

    <!-- 底部占位条，对齐甘特图的滚动条 -->
    <div class="gt-table-bottom-bar" />
  </div>
</template>

<script lang="ts" setup>
import { Row } from '@/models/data/row';
import useResize from '@/composables/useResize';
import RowWrap from '@/components/rowWrap/index.vue';
import { Variables } from '@/constants/vars';
import { useInitTableRef } from '@/composables/useTableRef';
import TableHeader from './Header.vue';

defineProps<{
  rowData: Array<Row>;
}>();

const emit = defineEmits<{
  (e: 'table-scroll', event: WheelEvent): void;
}>();

const { rowHeight } = useResize();

function onMouseWheel(e: WheelEvent) {
  e.stopPropagation();
  emit('table-scroll', e);
}

const { tableRef } = useInitTableRef();
</script>

<style scoped lang="scss">
.gt-table {
  z-index: 5;
  position: relative;
  overflow: hidden;
  width: var(--table-width);

  .gt-table-row-wrap {
    width: 100%;
    position: relative;
    background-color: var(--x-content-bg-color);
  }

  .gt-table-bottom-bar {
    height: var(--scrollbar-width);
  }
}
</style>
