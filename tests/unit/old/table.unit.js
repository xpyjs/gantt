import Table from '@/components/table/index.vue';
import Header from '@/components/table/Header.vue';
import Row from '@/components/table/Row.vue';
import { allData } from './data';
import { wrapperWithProvider } from './helpers/createWrapper';

describe('Table.vue', () => {
  const wrapper = wrapperWithProvider(Table, { rowData: allData.value });

  it('height', done => {
    expect(wrapper.find('.gt-table-row-wrap').element.style.height).toBe(
      `${30 * allData.value.length}px`
    );
    done();
  });

  it('load header', done => {
    expect(wrapper.findComponent(Header).exists()).toBe(true);
    done();
  });
});

describe('Table:Row.vue', () => {
  const wrapper = wrapperWithProvider(Row, { data: allData.value[0] });

  it('load row', done => {
    expect(wrapper.findComponent(Row).exists()).toBe(true);
    done();
  });

  it('row height', done => {
    expect(wrapper.find('.gt-table-row').element.style.height).toBe(`${30}px`);
    done();
  });
});
