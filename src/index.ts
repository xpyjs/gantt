import { App } from 'vue';
import JGanttColumn from 'components/column/index.vue';
import JGanttSlider from 'components/slider/index.vue';
import JGantt from './pages/root/RootWrap.vue';

import 'animate.css';
import './styles/index.scss';
import { Variables } from './constants/vars';

JGantt.install = (app: App) => {
  app.component(Variables.name.root, JGantt);
  app.component(Variables.name.column, JGanttColumn);
  app.component(Variables.name.slider, JGanttSlider);
};

const install = (app: App) => {
  app.use(JGantt as any);
};

export default {
  install
};

export { JGantt, JGanttColumn, JGanttSlider };
