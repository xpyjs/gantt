import type { App, Plugin } from 'vue';
import XGantt from './exports/root';
import XGanttColumn from './exports/column';
import XGanttSlider from './exports/slider';

const components: Record<string, Plugin> = {
  XGantt,
  XGanttColumn,
  XGanttSlider
};

const install = (app: App, options?: Record<string, unknown>) => {
  for (const key of Object.keys(components)) {
    app.use(components[key], options);
  }
};

export default {
  install,
  ...components
};
