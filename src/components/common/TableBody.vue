<template>
  <table
    class="xg-table-body"
    :style="{ height: bodyHeight }"
    cellspacing="0"
    cellpadding="0"
    border="0"
  >
    <colgroup>
      <template v-for="(c, i) in $slotsBox.cols" :key="i">
        <col
          :width="
            getColumnWidth(c.props?.width ?? Variables.default.tableColumnWidth)
          "
        />
      </template>
    </colgroup>
    <tbody>
      <tr v-for="d in $data.flatData" :key="d.uuid" class="xg-table-row">
        <template v-for="(c, i) in $slotsBox.cols" :key="i">
          <component :is="c" :data="d" />
        </template>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import useData from '@/composables/useData';
import useSlotsBox from '@/composables/useSlotsBox';
import useStyle from '@/composables/useStyle';
import Variables from '@/constants/vars';
import { getColumnWidth } from '../column/util';

const { $slotsBox } = useSlotsBox();

const { $data } = useData();

const { bodyHeight } = useStyle();
</script>

<style lang="scss" scoped>
.xg-table-body {
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;

  .xg-table-row {
    background-color: darksalmon;
  }
}
</style>
