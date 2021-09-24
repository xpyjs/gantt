import { Row } from "@/models/data/row";
import { ref, toRaw } from "vue";
import useData from "./useData";
import { useJumpDate } from "./useDate";

const rootEmit = ref();

export function useInitEvent(emit: any) {
  rootEmit.value = emit;
  return {};
}

export function useRootEmit() {
  /**
   * 单击行
   */
  function IFClickRow(data: Row | undefined) {
    rootEmit.value("row-click", data ? { ...toRaw(data.data) } : void 0);
  }

  /**
   * 双击行
   */
  function IFDblClickRow(data: Row | undefined) {
    rootEmit.value("row-dbl-click", { ...toRaw(data?.data) });
  }

  /**
   * 点击checkbox
   */
  function IFCheckedRow(state: boolean, data: Row | undefined) {
    rootEmit.value("row-checked", state, { ...toRaw(data?.data) });
  }

  /**
   * 移动甘特滑块
   * @param data
   * @param old
   */
  function IFMoveSlider(
    data: Row | undefined,
    old: { start: Date; end: Date }
  ) {
    // 抛出接口事件
    rootEmit.value("move-slider", { ...toRaw(data?.data) }, old);
  }

  /**
   * 如果跳转的日期不在甘特范围内，跳转时触发该异常
   */
  function INoDateError(date: Date) {
    rootEmit.value("no-date-error", date);
  }

  return {
    IFClickRow,
    IFDblClickRow,
    IFCheckedRow,
    IFMoveSlider,
    INoDateError
  };
}

export default function (data: Row) {
  const { GtData } = useData();
  const { IFClickRow, IFDblClickRow, IFCheckedRow } = useRootEmit();

  function onChangeCheckbox(e: Event) {
    IFCheckedRow((e.target as any)?.checked, data);
  }

  let rowRepeatClick = false;
  function onClickRow() {
    if (rowRepeatClick) {
      rowRepeatClick = false;
      return;
    } else {
      // 抛出单击事件
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
}

export function useExportEvent() {
  const { GtData } = useData();
  const { handleJumpTo } = useJumpDate();

  /**
   * 将数据对应行设置为选中行
   * @param data 要选中的数据
   */
  function setSelected(data: any) {
    GtData.setSelectedByData(data);
  }

  return {
    setSelected,
    jumpToDate: handleJumpTo
  };
}
