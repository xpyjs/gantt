import Konva from "konva";
import { ChartSlider } from "./ChartSlider";
import { IContext } from "@/types/render";
import type { Task } from "@/models/Task";

export class ChartRow {
  public row: Konva.Group;
  /** 非 split 模式下的单条渲染器 */
  public slider: ChartSlider | null = null;
  /** split 模式下的段渲染器，按段 id 索引 */
  private segmentSliders: Map<string, ChartSlider> = new Map();
  private isSplitMode: boolean = false;
  public cacheKey: string = "";

  constructor(
    private context: IContext,
    public task: Task,
    id: string,
    x: number,
    y: number,
    private width: number,
    private height: number
  ) {
    this.row = new Konva.Group();

    const row = new Konva.Rect({
      x: x,
      y: y,
      width: width,
      height: height,
      id: id,
      listening: false
    });
    this.row.add(row);

    this.buildSliders(y);
  }

  /**
   * split 行的段是独立任务条（自带拖拽/进度/事件），
   * 父级自身不再渲染条形——它是段的包络，仅存在于数据层
   */
  private buildSliders(y: number): void {
    this.isSplitMode = this.task.isSplit();

    if (this.isSplitMode) {
      this.task.getSegments().forEach(seg => {
        const slider = new ChartSlider(this.context, 0, y, seg, this.width);
        this.segmentSliders.set(seg.id, slider);
        this.row.add(slider.sliderGroup);
      });
    } else {
      this.slider = new ChartSlider(this.context, 0, y, this.task, this.width);
      this.row.add(this.slider.sliderGroup);
    }
  }

  /** 销毁单个滑块：先停定时器，再移除其 Konva 节点 */
  private destroySlider(slider: ChartSlider | null): void {
    if (!slider) return;
    slider.destroy();
    slider.sliderGroup.destroy();
  }

  private destroySliders(): void {
    this.destroySlider(this.slider);
    this.slider = null;
    this.segmentSliders.forEach(slider => this.destroySlider(slider));
    this.segmentSliders.clear();
  }

  public update(x: number, y: number, task: Task) {
    this.task = task;

    // split 开关运行时切换（refreshSplitState）时重建整行渲染器
    if (task.isSplit() !== this.isSplitMode) {
      this.destroySliders();
      this.buildSliders(y);
      return;
    }

    if (this.isSplitMode) {
      this.updateSegmentSliders(y);
    } else {
      this.slider?.update(x, y, task);
    }
  }

  /** 段集合可能增删（数据更新/删除段），按 id 增量同步渲染器 */
  private updateSegmentSliders(y: number): void {
    const segments = this.task.getSegments();
    const segmentIds = new Set(segments.map(seg => seg.id));

    this.segmentSliders.forEach((slider, id) => {
      if (!segmentIds.has(id)) {
        this.destroySlider(slider);
        this.segmentSliders.delete(id);
      }
    });

    segments.forEach(seg => {
      const existing = this.segmentSliders.get(seg.id);
      if (existing) {
        existing.update(0, y, seg);
      } else {
        const slider = new ChartSlider(this.context, 0, y, seg, this.width);
        this.segmentSliders.set(seg.id, slider);
        this.row.add(slider.sliderGroup);
      }
    });
  }

  public setOffset(x: number, y: number) {
    this.slider?.setOffset(x, y);
    this.segmentSliders.forEach(slider => slider.setOffset(x, y));
  }

  public destroy() {
    this.destroySliders();
    this.row.destroy();
  }
}
