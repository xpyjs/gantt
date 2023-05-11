<template>
  <Root ref="rootWrapRef" v-bind="$attrs" :slots="slots" />
</template>

<script lang="ts">
import { defineComponent, useSlots } from 'vue';
import { initStore } from '@/store';
import useRoot from '@/composables/useRoot';
import Root from './index.vue';
import useEvent from '@/composables/useEvent';

export default defineComponent({
  name: 'RootWrap',
  components: {
    Root
  }
});
</script>

<script lang="ts" setup>
const slots = useSlots();
const emit = defineEmits<{
  (e: 'row-click', data: any): void;
  (e: 'row-dbl-click', data: any): void;
  (e: 'row-checked', state: boolean, data: any): void;
  (e: 'move-slider', data: any[], old: { start: Date; end: Date }): void;
  (e: 'move-progress', data: any, old: number): void;
  (e: 'no-date-error'): void;
}>();

// 初始全局数据
initStore();

// 设置 emit
const { setRootEmit } = useEvent();
setRootEmit(emit);

const { rootRef } = useRoot();

const setSelected = (args: any) => {
  (rootRef.value as any)?.setSelected(args);
};
const jumpToDate = (args: any) => {
  (rootRef.value as any)?.jumpToDate(args);
};

const setHeaderUnit = (args: any) => {
  (rootRef.value as any)?.setHeaderUnit(args);
};

// ***** 对外方法 ***** //
defineExpose({
  setSelected,
  jumpToDate,
  setHeaderUnit
});
</script>

<style scoped lang="scss"></style>
