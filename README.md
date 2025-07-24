# XGantt

![](./logo.png)

[![OSCS Status](https://www.oscs1024.com/platform/badge/xpyjs/gantt.svg?size=small)](https://www.oscs1024.com/project/xpyjs/gantt?ref=badge_small)  ![](https://img.shields.io/npm/v/@xpyjs/gantt-core.svg)  ![](https://badgen.net/npm/dt/@xpyjs/gantt-core) ![](https://img.shields.io/npm/l/@xpyjs/gantt-core.svg) ![](https://img.shields.io/github/stars/xpyjs/gantt.svg?style=social) ![](https://shields.io/github/forks/xpyjs/gantt?label=Fork&style=social)

[[English](./README.md)] [[中文](./README_cn.md)]

A powerful and flexible Gantt chart component library, written in native JS + Canvas, designed specifically for modern web applications, and supports TypeScript.

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
- 📊 **Virtual Scrolling**: Supports virtual scrolling for large datasets to ensure performance
- 🔄 **Event System**: Comprehensive event listening mechanism for business logic integration
- 🖌️ **Custom Styling**: Rich styling and theme configuration options
- 🛠️ **TypeScript Support**: Complete type definitions for better development experience
- 📦 **Multi-Framework Support**: Native JavaScript, ready to use out-of-the-box, compatible with all frameworks
- 🌐 **Internationalization Support**: Multi-language support
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
- [Documentation](https://github.com/xpyjs/gantt#readme)

---

Made with ❤️ by the Jeremy Jone
