import type { App, Plugin } from 'vue';
import Column from 'components/column/index.vue';
import Slider from 'components/slider/index.vue';
import Root from 'components/root/RootWrap.vue';
import { Variables } from './constants/vars';
import { withInstall } from './utils/install';

const XGantt = withInstall(Variables.name.root, Root);
const XGanttColumn = withInstall(Variables.name.column, Column);
const XGanttSlider = withInstall(Variables.name.slider, Slider);

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
