/* eslint-disable @typescript-eslint/consistent-type-imports */
import '@vue/runtime-core';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    XGantt: typeof import('./root/index')['default'];
    XGanttColumn: typeof import('./column/index')['default'];
    XGanttSlider: typeof import('./slider/index')['default'];
  }
}
