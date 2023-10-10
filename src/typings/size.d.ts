// 对象方式设置甘特图列宽
declare interface ColumnSizeObject {
  hour?: number;
  day?: number;
  week?: number;
  month?: number;
}
declare type GanttColumnSize = 'small' | 'normal' | 'large' | ColumnSizeObject;
