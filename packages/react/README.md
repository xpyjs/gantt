# @xpyjs/gantt-react

基于 [@xpyjs/gantt-core](../core/README.md) 的 React 甘特图组件。

## 安装

```bash
npm install @xpyjs/gantt-react
# 或
yarn add @xpyjs/gantt-react
# 或
pnpm add @xpyjs/gantt-react
```

## 基本使用

```tsx
import React, { useRef } from 'react';
import { XGanttReact } from '@xpyjs/gantt-react';
import type { XGanttReactRef } from '@xpyjs/gantt-react';

function App() {
  const ganttRef = useRef<XGanttReactRef>(null);

  const data = [
    {
      id: '1',
      name: '任务1',
      startTime: '2024-01-01',
      endTime: '2024-01-10',
      progress: 50
    },
    {
      id: '2',
      name: '任务2',
      startTime: '2024-01-05',
      endTime: '2024-01-15',
      progress: 30
    }
  ];

  const handleTaskSelect = (data: any[], checked: boolean, all: any[]) => {
    console.log('选择的任务:', data);
  };

  const jumpToToday = () => {
    ganttRef.current?.jumpTo();
  };

  return (
    <div>
      <button onClick={jumpToToday}>跳转到今天</button>
      <XGanttReact
        ref={ganttRef}
        style={{ height: '500px', width: '100%' }}
        options={{
          data,
          table: {
            width: 300,
            columns: [
              { field: 'name', label: '任务名称', width: 200 },
              { field: 'progress', label: '进度', width: 100 }
            ]
          }
        }}
        onSelect={handleTaskSelect}
      />
    </div>
  );
}

export default App;
```

## 使用 Hooks

```tsx
import React from 'react';
import { XGanttReact, useXGantt, useGanttEvents } from '@xpyjs/gantt-react';

function MyGantt() {
  const { ganttRef, jumpToToday, updateGanttOptions } = useXGantt();
  const { onSelect, onClickRow, selectedTasks } = useGanttEvents();

  const handleChangeUnit = () => {
    updateGanttOptions({ unit: 'week' });
  };

  return (
    <div>
      <div>
        <button onClick={jumpToToday}>跳转到今天</button>
        <button onClick={handleChangeUnit}>切换到周视图</button>
        <span>已选择 {selectedTasks.length} 个任务</span>
      </div>
      <XGanttReact
        ref={ganttRef}
        style={{ height: '500px' }}
        options={{ data: [] }}
        onSelect={onSelect}
        onClickRow={onClickRow}
      />
    </div>
  );
}
```

## API

### XGanttReact Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| options | `IOptions` | ✓ | 甘特图配置选项，变化时自动更新甘特图 |
| className | `string` | - | 容器类名 |
| style | `React.CSSProperties` | - | 容器样式 |
| onError | `EventMap['error']` | - | 错误事件回调 |
| onUpdateLink | `EventMap['update:link']` | - | 关联线更新事件回调 |
| onCreateLink | `EventMap['create:link']` | - | 关联线创建事件回调 |
| onSelectLink | `EventMap['select:link']` | - | 关联线选择事件回调 |
| onSelect | `EventMap['select']` | - | 任务选择事件回调 |
| onClickRow | `EventMap['click:row']` | - | 行点击事件回调 |
| onDoubleClickRow | `EventMap['dblclick:row']` | - | 行双击事件回调 |
| onContextMenuRow | `EventMap['contextmenu:row']` | - | 行右键菜单事件回调 |
| onClickSlider | `EventMap['click:slider']` | - | 任务条点击事件回调 |
| onDoubleClickSlider | `EventMap['dblclick:slider']` | - | 任务条双击事件回调 |
| onContextMenuSlider | `EventMap['contextmenu:slider']` | - | 任务条右键菜单事件回调 |
| onMove | `EventMap['move']` | - | 任务移动事件回调 |

### XGanttReactRef 方法

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| getInstance | - | `XGantt \| null` | 获取甘特图核心实例，通过实例可调用所有核心方法 |
| jumpTo | `date?: any` | `boolean` | 跳转到指定日期（不传参数跳转到今天） |

### Hooks

#### useXGantt()

提供甘特图操作的便捷方法：

- `ganttRef`: 甘特图组件引用
- `getInstance()`: 获取核心实例
- `jumpTo(date)`: 跳转到指定日期

#### useGanttEvents()

提供事件处理的便捷方法：

- `onSelect`: 选择事件处理器
- `onClickRow`: 行点击事件处理器
- `onMove`: 移动事件处理器
- `selectedTasks`: 已选择的任务
- `lastClickedRow`: 最后点击的行
- `movedTasks`: 移动的任务

## 使用核心实例进行高级操作

```tsx
import React, { useRef } from 'react';
import { XGanttReact, useXGantt } from '@xpyjs/gantt-react';

function AdvancedGantt() {
  const { ganttRef, getInstance } = useXGantt();

  const handleAdvancedOperation = () => {
    const instance = getInstance();
    if (instance) {
      // 更新配置
      instance.update({
        unit: 'week',
        primaryColor: '#007acc'
      });

      // 手动渲染
      instance.render();

      // 其他核心方法
      instance.jumpTo('2024-06-01');
    }
  };

  return (
    <div>
      <button onClick={handleAdvancedOperation}>高级操作</button>
      <XGanttReact ref={ganttRef} options={{ data: [] }} />
    </div>
  );
}
```

## 类型定义

所有核心库的类型都可以从 `@xpyjs/gantt-react` 直接导入：

```tsx
import type {
  IOptions,
  ILink,
  ErrorType,
  EventMap,
  XGanttReactProps,
  XGanttReactRef
} from '@xpyjs/gantt-react';
```

## 样式

组件已自动导入样式，无需手动引入。如需自定义样式，可以通过 CSS 变量或覆盖样式类来实现。

## 许可证

MIT
