<template>
  <div style="top: 20vh; width: 100%; height: 500px">
    <x-gantt :data="ganttData">
      <x-gantt-column label="group1">
        <x-gantt-column prop="id" width="200px"></x-gantt-column>
        <x-gantt-column label="group2">
          <x-gantt-column prop="name"></x-gantt-column>
          <x-gantt-column prop="name2"></x-gantt-column>
        </x-gantt-column>
      </x-gantt-column>

      <div>div</div>

      <x-gantt-column v-slot="scope" prop="标签3">{{
        scope.startDate
      }}</x-gantt-column>

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

for (let i = 0; i < 20; i++) {
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
    startDate: new Date(2020, 0, 1),
    endDate: new Date(2020, 0, 5)
  });
}

function onReduce() {
  ganttData.splice(ganttData.length - 1, 1);
}
</script>

<style scoped></style>
