<template>
  <Root ref="rootRef" v-bind="$attrs" :slots="slots" />
</template>

<script lang="ts">
import { defineComponent, useSlots } from 'vue';
import Root from './index.vue';
import { initStore } from '@/store';

export default defineComponent({
  name: 'RootWrap',
  components: {
    Root
  }
});
</script>

<script lang="ts" setup>
const slots = useSlots();

// 初始全局数据
initStore();
</script>

<style scoped lang="scss"></style>
