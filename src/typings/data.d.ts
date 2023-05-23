import type RowItem from '@/models/data/row';

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
