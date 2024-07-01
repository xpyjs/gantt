import Variables from '@/constants/vars';
import { isBoolean } from 'lodash';
import { XDate } from './date';

type Style = Record<string, string>;

export default class StyleBox {
  private __border: number = 1;
  setBorder(b: number) {
    this.__border = b;
  }

  getBorder(): Style {
    return { border: `${this.__border}px solid` };
  }

  private _borderColor: string = '#e5e5e5';
  public get borderColor(): string {
    return this._borderColor;
  }

  public set borderColor(v: string) {
    this._borderColor = v;
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

  private _rowHeight: number = Variables.default.rowHeight;
  public get rowHeight(): number {
    return this._rowHeight;
  }

  public set rowHeight(v: number | string) {
    if (typeof v === 'string') {
      this._rowHeight = parseInt(v);
    } else {
      this._rowHeight = v;
    }
  }

  private _showCheckbox: boolean = false;
  public get showCheckbox(): boolean {
    return this._showCheckbox;
  }

  public set showCheckbox(v: boolean) {
    this._showCheckbox = v;
  }

  private _highlightDate: boolean = false;
  public get highlightDate(): boolean {
    return this._highlightDate;
  }

  public set highlightDate(v: boolean) {
    this._highlightDate = v;
  }

  private _showExpand: boolean = true;
  public get showExpand(): boolean {
    return this._showExpand;
  }

  public set showExpand(v: boolean) {
    this._showExpand = v;
  }

  private _showToday: boolean = true;
  public get showToday(): boolean {
    return this._showToday;
  }

  public set showToday(v: boolean) {
    this._showToday = v;
  }

  private _showWeekend: boolean = true;
  public get showWeekend(): boolean {
    return this._showWeekend;
  }

  public set showWeekend(v: boolean) {
    this._showWeekend = v;
  }

  private _levelColor: string[] = [];
  public get levelColor(): string[] {
    return this._levelColor;
  }

  public set levelColor(v: string[]) {
    this._levelColor = v;
  }

  private _primaryColor: string = '#eca710';
  public get primaryColor(): string {
    return this._primaryColor;
  }

  public set primaryColor(v: string) {
    this._primaryColor = v;
  }

  private _headerStyle: HeaderOptions = {};
  public get headerStyle(): HeaderOptions {
    return this._headerStyle;
  }

  public set headerStyle(v: HeaderOptions) {
    this._headerStyle = v;
  }

  private _bodyStyle: BodyOptions = {};
  public get bodyStyle(): BodyOptions {
    return this._bodyStyle;
  }

  public set bodyStyle(v: BodyOptions) {
    this._bodyStyle = v;
  }

  private _sliderIntoView: boolean = false;
  public get sliderIntoView(): boolean {
    return this._sliderIntoView;
  }

  public set sliderIntoView(v: boolean) {
    this._sliderIntoView = v;
  }

  private _draggable: DraggableOptions = { draggable: false, level: 'current' };
  public get draggable(): DraggableOptions {
    return this._draggable;
  }

  public set draggable(v: boolean | Partial<DraggableOptions>) {
    this._draggable = isBoolean(v)
      ? { draggable: v, level: 'current' }
      : Object.assign(this._draggable, v);
  }

  private _holidays: Array<{ date: XDate[]; color?: string }> = [];
  public get holidays(): Array<{ date: XDate[]; color?: string }> {
    return this._holidays;
  }

  public set holidays(
    v: Array<{ date: LikeDate | LikeDate[]; color?: string }>
  ) {
    const h = v.map(item => {
      if (!Array.isArray(item.date)) {
        item.date = [item.date];
      }

      return {
        date: item.date.map(d => new XDate(d)),
        color: item.color ?? this.bodyStyle?.weekendColor ?? '#ddd'
      };
    });

    this._holidays = h;
  }

  private _formatGanttHeader?: string;
  public get formatGanttHeader() {
    return this._formatGanttHeader;
  }

  public set formatGanttHeader(v: string | undefined) {
    this._formatGanttHeader = v;
  }
}
