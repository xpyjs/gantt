# XGantt

![](./logo.png)

[![OSCS Status](https://www.oscs1024.com/platform/badge/xpyjs/gantt.svg?size=small)](https://www.oscs1024.com/project/xpyjs/gantt?ref=badge_small) ![NPM Version](https://img.shields.io/npm/v/@xpyjs/gantt-core.svg) ![NPM Downloads](https://badgen.net/npm/dt/@xpyjs/gantt-core) [![Bundle Size](https://img.shields.io/bundlephobia/minzip/@xpyjs/gantt-core)](https://bundlephobia.com/result?p=@xpyjs/gantt-core) [![TypeScript](https://img.shields.io/github/languages/top/xpyjs/gantt)](https://github.com/xpyjs/gantt) [![codecov](https://codecov.io/gh/xpyjs/gantt/graph/badge.svg?token=JBQD58RXZI)](https://codecov.io/gh/xpyjs/gantt) ![License](https://img.shields.io/npm/l/@xpyjs/gantt-core.svg)
[![GitHub Release](https://img.shields.io/github/v/release/xpyjs/gantt)](https://github.com/xpyjs/gantt/releases) [![GitHub Pages](https://img.shields.io/github/deployments/xpyjs/gantt/github-pages?label=gh-pages)](https://xpyjs.github.io/gantt/) [![Last Commit](https://img.shields.io/github/last-commit/xpyjs/gantt)](https://github.com/xpyjs/gantt/commits/master) [![Node Version](https://img.shields.io/badge/node-%3E%3D%2018-brightgreen)](https://nodejs.org/) ![GitHub Stars](https://img.shields.io/github/stars/xpyjs/gantt.svg?style=social) ![GitHub Forks](https://shields.io/github/forks/xpyjs/gantt?label=Fork&style=social)

[[中文](./README.md)] [[English](./README_en.md)]

A powerful and flexible Gantt chart component library, written in native JS + Canvas, designed specifically for modern web applications, and supports TypeScript.

## About Version

This current version is fully newly developed. If you just want to use `Vue` version, I strongly recommend that you upgrade to this version(`@xpyjs/gantt-vue` is for `Vue3`).
If you are looking for the previous version, please refer to the [origin-vue3 branch](https://github.com/xpyjs/gantt/tree/origin-vue3).

## 📖 Introduction

A Gantt chart is a project management tool used to display project progress, task allocation, and resource utilization. Based on a timeline, it visualizes the start time, end time, duration, and dependencies between tasks in a project through bar charts.

`XGantt` is a high-performance Gantt chart component library developed in native JavaScript. Built with Canvas technology, it provides smooth user experience and rich functional features.

## ✨ Features

- 🚀 **High-Performance Rendering**: Based on Konva.js Canvas rendering engine, supports smooth display of large amounts of data
- 📊 **Multi-Level Headers**: Supports multi-level header display for better organization and presentation of complex data
- ⏱️ **Multiple Time Units**: Supports various time scales including hour, day, week, month, quarter
- 🔗 **Task Dependency Management**: Complete task dependency creation, editing, and visualization
- 🎯 **Rich Interactions**: Drag & drop, zoom, selection, context menus, and other interactive features
- 📅 **Multi-Level Linkage**: Supports data linkage between different levels
- 📏 **Baseline Support**: Provides baseline functionality for tracking project progress
- 🏁 **Milestones**: Supports milestone markers for tracking key points
- 📊 **Virtual Scrolling**: Supports virtual scrolling for large datasets to ensure performance
- 🔄 **Event System**: Comprehensive event listening mechanism for business logic integration
- 🖌️ **Custom Styling**: Rich styling and theme configuration options
- 🛠️ **TypeScript Support**: Complete type definitions for better development experience
- 📦 **Multi-Framework Support**: Native JavaScript, ready to use out-of-the-box, compatible with all frameworks
- 🌐 **Internationalization Support**: Multi-language support
- 📚 **New Interactive Documentation**: Documentation includes detailed tutorials, API references, and example code [Doc Link](https://docs.xiaopangying.com/gantt/)
- 🔄 **Continuous Updates**: Regular releases with new features, bug fixes, and performance optimizations

## 🎯 Functionality

### Core Features

- **Table View**: Left table area with support for custom multi-row and multi-column merging
- **Timeline**: Flexible timeline configuration with support for multiple time units and custom time ranges
- **Task Management**: Support for multi-level task structures
- **Dependencies**: Visual task dependency lines with support for drag-and-drop adding, deleting, and managing dependencies within the view
- **Progress Display**: Task progress bar display with support for percentages and custom styling

### Interactive Features

- **Drag Operations**: Task bar dragging for movement and resizing
- **Mouse Operations**: Support for row and task bar clicks, double-clicks, context menus, etc.
- **Dependency Lines**: Support for creating, editing, and deleting dependency lines

## 📦 Installation

### Install Core Package

```bash
npm install @xpyjs/gantt-core
# or
yarn add @xpyjs/gantt-core
# or
pnpm add @xpyjs/gantt-core
```

## 🚀 Quick Start

### 1. Basic Usage

```typescript
import { XGantt } from '@xpyjs/gantt-core';
import '@xpyjs/gantt-core/index.css';

// Prepare data
const taskData = [
  {
    id: 1,
    name: 'Project Start',
    startTime: '2024-01-01',
    endTime: '2024-01-05',
    progress: 100
  },
  {
    id: 2,
    name: 'Requirements Analysis',
    startTime: '2024-01-06',
    endTime: '2024-01-15',
    progress: 80
  },
  {
    id: 3,
    name: 'System Design',
    startTime: '2024-01-16',
    endTime: '2024-01-30',
    progress: 50
  }
];

// Create Gantt chart instance
const gantt = new XGantt('#gantt-container', {
  data: taskData
});
```

### 2. HTML Structure

```html
<!DOCTYPE html>
<html>
<head>
  <title>XGantt Demo</title>
</head>
<body>
  <div id="gantt-container" style="width: 100%; height: 600px;"></div>
  <script src="your-script.js"></script>
</body>
</html>
```

### 3. Configuration Options

```typescript
const gantt = new XGantt('#gantt-container', {
  // Data configuration
  data: taskData,

  // Timeline configuration
  unit: 'day', // 'hour' | 'day' | 'week' | 'month' | 'quarter'
  // Dependency configuration
  links: {
    data: [],         // Dependency relationship data
    key: 'id',        // Specify the unique identifier field for data
    show: true,       // Display dependency relationships
    create: {
      enabled: true,  // Allow creating dependency relationships in the view
      mode: 'hover',  // Display creation points when hovering over task bars
      from: true,     // Allow nodes to be used as starting points for creating connections
      to: true        // Allow nodes to be used as endpoints for creating connections
    }
  },

  // Log level
  logLevel: 'info' // 'debug' | 'info' | 'warn' | 'error' | 'none',

  // ... other configuration options
});
```

### 4. Event Listening

```typescript
// Listen to task selection events
gantt.on('select', (data, checked, all) => {
  console.log('Selected tasks:', data);
});

// Listen to task row click events
gantt.on('click:row', (e, data) => {
  console.log('Clicked task row:', data);
});

// Listen to task bar click events
gantt.on('click:slider', (e, data) => {
  console.log('Clicked task bar:', data);
});

// Listen to task move events
gantt.on('move', (data) => {
  console.log('Task moved:', data);
});
```

## 📚 API Reference

### XGantt Class

#### Constructor

```typescript
new XGantt(element: string | HTMLElement, options?: IOptions)
```

- `element`: Container element or selector
- `options`: Configuration options

#### Methods

##### update(options: IOptions): void

Dynamically update Gantt chart configuration options.

```typescript
gantt.update({
  unit: 'month',
  logLevel: 'debug'
});
```

##### render(): void

Force render the view.

```typescript
gantt.render();
```

##### destroy(): void

Destroy the Gantt chart instance and clean up all resources.

```typescript
gantt.destroy();
```

##### jumpTo(date?: any): boolean

Jump to the specified date position on the timeline.

```typescript
gantt.jumpTo('2024-06-01');
gantt.jumpTo(new Date());
```

##### on(event: keyof EventMap, callback: Function): void

Register event listeners.

```typescript
gantt.on('select', (data, checked, all) => {
  // Handle selection events
});
```

### Configuration Options

See complete configuration options: [IOptions](./packages/core/src/types/index.d.ts#l7)

### Event System

The Gantt chart supports the following events:

| Event Name | Parameters | Description |
|------------|------------|-------------|
| `error` | `(error: ErrorType)` | Error handling |
| `select` | `(data: any[], checked: boolean, all: any[])` | Task selection |
| `click:row` | `(e: MouseEvent, data: any)` | Row click |
| `dblclick:row` | `(e: MouseEvent, data: any)` | Row double-click |
| `contextmenu:row` | `(e: MouseEvent, data: any)` | Row right-click |
| `click:slider` | `(e: MouseEvent, data: any)` | Task bar click |
| `dblclick:slider` | `(e: MouseEvent, data: any)` | Task bar double-click |
| `contextmenu:slider` | `(e: MouseEvent, data: any)` | Task bar right-click |
| `move` | `(data: {row: any; old: any}[])` | Task movement |
| `create:link` | `(link: ILink)` | Dependency creation |
| `update:link` | `(link: ILink)` | Dependency update |
| `select:link` | `(add: ILink, cancel: ILink, all: ILink[])` | Dependency selection |

See complete event types: [EventMap](./packages/core/src/types/event.d.ts#l4)

### Utility Functions

XGantt also provides some practical utility functions to help developers with common operations.

```typescript
import { generateId, dayjs, colorjs } from '@xpyjs/gantt-core';

// Generate unique ID
const id = generateId();

// Time handling (dayjs package, if you don't want to install it separately, you can use it through export. Some plugins are built-in, but if you need more, you still need to install them separately)
const now = dayjs();
const formatted = dayjs('2024-01-01').format('YYYY-MM-DD');

// Color handling
const color = colorjs('#ff0000');
const rgb = color.alpha(0.5).toRgb(); // Get RGB color value { r: 255, g: 0, b: 0, a: 0.5 }
```

## Framework Support

XGantt can be adapted to various front-end frameworks. However, I also provide adaptation packages for `Vue` and `React` to facilitate usage within these frameworks.

### Vue Version

`@xpyjs/gantt-vue` is designed specifically for Vue 3, providing better integration and user experience.

#### Installation

```bash
npm install @xpyjs/gantt-vue
# or
yarn add @xpyjs/gantt-vue
# or
pnpm add @xpyjs/gantt-vue
```

#### Usage

```vue
<template>
  <XGanttVue :options="ganttOptions" />
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import XGanttVue from '@xpyjs/gantt-vue';
import '@xpyjs/gantt-vue/style.css';

const ganttOptions = reactive({
  data: [
    {
      id: 1,
      name: 'Project Start',
      startTime: '2024-01-01',
      endTime: '2024-01-05',
      progress: 100
    },
    {
      id: 2,
      name: 'Requirements Analysis',
      startTime: '2024-01-06',
      endTime: '2024-01-15',
      progress: 80
    },
    {
      id: 3,
      name: 'System Design',
      startTime: '2024-01-16',
      endTime: '2024-01-30',
      progress: 50
    }
  ],
  unit: 'day',
  table: {
    columns: [
      { label: 'Task Name', field: 'name' },
      { label: 'Start Time', field: 'startTime' },
      { label: 'End Time', field: 'endTime' },
    ]
  }
});
</script>
```

`@xpyjs/gantt-vue` has been adapted for reactivity, so directly modifying the data will trigger automatic updates to the view.

### React Version

`@xpyjs/gantt-react` is designed specifically for React, providing better integration and user experience.

#### Installation

```bash
npm install @xpyjs/gantt-react
# or
yarn add @xpyjs/gantt-react
# or
pnpm add @xpyjs/gantt-react
```

#### Usage

```jsx
import { useState, useCallback, useEffect } from 'react';
import { XGanttReact, useXGantt } from '@xpyjs/gantt-react';
import '@xpyjs/gantt-react/style.css';

function App() {
  const { ganttRef, jumpTo } = useXGantt();

  const [ganttData, setGanttData] = useState([
    {
      id: 1,
      name: 'Project Start',
      startTime: '2024-01-01',
      endTime: '2024-01-05',
      progress: 100
    },
    {
      id: 2,
      name: 'Requirements Analysis',
      startTime: '2024-01-06',
      endTime: '2024-01-15',
      progress: 80
    },
    {
      id: 3,
      name: 'System Design',
      startTime: '2024-01-16',
      endTime: '2024-01-30',
      progress: 50
    }
  ]);

  const ganttOptions: IOptions = {
    data: ganttData,
    table: {
      columns: [
        { label: 'Task Name', field: 'name' },
        { label: 'Start Time', field: 'startTime' },
        { label: 'End Time', field: 'endTime' },
      ]
    },
    unit: 'day',
  };

  return (
    <div className="app">
      <XGanttReact ref={ganttRef} options={ganttOptions} />
    </div>
  );
}

export default App;
```

`@xpyjs/gantt-react` provides a hook: `useXGantt`, which makes it easy to use within function components.

## 🔧 Browser Support

XGantt is built on HTML5 Canvas technology and works normally as long as the browser supports the Canvas API:

- **Chrome** >= 51
- **Firefox** >= 45
- **Safari** >= 10
- **Edge** >= 12
- **Internet Explorer** >= 9

> **Note**: XGantt primarily relies on the Canvas 2D Context API and runs well in browsers that support Canvas. The above version requirements already cover the vast majority of user scenarios.

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please read our contribution guidelines for more information.

## 📞 Support

- [GitHub Issues](https://github.com/xpyjs/gantt/issues)
- [Documentation](https://docs.xiaopangying.com/gantt/)

## 🎊 Sponsorship

If you think it's good, invite the author to have a cup of coffee.

Now connected to [Afdian](https://afdian.com/a/xpyjs) platform, through which you can choose various plans to support and receive corresponding feedback.

Also, you can directly reward me through the following QR codes:

| WeChat | Alipay |
|---|---|
| <img style="width: 100%; max-height: 200px;" src="https://desktop.jeremyjone.com/resource/wx.png" /> | <img style="width: 100%; max-height: 200px;" src="https://desktop.jeremyjone.com/resource/zfb.jpg" /> |

---

Made with ❤️ by the Jeremy Jone
