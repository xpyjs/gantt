import { type MoveSliderData } from '@/typings/data';
import { type LinkProps } from '@/typings/link';
import { ref, toRaw } from 'vue';

const rootEmit: any = ref(null);

export default () => {
  function setRootEmit(emit: any) {
    rootEmit.value = emit;
  }

  /**
   * 点击行事件
   * @param row 该行的原始数据
   */
  function EmitRowClick(row: any) {
    rootEmit.value?.('row-click', toRaw(row));
  }

  // (e: 'row-dbl-click', data: any): void;
  /**
   * 双击行事件
   * @param row 该行的原始数据
   */
  function EmitRowDblClick(row: any) {
    rootEmit.value?.('row-dbl-click', toRaw(row));
  }

  // (e: 'row-checked', state: boolean, data: any): void;
  /**
   * 选择行事件 checkbox
   * @param row 该行的原始数据
   */
  function EmitRowChecked(row: any) {
    rootEmit.value?.('row-checked', toRaw(row));
  }

  /**
   * 移动滑块事件
   * @param data 移动的所有原始数据集合（时间已被更新）。每一行包含旧时间
   */
  function EmitMoveSlider(data: MoveSliderData[]) {
    rootEmit.value?.(
      'move-slider',
      data.map(item => {
        return {
          row: toRaw(item.row),
          old: item.old
        };
      })
    );
  }

  /**
   * 添加连线事件
   * @param data
   */
  function EmitAddLink(data: LinkProps) {
    rootEmit.value?.('add-link', data);
  }

  // (e: 'move-progress', data: any, old: number): void;
  // (e: 'no-date-error'): void;

  return {
    setRootEmit,
    EmitRowClick,
    EmitRowDblClick,
    EmitRowChecked,
    EmitMoveSlider,
    EmitAddLink
  };
};
