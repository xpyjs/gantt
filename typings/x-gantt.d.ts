import { App } from 'vue';
import { HeaderDateUnit } from '../src/typings/ParamOptions';

import { XGanttRootComponent } from './packages/root';

export function install(vue: App): void;

export { XGanttColumnComponent } from './packages/column';
export { XGanttSliderComponent } from './packages/slider';

export declare class XGanttComponent extends XGanttRootComponent {
  setSelected: (data: any) => void;

  jumpToDate: (date?: Date) => void;

  setHeaderUnit: (unit: HeaderDateUnit) => void;
}
