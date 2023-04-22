<template>
  <div
    class="xg-table-cell"
    :style="{
      width: '30px',
      ...$styleBox.getBorderColor()
    }"
  >
    <div
      class="cell"
      :style="{ lineHeight: `${rowHeight}px`, height: `${rowHeight}px` }"
    >
      <input v-model="checked" type="checkbox" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import useStyle from '@/composables/useStyle';
import Variables from '@/constants/vars';

export default defineComponent({
  name: Variables.name.column
});
</script>

<script lang="ts" setup>
const { $styleBox, rowHeight } = useStyle();
const checked = ref(false);
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
