/* eslint-disable no-underscore-dangle */
/*
 * @Author: JeremyJone
 * @Date: 2021-09-09 16:20:01
 * @LastEditors: JeremyJone
 * @LastEditTime: 2021-12-23 10:16:56
 * @Description: 整个表格的数据类
 */

import { compareDate } from '@/utils/date';
import { isArray, isDate } from '@/utils/is';
import { Row } from './row';

interface RowOperateOptions {
  index: number;
  uuid?: undefined | string;
}

// 全局唯一 id
let UID = 0;

/**
 * 整个gantt项目的数据结构，整理外部的数据
 */
export class GanttData {
  /**
   * 数据集合，内部使用
   */
  data: Row[];

  /**
   * 源数据集合
   */
  originData: any[];

  private __start: Date | null;

  private __end: Date | null;

  private __hierarchy: number;

  private __selected: RowOperateOptions;

  private __hovered: RowOperateOptions;

  private __len: number;

  private readonly __that: GanttData;

  constructor() {
    this.data = [];
    this.originData = [];
    this.__start = null;
    this.__end = null;
    this.__hierarchy = 0;

    // 渲染
    this.__selected = { index: -1 };
    this.__hovered = { index: -1 };

    this.__len = 0;
    this.__that = this;
  }

  /**
   * 初始化数据
   * @param data 源数据集合
   * @param options 数据属性参数
   */
  initData(data: any[], options: DataOptions = {}) {
    this.originData = data;
    this.data = this.__createDataTree(data, [], options);
    // 初始化长度
    this.__len = this.data.length;
  }

  /**
   * 获取数据的展示长度。可通过该属性计算wrap的完整高度
   */
  get len() {
    return this.__len;
  }

  /**
   * 获取选中的信息
   */
  get selected() {
    return this.__selected;
  }

  /**
   * 获取鼠标悬停的信息
   */
  get hovered() {
    return this.__hovered;
  }

  /**
   * 获取数据集合的最起始时间
   */
  get start() {
    return this.__start;
  }

  /**
   * 设置一个起始时间
   * @param v
   */
  setStart(v?: Date | null) {
    if (v && isDate(v)) this.__start = v;
    else this.__start = null;
  }

  /**
   * 获取数据集合的最截止时间
   */
  get end() {
    return this.__end;
  }

  /**
   * 设置一个截止时间
   * @param v
   */
  setEnd(v?: Date | null) {
    if (v && isDate(v)) this.__end = v;
    else this.__end = null;
  }

  private __createDataTree(
    data: any[],
    parentId: number[],
    options: DataOptions = {},
    level = 0,
    parentNode: Row | null = null
  ) {
    const r = [];
    for (let i = 0; i < data.length; i++) {
      r.push(
        this.__createDataNode(data[i], i, parentId, level, parentNode, options)
      );
    }

    return r;
  }

  private __createDataNode(
    data: any,
    index: number,
    parentId: number[],
    level: number,
    parentNode: Row | null,
    options: DataOptions
  ) {
    const item = new Row();
    item.initData(data, options);
    item.index = index;
    item.level = level;
    item.parentId = parentId;
    item.parentNode = parentNode;

    // 取最大最小值
    this.__updateDate(item);

    const p = [...parentId];
    p.push(index);
    if (isArray(data.children)) {
      item.children = this.__createDataTree(
        data.children,
        p,
        options,
        level + 1,
        item
      );
    }

    // 计算数据结构的层级数量
    if (level > this.__hierarchy) this.__hierarchy = level;

    return item;
  }

  /**
   * 更新起止时间
   */
  private __updateDate(item: Row) {
    if (!this.start || compareDate(item.start as Date, this.start) === 'l') {
      this.__start = item.start;
    }

    if (!this.end || compareDate(item.end as Date, this.end) === 'r') {
      this.__end = item.end;
    }
  }

  /**
   * 更新数据
   * @param newData 新的数据集合
   * @param item 选中的内容，如果存在，将在更新数据后选中该内容
   * @param options 数据属性参数
   * @returns
   */
  update(newData: any[], item: Row | null = null, options: DataOptions = {}) {
    this.__diff(options, this.data, newData);

    // 更新选择条
    if (!item) return;
    const t = this.flatData.find(x => x.uuid === item.uuid);
    this.__selected = { index: t?.__uindex ?? -1, uuid: t?.uuid ?? undefined };
  }

  /**
   * 更新算法
   * @param options 数据属性参数
   * @param originData 原数据
   * @param newData 新数据
   * @param parentNode 父节点
   */
  private __diff(
    options: DataOptions,
    originData: Row[],
    newData: any[],
    parentNode: Row | null = null
  ) {
    let i = 0;
    while (i < newData.length) {
      if (i < originData.length && !originData[i].isSame(newData[i])) {
        if (i + 1 < originData.length && originData[i + 1].isSame(newData[i])) {
          // 删除一个
          originData.splice(i, 1);
        } else if (
          i + 1 < newData.length &&
          originData[i].isSame(newData[i + 1])
        ) {
          // 插入一个
          const item = this.__createDataNode(
            newData[i],
            i,
            originData[i].parentId,
            originData[i].level,
            originData[i].parentNode,
            options
          );
          originData.splice(i, 0, item);
        } else {
          const item = this.__createDataNode(
            newData[i],
            i,
            originData[i].parentId,
            originData[i].level,
            originData[i].parentNode,
            options
          );
          originData.splice(i, 1, item);
        }
      }

      // 新节点超出了原有节点，直接创建新的节点即可
      if (originData[i] === undefined) {
        const item = this.__createDataNode(
          newData[i],
          i,
          parentNode ? [...parentNode.parentId, parentNode.index] : [],
          parentNode ? parentNode.level + 1 : 0,
          parentNode,
          options
        );
        originData.splice(i, 1, item);
      }

      this.__diff(
        options,
        originData[i].children,
        newData[i].children,
        originData[i]
      );

      // 更新日期
      // ***** 说明 *****
      // Vue3 使用了代理机制，Row 内部不再使用 Proxy自行代理。
      // 这就导致外部数据变化时内部自动变化，不会触发上面 diff 算法，起止日期就不会响应。
      // 这里手动更新一下就可以了
      this.__updateDate(originData[i]);

      i += 1;
    }

    // 如果循环完成，旧数据后面还有，则全部删除
    if (originData[i]) {
      originData.splice(i, originData.length);
    }
  }

  /**
   * 设置指定数据为选中内容
   * @param data 要选中的数据
   */
  setSelectedByData(data: Row) {
    const fn = (d: Row[]) => {
      if (isArray(d)) {
        for (let i = 0; i < d.length; i++) {
          if (d[i].isSame(data)) {
            this.__selected = { index: d[i].__uindex, uuid: d[i].uuid };
            break;
          } else if (d[i].children) {
            fn(d[i].children);
          }
        }
      }
    };

    fn(this.data);
  }

  /**
   * 设置悬停项
   * @param options
   */
  setHovered(options: RowOperateOptions) {
    this.__hovered = options;
  }

  /**
   * 设置选中项
   * @param options
   */
  setSelected(options: RowOperateOptions) {
    this.__selected = options;
  }

  /**
   * 获取整个数据集合的层级规模
   */
  get hierarchy() {
    // 获取时从0开始计算，所以返回时主动 +1
    return this.__hierarchy + 1;
  }

  /**
   * 获取数据的展平列表
   */
  get flatData(): Row[] {
    UID = 0;
    const arr: Row[] = [];
    this.__flatten(this.data, arr);
    this.__len = arr.length;
    return arr;
  }

  private __flatten(data: Row[], arr: Row[]) {
    for (let i = 0; i < data.length; i++) {
      // eslint-disable-next-line no-param-reassign
      data[i].__uindex = UID;
      UID += 1;
      arr.push(data[i]);

      if (data[i].isExpand && isArray(data[i].children)) {
        this.__flatten(data[i].children, arr);
      }
    }
  }
}

export default GanttData;
