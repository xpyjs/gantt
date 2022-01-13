import { Row } from '@/models/data/row';
import useRootEmit from './useRootEmit';
import useData from '../data/useData';

export default (data: Row) => {
  const { GtData } = useData();
  const { IFClickRow, IFDblClickRow, IFCheckedRow } = useRootEmit();

  function onChangeCheckbox(checked: boolean, checkedList: Row[] = []) {
    IFCheckedRow(checked, data, [data, ...checkedList]);
  }

  let rowRepeatClick = false;
  function onClickRow() {
    if (rowRepeatClick) {
      rowRepeatClick = false;
    } else {
      // 抛出单击事件
      // eslint-disable-next-line no-underscore-dangle
      GtData.setSelected({ index: data?.__uindex ?? -1, uuid: data?.uuid });
      IFClickRow(data);

      // 500ms 内再次点击无效。
      // TODO 可以做成自定义，最小200，不能再小了
      rowRepeatClick = true;
      window.setTimeout(() => {
        rowRepeatClick = false;
      }, 500);
    }
  }

  function onDbClickRow() {
    IFDblClickRow(data);
  }

  // 鼠标移入
  function onMouseEnterRow() {
    // eslint-disable-next-line no-underscore-dangle
    GtData.setHovered({ index: data?.__uindex ?? -1, uuid: data?.uuid });
  }

  // 鼠标移出
  function onMouseLeaveRow() {
    GtData.setHovered({ index: -1 });
  }

  return {
    onChangeCheckbox,
    onClickRow,
    onDbClickRow,
    onMouseEnterRow,
    onMouseLeaveRow
  };
};
