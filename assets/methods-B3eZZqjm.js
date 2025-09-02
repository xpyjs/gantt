const t={basicUsage:`// 基本使用方法
import { XGantt } from '@xpyjs/gantt-core';

// 创建甘特图实例
const gantt = new XGantt('#gantt-container', {
  data: taskData,
  unit: 'day',
  primaryColor: '#007acc'
});

// 监听事件
gantt.on('select', (data, checked, all) => {
  console.log('任务选择:', { data, checked, all });
});

// 动态更新配置
gantt.update({
  unit: 'week',
  primaryColor: '#ff6b6b'
});`,constructor:`// 通过选择器创建
const gantt = new XGantt('#gantt-container', {
  data: taskData,
  unit: 'day',
  primaryColor: '#007acc'
});

// 通过DOM元素创建
const container = document.getElementById('gantt-container');
const gantt = new XGantt(container, options);`,update:`// 更新数据源
gantt.update({
  data: newTaskData
});

// 更新显示单位
gantt.update({
  unit: 'month'
});

// 更新主题色
gantt.update({
  primaryColor: '#ff6b6b'
});

// 批量更新多个配置
gantt.update({
  unit: 'week',
  primaryColor: '#4ecdc4',
  dateFormat: 'YYYY-MM-DD',
  row: {
    height: 40
  }
});

// 完全替换配置（不合并）
gantt.update(newOptions, { merge: false });`,render:`// 强制重新渲染
gantt.render();

// 常见使用场景：窗口大小改变后重新渲染
window.addEventListener('resize', () => {
  gantt.render();
});`,jumpTo:`// 跳转到今天
gantt.jumpTo();

// 跳转到指定日期（字符串）
gantt.jumpTo('2024-06-01');

// 跳转到指定日期（Date对象）
gantt.jumpTo(new Date('2024-06-01'));

// 跳转到当前时间
gantt.jumpTo(new Date());

// 检查跳转结果
const success = gantt.jumpTo('2024-06-01');
if (success) {
  console.log('跳转成功');
} else {
  console.log('跳转失败，可能是日期格式不正确');
}`,getDataChain:`// 获取任务的完整链路信息
const dataChain = gantt.getDataChain('task-1');
console.log('任务的完整链路信息:', dataChain);
`,eventOff:`// 移除特定的任务选择事件监听器
const selectHandler = (data, checked, all) => {
  console.log('选择了任务:', data);
};
gantt.on('select', selectHandler);

// 当不再需要时，可以移除该监听器
gantt.off('select', selectHandler);

// 移除所有任务选择事件监听器
gantt.off('select');
`,eventOn:`// 监听任务选择事件
gantt.on('select', (selectedData, isChecked, allSelectedData) => {
  console.log('选择状态:', isChecked);
  console.log('当前选择的数据:', selectedData);
  console.log('所有选择的数据:', allSelectedData);
});

// 监听行点击事件
gantt.on('click:row', (event, rowData) => {
  console.log('点击了行:', rowData.name);
  console.log('鼠标事件:', event);
});

// 监听任务移动事件
gantt.on('move', (moveData) => {
  moveData.forEach(item => {
    console.log(\`任务 \${item.row.name} 从 \${item.old.startTime} 移动到 \${item.row.startTime}\`);
  });
});

// 监听依赖关系创建事件
gantt.on('create:link', (link) => {
  console.log('创建了新的依赖关系:', link);
  // 保存到后端
  saveLinkToServer(link);
});

// 监听错误事件
gantt.on('error', (error) => {
  console.error('甘特图发生错误:', error);
  showErrorNotification(error.message);
});`,destroy:`// 基本用法
gantt.destroy();

// React 组件中的使用示例
useEffect(() => {
  const gantt = new XGantt('#gantt-container', options);
  gantt.render();

  return () => {
    gantt.destroy(); // 组件卸载时清理
  };
}, []);

// Vue 组件中的使用示例
onBeforeUnmount(() => {
  if (gantt) {
    gantt.destroy();
  }
});

// 页面离开时清理
window.addEventListener('beforeunload', () => {
  gantt.destroy();
});`,reactMethods:`import { useState, useCallback } from 'react';
import { XGanttReact, useXGantt } from '@xpyjs/gantt-react';
import '@xpyjs/gantt-react/style.css';

function MyComponent() {
  const { ganttRef, jumpTo } = useXGantt();

  const handleJumpToToday = () => {
    jumpTo(); // 跳转到今天
  };

  const [primaryColor, setPrimaryColor] = useState('#007acc');

  const ganttOptions = {
    data: [
      { id: 1, name: '任务1', startTime: '2024-06-01', endTime: '2024-06-05' },
      { id: 2, name: '任务2', startTime: '2024-06-03', endTime: '2024-06-07' }
    ],
    unit: 'day',
    primaryColor: primaryColor,
  };

  const changePrimaryColor = useCallback(() => {
        const colors = ['#007acc', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
        const currentIndex = colors.indexOf(primaryColor);
        const nextColor = colors[(currentIndex + 1) % colors.length];
        setPrimaryColor(nextColor);
    }, [primaryColor]);

  return (
    <div>
      <button onClick={handleJumpToToday}>跳转今天</button>
      <button onClick={changePrimaryColor}>更新主题颜色</button>
      <XGanttReact ref={ganttRef} options={ganttOptions} />
    </div>
  );
}`,vueMethods:`<template>
  <div>
    <button @click="handleJumpToToday">跳转今天</button>
    <button @click="handleUpdate">更新配置</button>
    <XGanttVue ref="ganttRef" :options="options" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { type XGanttInstance } from "@xpyjs/gantt-vue";
import XGanttVue from "@xpyjs/gantt-vue";
import "@xpyjs/gantt-vue/style.css";

const ganttRef = ref<XGanttInstance>();

const options = reactive({
  data: [
    { id: 1, name: '任务1', startTime: '2024-06-01', endTime: '2024-06-05' },
    { id: 2, name: '任务2', startTime: '2024-06-03', endTime: '2024-06-07' }
  ],
  unit: 'day',
  primaryColor: '#007acc'
});

const handleJumpToToday = () => {
  ganttRef.value?.jumpTo();
};

const handleUpdate = () => {
  options.unit = 'week'; // 更新本地选项
  options.primaryColor = '#28a745'; // 更新本地选项
};
<\/script>`},e={overview:{title:"方法概述",description:"XGantt 提供了丰富的 API 方法，用于控制甘特图的创建、配置、渲染、导航等各个方面。这些方法在各个框架中都有对应的封装实现。",examples:[{framework:"javascript",code:t.basicUsage,language:"javascript"}]},methods:[{id:"constructor",name:"new XGantt(container, options)",type:"构造函数",description:"创建甘特图实例",icon:"🎯",trigger:"创建甘特图实例时",parameters:[{name:"container",type:"string | HTMLElement",description:"容器选择器或DOM元素",optional:!1},{name:"options",type:"IOptions",description:"甘特图配置选项",optional:!1}],returnType:"XGantt",returnDescription:"甘特图实例",examples:[{framework:"javascript",code:t.constructor,language:"javascript"}]},{id:"getDataChain",name:"getDataChain(id)",type:"获取某个节点的完整链路信息",description:"获取指定任务的所有相关联的完整路径，包含所有连接线与任务节点",icon:"⛓️",parameters:[{name:"id",type:"string",description:"节点 ID",optional:!1}],returnType:"DataChain",returnDescription:"节点的完整链路信息表",examples:[{framework:"javascript",code:t.getDataChain,language:"javascript"}]},{id:"update",name:"update(options, config?)",type:"配置更新",description:"动态更新甘特图的配置选项",icon:"⚙️",parameters:[{name:"options",type:"IOptions",description:"新的配置选项，支持部分更新",optional:!1},{name:"config",type:"IOptionConfig",description:"配置更新参数",optional:!0}],returnType:"void",examples:[{framework:"javascript",code:t.update,language:"javascript"}]},{id:"render",name:"render()",type:"强制渲染",description:"强制重新渲染甘特图视图",icon:"🎨",parameters:[],returnType:"void",notes:["此方法通常不需要主动调用，初始化以及 update 中都会自动更新。仅在需要强制刷新页面时调用。"],examples:[{framework:"javascript",code:t.render,language:"javascript"}]},{id:"jumpTo",name:"jumpTo(date?)",type:"日期跳转",description:"跳转到指定日期的时间轴位置",icon:"🧭",parameters:[{name:"date",type:"any",description:"目标日期",optional:!0}],returnType:"boolean",returnDescription:"是否跳转成功",notes:["支持字符串格式：'2024-06-01'","支持 Date 对象","支持 dayjs 对象","支持任何可以被解析为日期的格式","不传参数则跳转到今天"],examples:[{framework:"javascript",code:t.jumpTo,language:"javascript"}]},{id:"off",name:"off(event, callback?)",type:"事件解除监听",description:"移除事件监听器或所有监听器",icon:"❌",parameters:[{name:"event",type:"string",description:"要解除监听的事件名称",optional:!1},{name:"callback",type:"EventCallback",description:"要移除的特定回调函数，若不传则移除所有监听器",optional:!0}],returnType:"void",examples:[{framework:"javascript",code:t.eventOff,language:"javascript"}]},{id:"on",name:"on(event, callback)",type:"事件监听",description:"注册事件监听器",icon:"🎧",parameters:[{name:"event",type:"string",description:"事件名称",optional:!1},{name:"callback",type:"EventCallback",description:"事件回调函数",optional:!1}],returnType:"void",examples:[{framework:"javascript",code:t.eventOn,language:"javascript"}]},{id:"destroy",name:"destroy()",type:"销毁实例",description:"完全销毁甘特图实例并清理所有相关资源",icon:"♻️",parameters:[],returnType:"void",cleanup:["移除所有事件监听器","清理 DOM 元素和事件绑定","释放内存中的数据引用","停止所有动画和定时器","清理渲染上下文"],notes:["调用此方法后，甘特图实例将不再可用，需要重新创建新实例。"],examples:[{framework:"javascript",code:t.destroy,language:"javascript"}]}],frameworkMethods:[{framework:"vue",code:t.vueMethods,language:"vue"},{framework:"react",code:t.reactMethods,language:"tsx"}]};export{e as m};
