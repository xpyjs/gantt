import { Variables } from '@/constants/vars';
import { GanttColumnSize } from '@/typings/ParamOptions';

export default class DefaultOptions {
  colSize: GanttColumnSize;

  rowHeight: number;

  constructor() {
    this.colSize = 'normal';
    this.rowHeight = Variables.size.defaultContentRowHeight;
  }
}
