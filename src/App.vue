<template>
  <div style="margin: 0 auto; width: 500px">
    <img src="@/assets/logo.png" alt="" width="500" />
  </div>

  <div
    style="
      display: flex;
      justify-content: center;
      margin-bottom: 10px;
      gap: 10px;
    "
  >
    <button
      :style="{ backgroundColor: !isMulti ? 'aqua' : '' }"
      @click="() => (isMulti = false)"
    >
      单页
    </button>
    <button
      :style="{ backgroundColor: isMulti ? 'aqua' : '' }"
      @click="() => (isMulti = true)"
    >
      多页
    </button>
  </div>

  <!-- 已知问题，不要用 v-show 进行切换。 -->
  <!-- 原因：1、加载数据过多，对页面不友好 -->
  <!--      2、内部不会响应变化，导致初次加载未显示的图表数据加载不全（因为组件高度为 0） -->
  <!-- 使用 v-if 可以避免上面问题。但是如果数据量大，每次切换会有等待时间，同样值得解决 -->
  <div v-if="!isMulti" aria-label="单页">
    <div style="height: 400px; padding-bottom: 10px">
      <JGantt
        ref="gantt"
        header-height="48"
        row-height="30"
        data-index="id"
        start-key="startTime"
        end-key="endTime"
        expand-all
        :dark="isDark"
        :gantt-column-size="colSize"
        :show-checkbox="showCheckbox"
        :show-weekend="showWeekend"
        :show-today="showToday"
        :show-expand="showExpand"
        :data="dataList"
        :header-style="headerStyle"
        :body-style="bodyStyle"
        :level-color="levelColor"
        :show-setting-btn="showSettingBtn"
        @row-click="rowClick"
        @row-dbl-click="rowDblClick"
        @row-checked="rowChecked"
        @move-slider="moveSlider"
        @no-date-error="noDateError"
      >
        <!-- 无效 slot -->
        <template>
          <div>123</div>
        </template>

        <!-- 无效 slot -->
        <div>a</div>

        <!-- 无效 slot -->
        <div>b</div>

        <JGanttSlider
          flat
          label="startTime"
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
        </JGanttSlider>

        <JGanttColumn label="id" :merge="merge3">
          <template #default="{ data }">
            <div style="background-color: #ccc; width: 100%">
              {{ data.name }}
            </div>
          </template>
        </JGanttColumn>

        <JGanttColumn label="name" width="150" :merge="merge3">
          <template #default="{ data }">
            <div>2 - {{ data }}</div>
          </template>
        </JGanttColumn>

        <JGanttColumn
          label="ttt.a"
          :merge="merge5"
          column-style="backgroundColor: #cde; padding-left: 10px"
          column-class="test-class"
        />

        <JGanttColumn label="bbb" date-format :merge="merge5">
          <template #default>
            <div v-for="i in 100" :key="i">
              {{ i }}
            </div>
          </template>
        </JGanttColumn>

        <JGanttColumn
          label="startTime"
          width="180"
          center
          date-format
          :merge="merge4"
        />

        <j-gantt-column
          label="endTime"
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
              abc - {{ data.endTime }}
            </span>
          </template>
        </j-gantt-column>

        <JGanttColumn label="picture12345" :merge="merge5">
          <template #default="{ data }">
            👀😃✨✔🐱‍🚀🐱‍👓 {{ data.ttt.b }}
          </template>
        </JGanttColumn>

        <template #settings>
          <div>
            <p>标题</p>
            <input />
          </div>
        </template>
      </JGantt>
    </div>

    <div>total: {{ dataList.length }}</div>

    <button @click="() => (isDark = !isDark)">
      切换到{{ isDark ? `浅色` : `深色` }}模式
    </button>
    <button @click="handleClickReloadData">重新赋值</button>
    <button @click="handleClickEmpty">清空</button>
    <button @click="handleClickModify">修改</button>
    <button @click="handleClickInsert">插入</button>
    <button @click="handleClickInsertChildren">插入子项</button>
    <button @click="handleClickDelete">删除</button>
    <button @click="handleClickColor">切换颜色</button>
    <button @click="() => (showCheckbox = !showCheckbox)">显示checkbox</button>
    <button @click="() => (showWeekend = !showWeekend)">显示weekend</button>
    <button @click="() => (showToday = !showToday)">显示today</button>
    <button @click="() => (showExpand = !showExpand)">显示expand</button>
    <button @click="setSelected">设置选择</button>
    <button @click="jumpTo">跳转到</button>
    <button @click="() => (showSettingBtn = !showSettingBtn)">
      显示设置按钮
    </button>
    <template v-if="!showSettingBtn">
      <div style="display: inline-block">
        选择列宽
        <button @click="() => (colSize = 'small')">小</button>
        <button @click="() => (colSize = 'normal')">中</button>
        <button @click="() => (colSize = 'large')">大</button>
      </div>

      <div style="display: inline-block">
        选择显示
        <button @click="() => setHeaderUnit('day')">日</button>
        <button @click="() => setHeaderUnit('week')">周</button>
        <button @click="() => setHeaderUnit('month')">月</button>
      </div>
    </template>
  </div>

  <div v-else aria-label="多页">
    <div style="padding-bottom: 10px">
      <div style="height: 200px; padding-bottom: 10px">
        <JGantt
          ref="gantt2"
          header-height="60"
          row-height="40"
          data-index="index"
          expand-all
          :dark="isDark2"
          :gantt-column-size="colSize2"
          :show-checkbox="showCheckbox2"
          :show-weekend="showWeekend2"
          :show-today="showToday2"
          :show-expand="showExpand2"
          :data="dataList2"
          :header-style="headerStyle2"
          :body-style="bodyStyle2"
          :level-color="levelColor2"
          :show-setting-btn="showSettingBtn2"
          @row-click="rowClick"
          @row-dbl-click="rowDblClick"
          @row-checked="rowChecked"
          @move-slider="moveSlider"
          @no-date-error="noDateError"
        >
          <JGanttSlider
            flat
            label="name"
            date-format="MM-dd H:mm:ss"
            empty-data=""
          />

          <JGanttColumn label="index" :merge="merge3">
            <template #default="{ data }">
              <div style="background-color: #ccc; width: 100%">
                {{ data.name }}
              </div>
            </template>
          </JGanttColumn>

          <j-gantt-column
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
          </j-gantt-column>
        </JGantt>
      </div>

      <div>total: {{ dataList2.length }}</div>

      <button @click="() => (isDark2 = !isDark2)">
        切换到{{ isDark2 ? `浅色` : `深色` }}模式
      </button>
      <button @click="handleClickReloadData2">重新赋值</button>
      <button @click="handleClickEmpty2">清空</button>
      <button @click="handleClickModify2">修改</button>
      <button @click="handleClickInsert2">插入</button>
      <button @click="handleClickInsertChildren2">插入子项</button>
      <button @click="handleClickDelete2">删除</button>
      <button @click="handleClickColor2">切换颜色</button>
      <button @click="() => (showCheckbox2 = !showCheckbox2)">
        显示checkbox
      </button>
      <button @click="() => (showWeekend2 = !showWeekend2)">显示weekend</button>
      <button @click="() => (showToday2 = !showToday2)">显示today</button>
      <button @click="() => (showExpand2 = !showExpand2)">显示expand</button>
      <button @click="setSelected2">设置选择</button>
      <button @click="jumpTo2">跳转到</button>
      <button @click="() => (showSettingBtn2 = !showSettingBtn2)">
        显示设置按钮
      </button>
      <template v-if="!showSettingBtn2">
        <div style="display: inline-block">
          选择列宽
          <button @click="() => (colSize2 = 'small')">小</button>
          <button @click="() => (colSize2 = 'normal')">中</button>
          <button @click="() => (colSize2 = 'large')">大</button>
        </div>

        <div style="display: inline-block">
          选择显示
          <button @click="() => setHeaderUnit2('day')">日</button>
          <button @click="() => setHeaderUnit2('week')">周</button>
          <button @click="() => setHeaderUnit2('month')">月</button>
        </div>
      </template>
    </div>

    <div style="padding-bottom: 10px">
      <div style="height: 300px; padding-bottom: 10px">
        <JGantt
          ref="gantt3"
          header-height="30"
          row-height="20"
          data-index="uid"
          expand-all
          :dark="isDark3"
          :gantt-column-size="colSize3"
          :show-checkbox="showCheckbox3"
          :show-weekend="showWeekend3"
          :show-today="showToday3"
          :show-expand="showExpand3"
          :data="dataList3"
          :header-style="headerStyle3"
          :body-style="bodyStyle3"
          :level-color="levelColor3"
          :show-setting-btn="showSettingBtn3"
          @row-click="rowClick"
          @row-dbl-click="rowDblClick"
          @row-checked="rowChecked"
          @move-slider="moveSlider"
          @no-date-error="noDateError"
        >
          <JGanttSlider
            flat
            label="uid"
            date-format="MM-dd H:mm:ss"
            empty-data=""
            :move="handleMove"
            :resize-left="true"
            :resize-right="true"
            :linked-resize="true"
            bg-color="lightgreen"
          />

          <JGanttColumn label="name" width="150">
            <template #default="{ data }">
              <div>{{ data.uid }} - {{ data.name }}</div>
            </template>
          </JGanttColumn>

          <JGanttColumn
            label="ttt.a"
            column-style="backgroundColor: #cde; padding-left: 10px"
            column-class="test-class"
          />
        </JGantt>
      </div>

      <div>total: {{ dataList3.length }}</div>

      <button @click="() => (isDark3 = !isDark3)">
        切换到{{ isDark3 ? `浅色` : `深色` }}模式
      </button>
      <button @click="handleClickReloadData3">重新赋值</button>
      <button @click="handleClickEmpty3">清空</button>
      <button @click="handleClickModify3">修改</button>
      <button @click="handleClickInsert3">插入</button>
      <button @click="handleClickInsertChildren3">插入子项</button>
      <button @click="handleClickDelete3">删除</button>
      <button @click="handleClickColor3">切换颜色</button>
      <button @click="() => (showCheckbox3 = !showCheckbox3)">
        显示checkbox
      </button>
      <button @click="() => (showWeekend3 = !showWeekend3)">显示weekend</button>
      <button @click="() => (showToday3 = !showToday3)">显示today</button>
      <button @click="() => (showExpand3 = !showExpand3)">显示expand</button>
      <button @click="setSelected3">设置选择</button>
      <button @click="jumpTo3">跳转到</button>
      <button @click="() => (showSettingBtn3 = !showSettingBtn3)">
        显示设置按钮
      </button>
      <template v-if="!showSettingBtn3">
        <div style="display: inline-block">
          选择列宽
          <button @click="() => (colSize3 = 'small')">小</button>
          <button @click="() => (colSize3 = 'normal')">中</button>
          <button @click="() => (colSize3 = 'large')">大</button>
        </div>

        <div style="display: inline-block">
          选择显示
          <button @click="() => setHeaderUnit3('day')">日</button>
          <button @click="() => setHeaderUnit3('week')">周</button>
          <button @click="() => setHeaderUnit3('month')">月</button>
        </div>
      </template>
    </div>
  </div>

  <div class="tip-text">按 F12 打开控制台以查看事件输出内容。</div>

  <div class="code-link">
    该页面源代码在
    <a href="https://github.com/jeremyjone/jz-gantt/blob/master/src/App.vue"
      >这里</a
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

let INDEX = 1;

export default defineComponent({
  name: 'App',

  data() {
    return {
      isMulti: false,
      changeColor: 0,
      isDark: false,
      dataList: [] as any[],
      showCheckbox: true,
      showWeekend: true,
      showToday: true,
      showExpand: true,
      levelColor: [] as string[],
      headerStyle: {
        bgColor: '',
        textColor: ''
      } as any,
      bodyStyle: {
        textColor: '',
        todayColor: '',
        weekendColor: ''
        // hoverColor: "#f00",
        // selectColor: "#0f0"
      } as any,
      colSize: 'normal',
      showSettingBtn: true,

      isDark2: false,
      dataList2: [] as any[],
      showCheckbox2: true,
      showWeekend2: true,
      showToday2: true,
      showExpand2: true,
      levelColor2: ['#123456', '#654321'] as string[],
      headerStyle2: {
        bgColor: '#684',
        textColor: ''
      } as any,
      bodyStyle2: {
        textColor: '',
        todayColor: '',
        weekendColor: ''
        // hoverColor: "#f00",
        // selectColor: "#0f0"
      } as any,
      colSize2: 'large',
      showSettingBtn2: true,

      isDark3: false,
      dataList3: [] as any[],
      showCheckbox3: true,
      showWeekend3: true,
      showToday3: true,
      showExpand3: true,
      levelColor3: ['', '#7A1', '#123'] as string[],
      headerStyle3: {
        bgColor: '#9c5',
        textColor: ''
      } as any,
      bodyStyle3: {
        bgColor: '#491614',
        textColor: 'white',
        todayColor: '',
        weekendColor: '',
        hoverColor: '#f00',
        selectColor: '#501'
      } as any,
      colSize3: 'small',
      showSettingBtn3: true
    };
  },

  created() {
    // 测试数据
    let s = 2;
    let e = 15;
    for (let i = 0; i < 1000; i++) {
      if (s > e) {
        let t = s;
        s = e;
        e = t;
      }
      this.dataList.push({
        id: i,
        startTime: `2021-08-${s++}`,
        endTime: `2021-10-${e++}`,
        ttt: {
          a: 'aaa',
          b: 'bbb'
        },
        name: '我的数据: ' + s,
        children: []
      });
      if (s > 30) s = 2;
      if (e > 30) e = 5;
    }
    // 二级数据
    for (let i = 0; i < 50; i++) {
      if (s > e) {
        let t = s;
        s = e;
        e = t;
      }
      [0, 1, 3, 4, 5, 7, 9].forEach(index => {
        this.dataList[index]['children'].push({
          id: i,
          startTime: `2021-08-${s++}`,
          endTime: `2021-10-${e++}`,
          name: '子数据: ' + s,
          ttt: {
            a: 's-aaa',
            b: 's-bbb'
          },
          children: []
        });
      });
      if (s > 30) s = 2;
      if (e > 30) e = 5;
    }
    // 三级数据
    for (let i = 0; i < 50; i++) {
      if (s > e) {
        let t = s;
        s = e;
        e = t;
      }
      [0, 2].forEach(index => {
        this.dataList[0]['children'][index]['children'].push({
          id: i,
          startTime: `2021-08-${s++}`,
          endTime: `2021-10-${e++}`,
          name: '孙数据: ' + s,
          ttt: {
            a: 'gs-aaa',
            b: 'gs-bbb'
          },
          children: []
        });
      });
      if (s > 30) s = 2;
      if (e > 30) e = 5;
    }

    // 添加2号数据
    this.dataList2 = [
      {
        index: 1,
        startDate: '2021-11-01',
        endDate: '2021-11-10',
        name: '2号数据: 1',
        children: []
      },
      {
        index: 2,
        startDate: '2021-11-11',
        endDate: '2021-11-20',
        name: '2号数据: 2',
        children: []
      },
      {
        index: 3,
        startDate: '2021-11-21',
        endDate: '2021-11-30',
        name: '2号数据: 3',
        children: []
      }
    ];

    // 添加3号数据
    this.dataList3 = [
      {
        uid: 1,
        startDate: '2021-10-01',
        endDate: '2021-10-10',
        name: '3号数据: 1',
        ttt: {
          a: 'aaa1',
          b: 'bbb1'
        },
        children: []
      },
      {
        uid: 2,
        startDate: '2021-10-11',
        endDate: '2021-10-20',
        name: '3号数据: 2',
        ttt: {
          a: 'aaa2',
          b: 'bbb2'
        },
        children: []
      },
      {
        uid: 3,
        startDate: '2021-10-21',
        endDate: '2021-10-30',
        name: '3号数据: 3',
        ttt: {
          a: 'aaa3',
          b: 'bbb3'
        },
        children: []
      },
      {
        uid: 4,
        startDate: '2021-10-31',
        endDate: '2021-11-10',
        name: '3号数据: 4',
        ttt: {
          a: 'aaa4',
          b: 'bbb4'
        },
        children: []
      }
    ];
  },

  methods: {
    rowClick: function (data: any) {
      console.log('click row data:', data);
    },

    rowDblClick: function (data: any) {
      console.log('double click row data:', data);
    },

    rowChecked: function (state: boolean, data: any) {
      console.log('check row:', state, data);
    },

    moveSlider: function (data: any[], old: { start: Date; end: Date }) {
      console.log('move slider:', data, old);
    },

    noDateError: function (date: Date) {
      console.log(`${date}不在范围内`);
    },

    merge3: function (data: any) {
      return data.id % 3 !== 0;
    },

    merge4: function (data: any) {
      return data.id % 4 !== 0;
    },

    merge5: function (data: any) {
      return data.id % 5 !== 0;
    },

    handleMove: function ({ level }: { data: any; level: number }) {
      return level !== 1;
    },

    handleClickReloadData: function () {
      let s = 2;
      let e = 15;
      for (let i = 0; i < 50000; i++) {
        if (s > e) {
          let t = s;
          s = e;
          e = t;
        }
        this.dataList.push({
          id: i,
          startTime: `2020-06-${s++}`,
          endTime: `2020-08-${e++}`,
          ttt: {
            a: 'aaa',
            b: 'bbb'
          },
          name: '我的数据: ' + s,
          children: []
        });
        if (s > 30) s = 2;
        if (e > 30) e = 5;
      }
      // 二级数据
      for (let i = 0; i < 5; i++) {
        if (s > e) {
          let t = s;
          s = e;
          e = t;
        }
        [0, 1, 3, 4, 5, 7, 9].forEach(index => {
          this.dataList[index]['children'].push({
            id: i,
            startTime: `2021-06-${s++}`,
            endTime: `2021-07-${e++}`,
            name: '子数据: ' + s,
            ttt: {
              a: 's-aaa',
              b: 's-bbb'
            },
            children: []
          });
        });
        if (s > 30) s = 2;
        if (e > 30) e = 5;
      }
      // 三级数据
      for (let i = 0; i < 5; i++) {
        if (s > e) {
          let t = s;
          s = e;
          e = t;
        }
        [0, 2].forEach(index => {
          this.dataList[0]['children'][index]['children'].push({
            id: i,
            startTime: `2021-07-${s++}`,
            endTime: `2021-08-${e++}`,
            name: '孙数据: ' + s,
            ttt: {
              a: 'gs-aaa',
              b: 'gs-bbb'
            },
            children: []
          });
        });
        if (s > 30) s = 2;
        if (e > 30) e = 5;
      }
    },

    handleClickEmpty: function () {
      this.dataList = [];
    },

    handleClickModify: function () {
      Object.assign(this.dataList[0], {
        startTime: '2020-08-10',
        endTime: '2020-09-21'
      });

      Object.assign(this.dataList[0]['children'][2]['children'][0], {
        startTime: `2020-08-13`,
        endTime: `2020-09-17`,
        name: '孙数据: abcde'
      });
    },

    handleClickInsert: function () {
      // 数组的增减，根级操作直接更新，子级操作需要重新赋值，以促使DOM更新
      // 修改原有数据不需要这样的操作，因为内部使用了Proxy
      this.dataList.unshift({
        id: INDEX++,
        startTime: `2020-08-10`,
        endTime: `2020-09-20`,
        name: '数据: ' + INDEX,
        ttt: {
          a: 's-aaa' + INDEX,
          b: 's-bbb' + INDEX
        },
        children: []
      });
    },

    handleClickInsertChildren: function () {
      this.dataList[0]['children'].unshift({
        id: INDEX++,
        startTime: `2020-08-15`,
        endTime: `2020-09-13`,
        name: '子数据: ' + INDEX,
        ttt: {
          a: 's-aaa' + INDEX,
          b: 's-bbb' + INDEX
        },
        children: [
          {
            id: INDEX++,
            startTime: `2020-08-21`,
            endTime: `2020-09-5`,
            name: '孙数据: ' + INDEX,
            ttt: {
              a: 's-aaa' + INDEX,
              b: 's-bbb' + INDEX
            },
            children: []
          }
        ]
      });
      this.dataList = [...this.dataList];
    },

    handleClickDelete: function () {
      // console.log(this.dataList[0]["children"].pop());
      console.log(this.dataList.shift());
    },

    handleClickColor() {
      this.changeColor++;

      if (this.changeColor % 2 !== 0) {
        this.levelColor = ['green', 'yellow', 'red'];

        this.headerStyle = {
          bgColor: 'black',
          textColor: 'lightgrey'
        };

        this.bodyStyle = {
          bgColor: 'grey',
          textColor: 'grey'
        };
      } else {
        this.levelColor = ['azure', 'cornsilk'];
        this.headerStyle = {
          bgColor: '',
          textColor: ''
        };
        this.bodyStyle = {
          bgColor: '',
          textColor: ''
        };
      }
    },

    setSelected() {
      (this.$refs.gantt as any).setSelected(this.dataList[0]);
    },

    jumpTo() {
      (this.$refs.gantt as any).jumpToDate();
    },

    setHeaderUnit(unit: 'day' | 'week' | 'month') {
      (this.$refs.gantt as any).setHeaderUnit(unit);
    },

    handleClickReloadData2() {
      this.dataList2 = [
        {
          index: 1,
          startDate: '2021-11-01',
          endDate: '2021-11-10',
          name: '2号数据: reload-1',
          children: []
        },
        {
          index: 2,
          startDate: '2021-11-11',
          endDate: '2021-11-20',
          name: '2号数据: reload-2',
          children: []
        },
        {
          index: 3,
          startDate: '2021-11-21',
          endDate: '2021-11-30',
          name: '2号数据: reload-3',
          children: []
        },
        {
          index: 4,
          startDate: '2021-12-01',
          endDate: '2021-12-10',
          name: '2号数据: reload-4',
          children: []
        },
        {
          index: 5,
          startDate: '2021-12-11',
          endDate: '2021-12-20',
          name: '2号数据: reload-5',
          children: []
        },
        {
          index: 6,
          startDate: '2021-12-21',
          endDate: '2021-12-30',
          name: '2号数据: reload-6',
          children: []
        }
      ];
    },

    handleClickEmpty2() {
      this.dataList2 = [];
    },

    handleClickModify2() {
      Object.assign(this.dataList2[0], {
        startDate: '2021-11-10',
        endDate: '2021-11-20'
      });

      Object.assign(this.dataList2[0], {
        startDate: `2021-11-13`,
        endDate: `2021-11-17`,
        name: '2号孙数据: abcde'
      });
    },

    handleClickInsert2() {
      this.dataList2.unshift({
        index: INDEX++,
        startDate: `2021-11-10`,
        endDate: `2021-11-20`,
        name: '2号数据: ' + INDEX,
        children: []
      });
    },

    handleClickInsertChildren2() {
      this.dataList2[0]['children'].unshift({
        index: INDEX++,
        startDate: `2021-11-13`,
        endDate: `2021-11-15`,
        name: '2号子数据: ' + INDEX,
        children: [
          {
            index: INDEX++,
            startDate: `2021-11-5`,
            endDate: `2021-11-21`,
            name: '2号孙数据: ' + INDEX,
            children: []
          }
        ]
      });
      this.dataList2 = [...this.dataList2];
    },

    handleClickDelete2() {
      console.log(this.dataList2.shift());
    },

    handleClickColor2() {
      this.changeColor++;

      if (this.changeColor % 2 !== 0) {
        this.levelColor2 = ['blue', 'pink', 'gray'];

        this.headerStyle2 = {
          bgColor: 'darkgray',
          textColor: 'lightblue'
        };

        this.bodyStyle2 = {
          bgColor: 'lightgray',
          textColor: 'white'
        };
      } else {
        this.levelColor2 = ['#123456', '#654321'];
        this.headerStyle2 = {
          bgColor: '#684',
          textColor: ''
        };
        this.bodyStyle2 = {
          bgColor: '#917',
          textColor: ''
        };
      }
    },

    setSelected2() {
      (this.$refs.gantt2 as any).setSelected(this.dataList2[0]);
    },

    jumpTo2() {
      (this.$refs.gantt2 as any).jumpToDate();
    },

    setHeaderUnit2(unit: 'day' | 'week' | 'month') {
      (this.$refs.gantt2 as any).setHeaderUnit(unit);
    },

    handleClickReloadData3() {
      this.dataList3 = [
        {
          uid: 1,
          startDate: '2021-11-01',
          endDate: '2021-11-10',
          name: '3号数据: reload-1',
          ttt: {
            a: 'aaa',
            b: 'bbb'
          },
          children: []
        },
        {
          uid: 2,
          startDate: '2021-11-11',
          endDate: '2021-11-20',
          name: '3号数据: reload-2',
          ttt: {
            a: 'aaa',
            b: 'bbb'
          },
          children: []
        },
        {
          uid: 3,
          startDate: '2021-11-21',
          endDate: '2021-11-30',
          name: '3号数据: reload-3',
          ttt: {
            a: 'aaa',
            b: 'bbb'
          },
          children: []
        },
        {
          uid: 4,
          startDate: '2021-12-01',
          endDate: '2021-12-10',
          name: '3号数据: reload-4',
          ttt: {
            a: 'aaa',
            b: 'bbb'
          },
          children: []
        }
      ];
    },

    handleClickEmpty3() {
      this.dataList3 = [];
    },

    handleClickModify3() {
      Object.assign(this.dataList3[0], {
        startDate: '2021-11-10',
        endDate: '2021-11-20'
      });

      Object.assign(this.dataList3[0], {
        startDate: `2021-11-13`,
        endDate: `2021-11-17`,
        name: '3号孙数据: abcde'
      });
    },

    handleClickInsert3() {
      this.dataList3.unshift({
        uid: INDEX++,
        startDate: `2021-11-10`,
        endDate: `2021-11-20`,
        name: '3号数据: ' + INDEX,
        ttt: {
          a: 'aaa',
          b: 'bbb'
        },
        children: []
      });
    },

    handleClickInsertChildren3() {
      this.dataList3[0]['children'].unshift({
        uid: INDEX++,
        startDate: `2021-11-12`,
        endDate: `2021-11-15`,
        name: '3号子数据: ' + INDEX,
        ttt: {
          a: 'aaa',
          b: 'bbb'
        },
        children: [
          {
            uid: INDEX++,
            startDate: `2021-11-11`,
            endDate: `2021-11-15`,
            name: '3号孙数据: ' + INDEX,
            ttt: {
              a: 'aaa',
              b: 'bbb'
            },
            children: []
          }
        ]
      });
      this.dataList3 = [...this.dataList3];
    },

    handleClickDelete3() {
      console.log(this.dataList3.shift());
    },

    handleClickColor3() {
      this.changeColor++;

      if (this.changeColor % 2 !== 0) {
        this.levelColor3 = ['purple', 'orange', 'green'];

        this.headerStyle3 = {
          bgColor: 'black',
          textColor: 'brown'
        };

        this.bodyStyle3 = {
          bgColor: 'lightgray',
          textColor: 'white'
        };
      } else {
        this.levelColor3 = ['', '#7A1', '#123'];
        this.headerStyle3 = {
          bgColor: '#9c5',
          textColor: ''
        };
        this.bodyStyle3 = {
          bgColor: '#491614',
          textColor: 'white'
        };
      }
    },

    setSelected3() {
      (this.$refs.gantt3 as any).setSelected(this.dataList3[0]);
    },

    jumpTo3() {
      (this.$refs.gantt3 as any).jumpToDate();
    },

    setHeaderUnit3(unit: 'day' | 'week' | 'month') {
      (this.$refs.gantt3 as any).setHeaderUnit(unit);
    }
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding-top: 50px;
  width: 100%;
  height: 100%;
}

.slider-level-one {
  background-color: #123456;
  height: 5px;
  position: relative;
}

.slider-level-one::before {
  content: '';
  position: absolute;
  left: 0px;
  height: 0px;
  width: 0px;
  border-style: solid;
  border-left-width: 0px;
  border-right-width: 5px;
  border-top-width: 5px;
  border-bottom-width: 10px;
  border-left-color: transparent;
  border-top-color: transparent;
  border-bottom-color: transparent;
  border-right-color: #123456;
}

.slider-level-one::after {
  content: '';
  position: absolute;
  right: 0px;
  height: 0px;
  width: 0px;
  border-style: solid;
  border-left-width: 5px;
  border-right-width: 0px;
  border-top-width: 5px;
  border-bottom-width: 10px;
  border-left-color: #123456;
  border-top-color: #123456;
  border-bottom-color: transparent;
  border-right-color: transparent;
}

.tip-text {
  margin-top: 1rem;
  font-size: 1.5rem;
  color: red;
}

.code-link {
  margin-top: 1rem;
  color: red;
  text-decoration: none;
}

.test-class {
  color: red;
}
</style>
