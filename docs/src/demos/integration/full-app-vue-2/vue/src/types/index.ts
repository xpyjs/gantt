/**
 * 任务节点类型定义
 */
export interface TaskData {
  /** 唯一标识 */
  id: string
  /** 任务名称 */
  name: string
  /** 开始时间 */
  startTime: string
  /** 结束时间 */
  endTime: string
  /** 进度 0-100 */
  progress?: number
  /** 任务类型 - normal 是默认类型 */
  type?: 'task' | 'milestone' | 'summary' | 'normal'
  /** 子任务 */
  children?: TaskData[]
  /** 是否收起 */
  collapsed?: boolean
  /** 自定义颜色 */
  color?: string
  /** 优先级 */
  priority?: 'low' | 'medium' | 'high' | 'critical'
  /** 负责人 */
  assignee?: string
  /** 部门 */
  department?: string
  /** 状态 */
  status?: 'pending' | 'active' | 'completed' | 'blocked'
  /** 描述 */
  description?: string
}

/**
 * 链接关系类型
 */
export interface LinkData {
  /** 唯一标识 */
  id?: string
  /** 起始任务 ID */
  from: string
  /** 目标任务 ID */
  to: string
  /** 链接类型: FS=完成到开始, FF=完成到完成, SS=开始到开始, SF=开始到完成 */
  type?: 'FS' | 'FF' | 'SS' | 'SF'
  /** 链接颜色 */
  color?: string
}

/**
 * 基线数据类型
 */
export interface BaselineData {
  /** 唯一标识 */
  id: string
  /** 关联的任务 ID */
  taskId: string
  /** 计划开始时间 */
  startTime: string
  /** 计划结束时间 */
  endTime: string
  /** 基线名称 */
  name?: string
}

/**
 * 优先级选项
 */
export interface PriorityOption {
  label: string
  value: string
  color: string
}

/**
 * 状态选项
 */
export interface StatusOption {
  label: string
  value: string
  color: string
  icon?: string
  type?: 'success' | 'warning' | 'danger' | 'info' | 'primary'
}

/**
 * 团队成员
 */
export interface TeamMember {
  id: string
  name: string
  color: string
  role?: string
}

/**
 * 设置项
 */
export interface GanttSettings {
  // 显示设置
  showToday: boolean
  showWeekend: boolean
  showHoliday: boolean
  showBaseline: boolean
  showLinks: boolean
  showMilestone: boolean
  showSummary: boolean

  // 交互设置
  allowMove: boolean
  allowResize: boolean
  allowProgress: boolean
  allowLink: boolean
  allowDrag: boolean

  // 样式设置
  primaryColor: string
  rowHeight: number
  barHeight: number

  // 功能设置
  expandDefault: boolean
}

/**
 * 统计数据
 */
export interface StatsData {
  total: number
  completed: number
  inProgress: number
  pending: number
  overdue: number
  milestones: number
  overallProgress: number
}
