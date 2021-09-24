import { JGanttComponent } from "../component";

export declare class JGanttColumnComponent extends JGanttComponent {
  center: boolean;
  dateFormat: string;
  emptyData: string;
  label: string;
  merge: (data: any) => boolean | boolean;
  name: string;
  selectable: boolean;
  width: number | string;
}
