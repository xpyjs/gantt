import { useJumpDate } from '../useDate';
import useData from '../data/useData';
import { useExportParamFunc } from '../useParam';

export default () => {
  const { GtData } = useData();
  const { handleJumpTo } = useJumpDate();
  const { updateGanttHeaderUnit } = useExportParamFunc();

  /**
   * 将数据对应行设置为选中行
   * @param data 要选中的数据
   */
  function setSelected(data: any) {
    GtData.setSelectedByData(data);
  }

  return {
    setSelected,
    jumpToDate: handleJumpTo,
    setHeaderUnit: updateGanttHeaderUnit
  };
};
