import{h as y,d as G,i as _,c as o,o as n,j as u,e as x,t as d,F as m,r as g,a as i,k as j,l as D,m as X,p as R,u as S,q as $,n as I,s as E,_ as A}from"./main-BC5ZWLaZ.js";const T=[{id:1,name:"项目规划",startTime:"2025-01-01",endTime:"2025-01-15",progress:100},{id:2,name:"开发阶段",startTime:"2025-01-16",endTime:"2025-02-28",progress:45}],B=`import { XGantt } from '@xpyjs/gantt-core'

// 创建甘特图实例
const gantt = new XGantt({
  container: '#gantt-container',
  data: ${y(T,"  ")}
})`,L=`<template>
  <div>
    <XGanttVue :options="ganttOptions" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { XGanttVue } from '@xpyjs/gantt-vue'

const ganttOptions = ref({
  data: ${y(T,"  ")}
})
<\/script>`,F=`import React from 'react'
import { XGanttReact } from '@xpyjs/gantt-react'

function App() {
  const ganttOptions = {
    data: ${y(T,"    ")}
  }

  return (
    <div>
      <XGanttReact options={ganttOptions} />
    </div>
  )
}

export default App`,w={jsCode:B,vueCode:L,reactCode:F},O=`<!-- Vue 组件中使用 -->
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
<\/script>`,M=`// React 组件中使用
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

export default GanttComponent;`,V=`// Angular 中使用。使用原生组件来实现
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
`,b={vueCode:O,reactCode:M,angularCode:V},C=[{id:"quick-start",title:"快速入门",sections:[{id:"installation",title:"安装",description:"XGantt 支持多种安装方式，你可以根据项目需求选择合适的包。",subsections:[{title:"核心包",code:[{framework:"vue",code:"npm install @xpyjs/gantt-vue",language:"bash"},{framework:"react",code:"npm install @xpyjs/gantt-react",language:"bash"},{framework:"javascript",code:"npm install @xpyjs/gantt-core",language:"bash"}]}]},{id:"basic-usage",title:"基础用法",description:"以下是不同框架下的基础使用方法：",code:[{framework:"vue",code:w.vueCode,language:"vue"},{framework:"react",code:w.reactCode,language:"tsx"},{framework:"javascript",code:w.jsCode,language:"javascript"}],customContent:'这样在浏览器中就可以看到效果了。想要实践一下，去 <a href="/demo/basic/simple">演示广场</a> 试试吧。'},{id:"data-structure",title:"数据结构",description:"数据结构应当保证有唯一 id。如果需要展示时间进度等信息，需要添加对应字段。这些字段都可以通过 fields 来自定义。",subsections:[{title:"基础数据结构",code:[{framework:"javascript",code:`const data = [
  {
    id: '1',                    // 唯一标识
    name: '项目规划',            // 任务名称
    startTime: '2025-01-01',    // 开始时间
    endTime: '2025-01-15',      // 结束时间
    progress: 80,               // 进度百分比
    children: [                 // 子任务
      {
        id: '1-1',
        name: '需求分析',
        startTime: '2025-01-01',
        endTime: '2025-01-05',
        progress: 100
      }
    ]
  }
]`,language:"javascript"}]}]},{id:"configuration",title:"配置选项",description:"XGantt 提供了丰富的配置选项来定制甘特图的外观和行为。",customContent:'可以参考 <a href="/api">API Reference</a> 查看详细配置。',subsections:[{table:{headers:["属性","类型","默认值","说明"],rows:[{property:"primaryColor",type:"String",default:'"#eca710"',description:"主色调"},{property:"unit",type:"String",default:'"day"',description:"时间刻度单位"},{property:"width",type:"Number",default:"undefined",description:"甘特图宽度"},{property:"height",type:"Number",default:"undefined",description:"甘特图高度"}]}}]}]},{id:"core-concepts",title:"核心概念",sections:[{id:"table",title:"表格",description:"表格是甘特图的重要组成部分，它在整个视图的左侧，用于展示任务的重要信息。",subsections:[{customContent:'<img src="/tutorials-table.png" />'},{code:[{framework:"javascript",code:`const options = {
  table: {
    columns: [
      { label: "Name", width: 150, field: "name" },
      {
        label: "时间",
        children: [    // 通过 children 配置，支持多行表头
          { label: "Start Date", width: 100, field: "startTime" },
          { label: "End Date", width: 100, field: "endTime" }
        ]
      },
      { label: "进度", field: "progress" }
    ]
  }
}`,language:"javascript"}]}],customContent:'完整表格配置可以参考 <a href="/api/options#table">Table API</a>'},{id:"time-axis",title:"时间轴",description:"时间轴是甘特图的核心概念，用于可视化任务的用时、进度等重要指标。 XGantt 支持多种时间单位和自定义格式。",subsections:[{customContent:'<img src="/tutorials-axis.png" />'},{title:"时间单位",list:["`hour` - 小时","`day` - 天（默认）","`week` - 周","`month` - 月","`quarter` - 季度"]},{code:[{framework:"javascript",code:`const options = {
  unit: 'week',                    // 设置时间单位为周
  chart: {                         // chart 字段可以对时间轴区域进行各种配置
    cellWidth: 30
  }
}`,language:"javascript"}]}],customContent:'完整时间轴的图表区域配置可以参考 <a href="/api/options#chart">Chart API</a>'},{id:"task-bars",title:"任务条",description:"任务条是甘特图中 显示/操作 任务时间范围和进度的可视化元素。只要当前任务数据中包含起止时间，那么默认就会渲染对应的任务条。甘特图中的所有操作都是基于任务条的，所以它是甘特图的核心内容。",code:[{framework:"javascript",code:`const options = {
  bar: {
    height: 20,                     // 任务条高度
    backgroundColor: '#007acc',     // 背景颜色
    color: '#fff',                  // 文字颜色
    radius: 4,                      // 圆角半径
    move: {
      enabled: true,                // 是否允许拖拽
      byUnit: true                  // 是否按时间单位拖拽
    },
    progress: {
      show: true,                   // 是否显示进度
      backgroundColor: '#40a9ff'    // 进度条颜色
    }
  }
}`,language:"javascript"}],customContent:'完整任务条配置可以参考 <a href="/api/options#bar">Bar API</a>'},{id:"task-milestone",title:"里程碑",description:"里程碑是甘特图中一个特殊任务节点。它通常用于标记重要的时间节点或事件。里程碑没有持续时间，通常只显示一个点或图标。在 XGantt 中，里程碑默认情况下是使用一个菱形块来展示。",subsections:[{description:"里程碑本身也是一条 task 数据，可以通过数据中 type 字段设置为 `milestone` 来实现。"},{customContent:'<img src="/tutorials-milestone.png" />'},{code:[{framework:"javascript",code:`const options = {
  bar: {
    height: 20,
    backgroundColor: '#007acc',
    color: '#fff',
    radius: 4,
    move: {
      enabled: true,
      byUnit: true
    }
  },
  milestone: {
    show: true,             // 允许显示里程碑
    size: 10,               // 里程碑图标大小
    color: 'red',         // 自定义里程碑图标颜色
    border: {
      width: 1              // 设置里程碑图标边框
    },
    label: {
      show: true,           // 允许里程碑显示一个标签
      text: '测试标签',       // 标签内容
    }
  }
}`,language:"javascript"}]}]},{id:"task-summary",title:"汇总集合",description:"汇总集合是甘特图中对多个或多组任务进行汇总查阅的特殊任务。它通常不包含具体任务信息，而是把所有子项的任务时间框选起来，提高可视化效果。",subsections:[{description:"汇总集合本身也是一条 task 数据，可以通过数据中 type 字段设置为 `summary` 来实现。"},{description:"汇总集合通常使用一个类似括号的形状将子项时间框选起来。它默认不支持自身的移动，但可以通过配置进行调整。"},{description:"当汇总集合的任务被折叠收起时，它会展示成一个普通任务条的形状。"},{customContent:'<img src="/tutorials-summary.png" />'},{code:[{framework:"javascript",code:`const options = {
  summary: {
    show: true
  },
}`,language:"javascript"}]}]},{id:"baselines",title:"基线",description:"基线是时间可视化中非常重要的一个概念和实现方式。它可以与实际时间进行非常之观的可视化对比，从而高效的看到哪一个任务滞后，进而可以调整工作进度。",subsections:[{description:"XGantt基线功能支持：",list:["多条基线","基线对比","指定对比","基线高亮","指定高亮","对比指示器"],customContent:'<img src="/tutorials-baseline.png" />'},{description:"XGantt 提供了丰富的基线配置，包括但不限于形式、位置、颜色等，最大限度地让用户自定义出不同的效果。"},{code:[{framework:"javascript",code:`const options = {
  baselines: {
    show: true,
    offset: 0,
    backgroundColor: '#999',
    data: [
      {
        id: "baseline1",
        taskId: "1",
        startTime: "2025-01-01",
        endTime: "2025-01-15",
        name: "Baseline 1",
        highlight: false        // 该条内容不用高亮对比显示
      },
      {
        id: "baseline1-1",
        taskId: "1",            // taskId 相同时，可以在同一行显示多个基线
        startTime: "2025-01-16",
        endTime: "2025-01-18",
        name: "Baseline 1-1",
        target: true            // 使用该条数据与任务时间进行对比
      },
      {
        id: "baseline2",
        taskId: "2",
        startTime: "2025-01-16",
        endTime: "2025-01-28",
        name: "Baseline 2"
      },
      {
        id: "baseline3",
        taskId: "1-1",
        startTime: "2025-01-01",
        endTime: "2025-01-04",
        name: "Baseline 3"
      }
    ],
    label: {
      show: true,
      position: 'left'
    },
    compare: {
      enabled: true,
      indicator: {
        show: true,
        ahead: {
          opacity: 0.5,
          text: (diff, row) => \`领先 \${diff} 天\`
        },
        delayed: {
          text: (diff, row) => {
            return \`超期 \${-diff} 天\`;
          }
        },
      }
    }
  }
}`,language:"javascript"}]},{customContent:'完整基线配置可以参考 <a href="/api/options#baselines">Baselines API</a>'}]},{id:"dependencies",title:"依赖关系",description:"XGantt 支持任务之间的依赖关系，包括创建、编辑和删除依赖线。",subsections:[{description:"现在的 XGantt 支持更多依赖关系：",list:["`FS` - 完成-开始（默认）","`FF` - 完成-完成","`SS` - 开始-开始","`SF` - 开始-完成"],customContent:'<img src="/tutorials-link.png" />'},{description:"它们分别对应任务条的 左侧(开始)、右侧(完成) 的连线方式。"},{code:[{framework:"javascript",code:`const options = {
  links: {
    data: [
      {
        id: 'link1',
        from: '1',                // 起始任务ID
        to: '2',                  // 目标任务ID
        type: 'FS'                // 依赖类型：FS, FF, SS, SF
      }
    ],
    show: true,                   // 是否显示依赖线
    create: {
      enabled: true,              // 是否允许创建依赖
      mode: 'hover'               // 启用创建，则可以配置连接点的展示方式。 hover | always
    }
  }
}`,language:"javascript"}]},{customContent:'完整关连线配置可以参考 <a href="/api/options#links">Links API</a>'},{title:"依赖关系的使用",description:"依赖关系线的使用，需要配置、事件配合"},{description:"1、加载数据，并进行相关设置"},{code:[{framework:"javascript",language:"javascript",code:` const links = [
  { from: "1", to: "2", index: "111" },
  { from: "3", to: "4", index: "222", color: "green", type: "SF" },
  { from: "2-1", to: "2-2", index: "333", color: "red" },
  { from: "3-3", to: "3-1", index: "444", color: "#123" },
  { from: "3-3", to: "3-2", index: "555", type: "SF" },
  { from: "2-1", to: "3-1", index: "666", gap: 10 }
];

const options = {
  links: {
    show: true,                 // 显示依赖线，默认不展示
    data: links,                // 配置默认数据
    key: "index",               // 需要指定数据中的唯一标识的字段
    create: {                   // 配置创建属性
      enabled: true,
      mode: "always",
      to: row => {              // 创建结束点的控制
        // 只允许一级任务可以创建结束点
        return row.level === 1;
      },
      from: row => {            // 创建起始点的控制
        // 一级任务只能以结束时间（右侧）为起始点，其他层级任务只能以开始时间（左侧）为起始点
        return row.level === 1 ? "F" : "S";
      }
    }
  }
}`}]},{description:"2、配置好所有属性，通过事件可以进行控制。"},{code:[{framework:"javascript",language:"javascript",code:`// 更新关连线
gantt.on("update:link", link => {
  const index = links.findIndex(l => l.index === link.index);
  if (index !== -1) {
    links.splice(index, 1, link);
  }
});

// 添加连线
gantt.on("create:link", link => {
  links.push({ ...link, index: \`\${Date.now()}\` });   // 需要保证每一个添加的依赖关系都有唯一字段值
});

// 选中连线
gantt.on("select:link", (add, cancel, all) => {
  if (add?.index === "555") {
    links.splice(links.findIndex(l => l.index === add.index), 1);  // 模拟选中删除
  }
});`}]},{description:"操作完关连线，不需要做额外的操作，界面会自动更新。如果在操作方法中使用了异步方法或者其他影响执行的操作，为保证数据的准确，请手动更新界面。"},{title:"依赖关系的性能问题",customContent:'<code>XGantt</code> 内部使用了 <code>Konva</code> 库进行渲染，当绘制大量依赖关系时，会出现页面卡顿现象，这是因为 <code>Konva</code> 在处理虚线时，会计算大量位置关系，尤其是像我们的依赖关系这样的多段折线。<div style="margin-top: 12px;">● 如果您的项目需要大量连线，我们十分建议您使用实线，这样会大幅度提升性能。</div><div>● 如果您确实需要使用虚线，可以尝试设置为 [5, 5] 这样的等宽值，它会相应的减少一些计算量。</div><div>● 当然，您还可以尝试使用更细的线条，这样也会对性能优化有很大帮助。</div>'}]},{id:"events",title:"事件交互",description:"XGantt 提供了完整的事件交互功能，基本可以满足大部分使用场景。",code:[{framework:"vue",code:`<XGanttVue
  :options="options"
  @move="onTaskMove"
  @select="onTaskSelect"
  @click:row="onRowClick"
  @create:link="onLinkCreate"
/>`,language:"vue"},{framework:"react",code:`// React 事件需要使用首字母大写拼接
<XGanttReact
  options={options}
  onMove={handleTaskMove}
  onSelect={handleTaskSelect}
  onClickRow={handleRowClick}
  onCreateLink={handleLinkCreate}
/>`,language:"tsx"},{framework:"javascript",code:`// 原生 JavaScript 事件监听
gantt.on('move', (data) => {
  console.log('任务移动:', data);
});

gantt.on('select', (data) => {
  console.log('任务选择:', data);
});

gantt.on('click:row', (data) => {
  console.log('行点击:', data);
});

gantt.on('create:link', (data) => {
  console.log('创建依赖:', data);
});`,language:"javascript"}],customContent:'完整的事件可以参考 <a href="/api/events">Event API</a>'}]},{id:"advanced-features",title:"高级功能",sections:[{id:"custom-table",title:"定制表格",description:"表格支持丰富的自定义配置，包括多行表头、表格内容、以及自定义渲染等。",subsections:[{code:[{framework:"javascript",code:`const options = {
  table: {
    align: "left",           // 表格内容对齐方式
    ellipsis: true,          // 是否启用省略号
    columns: [               // 表格列配置
      {
        label: "Name",
        width: 150,
        field: "name",       // 字段键值，支持 \`.\` 操作符取对象值
        merge: (value, data, colIndex, level) => {     // 合并单元格逻辑
          if (value === "Task 1") return { col: 3, row: 1 };   // 返回大于 1 的值，进行合并
          if (value === "Subtask 1") return { col: 3, row: 2 };
        },
        align: "left",       // 当前列的对齐方式，优先级高于 table 的 align 字段
        customStyle: {       // 自定义样式，与 style 合并
          display: "flex",
          "align-items": "center"
        },
        render: row => {     // 自定义渲染表格内容
          return row.level === 1
            ? row.data.name
            : \`<div style="color: red">\${row.data.name}</div>\`;
        }
      },
      {
        label: "时间",
        children: [
          { label: "Start Date", width: 100, field: "startDate" },
          { label: "End Date", width: 100, field: "endDate" }
        ]
      },
      {
        label: "其他",
        children: [
          { label: "Field1", width: 60, field: "field1" },
          {
            label: "二级菜单",
            children: [
              {
                label: "Field2",
                width: 80,
                field: "field2",
                ellipsis: false     // 单独设置某一列的省略号
              },
              {
                label: "Field3",
                width: 50,
                field: "field3",
                align: "right",
                headerAlign: "left"
              }
            ]
          }
        ]
      }
    ]
  }
}`,language:"javascript"}]},{description:"渲染的内容如下图，可以看到多级表头，合并的行列，以及自定义的表格内容："},{customContent:'<img src="/tutorials-custom-table.png" />'}]},{id:"custom-chart",title:"定制时间轴",description:"时间轴支持丰富的自定义配置，包括颜色、样式等。",subsections:[{code:[{framework:"javascript",code:`const options = {
  primaryColor: '#007acc',                  // 主色调
  chart: {
    startTime: '2025-01-01',                // 强制固定时间轴的起始时间
    headerCellFormat: (date, unit) => {
      return dayjs(date).format('DD号');    // 自定义时间轴下层表头内容
    }
  },
  locale: 'zh',                             // 设置语言环境
  header: {
    fontSize: 16,                           // 设置表头字体大小。表格与时间轴共享此设置
  },
  row: {
    backgroundColor: [                      // 设置行背景色
      '#f0f0f0',
      '#ffffff'
    ],
    hover: {
      opacity: 0.4,                         // 鼠标悬停时的透明度
      backgroundColor: '#959595'            // 鼠标悬停时的背景色
    },
    select: {
      backgroundColor: '#007acc',           // 选中行的背景色
      opacity: 0.4                          // 选中行的文字颜色
    }
  },
  bar: {
    height: '40%',                          // 任务条高度。支持百分比，将按照行高计算
    field: 'name',                          // 任务条显示的字段
    align: 'center',                        // 任务条内容对齐方式
    fontSize: 12,                           // 任务条字体大小
    move: {
      enabled: row => row.level === 1,      // 只允许一级任务条拖拽
      lock: false,                          // 锁定在视图区域内拖动，无法超越时间轴范围
      byUnit: true,                         // 按时间单位拖拽。建议打开
      single: {
        left: true,                         // 允许左侧单独拖拽
        right: false                        // 禁止右侧单独拖拽
      },
      link: {                               // 配置拖拽时父子任务的联动方式
        child: "scale",                     // 子任务条以缩放的方式伸缩
        parent: "none"                      // 不受父任务的限制影响
      }
    }
  },
  weekend: {
    pattern: "stripe",                      // 配置周末区域的背景样式
    patternOptions: {
      color: '#007acc',                     // 条纹颜色
    }
  },
  today: {
    show: true,
    type: 'line'                            // 展示一条竖线，以当前时间为准  line | block
  },
  holiday: {
    show: true,                             // 显示假期区域
    holidays: [                             // 配置假期列表
      {
        date: '2025-05-05',
        backgroundColor: 'green',
        opacity: 0.1
      },
      {
        date: [                             // 假期支持对多个日期同时配置
          '2025-01-01',
          '2025-01-28',
          '2025-04-04',
          '2025-05-01',
          '2025-05-31',
          '2025-10-01'
        ],
        backgroundColor: 'red',
        opacity: 0.1
      }
    ]
  }
}`,language:"javascript"}]},{description:"渲染的内容如下图，可以看到表头、任务条、周末、假期等自定义后的显示效果："},{customContent:'<img src="/tutorials-custom-axis.png" />'}]},{id:"frameworks",title:"框架集成",description:"XGantt 可以很方便的集成到各种框架中。并且 XGantt 已经自带 vue 与 react 的框架",subsections:[{title:"Vue 集成",code:[{framework:"vue",language:"vue",code:b.vueCode},{framework:"react",language:"tsx",code:b.reactCode},{framework:"angular",language:"ts",code:b.angularCode}]}]},{id:"performance",title:"性能优化",description:"为了确保在大数据量下的流畅体验，XGantt 内置了多种性能优化策略。在多数情况，用户不用关心也不必担心性能问题，但是用户仍然可以通过编码使其更加优秀。",subsections:[{list:["**确保数据唯一键**：尽可能给每条数据添加唯一 ID，这会让 XGantt 处理数据更加高效","**只更新需要的内容**：尽可能不要每次全量更新 options，当数据没有变化时，不要传递它","**拖拽功能**：拖拽是一个耗时操作，非必要不开启，尽量启用按单位拖拽（byUnit）",'**依赖关系**：依赖关系是一个十分消耗性能的渲染功能，尽可能避免使用虚线绘制，具体可以查看 <a href="/tutorials#依赖关系的性能问题">依赖关系的性能问题</a>']}]}]}],P=()=>{const r=[];return C.forEach(h=>{r.push({id:h.id,title:h.title,sections:h.sections.map(p=>({id:p.id,title:p.title}))})}),r},U={class:"tutorial-content"},N={key:0,class:"section-description"},H=["id"],z={key:1,class:"subsection-description"},W={key:2,class:"content-list"},q=["innerHTML"],K={key:3,class:"config-table"},J=["innerHTML"],Q=["innerHTML"],Y=G({__name:"TutorialSection",props:{section:{}},setup(r){const h=_(),p=l=>{let c=l.replace(/`([^`]+)`/g,"<code>$1</code>");return c=c.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),k(c)},k=l=>{if(!l)return"";const c="/gantt/";let e=l.replace(/href="(\/[^"]*)"/g,(s,t)=>{const a=c.replace(/\/$/,""),f=t.startsWith("/")?t:`/${t}`;return`href="${a}${f}"`});return e=e.replace(/src="(\/[^"]*)"/g,(s,t)=>{const a=c.replace(/\/$/,""),f=t.startsWith("/")?t:`/${t}`;return`src="${a}${f}"`}),e},v=l=>{const c=l.target;if(c.tagName==="A"){const e=c.getAttribute("href");if(e){const s=new URL(e,window.location.origin);if(s.origin===window.location.origin){l.preventDefault();const t="/gantt/";let a=s.pathname;a.startsWith(t)&&(a=a.substring(t.length)),h.push(a+s.search+s.hash)}}}};return(l,c)=>(n(),o("div",U,[r.section.description?(n(),o("p",N,d(r.section.description),1)):u("",!0),r.section.subsections?(n(!0),o(m,{key:1},g(r.section.subsections,(e,s)=>(n(),o("div",{key:s,class:"subsection"},[e.title?(n(),o("h3",{key:0,class:"subsection-title",id:e.title},d(e.title),9,H)):u("",!0),e.description?(n(),o("p",z,d(e.description),1)):u("",!0),e.list?(n(),o("ul",W,[(n(!0),o(m,null,g(e.list,(t,a)=>(n(),o("li",{key:a,innerHTML:p(t)},null,8,q))),128))])):u("",!0),e.table?(n(),o("div",K,[i("table",null,[i("thead",null,[i("tr",null,[(n(!0),o(m,null,g(e.table.headers,t=>(n(),o("th",{key:t},d(t),1))),128))])]),i("tbody",null,[(n(!0),o(m,null,g(e.table.rows,t=>(n(),o("tr",{key:t.property},[i("td",null,[i("code",null,d(t.property),1)]),i("td",null,d(t.type),1),i("td",null,d(t.default),1),i("td",null,d(t.description),1)]))),128))])])])):u("",!0),e.code?(n(),x(j,{key:4,codeBlocks:e.code},null,8,["codeBlocks"])):u("",!0),e.customContent?(n(),o("div",{key:5,innerHTML:k(e.customContent),class:"custom-content",onClick:v},null,8,J)):u("",!0)]))),128)):u("",!0),r.section.code?(n(),x(j,{key:2,codeBlocks:r.section.code},null,8,["codeBlocks"])):u("",!0),r.section.customContent?(n(),o("div",{key:3,innerHTML:k(r.section.customContent),class:"custom-content",onClick:v},null,8,Q)):u("",!0)]))}}),Z={class:"tutorials-page"},tt={class:"tutorials-content"},et={class:"tutorials-sidebar"},at={class:"tutorials-nav"},nt=["href","onClick"],ot={class:"category-title"},it=["id"],st=G({__name:"Tutorials",setup(r){const h=P(),p=D(""),k=(e,s)=>{let t;return(...a)=>{clearTimeout(t),t=setTimeout(()=>e.apply(null,a),s)}},v=()=>{const e=[];return C.forEach(s=>{s.sections.forEach(t=>{e.push(t.id)})}),e},l=k(()=>{const e=v(),s=150;for(let t=e.length-1;t>=0;t--){const a=document.getElementById(e[t]);if(a&&a.getBoundingClientRect().top<=s){p.value=e[t];break}}},100),c=e=>{const s=document.getElementById(e);if(s){const f=s.offsetTop-80;window.scrollTo({top:f,behavior:"smooth"}),p.value=e}};return X(()=>{window.addEventListener("scroll",l,{passive:!0}),l()}),R(()=>{window.removeEventListener("scroll",l)}),(e,s)=>(n(),o("div",Z,[s[0]||(s[0]=i("header",{class:"page-header"},[i("div",{class:"container"},[i("h1",null,"教程文档"),i("p",null,"深入学习 XGantt 的各种功能和 API")])],-1)),i("div",tt,[i("aside",et,[i("nav",at,[(n(!0),o(m,null,g(S(h),t=>(n(),o("div",{key:t.id,class:"nav-section"},[i("h3",null,d(t.title),1),i("ul",null,[(n(!0),o(m,null,g(t.sections,a=>(n(),o("li",{key:a.id},[i("a",{href:`#${a.id}`,class:I({active:p.value===a.id}),onClick:$(f=>c(a.id),["prevent"])},d(a.title),11,nt)]))),128))])]))),128))])]),i("main",null,[(n(!0),o(m,null,g(S(C),t=>(n(),o("section",{key:t.id,class:"tutorials-main"},[i("h1",ot,d(t.title),1),(n(!0),o(m,null,g(t.sections,a=>(n(),o("div",{key:a.id,id:a.id,class:"tutorial-section"},[i("h2",null,d(a.title),1),E(Y,{section:a},null,8,["section"])],8,it))),128))]))),128))])])]))}}),lt=A(st,[["__scopeId","data-v-e21ab759"]]);export{lt as default};
