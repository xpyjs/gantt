/* eslint-disable @typescript-eslint/ban-types */
import type {
  App,
  ComponentOptionsMixin,
  ComputedOptions,
  DefineComponent,
  EmitsOptions,
  MethodOptions
} from 'vue';

export type ComponentConstructor<
  Prop,
  M extends MethodOptions = MethodOptions,
  E extends EmitsOptions = {}
> = DefineComponent<
  Prop,
  {},
  {},
  ComputedOptions,
  M,
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  E
> & {
  install: (app: App) => void;
};

export const withInstall = <
  T = {},
  M extends MethodOptions = MethodOptions,
  E extends EmitsOptions = {}
>(
  name: string,
  comp: any
) => {
  (comp as ComponentConstructor<T, M, E>).install = app => {
    app.component(name, comp);
  };

  return comp as ComponentConstructor<T, M, E>;
};
