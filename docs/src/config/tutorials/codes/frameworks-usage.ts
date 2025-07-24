const vueCode = `<!-- Vue 组件中使用 -->
<template>
  <div>
    <XGanttVue
      :options="ganttOptions"
      @select="handleSelect"
      @click:row="handleRowClick"
      @move="handleTaskMove"
      @create:link="handleCreateLink"
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { XGanttVue } from '@xpyjs/gantt-vue'

const ganttOptions = reactive({
  data: [ // 初始化数据
    { id: 1, name: '任务1', start: '2023-10-01', end: '2023-10-05' },
    { id: 2, name: '任务2', start: '2023-10-03', end: '2023-10-07' }
  ],
  fields: {
    id: 'id',
    name: 'name',
    startTime: 'start',
    endTime: 'end'
  }
  // 其他配置...
})

const handleSelect = (data, checked, all) => {
  console.log('Vue: 选择事件', { data, checked, all })
}

const handleRowClick = (event, rowData) => {
  console.log('Vue: 行点击', { event, rowData })
}

const handleTaskMove = (data) => {
  console.log('Vue: 任务移动', data)
}

const handleCreateLink = (linkData) => {
  console.log('Vue: 创建依赖', linkData)
}

const handleError = (error) => {
  console.error('Vue: 错误处理', error)
}
\<\/script\>`;

const reactCode = `// React 组件中使用
import React, { useRef, useEffect, useState } from 'react';
import { XGanttReact } from '@xpyjs/gantt-react'

const GanttComponent = () => {
  const [ganttOptions, setGanttOptions] = useState({
    data: [
      { id: 1, name: '任务1', start: '2023-10-01', end: '2023-10-05' },
      { id: 2, name: '任务2', start: '2023-10-03', end: '2023-10-07' }
    ],
    fields: {
      id: 'id',
      name: 'name',
      startTime: 'start',
      endTime: 'end'
    }
  });

  const handleSelect = (data, checked, all) => {
    console.log('React: 选择事件', { data, checked, all });
  };

  const handleRowClick = (event, rowData) => {
    console.log('React: 行点击', { event, rowData });
  };

  const handleTaskMove = (data) => {
    console.log('React: 任务移动', data);
  };

  const handleCreateLink = (linkData) => {
    console.log('React: 创建依赖', linkData);
  };

  const handleError = (error) => {
    console.error('React: 错误处理', error);
  };

  return (
    <XGanttReact
      options={ganttOptions}
      onSelect={handleSelect}
      onClickRow={handleRowClick}
      onMove={handleTaskMove}
      onCreateLink={handleCreateLink}
      onError={handleError}
    />
  );
};

export default GanttComponent;`;

const angularCode = `// Angular 中使用。使用原生组件来实现
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { XGantt } from '@xpyjs/gantt-core';

@Component({
  selector: 'app-gantt-events',
  template: \`
    <div class="gantt-container">
      <h3>Angular 甘特图示例</h3>
      <div #ganttContainer class="gantt-chart"></div>
    </div>
  \`,
  styles: [\`
    .gantt-container {
      padding: 20px;
    }
    .gantt-chart {
      width: 100%;
      height: 400px;
      border: 1px solid #ddd;
    }
  \`]
})

export class GanttComponent implements OnInit, OnDestroy {
  @ViewChild('ganttContainer', { static: true }) ganttContainer!: ElementRef;

  private gantt!: XGantt;

  // 示例数据
  private ganttData = [
    { id: 1, name: '任务1', startTime: '2024-01-01', endTime: '2024-01-05' },
    { id: 2, name: '任务2', startTime: '2024-01-06', endTime: '2024-01-15' }
  ];

  ngOnInit(): void {
    this.initGantt();
    this.setupEvents();
  }

  ngOnDestroy(): void {
    if (this.gantt) {
      this.gantt.destroy?.();
    }
  }

  private initGantt(): void {
    const container = this.ganttContainer.nativeElement;

    this.gantt = new XGantt(container, {
      data: this.ganttData,
      // 其他配置...
    });
  }

  private setupEvents(): void {
    // 监听事件
    this.gantt.on('select', (data, checked, all) => {
      console.log('Angular: 选择事件', { data, checked, all });
    });

    this.gantt.on('click:row', (event, rowData) => {
      console.log('Angular: 行点击', { event, rowData });
    });

    this.gantt.on('move', (data) => {
      console.log('Angular: 任务移动', data);
    });

    this.gantt.on('create:link', (linkData) => {
      console.log('Angular: 创建依赖', linkData);
    });

    this.gantt.on('error', (error) => {
      console.error('Angular: 错误处理', error);
    });
  }
}
`;

export default {
  vueCode,
  reactCode,
  angularCode
};
