<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';
import useStyle from '@/composables/useStyle';
import { Variables } from '@/constants/vars';
import { Row } from '@/models/data/row';
import { uuid } from '@/utils/common';

export default defineComponent({
  name: Variables.name.ganttBackgroundRow
});
</script>

<script lang="ts" setup>
const props = defineProps<{ data: Row }>();
const { data } = toRefs(props);

const { ganttRowStyle } = useStyle();

const key = ref(data.value?.uuid ?? uuid(12));
</script>

<template>
  <div :key="key" class="gt-gantt-row" :style="ganttRowStyle(data.level)" />
</template>

<style scoped lang="scss">
.gt-gantt-row {
  width: 100%;
  position: relative;
  background-color: var(--j-content-bg-color);
  border-bottom: 1px solid var(--j-content-border-color);
  box-sizing: border-box;
}
</style>
