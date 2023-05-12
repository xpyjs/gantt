<template>
  <div style="top: 20vh; width: 100%; height: 500px">
    <x-gantt
      data-id="index"
      :data="ganttData"
      :links="ganttLinks"
      :border-color="borderColor"
      show-checkbox
      :show-expand="showExpand"
      :expand-all="expandAll"
      :show-today="true"
      :show-weekend="true"
      @row-click="onClickRow"
    >
      <x-gantt-column label="group1">
        <x-gantt-column prop="index" width="120px"></x-gantt-column>
        <x-gantt-column label="group2">
          <x-gantt-column
            prop="name"
            :merge="(scope: any) => scope.$index % 3 === 0"
          ></x-gantt-column>
          <x-gantt-column
            prop="name2"
            :merge="(scope: any) => scope.$index % 2 === 0"
            >n1</x-gantt-column
          >
        </x-gantt-column>
      </x-gantt-column>

      <div>div</div>

      <x-gantt-column v-slot="scope" label="起始日期">
        {{ scope.row.startDate.getMonth() + 1 }}-{{
          scope.row.startDate.getDate()
        }}
        {{ scope.row.startDate.getHours() }}:{{
          scope.row.startDate.getMinutes()
        }}
      </x-gantt-column>

      <!-- <x-gantt-column v-slot="scope" label="结束日期">
        {{ scope.row.endDate.getMonth() + 1 }}-{{
          scope.row.endDate.getDate()
        }}
        {{ scope.row.endDate.getHours() }}:{{ scope.row.endDate.getMinutes() }}
      </x-gantt-column> -->

      <x-gantt-column
        label="结束日期"
        prop="endDate"
        date-format="MM-dd HH:mm:ss"
        ellipsis
      />

      <x-gantt-slider prop="name" :move="onMove" resize-left resize-right>
        <template #content="scope">
          <div
            style="
              width: 100%;
              height: 100%;
              background-color: blueviolet;
              text-align: center;
            "
          >
            {{ scope.level }}
          </div>
        </template>

        <template #left>
          <div style="width: 4px; height: 100%; background-color: aqua"></div>
        </template>
      </x-gantt-slider>
    </x-gantt>
  </div>

  <div>
    共{{ ganttData.length }}条
    <button @click="onAdd">增加</button>
    <button @click="onReduce">减少</button>
    <button @click="onExpand">{{ showExpand ? '隐藏' : '展示' }}</button>
    <button @click="expandAll = !expandAll">
      {{ expandAll ? '闭合' : '展开' }}
    </button>
    <button @click="onChangeBorderColor">border颜色</button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

let id = 0;

const ganttData = reactive<any>([]);

for (let i = 0; i < 50; i++) {
  onAdd();
}

ganttData[0].children = [
  {
    index: ++id,
    name: 'sub-t' + id,
    startDate: new Date(2023, 3, 1),
    endDate: new Date(2023, 3, 5)
  },
  {
    index: ++id,
    name: 'sub-t' + id,
    startDate: new Date(2023, 3, 1),
    endDate: new Date(2023, 3, 5),
    children: [
      {
        index: ++id,
        name: 'sub-sub-t' + id,
        startDate: new Date(2023, 3, 1),
        endDate: new Date(2023, 3, 5)
      }
    ]
  }
];

const ganttLinks = [
  {
    index: 1,
    from: 1,
    to: 2
  },
  {
    index: 2,
    from: 2,
    to: 5
  }
];

const showExpand = ref(true);
function onExpand() {
  showExpand.value = !showExpand.value;
}
const expandAll = ref(false);

const colors = ['red', 'blue', 'green', 'yellow', 'pink', 'orange'];
const borderColor = ref('');
function onChangeBorderColor() {
  borderColor.value = colors[Math.floor(Math.random() * colors.length)];
}

function onAdd() {
  ganttData.push({
    index: ++id,
    name: 't' + id,
    startDate: new Date(2023, 3, id),
    endDate: new Date(2023, 3, id + 5)
  });
}

function onReduce() {
  ganttData.splice(ganttData.length - 1, 1);
}

const onClickRow = (data: any) => {
  console.log('click row', data);
};

function onMove(data: any) {
  return true;
}
</script>

<style scoped></style>
