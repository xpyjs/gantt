/*
 * @Author: JeremyJone
 * @Date: 2025-04-18 10:47:28
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-09-02 15:45:39
 * @Description: Facade Layer for Gantt Component
 */
import { Logger } from "./utils/logger";
import { Store } from "./store";
import { Renderer } from "./rendering/Renderer";
import { ErrorType, EventBus, EventName } from "./event";
import dayjs from "./utils/time";
import { generateId } from "./utils/id";
import { IOptionConfig, IOptions } from "./types";
import { EventMap } from "./types/event";
import type { DataChain, ILink } from "./types/link";
import { IContext } from "./types/render";
import { Task } from "./models/Task";
import { Baseline } from "./models/Baseline";

export class XGanttContext implements IContext {
  private _id = generateId();

  public store: Store;
  public event = new EventBus();
  private renderer: Renderer;

  constructor(
    private container: HTMLElement,
    private events: Map<keyof EventMap, Function[]>,
    options?: IOptions
  ) {
    this.container.innerHTML = "";

    this.store = new Store(this, options);

    // 初始化渲染器 (Renderer)
    this.renderer = new Renderer(this, this.container);

    // 初始渲染
    this.render();

    // 注册事件
    this.registerEvents();

    Logger.debug(
      "----Gantt initialized for element:",
      this._id,
      this.container
    );
  }

  public getScrollbar() {
    return this.renderer?.getScrollbar();
  }

  public getOptions() {
    return this.store.getOptionManager().getOptions();
  }

  private setOptions(options: IOptions, config: IOptionConfig) {
    this.store.setOption(options, config);
  }

  // *** Public API Methods ***/

  public render(): void {
    // 调用渲染器的 render 方法
    this.renderer.render();
  }

  public updateOptions(newOptions: IOptions, config: IOptionConfig): void {
    this.setOptions(newOptions, config);
    Logger.debug("GanttChart options updated");
    this.render(); // 重新渲染
  }

  public destroy(): void {
    Logger.debug("Gantt destroying...");
    // 清理事件监听器
    this.event.offAll();
    // 销毁渲染器
    this.renderer.destroy();
    // 清理 DOM
    this.container.innerHTML = "";
    // 移除引用
    // ...
  }

  /**
   * 跳转到指定日期。默认为今天
   *
   * @return {boolean} 是否成功跳转
   */
  public jumpTo(date?: any): boolean {
    const day = dayjs(date);

    if (!this.store.getTimeAxis().isInTimeAxis(day)) return false;

    const left = this.store.getTimeAxis().getTimeLeft(day) - 100;
    this.renderer.getScrollbar().scrollTo({ x: Math.max(left, 0) });
    return true;
  }

  /**
   * 获取指定任务的所有相关联的完整路径，包含所有连接线与任务节点
   */
  public getDataChain(id: string): DataChain {
    return this.store.getLinkManager().getDataChain(id);
  }

  // ***** 私有事件 ***** /

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 参数列表
   */
  private _emit(event: keyof EventMap, ...args: any[]): void {
    if (this.events.has(event)) {
      this.events.get(event)?.forEach(cb => cb(...args));
    }
  }

  // 注册对外事件
  private registerEvents() {
    // 抛出异常事件
    this.event.on(EventName.ERROR, (error: ErrorType, msg?: string) => {
      this._emit("error", error, msg);
    });

    this.event.on(EventName.LOADED, () => {
      this._emit("loaded");
    });

    this.event.on(EventName.TASK_DRAG_END, (task: Task, old: Task[]) => {
      this._emit(
        "move",
        old.map(item => {
          return {
            row: this.store.getDataManager().getTaskById(item.id)?.data,
            old: item.data
          };
        })
      );
    });

    this.event.on(EventName.CHECK_TASK, (tasks: Task[], checked: boolean) => {
      this._emit(
        "select",
        tasks.map(t => t.data),
        checked,
        this.store
          .getDataManager()
          .getCheckedList()
          .map(t => t.data)
      );
    });

    this.event.on(EventName.UPDATE_LINK, (link: ILink) => {
      this._emit("update:link", link);
    });

    this.event.on(EventName.CREATE_LINK, (link: ILink) => {
      this._emit("create:link", link);
    });

    this.event.on(
      EventName.SELECT_LINK,
      (add: ILink | null, cancel: ILink | null, all: ILink[]) => {
        this._emit("select:link", add, cancel, all);
      }
    );

    this.event.on(EventName.CONTEXT_LINK, (e: MouseEvent, link: ILink) => {
      this._emit("contextmenu:link", e, link);
    });

    this.event.on(EventName.ROW_CLICK, (e: MouseEvent, task: Task) => {
      this._emit("click:row", e, task.data);
    });

    this.event.on(EventName.ROW_DBL_CLICK, (e: MouseEvent, task: Task) => {
      this._emit("dblclick:row", e, task.data);
    });

    this.event.on(EventName.ROW_CONTEXTMENU, (e: MouseEvent, task: Task) => {
      this._emit("contextmenu:row", e, task.data);
    });

    this.event.on(EventName.SLIDER_CLICK, (e: MouseEvent, task: Task) => {
      this._emit("click:slider", e, task.data);
    });

    this.event.on(EventName.SLIDER_DBL_CLICK, (e: MouseEvent, task: Task) => {
      this._emit("dblclick:slider", e, task.data);
    });

    this.event.on(EventName.SLIDER_CONTEXTMENU, (e: MouseEvent, task: Task) => {
      this._emit("contextmenu:slider", e, task.data);
    });

    this.event.on(EventName.SLIDER_HOVER, (e: MouseEvent, task: Task) => {
      this._emit("hover:slider", e, task.data);
    });

    this.event.on(EventName.SLIDER_LEAVE, (e: MouseEvent, task: Task) => {
      this._emit("leave:slider", e, task.data);
    });

    this.event.on(EventName.BASELINE_CLICK, (e: MouseEvent, task: Task, baseline: Baseline) => {
      this._emit("click:baseline", e, task.data, baseline.data);
    });

    this.event.on(EventName.BASELINE_CONTEXTMENU, (e: MouseEvent, task: Task, baseline: Baseline) => {
      this._emit("contextmenu:baseline", e, task.data, baseline.data);
    });

    this.event.on(EventName.BASELINE_MOUSEOVER, (e: MouseEvent, task: Task, baseline: Baseline) => {
      this._emit("hover:baseline", e, task.data, baseline.data);
    });

    this.event.on(EventName.BASELINE_MOUSEOUT, (e: MouseEvent, task: Task, baseline: Baseline) => {
      this._emit("leave:baseline", e, task.data, baseline.data);
    });
  }
}
