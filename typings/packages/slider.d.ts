import { JComponent } from '../component';

export type SliderAlignment = 'left' | 'center' | 'right';

declare class JGanttSliderComponent extends JComponent {
  alignment: SliderAlignment;

  bgColor: string;

  dateFormat: string;

  emptyData: string;

  flat: boolean;

  label: string;

  linkedResize: boolean;

  move: (data: { data: any; level: number }) => boolean | boolean;

  resizeLeft: boolean;

  resizeRight: boolean;
}
