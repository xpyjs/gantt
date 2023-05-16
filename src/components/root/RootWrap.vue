<template>
  <Root ref="rootWrapRef" v-bind="$attrs" :slots="slots" />
</template>

<script lang="ts">
import { defineComponent, ref, useSlots } from 'vue';
import { initStore } from '@/store';
import Root from './index.vue';
import useEvent from '@/composables/useEvent';
import { MoveSliderData } from '@/typings/data';
import { LinkProps } from '@/typings/link';

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
  (e: 'move-slider', data: MoveSliderData[]): void;
  (e: 'move-progress', data: any, old: number): void;
  (e: 'add-link', data: LinkProps): void;
  (e: 'no-date-error', date: Date): void;
}>();

// 初始全局数据
initStore();

// 设置 emit
const { setRootEmit } = useEvent();
setRootEmit(emit);

const rootWrapRef = ref(null) as any;
const setSelected = (args: any) => {
  return (rootWrapRef.value as any)?.setSelected(args);
};
const jumpToDate = (args: any) => {
  return (rootWrapRef.value as any)?.jumpToDate(args);
};

// ***** 对外方法 ***** //
defineExpose({
  /**
   * 设置一个选择项。如果当前数据中找不到，返回 null
   */
  setSelected,

  /**
   * 跳转到指定日期（没有参数跳转到今天）。如果找不到日期，抛出 no-date-error 事件
   */
  jumpToDate
});
</script>

<style scoped lang="scss"></style>
