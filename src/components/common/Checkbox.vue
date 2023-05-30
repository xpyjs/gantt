<template>
  <div
    class="xg-checkbox"
    :class="{ checked: value, 'right-click': rightClick }"
    :style="{ '--primary-color': $styleBox.primaryColor }"
    @click.left.stop="toggleChecked"
    @contextmenu.prevent.right="toggleRightClick"
    @dblclick.prevent
  >
    <div class="checkbox-inner">
      <div v-if="value === true" class="checkmark">
        <i />
      </div>
      <div v-else class="checkmark"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useStyle from '@/composables/useStyle';
import { ref, watchEffect } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(['update:modelValue', 'click', 'right-click']);

const { $styleBox } = useStyle();

const rightClick = ref(false);
const value = ref(props.modelValue);

watchEffect(() => {
  value.value = props.modelValue;
});

const toggleChecked = () => {
  value.value = !value.value;
  emits('update:modelValue', value.value);
  emits('click', value.value);
};

const toggleRightClick = () => {
  if (props.modelValue === true) {
    rightClick.value = true;
  }

  rightClick.value = !rightClick.value;
  value.value = rightClick.value;

  emits('right-click', value.value);
};
</script>

<style scoped lang="scss">
.xg-checkbox {
  display: inline-block;
  width: 18px;
  height: 18px;
  cursor: pointer;
  box-sizing: border-box;
  vertical-align: text-bottom;
  padding: 3px;

  .checkbox-inner {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
    border-radius: 2px;

    .checkmark {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background-color: #fff;

      i {
        width: 100%;
        height: 100%;
        line-height: 1;
      }
    }
  }
}

.xg-checkbox.checked {
  .checkbox-inner {
    border: 1px solid var(--primary-color, #eca710);
    background-color: var(--primary-color, #eca710);

    .checkmark {
      i {
        background-color: var(--primary-color, #eca710);

        &::before {
          content: '\2714';
          font-weight: bold;
          color: #fff;
          border-radius: 2px;
        }
      }
    }
  }
}
</style>
