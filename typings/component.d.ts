import { VueElement } from "vue";

declare class JComponent extends VueElement {
  static install(vue: typeof VueElement): void;
}
