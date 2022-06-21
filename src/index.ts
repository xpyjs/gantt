import { App } from 'vue';
import XGanttColumn from 'components/column/index.vue';
import XGanttSlider from 'components/slider/index.vue';
import XGantt from './pages/root/RootWrap.vue';

import './styles/index.scss';
import { Variables } from './constants/vars';

XGantt.install = (app: App) => {
  app.component(Variables.name.root, XGantt);
  app.component(Variables.name.column, XGanttColumn);
  app.component(Variables.name.slider, XGanttSlider);
};

const install = (app: App) => {
  app.use(XGantt as any);
};

export default {
  install
};

export { XGantt, XGanttColumn, XGanttSlider };
