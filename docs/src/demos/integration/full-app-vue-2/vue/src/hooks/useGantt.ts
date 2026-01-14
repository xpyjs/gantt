/**
 * 甘特图相关 hooks
 */
import { ref, computed, type Ref } from 'vue'
import { dayjs, type XGanttUnit, XGanttInstance } from '@xpyjs/gantt-vue'
import type { TaskData, StatsData } from '../types'

/**
 * 甘特图实例 hook
 */
export function useGanttRef() {
  const ganttRef = ref<XGanttInstance>()

  const jumpTo = (date?: string) => {
    ganttRef.value?.jumpTo(date ? dayjs(date).toDate() : undefined)
  }

  const scrollTo = (id?: string, highlight?: boolean) => {
    ganttRef.value?.scrollTo(id, highlight)
  }

  const getInstance = () => {
    return ganttRef.value?.getInstance()
  }

  const getDataById = (id: string) => {
    return ganttRef.value?.getDataById(id)
  }

  const getDataSize = () => {
    return ganttRef.value?.getDataSize()
  }

  const getDataChain = (taskId: string) => {
    return ganttRef.value?.getDataChain(taskId)
  }

  const removeDataById = (id: string) => {
    return ganttRef.value?.removeDataById(id)
  }

  return {
    ganttRef,
    jumpTo,
    scrollTo,
    getInstance,
    getDataById,
    getDataSize,
    getDataChain,
    removeDataById
  }
}

/**
 * 视图单位切换 hook
 */
export function useViewUnit(initialUnit: XGanttUnit = 'day') {
  const currentUnit = ref<XGanttUnit>(initialUnit)

  const unitOptions: { label: string; value: XGanttUnit }[] = [
    { label: '时', value: 'hour' },
    { label: '日', value: 'day' },
    { label: '周', value: 'week' },
    { label: '月', value: 'month' },
    { label: '季', value: 'quarter' }
  ]

  const setUnit = (unit: XGanttUnit) => {
    currentUnit.value = unit
  }

  return {
    currentUnit,
    unitOptions,
    setUnit
  }
}

/**
 * 任务统计 hook
 */
export function useTaskStats(tasks: Ref<TaskData[]>) {
  // 扁平化所有任务
  const flatTasks = computed(() => {
    const result: TaskData[] = []
    const traverse = (items: TaskData[]) => {
      items.forEach(item => {
        result.push(item)
        if (item.children?.length) {
          traverse(item.children)
        }
      })
    }
    traverse(tasks.value)
    return result
  })

  // 非汇总任务
  const normalTasks = computed(() => {
    return flatTasks.value.filter(t => t.type !== 'summary')
  })

  // 统计数据
  const stats = computed<StatsData>(() => {
    const all = normalTasks.value
    const total = all.length
    const completed = all.filter(t => t.progress === 100 || t.status === 'completed').length
    const inProgress = all.filter(t => (t.progress ?? 0) > 0 && (t.progress ?? 0) < 100 && t.status !== 'completed').length
    const pending = all.filter(t => (t.progress ?? 0) === 0 && t.status !== 'completed').length
    const milestones = all.filter(t => t.type === 'milestone').length

    // 计算超期任务
    const now = dayjs()
    const overdue = all.filter(t => {
      if (t.progress === 100 || t.status === 'completed') return false
      return dayjs(t.endTime).isBefore(now)
    }).length

    // 计算整体进度
    const progressSum = all.filter(t => t.type !== 'milestone').reduce((sum, t) => sum + (t.progress || 0), 0)
    const taskCount = all.filter(t => t.type !== 'milestone').length
    const overallProgress = taskCount > 0 ? Math.round(progressSum / taskCount) : 0

    return {
      total,
      completed,
      inProgress,
      pending,
      overdue,
      milestones,
      overallProgress
    }
  })

  return {
    flatTasks,
    normalTasks,
    stats
  }
}

/**
 * 时间相关 hook
 */
export function useCurrentTime() {
  const currentTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
  let timer: ReturnType<typeof setInterval> | null = null

  const start = () => {
    timer = setInterval(() => {
      currentTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
    }, 1000)
  }

  const stop = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  return {
    currentTime,
    start,
    stop
  }
}
