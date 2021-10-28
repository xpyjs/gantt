import { JComponent } from "../component";
import {
  GanttColumnSize,
  ParamBodyOptions,
  ParamHeaderOptions
} from "../../src/typings/ParamOptions";

declare class JGanttRootComponent extends JComponent {
  bodyStyle: ParamBodyOptions;
  border: number;
  borderColor: string;
  dark: boolean;
  data: any[];
  dataIndex: string;
  endKey: string;
  expandAll: boolean;
  // ganttColumnWidth: number | string;
  ganttColumnSize: GanttColumnSize;
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
