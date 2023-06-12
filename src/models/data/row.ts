/*
 * @Author: JeremyJone
 * @Date: 2021-09-09 15:50:52
 * @LastEditors: JeremyJone
 * @LastEditTime: 2023-06-12 09:14:48
 * @Description: 一条数据类
 */

import { Variables } from '@/constants/vars';
import { type MoveSliderInternalData } from '@/typings/data';
import { addIfNotExist, uuid } from '@/utils/common';
import { baseUnit, getMillisecondBy } from '@/utils/date';
import { cloneDeep, isEqual } from 'lodash';
import { XDate } from '../param/date';

export default class RowItem {
  /**
   * 当前数据唯一 ID
   */
  uuid: string = uuid(12);

  /**
   * 该数据在当前层级下的索引位置
   */
  index: number = 0;

  /**
   * 该数据在所有可展示的列表中的索引位置（渲染用）
   */
  flatIndex: number = 0;

  /**
   * 当前数据的父级路径集合
   */
  parentPath: number[] = [];

  /**
   * 父级节点
   */
  parentNode: RowItem | null = null;

  /**
   * 层级
   */
  level: number = 0;

  /**
   * 子节点
   */
  children: RowItem[] = [];

  /**
   * 数据属性
   */
  options: Required<DataOptions> = {
    isExpand: false,
    startLabel: Variables.default.startKey,
    endLabel: Variables.default.endKey,
    dataId: Variables.default.idKey
  };

  private __data: any;
  private __isExpand: boolean = false;
  private __isChecked: boolean = false;

  private __oldStart?: XDate = undefined;
  private __oldEnd?: XDate = undefined;

  /**
   * 原始数据
   */
  get data() {
    return this.__data;
  }

  /**
   * 是否展开
   */
  get isExpand() {
    return this.__isExpand;
  }

  /**
   * 是否选中
   */
  get isChecked() {
    return this.__isChecked;
  }

  /**
   * 获取当前数据是否应该隐藏
   */
  get hide() {
    if (!this.isExpand) return true;
    let parent = this.parentNode;
    while (parent) {
      if (!parent.isExpand) return true;
      parent = parent.parentNode;
    }
    return false;
  }

  /**
   * 起始时间
   */
  get start() {
    return new XDate(this.__data[this.options.startLabel]);
  }

  /**
   * 截止时间
   */
  get end() {
    return new XDate(this.__data[this.options.endLabel]);
  }

  /**
   * 数据 id（用户提供）
   */
  get id() {
    return this.__data[this.options.dataId];
  }

  /**
   * 进度
   */
  get progress(): number | undefined {
    if (this.children.length > 0) {
      let progress = 0;
      for (const child of this.children) {
        progress += child.progress ?? 0;
      }
      return progress / this.children.length;
    }

    return this.__data.progress ?? 0;
  }

  setProgress(v: number) {
    if (v < 0) this.__data.progress = 0;
    else if (v > 1) this.__data.progress = 1;
    else this.__data.progress = v;
  }

  /**
   * 初始化数据
   * @param data 源数据
   * @param options 数据属性参数
   */
  init(
    data: any,
    options: DataOptions,
    index: number,
    level: number,
    parentPath: number[],
    parentNode: RowItem | null
  ) {
    this.options = Object.assign(this.options, options);
    this.index = index;
    this.level = level;
    this.parentNode = parentNode;
    this.parentPath = [...parentPath];

    this.__isExpand = this.options.isExpand;
    this.__data = data;
  }

  /**
   * 判断一个数据对象是否与当前数据对象相等
   * @param obj 需要判断的对象
   * @returns 返回 true 表示相等，否则不等
   */
  isSame(obj: any) {
    return isEqual(obj, this.data);
  }

  /**
   * 复制当前数据
   * @returns 返回全新的数据
   */
  cloneData() {
    return cloneDeep(this.data);
  }

  /**
   * 设置展开/闭合数据
   * @param expand true 为展开，false 为闭合
   */
  setExpand(expand: boolean) {
    this.__isExpand = expand;
  }

  /**
   * 设置选中状态
   * @param checked true 为选中，false 为不选中
   * @param deep 是否递归设置子项
   */
  setChecked(checked: boolean, deep: boolean = false) {
    this.__isChecked = checked;
    if (deep) {
      if (this.children.length > 0) {
        for (const child of this.children) {
          child.setChecked(checked, deep);
        }
      }
    }
  }

  /**
   * 赋值起始日期，判断是否联动。如果联动，则先判断父节点，然后递归判断子节点
   * @param date 日期
   * @param unit 日期单位
   * @param linkage 是否联动
   */
  setStart(
    date: XDate,
    unit: HeaderDateUnit,
    linkage = false,
    modifyArr?: MoveSliderInternalData[]
  ) {
    this.__oldStart = new XDate(this.__data[this.options.startLabel]);
    this.__oldEnd = new XDate(this.__data[this.options.endLabel]);

    this.__data[this.options.startLabel] = date.date;

    // 首先判断起始日期不能大于结束日期
    if (
      date.compareTo(
        this.end.getOffset(-getMillisecondBy(baseUnit(unit), this.end.date))
      ) === 'r'
    ) {
      this.__data[this.options.endLabel] = date.getOffset(
        getMillisecondBy(baseUnit(unit), date.date)
      ).date;
    }

    if (!linkage) return;

    // 查看父节点
    let pNode = this.parentNode;
    while (pNode !== null) {
      if (this.start.compareTo(pNode.start) === 'l') {
        // 赋值应该给data的日期数据赋值
        pNode.setStart(this.start, unit);
        modifyArr &&
          addIfNotExist<MoveSliderInternalData>(
            modifyArr,
            {
              row: pNode,
              old: {
                start: pNode.__oldStart?.date ?? pNode.start.date,
                end: pNode.__oldEnd?.date ?? pNode.end.date
              }
            },
            item => item.row.uuid === pNode?.uuid
          );
      } else {
        break;
      }
      pNode = pNode.parentNode;
    }

    // 查看子节点
    this.__setChildrenDate(this, 'start', unit, modifyArr);
  }

  setEnd(
    date: XDate,
    unit: HeaderDateUnit,
    linkage = false,
    modifyArr?: MoveSliderInternalData[]
  ) {
    this.__oldStart = new XDate(this.__data[this.options.startLabel]);
    this.__oldEnd = new XDate(this.__data[this.options.endLabel]);

    this.__data[this.options.endLabel] = date.date;

    // 首先判断起始日期不能大于结束日期
    if (
      date.compareTo(
        this.start.getOffset(getMillisecondBy(baseUnit(unit), this.start.date))
      ) === 'l'
    ) {
      this.__data[this.options.startLabel] = date.getOffset(
        -getMillisecondBy(baseUnit(unit), date.date)
      ).date;
    }

    if (!linkage) return;

    let pNode = this.parentNode;
    while (pNode !== null) {
      if (this.end.compareTo(pNode.end) === 'r') {
        pNode.setEnd(this.end, unit);
        modifyArr &&
          addIfNotExist<MoveSliderInternalData>(
            modifyArr,
            {
              row: pNode,
              old: {
                start: pNode.__oldStart?.date ?? pNode.start.date,
                end: pNode.__oldEnd?.date ?? pNode.end.date
              }
            },
            item => item.row.uuid === pNode?.uuid
          );
      } else {
        break;
      }
      pNode = pNode.parentNode;
    }

    // 查看子节点
    this.__setChildrenDate(this, 'end', unit, modifyArr);
  }

  /**
   * 逻辑上不需要子集联动。因为本身子集就不应该超过父级，这在创建内容时就应该避免。
   * 而且这里子集联动，会导致大量计算，如果数据很多，容易卡顿。
   * 并且，如果是分页，或者其他情况下数据不全，联动就没有意义。
   */
  private __setChildrenDate(
    node: RowItem,
    key: 'start' | 'end',
    unit: HeaderDateUnit,
    modifyArr?: MoveSliderInternalData[]
  ) {
    for (let i = 0; i < node.children.length; i++) {
      const c = node.children[i];
      if (key === 'start') {
        if (c.start.compareTo(node.start) === 'l') {
          c.setStart(node.start, unit);
          modifyArr &&
            addIfNotExist<MoveSliderInternalData>(
              modifyArr,
              {
                row: c,
                old: {
                  start: c.__oldStart?.date ?? c.start.date,
                  end: c.__oldEnd?.date ?? c.end.date
                }
              },
              i => i.row.uuid === c.uuid
            );
          this.__setChildrenDate(c, key, unit, modifyArr);
        }
      } else if (key === 'end') {
        if (c.end.compareTo(node.end) === 'r') {
          c.setEnd(node.end, unit);
          modifyArr &&
            addIfNotExist<MoveSliderInternalData>(
              modifyArr,
              {
                row: c,
                old: {
                  start: c.__oldStart?.date ?? c.start.date,
                  end: c.__oldEnd?.date ?? c.end.date
                }
              },
              i => i.row.uuid === c.uuid
            );
          this.__setChildrenDate(c, key, unit, modifyArr);
        }
      }
    }
  }

  /**
   * 获取子项的展平状态
   */
  getFlattenChildren(): RowItem[] {
    const arr: RowItem[] = [];
    this.__getFlattenChildren(arr);
    arr.shift(); // 添加的第一个是自己，所以去掉
    return arr;
  }

  private __getFlattenChildren(arr: RowItem[]) {
    arr.push(this);
    if (this.children.length > 0) {
      for (const child of this.children) {
        child.__getFlattenChildren(arr);
      }
    }
  }

  /**
   * 查找一个对象是否包含在当前对象的子集中
   */
  include(row?: RowItem | null): boolean {
    if (!row) return false;

    if (this.children.length > 0) {
      for (const child of this.children) {
        if (child.uuid === row.uuid) {
          return true;
        }
        if (child.include(row)) {
          return true;
        }
      }
    }
    return false;
  }
}
