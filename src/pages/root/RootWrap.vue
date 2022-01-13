<template>
  <Root ref="rootRef" v-bind="$attrs" :slots="slots" />
</template>

<script lang="ts">
import { defineComponent, ref, useSlots } from 'vue';
import { initStore } from '@/store';
import Root from './index.vue';

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

const rootRef = ref();
const setSelected = (args: any) => {
  rootRef.value.setSelected(args);
};
const jumpToDate = (args: any) => {
  rootRef.value.jumpToDate(args);
};

const setHeaderUnit = (args: any) => {
  rootRef.value.setHeaderUnit(args);
};

// ***** 对外方法 ***** //
defineExpose({
  setSelected,
  jumpToDate,
  setHeaderUnit
});
</script>

<style scoped lang="scss"></style>
