<template>
  <XGanttVue
    ref="ganttRef"
    style="height: 400px; width: 800px"
    :options="ganttOptions"
    @click:row="click"
  />
</template>


<script setup lang="ts">
import { ref, onMounted } from "vue";
import { XGanttVue, dayjs, type XGanttVueProps, type XGanttVueEmits, } from "@xpyjs/gantt-vue";
import "@xpyjs/gantt-vue/style.css";
const startDate = dayjs("2024-1-1");
const endDate = dayjs("2025-2-1");

// type ConvertEmits = {
//   [P in keyof T]: (...args: T[P] extends any[] ? T[P] : [T[P]]) => void;
// };
// type IOnEvent = Partial<ConvertEmits>;

const ganttOptions = ref<XGanttVueProps["options"]>({
  primaryColor: "#537cfa",
  data: [],
  table: {
    columns: [
      { field: "name", label: "任务名称", width: 100 },
      { field: "startTime", label: "开始时间", width: 150 },
      { field: "endTime", label: "结束时间", width: 150 },
    ],
  },
  chart: {
    // startTime: startDate.toDate(),
    // endTime: endDate.toDate(),
  },
});
const onEvent: any = {};

let ids = 0;
let idss = 0;
const gatData = (length: number = 10) => {
  idss++;
  return Array.from({ length }).map((_, index) => {
    const day = Math.random() * 365;
    const startTime = startDate.add(day, "day");
    const id = ids++;
    return {
      id: id,
      name: "项目规划" + idss + index,
      startTime: startTime.format("YYYY-MM-DD"),
      endTime: startTime.add(3, "day").format("YYYY-MM-DD"),
      progress: Math.floor(Math.random() * 100),
    };
  });
};
const click = () => {
  ganttOptions.value.data = gatData(5);
};

onMounted(() => {
  ganttOptions.value.data = gatData(5);
});
</script>

<style lang="css">
 .body,
 * {
   margin: 0;
 }
</style>