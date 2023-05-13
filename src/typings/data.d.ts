/**
 * 事件抛出的数据
 */
declare interface RowData {
  row?: any;
  $index?: number;
  level?: number;
}

/**
 * 滑动抛出的数据
 */
declare interface MoveSliderData {
  row: any;
  old: { start: Date; end: Date };
}
