<template>
  <div class="container">
    <div class="toolbar">
      <el-popover placement="bottom" trigger="click" popper-class="jump-date-popover">
        <template #reference>
          <el-button type="primary">跳转到</el-button>
        </template>
        <el-date-picker-panel v-model="selectedDate"
          :shortcuts="[{ text: '今天', value: () => { return new Date() } }]" />
      </el-popover>

      <el-button type="primary" @click="createTask()">添加任务</el-button>
    </div>

    <XGanttVue ref="ganttRef" :options="ganttOptions" style="flex: 1" @contextmenu:row="onContextmenuRow"
      @contextmenu:slider="onContextmenuSlider" />

    <div class="footer">
      <span>当前数据：{{ (ganttRef?.getInstance() as any)?.context.store.getDataManager().getVisibleSize() }} 条</span>

      <div style="flex: 1; display: flex; align-items: center; justify-content: flex-end; gap: 16px;">
        <span style="color: #999">演示版本 v0.0.1</span>
        <span style="color: #999" id="footer-time">北京时间：{{ currentTime }}</span>
      </div>
    </div>

    <el-dialog title="添加任务" v-model="createTaskDialogVisible" :close-on-click-modal="false" width="30%">
      <el-form :model="form">
        <el-form-item label="任务名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="开始时间" :label-width="formLabelWidth">
          <el-date-picker v-model="form.start" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="结束时间" :label-width="formLabelWidth">
          <el-date-picker v-model="form.end" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="进度(%)" :label-width="formLabelWidth">
          <el-input-number v-model="form.progress" :min="0" :max="100" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createTaskDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addTask">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <ContextMenu v-model:visible="contextMenuVisible" :position="contextMenuPosition" :items="contextMenuItems" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from "vue";
import { XGanttVue, dayjs, IOptions } from "@xpyjs/gantt-vue";
import "@xpyjs/gantt-vue/style.css";
import { data, links, baselines, DATE_FMT, generateId } from './data';
import { ElMessageBox } from "element-plus";
import ContextMenu, { type ContextMenuItem } from "./components/contextMenu/ContextMenu.vue";

const ganttData = reactive(data);

const ganttOptions = reactive<IOptions>({
  primaryColor: '#54bd8a',
  data: ganttData,
  dateFormat: DATE_FMT,
  fields: {
    id: 'id',
    startTime: "start",
    endTime: "end",
    name: 'name',
    progress: 'progress',
    children: "subtask",
    type: 'type'
  },
  links: {
    show: true,
    data: links,
  },
  baselines: {
    show: true,
    data: baselines,
  },
  table: {
    columns: [
      { field: "name", label: "任务名称", width: 230, align: 'left' },
      {
        label: "工期",
        children: [
          { field: "start", label: "开始时间", width: 120 },
          { field: "end", label: "结束时间", width: 120 },
        ]
      },
      { field: "progress", label: "进度(%)", width: 90 }
    ]
  },
  bar: {
    move: {
      enabled: true,
      byUnit: true
    }
  }
})
const ganttRef = ref<InstanceType<typeof XGanttVue> | null>(null);

const selectedDate = ref();
watch(selectedDate, (newVal) => {
  ganttRef.value?.jumpTo(newVal);
})

const createTaskDialogVisible = ref(false);
const formLabelWidth = '80px';
const form = reactive({
  name: '',
  start: '',
  end: '',
  progress: 0,
  parentId: ''
});
function addTask() {
  if (!form.name) {
    ElMessageBox.alert('任务名称不能为空', '提示');
    return;
  }
  if (!form.start) {
    ElMessageBox.alert('开始时间不能为空', '提示');
    return;
  }
  if (!form.end) {
    ElMessageBox.alert('结束时间不能为空', '提示');
    return;
  }
  if (new Date(form.start).getTime() > new Date(form.end).getTime()) {
    ElMessageBox.alert('结束时间不能小于开始时间', '提示');
    return;
  }

  const add = (list: any[]) => {
    list.push({
      id: generateId(),
      name: form.name,
      start: form.start,
      end: form.end,
      progress: form.progress,
      type: 'task'
    });
    createTaskDialogVisible.value = false;
    form.name = '';
    form.start = '';
    form.end = '';
    form.progress = 0;
    form.parentId = '';
  };

  if (form.parentId) {
    const parent = getTaskById(form.parentId, ganttData);
    if (parent) {
      if (!Array.isArray(parent.subtask)) parent.subtask = [];
      add(parent.subtask);
      return;
    }
  }

  add(ganttData);
}

function createTask(parentId?: string) {
  form.parentId = parentId || '';
  createTaskDialogVisible.value = true;
}

const currentTime = ref(dayjs().format(DATE_FMT));
onMounted(() => {
  setInterval(() => {
    currentTime.value = dayjs().format(DATE_FMT);
  }, 1000);
});

function getTaskById(id: string | number, list = data): any | null {
  for (const t of list) {
    if (t.id === id) return t;
    if (Array.isArray(t.subtask) && t.subtask.length) {
      const found = getTaskById(id, t.subtask);
      if (found) return found;
    }
  }
  return null;
}

function removeTaskById(id: string | number, list = data): boolean {
  const idx = list.findIndex(t => t.id === id);
  if (idx > -1) { list.splice(idx, 1); return true; }
  for (const t of list) {
    if (Array.isArray(t.subtask) && t.subtask.length) {
      if (removeTaskById(id, t.subtask)) return true;
    }
  }
  return false;
}

// 右键菜单
const contextMenuVisible = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const contextMenuItems = ref<ContextMenuItem[]>([]);

const onContextmenuRow = (event: MouseEvent, row: any) => {
  contextMenuPosition.value = { x: event.clientX, y: event.clientY };
  contextMenuItems.value = [
    {
      label: '添加子任务',
      action: () => {
        createTask(row.id);
      }
    },
    {
      label: '删除任务',
      action: () => {
        ElMessageBox.confirm('确定删除该任务吗？', '提示', {
          type: 'warning'
        }).then(() => {
          removeTaskById(row.id, ganttData);
        }).catch(() => { });
      }
    }
  ];
  contextMenuVisible.value = true;
};

const onContextmenuSlider = (event: MouseEvent, task: any) => {
  contextMenuPosition.value = { x: event.clientX, y: event.clientY };
  contextMenuItems.value = [
    {
      label: '查看当前所有关联',
      action: () => {
        const dataChain = ganttRef.value?.getDataChain(task.id);
        console.log('当前任务数据链：', dataChain);
        ElMessageBox.alert('在 F12 中查看', '消息');
      }
    }
  ];
  contextMenuVisible.value = true;
};
</script>

<style lang="css">
body,
html,
#app,
.container {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.container {
  display: flex;
  flex-direction: column;
}

.toolbar {
  height: 40px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.footer {
  height: 24px;
  background-color: #f0f0f0;
  border-top: 1px solid #e0e0e0;
  box-sizing: border-box;
  line-height: 24px;
  font-size: 14px;
  color: #888;
  display: flex;
  align-items: center;
  padding: 5px 12px;
}

.jump-date-popover {
  width: unset !important;
  padding: 0 !important;
}
</style>
