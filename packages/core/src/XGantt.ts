import { XGanttContext } from "./GanttContext";
import { IOptionConfig, IOptions } from "./types";
import { EventMap } from "./types/event";
import { DataChain } from "./types/link";
import { Logger } from "./utils/logger";

/**
 * XGantt 甘特图组件的主要接口
 *
 * @description 这是 XGantt 甘特图组件的核心接口，提供了创建、配置、渲染和管理甘特图的所有功能。
 * XGantt 是一个功能强大的甘特图组件，支持任务管理、时间轴显示、关联线、进度跟踪等功能。
 *
 * @example
 * ```typescript
 * // 基本使用
 * const gantt = new XGantt('#container', {
 *   data: [
 *     {
 *       id: 1,
 *       name: '任务1',
 *       startTime: '2023-01-01',
 *       endTime: '2023-01-10',
 *       progress: 50
 *     }
 *   ]
 * });
 *
 * // 监听事件
 * gantt.on('select', (data, checked, all) => {
 *   console.log('选择了任务:', data);
 * });
 *
 * // 更新配置
 * gantt.update({
 *   unit: 'week',
 *   primaryColor: '#007acc'
 * });
 *
 * // 跳转到指定日期
 * gantt.jumpTo('2023-06-01');
 *
 * // 销毁组件
 * gantt.destroy();
 * ```
 */
export class XGantt {
  private context: XGanttContext;

  // 管理对外事件
  private events: Map<keyof EventMap, Function[]> = new Map();

  constructor(element: string | HTMLElement, options?: IOptions) {
    if (options?.logLevel) {
      Logger.setOptions({
        showTimestamp: options.logLevel === "debug",
        level:
          {
            debug: 1,
            info: 2,
            warn: 3,
            error: 4,
            none: 5
          }[options.logLevel] || 2
      });
    }

    const containerElement =
      typeof element === "string"
        ? document.querySelector<HTMLElement>(element)
        : element;

    if (!containerElement) {
      throw Logger.exception(`Container ${element} not found or invalid.`);
    }
    containerElement.innerHTML = "";

    // 给根元素添加基础样式
    containerElement.classList.add("x-gantt-container");

    this.context = new XGanttContext(containerElement, this.events, options);
  }

  // *** Public API Methods ***/

  /**
   * 更新 XGantt 的配置选项
   *
   * @param options - 新的配置选项，支持部分更新
   * @param config - 配置更新参数的方式
   *
   * @description 此方法允许在运行时动态更新甘特图的配置。
   * 只需要传入需要更改的配置项，其他配置项将保持不变。
   * 更新后会自动重新渲染相关部分以反映新的配置。
   *
   * @example
   * ```typescript
   * // 更新数据源。数据会被完全替换，除非原数据的 key 一致
   * gantt.update({
   *   data: newTaskData
   * });
   *
   * // 更新显示单位
   * gantt.update({
   *   unit: 'month'
   * });
   *
   * // 更新主题色
   * gantt.update({
   *   primaryColor: '#ff6b6b'
   * });
   *
   * // 批量更新多个配置
   * gantt.update({
   *   unit: 'week',
   *   primaryColor: '#4ecdc4',
   *   dateFormat: 'YYYY-MM-DD',
   *   row: {
   *     height: 40
   *   }
   * });
   *
   * // 完全替换配置（不合并）
   * gantt.update(newOptions, { merge: false });
   * ```
   *
   */
  public update(
    options: IOptions,
    config: IOptionConfig = { merge: true }
  ): void {
    this.context.updateOptions(options, config);
  }

  /**
   * 渲染甘特图视图
   *
   * @description 此方法通常不需要主动调用，初始化以及 `update` 中都会自动更新。 如果你需要强制刷新页面，可以在合适的时候调用此方法
   */
  public render(): void {
    this.context.render();
    Logger.info("Gantt rendered successfully.");
  }

  /**
   * 销毁甘特图实例，清理所有资源
   *
   * @description 完全销毁甘特图实例并清理所有相关资源，包括：
   * - 移除所有事件监听器
   * - 清理 DOM 元素和事件绑定
   * - 释放内存中的数据引用
   * - 停止所有动画和定时器
   * - 清理渲染上下文
   *
   * 调用此方法后，甘特图实例将不再可用，需要重新创建新实例。
   * 这对于防止内存泄漏和确保组件的正确生命周期管理非常重要。
   *
   * @example
   * ```typescript
   * const gantt = new XGantt('#container', options);
   * gantt.render();
   *
   * // 在组件卸载或页面离开时销毁
   * gantt.destroy();
   *
   * // React 组件中的使用示例
   * useEffect(() => {
   *   const gantt = new XGantt('#gantt-container', options);
   *   gantt.render();
   *
   *   return () => {
   *     gantt.destroy(); // 组件卸载时清理
   *   };
   * }, []);
   * ```
   *
   * @warning 销毁后的实例不能再次使用，调用任何方法都可能导致错误
   */
  public destroy(): void {
    Logger.info("Gantt destroying...");
    // 销毁事件管理器
    this.events.clear();
    // 销毁渲染器
    this.context.destroy();

    Logger.info("Gantt destroyed successfully.");
  }

  /**
   * 跳转到指定日期
   *
   * @param date - 要跳转到的日期，支持多种格式：
   *   - Date 对象
   *   - ISO 日期字符串 (如 '2023-06-01')
   *   - 时间戳数字
   *   - 其他可被 Date 构造函数解析的格式
   *   - 如果不传入参数或传入 undefined，则跳转到今天
   *
   * @returns 是否成功跳转到指定日期
   *   - `true`: 成功跳转，视图已更新到指定日期
   *   - `false`: 跳转失败，可能是日期无效或超出数据范围
   *
   * @description 此方法将甘特图的视图定位到指定日期，使该日期在当前视窗中可见。
   * 具体行为取决于当前的显示单位和视图范围：
   * - 如果指定日期在当前视图范围内，视图会滚动到该日期
   * - 如果指定日期超出当前数据范围，可能会扩展时间轴或返回 false
   * - 跳转会触发相应的滚动动画（如果启用）
   *
   * @example
   * ```typescript
   * // 跳转到今天（默认行为）
   * const success1 = gantt.jumpTo();
   * const success2 = gantt.jumpTo(undefined);
   *
   * // 跳转到指定日期
   * const success3 = gantt.jumpTo('2023-06-01');
   * const success4 = gantt.jumpTo(new Date('2023-06-01'));
   * const success5 = gantt.jumpTo(1685577600000); // 时间戳
   *
   * // 检查跳转结果
   * if (gantt.jumpTo('2023-12-25')) {
   *   console.log('成功跳转到圣诞节');
   * } else {
   *   console.log('跳转失败，日期可能超出范围');
   * }
   *
   * // 跳转到项目开始日期
   * const projectStartDate = data[0]?.startTime;
   * if (projectStartDate) {
   *   gantt.jumpTo(projectStartDate);
   * }
   * ```
   */
  public jumpTo(date?: any): boolean {
    return this.context.jumpTo(date);
  }

  /**
   * 获取指定任务的所有相关联的完整路径，包含所有连接线与任务节点
   */
  public getDataChain(id: string): DataChain {
    return this.context.getDataChain(id);
  }

  /**
   * 注册事件监听器
   *
   * @template K - 事件名称的类型
   * @param event - 要监听的事件名称
   * @param cb - 事件回调函数
   *
   * @description 为甘特图注册事件监听器，支持监听各种用户交互和状态变化事件。
   *
   * 支持的事件类型包括：
   * - `loaded`: 加载完成事件，组件初始化完成后触发
   * - `error`: 错误事件，当组件发生错误时触发
   * - `update:link`: 关联线更新事件
   * - `create:link`: 关联线创建事件
   * - `select:link`: 关联线选择事件
   * - `select`: 任务选择事件
   * - `click:row`: 行点击事件
   * - `dblclick:row`: 行双击事件
   * - `contextmenu:row`: 行右键菜单事件
   * - `click:slider`: 任务条点击事件
   * - `dblclick:slider`: 任务条双击事件
   * - `contextmenu:slider`: 任务条右键菜单事件
   * - `move`: 任务移动事件
   *
   * @see {@link EventMap} 查看所有可用事件及其参数类型
   *
   * @example
   * ```typescript
   * // 监听任务选择事件
   * gantt.on('select', (selectedData, isChecked, allSelectedData) => {
   *   console.log('选择状态:', isChecked);
   *   console.log('当前选择的数据:', selectedData);
   *   console.log('所有选择的数据:', allSelectedData);
   * });
   *
   * // 监听行点击事件
   * gantt.on('click:row', (event, rowData) => {
   *   console.log('点击了行:', rowData.name);
   *   console.log('鼠标事件:', event);
   * });
   *
   * // 监听任务条双击事件
   * gantt.on('dblclick:slider', (event, taskData) => {
   *   console.log('双击了任务条:', taskData.name);
   *   // 可以打开任务详情弹窗
   *   openTaskDetailModal(taskData);
   * });
   *
   * // 监听任务移动事件
   * gantt.on('move', (moveData) => {
   *   moveData.forEach(item => {
   *     console.log(`任务 ${item.row.name} 从 ${item.old.startTime} 移动到 ${item.row.startTime}`);
   *   });
   * });
   *
   * // 监听关联线创建事件
   * gantt.on('create:link', (link) => {
   *   console.log('创建了新的关联线:', link);
   *   // 可以保存到后端
   *   saveLinkToServer(link);
   * });
   *
   * // 监听错误事件
   * gantt.on('error', (error) => {
   *   console.error('甘特图发生错误:', error);
   *   // 可以上报错误或显示用户友好的错误信息
   *   showErrorNotification(error.message);
   * });
   * ```
   *
   */
  public on<K extends keyof EventMap>(event: K, cb: EventMap[K]): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)?.push(cb);
  }

  /**
   * 移除事件监听器
   *
   * @template K - 事件名称的类型
   * @param event - 要移除的事件名称
   * @param cb - 可选，指定要移除的回调函数。如果不传入，则移除所有该事件的监听器
   *
   * @description 从甘特图中移除指定的事件监听器。
   * 如果不传入回调函数，则会移除该事件的所有监听器。
   *
   * @example
   * ```typescript
   * // 移除特定的任务选择事件监听器
   * const selectHandler = (data, checked, all) => {
   *   console.log('选择了任务:', data);
   * };
   * gantt.on('select', selectHandler);
   *
   * // 当不再需要时，可以移除该监听器
   * gantt.off('select', selectHandler);
   *
   * // 移除所有任务选择事件监听器
   * gantt.off('select');
   * ```
   */
  public off<K extends keyof EventMap>(event: K, cb?: EventMap[K]): void {
    if (!this.events.has(event)) return;

    if (cb) {
      const listeners = this.events.get(event);
      if (listeners) {
        this.events.set(
          event,
          listeners.filter((listener) => listener !== cb)
        );
      }
    } else {
      this.events.delete(event);
    }
  }
}
