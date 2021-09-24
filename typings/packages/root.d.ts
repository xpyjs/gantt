import { JGanttComponent } from "../component";
import {
  ParamBodyOptions,
  ParamHeaderOptions
} from "../../src/typings/ParamOptions";

export declare class JGanttRootComponent extends JGanttComponent {
  bodyStyle: ParamBodyOptions;
  border: number;
  borderColor: string;
  dark: boolean;
  data: any[];
  dataIndex: string;
  endKey: string;
  expandAll: boolean;
  ganttColumnWidth: number | string;
  headerHeight: number | string;
  headerStyle: ParamHeaderOptions;
  levelColor: string[];
  primaryColor: string;
  rowHeight: number | string;
  showCheckbox: boolean;
  showexpand: boolean;
  showToday: boolean;
  showWeekend: boolean;
  startKey: string;
}
