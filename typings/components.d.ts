/* eslint-disable @typescript-eslint/consistent-type-imports */
import '@vue/runtime-core';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    XGantt: typeof import('../src/exports/root')['default'];
    XGanttColumn: typeof import('../src/exports/column')['default'];
    XGanttSlider: typeof import('../src/exports/slider')['default'];
  }
}
