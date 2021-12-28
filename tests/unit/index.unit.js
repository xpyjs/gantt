import { shallowMount, mount } from '@vue/test-utils';
import Root from '@/pages/root/RootWrap.vue';
import Gantt from '@/components/gantt/index.vue';
import Table from '@/components/table/index.vue';
import JBtn from '@/components/common/Btn.vue';
import { dataList } from './data';

window.ResizeObserver =
  window.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn()
  }));

describe('Root.vue', () => {
  const wrapper = mount(Root, {
    props: { data: dataList, dataIndex: 'index' }
  });

  it('load table component', done => {
    expect(wrapper.findComponent(Table).exists()).toBe(true);
    done();
  });

  it('load gantt component', done => {
    expect(wrapper.findComponent(Gantt).exists()).toBe(true);
    done();
  });

  it('load btn & click btn', async done => {
    const btn = wrapper.findComponent(JBtn);
    expect(btn.exists()).toBe(true);

    expect(wrapper.find('.gt-mask-hide').exists()).toBe(true);
    await btn.trigger('click');
    expect(wrapper.find('.gt-mask-show').exists()).toBe(true);
    done();
  });
});

describe('Render', () => {
  const wrapper = mount(Root, {
    props: { data: dataList, dataIndex: 'index' }
  });

  it('render count', done => {
    expect(wrapper.findAll('.gt-gantt-row').length).toBe(2);
    done();
  });
});
