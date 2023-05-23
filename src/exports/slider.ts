import { withInstall } from '../utils/install';
import { Variables } from '../constants/vars';
import Slider from 'components/slider/index.vue';
import {
  type SliderEmits,
  type SliderMethods,
  type SliderProps
} from 'typings/slider/prop';

const XGanttSlider = withInstall<SliderProps, SliderMethods, SliderEmits>(
  Variables.name.slider,
  Slider
);

export default XGanttSlider;
