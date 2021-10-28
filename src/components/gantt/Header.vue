<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useToday } from '@/composables/useDate';
import useParam from '@/composables/useParam';
import useStyle from '@/composables/useStyle';
import { Variables } from '@/constants/vars';

export default defineComponent({
  name: Variables.name.ganttHeader
});
</script>

<script lang="ts" setup>
const { GtParam, oneDayWidth } = useParam();
const { headerStyle } = useStyle();

const ganttHeaders = computed(() => GtParam.ganttHeaders);

const chunkStyle = computed(() => {
  return (len: number) => {
    return {
      width: `${oneDayWidth.value * len}px`,
      borderColor: 'var(--j-content-border-color)'
    };
  };
});

const { showTodayLine, todayArrowStyle } = useToday();
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
      v-for="(item, i) in ganttHeaders.list"
      :key="i"
      class="gt-gantt-header-chunk"
      :style="chunkStyle(item.one.reduce((pre, cur) => cur.len + pre, 0))"
    >
      <div class="gt-gantt-header-chunk-unit">
        {{ item.unit }}
      </div>
      <div class="gt-gantt-header-chunk-one">
        <div
          v-for="(one, index) in item.one"
          :key="index"
          :style="chunkStyle(one.len)"
        >
          {{ one.text }}
        </div>
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
    white-space: nowrap;
    height: 100%;
    font-size: 1rem;
    font-weight: bold;
    border-right: 1px solid var(--j-content-border-color);
    box-sizing: border-box;

    &-unit {
      padding: 4px 0 0 4px;
      height: 50%;
      border-bottom: 1px solid var(--j-content-border-color);
      box-sizing: border-box;
    }

    &-one {
      font-size: 0.5rem;
      font-weight: bold;
      height: 50%;

      & > div {
        display: inline-flex;
        border-right: 1px solid var(--j-content-border-color);
        box-sizing: border-box;
        height: 100%;
        justify-content: center;
        align-items: center;
      }
    }
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
