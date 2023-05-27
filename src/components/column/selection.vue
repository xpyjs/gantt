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

  <Checkbox
    v-if="$styleBox.showCheckbox"
    v-model="checked"
    @click="onClickCheckbox"
    @right-click="onRightClickCheckbox"
  />
</template>

<script lang="ts" setup>
import { PropType, ref, watchEffect } from 'vue';
import useStyle from '@/composables/useStyle';
import useData from '@/composables/useData';
import RowItem from '@/models/data/row';
import Icon from '../common/Icon.vue';
import Checkbox from '../common/Checkbox.vue';
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
const checked = ref(props.data.isChecked);
const { EmitRowChecked } = useEvent();

watchEffect(() => {
  checked.value = props.data.isChecked;
});

const onClickCheckbox = (state: boolean) => {
  EmitRowChecked(state, props.data.data);
};

const onRightClickCheckbox = (state: boolean) => {
  // 选中时，先选中再抛出事件。取消时相反
  if (!state) {
    EmitRowChecked(
      false,
      props.data.data,
      props.data.getFlattenChildren().map(v => v.data)
    );
    props.data.setChecked(false, true);
  } else {
    props.data.setChecked(true, true);
    EmitRowChecked(
      true,
      props.data.data,
      props.data.getFlattenChildren().map(v => v.data)
    );
  }
};

const { flattenData } = useData();
</script>

<style lang="scss">
@import './style.scss';
</style>
