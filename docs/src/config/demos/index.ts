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
            code: `<template>
  <div class="vue-demo">
    <div class="controls">
      <button @click="addRandomTask" class="btn-add">➕ 添加任务</button>
      <button @click="clearTasks" class="btn-clear">🗑️ 清空</button>
      <select v-model="viewMode" @change="updateViewMode">
        <option value="day">日视图</option>
        <option value="week">周视图</option>
        <option value="month">月视图</option>
      </select>
    </div>

    <XGanttVue :options="ganttOptions" @click:row="handleTaskClick" />

    <div class="stats">
      <div class="stat">任务总数: {{ tasks.length }}</div>
      <div class="stat">完成率: {{ completionRate }}%</div>
      <div class="stat">最后操作: {{ lastAction }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { XGanttVue } from '@xpyjs/gantt-vue'
import "@xpyjs/gantt-vue/style.css"

const viewMode = ref('week')
const lastAction = ref('页面已加载')

const tasks = reactive([
  {
    id: '1',
    name: 'Vue 3 项目搭建',
    startTime: '2025-01-01',
    endTime: '2025-01-05',
    progress: 100
  },
  {
    id: '2',
    name: '组件开发',
    startTime: '2025-01-06',
    endTime: '2025-01-20',
    progress: 75
  }
])

const ganttOptions = reactive({
  data: tasks,
  width: 800,
  height: 400,
  unit: viewMode.value
})

const completionRate = computed(() => {
  if (tasks.length === 0) return 0
  const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0)
  return Math.round(totalProgress / tasks.length)
})

const addRandomTask = () => {
  const id = String(Date.now())
  const taskNames = ['前端开发', '后端开发', '测试', '部署', '文档编写']
  const randomName = taskNames[Math.floor(Math.random() * taskNames.length)]

  tasks.push({
    id,
    name: \`\${randomName} \${tasks.length + 1}\`,
    startTime: '2025-01-21',
    endTime: '2025-01-30',
    progress: Math.floor(Math.random() * 100)
  })

  lastAction.value = \`添加了任务: \${randomName}\`
}

const clearTasks = () => {
  tasks.splice(0)
  lastAction.value = '已清空所有任务'
}

const updateViewMode = () => {
  lastAction.value = \`切换到\${viewMode.value}视图\`
  ganttOptions.unit = viewMode.value
}

const handleTaskClick = (task: any) => {
  lastAction.value = \`点击了任务: \${task.name}\`
}
</script>

<style scoped>
.vue-demo {
  padding: 1rem;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}

.btn-add, .btn-clear {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-add {
  background: #52c41a;
  color: white;
}

.btn-clear {
  background: #ff4d4f;
  color: white;
}

.stats {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.stat {
  font-weight: 600;
  color: #333;
}
</style>`
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
            code: `import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { XGanttReact, useXGantt, IOptions } from '@xpyjs/gantt-react'
import '@xpyjs/gantt-react/style.css'

function App() {
    const { ganttRef, jumpTo } = useXGantt();

    // 状态管理
    const [selectedTasks, setSelectedTasks] = useState<any[]>([]);
    const [lastClickedRow, setLastClickedRow] = useState<any>(null);
    const [primaryColor, setPrimaryColor] = useState('#007acc');
    const [currentUnit, setCurrentUnit] = useState<'day' | 'week' | 'month'>('day');
    const [eventLogs, setEventLogs] = useState<Array<{
        time: string;
        event: string;
        data: string;
    }>>([]);

    // 甘特图数据 - 使用状态管理以支持动态更新
    const [ganttData, setGanttData] = useState([
        {
            id: '1',
            name: '项目规划',
            startTime: '2025-05-01',
            endTime: '2025-05-15',
            progress: 80,
            children: [
                {
                    id: '1-1',
                    name: '需求分析',
                    startTime: '2025-05-01',
                    endTime: '2025-05-05',
                    progress: 100
                },
                {
                    id: '1-2',
                    name: '技术选型',
                    startTime: '2025-05-06',
                    endTime: '2025-05-10',
                    progress: 90
                }
            ]
        },
        {
            id: '2',
            name: '开发阶段',
            startTime: '2025-05-16',
            endTime: '2025-06-15',
            progress: 45,
            children: [
                {
                    id: '2-1',
                    name: '前端开发',
                    startTime: '2025-05-16',
                    endTime: '2025-06-15',
                    progress: 70
                },
                {
                    id: '2-2',
                    name: '后端开发',
                    startTime: '2025-05-20',
                    endTime: '2025-06-20',
                    progress: 60
                }
            ]
        }
    ]);

    // 添加日志
    const addLog = useCallback((event: string, data: any) => {
        setEventLogs(prev => [
            {
                time: new Date().toLocaleTimeString(),
                event,
                data: JSON.stringify(data, null, 2).slice(0, 100) + '...'
            },
            ...prev.slice(0, 49)
        ]);
    }, []);    // 事件处理器
    const handleSelect = useCallback((data: any[], checked: boolean, all: any[]) => {
        setSelectedTasks(all);
        addLog('任务选择', { selected: data.length, total: all.length, checked });
    }, [addLog]);

    const handleClickRow = useCallback((_e: MouseEvent, data: any) => {
        setLastClickedRow(data);
        addLog('行点击', { name: data.name, id: data.id });
    }, [addLog]);

    const handleDoubleClickRow = useCallback((_e: MouseEvent, data: any) => {
        addLog('行双击', { name: data.name, id: data.id });
    }, [addLog]);

    const handleMove = useCallback((data: { row: any; old: any }[]) => {
        addLog('任务移动', { count: data.length, tasks: data.map(d => d.row.name) });
        // 注意：在实际应用中，您可能需要根据移动的数据更新本地状态
        // 这里仅做演示，实际的数据同步可以通过回调或状态管理来处理
    }, [addLog]);

    const handleError = useCallback((error: any) => {
        addLog('错误', { message: error.message, type: error.type });
        console.error('甘特图错误:', error);
    }, [addLog]);

    const changePrimaryColor = useCallback(() => {
        const colors = ['#007acc', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
        const currentIndex = colors.indexOf(primaryColor);
        const nextColor = colors[(currentIndex + 1) % colors.length];
        setPrimaryColor(nextColor);
        addLog('主色调切换', { color: nextColor });
    }, [primaryColor, addLog]);

    const changeUnit = useCallback(() => {
        const units: Array<'day' | 'week' | 'month'> = ['day', 'week', 'month'];
        const currentIndex = units.indexOf(currentUnit);
        const nextUnit = units[(currentIndex + 1) % units.length];
        setCurrentUnit(nextUnit);
        addLog('单位切换', { unit: nextUnit });
    }, [currentUnit, addLog]);

    const handleJumpToToday = useCallback(() => {
        const success = jumpTo(); // 不传参数，跳转到今天
        addLog('跳转到今天', { success });
    }, [jumpTo, addLog]);

    const handleJumpToDate = useCallback(() => {
        // 跳转到项目开始日期
        const success = jumpTo('2025-05-01');
        addLog('跳转到项目开始', { success, date: '2025-05-01' });
    }, [jumpTo, addLog]);

    const addTask = useCallback(() => {
        const newTask = {
            id: \`new-\${Date.now()}\`,
            name: \`新任务 \${Math.floor(Math.random() * 100)}\`,
            startTime: '2025-06-01',
            endTime: '2025-06-10',
            progress: Math.floor(Math.random() * 100),
            children: [] // 确保有children属性
        };

        setGanttData(prev => [...prev, newTask]);
        addLog('添加任务', { name: newTask.name, id: newTask.id });
    }, [addLog]);

    const updateProgress = useCallback(() => {
        setGanttData(prev => prev.map(task => ({
            ...task,
            progress: Math.min(100, task.progress + Math.floor(Math.random() * 10)),
            children: task.children?.map(child => ({
                ...child,
                progress: Math.min(100, child.progress + Math.floor(Math.random() * 10))
            })) || []
        })));
        addLog('更新进度', { message: '所有任务进度已随机更新' });
    }, [addLog]);

    const resetData = useCallback(() => {
        // 重置为初始数据
        setGanttData([
            {
                id: '1',
                name: '项目规划',
                startTime: '2025-05-01',
                endTime: '2025-05-15',
                progress: 80,
                children: [
                    {
                        id: '1-1',
                        name: '需求分析',
                        startTime: '2025-05-01',
                        endTime: '2025-05-05',
                        progress: 100
                    },
                    {
                        id: '1-2',
                        name: '技术选型',
                        startTime: '2025-05-06',
                        endTime: '2025-05-10',
                        progress: 90
                    }
                ]
            },
            {
                id: '2',
                name: '开发阶段',
                startTime: '2025-05-16',
                endTime: '2025-06-15',
                progress: 45,
                children: [
                    {
                        id: '2-1',
                        name: '前端开发',
                        startTime: '2025-05-16',
                        endTime: '2025-06-15',
                        progress: 70
                    },
                    {
                        id: '2-2',
                        name: '后端开发',
                        startTime: '2025-05-20',
                        endTime: '2025-06-20',
                        progress: 60
                    }
                ]
            }
        ]);
        addLog('重置数据', { message: '数据已重置为初始状态' });
    }, [addLog]);

    // 甘特图配置 - 配置会自动更新到甘特图组件
    const ganttOptions: IOptions = {
        width: 600,
        data: ganttData,
        table: {
            columns: [
                {
                    field: 'name',
                    label: '任务名称',
                    width: 100,
                    align: 'left'
                },
                {
                    field: 'progress',
                    label: '进度',
                    width: 100,
                    align: 'center'
                }
            ]
        },
        fields: {
            id: 'id',
            name: 'name',
            startTime: 'startTime',
            endTime: 'endTime',
            progress: 'progress',
            children: 'children'
        },
        primaryColor,
        unit: currentUnit,
        locale: 'zh',
        highlight: true,
        selection: {
            enabled: true
        },
        bar: {
            move: {
                enabled: true,
                byUnit: true
            }
        }
    };

    return (
        <div className="app">
            <h1>React 最佳实践</h1>

            <div className="controls">
                <button onClick={changePrimaryColor}>
                    切换主色调 ({primaryColor})
                </button>
                <button onClick={changeUnit}>
                    切换单位 ({currentUnit})
                </button>
                <button onClick={handleJumpToToday}>
                    跳转到今天
                </button>
                <button onClick={handleJumpToDate}>
                    跳转到项目开始
                </button>
                <button onClick={addTask}>
                    添加任务
                </button>
                <button onClick={updateProgress}>
                    更新进度
                </button>
                <button onClick={resetData}>
                    重置数据
                </button>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div className="gantt-wrapper">
                    <XGanttReact
                        ref={ganttRef}
                        style={{ height: '500px', width: '100%' }}
                        options={ganttOptions}
                        onSelect={handleSelect}
                        onClickRow={handleClickRow}
                        onDoubleClickRow={handleDoubleClickRow}
                        onMove={handleMove}
                        onError={handleError}
                    />
                </div>

                <div className="info-panel">
                    <h3>实时信息</h3>

                    <div className="info-section">
                        <h4>选中状态</h4>
                        <div className="info-content">
                            已选择 {selectedTasks.length} 个任务
                            {lastClickedRow && (
                                <div>最后点击: {lastClickedRow.name}</div>
                            )}
                        </div>
                    </div>

                    <div className="info-section">
                        <h4>配置信息</h4>
                        <div className="info-content">
                            <div>主色调: {primaryColor}</div>
                            <div>显示单位: {currentUnit}</div>
                            <div>任务总数: {ganttData.length}</div>
                            <div>子任务总数: {ganttData.reduce((sum, task) => sum + (task.children?.length || 0), 0)}</div>
                        </div>
                    </div>

                    <div className="info-section">
                        <h4>API 使用说明</h4>
                        <div className="info-content">
                            <div>• useXGantt: 获取 ganttRef, jumpTo</div>
                            <div>• 配置自动更新: 修改 options 自动同步</div>
                            <div>• jumpTo(): 跳转到今天</div>
                            <div>• jumpTo(date): 跳转到指定日期</div>
                        </div>
                    </div>

                    <div className="info-section">
                        <h4>事件日志</h4>
                        <div className="event-log">
                            {eventLogs.map((log, index) => (
                                <div key={index} className="log-item">
                                    <span className="log-time">{log.time}</span>
                                    <span className="log-event">{log.event}</span>
                                    <span className="log-data">{log.data}</span>
                                </div>
                            ))}
                            {eventLogs.length === 0 && (
                                <div className="info-content">暂无事件，开始操作甘特图吧！</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
`
          }
        ]
      }
    ]
  }
];
