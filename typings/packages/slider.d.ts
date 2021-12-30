import { SliderAlignment } from '@/typings/ParamOptions';
import { JComponent } from '../component';

declare class JGanttSliderComponent extends JComponent {
  alignment: SliderAlignment;

  bgColor: string;

  dateFormat: string;

  emptyData: string;

  flat: boolean;

  label: string;

  linkedResize: boolean;

  move: boolean | ((data: { data: any; level: number }) => boolean);

  resizeLeft: boolean;

  resizeRight: boolean;

  progress: boolean;

  progressDecimal: boolean | number;
}
