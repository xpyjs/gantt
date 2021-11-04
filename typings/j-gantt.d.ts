import { App } from 'vue';
import { HeaderDateUnit } from '@/typings/ParamOptions';

import { JGanttRootComponent } from './packages/root.d';

export function install(vue: App): void;

export { JGanttColumnComponent } from './packages/column.d';
export { JGanttSliderComponent } from './packages/slider.d';

export declare class JGanttComponent extends JGanttRootComponent {
  setSelected: (data: any) => void;

  jumpToDate: (date?: Date) => void;

  setHeaderUnit: (unit: HeaderDateUnit) => void;
}
