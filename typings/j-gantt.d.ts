import { App } from "vue";

export function install(vue: App): void;

import { JGanttRootComponent } from "./packages/root.d";
export { JGanttColumnComponent } from "./packages/column.d";
export { JGanttSliderComponent } from "./packages/slider.d";

export declare class JGanttComponent extends JGanttRootComponent {
  setSelected: (data: any) => void;
  jumpToDate: (date?: Date) => void;
}
