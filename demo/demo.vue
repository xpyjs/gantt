<template>
  <div style="top: 20vh; width: 100%; height: 500px">
    <x-gantt
      :data="ganttData"
      style="padding-left: 20vh"
      @click-row="onClickRow"
    >
      <x-gantt-column label="group1">
        <x-gantt-column prop="id" width="150px"></x-gantt-column>
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

      <x-gantt-column v-slot="scope" label="结束日期">
        {{ scope.row.endDate.getMonth() + 1 }}-{{
          scope.row.endDate.getDate()
        }}
        {{ scope.row.endDate.getHours() }}:{{ scope.row.endDate.getMinutes() }}
      </x-gantt-column>

      <x-gantt-slider prop="name"></x-gantt-slider>
    </x-gantt>
  </div>

  <div>
    共{{ ganttData.length }}条
    <button @click="onAdd">增加</button>
    <button @click="onReduce">减少</button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

let id = 0;

const ganttData = reactive<any>([]);

for (let i = 0; i < 50; i++) {
  onAdd();
}

ganttData[0].children = [
  {
    id: ++id,
    name: 'sub-t' + id,
    startDate: new Date(2020, 0, 1),
    endDate: new Date(2020, 0, 5)
  },
  {
    id: ++id,
    name: 'sub-t' + id,
    startDate: new Date(2020, 0, 1),
    endDate: new Date(2020, 0, 5),
    children: [
      {
        id: ++id,
        name: 'sub-sub-t' + id,
        startDate: new Date(2020, 0, 1),
        endDate: new Date(2020, 0, 5)
      }
    ]
  }
];

function onAdd() {
  ganttData.push({
    id: ++id,
    name: 't' + id,
    startDate: new Date(2020, 0, id),
    endDate: new Date(2020, 0, id + 5)
  });
}

function onReduce() {
  ganttData.splice(ganttData.length - 1, 1);
}

const onClickRow = (data: any) => {
  console.log('click row', data);
};
</script>

<style scoped></style>
