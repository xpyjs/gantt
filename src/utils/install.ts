import type { App, DefineComponent } from 'vue';

export type ComponentConstructor<T> = DefineComponent<T> & {
  install: (app: App) => void;
};

export const withInstall = <T = any>(name: string, comp: any) => {
  (comp as ComponentConstructor<T>).install = app => {
    app.component(name, comp);
  };

  return comp as ComponentConstructor<T>;
};
