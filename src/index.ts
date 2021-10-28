import { App } from 'vue';
import JGanttColumn from 'components/column/index.vue';
import JGanttSlider from 'components/slider/index.vue';
import JGantt from './pages/root/index.vue';

import 'animate.css';
import './styles/index.scss';
import { Variables } from './constants/vars';

const components = [JGantt, JGanttColumn, JGanttSlider];

const install = (app: App) => {
  // if (install.installed) return;

  app.component(Variables.name.root, JGantt);
  app.component(Variables.name.column, JGanttColumn);
  app.component(Variables.name.slider, JGanttSlider);
};

// declare module "@vue/runtime-core" {
//   interface ComponentCustomProperties {}
// }

export default {
  install,
  ...components
};
