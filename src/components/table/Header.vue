<script lang="ts">
import useParam from "@/composables/useParam";
import { useResizeTableColumn } from "@/composables/useResize";
import useStyle from "@/composables/useStyle";
import { Variables } from "@/constants/vars";
import { TableHeader } from "@/models/param/header";
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: Variables.name.tableHeader
});
</script>

<script lang="ts" setup>
const { headerStyle } = useStyle();
const { GtParam } = useParam();

const tableHeaders = computed(() => GtParam.tableHeaders as TableHeader[]);

const { onResizeColumnWidth } = useResizeTableColumn();
</script>

<template>
  <div class="gt-table-header gt-noselect" :style="headerStyle">
    <div
      v-for="item in tableHeaders"
      :key="item.key"
      class="gt-table-header-chunk"
      :style="{ width: `${item.width}px`, ...headerStyle }"
    >
      <!-- 表头内容 -->
      <div class="gt-table-header-chunk-content">
        {{ item.text }}
      </div>

      <!-- 拖动表格的线条 -->
      <div
        v-if="item.key !== tableHeaders.length - 1"
        class="gt-header__table-chunk__move-slider"
        @mousedown="e => onResizeColumnWidth(e, item)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.gt-table-header {
  width: 100%;
  height: var(--header-height);
  position: sticky;
  position: -webkit-sticky;
  white-space: nowrap;
  top: 0;
  z-index: 5;
  background-color: var(--j-primary-color);
  border-bottom: 1px solid var(--j-content-border-color);

  .gt-table-header-chunk {
    position: relative;
    display: inline-block;
    height: 100%;
    font-size: 18px;
    font-weight: bold;
    overflow: hidden;

    div {
      // 10px 的 padding，还有 2px 的 位移条
      width: calc(100% - 12px);
      padding: 5px;
      display: inline-block;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .gt-table-header-chunk-content {
      position: absolute;
      bottom: 0;
      left: 0;
    }

    .gt-header__table-chunk__move-slider {
      position: absolute;
      right: 0px;
      width: 1px;
      height: 100%;
      padding: 0px;
      margin: 0px;
      background-color: var(--j-content-border-color);
      cursor: w-resize !important;
      transition: filter 0.2s;

      &:hover {
        opacity: 0.3;
        width: 2px;
        filter: blur(1px) invert(1);
      }
    }
  }
}
</style>
