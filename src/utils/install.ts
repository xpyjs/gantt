import { type XComponentConstructor } from '../../types/install';
import type { EmitsOptions, MethodOptions, ObjectEmitsOptions } from 'vue';

export const withInstall = <
  T = Record<string, unknown>,
  M extends MethodOptions = MethodOptions,
  E extends EmitsOptions = string[] | ObjectEmitsOptions
>(
  name: string,
  comp: any
) => {
  (comp as XComponentConstructor<T, M, E>).install = app => {
    app.component(name, comp);
  };

  return comp as XComponentConstructor<T, M, E>;
};
