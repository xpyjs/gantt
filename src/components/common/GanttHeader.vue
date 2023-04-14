<template>
  <table class="xg-gantt-header" cellpadding="0" cellspacing="0" border="0">
    <colgroup>
      <template v-for="i in 100" :key="i">
        <col width="30px" />
      </template>
    </colgroup>
    <thead>
      <tr>
        <th
          v-for="i in 10"
          :key="i"
          class="xg-gantt-header-cell"
          :style="{ ...$styleBox.getBorderColor() }"
          colspan="10"
          rowspan="1"
        >
          {{ i }}
        </th>
      </tr>
      <tr>
        <th
          v-for="i in 100"
          :key="i"
          class="xg-gantt-header-cell"
          :style="{ ...$styleBox.getBorderColor() }"
          colspan="1"
          rowspan="1"
        >
          {{ i }}
        </th>
      </tr>
    </thead>
  </table>
</template>

<script lang="ts" setup>
import useStyle from '@/composables/useStyle';

const { $styleBox } = useStyle();
</script>

<style lang="scss" scoped>
.xg-gantt-header {
  width: 100%;
  height: 80px;
  background-color: blueviolet;
  table-layout: fixed;
  border-collapse: separate;
  top: 0;
  position: sticky;
  z-index: 10;
  white-space: nowrap;
  overflow: hidden;

  .xg-gantt-header-cell {
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    text-align: center;
    position: relative;
    box-sizing: border-box;
    border-bottom: 1px solid;
    border-right: 1px solid;
  }
}
</style>
