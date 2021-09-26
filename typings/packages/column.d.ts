import { JComponent } from "../component";

declare class JGanttColumnComponent extends JComponent {
  center: boolean;
  dateFormat: string;
  emptyData: string;
  label: string;
  merge: (data: any) => boolean | boolean;
  name: string;
  selectable: boolean;
  width: number | string;
}
