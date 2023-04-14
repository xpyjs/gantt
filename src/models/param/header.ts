import { isArray } from 'lodash';
import { type VNode } from 'vue';

class Column {
  node: VNode;
  children?: Column[];
  parent?: Column;
  level: number;
  colSpan: number;
  rowSpan: number;

  /**
   *
   */
  constructor(node: VNode, parent?: Column) {
    this.node = node;
    this.parent = parent;
    this.level = 1;
    this.colSpan = 1;
    this.rowSpan = 1;
  }
}

export default class Header {
  columns: Column[] = [];
  leafs: Column[] = [];

  /**
   * 表头渲染使用
   */
  headers: Column[][] = [];

  setColumns(v: VNode) {
    // 如果是 column，需要放进 headers 中。并且需要判断是不是有子项（多级表头使用）
    this.columns.push(new Column(v));
  }

  setSubColumns(node: VNode, column: Column): Column {
    const newItem = new Column(node, column);
    if (isArray(column.children)) {
      column.children?.push(newItem);
    } else {
      column.children = [newItem];
    }

    return newItem;
  }

  /**
   * 当注入完数据，需要生成所需的内容
   */
  generate() {
    this.headers = this.convertToRows(this.columns);
  }

  /**
   * 将 columns 内容转换为行的内容，这样才能循环渲染多级表头
   */
  private convertToRows(originColumns: Column[]) {
    let maxLevel = 1;
    const traverse = (column: Column, parent?: Column) => {
      if (parent) {
        column.level = parent.level + 1;
        if (maxLevel < column.level) {
          maxLevel = column.level;
        }
      }
      if (column.children) {
        let colSpan = 0;
        column.children.forEach(subColumn => {
          traverse(subColumn, column);
          colSpan += subColumn.colSpan;
        });
        column.colSpan = colSpan;
      } else {
        column.colSpan = 1;
      }
    };

    originColumns.forEach(column => {
      column.level = 1;
      traverse(column);
    });

    const rows: Column[][] = [];
    for (let i = 0; i < maxLevel; i++) {
      rows.push([]);
    }

    const allColumns = this.getAllColumns(originColumns);

    allColumns.forEach(column => {
      if (!column.children) {
        column.rowSpan = maxLevel - column.level + 1;
      } else {
        column.rowSpan = 1;
      }
      rows[column.level - 1].push(column);
    });

    return rows;
  }

  private getAllColumns(columns: Column[]) {
    const result: Column[] = [];
    columns.forEach(column => {
      if (column.children) {
        result.push(column);
        result.push.apply(result, this.getAllColumns(column.children));
      } else {
        result.push(column);
        this.leafs.push(column);
      }
    });
    return result;
  }
}
