import { debounce, type DebouncedFunc } from "lodash-es";
import { Logger } from "../utils/logger";

/**
 * 渲染任务类型
 */
export interface RenderTask {
  type: string;
  refresh?: boolean;
  callback: (...args: any[]) => void;
  args?: any[];
  immediate?: boolean; // 是否需要立即执行
}

/**
 * 任务处理器配置
 */
export interface TaskHandler {
  callback: (...args: any[]) => void;
  immediate?: boolean; // 该类型任务是否总是立即执行
}

/**
 * 渲染调度器
 * 用于收集和调度不同类型的渲染任务，避免短时间内重复执行
 */
export class RenderScheduler {
  private taskQueue: Map<string, RenderTask> = new Map(); // 使用 Map 避免同类型重复任务
  private taskHandlers: Map<string, TaskHandler> = new Map(); // 任务类型处理器映射
  private isScheduled: boolean = false;
  private delay: number;

  // 使用 debounce 来延迟执行，避免短时间内多次触发
  private debouncedFlush: DebouncedFunc<() => void>;

  constructor(delay: number = 16) {
    this.delay = delay;

    // 使用 debounce 延迟执行渲染，默认延迟 16ms（约一帧的时间）
    this.debouncedFlush = debounce(() => {
      this.flushTaskQueue();
    }, delay);
  }

  /**
   * 注册任务处理器
   * @param taskType 任务类型
   * @param handler 处理器配置
   */
  public registerHandler(taskType: string, handler: TaskHandler): void {
    this.taskHandlers.set(taskType, handler);
    Logger.debug(`RenderScheduler: 注册任务处理器 ${taskType}`);
  }

  /**
   * 注册任务处理器（简化版本，只传回调函数）
   * @param taskType 任务类型
   * @param callback 回调函数
   * @param immediate 是否总是立即执行
   */
  public registerSimpleHandler(
    taskType: string,
    callback: (...args: any[]) => void,
    immediate: boolean = false
  ): void {
    this.registerHandler(taskType, { callback, immediate });
  }

  /**
   * 调度任务执行
   * @param taskType 任务类型
   * @param args 传递给处理器的参数
   * @param options 任务选项
   */
  public scheduleTask(
    taskType: string,
    args: any[] = [],
    options: { refresh?: boolean; immediate?: boolean } = {}
  ): void {
    const handler = this.taskHandlers.get(taskType);
    if (!handler) {
      Logger.warn(`RenderScheduler: 未找到任务类型 ${taskType} 的处理器`);
      return;
    }

    const task: RenderTask = {
      type: taskType,
      refresh: options.refresh,
      callback: handler.callback,
      args,
      immediate: options.immediate ?? handler.immediate ?? false
    };

    // 如果是立即执行的任务，直接执行
    if (task.immediate) {
      Logger.debug(`RenderScheduler: 立即执行任务 ${taskType}`);
      this.executeTask(task);
      return;
    }

    // 添加到队列中（相同类型的任务会被覆盖，保留最新的）
    this.taskQueue.set(taskType, task);
    Logger.debug(`RenderScheduler: 添加任务到队列 ${taskType}`);

    // 调度执行
    this.debouncedFlush();
  }

  /**
   * 立即执行指定类型的任务（跳过队列）
   * @param taskType 任务类型
   * @param args 传递给处理器的参数
   * @param refresh 是否强制刷新
   */
  public immediateExecuteTask(
    taskType: string,
    args: any[] = [],
    refresh: boolean = false
  ): void {
    const handler = this.taskHandlers.get(taskType);
    if (!handler) {
      Logger.warn(`RenderScheduler: 未找到任务类型 ${taskType} 的处理器`);
      return;
    }

    Logger.debug(`RenderScheduler: 立即执行任务 ${taskType}`);

    const task: RenderTask = {
      type: taskType,
      refresh,
      callback: handler.callback,
      args,
      immediate: true
    };

    this.executeTask(task);
  }

  /**
   * 立即执行所有队列中的任务
   */
  public immediateFlushAll(): void {
    Logger.debug("RenderScheduler: 立即执行所有队列任务");
    this.cancelScheduled();
    this.flushTaskQueue();
  }

  /**
   * 执行单个任务
   * @param task 任务对象
   */
  private executeTask(task: RenderTask): void {
    try {
      task.callback(...(task.args || []));
    } catch (error) {
      Logger.error(`RenderScheduler: 执行任务 ${task.type} 时出错:`, error);
    }
  }

  /**
   * 清空并执行任务队列
   */
  private flushTaskQueue(): void {
    if (this.taskQueue.size === 0) {
      return;
    }

    Logger.debug(
      `RenderScheduler: 执行任务队列，任务数量: ${this.taskQueue.size}`
    );

    // 按优先级排序任务（immediate > refresh > normal）
    const tasks = Array.from(this.taskQueue.values()).sort((a, b) => {
      if (a.immediate !== b.immediate) return a.immediate ? -1 : 1;
      if (a.refresh !== b.refresh) return a.refresh ? -1 : 1;
      return 0;
    });

    // 清空队列
    this.taskQueue.clear();
    this.isScheduled = false;

    // 执行所有任务
    for (const task of tasks) {
      this.executeTask(task);
    }
  }

  /**
   * 取消已调度的任务执行
   */
  public cancelScheduled(): void {
    this.debouncedFlush.cancel();
    this.taskQueue.clear();
    this.isScheduled = false;
  }

  /**
   * 移除指定类型的任务处理器
   * @param taskType 任务类型
   */
  public unregisterHandler(taskType: string): void {
    this.taskHandlers.delete(taskType);
    this.taskQueue.delete(taskType); // 同时清除队列中的该类型任务
    Logger.debug(`RenderScheduler: 移除任务处理器 ${taskType}`);
  }

  /**
   * 获取当前队列中的任务数量
   */
  public getQueueSize(): number {
    return this.taskQueue.size;
  }

  /**
   * 获取已注册的处理器类型列表
   */
  public getRegisteredHandlers(): string[] {
    return Array.from(this.taskHandlers.keys());
  }

  /**
   * 销毁调度器
   */
  public destroy(): void {
    this.cancelScheduled();
    this.taskHandlers.clear();
    Logger.debug("RenderScheduler: 已销毁");
  }
}
