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
      <tr v-for="(r, trIndex) in $slotsBox.tableHeaders.headers" :key="trIndex">
        <th
          v-for="(c, i) in r"
          :key="i"
          class="xg-table-header-cell"
          :style="{ ...$styleBox.getBorderColor() }"
          :colspan="c.colSpan"
          :rowspan="c.rowSpan"
        >
          {{ c.label }}
        </th>
      </tr>
    </thead>
  </table>
</template>

<script lang="ts" setup>
import useSlotsBox from '@/composables/useSlotsBox';
import useStyle from '@/composables/useStyle';
import Variables from '@/constants/vars';
import { getColumnWidth } from '../column/util';
const { $slotsBox } = useSlotsBox();

const { $styleBox } = useStyle();
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
  }
}
</style>
