<template>
  <table class="xg-table-header" cellpadding="0" cellspacing="0" border="0">
    <colgroup>
      <template v-for="(c, i) in $slotsBox.tableHeaders.leafs" :key="i">
        <col :width="`${c.width}px`" />
      </template>
    </colgroup>
    <thead>
      <tr v-for="(r, trIndex) in $slotsBox.tableHeaders.headers" :key="trIndex">
        <th
          v-for="(c, i) in r"
          ref="headerRef"
          :key="i"
          :class="['xg-table-header-cell', 'cell-resizable']"
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
import { onMounted, ref } from 'vue';
const { $slotsBox } = useSlotsBox();

const { $styleBox } = useStyle();

const headerRef = ref<HTMLElement[]>([]);
onMounted(() => {
  headerRef.value.forEach(item => {
    item.addEventListener('pointerdown', e => {
      console.log(e);
    });
  });
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
  }

  .xg-table-header-cell.cell-resizable {
    pointer-events: none;

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
