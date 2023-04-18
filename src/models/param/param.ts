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

  private _hoverId: string = '';
  public get hoverId(): string {
    return this._hoverId;
  }

  public set hoverId(v: string) {
    this._hoverId = v;
  }

  private _selectId: string = '';
  public get selectId(): string {
    return this._selectId;
  }

  public set selectId(v: string) {
    this._selectId = v;
  }
}
