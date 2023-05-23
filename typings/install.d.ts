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
  E extends EmitsOptions = string[] | ObjectEmitsOptions
> = DefineComponent<
  Prop,
  Record<string, unknown>,
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
  E extends EmitsOptions = string[] | ObjectEmitsOptions
>(
  name: string,
  comp: any
) => XComponentConstructor<T, M, E>;
