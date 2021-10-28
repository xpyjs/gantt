import { Errors } from "@/constants/errors";
import { Variables } from "@/constants/vars";
import {
  GanttColumnSize,
  HeaderDateOptions,
  HeaderDateUnit,
  ParamOptions
} from "@/typings/ParamOptions";
import { parseNumber } from "@/utils/common";
import { dateList } from "@/utils/date";
import { isArray } from "@/utils/is";
import { merge } from "lodash";
import { VNode, Component } from "vue";
import { ColumnNode } from "./columnNode";
import { TableHeader } from "./header";

class DefaultOptions {
  // colWidth: number;
  colSize: GanttColumnSize;
  rowHeight: number;

  constructor() {
    // this.colWidth = Variables.size.minGanttColumnWidth;
    this.colSize = "normal";
    this.rowHeight = Variables.size.defaultContentRowHeight;
  }
}

export class ParamData {
  private __cns: ColumnNode[];
  private __sn: VNode | null;
  private __ths: TableHeader[];
  private __ghs: { length: number; list: HeaderDateOptions[] };
  private __cbw: number;
  private __rh: number;
  private __hh: number;
  private __gos: ParamOptions;
  private __slots: any;
  private __start: Date;
  private __end: Date;
  private __default: DefaultOptions;
  private __hu: HeaderDateUnit = "day";

  /**
   * 层级颜色，循环展示
   */
  levelColor: string[];

  /**
   * 展开宽度。（每层缩进宽度）
   */
  expandWidth: number;

  /**
   * 是否显示选择框
   */
  showCheckbox: boolean;

  /**
   * 是否可以展开
   */
  showExpand: boolean;

  /**
   * 是否深色模式
   */
  dark: boolean;

  constructor() {
    this.__cns = [];
    this.__sn = null;
    this.__ths = [];
    this.__ghs = { length: 0, list: [] };
    this.__cbw = 15;
    this.__rh = Variables.size.defaultContentRowHeight;
    this.__hh = Variables.size.defaultHeaderHeight;
    this.levelColor = [];
    this.expandWidth = 15;
    this.showCheckbox = false;
    this.showExpand = false;
    this.dark = false;
    this.__slots = Object;
    this.__start = new Date();
    this.__end = new Date();
    this.__default = new DefaultOptions();

    // 默认值
    this.__gos = {
      // columnWidth: Variables.size.minGanttColumnWidth,
      columnSize: "normal",
      showToday: true,
      showWeekend: true,
      header: {},
      body: {
        todayColor: "",
        weekendColor: "",
        hoverColor: "",
        selectColor: ""
      }
    };
  }

  init(options: DefaultOptions) {
    this.__default = options;
  }

  /**
   * 获取表格列节点
   */
  get colNodes() {
    return this.__cns;
  }

  /**
   * 获取滑块节点
   */
  get sliderNode() {
    return this.__sn;
  }

  /**
   * 获取表格表头内容
   */
  get tableHeaders() {
    return this.__ths;
  }

  /**
   * 获取甘特表头内容
   */
  get ganttHeaders() {
    return this.__ghs;
  }

  /**
   * 获取甘特属性参数
   */
  get ganttOptions() {
    return this.__gos;
  }

  /**
   * 获取选择框的宽度
   */
  get checkBoxWidth() {
    return this.__cbw + 10;
  }

  /**
   * 设置选择框的宽度
   */
  set checkBoxWidth(w) {
    this.__cbw = w;
  }

  /**
   * 获取行高
   */
  get rowHeight() {
    return this.__rh;
  }

  /**
   * 设置行高
   */
  set rowHeight(h) {
    if (h < Variables.size.minContentRowHeight) {
      console.error(
        Errors.header,
        Errors.invalidProps,
        `rowHeight should be at least ${Variables.size.minContentRowHeight}.`
      );
    } else {
      this.__rh = h;
    }
  }

  /**
   * 获取表头高度
   */
  get headerHeight() {
    return parseNumber(this.__hh);
  }

  /**
   * 设置表头高度
   */
  set headerHeight(h) {
    if (h < Variables.size.minHeaderHeight) {
      console.error(
        Errors.header,
        Errors.invalidProps,
        `headerHeight should be at least ${Variables.size.minHeaderHeight}.`
      );
    } else {
      this.__hh = h;
    }
  }

  /**
   * 获取表头起始日期
   */
  get startDate() {
    return this.__start;
  }

  /**
   * 获取表头截止日期
   */
  get endDate() {
    return this.__end;
  }

  /**
   * 获取表头的显示单位，用于切换
   */
  get headerUnit() {
    return this.__hu;
  }

  /**
   * 设置表头的显示单位
   */
  set headerUnit(unit: HeaderDateUnit) {
    this.__hu = unit;

    this.updateGanttHeaders();
  }

  /**
   * 设置甘特属性参数，自动与当前的参数合并
   * @param opt
   */
  setGanttOptions(opt: ParamOptions) {
    merge(this.ganttOptions, opt);
  }

  /**
   * 设置甘特表头的内容
   * @param start 起始日期
   * @param end 截止日期
   */
  setGanttHeaders(start: Date | number | string, end: Date | number | string) {
    // const list = dateList(start, end, this.__hu);
    // this.ganttHeaders.list = list;
    // this.ganttHeaders.length = list.reduce(
    //   (pre, cur) => cur.one.length + pre,
    //   0
    // );

    this.__start = new Date(start);
    this.__end = new Date(end);

    this.updateGanttHeaders();
  }

  updateGanttHeaders() {
    const list = dateList(this.__start, this.__end, this.__hu);
    this.ganttHeaders.list = list;
    this.ganttHeaders.length = list.reduce(
      // (pre, cur) => cur.one.length + pre,
      (pre, cur) => cur.one.reduce((p, c) => c.len + p, 0) + pre,
      0
    );
  }

  private __addCNode(data: ColumnNode) {
    this.colNodes.push(data);
  }

  private __addTHeader(data: TableHeader) {
    this.tableHeaders.push(data);
  }

  private __checkType(type: string, target: string) {
    return (
      type.replace(/-/g, "").toLocaleLowerCase() === target.toLocaleLowerCase()
    );
  }

  private __isComponent(v: any): v is Component {
    return !!v.type?.name && !!v.type?.setup;
  }

  /**
   * 拦截所有插槽内容节点，处理后统一使用。
   * @param nodes
   * @returns
   */
  setNodes(nodes: VNode[] | null) {
    if (!isArray(nodes)) return;

    let colVNodeKey = 0;

    // 拦截所有插槽，做一下筛选和处理。保留指定插槽
    (nodes as VNode[])
      .filter(v => {
        const type = (v.type as Component)?.name;

        return (
          // 接收自定义组件，不接受原生元素
          type &&
          this.__isComponent(v) &&
          // 接受 JGanttColumn 插槽，并且该插槽需要携带 label 属性
          ((this.__checkType(type, Variables.name.column) &&
            !!v.props?.label) ||
            // 或者接受一个 JGanttSlider 组件。多个 JGanttSlider 保留最后一个
            this.__checkType(type, Variables.name.slider))
        );
      })
      .forEach(v => {
        const type = (v.type as Component).name as string;

        // 分别对不同组件进行整理
        if (this.__checkType(type, Variables.name.column)) {
          // 添加唯一 key
          v.key = colVNodeKey;
          Object.assign(v.props, { __key: colVNodeKey });

          const label: string = v.props?.label;
          const width = parseNumber(
            v.props?.width,
            Variables.size.defaultTableColumnWidth
          );

          // 添加 merge 方法，忽略第一行
          let merge = v.props?.merge;
          if (v.key === 0) merge = undefined;

          this.__addTHeader(
            new TableHeader().initData({
              key: colVNodeKey,
              label,
              text: v.props?.name || label,
              width
            })
          );

          this.__addCNode(
            new ColumnNode().initData({
              key: colVNodeKey++,
              label,
              node: v,
              merge
            })
          );
        } else if (this.__checkType(type, Variables.name.slider)) {
          this.__sn = v;
        }
      });
  }

  addSlot(name: string, slot: any) {
    this.__slots[name] = slot;
  }

  getSlot(name: string) {
    return this.__slots[name];
  }

  /**
   * 重置甘特图的行高和列宽
   */
  resetSize() {
    this.setGanttOptions({
      [Variables.key.columnSize]: this.__default.colSize
    });
    this.rowHeight = parseNumber(this.__default.rowHeight);
  }
}
