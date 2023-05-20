<template>
  <div style="top: 20vh; width: 100%; height: 500px; padding-left: 5vw">
    <x-gantt
      ref="ganttRef"
      data-id="index"
      :data="ganttData"
      :links="ganttLinks"
      :border-color="borderColor"
      show-checkbox
      :show-expand="showExpand"
      :expand-all="expandAll"
      :show-today="true"
      :show-weekend="true"
      :unit="(unit as any)"
      :dark="isDark"
      @row-click="onClickRow"
      @row-dbl-click="onDblClickRow"
      @row-checked="onCheckedRow"
      @move-slider="onMoveSlider"
      @add-link="onAddLink"
      @click-link="onClickLink"
      @no-date-error="onNoDateError"
    >
      <x-gantt-column label="group1">
        <x-gantt-column
          prop="index"
          width="120px"
          :column-style="{ 'background-color': 'yellow' }"
        ></x-gantt-column>
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

      <x-gantt-slider
        prop="o.t1"
        :move="onMove"
        resize-left
        resize-right
        linked-resize
        progress
      >
        <!-- <template #content="scope">
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
        </template> -->

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
    <button @click="onExpandAll">
      {{ expandAll ? '闭合' : '展开' }}
    </button>
    <button @click="onChangeBorderColor">border颜色</button>
    <button @click="changeUnit">切换单位</button>
    <button @click="jumpToDate">跳转到</button>
    <button @click="setSelected">设置选择</button>
    <button @click="setDark">{{ isDark ? '浅色' : '深色' }}</button>
  </div>

  <div style="width: 100%; height: 400px; margin-top: 50px">
    <x-gantt
      data-id="index"
      :data="ganttData2"
      :show-today="true"
      @row-click="onClickRow2"
      @row-dbl-click="onDblClickRow2"
      @row-checked="onCheckedRow2"
    >
      <!-- <x-gantt-column label="group2">
        <x-gantt-column
          prop="index"
          width="120px"
          :column-style="{ 'background-color': 'yellow' }"
        ></x-gantt-column>
        <x-gantt-column label="group2">
          <x-gantt-column
            prop="name"
            :merge="(scope: any) => scope.$index % 3 === 0"
          ></x-gantt-column>
        </x-gantt-column>
      </x-gantt-column>

      <x-gantt-column
        label="结束日期"
        prop="endDate"
        date-format="MM-dd HH:mm:ss"
        ellipsis
      /> -->

      <x-gantt-slider prop="o.t1" :allow-link="false"> </x-gantt-slider>
    </x-gantt>
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
    startDate: new Date(2023, 3, 5),
    endDate: new Date(2023, 3, 10),
    progress: 0.8,
    o: { t1: 'a', t2: 'b' }
  },
  {
    index: ++id,
    name: 'sub-t' + id,
    startDate: new Date(2023, 3, 6),
    endDate: new Date(2023, 3, 10),
    progress: 0.5,
    o: { t1: 'a', t2: 'b' },
    children: [
      {
        index: ++id,
        name: 'sub-sub-t' + id,
        startDate: new Date(2023, 3, 5),
        endDate: new Date(2023, 3, 10),
        progress: 0.3333333333,
        o: { t1: 'a', t2: 'b' }
      }
    ]
  }
];

let linkId = 1;
const ganttLinks = reactive([
  {
    index: linkId++,
    from: 1,
    to: 2,
    color: 'green'
  },
  {
    index: linkId++,
    from: 2,
    to: 5
  },
  {
    index: linkId++,
    from: 4,
    to: 2,
    color: 'red'
  },
  {
    index: linkId++,
    from: 4,
    to: 3,
    color: '#abc'
  }
]);

const showExpand = ref(true);
function onExpand() {
  showExpand.value = !showExpand.value;
}
const expandAll = ref(true);
function onExpandAll() {
  expandAll.value = !expandAll.value;
}

const isDark = ref(false);
function setDark() {
  isDark.value = !isDark.value;
}

const colors = [
  '#eca710',
  '#e31010',
  '#2196F3',
  '#ff0000',
  '#4CAF50',
  '#FFC107'
];
const borderColor = ref('');
function onChangeBorderColor() {
  borderColor.value = colors[Math.floor(Math.random() * colors.length)];
}

const unit = ref('day');
const changeUnit = () => {
  const u = ['month', 'week', 'day', 'hour'];
  unit.value = u[(u.indexOf(unit.value) + 1) % u.length];
  console.log('unit', unit.value);
};

function onAdd() {
  ganttData.push({
    index: ++id,
    name: 't' + id,
    startDate: new Date(2023, 4, id),
    endDate: new Date(2023, 4, id + 5),
    o: { t1: 'a', t2: 'b' }
  });
}

function onReduce() {
  ganttData.splice(ganttData.length - 1, 1);
}

const onClickRow = (data: any) => {
  console.log('click row', data);
};

const onDblClickRow = (data: any) => {
  console.log('dblclick row', data);
};

const onCheckedRow = (state: boolean, data: any) => {
  console.log('checked row', state, data);
};

const onMoveSlider = (data: any) => {
  console.log('move slider', data);
};

const onAddLink = (
  link: any,
  data: { from: any; to: any },
  cb: (link: any) => void
) => {
  const _link = {
    index: linkId++,
    from: link.from,
    to: link.to,
    color: 'green'
  };
  ganttLinks.push(_link);

  console.log('add link', _link, data, ganttLinks);
  cb(_link);
};

const onClickLink = (link: any | null) => {
  console.log('click link', link);

  if (link) {
    setTimeout(() => {
      ganttLinks.splice(
        ganttLinks.findIndex(l => l.from === link.from && l.to === link.to),
        1
      );
      console.log('remove link', ganttLinks);
    }, 1000);
  }
};

function onMove(data: any) {
  return true;
}

const onNoDateError = (date: Date) => {
  console.log('no date error', date);
};

const ganttRef = ref(null) as any;
function jumpToDate() {
  ganttRef.value?.jumpToDate();
}
function setSelected() {
  const s = ganttRef.value?.setSelected(ganttData[0]);
  console.log('setSelected', s);
}

let id2 = 0;

const ganttData2 = reactive<any>([]);

function onAdd2() {
  ganttData2.push({
    index: ++id2,
    name: 't' + id2,
    startDate: new Date(2023, 5, id2),
    endDate: new Date(2023, 5, id2 + 5),
    o: { t1: 'a', t2: 'b' }
  });
}

for (let i = 0; i < 10; i++) {
  onAdd2();
}

ganttData2[0].children = [
  {
    index: ++id2,
    name: 'sub-t' + id2,
    startDate: new Date(2023, 5, 1),
    endDate: new Date(2023, 5, 5),
    o: { t1: 'a', t2: 'b' }
  },
  {
    index: ++id2,
    name: 'sub-t' + id2,
    startDate: new Date(2023, 5, 1),
    endDate: new Date(2023, 5, 5),
    o: { t1: 'a', t2: 'b' },
    children: [
      {
        index: ++id2,
        name: 'sub-sub-t' + id2,
        startDate: new Date(2023, 5, 1),
        endDate: new Date(2023, 5, 5),
        o: { t1: 'a', t2: 'b' }
      }
    ]
  }
];

const onClickRow2 = (data: any) => {
  console.log('click row', data);
};

const onDblClickRow2 = (data: any) => {
  console.log('dblclick row', data);
};

const onCheckedRow2 = (state: boolean, data: any) => {
  console.log('checked row', state, data);
};

// const onMoveSlider2 = (data: any) => {
//   console.log('move slider', data);
// };

// const onNoDateError2 = (date: Date) => {
//   console.log('no date error', date);
// };
</script>

<style scoped></style>
