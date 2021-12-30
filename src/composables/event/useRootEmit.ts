import { toRaw } from 'vue';
import { Row } from '@/models/data/row';
import { useGetRootEmit } from './useInitEvent';

export default () => {
  const rootEmit = useGetRootEmit();
  /**
   * 单击行
   */
  function IFClickRow(data: Row | undefined) {
    rootEmit.value('row-click', data ? { ...toRaw(data.data) } : undefined);
  }

  /**
   * 双击行
   */
  function IFDblClickRow(data: Row | undefined) {
    rootEmit.value('row-dbl-click', { ...toRaw(data?.data) });
  }

  /**
   * 点击checkbox
   */
  function IFCheckedRow(state: boolean, data: Row | undefined) {
    rootEmit.value('row-checked', state, { ...toRaw(data?.data) });
  }

  /**
   * 移动甘特滑块
   */
  function IFMoveSlider(data: Array<Row>, old: { start: Date; end: Date }) {
    // 抛出接口事件
    rootEmit.value(
      'move-slider',
      data.map(d => toRaw(d.data)),
      old
    );
  }

  function IFMoveProgress(data: Row, old: number) {
    rootEmit.value('move-progress', { ...toRaw(data.data) }, old);
  }

  /**
   * 如果跳转的日期不在甘特范围内，跳转时触发该异常
   */
  function INoDateError(date: Date) {
    rootEmit.value('no-date-error', date);
  }

  return {
    IFClickRow,
    IFDblClickRow,
    IFCheckedRow,
    IFMoveSlider,
    IFMoveProgress,
    INoDateError
  };
};
