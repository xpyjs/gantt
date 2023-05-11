import type RowItem from '../data/row';

export default class Param {
  private _currentTop: number = 0;
  public get currentTop(): number {
    return this._currentTop;
  }

  public set currentTop(v: number) {
    this._currentTop = v;
  }

  private _rootHeight: number = 0;
  public get rootHeight(): number {
    return this._rootHeight;
  }

  public set rootHeight(v: number) {
    this._rootHeight = v;
  }

  private _hoverItem: RowItem | null = null;
  public get hoverItem(): RowItem | null {
    return this._hoverItem;
  }

  public set hoverItem(v: RowItem | null) {
    this._hoverItem = v;
  }

  private _selectId: string = '';
  public get selectId(): string {
    return this._selectId;
  }

  public set selectId(v: string) {
    this._selectId = v;
  }

  private _showMoveLine: boolean = false;
  public get showMoveLine(): boolean {
    return this._showMoveLine;
  }

  public set showMoveLine(v: boolean) {
    this._showMoveLine = v;
  }

  private _headerHeight: number = 80;
  public get headerHeight(): number {
    return this._headerHeight;
  }

  public set headerHeight(v: number) {
    this._headerHeight = v;
  }
}
