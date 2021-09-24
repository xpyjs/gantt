import { App } from "vue";

export function install(vue: App): void;

import { JGanttRootComponent } from "./packages/root";
import { JGanttColumnComponent } from "./packages/column";
import { JGanttSliderComponent } from "./packages/slider";

export class JGantt extends JGanttRootComponent {
  setSelected: (data: any) => void;
  jumpToDate: (date: Date | undefined) => void;
}
export class JGanttColumn extends JGanttColumnComponent {}
export class JGanttSlider extends JGanttSliderComponent {}
