import BasicUsage from "./codes/basic-usage";
import FrameworksUsage from "./codes/frameworks-usage";

// 代码块内容类型
export interface CodeBlock {
  framework: string; // 框架标识，用于匹配 tabs
  code: string; // 代码内容
  language: string; // 语言标识，用于语法高亮
}

// 教程章节类型
export interface TutorialSection {
  id: string;
  title: string;
  description: string;
  subsections?: TutorialSubsection[];
  code?: CodeBlock[];
  customContent?: string;
}

// 教程子章节类型
export interface TutorialSubsection {
  id?: string;
  title?: string;
  description?: string;
  code?: CodeBlock[];
  list?: string[];
  table?: {
    headers: string[];
    rows: Array<{
      property: string;
      type: string;
      default: string;
      description: string;
    }>;
  };
  customContent?: string;
}

// 教程分类类型
export interface TutorialCategory {
  id: string;
  title: string;
  sections: TutorialSection[];
}

// 教程配置
export const tutorialConfig: TutorialCategory[] = [
  {
    id: "quick-start",
    title: "快速入门",
    sections: [
      {
        id: "installation",
        title: "安装",
        description:
          "XGantt 支持多种安装方式，你可以根据项目需求选择合适的包。",
        subsections: [
          {
            title: "核心包",
            code: [
              {
                framework: "vue",
                code: "npm install @xpyjs/gantt-vue",
                language: "bash"
              },
              {
                framework: "react",
                code: "npm install @xpyjs/gantt-react",
                language: "bash"
              },
              {
                framework: "javascript",
                code: "npm install @xpyjs/gantt-core",
                language: "bash"
              }
            ]
          }
        ]
      },
      {
        id: "basic-usage",
        title: "基础用法",
        description: "以下是不同框架下的基础使用方法：",
        code: [
          {
            framework: "vue",
            code: BasicUsage.vueCode,
            language: "vue"
          },
          {
            framework: "react",
            code: BasicUsage.reactCode,
            language: "tsx"
          },
          {
            framework: "javascript",
            code: BasicUsage.jsCode,
            language: "javascript"
          }
        ],
        customContent: `这样在浏览器中就可以看到效果了。想要实践一下，去 <a href="/demo/basic/simple">演示广场</a> 试试吧。`
      },
      {
        id: "data-structure",
        title: "数据结构",
        description:
          "数据结构应当保证有唯一 id。如果需要展示时间进度等信息，需要添加对应字段。这些字段都可以通过 fields 来自定义。",
        subsections: [
          {
            title: "基础数据结构",
            code: [
              {
                framework: "javascript",
                code: `const data = [
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
]`,
                language: "javascript"
              }
            ]
          }
        ]
      },
      {
        id: "configuration",
        title: "配置选项",
        description: "XGantt 提供了丰富的配置选项来定制甘特图的外观和行为。",
        customContent: `可以参考 <a href="/api">API Reference</a> 查看详细配置。`,
        subsections: [
          {
            table: {
              headers: ["属性", "类型", "默认值", "说明"],
              rows: [
                {
                  property: "primaryColor",
                  type: "String",
                  default: '"#eca710"',
                  description: "主色调"
                },
                {
                  property: "unit",
                  type: "String",
                  default: '"day"',
                  description: "时间刻度单位"
                },
                {
                  property: "width",
                  type: "Number",
                  default: "undefined",
                  description: "甘特图宽度"
                },
                {
                  property: "height",
                  type: "Number",
                  default: "undefined",
                  description: "甘特图高度"
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: "core-concepts",
    title: "核心概念",
    sections: [
      {
        id: "table",
        title: "表格",
        description:
          "表格是甘特图的重要组成部分，它在整个视图的左侧，用于展示任务的重要信息。",
        subsections: [
          {
            customContent: `<img src="/tutorials-table.png" />`
          },
          {
            code: [
              {
                framework: "javascript",
                code: `const options = {
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
}`,
                language: "javascript"
              }
            ]
          }
        ],
        customContent: `完整表格配置可以参考 <a href="/api/#table">Table API</a>`
      },
      {
        id: "time-axis",
        title: "时间轴",
        description:
          "时间轴是甘特图的核心概念，用于可视化任务的用时、进度等重要指标。 XGantt 支持多种时间单位和自定义格式。",
        subsections: [
          {
            customContent: `<img src="/tutorials-axis.png" />`
          },
          {
            title: "时间单位",
            list: [
              "`hour` - 小时",
              "`day` - 天（默认）",
              "`week` - 周",
              "`month` - 月",
              "`quarter` - 季度"
            ]
          },
          {
            code: [
              {
                framework: "javascript",
                code: `const options = {
  unit: 'week',                    // 设置时间单位为周
  chart: {                         // chart 字段可以对时间轴区域进行各种配置
    cellWidth: 30
  }
}`,
                language: "javascript"
              }
            ]
          }
        ],
        customContent: `完整时间轴的图表区域配置可以参考 <a href="/api/#chart">Chart API</a>`
      },
      {
        id: "task-bars",
        title: "任务条",
        description:
          "任务条是甘特图中 显示/操作 任务时间范围和进度的可视化元素。",
        code: [
          {
            framework: "javascript",
            code: `const options = {
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
}`,
            language: "javascript"
          }
        ],
        customContent: `完整任务条配置可以参考 <a href="/api/#bar">Bar API</a>`
      },
      {
        id: "dependencies",
        title: "依赖关系",
        description:
          "XGantt 支持任务之间的依赖关系，包括创建、编辑和删除依赖线。",
        subsections: [
          {
            description: "现在的 XGantt 支持更多依赖关系：",
            list: [
              "`FS` - 完成-开始（默认）",
              "`FF` - 完成-完成",
              "`SS` - 开始-开始",
              "`SF` - 开始-完成"
            ],
            customContent: `<img src="/tutorials-link.png" />`
          },
          {
            description:
              "它们分别对应任务条的 左侧(开始)、右侧(完成) 的连线方式。"
          },
          {
            code: [
              {
                framework: "javascript",
                code: `const options = {
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
}`,
                language: "javascript"
              }
            ]
          },
          {
            customContent: `完整关连线配置可以参考 <a href="/api/#links">Links API</a>`
          },
          {
            title: "依赖关系的使用",
            description: "依赖关系线的使用，需要配置、事件配合"
          },
          {
            description: "1、加载数据，并进行相关设置"
          },
          {
            code: [
              {
                framework: "javascript",
                language: "javascript",
                code: ` const links = [
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
}`
              }
            ]
          },
          {
            description: "2、配置好所有属性，通过事件可以进行控制。"
          },
          {
            code: [
              {
                framework: "javascript",
                language: "javascript",
                code: `// 更新关连线
gantt.on("update:link", link => {
  const index = links.findIndex(l => l.index === link.index);
  if (index !== -1) {
    links.splice(index, 1, link);
    gantt.update({ links: { data: links } });
  }
});

// 添加连线
gantt.on("create:link", link => {
  links.push({ ...link, index: \`\${Date.now()}\` });   // 需要保证每一个添加的依赖关系都有唯一字段值
  gantt.update({ links: { data: links } });
});

// 选中连线
gantt.on("select:link", (add, cancel, all) => {
  if (add?.index === "555") {
    links.splice(links.findIndex(l => l.index === add.index), 1);  // 模拟选中删除
    gantt.update({ links: { data: links } });
  }
});`
              }
            ]
          },
          {
            description:
              "为保证数据的准确，所有数据需要用户手动操作，然后通知 XGantt 更新界面。"
          }
        ]
      },
      {
        id: "events",
        title: "事件交互",
        description:
          "XGantt 提供了完整的事件交互功能，基本可以满足大部分使用场景。",
        code: [
          {
            framework: "vue",
            code: `<XGanttVue
  :options="options"
  @move="onTaskMove"
  @select="onTaskSelect"
  @click:row="onRowClick"
  @create:link="onLinkCreate"
/>`,
            language: "vue"
          },
          {
            framework: "react",
            code: `// React 事件需要使用首字母大写拼接
<XGanttReact
  options={options}
  onMove={handleTaskMove}
  onSelect={handleTaskSelect}
  onClickRow={handleRowClick}
  onCreateLink={handleLinkCreate}
/>`,
            language: "tsx"
          },
          {
            framework: "javascript",
            code: `// 原生 JavaScript 事件监听
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
});`,
            language: "javascript"
          }
        ],
        customContent: `完整的事件可以参考 <a href="/api/#events">Event API</a>`
      }
    ]
  },
  {
    id: "advanced-features",
    title: "高级功能",
    sections: [
      {
        id: "custom-table",
        title: "定制表格",
        description:
          "表格支持丰富的自定义配置，包括多行表头、表格内容、以及自定义渲染等。",
        subsections: [
          {
            code: [
              {
                framework: "javascript",
                code: `const options = {
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
}`,
                language: "javascript"
              }
            ]
          },
          {
            description:
              "渲染的内容如下图，可以看到多级表头，合并的行列，以及自定义的表格内容："
          },
          {
            customContent: `<img src="/tutorials-custom-table.png" />`
          }
        ]
      },
      {
        id: "custom-chart",
        title: "定制时间轴",
        description: "时间轴支持丰富的自定义配置，包括颜色、样式等。",
        subsections: [
          {
            code: [
              {
                framework: "javascript",
                code: `const options = {
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
}`,
                language: "javascript"
              }
            ]
          },
          {
            description:
              "渲染的内容如下图，可以看到表头、任务条、周末、假期等自定义后的显示效果："
          },
          {
            customContent: `<img src="/tutorials-custom-axis.png" />`
          }
        ]
      },
      {
        id: "frameworks",
        title: "框架集成",
        description:
          "XGantt 可以很方便的集成到各种框架中。并且 XGantt 已经自带 vue 与 react 的框架",
        subsections: [
          {
            title: "Vue 集成",
            code: [
              {
                framework: "vue",
                language: "vue",
                code: FrameworksUsage.vueCode
              },
              {
                framework: "react",
                language: "tsx",
                code: FrameworksUsage.reactCode
              },
              {
                framework: "angular",
                language: "ts",
                code: FrameworksUsage.angularCode
              }
            ]
          }
        ]
      },
      {
        id: "performance",
        title: "性能优化",
        description:
          "为了确保在大数据量下的流畅体验，XGantt 内置了多种性能优化策略。在多数情况，用户不用关心也不必担心性能问题，但是用户仍然可以通过编码使其更加优秀。",
        subsections: [
          {
            list: [
              "**确保数据唯一键**：尽可能给每条数据添加唯一 ID，这会让 XGantt 处理数据更加高效",
              "**只更新需要的内容**：尽可能不要每次全量更新 options，当数据没有变化时，不要传递它",
              "**拖拽功能**：拖拽是一个耗时操作，非必要不开启，尽量启用按单位拖拽（byUnit）"
            ]
          }
        ]
      }
    ]
  }
];

// 导出扁平化的导航菜单数据
export const getNavigationData = () => {
  const navigation: Array<{
    id: string;
    title: string;
    sections: Array<{ id: string; title: string }>;
  }> = [];

  tutorialConfig.forEach(category => {
    navigation.push({
      id: category.id,
      title: category.title,
      sections: category.sections.map(section => ({
        id: section.id,
        title: section.title
      }))
    });
  });

  return navigation;
};

// 根据ID获取章节数据
export const getSectionById = (
  sectionId: string
): TutorialSection | undefined => {
  for (const category of tutorialConfig) {
    const section = category.sections.find(s => s.id === sectionId);
    if (section) return section;
  }
  return undefined;
};
