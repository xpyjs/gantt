<template>
  <div class="level-block" :style="{ width: `${data!.level * indent}px` }" />

  <div
    v-if="!!data?.children?.length"
    :class="['expand-icon', { 'expand-icon__expanded': data?.isExpand }]"
    @click="
      () => {
        data?.setExpand(!data.isExpand);
        $data.updateFlatData();
      }
    "
  >
    <svg
      t="1682094638676"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="1386"
      :width="`${rowHeight / 2}px`"
      :height="`${rowHeight / 2}px`"
    >
      <path
        d="M384 210.773333l278.613333 278.613334a32 32 0 0 1 0 45.226666L384 813.226667 338.773333 768l256-256-256-256L384 210.773333z"
        p-id="1387"
        fill="#9f9f9f"
      ></path>
    </svg>
  </div>

  <input v-if="showCheckbox" v-model="checked" type="checkbox" />
</template>

<script lang="ts" setup>
import { PropType, ref } from 'vue';
import useStyle from '@/composables/useStyle';
import useData from '@/composables/useData';
import RowItem from '@/models/data/row';
const { rowHeight } = useStyle();
const checked = ref(false);

defineProps({
  data: {
    type: Object as PropType<RowItem>,
    default: () => ({})
  },
  indent: {
    type: Number,
    default: 20
  },
  showCheckbox: {
    type: Boolean,
    default: false
  }
});
const { $data } = useData();
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
