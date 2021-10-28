/*
 * @Author: JeremyJone
 * @Date: 2021-09-09 15:50:52
 * @LastEditors: JeremyJone
 * @LastEditTime: 2021-10-27 17:49:36
 * @Description: 一条数据类
 */

import { Variables } from "@/constants/vars";
import { HeaderDateUnit } from "@/typings/ParamOptions";
import { uuid } from "@/utils/common";
import {
  compareDate,
  createDate,
  getDateOffset,
  getMillisecond
} from "@/utils/date";
import { isArray, isDeepEqual, isObject } from "@/utils/is";

export class Row {
  /**
   * 当前数据唯一 ID
   */
  readonly uuid: string;

  /**
   * 该数据索引位置
   */
  index: number;

  /**
   * 当前数据的父级路径集合
   */
  parentId: number[];

  /**
   * 父级节点
   */
  parentNode: Row | null;

  /**
   * 层级
   */
  level: number;

  /**
   * 子节点
   */
  children: Row[];

  /**
   * 数据属性
   */
  options: DataOptions & { sl?: string; el?: string };

  /**
   * 该数据在展开状态下的索引位置，仅用于渲染
   */
  __uindex: number;

  private __data: any;
  private __isExpand: boolean;
  // private __start: Date | null;
  // private __end: Date | null;

  constructor() {
    this.uuid = uuid(12);
    this.__data = null;
    this.index = 0;
    this.parentId = [];
    this.parentNode = null;
    this.level = 0;
    this.__isExpand = true;
    // this.__start = null;
    // this.__end = null;
    this.children = [];
    this.options = {};

    this.__uindex = 0;
  }

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
   * 起始时间
   */
  get start() {
    return createDate(this.__data[this.options["sl"] as string]);
  }

  /**
   * 截止时间
   */
  get end() {
    return createDate(this.__data[this.options["el"] as string]);
  }

  /**
   * 初始化数据
   * @param data 源数据
   * @param options 数据属性参数
   */
  initData(data: any, options: DataOptions) {
    const sl = options.startLabel || Variables.key.start;
    const el = options.endLabel || Variables.key.end;

    Object.assign(this.options, { sl, el });
    this.__isExpand = this.options.isExpand || true;

    // const that = this;
    // this.__data = new Proxy(data, {
    //   get: function (obj, prop) {
    //     that.proxy(obj);
    //     return obj[prop];
    //   },
    //   set: function (obj, prop, value, receiver) {
    //     if (obj[prop] != value) {
    //       obj[prop] = value;
    //     }
    //     return Reflect.set(obj, prop, value, receiver);
    //   }
    // });

    // this.proxy(this.data);

    // vue3 数据使用 toRefs 解析，自带 Proxy，不再需要上面的代理设置
    this.__data = data;
  }

  // 代理响应起止日期
  // proxy(obj: any) {
  //   this.__start = createDate(obj[this.options["sl"] as string]);
  //   this.__end = createDate(obj[this.options["el"] as string]);
  // }

  /**
   * 判断一个数据对象是否与当前数据对象相等
   * @param obj 需要判断的对象
   * @returns 返回 true 表示相等，否则不等
   */
  isSame(obj: any) {
    return isDeepEqual(obj, this.data);
  }

  /**
   * 复制当前数据
   * @returns 返回全新的数据
   */
  cloneData() {
    return this._clone(this.data);
  }

  _clone(data: any) {
    if (!isObject(data)) {
      return data;
    } else {
      const d = isArray(data) ? [] : ({} as any);
      for (const i in data) {
        d[i] = isObject(data[i]) ? this._clone(data[i]) : data[i];
      }
      return d;
    }
  }

  /**
   * 设置展开/闭合数据
   * @param expand true 为展开，false 为闭合
   */
  setExpand(expand: boolean) {
    this.__isExpand = expand;
  }

  /**
   * 赋值起始日期，判断是否联动。如果联动，则先判断父节点，然后递归判断子节点
   * @param date 日期
   * @param linkage 联动
   */
  setStart(date: Date, unit: HeaderDateUnit, linkage = false) {
    this.data[this.options["sl"] as string] = date;

    // 首先判断起始日期不能大于结束日期
    if (
      compareDate(
        date,
        getDateOffset(this.end as Date, -getMillisecond(unit))
      ) === "r"
    )
      this.data[this.options["el"] as string] = getDateOffset(
        date,
        getMillisecond(unit)
      );

    if (!linkage) return;

    // 查看父节点
    let pNode = this.parentNode;
    while (pNode !== null) {
      if (compareDate(this.start as Date, pNode.start as Date) === "l") {
        // 赋值应该给data的日期数据赋值
        pNode.setStart(this.start as Date, unit);
      } else {
        break;
      }
      pNode = pNode.parentNode;
    }

    // 查看子节点
    this.__setChildrenDate(this, "start", unit);
  }

  setEnd(date: Date, unit: HeaderDateUnit, linkage = false) {
    this.data[this.options["el"] as string] = date;

    // 首先判断起始日期不能大于结束日期
    if (
      compareDate(
        date,
        getDateOffset(this.start as Date, getMillisecond(unit))
      ) === "l"
    )
      this.data[this.options["sl"] as string] = getDateOffset(
        date,
        -getMillisecond(unit)
      );

    if (!linkage) return;

    let pNode = this.parentNode;
    while (pNode !== null) {
      if (compareDate(this.end as Date, pNode.end as Date) === "r") {
        pNode.setEnd(this.end as Date, unit);
      } else {
        break;
      }
      pNode = pNode.parentNode;
    }

    // 查看子节点
    this.__setChildrenDate(this, "end", unit);
  }

  private __setChildrenDate(
    node: Row,
    key: "start" | "end",
    unit: HeaderDateUnit
  ) {
    for (let i = 0; i < node.children.length; i++) {
      const c = node.children[i];
      if (key === "start") {
        if (compareDate(c.start as Date, node.start as Date) === "l") {
          c.setStart(node.start as Date, unit);
          this.__setChildrenDate(c, key, unit);
        }
      } else if (key === "end") {
        if (compareDate(c.end as Date, node.end as Date) === "r") {
          c.setEnd(node.end as Date, unit);
          this.__setChildrenDate(c, key, unit);
        }
      }
    }
  }
}
