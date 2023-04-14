<template>
  <table class="xg-table-header" cellpadding="0" cellspacing="0" border="0">
    <colgroup>
      <template v-for="(c, i) in $slotsBox.cols" :key="i">
        <col
          :width="
            getColumnWidth(c.props?.width ?? Variables.default.tableColumnWidth)
          "
        />
      </template>
    </colgroup>
    <thead>
      <tr v-for="(r, trIndex) in $slotsBox.headers.headers" :key="trIndex">
        <th
          v-for="(c, i) in r"
          :key="i"
          class="xg-table-header-cell"
          :colspan="c.colSpan"
          :rowspan="c.rowSpan"
        >
          {{ c.node.props?.label || c.node.props?.prop }}
        </th>
      </tr>
    </thead>
  </table>
</template>

<script lang="ts" setup>
import useSlotsBox from '@/composables/useSlotsBox';
import Variables from '@/constants/vars';
import { getColumnWidth } from '../column/util';
const { $slotsBox } = useSlotsBox();
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

  .xg-table-header-cell {
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    text-align: left;
    position: relative;
    box-sizing: border-box;
  }
}
</style>
