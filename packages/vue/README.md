# XGantt Vue 组件

基于 XGantt 核心的 Vue 3 组件封装。

## 安装

```bash
npm install @xpyjs/gantt-vue
# 或
pnpm add @xpyjs/gantt-vue
```

## 使用

### 全局注册

```typescript
import { createApp } from 'vue'
import XGanttVue from '@xpyjs/gantt-vue'
import '@xpyjs/gantt-vue/style.css'

const app = createApp(App)
app.use(XGanttVue)
```

### 局部注册

```vue
<template>
  <XGanttChart
    :data="ganttData"
    :width="1200"
    :height="600"
    :table="tableConfig"
    primary-color="#1890ff"
    @move="onTaskMove"
    @select="onTaskSelect"
  />
</template>

<script setup lang="ts">
import { XGanttChart } from '@xpyjs/gantt-vue'
import '@xpyjs/gantt-vue/style.css'

const ganttData = ref([
  {
    id: '1',
    name: '任务1',
    startTime: '2024-01-01',
    endTime: '2024-01-15',
    progress: 80
  }
])

const tableConfig = {
  columns: [
    { field: 'name', label: '任务名称', width: 200 },
    { field: 'progress', label: '进度', width: 80 }
  ]
}

const onTaskMove = (moved) => {
  console.log('任务移动:', moved)
}

const onTaskSelect = (selected, checked, all) => {
  console.log('任务选择:', { selected, checked, all })
}
</script>
```

## 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| data | Array | [] | 甘特图数据 |
| width | Number | undefined | 甘特图宽度 |
| height | Number | undefined | 甘特图高度 |
| primaryColor | String | "#eca710" | 主色调 |
| dateFormat | String | "YYYY-MM-DD" | 日期格式 |
| unit | String | "day" | 时间刻度 |
| locale | String | "en" | 显示语言 |
| fields | Object | {...} | 字段映射配置 |
| table | Object | {...} | 表格配置 |
| chart | Object | {...} | 图表配置 |

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|--------|------|------|
| move | moved | 任务拖拽移动完成 |
| select | selected, checked, all | 任务选择 |
| click:row | event, row | 行点击 |
| dblclick:row | event, row | 行双击 |
| error | error | 错误事件 |

## 方法 (Methods)

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| jumpTo | date? | boolean | 跳转到指定日期 |
| getOptions | - | object | 获取甘特图选项 |
| render | - | void | 重新渲染 |
| getInstance | - | XGantt | 获取甘特图实例 |

## 开发

```bash
# 安装依赖
pnpm install

# 开发
pnpm dev

# 构建
pnpm build
```

## 许可证

MIT
