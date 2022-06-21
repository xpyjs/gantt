import { VueElement } from 'vue';

declare class XComponent extends VueElement {
  static install(vue: typeof VueElement): void;
}
