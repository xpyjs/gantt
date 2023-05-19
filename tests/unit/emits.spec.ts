import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import Root from './app.vue';
import { AllData, AllLinks } from './helpers/data';

const wrapper = mount(Root, {
  props: { data: AllData, links: AllLinks, dataId: 'index', expandAll: false }
});

describe('Emits', () => {
  test('row click', () => {
    wrapper.find('.xg-row').trigger('click');
    expect(wrapper.emitted()['row-click']).toHaveLength(1);
  });

  test('row dblclick', () => {
    wrapper.find('.xg-row').trigger('click');
    wrapper.find('.xg-row').trigger('click');
    expect(wrapper.emitted()['row-dbl-click']).toHaveLength(1);
  });

  test('click link', () => {
    wrapper.find('.xg-link').trigger('click');
    expect(wrapper.emitted()['click-link']).toHaveLength(1);
  });
});
