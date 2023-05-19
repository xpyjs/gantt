<template>
  <div style="height: 400px; padding-bottom: 10px">
    <XGantt
      ref="gantt"
      header-height="48"
      row-height="30"
      data-index="index"
      expand-all
      :dark="isDark"
      :show-checkbox="showCheckbox"
      :show-weekend="showWeekend"
      :show-today="showToday"
      :show-expand="showExpand"
      :data="dataList"
      :header-style="headerStyle"
      :body-style="bodyStyle"
      :level-color="levelColor"
      @row-click="rowClick"
      @row-dbl-click="rowDblClick"
      @row-checked="rowChecked"
      @move-slider="moveSlider"
      @no-date-error="noDateError"
    >
      <template>
        <div>123</div>
      </template>

      <div>a</div>

      <div>b</div>

      <XGanttSlider
        flat
        label="startDate"
        date-format="MM-dd H:mm:s"
        empty-data=""
        :move="handleMove"
        :resize-left="true"
        :resize-right="true"
        :linked-resize="true"
      >
        <!-- <template v-slot="data">
          <div>{{ data.name }}</div>
        </template> -->
        <template #content="{ data, level }">
          <div v-if="level === 1" class="slider-level-one"></div>
          <!-- <div v-else style="background-color: #123456; height: 5px"></div> -->
        </template>
        <!-- <template #left>
          <div style="background-color: #123456; width: 5px; height: 10px" />
        </template>
        <template #right>
          <div style="background-color: #123456; width: 5px; height: 10px" />
        </template> -->
      </XGanttSlider>

      <XGanttColumn label="index" :merge="merge3">
        <template #default="{ data }">
          <div style="background-color: #ccc; width: 100%">
            {{ data.name }}
          </div>
        </template>
      </XGanttColumn>

      <XGanttColumn label="name" width="150" :merge="merge3">
        <template #default="{ data }">
          <div>2 - {{ data }}</div>
        </template>
      </XGanttColumn>

      <XGanttColumn label="aaa" date-format :merge="merge5">
        <template #default>
          <div v-for="i in 100" :key="i">
            {{ i }}
          </div>
        </template>
      </XGanttColumn>

      <XGanttColumn
        label="startDate"
        width="180"
        center
        date-format
        :merge="merge4"
      />

      <x-gantt-column
        label="endDate"
        name="自定义标签"
        width="200"
        date-format="q yyyy-MM-dd HH:mm:ss"
        :merge="merge4"
      >
        <template #default="{ data }">
          <span
            name="end"
            :style="{ backgroundColor: `#${555}`, color: '#789' }"
          >
            abc - {{ data.endDate }}
          </span>
        </template>
      </x-gantt-column>

      <XGanttColumn label="picture12345" :merge="merge5">
        <template #default="{ data }">
          👀😃✨✔🐱‍🚀🐱‍👓 {{ data.ttt.b }}
        </template>
      </XGanttColumn>

      <template #settings>
        <div>
          <p>标题</p>
          <input />
        </div>
      </template>
    </XGantt>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { dataList } from './data';
import XGantt from '@/components/root/index.vue';
import XGanttColumn from '@/components/column/index.vue';
import XGanttSlider from '@/components/slider/index.vue';

const isDark = ref(false);
const showCheckbox = ref(false);
const showWeekend = ref(false);
const showToday = ref(false);
const showExpand = ref(false);

const headerStyle = reactive({
  bgColor: '',
  textColor: ''
});
const bodyStyle = reactive({
  textColor: '',
  todayColor: '',
  weekendColor: ''
  // hoverColor: "#f00",
  // selectColor: "#0f0"
});
const levelColor = reactive([]);

function rowClick(data) {
  console.log('click row data:', data);
}
function rowDblClick(data) {
  console.log('double click row data:', data);
}

function rowChecked(state, data) {
  console.log('check row:', state, data);
}

function moveSlider(newValue, data) {
  console.log('move slider:', newValue, data);
}

function noDateError(date) {
  console.log(`${date}不在范围内`);
}

function handleMove({ level }) {
  return level !== 1;
}

function merge3(data) {
  return data.index % 3 !== 0;
}

function merge4(data) {
  return data.index % 4 !== 0;
}

function merge5(data) {
  return data.index % 5 !== 0;
}
</script>

<style scoped></style>
