/*
 * @Author: JeremyJone
 * @Date: 2025-04-18 10:47:28
 * @LastEditors: JeremyJone
 * @LastEditTime: 2026-07-31 13:50:41
 * @Description: 数据管理器
 */

import dayjs, { type Dayjs } from "dayjs";
import { EventName, ErrorType, type EventBus } from "../event";
import { Task } from "../models/Task";
import type { Store } from ".";
import { Baseline } from "../models/Baseline";
import { cloneDeep, remove } from "lodash-es";
import { Logger } from "../utils/logger";

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

  /** 记录任务时间边界（最左时间和最右时间 */
  private _leftTime?: Dayjs;
  private _rightTime?: Dayjs;

  /**
   * 记录被合并移除的段 -> 合并后所在的段（id 映射）。
   * move 事件的 row 回查用：段被合并后 getTaskById 落空，
   * 通过该映射兜底指向其数据现在的归属
   */
  private mergedSegmentTargets: Map<string, string> = new Map();

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
    if (init) {
      // 如果是初始化，清空之前的任务和映射
      this.dataLevel = 0;
      this.tasks = [];
      this.taskMap.clear();
      this.collapsedTaskIds.clear();
      this.mergedSegmentTargets.clear();

      this.rawData.forEach(data => {
        this.tasks.push(this.createTask(data));
      });
    } else {
      if (this.rawData.length > 0) {
        this.dataLevel = 0;
        this.updateTask(this.rawData, this.tasks);
      } else {
        // 数据为空，彻底清空
        this.tasks = [];
        this.taskMap.clear();
        this.collapsedTaskIds.clear();
        this.dataLevel = 0;
      }
    }
  }

  private createTask(data: any, parent?: Task, isRecursive = true): Task {
    const fields = this.store.getOptionManager().getOptions().fields;
    const task = new Task(this.store, this.event, data, parent);

    // 处理子任务
    if (isRecursive && Array.isArray(data[fields.children])) {
      task.children = data[fields.children].map((child: any) =>
        this.createTask(child, task)
      );
    }

    this.taskMap.set(task.id, task);
    this.dataLevel = Math.max(this.dataLevel, task.level);

    // split 生效时，父任务时间为段的包络派生值
    task.updateEnvelope();

    return task;
  }

  private updateTask(data: any[], tasks: Task[], parent?: Task): void {
    const options = this.store.getOptionManager().getOptions();
    const idField = options.fields.id;
    const childrenField = options.fields.children;

    // 1. 建立当前层级旧任务的映射 Map<ID, Task>，这样可以通过 ID 快速找回之前的任务实例，保留状态
    const existingTasksMap = new Map<string, Task>();
    tasks.forEach(t => existingTasksMap.set(t.id, t));

    // 2. 清空现有任务列表，按照新数据的顺序重新填充。使用 length = 0 修改原数组引用，保持引用关联
    tasks.length = 0;

    // 3. 遍历新数据进行 Diff
    for (const item of data) {
      const id = item[idField];
      let task = existingTasksMap.get(id);

      if (task) {
        // 任务已存在，更新数据
        task.updateData(item);
        task.parent = parent; // 更新父节点引用（为了处理移动节点的情况）

        // 从 map 中移除，任务已被消费
        existingTasksMap.delete(id);
      } else {
        // 任务不存在，创建新任务。 isRecursive 传 false，手动处理子节点递归
        task = this.createTask(item, parent, false);
      }

      // 更新层级
      task.level = parent ? parent.level + 1 : 0;
      this.dataLevel = Math.max(this.dataLevel, task.level);

      // 递归处理子节点
      const childData = item[childrenField];
      if (Array.isArray(childData) && childData.length > 0) {
        if (!task.children) task.children = [];
        this.updateTask(childData, task.children, task);
      } else {
        // 新数据没有子任务，但旧对象可能有子任务，需要清理
        if (task.children && task.children.length > 0) {
          this.removeTasksRecursive(task.children);
          task.children = [];
        }
      }

      // split 生效时，段集合变化后重算包络
      task.updateEnvelope();

      // 将处理好的任务按新顺序加入列表
      tasks.push(task);
    }

    // 4. Map 中剩余的任务说明在新数据中已不存在，需要清理
    if (existingTasksMap.size > 0) {
      this.removeTasksRecursive(Array.from(existingTasksMap.values()));
    }
  }

  /**
   * 递归清理任务（从全局 Map、选中状态等中移除）
   * 这是一个内部辅助方法，不触发视图更新事件，仅清理数据引用
   */
  private removeTasksRecursive(tasks: Task[]) {
    tasks.forEach(task => {
      // 1. 从全局 ID 映射中移除
      this.taskMap.delete(task.id);
      this.collapsedTaskIds.delete(task.id);

      // 2. 清理选中状态
      if (this.selectedTaskId === task.id) {
        this.selectedTaskId = null;
        this.event.emit(EventName.TASK_UNSELECTED, task.id);
      }

      // 3. 清理 Check 列表
      const checkedIdx = this.checkedList.findIndex(t => t.id === task.id);
      if (checkedIdx !== -1) {
        this.checkedList.splice(checkedIdx, 1);
      }

      // 4. 递归清理子任务
      if (task.children && task.children.length > 0) {
        this.removeTasksRecursive(task.children);
      }
    });
  }

  /**
   * 获取源数据
   */
  getData(): any[] {
    return this.rawData;
  }

  /**
   * 更新时间边界
   */
  updateTimeBoundary(start: Dayjs, end: Dayjs): void {
    if (!this._leftTime) {
      this._leftTime = start;
    } else if (start.isBefore(this._leftTime)) {
      this._leftTime = start;
    }

    if (!this._rightTime) {
      this._rightTime = end;
    } else if (end.isAfter(this._rightTime)) {
      this._rightTime = end;
    }
  }

  /** 重置时间边界 */
  resetTimeBoundary(): void {
    this._leftTime = undefined;
    this._rightTime = undefined;

    this.visibleTasksCache.forEach((task) => {
      if (!this._leftTime || task.startTime?.isBefore(this._leftTime)) {
        this._leftTime = task.startTime;
      }
      if (!this._rightTime || task.endTime?.isAfter(this._rightTime)) {
        this._rightTime = task.endTime;
      }
    });
  }

  /** 获取时间边界 */
  getTimeBoundary(): [Dayjs, Dayjs] {
    return [this._leftTime || dayjs(), this._rightTime || this._leftTime || dayjs()];
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

  /** 获取数据规模 */
  getDataSize() {
    return this.taskMap.size;
  }

  /**
   * 通过 ID 获取任务
   */
  getTaskById(id: string): Task | undefined {
    return this.taskMap.get(id);
  }

  /**
   * 删除某个任务数据
   */
  deleteTaskById(id: string): boolean {
    const task = this.getTaskById(id);
    if (!task) return false;

    let res = false;

    const idProp = this.store.getOptionManager().getOptions().fields.id;
    const idx = task.parent?.children.findIndex(t => t.id === id);
    if (idx !== undefined && idx > -1 && task.parent) {
      task.parent.children.splice(idx, 1);
      // 同时更新原始数据
      const childProp = this.store.getOptionManager().getOptions().fields.children;
      const parentData = task.parent.data[childProp] || [];
      const idxInParent = parentData.findIndex((t: any) => t[idProp] === id);
      if (idxInParent !== -1) {
        parentData.splice(idxInParent, 1);
        res = true;
      }
    } else {
      const rootIdx = this.tasks.findIndex(t => t.id === id);
      if (rootIdx !== -1) {
        this.tasks.splice(rootIdx, 1);
        // 同时更新原始数据
        const rootDataIdx = this.rawData.findIndex((t: any) => t[idProp] === id);
        if (rootDataIdx !== -1) {
          this.rawData.splice(rootDataIdx, 1);
          res = true;
        }
      }
    }

    // 如果删除的任务是选中状态，取消选中
    if (this.selectedTaskId === id) {
      this.unselectTask();
    }

    if (this.checkedList.length > 0) {
      const checkedIdx = this.checkedList.findIndex(t => t.id === id);
      if (checkedIdx !== -1) {
        this.checkedList.splice(checkedIdx, 1);
      }
    }

    // 递归清理子任务及其在 taskMap 中的引用
    if (task.children && task.children.length > 0) {
      this.removeTasksRecursive(task.children);
    }

    // 从任务映射中移除当前任务
    this.taskMap.delete(id);
    this.collapsedTaskIds.delete(id);

    // 被删除的是 split 段时，父包络收缩
    if (task.parent?.isSplit()) {
      task.parent.updateEnvelope();
    }

    this.invalidateCache(); // 删除任务后，缓存失效
    this.event.emit(EventName.DATA_UPDATE);
    return res;
  }

  /**
   * 移动任务位置
   */
  moveTask(
    type: "before" | "after" | "inside",
    task: Task | undefined,
    targetIndex: number
  ): void {
    const target = this.getVisibleTasks()[targetIndex];

    if (!task || !target) {
      Logger.warn("moveTask: invalid task or target index", { taskId: task?.id, targetIndex });
      this.event.emit(EventName.ERROR, ErrorType.MOVE_INVALID_TARGET, `Invalid task or target index: ${targetIndex}`);
      return;
    }

    // 防止将任务移动到其子任务下
    if (type === 'inside' && task.isSomeoneChildren(target)) {
      Logger.warn("moveTask: cannot move task inside its own descendant", { taskId: task.id, targetId: target.id });
      this.event.emit(EventName.ERROR, ErrorType.MOVE_CIRCULAR_DEPENDENCY, `Cannot move task ${task.id} inside its own descendant ${target.id}`);
      return;
    }
    if (type !== 'inside' && task.isSomeoneChildren(target.parent)) {
      Logger.warn("moveTask: cannot move task to invalid hierarchy", { taskId: task.id, targetId: target.id });
      this.event.emit(EventName.ERROR, ErrorType.MOVE_INVALID_HIERARCHY, `Cannot move task ${task.id} to invalid hierarchy position`);
      return;
    }

    const idProp = this.store.getOptionManager().getOptions().fields.id;
    const childProp = this.store.getOptionManager().getOptions().fields.children;

    // 从原位置移除
    if (task.parent && task.parent.children) {
      remove(task.parent.children, (t: Task) => t?.id === task.id);

      const parentData = task.parent.data?.[childProp];
      remove(parentData, t => t?.[idProp] === task.id);
    } else {
      remove(this.tasks, t => t?.id === task.id);
      remove(this.rawData, t => t?.[idProp] === task.id);
    }

    // 移动到新位置
    if (type === "inside") {
      // 作为子任务
      target.children = target.children || [];
      target.children.push(task);
      task.parent = target;
      // 同时更新原始数据
      target.data[childProp] = target.data[childProp] || [];
      target.data[childProp].push(task.data);
    } else {
      // 作为同级任务
      const siblings = target.parent ? target.parent.children : this.tasks;
      const siblingTargetIndex = siblings.findIndex(t => t.id === target.id);
      // 同时更新原始数据
      const siblingsData = target.parent ? target.parent.data[childProp] || [] : this.rawData;
      const siblingTargetDataIndex = siblingsData.findIndex((t: any) => t[idProp] === target.id);
      if (type === "before") {
        siblings.splice(siblingTargetIndex, 0, task);
        siblingsData.splice(siblingTargetDataIndex, 0, task.data);
      } else if (type === "after") {
        siblings.splice(siblingTargetIndex + 1, 0, task);
        siblingsData.splice(siblingTargetDataIndex + 1, 0, task.data);
      }
      task.parent = target.parent;
    }

    // 更新任务的父任务和层级
    if (task.parent) {
      task.level = task.parent.level + 1;
    } else {
      task.level = 0;
    }

    // 更新子任务的层级
    this.updateChildrenLevel(task);

    // 重新计算最大层级
    this.recalculateDataLevel();

    this.invalidateCache(); // 移动任务后，缓存失效
    this.event.emit(EventName.VIEW_UPDATE);

    // 抛出事件
    this.event.emit(EventName.ROW_DRAG_END, target, task);
  }

  /**
   * 展开任务
   */
  expandTask(id: string, recursive: boolean = false): boolean {
    const task = this.getTaskById(id);
    if (!task) {
      return false;
    }

    // split 任务没有展开语义，子级永远内联渲染
    if (task.isSplit()) {
      Logger.warn(
        `Task [${id}] is a split task. Its children always render inline and cannot be expanded.`
      );
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

      // split 生效：子级作为段内联渲染在当前行，永不拍平为独立行。
      // 段的 flatIndex 与父保持一致（连线、基线的 Y 坐标依赖 flatIndex）
      if (task.isSplit()) {
        task.children.forEach(seg => {
          seg.flatIndex = task.flatIndex;
        });
        return;
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
   * 获取可渲染任务列表：可见行任务 + split 内联段
   *
   * @description 行渲染（图表行/表格行）使用 {@link getVisibleTasks}，
   * @description 段不占行；连线锚点与基线渲染使用本方法，段可获得与父行
   * @description 一致的定位（flatIndex 已预置）
   */
  getRenderTasks(): Task[] {
    const result: Task[] = [];
    this.getVisibleTasks().forEach(task => {
      result.push(task);
      if (task.isSplit()) {
        result.push(...task.getSegments());
      }
    });
    return result;
  }

  /**
   * 获取一个任务是否可展示
   */
  isTaskVisible(task: Task): boolean {
    // 检查任务的所有父任务是否都展开
    let current = task.parent;
    while (current) {
      if (this.collapsedTaskIds.has(current.id)) {
        return false;
      }
      current = current.parent;
    }
    return true;
  }

  /**
   * 获取可展示任务数量
   */
  getVisibleSize(): number {
    return this.getVisibleTasks().length;
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
  private updateChildrenLevel(task: Task): void {
    if (!task.children || task.children.length === 0) {
      return;
    }

    const parentLevel = task.level !== undefined ? task.level : 0;

    task.children.forEach(child => {
      child.level = parentLevel + 1;
      this.updateChildrenLevel(child);
    });
  }

  /**
   * 重新计算所有任务的最大层级
   */
  private recalculateDataLevel(): void {
    this.dataLevel = 0;
    this.taskMap.forEach(task => {
      this.dataLevel = Math.max(this.dataLevel, task.level);
    });
  }

  /**
   * 使缓存失效，标记需要重新生成扁平化任务列表
   */
  private invalidateCache(): void {
    this.isDirty = true;
  }

  /**
   * 重新应用 split 语义
   *
   * @description `split.enabled` 运行时切换后调用：重算所有任务的包络
   * @description 并使可见列表缓存失效
   */
  refreshSplitState(): void {
    this.getTasks(false).forEach(task => {
      task.updateEnvelope();
    });
    this.invalidateCache();
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
      // split 父的起止时间是段的包络派生值，不走 expand/strict 联动，
      // 由方法末尾的 updateEnvelope 统一精确跟随（可扩可缩）
      if (parentTask.isSplit()) {
        parentTask = parentTask.parent;
        continue;
      }

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
          parentTask.updateTime(_st, _et, true);
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
    // split 父的子级是段：父时间是段的包络派生值，直接写入父时间会被
    // 包络覆盖，段不随父时间缩放/夹取
    let childrenTasks = task.isSplit() ? [] : task.children || [];
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
            c.updateTime(_st, _et, true);
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
            c.updateTime(_st, _et, true);
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
              c.updateTime(_st, _et, true);
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
              c.updateTime(_st, _et, true);
            }
          }
        }

        if (c.children && c.children.length > 0) {
          _tasks.push(...c.children);
        }
      });

      childrenTasks = _tasks;
    }

    // forbid 策略：段的新时间被相邻段边界夹取后再写入
    [st, et] = this.clampSegmentByOverlap(task, st, et, direction);

    // 夹取后与当前时间一致：段被相邻段挡住，本次不产生任何变化。
    // 跳过写入与事件（不触发重渲染），避免拖拽中「鼠标位置」与
    // 「数据位置」交替渲染造成的闪烁，视图保持静止，直到产生新的
    // 有效位置
    if (task.startTime?.isSame(st) && task.endTime?.isSame(et)) {
      return;
    }

    if (oldTasks.findIndex(t => t.id === task.id) === -1) {
      oldTasks.push(task.clone());
    }

    task.updateTime(st, et, direction === 'left' || direction === 'right');

    // 时间更新后重算 split 包络：父任务是段的派生值，直接写入的时间
    // 会被包络覆盖，保证「数据 = 视图」的一致性。
    // isSplit 保证段无子级，因此 split 祖先至多一层（task 或其直接父）
    if (task.isSplit()) {
      task.updateEnvelope();
    }
    let splitParent = task.parent;
    while (splitParent) {
      if (splitParent.isSplit()) {
        // merge 策略在拖拽结束（fitTaskTime）时统一执行，拖拽过程中
        // 段保持分离、可自由移动；这里只跟随重算包络
        splitParent.updateEnvelope();
        break;
      }
      splitParent = splitParent.parent;
    }
  }

  /**
   * forbid 策略：段的新时间被相邻段的边界夹取
   *
   * @description 仅当 `split.overlap` 为 `forbid` 且 task 是段时生效。
   * @description 相邻段的左右判定以拖拽前的位置为基准（段不会相互穿越）：
   * @description 结束不晚于段原起始的是左段，开始不早于段原结束的是右段；
   * @description 初始数据就交叠的段不参与夹取，避免在无解的交叠中死锁。
   * @description 夹取允许贴边（共享边界时刻），夹取后若跨度塌缩为非正
   * @description（间隙容不下该段），保持原时间不动。
   */
  private clampSegmentByOverlap(
    task: Task,
    st: Dayjs,
    et: Dayjs,
    direction?: "left" | "right" | "both",
    basis?: { start?: Dayjs; end?: Dayjs }
  ): [Dayjs, Dayjs] {
    const options = this.store.getOptionManager().getOptions();
    if (options.split?.overlap !== "forbid") return [st, et];

    const splitParent = task.parent;
    if (!splitParent?.isSplit()) return [st, et];

    // 左右段判定基准：拖拽场景是 task 当前时间（尚未写入新值）；
    // 工作日适配场景 task 时间已被 fitWork 改写，需显式传入适配前位置
    const oldSt = basis?.start || task.startTime;
    const oldEt = basis?.end || task.endTime;
    if (!oldSt || !oldEt) return [st, et];

    let leftBound: Dayjs | null = null;
    let rightBound: Dayjs | null = null;
    splitParent.getSegments().forEach(seg => {
      if (seg.id === task.id || !seg.startTime || !seg.endTime) return;

      if (seg.endTime.isSameOrBefore(oldSt)) {
        if (!leftBound || seg.endTime.isAfter(leftBound)) {
          leftBound = seg.endTime;
        }
      } else if (seg.startTime.isSameOrAfter(oldEt)) {
        if (!rightBound || seg.startTime.isBefore(rightBound)) {
          rightBound = seg.startTime;
        }
      }
    });

    if (direction === "left") {
      if (leftBound && st.isBefore(leftBound)) st = leftBound;
    } else if (direction === "right") {
      if (rightBound && et.isAfter(rightBound)) et = rightBound;
    } else {
      // 整体移动：保持时长平移，优先满足左边界，再回退右边界
      const duration = et.diff(st);
      if (leftBound && st.isBefore(leftBound)) {
        st = leftBound;
        et = st.add(duration);
      }
      if (rightBound && et.isAfter(rightBound)) {
        et = rightBound;
        st = et.subtract(duration);
      }
      // 右边界回退可能重新压过左边界（间隙小于段时长），
      // 此时该段放不进间隙，保持当前时间不动
      if (leftBound && st.isBefore(leftBound)) {
        return [task.startTime!, task.endTime!];
      }
    }

    if (st.isSameOrAfter(et)) {
      // 间隙容不下该段，保持 task 当前时间（拖拽前 / 适配后）不动
      return [task.startTime!, task.endTime!];
    }

    return [st, et];
  }

  /**
   * merge 策略：段接触或交叠时自动合并为一个段
   *
   * @description 仅当 `split.overlap` 为 `merge` 时生效。按开始时间排序
   * @description 依次检查相邻段对，接触（共享边界时刻）或交叠即合并：
   * @description 保留前段位置，取两段的更宽范围，被合并的段从父级与
   * @description 原始数据中移除；链式交叠会迭代合并至稳定。
   * @description 合并在拖拽结束（fitTaskTime）时统一执行，鼠标未松开前
   * @description 段保持分离状态。
   */
  private mergeSegmentOverlaps(
    splitParent: Task,
    oldTasks: Task[]
  ): boolean {
    const options = this.store.getOptionManager().getOptions();
    if (options.split?.overlap !== "merge") return false;
    if (!splitParent.isSplit()) return false;

    let mergedAny = false;
    let merged = true;
    while (merged) {
      merged = false;
      const segments = splitParent.getSegments();
      for (let i = 1; i < segments.length; i++) {
        const prev = segments[i - 1];
        const cur = segments[i];
        if (!prev.startTime || !prev.endTime || !cur.startTime || !cur.endTime) {
          continue;
        }

        if (cur.startTime.isSameOrBefore(prev.endTime)) {
          const newEnd = prev.endTime.isAfter(cur.endTime)
            ? prev.endTime
            : cur.endTime;

          if (oldTasks.findIndex(t => t.id === prev.id) === -1) {
            oldTasks.push(prev.clone());
          }
          if (oldTasks.findIndex(t => t.id === cur.id) === -1) {
            oldTasks.push(cur.clone());
          }

          prev.updateTime(prev.startTime, newEnd, true);
          this.mergedSegmentTargets.set(cur.id, prev.id);

          // 连线重定向：被合并段的连线转移到保留段，避免死引用。
          // 重定向就是普通的连线变更，逐条以 update/delete 事件即时
          // 抛出（携带变更前旧数据快照）：updated 走 UPDATE_LINK，
          // 自连/重复/成环被移除的走 DELETE_LINK；没有连线受影响时
          // 不抛任何事件。链式合并中同一连线可能先后经历多次变更，
          // 每次事件均为当时的真实状态，撤销时逆序应用各事件的旧
          // 数据即可完整还原
          const redirect = this.store
            .getLinkManager()
            .redirectTaskLinks(cur.id, prev.id);
          for (const removedLink of redirect.removed) {
            this.event.emit(EventName.DELETE_LINK, cloneDeep(removedLink));
          }
          for (const { link, old } of redirect.updated) {
            this.event.emit(
              EventName.UPDATE_LINK,
              cloneDeep(link),
              cloneDeep(old)
            );
          }

          this.removeSegment(splitParent, cur);
          mergedAny = true;
          merged = true;
          break; // 段集合已变化，重新排序检查
        }
      }
    }

    // 合并改变了段集合（有段被移除），需要一次行级刷新让视图同步：
    // 上面 prev 的 UPDATE_TASK 触发段同步时被合并的段还在数据中，
    // 其滑块不会被销毁；包络不变（如合并中间段）时 updateEnvelope
    // 也不抛事件，视图会停留在旧状态直到下次全量刷新
    if (mergedAny) {
      this.event.emit(EventName.UPDATE_TASK, splitParent);
    }

    return mergedAny;
  }

  /**
   * 查询段被合并进了哪个任务
   *
   * @description move 事件（撤销数据契约）的 row 回查兜底：段被 merge
   * @description 移除后 getTaskById 落空，通过该映射指向其数据现在的
   * @description 归属段。未被合并移除的段返回 undefined
   */
  getMergedSegmentTarget(id: string): Task | undefined {
    const targetId = this.mergedSegmentTargets.get(id);
    if (!targetId) return undefined;
    return this.taskMap.get(targetId);
  }

  /**
   * 从 split 父级移除一个段（merge 合并的内部操作）
   *
   * @description 同步清理 Task 树、原始数据与任务映射；
   * @description 渲染刷新由合并段的 updateTime 事件链自动触发
   * @description （ChartRow 的段同步会移除该段的滑块）
   */
  private removeSegment(splitParent: Task, segment: Task): void {
    const fields = this.store.getOptionManager().getOptions().fields;

    const idx = splitParent.children.findIndex(s => s.id === segment.id);
    if (idx > -1) {
      splitParent.children.splice(idx, 1);
    }

    const parentData = splitParent.data[fields.children];
    if (Array.isArray(parentData)) {
      const di = parentData.findIndex(
        (t: any) => t[fields.id] === segment.id
      );
      if (di > -1) {
        parentData.splice(di, 1);
      }
    }

    this.taskMap.delete(segment.id);
    this.collapsedTaskIds.delete(segment.id);
    this.invalidateCache();
  }

  /**
   * 基于某个任务进行时间适配的调整，并联动其子任务
   */
  fitTaskTime(
    task: Task,
    direction: "left" | "right" | "both",
    oldTasks: Task[] = [] // 用于存储旧任务列表
  ) {
    if (!task.startTime) return;

    // forbid 夹取的左右段判定以适配前的位置为基准
    const preFitSt = task.startTime;
    const preFitEt = task.endTime;

    // 按照适配更新当前任务值
    task.fitWork(direction);

    const child = this.store.getOptionManager().getOptions().bar.move
      .link.child;
    const parent = this.store.getOptionManager().getOptions().bar.move
      .link.parent;

    // 记录子项的两侧极值
    let leftTime = task.startTime;
    let rightTime = task.endTime!;

    /**********************/
    /***** 适配子级联动 *****/
    /**********************/
    let childrenTasks = task.children || [];
    while (child !== "none" && childrenTasks.length > 0) {
      const _tasks: Task[] = [];
      childrenTasks.forEach(c => {
        if (!c.startTime || !c.endTime) return;

        c.fitWork(direction);
        if (c.startTime.isBefore(leftTime)) {
          c.fitWork('right', { start: leftTime });
        } else if (c.endTime.isAfter(rightTime)) {
          c.fitWork('left', { end: rightTime });
        }

        leftTime = c.startTime.isBefore(leftTime) ? c.startTime : leftTime;
        rightTime = c.endTime.isAfter(rightTime) ? c.endTime : rightTime;

        if (c.children && c.children.length > 0) {
          _tasks.push(...c.children);
        }

        // 子项不需要添加到 oldTasks，如果子项会移动，那么一定在 slider 中已经添加过？
      });

      childrenTasks = _tasks;
    }

    /**********************/
    /***** 适配父级联动 *****/
    /**********************/
    let parentTask = task.parent;
    while (parent === "expand" && parentTask) {
      // 查找父级下所有子项（当前任务平级任务）的两侧极值
      const siblings = parentTask.children;
      if (siblings && siblings.length > 1) {
        siblings.forEach(s => {
          if (s.id === task.id) return;
          if (!s.startTime || !s.endTime) return;

          leftTime = s.startTime.isBefore(leftTime) ? s.startTime : leftTime;
          rightTime = s.endTime.isAfter(rightTime) ? s.endTime : rightTime;
        });
      }

      if (!leftTime.isSame(parentTask.startTime) || !rightTime.isSame(parentTask.endTime)) {
        parentTask.updateTime(leftTime, rightTime, true);

        if (oldTasks.findIndex(t => t.id === parentTask!.id) === -1) {
          oldTasks.push(parentTask.clone());
        }
      }

      parentTask = parentTask.parent;
    }

    // 更新时间边界
    this.updateTimeBoundary(leftTime, rightTime);

    // 工作日适配后重算 split 包络（task 自身或祖先为 split 父时）
    if (task.isSplit()) {
      task.updateEnvelope();
    }
    let splitParent = task.parent;
    while (splitParent) {
      if (splitParent.isSplit()) {
        // forbid 策略：工作日适配可能把段推入相邻段，夹取回边界
        if (task.startTime && task.endTime) {
          const [st, et] = this.clampSegmentByOverlap(
            task,
            task.startTime,
            task.endTime,
            "both",
            { start: preFitSt, end: preFitEt }
          );
          if (!st.isSame(task.startTime) || !et.isSame(task.endTime)) {
            task.updateTime(st, et);
          }
        }
        // merge 策略：拖拽结束（鼠标松开）时统一合并。
        // 拖拽过程中段保持分离、可自由穿越；此处处理松开前形成的
        // 接触/交叠，以及工作日适配造成的接触/交叠
        this.mergeSegmentOverlaps(splitParent, oldTasks);
        splitParent.updateEnvelope();
        break;
      }
      splitParent = splitParent.parent;
    }
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
