<template>
  <div class="xg-slider">
    <slot v-if="slots.default" v-bind="props.data?.data" />

    <span v-else-if="props.prop">{{ props.data?.data?.[props.prop] }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, useSlots } from 'vue';
import Variables from '@/constants/vars';
import sliderProps from './props';

export default defineComponent({
  name: Variables.name.slider
});
</script>

<script setup lang="ts">
const props = defineProps(sliderProps);

const slots = useSlots();
</script>

<style lang="scss" scoped>
@use 'sass:math';

.xg-slider {
  width: 100px;
  background-color: darkgoldenrod;
  position: absolute;
  $h: 70%;
  height: $h;
  border-radius: 4px;
  font-size: 12px;
  top: math.div(100% - $h, 2);
}
</style>
