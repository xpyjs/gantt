import { type SliderAlignment } from '../../src/typings/ParamOptions';
import { XComponent } from '../component';

declare class XGanttSliderComponent extends XComponent {
  alignment: SliderAlignment;

  bgColor: string;

  dateFormat: string;

  emptyData: string;

  flat: boolean;

  highlightDate: boolean;

  label: string;

  linkedResize: boolean;

  move: boolean | ((data: { data: any; level: number }) => boolean);

  resizeLeft: boolean;

  resizeRight: boolean;

  progress: boolean;

  progressDecimal: boolean | number;
}
