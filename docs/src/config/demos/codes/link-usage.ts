const jsCode = `import { XGantt } from '@xpyjs/gantt-core';
import '@xpyjs/gantt-core/style.css';

const ganttContainer = document.getElementById('gantt-container');
if (!ganttContainer) {
  throw new Error('Gantt container not found');
}

let links: any[] = [];
const gantt = new XGantt(ganttContainer, {
  data: [
    {
      id: '1',
      name: '项目规划',
      startTime: '2025-01-01',
      endTime: '2025-01-15',
      progress: 80,
      children: [
        {
          id: '1-1',
          name: '需求分析',
          startTime: '2025-01-01',
          endTime: '2025-01-05',
          progress: 100,
        },
        {
          id: '1-2',
          name: '技术选型',
          startTime: '2025-01-06',
          endTime: '2025-01-15',
          progress: 90,
        },
      ],
    },
    {
      id: '2',
      name: '开发阶段',
      startTime: '2025-01-16',
      endTime: '2025-01-28',
      progress: 60,
      children: [
        {
          id: '2-1',
          name: '前端开发',
          startTime: '2025-01-16',
          endTime: '2025-01-28',
          progress: 80,
        },
        {
          id: '2-2',
          name: '后端开发',
          startTime: '2025-01-20',
          endTime: '2025-01-28',
          progress: 70,
        },
      ],
    },
    {
      id: '3',
      name: '测试阶段',
      startTime: '2025-01-28',
      endTime: '2025-02-05',
      progress: 50,
    },
  ],
  table: {
    columns: [
      { field: 'name', label: '任务名称', width: 150 },
      { field: 'startTime', label: '开始时间', width: 150 },
      { field: 'endTime', label: '结束时间', width: 150 },
    ],
  },
  selection: { enabled: true },
  bar: {
    height: '40%',
    shadowBlur: 4,
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    shadowOffsetX: 2,
    shadowOffsetY: 2,
    field: 'name',
    color: '#e5eef0',
    fontSize: 10,
    move: {
      enabled: true,
      lock: false,
      byUnit: true,
      single: { left: true, right: true },
      link: { child: 'scale', parent: 'expand' },
    },
  },
  links: {
    data: links,
    key: 'id',
    show: true,
    create: { enabled: true, mode: 'always' },
  },
});

// 需要配合事件才能创建连线
gantt.on('create:link', (link) => {
  link.id = \`link-\${links.length + 1}\`; // *必须* 新建连线需要自行添加唯一键
  link.color = 'lightblue'; //（可选项）重置连线颜色
  links.push(link);
});

// 添加一个用于删除连接线的按钮
const btnContainer = document.createElement('div');
const btn = document.createElement('button');
btn.textContent = '删除';
btn.addEventListener('click', () => {
  if (selectedLinks.length === 0) {
    console.log('没有选择');
  } else {
    // 移除选择线
    links = links.filter((l) => !selectedLinks.find((s) => s.id === l.id));
    btn.textContent = '删除';
  }
});
btnContainer.appendChild(btn);
ganttContainer.parentElement?.appendChild(btnContainer);

// 选择连线事件
let selectedLinks: any[] = [];
gantt.on('select:link', (add, cancel, all) => {
  selectedLinks = all;
  if (selectedLinks.length > 0) {
    btn.textContent = \`删除\${selectedLinks.length}条连接线\`;
  } else {
    btn.textContent = '删除';
  }
});
`;

export default {
  jsCode
};
