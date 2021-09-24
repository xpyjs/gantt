<script lang="ts">
import useEvent from "@/composables/useEvent";
import useParam from "@/composables/useParam";
import useRender from "@/composables/useRender";
import useStyle from "@/composables/useStyle";
import { Variables } from "@/constants/vars";
import { Row } from "@/models/data/row";
import { defineComponent } from "vue";

export default defineComponent({
  name: Variables.name.tableRow
});
</script>

<script lang="ts" setup>
const props = defineProps<{
  data: Row;
}>();
const { tableRowStyle } = useStyle();

const { GtParam } = useParam();
const { isMerge } = useRender(props.data);
const colNodes = GtParam.colNodes.filter(n => !isMerge(n.merge));

const { onClickRow, onDbClickRow, onMouseEnterRow, onMouseLeaveRow } = useEvent(
  props.data
);
</script>

<template>
  <div
    class="gt-table-row"
    :style="tableRowStyle(data.level)"
    @click="onClickRow"
    @dblclick="onDbClickRow"
    @mouseenter="onMouseEnterRow"
    @mouseleave="onMouseLeaveRow"
  >
    <template v-if="!!data">
      <component
        :is="node.node"
        v-for="node in colNodes"
        :key="node.key"
        :data="data"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.gt-table-row {
  width: 100%;
  display: flex;
  flex: row nowrap;
  flex-shrink: 0;
  background-color: var(--j-content-bg-color);
  border-bottom: 1px solid var(--j-content-border-color);
  box-sizing: border-box;
}
</style>
