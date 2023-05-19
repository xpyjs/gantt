import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import Root from './app.vue';
import { AllData, AllLinks } from './helpers/data';

const wrapper = mount(Root, {
  props: { data: AllData, links: AllLinks, dataId: 'index', expandAll: false }
});

describe('Render', () => {
  test('render xg-root', () => {
    expect(wrapper.find('.xg-root').exists()).toBe(true);
  });

  test('render xg-table-header', () => {
    expect(wrapper.find('.xg-table-header').exists()).toBe(true);
  });

  test('render xg-table-body', () => {
    expect(wrapper.find('.xg-table-body').exists()).toBe(true);
  });

  test('render xg-gantt-header', () => {
    expect(wrapper.find('.xg-gantt-header').exists()).toBe(true);
  });

  test('render xg-gantt-body', () => {
    expect(wrapper.find('.xg-gantt-body').exists()).toBe(true);
  });

  test('render xg-row', () => {
    expect(wrapper.find('.xg-row').exists()).toBe(true);
  });

  test('render xg-table-cell', () => {
    expect(wrapper.find('.xg-table-cell').exists()).toBe(true);
  });

  test('render xg-slider', () => {
    expect(wrapper.find('.xg-slider').exists()).toBe(true);
  });

  test('count xg-row', () => {
    expect(wrapper.findAll('.xg-row').length).toBe(
      Math.min(5, AllData.length) * 3
    );
  });

  test('count links', () => {
    expect(wrapper.findAll('.xg-link').length).toBe(AllLinks.length);
  });
});
