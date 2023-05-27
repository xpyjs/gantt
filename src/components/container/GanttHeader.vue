<template>
  <table
    ref="ganttHeaderRef"
    class="xg-gantt-header"
    :style="{ height: `${$param.headerHeight}px` }"
    cellpadding="0"
    cellspacing="0"
    border="0"
  >
    <colgroup>
      <template v-for="(c, i) in dateList[1]" :key="i">
        <col
          :width="`${getGanttUnitColumnWidth(
            c.date.date,
            i === 0 ? 'after' : undefined
          )}px`"
        />
      </template>
    </colgroup>

    <thead>
      <tr v-for="(r, trIndex) in dateList" :key="trIndex">
        <th
          v-for="(c, i) in r"
          :key="i"
          :class="[
            'xg-gantt-header-cell',
            {
              highlight:
                $styleBox.highlightDate &&
                trIndex === dateList.length - 1 &&
                ['day', 'hour'].includes(ganttHeader.unit) &&
                ($param.hoverItem?.start.isSame(c.date, ganttHeader.unit) ||
                  $param.hoverItem?.end.isSame(c.date, ganttHeader.unit))
            }
          ]"
          :style="{
            'border-color': $styleBox.borderColor,
            color: $styleBox.headerStyle?.textColor,
            backgroundColor:
              $styleBox.headerStyle?.bgColor || $styleBox.primaryColor
          }"
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
import useData from '@/composables/useData';
import useGanttWidth from '@/composables/useGanttWidth';
import useStyle from '@/composables/useStyle';
import useParam from '@/composables/useParam';
import useElement from '@/composables/useElement';
import { onMounted } from 'vue';
import useGanttHeader from '@/composables/useGanttHeader';

const { $param } = useParam();
const { $styleBox } = useStyle();
const { dateList } = useData();
const { getGanttUnitColumnWidth } = useGanttWidth();
const { ganttHeaderRef, updateHeaderHeight } = useElement();
const { ganttHeader } = useGanttHeader();
onMounted(updateHeaderHeight);
</script>

<style lang="scss">
.xg-gantt-header {
  width: 100%;
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
    border-bottom: 1px solid #e5e5e5;
    border-right: 1px solid #e5e5e5;
    font-size: 14px;
  }

  .highlight {
    filter: brightness(1.2);
  }
}
</style>
