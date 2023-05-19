import Gantt from '@/components/gantt/index.vue';
import Header from '@/components/gantt/Header.vue';
import { allData } from './data';
import { wrapperWithProvider } from './helpers/createWrapper';

describe('Gantt.vue', () => {
  const wrapper = wrapperWithProvider(Gantt, { rowData: allData.value });

  it('height', done => {
    expect(wrapper.find('.gt-gantt-row-wrap').element.style.height).toBe(
      `${30 * allData.value.length}px`
    );
    done();
  });

  it('load header', done => {
    expect(wrapper.findComponent(Header).exists()).toBe(true);
    done();
  });
});
