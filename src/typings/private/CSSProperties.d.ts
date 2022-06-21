import { CSSProperties } from 'vue';

declare interface CustomCssProperties extends CSSProperties {
  '--table-width': string;
  '--root-border': string;
  '--column-width': string;
  '--box-size': string;
  '--row-height': string;
  '--scrollbar-width': string;
  '--header-height': string;
  '--x-content-border-color': string;
  '--x-text-color': string;
  '--x-primary-color': string;
  '--x-content-bg-color': string;

  [key: string]: any;
}
