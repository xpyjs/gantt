<template>
  <transition-group tag="div" name="gt-update-animate">
    <component
      :is="camelToKebabCased(name)"
      v-for="view in inView"
      :key="view.uuid"
      :data="view"
      :style="rowWrapStyle(view.__uindex, view.uuid)"
      class="gt-update-animate-item"
    />
  </transition-group>
</template>

<script lang="ts">
import { defineComponent, Ref, toRefs } from 'vue';
import useInView from '@/composables/useInView';
import { Row } from '@/models/data/row';
import { camelToKebabCased } from '@/utils/common';
import JTableRow from '../table/Row.vue';
import JGanttRow from '../gantt/Row.vue';
import useStyle from '@/composables/useStyle';

export default defineComponent({
  components: {
    [JTableRow.name]: JTableRow,
    [JGanttRow.name]: JGanttRow
  }
});
</script>

<script lang="ts" setup>
const props = defineProps<{
  data: Array<Row>;
  name: string;
}>();

const { data } = toRefs(props);
const { inView } = useInView(data as Ref<Array<Row>>);
const { rowWrapStyle } = useStyle();
</script>

<style scoped lang="scss">
.gt-update-animate-item {
  transition: transform 0s;
}

.gt-update-animate-enter,
.gt-update-animate-leave-to {
  height: 0;
}

.gt-update-animate-leave-active {
  position: absolute;
}

.gt-update-animate-enter-active {
  animation: fadeInDown 0s;
}
</style>
