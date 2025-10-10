/*
 * @Author: JeremyJone
 * @Date: 2025-04-18 10:47:28
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-10-10 17:07:14
 * @Description: 界面渲染器
 */

import { EventName } from "../event";
import { Logger } from "../utils/logger";
import { Scrollbar } from "./scrollbar";
import { generateId } from "../utils/id";
import { Table } from "./table";
import { Chart } from "./chart";
import { MiddleResizeLine } from "./other/MiddleResizeLine";
import { GuideLine } from "./other/GuideLine";
import { colorjs } from "../utils/color";
import { IContext } from "@/types/render";
import type { Task } from "@/models/Task";
import { RenderScheduler } from "./RenderScheduler";

export class Renderer {
  private scrollbar: Scrollbar;
  private rootElement: HTMLElement; // 根容器
  private tableContainer: HTMLElement; // 表格容器
  private chartContainer: HTMLDivElement; // 用于放置右侧图表内容（Konva Stage）并作为滚动内容的容器

  private table: Table;
  private chart: Chart;
  private middleLine: MiddleResizeLine;
  private renderScheduler: RenderScheduler; // 渲染调度器

  private _id = generateId();

  // 尺寸和状态
  private width: number = 0;
  private height: number = 0;

  private isInitialized: boolean = true;

  private resizeObserver?: ResizeObserver;

  public getScrollbar() {
    return this.scrollbar;
  }

  constructor(
    private context: IContext, // 渲染器上下文
    private container: HTMLElement // 甘特图根元素
  ) {
    // 创建根组件
    this.rootElement = document.createElement("div");
    this.rootElement.id = `x-gantt-${this._id}`;
    this.rootElement.className = "x-gantt";
    this.rootElement.style.overflow = "hidden";
    this.rootElement.style.display = "flex";
    this.rootElement.style.position = "relative";
    this.container.appendChild(this.rootElement);

    // 创建容器
    this.tableContainer = document.createElement("div");
    this.tableContainer.className = "x-gantt-table";
    this.rootElement.appendChild(this.tableContainer);

    // 初始化全局指示线，使用甘特图容器作为指示线容器
    new GuideLine(this.context, this.container);

    this.middleLine = new MiddleResizeLine(this.context, this.rootElement);

    this.chartContainer = document.createElement("div");
    this.chartContainer.className = "x-gantt-chart";
    this.rootElement.appendChild(this.chartContainer);

    // 实例化容器渲染器
    this.table = new Table(this.context, this.tableContainer);
    this.chart = new Chart(this.context, this.chartContainer);

    // 实例化 Scrollbar
    this.scrollbar = new Scrollbar(
      this.context,
      this.rootElement,
      this.context.store.getOptionManager().getOptions().scrollbar || {} // 传入配置项
    );

    // 初始化渲染调度器
    this.renderScheduler = new RenderScheduler(16); // 16ms 延迟，约一帧时间

    // 注册不同类型的任务处理器
    this.setupTaskHandlers();

    // 设置尺寸
    this.updateSize();

    // 监听 store 或 event 的事件，使用渲染调度器来优化渲染
    this.setupEventListeners();

    // 监听窗口大小变化
    if (this.context.store.getOptionManager().getOptions().resize?.enabled) {
      if (typeof window.ResizeObserver === "undefined") {
        Logger.warn(
          "Current environment does not support ResizeObserver, please include a polyfill to enable auto-resize feature."
        );
      } else {
        // 使用 ResizeObserver 监听容器尺寸变化
        this.resizeObserver = new ResizeObserver(() => {
          this.updateSize();
          this.renderScheduler.scheduleTask("VIEW_UPDATE", [false]);
        });
        this.resizeObserver.observe(this.container);
      }
    }
  }

  /**
   * 设置任务处理器
   */
  private setupTaskHandlers(): void {
    // 注册通用渲染任务
    this.renderScheduler.registerSimpleHandler(
      "DATA_UPDATE",
      (refresh: boolean = true) => this.performRender(refresh)
    );

    this.renderScheduler.registerSimpleHandler(
      "VIEW_UPDATE",
      (refresh: boolean = true) => this.performRender(refresh)
    );

    this.renderScheduler.registerSimpleHandler(
      "MANUAL_RENDER",
      (refresh: boolean = false) => this.performRender(refresh)
    );

    // 注册需要立即执行的任务
    this.renderScheduler.registerSimpleHandler(
      "SCROLL",
      () => this.performRender(true, true),
      true // 滚动需要立即响应
    );

    // 注册特定任务处理器
    this.renderScheduler.registerSimpleHandler("UPDATE_TASK", (task: Task) =>
      this.handleUpdateTask(task)
    );

    this.renderScheduler.registerSimpleHandler("COLUMN_WIDTH_CHANGE", () =>
      this.handleColumnWidthChange()
    );

    this.renderScheduler.registerSimpleHandler(
      "CHART_OFFSET_CHANGE",
      (refresh: boolean = false) => this.performRender(refresh)
    );
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    this.context.event.on(EventName.DATA_UPDATE, () => {
      this.renderScheduler.scheduleTask("DATA_UPDATE", [true]);
    });

    this.context.event.on(EventName.SCROLL, () => {
      // 滚动事件需要立即响应，不能延迟
      this.renderScheduler.scheduleTask("SCROLL", [true], { immediate: true });
    });

    this.context.event.on(EventName.COLUMN_WIDTH_CHANGE, () => {
      this.renderScheduler.scheduleTask("COLUMN_WIDTH_CHANGE");
    });

    this.context.event.on(EventName.VIEW_UPDATE, () => {
      this.renderScheduler.scheduleTask("VIEW_UPDATE", [true]);
    });

    this.context.event.on(EventName.UPDATE_TASK, (task: Task) => {
      this.renderScheduler.scheduleTask("UPDATE_TASK", [task], {
        immediate: true
      });
    });

    this.context.event.on(EventName.CHART_OFFSET_CHANGE, () => {
      this.renderScheduler.scheduleTask("CHART_OFFSET_CHANGE", [false]);
    });

    this.context.event.on(EventName.TOGGLE_COLLAPSE, () => {
      this.renderScheduler.scheduleTask("CHART_OFFSET_CHANGE", [false], { immediate: true });
    });
  }

  /**
   * 实际执行渲染的方法
   * @param refresh 是否强制刷新
   */
  private performRender(refresh: boolean = false, isScroll: boolean = false): void {
    this.setStyleValue();

    // 渲染逻辑，例如渲染表格、图表等到对应的容器 ...
    const { x, y } = this.scrollbar.getScrollPosition();
    const rowHeight = this.context.store.getOptionManager().getOptions().row!
      .height!;
    const headerHeight = this.context.store.getOptionManager().getOptions()
      .header!.height!;

    // 计算当前可见区域应该从第几行开始显示
    const startRow = Math.floor(y / rowHeight);

    // 计算可见区域可以显示的行数
    const visibleRows = Math.ceil((this.height - headerHeight) / rowHeight);

    // 添加上下缓冲区，确保滚动时平滑。
    const bufferRows = 2;

    // 计算需要获取的行范围
    const startIndex = Math.max(0, startRow);
    const count = visibleRows + bufferRows;

    // 获取需要显示的任务数据
    const tasks = this.context.store
      .getDataManager()
      .getVisibleTasks()
      .slice(startIndex, startIndex + count);

    this.updateSize();

    if (isScroll) {
      this.table.refresh(y, tasks);
      this.chart.refresh(x, y, tasks, true);
    } else if (refresh) {
      this.table.refresh(y, tasks);
      this.chart.refresh(x, y, tasks);
    } else {
      this.table.render(y, tasks);
      this.chart.render(x, y, tasks);
    }


    // 初始化，第一次渲染后发送一个加载完成事件
    if (this.isInitialized) {
      this.context.event.emit(EventName.LOADED);
      this.isInitialized = false;
    }

    Logger.debug("execute render");
  }

  /**
   * 公共渲染方法，向后兼容
   * @param refresh 是否强制刷新
   */
  public render(refresh: boolean = false): void {
    this.renderScheduler.scheduleTask("MANUAL_RENDER", [refresh]);
  }

  /**
   * 立即执行渲染，不经过调度器
   * @param refresh 是否强制刷新
   */
  public immediateRender(refresh: boolean = false): void {
    this.renderScheduler.immediateExecuteTask(
      "MANUAL_RENDER",
      [refresh],
      refresh
    );
  }

  // 更新尺寸
  private updateSize = () => {
    // 根据最新的数据重新计算尺寸
    this.width =
      this.context.store.getOptionManager().getOptions().width ||
      this.container.clientWidth;
    this.height =
      this.context.store.getOptionManager().getOptions().height ||
      this.container.clientHeight;

    // 设置默认宽高
    this.rootElement.style.width = this.width ? `${this.width}px` : "100%";
    this.rootElement.style.height = this.height ? `${this.height}px` : "100%";

    // 设置容器宽高
    const tableWidth = this.context.store.getColumnManager().getTotalWidth();
    this.tableContainer.style.width = `${tableWidth}px`;
    this.tableContainer.style.height = this.height
      ? `${this.height}px`
      : "100%";
    const chartWidth = this.width - tableWidth;
    this.chartContainer.style.width = `${chartWidth}px`;
    this.chartContainer.style.height = this.height
      ? `${this.height}px`
      : "100%";

    // 更新图表可视区域大小
    this.chart.resize(chartWidth, this.height);

    // 更新中线的位置
    this.middleLine.setOffset(tableWidth);

    // 获取图表的实际大小
    const chartSize = this.context.store.getTimeAxis().getTotalWidth();

    // 然后更新滚动条
    this.scrollbar.updateSize(
      chartWidth,
      this.height,
      chartSize, // 滚动区域宽度
      this.context.store.getDataManager().getVisibleSize() *
      this.context.store.getOptionManager().getOptions().row.height +
      this.context.store.getOptionManager().getOptions().header.height,
      tableWidth
    );
  };

  /**
   * 设置样式值
   */
  private setStyleValue = () => {
    const options = this.context.store.getOptionManager().getOptions();

    // 主题色
    this.rootElement.style.setProperty(
      "--x-gantt-primary-color",
      `${options.primaryColor}`
    );

    // 边框颜色
    this.rootElement.style.setProperty(
      "--x-gantt-border-color",
      `${options.border.color}`
    );

    // 悬停颜色
    this.rootElement.style.setProperty(
      "--x-gantt-row-hover-color",
      `${colorjs(options.row.hover.backgroundColor).alpha(
        options.row.hover.opacity
      )}`
    );

    // 选中颜色
    this.rootElement.style.setProperty(
      "--x-gantt-row-selected-color",
      `${colorjs(options.row.select.backgroundColor).alpha(
        options.row.select.opacity
      )}`
    );

    // 文本 font-weight
    this.rootElement.style.setProperty(
      "--x-gantt-header-font-weight",
      `${options.header.fontWeight}`
    );
  };

  private handleUpdateTask = (task: Task) => {
    this.table.updateTask(task);
    this.chart.updateTask(task);
  };

  private handleColumnWidthChange = () => {
    this.table.updateWidth();
    this.updateSize();
  };

  public destroy() {
    Logger.debug("Renderer destroy");
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
    this.renderScheduler.destroy(); // 销毁渲染调度器
    this.scrollbar.destroy(); // 销毁滚动条实例
    this.context.event.offAll();
  }
}
