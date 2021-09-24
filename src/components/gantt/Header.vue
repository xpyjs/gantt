<script lang="ts">
import useData from "@/composables/useData";
import { useToday } from "@/composables/useDate";
import useParam from "@/composables/useParam";
import useStyle from "@/composables/useStyle";
import { Variables } from "@/constants/vars";
import { createDate, formatDate, sameDate } from "@/utils/date";
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: Variables.name.ganttHeader
});
</script>

<script lang="ts" setup>
const { GtParam, colWidth } = useParam();
const { GtData } = useData();
const { headerStyle } = useStyle();

const ganttHeaders = computed(() => GtParam.ganttHeaders);

const chunkStyle = computed(() => {
  return {
    width: `${colWidth.value}px`,
    borderColor: "var(--j-content-border-color)"
  };
});

const { showTodayLine, todayArrowStyle } = useToday();

function showMonth(item: string): boolean {
  return (
    sameDate(item, GtData.start as Date) || createDate(item).getDate() === 1
  );
}

function getDateStr(item: string) {
  return createDate(item).getDate().toString();
}

function getMonthStr(item: string) {
  return formatDate(createDate(item), "yyyy-MM");
}
</script>

<template>
  <div class="gt-gantt-header gt-noselect" :style="headerStyle">
    <!-- 悬挂今天的箭头 -->
    <div
      v-if="showTodayLine"
      class="gt-gantt-header-today-arrow"
      :style="todayArrowStyle"
    />

    <div
      v-for="(item, i) in ganttHeaders"
      :key="i"
      class="gt-gantt-header-chunk"
      :style="chunkStyle"
    >
      {{ getDateStr(item) }}
      <div v-if="showMonth(item)" class="gt-gantt-header-chunk-month">
        {{ getMonthStr(item) }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gt-gantt-header {
  width: 100%;
  height: var(--header-height);
  position: sticky;
  position: -webkit-sticky;
  white-space: nowrap;
  top: 0;
  z-index: 5;
  overflow: hidden;
  background-color: var(--j-primary-color);
  border-bottom: 1px solid var(--j-content-border-color);

  .gt-gantt-header-chunk {
    display: inline-block;
    position: relative;
    text-align: center;
    white-space: nowrap;
    height: 100%;
    top: 50%;
    font-size: 12px;
    font-weight: bold;
    border-top: 1px solid var(--j-content-border-color);
    border-right: 1px solid var(--j-content-border-color);
    box-sizing: border-box;
  }

  .gt-gantt-header-chunk-month {
    display: inline-block;
    position: absolute;
    font-size: 12px;
    font-weight: bold;
    top: -40%;
  }

  .gt-gantt-header-today-arrow {
    position: absolute;
    top: 20px;
    opacity: 0.5;
    border-radius: 2px;
    border-style: solid;
    border-width: 7.5px;
    border-color: transparent;
    border-top-color: lightblue;
    -webkit-animation: today-arrow 0.8s infinite;

    // 让上面的箭头动起来
    @keyframes today-arrow {
      0% {
        top: 20px;
      }

      /* 从20%的地方才开始变形 */
      20% {
        border-radius: 2px;
      }

      50% {
        top: 15px;
      }

      /* 到80%的地方恢复原状 */
      80% {
        border-radius: 2px;
      }

      100% {
        top: 20px;
      }
    }
  }
}
</style>
