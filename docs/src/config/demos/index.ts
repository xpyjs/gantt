import type { DemoCategory } from "../../types/demo";
import basicUsage from "./codes/basic-usage";
import hierarchical from "./codes/hierarchical";
import selectUsage from "./codes/select-usage";
import fieldUsage from "./codes/field-usage";
import styleUsage from "./codes/style-usage";
import languageUsage from "./codes/language-usage";
import moveUsage from "./codes/move-usage";
import resizeUsage from "./codes/resize-usage";
import linkageUsage from "./codes/linkage-usage";
import linkHandleUsage from "./codes/link-usage";
import cellMergeUsage from "./codes/cell-merge-usage";
import cellRenderUsage from "./codes/cell-render-usage";
import customHeaderUsage from "./codes/custom-header-usage";
import holidayUsage from "./codes/holiday-usage";
import holidayAdvUsage from "./codes/holiday-adv-usage";
import fullAppUsage from "./codes/full-app-usage";
import frameworkUsage from "./codes/framework";
import baselineUsage from "./codes/baseline-usage";
import milestoneUsage from "./codes/milestone-usage";

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
            language: "javascript",
            code: basicUsage.jsCode
          },
          {
            framework: "vue",
            language: "vue",
            code: basicUsage.vueCode
          },
          {
            framework: "react",
            language: "tsx",
            code: basicUsage.reactCode
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
            language: "javascript",
            code: hierarchical.jsCode
          },
          {
            framework: "vue",
            language: "vue",
            code: hierarchical.vueCode
          },
          {
            framework: "react",
            language: "tsx",
            code: hierarchical.reactCode
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
            language: "javascript",
            code: fieldUsage.jsCode
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
            language: "javascript",
            code: selectUsage.jsCode
          },
          {
            framework: "vue",
            language: "vue",
            code: selectUsage.vueCode
          },
          {
            framework: "react",
            language: "tsx",
            code: selectUsage.reactCode
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
            language: "javascript",
            code: languageUsage.jsCode,
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
            language: "javascript",
            code: styleUsage.jsCode
          },
          {
            framework: "vue",
            language: "vue",
            code: styleUsage.vueCode
          },
          {
            framework: "react",
            language: "tsx",
            code: styleUsage.reactCode
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
            language: "javascript",
            code: holidayUsage.jsCode
          },
          {
            framework: "vue",
            language: "vue",
            code: holidayUsage.vueCode
          },
          {
            framework: "react",
            language: "tsx",
            code: holidayUsage.reactCode
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
            language: "javascript",
            code: holidayAdvUsage.jsCode
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
            language: "javascript",
            code: baselineUsage.jsCode
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
            language: "javascript",
            code: milestoneUsage.jsCode
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
            language: "javascript",
            code: moveUsage.jsCode
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
            language: "javascript",
            code: resizeUsage.jsCode
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
            language: "javascript",
            code: linkageUsage.jsCode
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
            language: "javascript",
            code: linkHandleUsage.jsCode
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
        id: "cell-merge",
        title: "单元格合并演示",
        description: "展示如何实现单元格合并",
        category: "advanced",
        difficulty: "advanced",
        tags: ["表格", "合并", "高级"],
        code: [
          {
            framework: "javascript",
            language: "javascript",
            code: cellMergeUsage.jsCode
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
            language: "javascript",
            code: cellRenderUsage.jsCode
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
            language: "javascript",
            code: customHeaderUsage.jsCode
          }
        ]
      },
      {
        id: "full-app",
        title: "构建一个完整的应用",
        description: "通过一个比较完整的应用，来展示 XGantt 的强大功能",
        category: "advanced",
        difficulty: "advanced",
        tags: ["自定义", "渲染", "高级"],
        code: [
          {
            framework: "javascript",
            language: "javascript",
            code: fullAppUsage.jsCode
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
            code: frameworkUsage.vueCode
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
            code: frameworkUsage.reactCode
          }
        ]
      }
    ]
  }
];
