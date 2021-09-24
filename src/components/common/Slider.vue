<template>
  <div class="gt-slider-bar">
    <input v-model="value" type="range" :min="min" :max="max" />
    <div class="show-val gt-shadow">
      {{ value }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from "vue";
export default defineComponent({
  name: "GanttSlider",

  props: {
    modelValue: Number,
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      defalut: 100
    }
  },

  setup(props, ctx) {
    const { modelValue } = toRefs(props);

    const value = computed({
      get: () => modelValue.value,
      set: v => {
        ctx.emit("update:modelValue", v);
      }
    });

    return { value };
  }
});
</script>

<style scoped lang="scss">
.gt-slider-bar {
  display: flex;
  flex-shrink: 0;

  input[type="range"] {
    -webkit-appearance: none; /*去除默认样式*/
    margin: 0;
    padding: 0;
    background-color: #ebeff4;
    border-radius: 0.5rem;
    width: 100% !important;
    height: 1rem;
    border: none;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none; /*去除默认样式*/
    cursor: default;
    top: 0;
    height: 1.3rem;
    width: 1.3rem;
    transform: translateY(0px);
    background: transparent;
    border-radius: 50%;
    border: 7px solid var(--j-primary-color);
  }

  .show-val {
    height: 16px;
    width: 16px;
    display: flex;
    margin: auto 0 auto 5px;
    border: 1px solid #ebeff4;
    font-size: 12px;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
  }
}
</style>
