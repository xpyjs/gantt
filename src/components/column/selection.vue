<template>
  <div class="level-block" :style="{ width: `${data!.level * indent}px` }" />

  <Icon
    v-if="$styleBox.showExpand && !!data?.children?.length"
    name="arrow-right"
    :class="['expand-icon', { 'expand-icon__expanded': data?.isExpand }]"
    :style="{ width: `${rowHeight / 2}px`, height: `${rowHeight / 2}px` }"
    @click.stop="
      () => {
        data?.setExpand(!data.isExpand);
        flattenData();
      }
    "
  />

  <input
    v-if="$styleBox.showCheckbox"
    v-model="checked"
    class="checkbox"
    type="checkbox"
    @click.stop
  />
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from 'vue';
import useStyle from '@/composables/useStyle';
import useData from '@/composables/useData';
import RowItem from '@/models/data/row';
import Icon from '../common/Icon.vue';
import useEvent from '@/composables/useEvent';

const props = defineProps({
  data: {
    type: Object as PropType<RowItem>,
    default: () => ({})
  },
  indent: {
    type: Number,
    default: 20
  }
});

const { rowHeight, $styleBox } = useStyle();
const checked = ref(false);
const { EmitRowChecked } = useEvent();
watch(
  () => checked.value,
  val => {
    EmitRowChecked(val, props.data.data);
  }
);

const { flattenData } = useData();
</script>

<style lang="scss">
@import './style.scss';
</style>
