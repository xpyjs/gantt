declare type El = HTMLElement | SVGElement | null | undefined;

declare type SliderAlignment = 'left' | 'center' | 'right';

declare interface Rgba {
  r: number;
  g: number;
  b: number;
  a?: number;
}

declare interface DataOptions {
  isExpand?: boolean;
  startLabel?: string;
  endLabel?: string;
  dataId?: string;
}
