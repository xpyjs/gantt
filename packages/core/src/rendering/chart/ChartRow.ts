import Konva from "konva";
import { ChartSlider } from "./ChartSlider";
import { IContext } from "@/types/render";
import type { Task } from "@/models/Task";

export class ChartRow {
  public row: Konva.Group;
  public slider: ChartSlider;
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

    // 创建 ChartSlider
    this.slider = new ChartSlider(this.context, 0, y, this.task, this.width);
    this.row.add(this.slider.sliderGroup);
  }

  public update(x: number, y: number) {
    this.slider.update(x, y);
  }

  public setOffset(x: number, y: number) {
    this.slider.setOffset(x, y);
  }

  public destroy() {
    this.row.destroy();
  }
}
