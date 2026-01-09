import type { DemoCategory } from "../../types/demo";

// 常量
export const DIFFICULTY_LEVELS = {
  basic: "入门",
  intermediate: "进阶",
  advanced: "高级"
};

// 演示数据配置
export const demoCategories: DemoCategory[] = [
  {
    id: "basic",
    title: "基础用法",
    description: "学习 XGantt 的基本使用方法",
    icon: "📊",
    demos: [
      {
        id: "simple",
        title: "简单甘特图",
        description: "创建一个简单的甘特图",
        category: "basic",
        difficulty: "basic",
        tags: ["入门", "基础"],
        code: [
          {
            framework: "javascript",
            language: "typescript",
            path: "basic/simple/javascript"
          },
          {
            framework: "vue",
            language: "vue",
            path: "basic/simple/vue"
          },
          {
            framework: "react",
            language: "tsx",
            path: "basic/simple/react"
          }
        ]
      },
      {
        id: "hierarchical",
        title: "层级数据",
        description: "展示具有父子关系的层级数据",
        category: "basic",
        difficulty: "basic",
        tags: ["入门", "基础", "层级", "树形"],
        code: [
          {
            framework: "javascript",
            language: "typescript",
            path: "basic/hierarchical/javascript"
          },
          {
            framework: "vue",
            language: "vue",
            path: "basic/hierarchical/vue"
          },
          {
            framework: "react",
            language: "tsx",
            path: "basic/hierarchical/react"
          }
        ]
      },
      {
        id: "field-usage",
        title: "自定义字段",
        description: "自定义字段映射和数据结构",
        category: "basic",
        difficulty: "basic",
        tags: ["入门", "字段", "数据"],
        code: [
          {
            framework: "javascript",
            language: "typescript",
            path: "basic/field-usage/javascript"
          }
        ]
      },
      {
        id: "selected",
        title: "选择任务",
        description: "选择和操作甘特图中的任务",
        category: "basic",
        difficulty: "intermediate",
        tags: ["入门", "选择", "操作", "任务"],
        code: [
          {
            framework: "javascript",
            language: "typescript",
            path: "basic/selected/javascript"
          },
          {
            framework: "vue",
            language: "vue",
            path: "basic/selected/vue"
          },
          {
            framework: "react",
            language: "tsx",
            path: "basic/selected/react"
          }
        ]
      },
      {
        id: "language-switch",
        title: "切换语言",
        description: "学习如何在甘特图中切换不同的语言",
        category: "basic",
        difficulty: "intermediate",
        tags: ["自定义", "国际化", "多语言"],
        code: [
          {
            framework: "javascript",
            language: "typescript",
            path: "basic/language-switch/javascript",
            dependencies: { dayjs: "^1.10.7" }
          }
        ]
      },
      {
        id: "customization",
        title: "自定义样式",
        description: "学习如何自定义甘特图的外观和样式",
        category: "basic",
        difficulty: "intermediate",
        tags: ["自定义", "主题", "样式"],
        code: [
          {
            framework: "javascript",
            language: "typescript",
            path: "basic/customization/javascript"
          },
          {
            framework: "vue",
            language: "vue",
            path: "basic/customization/vue"
          },
          {
            framework: "react",
            language: "tsx",
            path: "basic/customization/react"
          }
        ]
      },
      {
        id: "holiday",
        title: "配置假期",
        description: "配置指定日期为假期的自定义样式",
        category: "basic",
        difficulty: "intermediate",
        tags: ["自定义", "假期", "样式"],
        code: [
          {
            framework: "javascript",
            language: "typescript",
            path: "basic/holiday/javascript"
          },
          {
            framework: "vue",
            language: "vue",
            path: "basic/holiday/vue"
          },
          {
            framework: "react",
            language: "tsx",
            path: "basic/holiday/react"
          }
        ]
      },
      {
        id: "holiday-advanced",
        title: "配置假期（高级）",
        description: "为某个假期单独配置图片样式",
        category: "basic",
        difficulty: "advanced",
        tags: ["自定义", "假期", "样式"],
        code: [
          {
            framework: "javascript",
            language: "typescript",
            path: "basic/holiday-advanced/javascript"
          }
        ]
      },
      {
        id: "baseline",
        title: "添加基准线",
        description: "学习如何在甘特图中添加基准线",
        category: "basic",
        difficulty: "intermediate",
        tags: ["基准线", "时间", "样式"],
        code: [
          {
            framework: "javascript",
            language: "typescript",
            path: "basic/baseline/javascript"
          }
        ]
      },
      {
        id: "milestone",
        title: "添加里程碑",
        description: "学习如何在甘特图中添加里程碑",
        category: "basic",
        difficulty: "intermediate",
        tags: ["里程碑", "时间", "管理", "样式"],
        code: [
          {
            framework: "javascript",
            language: "typescript",
            path: "basic/milestone/javascript"
          }
        ]
      }
    ]
  },
  {
    id: "interaction",
    title: "交互操作",
    description: "学习如何与甘特图进行交互",
    icon: "🖱️",
    demos: [
      {
        id: "move-bar",
        title: "移动任务",
        description: "利用任务条的移动调整任务时间",
        category: "interaction",
        difficulty: "intermediate",
        tags: ["拖拽", "移动", "交互"],
        code: [
          {
            framework: "javascript",
            language: "typescript",
            path: "interaction/move-bar/javascript"
          }
        ]
      },
      {
        id: "resize-bar",
        title: "调整任务时间",
        description: "通过任务条的左右单独拖拽调整该任务的起止时间",
        category: "interaction",
        difficulty: "intermediate",
        tags: ["拖拽", "调整", "交互"],
        code: [
          {
            framework: "javascript",
            language: "typescript",
            path: "interaction/resize-bar/javascript"
          }
        ]
      },
      {
        id: "linkage-bar",
        title: "联动拖拽",
        description: "实现父子任务之间的联动调整",
        category: "interaction",
        difficulty: "intermediate",
        tags: ["联动", "调整", "交互"],
        code: [
          {
            framework: "javascript",
            language: "typescript",
            path: "interaction/linkage-bar/javascript"
          }
        ]
      },
      {
        id: "link-handle",
        title: "关连线的操作",
        description: "学习如何添加、删除和编辑任务之间的连线",
        category: "interaction",
        difficulty: "advanced",
        tags: ["连线", "操作", "交互"],
        code: [
          {
            framework: "javascript",
            language: "typescript",
            path: "interaction/link-handle/javascript"
          }
        ]
      }
    ]
  },
  {
    id: "advanced",
    title: "高级功能",
    description: "探索 XGantt 的高级特性",
    icon: "🚀",
    demos: [
      {
        id: "auto-width",
        title: "时间的自动宽度",
        description: "展示如何实现右侧自动宽度",
        category: "advanced",
        difficulty: "intermediate",
        tags: ["自动宽度", "表格", "样式"],
        code: [
          {
            framework: "javascript",
            language: "typescript",
            path: "advanced/auto-width/javascript"
          }
        ]
      },
      {
        id: "cell-merge",
        title: "单元格合并演示",
        description: "展示如何实现单元格合并",
        category: "advanced",
        difficulty: "advanced",
        tags: ["表格", "合并", "高级"],
        code: [
          {
            framework: "javascript",
            language: "typescript",
            path: "advanced/cell-merge/javascript"
          }
        ]
      },
      {
        id: "cell-render",
        title: "表格的自定义渲染",
        description: "利用高级配置实现表格的自定义渲染",
        category: "advanced",
        difficulty: "advanced",
        tags: ["表格", "渲染", "高级"],
        code: [
          {
            framework: "javascript",
            language: "typescript",
            path: "advanced/cell-render/javascript"
          }
        ]
      },
      {
        id: "custom-header",
        title: "自定义表头",
        description: "通过添加一个筛选功能，来学习自定义表格的表头部分",
        category: "advanced",
        difficulty: "advanced",
        tags: ["自定义", "表头", "筛选", "高级"],
        code: [
          {
            framework: "javascript",
            language: "typescript",
            path: "advanced/custom-header/javascript"
          }
        ]
      },
      {
        id: "full-app",
        title: "构建一个完整的应用I",
        description: "通过一个比较完整的应用，来展示 XGantt 的强大功能。该示例包含切换主题、自定义行内容、创建任务、编辑任务等功能",
        category: "advanced",
        difficulty: "advanced",
        tags: ["自定义", "渲染", "高级"],
        code: [
          {
            framework: "javascript",
            language: "typescript",
            path: "advanced/full-app/javascript",
            view: 'preview'
          }
        ]
      },
      {
        id: "full-app-2",
        title: "构建一个完整的应用II",
        description: "通过一个比较完整的应用，来展示 XGantt 的强大功能。该示例展示了加载大量数据的状态，并基本涵盖所有功能。",
        category: "advanced",
        difficulty: "advanced",
        tags: ["自定义", "渲染", "高级"],
        code: [
          {
            framework: "javascript",
            language: "typescript",
            path: "advanced/full-app-2/javascript",
            view: 'preview'
          }
        ]
      }
    ]
  },
  {
    id: "integration",
    title: "框架集成",
    description: "在不同框架中集成 XGantt",
    icon: "🔧",
    demos: [
      {
        id: "vue-composition",
        title: "Vue 组合式API",
        description: "使用 Vue 3 组合式API的最佳实践",
        category: "integration",
        difficulty: "intermediate",
        tags: ["Vue", "组合式API", "响应式"],
        code: [
          {
            framework: "vue",
            language: "vue",
            path: "integration/vue-composition/vue"
          }
        ]
      },
      {
        id: "react-hooks",
        title: "React Hooks 最佳实践",
        description: "使用 React Hooks 管理甘特图状态",
        category: "integration",
        difficulty: "intermediate",
        tags: ["React", "Hooks", "状态管理"],
        code: [
          {
            framework: "react",
            language: "tsx",
            path: "integration/react-hooks/react"
          }
        ]
      },
      {
        id: "full-app-vue-1",
        title: "使用Vue3构建一个完整的应用",
        description: "通过一个比较完整的应用，来展示 XGantt 在 Vue3 框架集成下的优秀性能。",
        category: "advanced",
        difficulty: "advanced",
        tags: ["Vue", "自定义", "渲染", "高级"],
        code: [
          {
            framework: "vue",
            language: "vue",
            path: "advanced/full-app-vue-1/vue",
            view: 'preview',
            dependencies: {
              'element-plus': '^2.11.2'
            }
          }
        ]
      }
    ]
  }
];
