import Variables from '@/constants/vars';
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

  private _selectItem: RowItem | null = null;
  public get selectItem(): RowItem | null {
    return this._selectItem;
  }

  public set selectItem(v: RowItem | null) {
    this._selectItem = v;
  }

  private _moveHoverItem: RowItem | null = null;
  public get moveHoverItem(): RowItem | null {
    return this._moveHoverItem;
  }

  public set moveHoverItem(v: RowItem | null) {
    this._moveHoverItem = v;
  }

  private _moveStartItem: RowItem | null = null;
  public get moveStartItem(): RowItem | null {
    return this._moveStartItem;
  }

  public set moveStartItem(v: RowItem | null) {
    this._moveStartItem = v;
  }

  private _showMoveLine: boolean = false;
  public get showMoveLine(): boolean {
    return this._showMoveLine;
  }

  public set showMoveLine(v: boolean) {
    this._showMoveLine = v;
  }

  private _headerHeight: number = Variables.default.headerHeight;
  public get headerHeight(): number {
    return this._headerHeight;
  }

  public set headerHeight(v: number) {
    this._headerHeight = v;
  }
}
