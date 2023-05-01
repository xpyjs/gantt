<template>
  <table
    ref="tableRef"
    class="xg-table-header"
    :style="{ height: `${$param.headerHeight}px` }"
    cellpadding="0"
    cellspacing="0"
    border="0"
  >
    <colgroup>
      <template v-for="(c, i) in $slotsBox.tableHeaders.leafs" :key="i">
        <col :width="c.width" />
      </template>
    </colgroup>
    <thead>
      <tr v-for="(r, trIndex) in $slotsBox.tableHeaders.headers" :key="trIndex">
        <TableHeaderTh
          v-for="(c, i) in r"
          :key="i"
          :column="c"
          @resize="onResize"
        />
      </tr>
    </thead>
  </table>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue';
import useSlotsBox from '@/composables/useSlotsBox';
import useParams from '@/composables/useParam';
import TableHeaderTh from './TableHeaderTh.vue';
import Variables from '@/constants/vars';

const { $slotsBox } = useSlotsBox();

const { $param } = useParams();
const tableRef = ref<HTMLElement | null>(null);
const onResize = () => {
  nextTick(() => {
    const table = tableRef.value;
    $param.headerHeight = table?.clientHeight ?? Variables.default.headerHeight;
  });
};
</script>

<style lang="scss" scoped>
.xg-table-header {
  width: 100%;
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
