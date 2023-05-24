import type _XGantt from './root/index';
import type _XGanttColumn from './column/index';
import type _XGanttSlider from './slider/index';

import './components.d';

declare const _default: {
  install: (app: any, options?: Record<string, unknown> | undefined) => void;
};
export default _default;

declare type XGantt = typeof _XGantt;
declare type XGanttComponent = typeof _XGantt;

declare type XGanttColumn = typeof _XGanttColumn;
declare type XGanttColumnComponent = typeof _XGanttColumn;

declare type XGanttSlider = typeof _XGanttSlider;
declare type XGanttSliderComponent = typeof _XGanttSlider;

export type {
  XGantt,
  XGanttComponent,
  XGanttColumn,
  XGanttColumnComponent,
  XGanttSlider,
  XGanttSliderComponent
};
