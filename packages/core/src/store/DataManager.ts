/*
 * @Author: JeremyJone
 * @Date: 2025-04-18 10:47:28
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-08-01 17:13:33
 * @Description: 数据管理器
 */

import type { Dayjs } from "dayjs";
import { EventName, type EventBus } from "../event";
import { Task } from "../models/Task";
import type { Store } from ".";
import { Baseline } from "../models/Baseline";

export class DataManager {
  /**
   * 原始数据
   */
  private rawData: any[] = [];
  /**
   * 任务列表。树形结构
   */
  private tasks: Task[] = [];
  /**
   * 任务映射，使用ID作为键，便于快速查找
   */
  private taskMap: Map<string, Task> = new Map();
  /**
   * 缓存扁平化的可视任务列表
   * 用于提高性能，避免每次都遍历树形结构
   */
  private visibleTasksCache: Task[] = [];
  /** 标记缓存是否需要更新 */
  private isDirty: boolean = true;
  /** 缓存被折叠的任务 ID */
  private collapsedTaskIds: Set<string> = new Set();

  /** 存储当前选中的任务ID */
  private selectedTaskId: string | null = null;

  /** 选中列表 */
  private checkedList: Task[] = [];

  /** 基线数据 */
  private baselines: Baseline[] = [];
  /** 基线映射，使用ID作为键 */
  private baselineMap: Map<string, Baseline> = new Map();
  /** 任务与基线映射，使用任务ID作为键。 一个任务可以对应多条基线 */
  private baselineTaskMap: Map<string, Baseline[]> = new Map();

  /** 数据最大层级。 0 开始 */
  dataLevel: number = 0;

  constructor(private store: Store, private event: EventBus) { }

  /**
   * 设置源数据并初始化任务
   */
  setData(data: any[], init = false): void {
    this.rawData = data;
    this.initTasks(init);
    this.invalidateCache(); // 设置数据后，缓存失效
    this.event.emit(EventName.DATA_UPDATE);
  }

  /**
   * 初始化任务
   */
  private initTasks(init = false): void {
    this.dataLevel = 0;

    if (init) {
      // 如果是初始化，清空之前的任务和映射
      this.tasks = [];
      this.taskMap.clear();
      this.collapsedTaskIds.clear();

      this.rawData.forEach(data => {
        this.tasks.push(this.createTask(data));
      });
    } else {
      if (this.rawData.length > 0) {
        this.updateTask(this.rawData, this.tasks);
      } else {
        this.tasks = [];
        this.taskMap.clear();
        this.collapsedTaskIds.clear();
      }
    }
  }

  private createTask(data: any, parent?: Task): Task {
    const fields = this.store.getOptionManager().getOptions().fields;
    const task = new Task(this.store, this.event, data, parent);

    // 处理子任务
    if (Array.isArray(data[fields.children])) {
      task.children = data[fields.children].map((child: any) =>
        this.createTask(child, task)
      );
    }

    this.taskMap.set(task.id, task);
    this.dataLevel = Math.max(this.dataLevel, task.level);

    return task;
  }

  private updateTask(data: any[], tasks: Task[], parent?: Task): void {
    // 两个数组递归循环遍历。 data 为新的原始数据，tasks 为旧任务数据
    // - 以数组下标为依据：
    //   1、data 下标超过 tasks 下标，则新增任务
    //   2、tasks 下标超过 data 下标，则删除任务
    //   3、data 和 tasks 下标相同，检查：
    //     - id 相同，更新 task 数据，返回当前 task
    //     - id 不同，删除旧任务，新增新任务
    //     - 没有 id，则直接更新数据
    let i = 0;
    while (i < data.length) {
      const newData = data[i];
      const oldTask = tasks[i];

      if (newData && !oldTask) {
        // 新数据，旧任务不存在，新增任务
        const newTask = this.createTask(newData, parent);
        tasks.push(newTask);
        this.taskMap.set(newTask.id, newTask);
        this.dataLevel = Math.max(this.dataLevel, newTask.level);
      } else if (!newData && oldTask) {
        // 旧任务存在，新数据不存在，删除任务
        this.taskMap.delete(oldTask.id);
        tasks.splice(i, 1);
      } else if (newData && oldTask) {
        // 新数据和旧任务都存在，检查 ID 是否相同
        if (
          newData[this.store.getOptionManager().getOptions().fields.id] ===
          oldTask.id
        ) {
          // ID 相同，更新任务数据
          oldTask.updateData(newData);
          this.dataLevel = Math.max(this.dataLevel, oldTask.level);
        } else {
          // ID 不同，删除旧任务，新增新任务
          this.taskMap.delete(oldTask.id);
          tasks[i] = this.createTask(newData, oldTask.parent);
          this.taskMap.set(tasks[i].id, tasks[i]);
          this.dataLevel = Math.max(this.dataLevel, tasks[i].level);
        }
      }

      // 处理子任务
      if (newData[this.store.getOptionManager().getOptions().fields.children]) {
        // 如果有子任务，递归处理
        const childData =
          newData[this.store.getOptionManager().getOptions().fields.children];
        if (oldTask && oldTask.children) {
          this.updateTask(childData, oldTask.children, oldTask);
        } else {
          // 如果旧任务没有子任务，则创建新的子任务
          const newChildren = childData.map((child: any) =>
            this.createTask(child, tasks[i])
          );
          tasks[i].children = newChildren;
        }
      } else if (oldTask && oldTask.children) {
        // 如果没有子任务，但旧任务有子任务，则清空子任务
        oldTask.children = [];
      }

      i++;
    }

    // 如果 task 长度仍然存在，直接删除
    if (tasks.length >= i) {
      const delTasks = tasks.splice(i);
      delTasks.forEach(task => {
        this.taskMap.delete(task.id);
      });
    }
  }

  /**
   * 获取源数据
   */
  getData(): any[] {
    return this.rawData;
  }

  /**
   * 获取所有任务
   */
  getTasks(asTree: boolean = true): Task[] {
    if (asTree) {
      return this.tasks;
    }
    return Array.from(this.taskMap.values());
  }

  /**
   * 通过 ID 获取任务
   */
  getTaskById(id: string): Task | undefined {
    return this.taskMap.get(id);
  }

  /**
   * 移动任务位置
   */
  // moveTask(
  //   id: string,
  //   targetParentId?: string,
  //   index?: number
  // ): Task | undefined {
  //   const task = this.getTaskById(id);
  //   if (!task) {
  //     return undefined;
  //   }

  //   // 从原位置移除
  //   if (task.parent && task.parent.children) {
  //     task.parent.children = task.parent.children.filter(
  //       child => child.id !== id
  //     );
  //   } else {
  //     this.tasks = this.tasks.filter(t => t.id !== id);
  //   }

  //   // 移动到新位置
  //   let targetTasks: Task[];
  //   let targetParent: Task | undefined;

  //   if (targetParentId) {
  //     targetParent = this.getTaskById(targetParentId);
  //     if (!targetParent) {
  //       return undefined;
  //     }
  //     targetTasks = targetParent.children || [];
  //     targetParent.children = targetTasks;
  //   } else {
  //     targetTasks = this.tasks;
  //   }

  //   // 更新任务的父任务和层级
  //   task.parent = targetParent;
  //   task.level = targetParent
  //     ? targetParent.level !== undefined
  //       ? targetParent.level + 1
  //       : 0
  //     : 0;

  //   // 更新子任务的层级
  //   if (task.children && task.children.length > 0) {
  //     this.updateChildrenLevel(task);
  //   }

  //   // 插入到目标位置
  //   if (index !== undefined && index >= 0 && index <= targetTasks.length) {
  //     targetTasks.splice(index, 0, task);
  //   } else {
  //     targetTasks.push(task);
  //   }

  //   this.invalidateCache(); // 移动任务后，缓存失效
  //   this.event.emit(EventName.VIEW_UPDATE);
  //   return task;
  // }

  /**
   * 展开任务
   */
  expandTask(id: string, recursive: boolean = false): boolean {
    const task = this.getTaskById(id);
    if (!task) {
      return false;
    }

    task.expanded = !task.expanded;

    if (!task.expanded) {
      // 如果任务被折叠，记录折叠的任务ID
      this.collapsedTaskIds.add(task.id);
    } else {
      // 如果任务被展开，移除折叠的任务ID
      this.collapsedTaskIds.delete(task.id);
    }

    if (recursive && task.children && task.children.length > 0) {
      task.children.forEach(child => {
        this.expandTask(child.id, recursive);
      });
    }

    this.invalidateCache(); // 展开任务后，缓存失效
    this.event.emit(EventName.VIEW_UPDATE);
    return true;
  }

  /**
   * 按条件筛选任务
   */
  // filterTasks(criteria: (task: Task) => boolean): Task[] {
  //   return Array.from(this.taskMap.values()).filter(criteria);
  // }

  /**
   * 排序任务
   */
  // sortTasks(
  //   compareFn: (a: Task, b: Task) => number,
  //   parentId?: string
  // ): Task[] {
  //   let tasksToSort: Task[];

  //   if (parentId) {
  //     const parent = this.getTaskById(parentId);
  //     if (!parent || !parent.children) {
  //       return [];
  //     }
  //     tasksToSort = parent.children;
  //   } else {
  //     tasksToSort = this.tasks;
  //   }

  //   tasksToSort.sort(compareFn);
  //   this.invalidateCache(); // 排序后，缓存失效
  //   // this.emit("tasks:sorted", { parentId, tasks: tasksToSort });
  //   return tasksToSort;
  // }

  /**
   * 获取扁平化的任务列表，包括已展开的子任务
   * 使用缓存提高性能，只有在必要时才会重建列表
   */
  getVisibleTasks(): Task[] {
    // 如果缓存有效，直接返回
    if (!this.isDirty && this.visibleTasksCache.length > 0) {
      return this.visibleTasksCache;
    }

    // 重建扁平化任务列表
    const result: Task[] = [];
    let flatIndex = 0;

    const processTask = (task: Task, isParentExpanded: boolean) => {
      if (this.collapsedTaskIds.has(task.id)) {
        if (task.expanded) {
          // 如果任务被折叠但仍然展开，则需要更新状态
          task.expanded = false;
        }
      }

      if (isParentExpanded) {
        task.flatIndex = flatIndex++;
        result.push(task);
      }

      if (task.expanded && task.children && task.children.length > 0) {
        task.children.forEach(child => processTask(child, isParentExpanded));
      }
    };

    this.tasks.forEach(task => processTask(task, true));

    // 更新缓存
    this.visibleTasksCache = result;
    this.isDirty = false;

    return result;
  }

  /**
   * 获取可展示任务数量
   */
  getVisibleSize(): number {
    return this.getVisibleTasks().length;
  }

  /** 检查任务是否可见 */
  isTaskVisible(task: Task): boolean {
    // 如果任务在可视任务列表中，则可见
    return this.getVisibleTasks().some(t => t.id === task.id);
  }

  /**
   * 清空所有数据
   */
  clear(): void {
    this.rawData = [];
    this.tasks = [];
    this.taskMap.clear();
    this.visibleTasksCache = [];
    this.isDirty = true;
    this.collapsedTaskIds.clear();
    this.event.emit(EventName.DATA_UPDATE);
  }

  /**
   * 更新子任务的层级
   */
  // private updateChildrenLevel(task: Task): void {
  //   if (!task.children || task.children.length === 0) {
  //     return;
  //   }

  //   const parentLevel = task.level !== undefined ? task.level : 0;

  //   task.children.forEach(child => {
  //     child.level = parentLevel + 1;
  //     this.updateChildrenLevel(child);
  //   });
  // }

  /**
   * 使缓存失效，标记需要重新生成扁平化任务列表
   */
  private invalidateCache(): void {
    this.isDirty = true;
  }

  /**
   * 选择任务
   * @param taskId 任务ID
   * @returns 是否选择成功
   */
  selectTask(taskId: string): boolean {
    const task = this.getTaskById(taskId);
    if (!task) {
      return false;
    }

    // 如果已经是选中状态则不做处理
    if (this.selectedTaskId === taskId) {
      return true;
    }

    // 取消之前选中的任务
    this.unselectTask();

    // 更新选中任务ID
    this.selectedTaskId = taskId;

    // 触发选中事件
    this.event.emit(EventName.TASK_SELECTED, task);
    return true;
  }

  /**
   * 取消任务选择
   */
  unselectTask(): void {
    if (this.selectedTaskId) {
      const previousSelectedId = this.selectedTaskId;
      this.selectedTaskId = null;
      this.event.emit(EventName.TASK_UNSELECTED, previousSelectedId);
    }
  }

  /**
   * 检查任务是否被选中
   * @param taskId 任务ID
   * @returns 是否被选中
   */
  isTaskSelected(taskId: string): boolean {
    return this.selectedTaskId === taskId;
  }

  /**
   * 获取当前选中的任务
   * @returns 选中的任务，如果没有则返回undefined
   */
  getSelectedTask(): Task | undefined {
    return this.selectedTaskId
      ? this.getTaskById(this.selectedTaskId)
      : undefined;
  }

  getCheckedList(): Task[] {
    return this.checkedList;
  }

  updateCheckedList(checked: boolean, task: Task): void {
    const index = this.checkedList.findIndex(c => c.id === task.id);
    if (checked) {
      // 添加
      if (index === -1) {
        this.checkedList.push(task);
      } else {
        this.checkedList.splice(index, 1, task);
      }
    } else {
      // 移除
      if (index !== -1) {
        this.checkedList.splice(index, 1);
      }
    }
  }

  toggleAllChecked(checked: boolean): void {
    if (checked) {
      this.checkedList = this.getVisibleTasks().slice();
    } else {
      this.checkedList = [];
    }
  }

  isTaskChecked(task: Task): boolean {
    return this.checkedList.findIndex(c => c.id === task.id) !== -1;
  }

  updateTaskTime(
    task: Task,
    startTime: Dayjs,
    endTime: Dayjs,
    direction?: "left" | "right" | "both",
    oldTasks: Task[] = [] // 用于存储旧任务列表
  ): void {
    let st = startTime;
    let et = endTime;

    const child = this.store.getOptionManager().getOptions().bar.move
      .link.child;
    const parent = this.store.getOptionManager().getOptions().bar.move
      .link.parent;
    const unit = this.store.getTimeAxis().getCellUnit();

    // 父级联动
    let parentTask = task.parent;
    while (parent !== "none" && parentTask) {
      if (parent === "expand") {
        let _st = parentTask.startTime || st;
        let _et = parentTask.endTime || et;
        if (!parentTask.startTime || st.isBefore(parentTask.startTime)) {
          _st = st;
        }
        if (!parentTask.endTime || et.isAfter(parentTask.endTime)) {
          _et = et;
        }

        if (
          parentTask.startTime === undefined ||
          parentTask.endTime === undefined ||
          !_st.isSame(parentTask.startTime) ||
          !_et.isSame(parentTask.endTime)
        ) {
          if (oldTasks.findIndex(t => t.id === parentTask!.id) === -1) {
            oldTasks.push(parentTask.clone());
          }
          parentTask.updateTime(_st, _et);
        }
      } else if (parent === "strict") {
        if (parentTask.startTime && st.isBefore(parentTask.startTime)) {
          st = parentTask.startTime;
          if (et.isSameOrBefore(st)) {
            et = st.add(1, unit);
          }
        }
        if (parentTask.endTime && et.isAfter(parentTask.endTime)) {
          et = parentTask.endTime;
          if (st.isAfter(et)) {
            st = et.subtract(1, unit);
          }
        }
      }

      parentTask = parentTask.parent;
    }

    // 子级联动
    let childrenTasks = task.children || [];
    while (child !== "none" && childrenTasks.length > 0) {
      const _tasks: Task[] = [];
      childrenTasks.forEach(c => {
        let _st = c.startTime || st;
        let _et = c.endTime || et;

        let _startDiff = st.diff(task.startTime);
        let _endDiff = et.diff(task.endTime);

        if (child === "scale") {
          if (direction === "both") {
            // 移动，不存在缩放
            if (oldTasks.findIndex(t => t.id === c.id) === -1) {
              oldTasks.push(c.clone());
            }
            c.updateTime(_st.add(_startDiff), _et.add(_endDiff));
          } else if (direction === "left") {
            // 左移，右侧不动
            _st = _st.add(_startDiff);
            if (_st.isSameOrAfter(_et.subtract(1, unit))) {
              // 当处于最小值，整体保持一个单元格，并且向右移动，直到右侧固定在当前任务的结束时间
              if (_et.isBefore(task.endTime)) {
                _et = _st.add(1, unit);
              } else {
                _st = _et.subtract(1, unit);
              }

              // 子项已经移动到最小值，同时固定当前移动的任务起始时间
              if (_st.isSameOrBefore(st)) {
                st = _st;
              }
            }

            if (oldTasks.findIndex(t => t.id === c.id) === -1) {
              oldTasks.push(c.clone());
            }
            c.updateTime(_st, _et);
          } else if (direction === "right") {
            // 右移，左侧不动
            _et = _et.add(_endDiff);
            if (_et.isSameOrBefore(_st.add(1, unit))) {
              // 当处于最大值，整体保持一个单元格，并且向左移动，直到左侧固定在当前任务的起始时间
              if (_st.isAfter(task.startTime)) {
                _st = _et.subtract(1, unit);
              } else {
                _et = _st.add(1, unit);
              }
            }

            // 子项已经移动到最大值，同时固定当前移动的任务结束时间
            if (_et.isSameOrAfter(et)) {
              et = _et;
            }

            if (oldTasks.findIndex(t => t.id === c.id) === -1) {
              oldTasks.push(c.clone());
            }
            c.updateTime(_st, _et);
          }
        } else if (child === "fixed") {
          if (direction === "both") {
            // 移动，不存在缩放
            if (oldTasks.findIndex(t => t.id === c.id) === -1) {
              oldTasks.push(c.clone());
            }
            c.updateTime(_st.add(_startDiff), _et.add(_endDiff));
          } else if (direction === "left") {
            // 左移：当前任务时间触及到子项边界，子项跟随移动
            if (_st.isSameOrBefore(st)) {
              _st = st;
              if (_st.isSameOrAfter(_et.subtract(1, unit))) {
                // 当处于最小值，整体保持一个单元格，并且向右移动，直到右侧固定在当前任务的结束时间
                if (_et.isBefore(task.endTime)) {
                  _et = _st.add(1, unit);
                } else {
                  _st = _et.subtract(1, unit);
                }

                // 子项已经移动到最小值，同时固定当前移动的任务起始时间
                if (_st.isSameOrBefore(st)) {
                  st = _st;
                }
              }

              if (oldTasks.findIndex(t => t.id === c.id) === -1) {
                oldTasks.push(c.clone());
              }
              c.updateTime(_st, _et);
            }
          } else if (direction === "right") {
            // 右移：当前任务时间触及到子项边界，子项跟随移动
            if (_et.isSameOrAfter(et)) {
              _et = et;
              if (_et.isSameOrBefore(_st.add(1, unit))) {
                // 当处于最大值，整体保持一个单元格，并且向左移动，直到左侧固定在当前任务的起始时间
                if (_st.isAfter(task.startTime)) {
                  _st = _et.subtract(1, unit);
                } else {
                  _et = _st.add(1, unit);
                }
              }

              // 子项已经移动到最大值，同时固定当前移动的任务结束时间
              if (_et.isSameOrAfter(et)) {
                et = _et;
              }
              if (oldTasks.findIndex(t => t.id === c.id) === -1) {
                oldTasks.push(c.clone());
              }
              c.updateTime(_st, _et);
            }
          }
        }

        if (c.children && c.children.length > 0) {
          _tasks.push(...c.children);
        }
      });

      childrenTasks = _tasks;
    }

    if (oldTasks.findIndex(t => t.id === task.id) === -1) {
      oldTasks.push(task.clone());
    }
    task.updateTime(st, et);
  }

  //** 基线数据操作 */

  setBaselines(baselines: any[]) {
    this.baselines = [];
    this.baselineMap.clear();
    this.baselineTaskMap.clear();

    baselines.forEach(baseline => {
      const bl = new Baseline(this.store, this.event, baseline);
      this.baselines.push(bl);
      this.baselineMap.set(bl.id, bl);

      if (!this.baselineTaskMap.has(bl.taskId)) {
        this.baselineTaskMap.set(bl.taskId, []);
      }

      // 如果有设定 target，要放在前面。这样渲染时，就可以直接使用第一个来对比
      if (bl.target) {
        this.baselineTaskMap.get(bl.taskId)?.unshift(bl);
      } else {
        this.baselineTaskMap.get(bl.taskId)?.push(bl);
      }
    });
  }

  getBaselines(): Baseline[] {
    return this.baselines;
  }

  /** 根据ID获取基线 */
  getBaselineById(id: string): Baseline | undefined {
    return this.baselineMap.get(id);
  }

  /** 根据任务ID获取基线 */
  getBaselinesByTaskId(taskId: string): Baseline[] {
    return this.baselineTaskMap.get(taskId) || [];
  }
}
