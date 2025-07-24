<template>
  <div class="app">
    <h1>XGantt Vue 示例</h1>
    <div class="controls">
      <button @click="changePrimaryColor">切换主色调</button>
      <button @click="changeUnit">切换单位</button>
      <button @click="jumpToToday">跳转到今天</button>
      <button @click="addTask">添加任务</button>
      <button @click="refreshData">刷新数据</button>
    </div>

    <div class="gantt-wrapper">
      <XGanttVue
        ref="ganttRef"
        style="height: 400px; width: 800px"
        :options="{
          data: ganttData,
          table: tableConfig,
          chart: chartConfig,
          fields: fieldsConfig,
          links: linksConfig,
          primaryColor: primaryColor,
          unit: currentUnit,
          locale: 'zh',
          highlight: true,
          bar: {
            move: {
              enabled: true,
              single: {
                left: true,
                right: true
              }
            },
            progress: {
              show: true
            }
          }
        }"
        @move="onTaskMove"
        @select="onTaskSelect"
        @click:row="onRowClick"
        @dblclick:row="onRowDoubleClick"
        @error="onError"
        @create:link="addLink"
      />
    </div>

    <!-- 事件日志 -->
    <div class="event-log">
      <h3>事件日志</h3>
      <div class="log-content">
        <div v-for="(log, index) in eventLogs" :key="index" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-event">{{ log.event }}</span>
          <span class="log-data">{{ log.data }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { type XGanttInstance, type IOptions } from "@xpyjs/gantt-vue";
import XGanttVue from "@xpyjs/gantt-vue";
import "@xpyjs/gantt-vue/style.css";

// 甘特图引用
const ganttRef = ref<XGanttInstance>();

// 事件日志
const eventLogs = ref<Array<{ time: string; event: string; data: string }>>([]);

// 添加日志
const addLog = (event: string, data: any) => {
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    event,
    data: JSON.stringify(data, null, 2)
  });

  // 保持最新 50 条记录
  if (eventLogs.value.length > 50) {
    eventLogs.value = eventLogs.value.slice(0, 50);
  }
};

// 甘特图数据
const ganttData = ref([
  {
    id: "1",
    name: "项目规划",
    startTime: "2024-01-01",
    endTime: "2024-01-15",
    progress: 80,
    children: [
      {
        id: "1-1",
        name: "需求分析",
        startTime: "2024-01-01",
        endTime: "2024-01-05",
        progress: 100
      },
      {
        id: "1-2",
        name: "技术选型",
        startTime: "2024-01-06",
        endTime: "2024-01-10",
        progress: 90
      },
      {
        id: "1-3",
        name: "架构设计",
        startTime: "2024-01-11",
        endTime: "2024-01-15",
        progress: 60
      }
    ]
  },
  {
    id: "2",
    name: "开发阶段",
    startTime: "2024-01-16",
    endTime: "2024-03-15",
    progress: 45,
    children: [
      {
        id: "2-1",
        name: "前端开发",
        startTime: "2024-01-16",
        endTime: "2024-02-15",
        progress: 70
      },
      {
        id: "2-2",
        name: "后端开发",
        startTime: "2024-01-20",
        endTime: "2024-02-20",
        progress: 60
      },
      {
        id: "2-3",
        name: "数据库设计",
        startTime: "2024-01-16",
        endTime: "2024-01-25",
        progress: 100
      },
      {
        id: "2-4",
        name: "接口联调",
        startTime: "2024-02-21",
        endTime: "2024-03-15",
        progress: 10
      }
    ]
  },
  {
    id: "3",
    name: "测试阶段",
    startTime: "2024-03-01",
    endTime: "2024-03-31",
    progress: 20,
    children: [
      {
        id: "3-1",
        name: "单元测试",
        startTime: "2024-03-01",
        endTime: "2024-03-10",
        progress: 50
      },
      {
        id: "3-2",
        name: "集成测试",
        startTime: "2024-03-11",
        endTime: "2024-03-20",
        progress: 20
      },
      {
        id: "3-3",
        name: "系统测试",
        startTime: "2024-03-21",
        endTime: "2024-03-31",
        progress: 0
      }
    ]
  },
  {
    id: "4",
    name: "上线部署",
    startTime: "2024-04-01",
    endTime: "2024-04-15",
    progress: 0
  }
]);

// 表格配置
const tableConfig = reactive<Required<IOptions>["table"]>({
  width: 300,
  columns: [
    {
      field: "name",
      label: "任务名称",
      width: 200,
      align: "left"
    },
    {
      field: "progress",
      label: "进度",
      width: 80,
      align: "center",
      render: row => {
        const p = `${row.data.progress || 0}%`;
        return `<div style="width: 100%; height: 20px; background: #f0f0f0; border-radius: 4px;">
                  <div style="width: ${p}; height: 100%; background: #1890ff; border-radius: 4px;"></div>
                </div>`;
      }
    },
    {
      field: "startTime",
      label: "开始时间",
      width: 120,
      align: "center"
    }
  ]
});

// 图表配置
const chartConfig = reactive({
  // show: true
});

// 字段配置
const fieldsConfig = reactive({
  id: "id",
  startTime: "startTime",
  endTime: "endTime",
  name: "name",
  progress: "progress",
  children: "children"
});

// 连线配置
const linksConfig = reactive({
  data: [
    { id: "link1", from: "1-1", to: "1-2", type: "FS" },
    { id: "link2", from: "1-2", to: "1-3", type: "FS" },
    { id: "link3", from: "1", to: "2", type: "FS" },
    { id: "link4", from: "2-3", to: "2-1", type: "FS" },
    { id: "link5", from: "2-3", to: "2-2", type: "FS" }
  ],
  key: "id",
  show: true,
  create: {
    enabled: true,
    mode: "hover" as const,
    radius: 3,
    width: 2,
    from: true,
    to: true
  },
  distance: 20,
  gap: 5,
  dash: [6, 3],
  width: 1,
  arrow: {
    width: 8,
    height: 8
  },
  radius: 3
});

// 事件处理函数
const onTaskMove = (moved: Array<{ row: any; old: any }>) => {
  addLog("任务移动", moved);
  console.log("任务移动:", moved);
};

const onTaskSelect = (selected: any[], checked: boolean, all: any[]) => {
  addLog("任务选择", { selected, checked, all });
  console.log("任务选择:", { selected, checked, all });
};

const onRowClick = (event: MouseEvent, row: any) => {
  addLog("行点击", { row: row.name });
  console.log("行点击:", row);
};

const onRowDoubleClick = (event: MouseEvent, row: any) => {
  addLog("行双击", { row: row.name });
  console.log("行双击:", row);
};

const onError = (error: any) => {
  addLog("错误", error);
  console.error("甘特图错误:", error);
};

const addLink = (link: any) => {
  link = { ...link, id: `link-${Date.now()}` }; // 自动生成唯一 ID
  addLog("添加连线", link);
  console.log("添加连线:", link);
  linksConfig.data.push(link);
};

// 操作函数
const jumpToToday = () => {
  const success = ganttRef.value?.getInstance()?.jumpTo();
  addLog("跳转到今天", { success });
};

const addTask = () => {
  const newTask = {
    id: `new-${Date.now()}`,
    name: `新任务 ${ganttData.value.length + 1}`,
    startTime: "2024-01-20",
    endTime: "2024-01-25",
    progress: 0
  };

  ganttData.value.push(newTask);
  addLog("添加任务", newTask);
};

const refreshData = () => {
  // 模拟刷新数据
  ganttData.value = [...ganttData.value];
  addLog("刷新数据", "数据已刷新");
};

const units = ["hour", "day", "week", "month", "quarter"] as const;
const currentUnit = ref<(typeof units)[number]>("day");
const changeUnit = () => {
  const currentIndex = units.indexOf(currentUnit.value);
  const newIndex = (currentIndex + 1) % units.length;
  const newUnit = units[newIndex];
  addLog("切换单位", { from: currentUnit.value, to: newUnit });
  currentUnit.value = newUnit;
};

const primaryColor = ref("#1890ff");
const changePrimaryColor = () => {
  const newColor = primaryColor.value === "#1890ff" ? "#52c41a" : "#1890ff";
  addLog("切换主色调", { from: primaryColor.value, to: newColor });
  primaryColor.value = newColor;
};
</script>

<style scoped>
.app {
  padding: 20px;
  font-family: "Arial", sans-serif;
}

h1 {
  color: #1890ff;
  margin-bottom: 20px;
}

.controls {
  margin-bottom: 20px;
}

.controls button {
  margin-right: 10px;
  padding: 8px 16px;
  border: 1px solid #1890ff;
  background: #1890ff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.controls button:hover {
  background: #40a9ff;
  border-color: #40a9ff;
}

.gantt-wrapper {
  margin-bottom: 30px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
}

.event-log {
  max-height: 300px;
  overflow: auto;
}

.event-log h3 {
  margin-bottom: 10px;
  color: #333;
}

.log-content {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  font-family: "Courier New", monospace;
  font-size: 12px;
}

.log-item {
  display: block;
  margin-bottom: 5px;
  padding: 5px;
  background: white;
  border-radius: 3px;
  border-left: 3px solid #1890ff;
}

.log-time {
  color: #666;
  margin-right: 10px;
}

.log-event {
  color: #1890ff;
  font-weight: bold;
  margin-right: 10px;
}

.log-data {
  color: #333;
}
</style>
