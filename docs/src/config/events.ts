/**
 * API 事件配置 - 统一管理所有事件的信息和代码示例
 * 包含事件名称、参数、触发时机、描述、代码示例等信息
 */

/**
 * 事件参数配置接口
 */
export interface EventParameter {
  name: string;
  type: string;
  description: string;
  optional?: boolean;
}

/**
 * 代码示例配置接口
 */
export interface CodeExample {
  framework: string;
  code: string;
  language: string;
}

/**
 * 事件配置接口
 */
export interface EventConfig {
  id: string;
  name: string;
  type: string;
  description: string;
  icon?: string;
  trigger: string;
  parameters: EventParameter[];
  notes?: string[];
  examples?: CodeExample[];
}

/**
 * 事件分类配置接口
 */
export interface EventCategory {
  id: string;
  title: string;
  icon: string;
  description?: string;
  events: EventConfig[];
  examples?: CodeExample[];
}

/**
 * 导航项配置接口
 */
export interface NavigationItem {
  id: string;
  title: string;
  icon: string;
  href: string;
  children?: {
    id: string;
    title: string;
    href: string;
  }[];
}

/**
 * 最佳实践配置接口
 */
export interface BestPractice {
  id: string;
  title: string;
  icon: string;
  content: string[];
}

/**
 * 完整的事件页面配置接口
 */
export interface EventsPageConfig {
  overview: {
    title: string;
    description: string;
    examples: CodeExample[];
  };
  categories: EventCategory[];
  bestPractices: BestPractice[];
  completeExamples?: CodeExample[];
}

/**
 * 代码示例数据
 */
const codeExamples = {
  basicUsage: `// 监听任务选择事件
gantt.on('select', (selectedData, isChecked, allSelectedData) => {
  console.log('选择状态:', isChecked);
  console.log('当前选择的数据:', selectedData);
  console.log('所有选择的数据:', allSelectedData);
});

// 监听行点击事件
gantt.on('click:row', (event, rowData) => {
  console.log('点击了行:', rowData.name);
  console.log('鼠标事件:', event);
});`,

  // 系统加载事件
  loadedEvent: `gantt.on('loaded', () => {
  console.log('甘特图加载完成！');
  // 甘特图实例已准备就绪，可以进行相关操作
  // 例如：初始化完成后的业务逻辑
  initializeBusinessLogic();
});`,

  // 任务选择事件
  selectEvent: `gantt.on('select', (data, checked, all) => {
  if (checked) {
    console.log('选中了任务:', data.map(item => item.name));
    // 显示选中任务的操作按钮
    showSelectedTaskActions(data);
  } else {
    console.log('取消选中任务:', data.map(item => item.name));
    // 隐藏操作按钮
    hideSelectedTaskActions();
  }
  console.log('当前总共选中:', all.length, '个任务');

  // 更新工具栏状态
  updateToolbarState(all);
});`,

  // 行点击事件
  clickRowEvent: `gantt.on('click:row', (e, data) => {
  console.log('点击行:', data.name);
  // 获取任务详情
  showTaskDetail(data);

  // 高亮当前行
  highlightRow(data.id);

  // 更新侧边栏信息
  updateSidebarInfo(data);
});`,

  // 行双击事件
  dblclickRowEvent: `gantt.on('dblclick:row', (e, data) => {
  console.log('双击行:', data.name);
  // 进入编辑模式
  enterEditMode(data);

  // 或者打开编辑对话框
  openTaskEditDialog(data);
});`,

  // 行右键菜单事件
  contextmenuRowEvent: `gantt.on('contextmenu:row', (e, data) => {
  console.log('右键点击行:', data.name);
  // 显示自定义右键菜单
  showContextMenu({
    x: e.clientX,
    y: e.clientY,
    items: [
      { label: '编辑任务', action: () => editTask(data) },
      { label: '删除任务', action: () => deleteTask(data) },
      { label: '添加子任务', action: () => addSubTask(data) },
      { label: '查看详情', action: () => viewTaskDetail(data) }
    ]
  });
});`,

  // 任务条点击事件
  clickSliderEvent: `gantt.on('click:slider', (e, data) => {
  console.log('点击任务条:', data.name);
  // 显示任务工具提示
  showTaskTooltip(e.clientX, e.clientY, data);
});`,

  // 任务条双击事件
  dblclickSliderEvent: `gantt.on('dblclick:slider', (e, data) => {
  console.log('双击任务条:', data.name);
  // 快速编辑任务时间
  quickEditTaskTime(data);

  // 或者进入任务详细编辑
  openTaskTimeEditDialog(data);
});`,

  // 任务条右键菜单事件
  contextmenuSliderEvent: `gantt.on('contextmenu:slider', (e, data) => {
  console.log('右键点击任务条:', data.name);
  // 显示任务条专用菜单
  showSliderContextMenu({
    x: e.clientX,
    y: e.clientY,
    items: [
      { label: '调整时间', action: () => adjustTaskTime(data) },
      { label: '设置进度', action: () => setTaskProgress(data) },
      { label: '添加里程碑', action: () => addMilestone(data) },
      { label: '复制任务', action: () => copyTask(data) }
    ]
  });
});`,

  // 任务移动事件
  moveEvent: `gantt.on('move', (data) => {
  console.log('任务移动:', data);

  // 数据格式为 { row: 移动后的数据, old: 移动前的数据 }[]
  data.forEach(item => {
    console.log('任务移动:', {
      task: item.row.name,
      oldStartDate: item.old.startTime,
      newStartDate: item.row.startTime,
      oldEndDate: item.old.endTime,
      newEndDate: item.row.endTime
    });

    // 发送更新通知
    notifyTaskTimeChanged(item.row, item.old);
  });

  // 批量保存到后端
  saveTaskChanges(data);

  // 更新相关任务的依赖关系
  updateRelatedTasks(data);
});`,

  // 任务条悬停事件
  hoverSliderEvent: `gantt.on('hover:slider', (e, data) => {
  console.log('鼠标悬停在任务条:', data.name);
  // 显示任务信息
  const taskInfoDialog = showTaskBarInfo({
    x: e.clientX,
    y: e.clientY,
    data
  });
});`,

  // 任务条离开事件
  leaveSliderEvent: `gantt.on('leave:slider', (e, data) => {
  console.log('鼠标离开任务条:', data.name);
  // 隐藏任务条信息
  taskInfoDialog.hide();
});`,

  // 点击基线的事件
  clickBaselineEvent: `gantt.on('click:baseline', (e, task, baseline) => {
  console.log('点击基线:', task, baseline);
  // 获取基线详情
  showBaselineDetail(baseline);
});`,

  // 基线右键菜单事件
  contextmenuBaselineEvent: `gantt.on('contextmenu:baseline', (e, task, baseline) => {
  console.log('右键点击基线:', task, baseline);
  // 显示自定义右键菜单
  showContextMenu({
    x: e.clientX,
    y: e.clientY,
    items: [
      { label: '编辑基线', action: () => editBaseline(baseline) },
      { label: '删除基线', action: () => deleteBaseline(baseline) }
    ]
  });
});`,

  // 基线悬停事件
  hoverBaselineEvent: `gantt.on('hover:baseline', (e, task, baseline) => {
  console.log('鼠标悬停在基线:', task, baseline);
  // 显示基线信息
  showBaselineInfo(baseline);
});`,

  // 基线离开事件
  leaveBaselineEvent: `gantt.on('leave:baseline', (e, task, baseline) => {
  console.log('鼠标离开基线:', task, baseline);
  // 隐藏基线信息
  hideBaselineInfo(baseline);
});`,

  // 创建依赖关系事件
  createLinkEvent: `gantt.on('create:link', (link) => {
  console.log("创建依赖关系", link);

  // 验证依赖关系是否合理
  if (validateLink(link)) {
    // 添加到数据源，需要添加唯一键
    const linkWithId = { ...link, id: \`link_\${Date.now()}\` };
    links.push(linkWithId);

    // 保存到服务器
    saveLinkToServer(linkWithId);

    // 显示成功提示
    showSuccess('依赖关系创建成功');
  } else {
    // 显示错误提示
    showError('无法创建此依赖关系');
  }
});`,

  // 更新依赖关系事件
  updateLinkEvent: `gantt.on('update:link', (link) => {
  console.log('更新依赖关系:', link);

  // 在数据源中更新
  const index = links.findIndex(l => l.id === link.id);
  if (index !== -1) {
    links[index] = link;

    // 保存到服务器
    updateLinkOnServer(link);

    // 显示更新提示
    showInfo('依赖关系已更新');
  }
});`,

  // 选择依赖关系事件
  selectLinkEvent: `gantt.on('select:link', (add, cancel, all) => {
  if (add) {
    console.log('选中了依赖关系:', add);
    // 高亮相关任务
    highlightLinkedTasks(add);

    // 显示依赖关系信息
    showLinkInfo(add);
  }

  if (cancel) {
    console.log('取消选中依赖关系:', cancel);
    // 取消高亮
    unhighlightLinkedTasks(cancel);
  }

  console.log('当前选中的所有依赖关系:', all);

  // 更新删除按钮状态
  updateDeleteLinkButton(all.length > 0);

  // 支持键盘删除选中的依赖关系
  if (all.length > 0) {
    document.addEventListener('keydown', handleLinkKeyDelete);
  } else {
    document.removeEventListener('keydown', handleLinkKeyDelete);
  }
});`,

  // 依赖关系右键菜单事件
  contextMenuLinkEvent: `gantt.on('contextmenu:link', (e, link) => {
  console.log('右键点击依赖关系:', link);
  // 显示自定义右键菜单
  showLinkContextMenu({
    x: e.clientX,
    y: e.clientY,
    items: [
      { label: '编辑依赖关系', action: () => editLink(link) },
      { label: '删除依赖关系', action: () => deleteLink(link) }
    ]
  });
});`,

  // 错误处理事件
  errorEvent: `gantt.on('error', (error) => {
  console.error('甘特图错误:', error);

  // 根据错误类型处理
  switch (error) {
    INVALID_TYPE
    case 'LINK_NOT_ALLOWED':
      showError('连线不被允许', '请检查任务关系设置');
      break;
    case 'LINK_SAME':
      showError('不能连接相同节点', '请选择不同的任务进行连接');
      break;
    case 'LINK_EXIST':
      showError('当前关联已存在', '该依赖关系已经建立');
      break;
    case 'TASK_NOT_FOUND':
      showError('任务未找到', '请检查任务 ID 是否正确');
      break;
    case 'LINK_INVALID_ARG':
      showError('无效的链接参数', '请检查链接的任务 ID');
      break;
    case 'LINK_CYCLE':
      showError('依赖关系循环', '请检查任务之间的依赖关系');
      break;
    default:
      showError('未知错误', \`错误代码: \${error}\`);
      // 上报错误到监控系统
      reportError(error);
  }

  // 记录错误日志
  logError('GanttError', error, new Date().toISOString());
});`,

  vueEvents: `<template>
  <div>
    <XGanttVue
      ref="ganttRef"
      :data="ganttData"
      :options="ganttOptions"
      @select="handleSelect"
      @click:row="handleRowClick"
      @dblclick:row="handleRowDblClick"
      @contextmenu:row="handleRowContextMenu"
      @click:slider="handleSliderClick"
      @dblclick:slider="handleSliderDblClick"
      @contextmenu:slider="handleSliderContextMenu"
      @move="handleMove"
      @create:link="handleCreateLink"
      @update:link="handleUpdateLink"
      @select:link="handleSelectLink"
      @contextmenu:link="handleContextMenuLink"
      @error="handleError"
      @loaded="handleLoaded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import XGanttVue from '@xpyjs/gantt-vue';
import '@xpyjs/gantt-vue/style.css';

const ganttRef = ref();
const ganttData = ref({
  primaryColor: '#007bff',
  data: [
    // 示例数据
    { id: 1, name: '任务1', startTime: '2023-10-01', endTime: '2023-10-05', progress: 50 },
    { id: 2, name: '任务2', startTime: '2023-10-03', endTime: '2023-10-07', progress: 30 }
  ]
});

// 事件处理函数
const handleSelect = (data: any[], checked: boolean, all: any[]) => {
  console.log('Vue事件 - 选择:', { data, checked, all });
};

const handleRowClick = (e: MouseEvent, data: any) => {
  console.log('Vue事件 - 行点击:', { e, data });
};

const handleMove = (data: any[]) => {
  console.log('Vue事件 - 任务移动:', data);
  // 保存数据到数据库
  saveData(data);
};
</script>`,

  reactEvents: `import React, { useState, useCallback } from 'react';
import { XGanttReact, useXGantt } from '@xpyjs/gantt-react';
import '@xpyjs/gantt-react/style.css';

const GanttComponent: React.FC = () => {
  const { ganttRef, jumpTo } = useXGantt();

  const [data, setData] = useState([
    // 示例数据
    { id: 1, name: '任务1', startTime: '2023-10-01', endTime: '2023-10-05', progress: 50 },
    { id: 2, name: '任务2', startTime: '2023-10-03', endTime: '2023-10-07', progress: 30 }
  ]);
  const [primaryColor, setPrimaryColor] = useState('#007bff');

  const ganttOptions = {
    primaryColor,
    data
  }

  // 事件处理函数
  const handleSelect = useCallback((data: any[], checked: boolean, all: any[]) => {
    console.log('React事件 - 选择:', { data, checked, all });
  }, []);

  const handleRowClick = useCallback((e: MouseEvent, data: any) => {
    console.log('React事件 - 行点击:', { e, data });
  }, []);

  const handleMove = useCallback((data: any[]) => {
    console.log('React事件 - 任务移动:', data);
    // 保存到数据库
    saveData(data);
  }, []);

  return (
    <XGantt
      ref={ganttRef}
      options={ganttOptions}
      onSelect={handleSelect}
      onClickRow={handleRowClick}
      onDblClickRow={handleRowDblClick}
      onContextMenuRow={handleRowContextMenu}
      onClickSlider={handleSliderClick}
      onDblClickSlider={handleSliderDblClick}
      onContextMenuSlider={handleSliderContextMenu}
      onMove={handleMove}
      onCreateLink={handleCreateLink}
      onUpdateLink={handleUpdateLink}
      onSelectLink={handleSelectLink}
      onContextMenuLink={handleContextMenuLink}
      onError={handleError}
      onLoaded={handleLoaded}
    />
  );
};

export default GanttComponent;`,

  completeExample: `// 完整的事件监听示例
class GanttEventManager {
  constructor(gantt) {
    this.gantt = gantt;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // 任务相关事件
    this.gantt.on('select', this.handleSelect.bind(this));
    this.gantt.on('click:row', this.handleRowClick.bind(this));
    this.gantt.on('dblclick:row', this.handleRowDblClick.bind(this));
    this.gantt.on('contextmenu:row', this.handleRowContextMenu.bind(this));
    this.gantt.on('click:slider', this.handleSliderClick.bind(this));
    this.gantt.on('dblclick:slider', this.handleSliderDblClick.bind(this));
    this.gantt.on('contextmenu:slider', this.handleSliderContextMenu.bind(this));
    this.gantt.on('move', this.handleMove.bind(this));

    // 依赖关系事件
    this.gantt.on('create:link', this.handleCreateLink.bind(this));
    this.gantt.on('update:link', this.handleUpdateLink.bind(this));
    this.gantt.on('select:link', this.handleSelectLink.bind(this));
    this.gantt.on('contextmenu:link', this.handleContextMenuLink.bind(this));

    // 系统事件
    this.gantt.on('error', this.handleError.bind(this));
    this.gantt.on('loaded', this.handleLoaded.bind(this));
  }

  handleSelect(data, checked, all) {
    console.log('选择事件:', { data, checked, all });
    // 更新选择状态
    this.updateSelectionState(all);
  }

  handleMove(data) {
    console.log('移动事件:', data);
    // 保存到后端
    this.saveTaskChanges(data);
  }

  handleCreateLink(link) {
    console.log('创建依赖关系:', link);
    // 添加到数据源并保存
    this.addLinkToDataSource(link);
    this.saveLinkToServer(link);
  }

  handleError(error) {
    console.error('甘特图错误:', error);
    // 错误处理和用户提示
    this.showErrorMessage(error);
  }

  // 清理事件监听器
  destroy() {
    this.gantt.destroy();
  }
}

// 使用示例
const gantt = new XGantt(container, options);
const eventManager = new GanttEventManager(gantt);`
};

/**
 * 事件页面配置数据
 */
export const eventsPageConfig: EventsPageConfig = {
  overview: {
    title: "事件概述",
    description:
      "甘特图组件提供了丰富的事件监听机制，可以监听用户的各种操作行为。所有事件都通过 on 方法进行监听，事件触发时会传递相关的数据参数，方便开发者根据用户行为执行相应的业务逻辑。",
    examples: [
      {
        framework: "javascript",
        code: codeExamples.basicUsage,
        language: "javascript"
      }
    ]
  },
  categories: [
    {
      id: "task-events",
      title: "任务相关事件",
      icon: "📋",
      description: "用户与任务进行交互时触发的事件",
      events: [
        {
          id: "select",
          name: "select",
          type: "选择状态变化",
          description: "当任务的选择状态发生变化时触发",
          trigger: "当任务的选择状态发生变化时",
          parameters: [
            {
              name: "data",
              type: "any[]",
              description: "当前操作的任务数据数组"
            },
            {
              name: "checked",
              type: "boolean",
              description: "选择状态（true=选中，false=取消选中）"
            },
            {
              name: "all",
              type: "any[]",
              description: "所有已选中的任务数据数组"
            }
          ],
          examples: [
            {
              framework: "javascript",
              code: codeExamples.selectEvent,
              language: "javascript"
            }
          ]
        },
        {
          id: "click:row",
          name: "click:row",
          type: "行点击",
          description: "用户单击任务行时触发",
          trigger: "用户单击任务行时",
          parameters: [
            {
              name: "e",
              type: "MouseEvent",
              description: "鼠标事件对象"
            },
            {
              name: "data",
              type: "any",
              description: "被点击行的任务数据"
            }
          ],
          examples: [
            {
              framework: "javascript",
              code: codeExamples.clickRowEvent,
              language: "javascript"
            }
          ]
        },
        {
          id: "dblclick:row",
          name: "dblclick:row",
          type: "行双击",
          description: "用户双击任务行时触发",
          trigger: "用户双击任务行时",
          parameters: [
            {
              name: "e",
              type: "MouseEvent",
              description: "鼠标事件对象"
            },
            {
              name: "data",
              type: "any",
              description: "被双击行的任务数据"
            }
          ],
          notes: ["双击事件会多次触发鼠标点击"],
          examples: [
            {
              framework: "javascript",
              code: codeExamples.dblclickRowEvent,
              language: "javascript"
            }
          ]
        },
        {
          id: "contextmenu:row",
          name: "contextmenu:row",
          type: "行右键菜单",
          description: "用户在任务行上右键点击时触发",
          trigger: "用户在任务行上右键点击时",
          parameters: [
            {
              name: "e",
              type: "MouseEvent",
              description: "鼠标事件对象"
            },
            {
              name: "data",
              type: "any",
              description: "被右键点击行的任务数据"
            }
          ],
          examples: [
            {
              framework: "javascript",
              code: codeExamples.contextmenuRowEvent,
              language: "javascript"
            }
          ]
        },
        {
          id: "click:slider",
          name: "click:slider",
          type: "任务条点击",
          description: "用户单击任务条时触发",
          trigger: "用户单击任务条时",
          parameters: [
            {
              name: "e",
              type: "MouseEvent",
              description: "鼠标事件对象"
            },
            {
              name: "data",
              type: "any",
              description: "被点击任务条的数据"
            }
          ],
          examples: [
            {
              framework: "javascript",
              code: codeExamples.clickSliderEvent,
              language: "javascript"
            }
          ]
        },
        {
          id: "dblclick:slider",
          name: "dblclick:slider",
          type: "任务条双击",
          description: "用户双击任务条时触发",
          trigger: "用户双击任务条时",
          parameters: [
            {
              name: "e",
              type: "MouseEvent",
              description: "鼠标事件对象"
            },
            {
              name: "data",
              type: "any",
              description: "被双击任务条的数据"
            }
          ],
          notes: ["双击事件会多次触发鼠标点击"],
          examples: [
            {
              framework: "javascript",
              code: codeExamples.dblclickSliderEvent,
              language: "javascript"
            }
          ]
        },
        {
          id: "contextmenu:slider",
          name: "contextmenu:slider",
          type: "任务条右键菜单",
          description: "用户在任务条上右键点击时触发",
          trigger: "用户在任务条上右键点击时",
          parameters: [
            {
              name: "e",
              type: "MouseEvent",
              description: "鼠标事件对象"
            },
            {
              name: "data",
              type: "any",
              description: "被右键点击任务条的数据"
            }
          ],
          examples: [
            {
              framework: "javascript",
              code: codeExamples.contextmenuSliderEvent,
              language: "javascript"
            }
          ]
        },
        {
          id: "move",
          name: "move",
          type: "任务移动",
          description: "用户拖拽移动任务时间时触发",
          trigger: "用户拖拽移动任务时间时",
          parameters: [
            {
              name: "data",
              type: "{ row: any; old: any }[]",
              description: "移动的任务数据数组"
            }
          ],
          notes: [
            "移动时，XGantt 内部已经更新了数据，所以数据源已经是新数据。如果需要撤销本次移动，请使用 old 数据进行相应替换，并更新视图。"
          ],
          examples: [
            {
              framework: "javascript",
              code: codeExamples.moveEvent,
              language: "javascript"
            }
          ]
        },
        {
          id: "hover:slider",
          name: "hover:slider",
          type: "任务条悬停",
          description: "鼠标悬停在任务条上时触发",
          trigger: "鼠标悬停在任务条上时",
          parameters: [
            {
              name: "e",
              type: "MouseEvent",
              description: "鼠标事件对象"
            },
            {
              name: "data",
              type: "any",
              description: "悬停的任务数据"
            }
          ],
          examples: [
            {
              framework: "javascript",
              code: codeExamples.hoverSliderEvent,
              language: "javascript"
            }
          ]
        },
        {
          id: "leave:slider",
          name: "leave:slider",
          type: "任务条离开",
          description: "鼠标离开任务条时触发",
          trigger: "鼠标离开任务条时",
          parameters: [
            {
              name: "e",
              type: "MouseEvent",
              description: "鼠标事件对象"
            },
            {
              name: "data",
              type: "any",
              description: "离开的任务数据"
            }
          ],
          examples: [
            {
              framework: "javascript",
              code: codeExamples.leaveSliderEvent,
              language: "javascript"
            }
          ]
        }
      ]
    },
    {
      id: "baseline-events",
      title: "基线相关事件",
      icon: "📏",
      description: "用户与基线进行交互时触发的事件",
      events: [
        {
          id: "click:baseline",
          name: "click:baseline",
          type: "基线点击",
          description: "用户单击基线时触发",
          trigger: "用户单击基线时",
          parameters: [
            {
              name: "e",
              type: "MouseEvent",
              description: "鼠标事件对象"
            },
            {
              name: "task",
              type: "any",
              description: "任务数据"
            },
            {
              name: "baseline",
              type: "any",
              description: "基线数据"
            }
          ],
          examples: [
            {
              framework: "javascript",
              code: codeExamples.clickBaselineEvent,
              language: "javascript"
            }
          ]
        },
        {
          id: "contextmenu:baseline",
          name: "contextmenu:baseline",
          type: "基线右键菜单",
          description: "用户在基线上右键点击时触发",
          trigger: "用户在基线上右键点击时",
          parameters: [
            {
              name: "e",
              type: "MouseEvent",
              description: "鼠标事件对象"
            },
            {
              name: "task",
              type: "any",
              description: "任务数据"
            },
            {
              name: "baseline",
              type: "any",
              description: "基线数据"
            }
          ],
          examples: [
            {
              framework: "javascript",
              code: codeExamples.contextmenuBaselineEvent,
              language: "javascript"
            }
          ]
        },
        {
          id: "hover:baseline",
          name: "hover:baseline",
          type: "基线悬停",
          description: "鼠标悬停在基线上时触发",
          trigger: "鼠标悬停在基线上时",
          parameters: [
            {
              name: "e",
              type: "MouseEvent",
              description: "鼠标事件对象"
            },
            {
              name: "task",
              type: "any",
              description: "任务数据"
            },
            {
              name: "baseline",
              type: "any",
              description: "基线数据"
            }
          ],
          examples: [
            {
              framework: "javascript",
              code: codeExamples.hoverBaselineEvent,
              language: "javascript"
            }
          ]
        },
        {
          id: "leave:baseline",
          name: "leave:baseline",
          type: "基线离开",
          description: "用户离开基线时触发",
          trigger: "用户离开基线时",
          parameters: [
            {
              name: "e",
              type: "MouseEvent",
              description: "鼠标事件对象"
            },
            {
              name: "task",
              type: "any",
              description: "任务数据"
            },
            {
              name: "baseline",
              type: "any",
              description: "基线数据"
            }
          ],
          examples: [
            {
              framework: "javascript",
              code: codeExamples.leaveBaselineEvent,
              language: "javascript"
            }
          ]
        }
      ]
    },
    {
      id: "link-events",
      title: "依赖关系事件",
      icon: "🔗",
      description: "用户操作任务依赖关系时触发的事件",
      events: [
        {
          id: "create:link",
          name: "create:link",
          type: "创建依赖关系",
          description: "用户创建新的任务依赖关系时触发",
          trigger: "用户创建新的任务依赖关系时",
          parameters: [
            {
              name: "linkData",
              type: "ILink",
              description: "新创建的依赖关系数据"
            }
          ],
          examples: [
            {
              framework: "javascript",
              code: codeExamples.createLinkEvent,
              language: "javascript"
            }
          ]
        },
        {
          id: "update:link",
          name: "update:link",
          type: "更新依赖关系",
          description: "依赖关系被修改时触发",
          trigger: "依赖关系被修改时",
          parameters: [
            {
              name: "linkData",
              type: "ILink",
              description: "更新后的依赖关系数据"
            }
          ],
          examples: [
            {
              framework: "javascript",
              code: codeExamples.updateLinkEvent,
              language: "javascript"
            }
          ]
        },
        {
          id: "select:link",
          name: "select:link",
          type: "选择依赖关系",
          description: "用户点击选择或取消选择依赖关系线时触发",
          trigger: "用户点击选择或取消选择依赖关系线时",
          parameters: [
            {
              name: "add",
              type: "ILink | null",
              description: "新增选择的依赖关系（如果有）"
            },
            {
              name: "cancel",
              type: "ILink | null",
              description: "取消选择的依赖关系（如果有）"
            },
            {
              name: "all",
              type: "ILink[]",
              description: "当前所有选中的依赖关系数组"
            }
          ],
          examples: [
            {
              framework: "javascript",
              code: codeExamples.selectLinkEvent,
              language: "javascript"
            }
          ]
        },
        {
          id: "contextmenu:link",
          name: "contextmenu:link",
          type: "依赖关系右键菜单",
          description: "用户在依赖关系线上右键点击时触发",
          trigger: "用户在依赖关系线上右键点击时",
          parameters: [
            {
              name: "e",
              type: "MouseEvent",
              description: "鼠标事件对象"
            },
            {
              name: "linkData",
              type: "ILink",
              description: "被右键点击的依赖关系数据"
            }
          ],
          examples: [
            {
              framework: "javascript",
              code: codeExamples.contextMenuLinkEvent,
              language: "javascript"
            }
          ]
        }
      ]
    },
    {
      id: "system-events",
      title: "系统事件",
      icon: "⚠️",
      description: "系统状态变化或错误时触发的事件",
      events: [
        {
          id: "loaded",
          name: "loaded",
          type: "组件加载完成",
          description: "甘特图组件完全加载并初始化完成时触发",
          trigger: "甘特图组件完全加载并初始化完成时",
          parameters: [],
          notes: [
            "此事件在甘特图实例完全准备就绪后触发",
            "可以在此事件之后执行需要对甘特图实例的操作",
            "该事件只会触发一次"
          ],
          examples: [
            {
              framework: "javascript",
              code: codeExamples.loadedEvent,
              language: "javascript"
            }
          ]
        },
        {
          id: "error",
          name: "error",
          type: "错误处理",
          description: "甘特图组件发生错误时触发",
          trigger: "甘特图组件发生错误时",
          parameters: [
            {
              name: "error",
              type: "ErrorType",
              description: "错误类型"
            }
          ],
          notes: [
            "ErrorType 错误类型：",
            "INVALID_TYPE - 无效类型",
            "LINK_NOT_ALLOWED - 连线不被允许",
            "LINK_SAME - 相同节点",
            "LINK_EXIST - 当前关联已存在",
            "TASK_NOT_FOUND - 任务不存在",
            "LINK_INVALID_ARG - 依赖关系参数错误",
            "LINK_CYCLE - 依赖关系循环"
          ],
          examples: [
            {
              framework: "javascript",
              code: codeExamples.errorEvent,
              language: "javascript"
            }
          ]
        }
      ]
    }
  ],
  bestPractices: [
    {
      id: "event-handling",
      title: "事件处理建议",
      icon: "💡",
      content: [
        "在事件处理函数中避免执行耗时操作，必要时使用防抖或节流",
        "及时清理事件监听器，避免内存泄漏",
        "在移动和创建/更新依赖关系事件中，记得同步更新数据源",
        "合理利用错误事件提供用户友好的错误提示"
      ]
    },
    {
      id: "performance",
      title: "性能优化",
      icon: "⚡",
      content: [
        "对于频繁触发的事件（如鼠标移动），考虑使用节流",
        "批量处理数据更新，避免频繁调用 update",
        "在大数据量场景下，考虑异步处理事件回调"
      ]
    },
    {
      id: "data-sync",
      title: "数据同步",
      icon: "🔄",
      content: [
        "在任务移动事件中及时更新数据源，保持界面与数据一致",
        "在依赖关系事件中正确处理数据的增删改，避免重复或遗漏",
        "考虑实现乐观更新，提升用户体验"
      ]
    }
  ],
  completeExamples: [
    {
      framework: "javascript",
      code: codeExamples.completeExample,
      language: "javascript"
    },
    {
      framework: "vue",
      code: codeExamples.vueEvents,
      language: "vue"
    },
    {
      framework: "react",
      code: codeExamples.reactEvents,
      language: "tsx"
    }
  ]
};

export default eventsPageConfig;
