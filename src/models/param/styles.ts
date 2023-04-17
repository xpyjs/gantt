type Style = Record<string, string>;

export default class StyleBox {
  private __border: number = 1;
  setBorder(b: number) {
    this.__border = b;
  }

  getBorder(): Style {
    return { border: `${this.__border}px solid` };
  }

  private __borderColor: string = '#e5e5e5';
  setBorderColor(bc: string) {
    this.__borderColor = bc;
  }

  getBorderColor(): Style {
    return { 'border-color': this.__borderColor };
  }

  private __ganttColumnSize: GanttColumnSize = 'normal';
  public set ganttColumnSize(gs: GanttColumnSize) {
    this.__ganttColumnSize = gs;
  }

  public get ganttColumnSize(): GanttColumnSize {
    return this.__ganttColumnSize;
  }

  private __unit: HeaderDateUnit = 'day';
  public get unit(): HeaderDateUnit {
    return this.__unit;
  }

  public set unit(v: HeaderDateUnit) {
    this.__unit = v;
  }
}
