<template>
  <div class="gt-operation-drawer" :style="drawerStyle">
    <!-- 系统设置 -->
    <div>
      <div class="gt-text-title" style="margin-bottom: 1rem">系统设置</div>

      <div style="display: inline-flex; gap: 1rem">
        <div style="display: inline-block">
          <div class="gt-text-secondary-title">修改甘特图列宽</div>
          <div style="display: flex; gap: 0.5rem">
            <button
              class="gt-drawer-reset-btn"
              style="font-size: 10px"
              @click="() => changeColWidth('small')"
            >
              小
            </button>
            <button
              class="gt-drawer-reset-btn"
              style="font-size: 10px"
              @click="() => changeColWidth('normal')"
            >
              中
            </button>
            <button
              class="gt-drawer-reset-btn"
              style="font-size: 10px"
              @click="() => changeColWidth('large')"
            >
              大
            </button>
          </div>
        </div>

        <div style="display: inline-block">
          <div class="gt-text-secondary-title">修改行高</div>
          <j-slider
            v-model="rowHeight"
            style="margin: 5px 20px 10px 0px"
            :min="minRowHeight"
            :max="maxRowHeight"
          />
        </div>

        <div style="margin: auto 0">
          <button class="gt-drawer-reset-btn" @click="reset">重置</button>
        </div>
      </div>
    </div>

    <div style="margin-top: 1rem">
      <div class="gt-text-title" style="margin-bottom: 1rem">甘特显示</div>
      <div style="display: flex; gap: 1rem">
        <button
          class="gt-drawer-reset-btn"
          @click="() => updateGanttHeaderUnit('day')"
        >
          日
        </button>
        <button
          class="gt-drawer-reset-btn"
          @click="() => updateGanttHeaderUnit('week')"
        >
          周
        </button>
        <button
          class="gt-drawer-reset-btn"
          @click="() => updateGanttHeaderUnit('month')"
        >
          月
        </button>
      </div>
    </div>

    <div class="gt-line gt-shadow" />

    <!-- 自定义内容 -->
    <component :is="settingsSlot" v-if="settingsSlot" />
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import useParam from '@/composables/useParam';
import { Variables } from '@/constants/vars';
import { parseNumber } from '@/utils/common';
import JSlider from './Slider.vue';
// eslint-disable-next-line import/named
import { GanttColumnSize, HeaderDateUnit } from '@/typings/ParamOptions';

export default defineComponent({
  name: 'GanttDrawer'
});
</script>

<script lang="ts" setup>
const props = defineProps({
  show: {
    type: Boolean
  }
});

const { show } = toRefs(props);

const { GtParam } = useParam();

function changeColWidth(v: GanttColumnSize) {
  GtParam.setGanttOptions({ [Variables.key.columnSize]: v });
}

function changeRowHeight(v: number) {
  GtParam.rowHeight = v;
}

function reset() {
  GtParam.resetSize();
}

function updateGanttHeaderUnit(unit: HeaderDateUnit) {
  GtParam.headerUnit = unit;
}

const drawerStyle = computed(() => {
  return {
    'min-width': '200px',
    'max-width': '400px',
    right: show.value ? '0px' : '-410px'
  };
});

const settingsSlot = computed(() => GtParam.getSlot(Variables.slots.settings));
const rowHeight = computed({
  get: () =>
    parseNumber(GtParam.rowHeight, Variables.size.defaultContentRowHeight),
  set: v => changeRowHeight(v)
});
const minRowHeight = computed(() => Variables.size.minContentRowHeight);
const maxRowHeight = computed(() => Variables.size.maxContentRowHeight);
</script>

<style scoped lang="scss">
.gt-text-title {
  font-size: 1rem;
  font-weight: bold;
}

.gt-operation-drawer {
  height: 100%;
  padding: 20px;
  background-color: var(--j-content-bg-color);
  color: var(--j-text-color);
  position: absolute;
  z-index: 999;
  box-shadow: 0 0 10px 2px var(--j-content-border-color);
  transition: all 0.5s;
}

.gt-drawer-reset-btn {
  display: inline-block;
  background-color: var(--j-primary-color);
  border-radius: 5px;
  border: none;
  color: var(--j-text-color);
  padding: 0.2rem 0.5rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;

  &:hover {
    box-shadow: 1px 1px 5px 1px var(--j-content-border-color);
    transition: box-shadow 0.5s;
  }

  &:active {
    filter: brightness(0.9);
  }
}
</style>
