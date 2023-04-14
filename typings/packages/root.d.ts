import { XComponent } from '../component';
import {
  type GanttColumnSize,
  type ParamBodyOptions,
  type ParamHeaderOptions
} from '../../src/typings/ParamOptions';

declare class XGanttRootComponent extends XComponent {
  bodyStyle: ParamBodyOptions;

  border: number;

  borderColor: string;

  dark: boolean;

  data: any[];

  dataIndex: string;

  endKey: string;

  expandAll: boolean;

  ganttColumnSize: GanttColumnSize;

  headerHeight: number | string;

  headerStyle: ParamHeaderOptions;

  levelColor: string[];

  primaryColor: string;

  rowHeight: number | string;

  showCheckbox: boolean;

  showExpand: boolean;

  showSettingBtn: boolean;

  showToday: boolean;

  showWeekend: boolean;

  startKey: string;
}
