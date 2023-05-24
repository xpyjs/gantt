import type {
  App,
  ComponentOptionsMixin,
  ComputedOptions,
  DefineComponent,
  EmitsOptions,
  MethodOptions,
  ObjectEmitsOptions
} from 'vue';

export type XComponentConstructor<
  Prop,
  M extends MethodOptions = MethodOptions,
  E extends EmitsOptions = ObjectEmitsOptions
> = DefineComponent<
  Prop,
  M,
  Record<string, unknown>,
  ComputedOptions,
  M,
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  E
> & {
  install: (app: App) => void;
};

export declare const withInstall: <
  T = Record<string, unknown>,
  M extends MethodOptions = MethodOptions,
  E extends EmitsOptions = ObjectEmitsOptions
>(
  name: string,
  comp: any
) => XComponentConstructor<T, M, E>;
