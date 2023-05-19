import { shallowMount, mount } from '@vue/test-utils';
import { store } from './store';

export function wrapperWithProvider(Component, propsData) {
  return shallowMount(Component, {
    propsData,
    global: {
      provide: store.provide
    }
  });
}
