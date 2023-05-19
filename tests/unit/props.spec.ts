import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import { nextTick } from 'vue';
import Root from './app.vue';
import { AllData, AllLinks } from './helpers/data';

const wrapper = mount(Root, {
  props: { data: AllData, links: AllLinks, dataId: 'index', expandAll: false }
});

describe('Today', () => {
  test('render today', () => {
    expect(wrapper.find('.today').exists()).toBe(true);
  });

  test('today line visible', async () => {
    expect(wrapper.find('.today').isVisible()).toBe(true);
    await wrapper.setProps({ showToday: false });
    expect(wrapper.find('.today').exists()).toBe(false);
    await wrapper.setProps({ showToday: true });
    expect(wrapper.find('.today').exists()).toBe(true);
  });
});

describe('Weekend', () => {
  test('render weekend', () => {
    expect(wrapper.find('.weekend').exists()).toBe(true);
  });

  test('weekend line visible', async () => {
    expect(wrapper.find('.weekend').isVisible()).toBe(true);
    await wrapper.setProps({ showWeekend: false });
    expect(wrapper.find('.weekend').exists()).toBe(false);
    await wrapper.setProps({ showWeekend: true });
    expect(wrapper.find('.weekend').exists()).toBe(true);
  });
});

describe('Expand', () => {
  test('expandAll', async () => {
    await wrapper.setProps({ showExpand: true, expandAll: false });
    expect(wrapper.find('.xg-root').text()).not.toContain('sub-t');
    await wrapper.setProps({ expandAll: true });
    expect(wrapper.find('.xg-root').text()).toContain('sub-t');
  });

  test('showExpand', async () => {
    await wrapper.setProps({ showExpand: true, expandAll: true });
    expect(wrapper.find('.xg-root').text()).toContain('sub-t');
    await wrapper.setProps({ showExpand: true, expandAll: false });
    expect(wrapper.find('.xg-root').text()).not.toContain('sub-t');
    await wrapper.setProps({ showExpand: false });
    expect(wrapper.find('.xg-root').text()).toContain('sub-t');
  });
});

describe('Checkbox', () => {
  test('showCheckbox', async () => {
    await wrapper.setProps({ showCheckbox: true });
    expect(wrapper.find('.checkbox').exists()).toBe(true);
    await wrapper.setProps({ showCheckbox: false });
    expect(wrapper.find('.checkbox').exists()).toBe(false);
  });
});
