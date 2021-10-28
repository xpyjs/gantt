<template>
  <div class="gt-line gt-shadow" :style="{ backgroundColor: color }" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GantttLine',

  props: {
    color: {
      type: String,
      default: 'lightgrey'
    }
  }
});
</script>

<style scoped lang="scss">
.gt-line {
  width: 100%;
  height: 1px;
  margin: 10px 0;
}
</style>
