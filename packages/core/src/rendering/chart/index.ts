/*
 * @Author: JeremyJone
 * @Date: 2025-04-18 11:00:12
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-07-30 18:13:35
 * @Description: 图表渲染管理器
 */
import Konva from "konva";
import { HeaderLayer } from "./ChartHeader";
import { GridGroup } from "./ChartGrid";
import { BodyGroup } from "./ChartBody";
import { WeekendGroup } from "./ChartWeekend";
import { ChartToday } from "./ChartToday";
import { HolidayGroup } from "./ChartHoliday";
import { LinkGroup } from "./ChartLink";
import { ChartBaseline } from "./ChartBaseline";
import { IContext } from "@/types/render";
import type { Task } from "@/models/Task";

export class Chart {
  // Konva 元素
  private stage: Konva.Stage;
  private headerLayer: HeaderLayer;
  private bodyGroup: BodyGroup;
  private gridGroup: GridGroup;
  private weekendGroup: WeekendGroup;
  private holidayGroup: HolidayGroup;
  private todayLayer: ChartToday;
  private linkGroup: LinkGroup;
  private baselineGroup: ChartBaseline;

  private bgLayer: Konva.Layer;
  private bodyLayer: Konva.Layer;

  private width: number = 0;
  private height: number = 0;

  constructor(private context: IContext, private container: HTMLDivElement) {
    // 创建 Konva 对象
    this.stage = new Konva.Stage({
      container: this.container,
      width: this.container.clientWidth,
      height: this.container.clientHeight
    });

    // 创建各个图层
    this.bgLayer = new Konva.Layer();
    this.weekendGroup = new WeekendGroup(this.context, this.bgLayer);
    this.holidayGroup = new HolidayGroup(this.context, this.bgLayer);
    this.gridGroup = new GridGroup(this.context, this.bgLayer);
    this.stage.add(this.bgLayer);

    this.headerLayer = new HeaderLayer(this.context, this.stage);
    this.todayLayer = new ChartToday(
      this.context,
      this.bgLayer,
      this.headerLayer.layer
    );

    this.bodyLayer = new Konva.Layer();
    this.linkGroup = new LinkGroup(this.context, this.stage, this.bodyLayer);
    this.baselineGroup = new ChartBaseline(this.context, this.stage, this.bodyLayer);
    this.bodyGroup = new BodyGroup(
      this.context,
      this.stage,
      this.bodyLayer,
      this.bgLayer
    );
    this.stage.add(this.bodyLayer);
  }

  /**
   * 调整大小
   */
  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;

    // 首先设置时间线中的总宽度。为了计算每一格的宽度
    this.context.store.getTimeAxis().setAllWidth(width);

    // 更新 Konva 尺寸
    this.stage.width(width);
    this.stage.height(height);

    // 更新各层尺寸
    this.headerLayer.resize(width);
    this.gridGroup.resize(width, height);
    this.linkGroup.resize(width, height);
    this.baselineGroup.resize(width, height);
    this.holidayGroup.resize(width, height);
    this.weekendGroup.resize(width, height);
    this.bodyGroup.resize(width, height);
    this.todayLayer.resize(width, height);
  }

  public render(x: number, y: number, tasks: Task[]) {
    this.headerLayer.setOffset(-x, 0); // 表头只横向移动
    this.gridGroup.setOffset(-x, -y);
    this.linkGroup.setOffset(-x, -y);
    this.baselineGroup.setOffset(-x, -y);
    this.weekendGroup.setOffset(-x, -y);
    this.holidayGroup.setOffset(-x, -y);
    this.bodyGroup.setOffset(-x, -y);
    this.todayLayer.setOffset(-x, -y);

    // 渲染
    this.gridGroup.render();
    this.holidayGroup.render();
    this.weekendGroup.render();
    this.linkGroup.render(tasks);
    this.baselineGroup.render(tasks);
    this.bodyGroup.render(tasks);
    this.headerLayer.render();
    this.todayLayer.render();
  }

  /**
   * 刷新图表（用于滚动或局部更新时的高效渲染）
   */
  public refresh(x: number, y: number, tasks: Task[]) {
    this.render(x, y, tasks);
  }

  /**
   * 更新任务
   */
  public updateTask(task: Task) {
    this.bodyGroup.updateTask(task);
    this.linkGroup.update();
    this.baselineGroup.update();
  }

  public destroy() {
    this.headerLayer.destroy();
    this.gridGroup.destroy();
    this.bodyLayer.destroy();
    this.todayLayer.destroy();

    this.holidayGroup.destroy();
    this.weekendGroup.destroy();
    this.linkGroup.destroy();
    this.baselineGroup.destroy();

    this.bgLayer.destroy();
    this.stage.destroy();
  }
}
