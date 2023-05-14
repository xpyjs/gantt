import type RowItem from '@/models/data/row';

/**
 * 事件抛出的数据
 */
declare interface RowData {
  row?: any;
  $index?: number;
  level?: number;
}

declare interface MoveSliderOldDate {
  start: Date;
  end: Date;
}

declare interface MoveSliderInternalData {
  row: RowItem;
  old: MoveSliderOldDate;
}

/**
 * 滑动抛出的数据
 */
declare interface MoveSliderData {
  row: any;
  old: MoveSliderOldDate;
}
