<template>
  <div style="margin: 0 auto; width: 500px">
    <img src="@/assets/logo.png" alt="" width="500" />
  </div>

  <div style="height: 400px; padding-bottom: 10px">
    <JGantt
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
      </JGanttSlider>

      <JGanttColumn label="index" :merge="merge3">
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

      <JGanttColumn label="aaa" date-format :merge="merge5">
        <template #default>
          <div v-for="i in 100" :key="i">
            {{ i }}
          </div>
        </template>
      </JGanttColumn>

      <JGanttColumn
        label="startDate"
        width="180"
        center
        date-format
        :merge="merge4"
      />

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

  <button @click="handleClickBg">
    切换到{{ isDark ? `浅色` : `深色` }}模式
  </button>
  <button @click="handleClickReloadData">重新赋值</button>
  <button @click="handleClickEmpty">清空</button>
  <button @click="handleClickModify">修改</button>
  <button @click="handleClickInsert">插入</button>
  <button @click="handleClickInsert2">插入2</button>
  <button @click="handleClickDelete">删除</button>
  <button @click="handleClickColor">切换颜色</button>
  <button @click="() => (showCheckbox = !showCheckbox)">显示checkbox</button>
  <button @click="() => (showWeekend = !showWeekend)">显示weekend</button>
  <button @click="() => (showToday = !showToday)">显示today</button>
  <button @click="() => (showExpand = !showExpand)">显示expand</button>
  <button @click="setSelected">设置选择</button>
  <button @click="jumpTo">跳转到</button>

  <div class="tip-text">按 F12 打开控制台以查看事件输出内容。</div>

  <div class="code-link">
    该页面源代码在
    <a href="https://github.com/jeremyjone/jz-gantt/blob/master/src/App.vue"
      >这里</a
    >
  </div>
</template>

<script>
import { defineComponent } from 'vue';

let INDEX = 1;

export default defineComponent({
  name: 'App',

  data() {
    return {
      isDark: false,
      changeColor: 0,
      dataList: [],
      showCheckbox: true,
      showWeekend: true,
      showToday: true,
      showExpand: true,
      levelColor: [],
      headerStyle: {
        bgColor: '',
        textColor: ''
      },
      bodyStyle: {
        textColor: '',
        todayColor: '',
        weekendColor: ''
        // hoverColor: "#f00",
        // selectColor: "#0f0"
      }
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
        index: i,
        startDate: `2021-08-${s++}`,
        endDate: `2021-10-${e++}`,
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
          index: i,
          startDate: `2021-08-${s++}`,
          endDate: `2021-10-${e++}`,
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
          index: i,
          startDate: `2021-08-${s++}`,
          endDate: `2021-10-${e++}`,
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

  methods: {
    rowClick: function (data) {
      console.log('click row data:', data);
    },

    rowDblClick: function (data) {
      console.log('double click row data:', data);
    },

    rowChecked: function (state, data) {
      console.log('check row:', state, data);
    },

    moveSlider: function (newValue, data) {
      console.log('move slider:', newValue, data);
    },

    noDateError: function (date) {
      console.log(`${date}不在范围内`);
    },

    merge3: function (data) {
      return data.index % 3 !== 0;
    },

    merge4: function (data) {
      return data.index % 4 !== 0;
    },

    merge5: function (data) {
      return data.index % 5 !== 0;
    },

    handleMove: function ({ level }) {
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
          index: i,
          startDate: `2020-06-${s++}`,
          endDate: `2020-08-${e++}`,
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
            index: i,
            startDate: `2021-06-${s++}`,
            endDate: `2021-07-${e++}`,
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
            index: i,
            startDate: `2021-07-${s++}`,
            endDate: `2021-08-${e++}`,
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
        startDate: '2020-08-10',
        endDate: '2020-09-21'
      });

      Object.assign(this.dataList[0]['children'][2]['children'][0], {
        startDate: `2020-08-13`,
        endDate: `2020-09-17`,
        name: '孙数据: abcde'
      });
    },

    handleClickInsert: function () {
      // 数组的增减，根级操作直接更新，子级操作需要重新赋值，以促使DOM更新
      // 修改原有数据不需要这样的操作，因为内部使用了Proxy
      this.dataList.unshift({
        index: INDEX++,
        startDate: `2020-08-10`,
        endDate: `2020-09-20`,
        name: '数据: ' + INDEX,
        ttt: {
          a: 's-aaa' + INDEX,
          b: 's-bbb' + INDEX
        },
        children: []
      });
    },

    handleClickInsert2: function () {
      this.dataList[0]['children'].unshift({
        index: INDEX++,
        startDate: `2020-08-15`,
        endDate: `2020-09-13`,
        name: '子数据: ' + INDEX,
        ttt: {
          a: 's-aaa' + INDEX,
          b: 's-bbb' + INDEX
        },
        children: [
          {
            index: INDEX++,
            startDate: `2020-08-21`,
            endDate: `2020-09-5`,
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

    handleClickBg() {
      this.isDark = !this.isDark;
    },

    setSelected() {
      this.$refs.gantt.setSelected(this.dataList[0]);
    },

    jumpTo() {
      this.$refs.gantt.jumpToDate();
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
</style>
