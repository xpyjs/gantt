/**
 * XGantt Pro Demo 示例数据
 * 模拟一个真实的软件开发项目
 */
import { dayjs } from '@xpyjs/gantt-vue'
import type { TaskData, LinkData, BaselineData, PriorityOption, StatusOption, TeamMember } from './types'

const now = dayjs()
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

/**
 * 优先级选项
 */
export const priorityOptions: PriorityOption[] = [
  { label: '低', value: 'low', color: '#52c41a' },
  { label: '中', value: 'medium', color: '#1890ff' },
  { label: '高', value: 'high', color: '#faad14' },
  { label: '紧急', value: 'critical', color: '#ff4d4f' }
]

/**
 * 状态选项
 */
export const statusOptions: StatusOption[] = [
  { label: '待开始', value: 'pending', color: '#d9d9d9', icon: '⏳', type: 'info' },
  { label: '进行中', value: 'active', color: '#409eff', icon: '🔄', type: 'primary' },
  { label: '已完成', value: 'completed', color: '#52c41a', icon: '✅', type: 'success' },
  { label: '已阻塞', value: 'blocked', color: '#ff4d4f', icon: '🚫', type: 'danger' }
]

/**
 * 团队成员
 */
export const teamMembers: TeamMember[] = [
  { id: '1', name: '张伟', color: '#b382e7', role: '技术负责人' },
  { id: '2', name: '李娜', color: '#409eff', role: '产品经理' },
  { id: '3', name: '王芳', color: '#67c23a', role: '前端开发' },
  { id: '4', name: '刘洋', color: '#e6a23c', role: 'UI设计师' },
  { id: '5', name: '陈静', color: '#f56c6c', role: 'UI设计师' },
  { id: '6', name: '赵强', color: '#909399', role: '后端开发' },
  { id: '7', name: '孙磊', color: '#b382e7', role: '前端开发' },
  { id: '8', name: '周鹏', color: '#409eff', role: '测试工程师' },
  { id: '9', name: '吴敏', color: '#67c23a', role: '测试工程师' },
  { id: '10', name: '郑刚', color: '#e6a23c', role: '运维工程师' },
  { id: '11', name: '马超', color: '#f56c6c', role: '项目经理' }
]

/**
 * 假期数据
 */
export const holidays = [
  now.add(7, 'day').format('YYYY-MM-DD'),
  now.add(14, 'day').format('YYYY-MM-DD'),
  now.add(21, 'day').format('YYYY-MM-DD')
]

/**
 * 项目任务数据
 */
export const projectData: TaskData[] = [
  {
    id: 'phase-1',
    name: '📋 需求分析阶段',
    startTime: now.subtract(20, 'day').format(DATE_FORMAT),
    endTime: now.subtract(12, 'day').format(DATE_FORMAT),
    type: 'summary',
    progress: 100,
    department: '产品部',
    status: 'completed',
    children: [
      {
        id: 'task-1-1',
        name: '市场调研与竞品分析',
        startTime: now.subtract(20, 'day').format(DATE_FORMAT),
        endTime: now.subtract(17, 'day').format(DATE_FORMAT),
        progress: 100,
        assignee: '张伟',
        priority: 'high',
        status: 'completed'
      },
      {
        id: 'task-1-2',
        name: '用户需求收集',
        startTime: now.subtract(17, 'day').format(DATE_FORMAT),
        endTime: now.subtract(15, 'day').format(DATE_FORMAT),
        progress: 100,
        assignee: '李娜',
        priority: 'high',
        status: 'completed'
      },
      {
        id: 'task-1-3',
        name: '需求文档编写',
        startTime: now.subtract(15, 'day').format(DATE_FORMAT),
        endTime: now.subtract(13, 'day').format(DATE_FORMAT),
        progress: 100,
        assignee: '王芳',
        priority: 'medium',
        status: 'completed'
      },
      {
        id: 'milestone-1',
        name: '✅ 需求评审通过',
        startTime: now.subtract(12, 'day').format(DATE_FORMAT),
        endTime: now.subtract(12, 'day').format(DATE_FORMAT),
        type: 'milestone',
        progress: 100,
        status: 'completed'
      }
    ]
  },
  {
    id: 'phase-2',
    name: '🎨 UI/UX 设计阶段',
    startTime: now.subtract(12, 'day').format(DATE_FORMAT),
    endTime: now.subtract(5, 'day').format(DATE_FORMAT),
    type: 'summary',
    progress: 100,
    department: '设计部',
    status: 'completed',
    children: [
      {
        id: 'task-2-1',
        name: '交互原型设计',
        startTime: now.subtract(12, 'day').format(DATE_FORMAT),
        endTime: now.subtract(9, 'day').format(DATE_FORMAT),
        progress: 100,
        assignee: '刘洋',
        priority: 'high',
        status: 'completed'
      },
      {
        id: 'task-2-2',
        name: 'UI 视觉设计',
        startTime: now.subtract(9, 'day').format(DATE_FORMAT),
        endTime: now.subtract(6, 'day').format(DATE_FORMAT),
        progress: 100,
        assignee: '陈静',
        priority: 'high',
        status: 'completed',
        color: '#b382e7'
      },
      {
        id: 'task-2-3',
        name: '设计规范制定',
        startTime: now.subtract(7, 'day').format(DATE_FORMAT),
        endTime: now.subtract(5, 'day').format(DATE_FORMAT),
        progress: 100,
        assignee: '陈静',
        priority: 'medium',
        status: 'completed'
      },
      {
        id: 'milestone-2',
        name: '✅ 设计评审通过',
        startTime: now.subtract(5, 'day').format(DATE_FORMAT),
        endTime: now.subtract(5, 'day').format(DATE_FORMAT),
        type: 'milestone',
        progress: 100,
        status: 'completed'
      }
    ]
  },
  {
    id: 'phase-3',
    name: '💻 开发阶段',
    startTime: now.subtract(5, 'day').format(DATE_FORMAT),
    endTime: now.add(15, 'day').format(DATE_FORMAT),
    type: 'summary',
    progress: 45,
    department: '开发部',
    status: 'active',
    children: [
      {
        id: 'task-3-1',
        name: '核心架构搭建',
        startTime: now.subtract(5, 'day').format(DATE_FORMAT),
        endTime: now.subtract(2, 'day').format(DATE_FORMAT),
        progress: 100,
        assignee: '赵强',
        priority: 'critical',
        status: 'completed',
        color: '#52c41a'
      },
      {
        id: 'task-3-2',
        name: '甘特图核心组件开发',
        startTime: now.subtract(2, 'day').format(DATE_FORMAT),
        endTime: now.add(5, 'day').format(DATE_FORMAT),
        progress: 65,
        assignee: '赵强',
        priority: 'critical',
        status: 'active',
        color: '#b382e7'
      },
      {
        id: 'task-3-3',
        name: '表格组件开发',
        startTime: now.add(1, 'day').format(DATE_FORMAT),
        endTime: now.add(8, 'day').format(DATE_FORMAT),
        progress: 30,
        assignee: '孙磊',
        priority: 'high',
        status: 'active'
      },
      {
        id: 'task-3-4',
        name: '时间轴组件开发',
        startTime: now.add(3, 'day').format(DATE_FORMAT),
        endTime: now.add(10, 'day').format(DATE_FORMAT),
        progress: 0,
        assignee: '周鹏',
        priority: 'high',
        status: 'pending'
      },
      {
        id: 'task-3-5',
        name: '交互功能实现',
        startTime: now.add(8, 'day').format(DATE_FORMAT),
        endTime: now.add(13, 'day').format(DATE_FORMAT),
        progress: 0,
        assignee: '赵强',
        priority: 'high',
        status: 'pending'
      },
      {
        id: 'milestone-3',
        name: '🎯 核心功能完成',
        startTime: now.add(15, 'day').format(DATE_FORMAT),
        endTime: now.add(15, 'day').format(DATE_FORMAT),
        type: 'milestone',
        progress: 0,
        status: 'pending'
      }
    ]
  },
  {
    id: 'phase-4',
    name: '🧪 测试阶段',
    startTime: now.add(15, 'day').format(DATE_FORMAT),
    endTime: now.add(25, 'day').format(DATE_FORMAT),
    type: 'summary',
    progress: 0,
    department: '测试部',
    status: 'pending',
    children: [
      {
        id: 'task-4-1',
        name: '单元测试编写',
        startTime: now.add(15, 'day').format(DATE_FORMAT),
        endTime: now.add(18, 'day').format(DATE_FORMAT),
        progress: 0,
        assignee: '吴敏',
        priority: 'high',
        status: 'pending'
      },
      {
        id: 'task-4-2',
        name: '集成测试',
        startTime: now.add(18, 'day').format(DATE_FORMAT),
        endTime: now.add(21, 'day').format(DATE_FORMAT),
        progress: 0,
        assignee: '吴敏',
        priority: 'high',
        status: 'pending'
      },
      {
        id: 'task-4-3',
        name: '性能测试',
        startTime: now.add(20, 'day').format(DATE_FORMAT),
        endTime: now.add(23, 'day').format(DATE_FORMAT),
        progress: 0,
        assignee: '郑刚',
        priority: 'medium',
        status: 'pending'
      },
      {
        id: 'task-4-4',
        name: 'Bug 修复与优化',
        startTime: now.add(21, 'day').format(DATE_FORMAT),
        endTime: now.add(25, 'day').format(DATE_FORMAT),
        progress: 0,
        assignee: '赵强',
        priority: 'high',
        status: 'pending'
      }
    ]
  },
  {
    id: 'phase-5',
    name: '🚀 部署上线',
    startTime: now.add(25, 'day').format(DATE_FORMAT),
    endTime: now.add(30, 'day').format(DATE_FORMAT),
    type: 'summary',
    progress: 0,
    department: '运维部',
    status: 'pending',
    children: [
      {
        id: 'task-5-1',
        name: '文档编写',
        startTime: now.add(25, 'day').format(DATE_FORMAT),
        endTime: now.add(27, 'day').format(DATE_FORMAT),
        progress: 0,
        assignee: '王芳',
        priority: 'medium',
        status: 'pending'
      },
      {
        id: 'task-5-2',
        name: '部署配置',
        startTime: now.add(27, 'day').format(DATE_FORMAT),
        endTime: now.add(28, 'day').format(DATE_FORMAT),
        progress: 0,
        assignee: '马超',
        priority: 'high',
        status: 'pending'
      },
      {
        id: 'task-5-3',
        name: '上线发布',
        startTime: now.add(28, 'day').format(DATE_FORMAT),
        endTime: now.add(29, 'day').format(DATE_FORMAT),
        progress: 0,
        assignee: '马超',
        priority: 'critical',
        status: 'pending'
      },
      {
        id: 'milestone-5',
        name: '🎉 项目上线',
        startTime: now.add(30, 'day').format(DATE_FORMAT),
        endTime: now.add(30, 'day').format(DATE_FORMAT),
        type: 'milestone',
        progress: 0,
        status: 'pending',
        color: '#faad14'
      }
    ]
  }
]

/**
 * 链接关系数据
 */
export const projectLinks: LinkData[] = [
  { id: 'link-1', from: 'task-1-1', to: 'task-1-2' },
  { id: 'link-2', from: 'task-1-2', to: 'task-1-3' },
  { id: 'link-3', from: 'task-1-3', to: 'milestone-1' },
  { id: 'link-4', from: 'milestone-1', to: 'task-2-1' },
  { id: 'link-5', from: 'task-2-1', to: 'task-2-2' },
  { id: 'link-6', from: 'task-2-2', to: 'task-2-3' },
  { id: 'link-7', from: 'task-2-3', to: 'milestone-2' },
  { id: 'link-8', from: 'milestone-2', to: 'task-3-1' },
  { id: 'link-9', from: 'task-3-1', to: 'task-3-2' },
  { id: 'link-10', from: 'task-3-2', to: 'task-3-3' },
  { id: 'link-11', from: 'task-3-3', to: 'task-3-4' },
  { id: 'link-12', from: 'task-3-4', to: 'task-3-5' },
  { id: 'link-13', from: 'task-3-5', to: 'milestone-3' },
  { id: 'link-14', from: 'milestone-3', to: 'task-4-1' },
  { id: 'link-15', from: 'task-4-1', to: 'task-4-2' },
  { id: 'link-16', from: 'task-4-2', to: 'task-4-3' },
  { id: 'link-17', from: 'task-4-3', to: 'task-4-4' },
  { id: 'link-18', from: 'task-4-4', to: 'task-5-1' },
  { id: 'link-19', from: 'task-5-1', to: 'task-5-2' },
  { id: 'link-20', from: 'task-5-2', to: 'task-5-3' },
  { id: 'link-21', from: 'task-5-3', to: 'milestone-5' }
]

/**
 * 基线数据（计划时间）
 */
export const projectBaselines: BaselineData[] = [
  {
    id: 'baseline-1',
    taskId: 'task-3-2',
    startTime: now.subtract(3, 'day').format(DATE_FORMAT),
    endTime: now.add(3, 'day').format(DATE_FORMAT),
    name: '原计划'
  },
  {
    id: 'baseline-2',
    taskId: 'task-3-3',
    startTime: now.format(DATE_FORMAT),
    endTime: now.add(6, 'day').format(DATE_FORMAT),
    name: '原计划'
  },
  {
    id: 'baseline-3',
    taskId: 'task-3-4',
    startTime: now.add(2, 'day').format(DATE_FORMAT),
    endTime: now.add(8, 'day').format(DATE_FORMAT),
    name: '原计划'
  }
]

/**
 * 默认设置
 */
export const defaultSettings = {
  showToday: true,
  showWeekend: true,
  showHoliday: true,
  showBaseline: true,
  showLinks: true,
  showMilestone: true,
  showSummary: true,
  allowMove: true,
  allowResize: true,
  allowProgress: true,
  allowLink: true,
  allowDrag: false,
  primaryColor: '#b382e7',
  rowHeight: 36,
  barHeight: 22,
  expandDefault: true
}

// 导出类型
export type { TaskData, LinkData, BaselineData }
