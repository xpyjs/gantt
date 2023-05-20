import type XGantt from '../src/exports/root';
import type XGanttColumn from '../src/exports/column';
import type XGanttSlider from '../src/exports/slider';

import './components.d.ts';

export const install: (
  app: any,
  options?: Record<string, unknown> | undefined
) => any;

export { XGantt, XGanttColumn, XGanttSlider };
