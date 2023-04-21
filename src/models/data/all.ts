import { isArray } from 'lodash';
import { type XDate } from '../param/date';
import RowItem from './row';

export default class AllData {
  /**
   * 数据索引生成
   */
  UID = 0;

  /**
   * 原始数据集合
   */
  originData: any[] = [];

  /**
   * 内部使用代理数据
   */
  data: RowItem[] = [];

  /**
   * 展平后的代理数据，渲染用
   */
  flatData: RowItem[] = [];

  /**
   * 整体最开始的日期
   */
  start?: XDate;

  /**
   * 整体最末尾的日期
   */
  end?: XDate;

  /**
   * 整体数据结构的层级数量
   */
  __level: number = 0;

  /**
   * 整体数据结构的层级数量
   */
  get level() {
    // 层级从 0 计算，返回时 + 1
    return this.__level + 1;
  }

  /**
   * 数据的长度（包含子级时，为展平长度）
   */
  get length() {
    return this.flatData.length;
  }

  /**
   * 初始化数据
   */
  init(data: any[], options: DataOptions = {}) {
    this.originData = data;
    this.data = this.createData(data, [], options);
    this.__flatten();
  }

  /**
   * 创建结构化代理数据
   * @param data 原始数据
   * @param parentPath 父级路径
   * @param options 属性
   * @param level 层级
   * @param parentNode 父节点
   * @returns
   */
  private createData(
    data: any[],
    parentPath: number[],
    options: DataOptions,
    level = 0,
    parentNode: RowItem | null = null
  ) {
    const r = [];
    for (let i = 0; i < data.length; i++) {
      r.push(
        this.__createRow(data[i], i, parentPath, level, parentNode, options)
      );
    }

    return r;
  }

  /**
   * 创建每一行的结构化代理数据
   * @param item 原始数据
   * @param index 当前层级索引
   * @param parentPath 父级路径
   * @param level 层级
   * @param parentNode 父节点
   * @param options 属性
   * @returns
   */
  private __createRow(
    item: any,
    index: number,
    parentPath: number[],
    level: number,
    parentNode: RowItem | null,
    options: DataOptions
  ) {
    const row = new RowItem();
    row.init(item, options, index, level, parentPath, parentNode);

    // 更新两头的日期
    this.__updateDate(row);

    // 拼接路径
    const p = [...parentPath, index];
    if (isArray(item.children) && item.children.length > 0) {
      row.children = this.createData(item.children, p, options, level + 1, row);
    }

    // 计算层级数量
    this.__level = Math.max(this.__level, level);

    return row;
  }

  /**
   * 更新平铺数据
   */
  updateFlatData() {
    this.__flatten();
  }

  /**
   * 更新数据
   * @param data 新数据（原始）
   * @param options 属性
   */
  update(data: any[], options: DataOptions = {}) {
    this.__diff(this.data, data, options);
    this.__flatten();
  }

  /**
   * 更新数据算法
   * @param data 现有的结构化代理数据
   * @param news 新数据
   * @param options 属性
   * @param parentNode 父节点
   */
  private __diff(
    data: RowItem[],
    news: any[],
    options: DataOptions = {},
    parentNode: RowItem | null = null
  ) {
    let i = 0;
    while (i < news.length) {
      if (i < data.length && !data[i].isSame(news[i])) {
        if (i + 1 < data.length && data[i + 1].isSame(news[i])) {
          // 删除一个
          data.splice(i, 1);
        } else {
          const row = this.__createRow(
            news[i],
            i,
            data[i].parentPath,
            data[i].level,
            data[i].parentNode,
            options
          );

          if (i + 1 < news.length && data[i].isSame(news[i + 1])) {
            // 插入一个
            data.splice(i, 0, row);
          } else {
            // 替换当前
            data.splice(i, 1, row);
          }
        }
      }

      // 新节点超出了原有节点，直接创建新节点
      if (data[i] === undefined) {
        const row = this.__createRow(
          news[i],
          i,
          parentNode ? [...parentNode.parentPath, parentNode.index] : [],
          parentNode ? parentNode.level + 1 : 0,
          parentNode,
          options
        );
        data.splice(i, 1, row);
      }

      // 递归子层
      if (news[i].children) {
        this.__diff(data[i].children, news[i].children, options, data[i]);
      }

      // 更新两头的日期
      this.__updateDate(data[i]);

      i++;
    }

    // 如果循环完成，后面还有旧数据，全部删除即可
    if (data[i]) {
      data.splice(i, data.length);
    }
  }

  /**
   * 更新起止时间
   */
  private __updateDate(row: RowItem) {
    if (!this.start || row.start.compareTo(this.start) === 'l') {
      this.start = row.start;
    }

    if (!this.end || row.end.compareTo(this.end) === 'r') {
      this.end = row.end;
    }
  }

  private __flatten() {
    this.flatData = [];
    let index = 0;

    const fn = (data: RowItem[]) => {
      for (let i = 0; i < data.length; i++) {
        data[i].flatIndex = index++;
        this.flatData.push(data[i]);

        if (data[i].isExpand && isArray(data[i].children)) {
          fn(data[i].children);
        }
      }
    };

    fn(this.data);
  }
}
