import { withInstall } from '../utils/install';
import { Variables } from '../constants/vars';
import Slider from 'components/slider/index.vue';
import type props from '@/components/slider/props';

type sliderProps = Omit<typeof props, 'data'>;

const XGanttSlider = withInstall<sliderProps>(Variables.name.slider, Slider);

export default XGanttSlider;
