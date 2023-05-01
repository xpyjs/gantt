<template>
  <Root ref="rootWrapRef" v-bind="$attrs" :slots="slots" />
</template>

<script lang="ts">
import { defineComponent, useSlots } from 'vue';
import { initStore } from '@/store';
import useElement from '@/composables/useElement';
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

const { rootWrapRef } = useElement();

const setSelected = (args: any) => {
  (rootWrapRef.value as any)?.setSelected(args);
};
const jumpToDate = (args: any) => {
  (rootWrapRef.value as any)?.jumpToDate(args);
};

const setHeaderUnit = (args: any) => {
  (rootWrapRef.value as any)?.setHeaderUnit(args);
};

// ***** 对外方法 ***** //
defineExpose({
  setSelected,
  jumpToDate,
  setHeaderUnit
});
</script>

<style scoped lang="scss"></style>
