import { XComponent } from '../component';

declare class XGanttColumnComponent extends XComponent {
  center: boolean;

  dateFormat: string;

  emptyData: string;

  label: string;

  merge: (data: any) => boolean | boolean;

  name: string;

  selectable: boolean;

  width: number | string;

  columnStyle: Object | String;

  columnClass: Object | String;
}
