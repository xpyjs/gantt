<template>
  <div style="top: 20vh; width: 100%; height: 1000px; padding-left: 5vw">
    <x-gantt
      ref="ganttRef"
      data-id="index"
      :data="data"
      :links="links"
      :border-color="borderColor"
      :show-checkbox="showCheckbox"
      :show-expand="showExpand"
      :expand-all="expandAll"
      :show-today="showToday"
      :show-weekend="showWeekend"
      :unit="unit"
      :dark="dark"
      @row-click="onClickRow"
      @row-dbl-click="onDblClickRow"
      @row-checked="onCheckedRow"
      @move-slider="onMoveSlider"
      @add-link="onAddLink"
      @click-link="onClickLink"
      @no-date-error="onNoDateError"
    >
    <x-gantt-column
      prop="index"
      width="120px"
      :column-style="{ 'background-color': 'yellow' }"
    ></x-gantt-column>

    <x-gantt-column
      prop="name"
    ></x-gantt-column>

      <x-gantt-column v-slot="scope" label="起始日期">
        {{ scope.row.startDate.getMonth() + 1 }}-{{
          scope.row.startDate.getDate()
        }}
        {{ scope.row.startDate.getHours() }}:{{
          scope.row.startDate.getMinutes()
        }}
      </x-gantt-column>

      <x-gantt-column
        label="结束日期"
        prop="endDate"
        date-format="MM-dd HH:mm:ss"
        ellipsis
      />

      <x-gantt-slider
        prop="o.t1"
        :move="true"
        resize-left
        resize-right
        linked-resize
        progress
      >
        <template #left>
          <div style="width: 4px; height: 100%; background-color: aqua"></div>
        </template>
      </x-gantt-slider>
    </x-gantt>
  </div>
</template>

<script setup lang="ts">
import XGantt from '../../src/components/root/rootWrap.vue';
import XGanttColumn from '../../src/components/column/index.vue';
import XGanttSlider from '../../src/components/slider/index.vue';

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },

  links: {
    type: Array,
    default: () => []
  },

  borderColor: {
    type: String,
    default: '#ccc'
  },

  showCheckbox: {
    type: Boolean,
    default: true
  },

  showExpand: {
    type: Boolean,
    default: true
  },

  expandAll: {
    type: Boolean,
    default: false
  },

  unit: {
    type: String,
    default: 'day'
  },

  dark: {
    type: Boolean,
    default: false
  },

  showToday: {
    type: Boolean,
    default: true
  },

  showWeekend: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits<{
  (e: 'row-click', data: any): void;
  (e: 'row-dbl-click', data: any): void;
  (e: 'row-checked', state: boolean, data: any): void;
  (e: 'move-slider', data: any[]): void;
  (
    e: 'add-link',
    link: any,
    data: { from: any; to: any },
    cb: (link: any) => void
  ): void;
  (e: 'click-link', link: any | null): void;
  (e: 'no-date-error', date: Date): void;
}>();

const onClickRow = (data: any) => {
  emit('row-click', data);
};

const onDblClickRow = (data: any) => {
  emit('row-dbl-click', data);
};

const onCheckedRow = (state: boolean, data: any) => {
  emit('row-checked', state, data);
};

const onMoveSlider = (data: any) => {
  emit('move-slider', data);
};

const onAddLink = (
  link: any,
  data: { from: any; to: any },
  cb: (link: any) => void
) => {
  emit('add-link', link, data, cb);
};

const onClickLink = (link: any | null) => {
  emit('click-link', link);
};

const onNoDateError = (date: Date) => {
  emit('no-date-error', date);
};
</script>

<style scoped></style>
