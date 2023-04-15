import { isArray } from 'lodash';
import { type VNode } from 'vue';

class TableColumn {
  node: VNode;
  /**
   * 非叶子结点只接收 label 参数作为标题
   */
  label: string;
  children?: TableColumn[];
  parent?: TableColumn;
  level: number;
  colSpan: number;
  rowSpan: number;

  /**
   *
   */
  constructor(node: VNode, parent?: TableColumn) {
    this.node = node;
    this.label = node.props?.label ?? '';
    this.parent = parent;
    this.level = 1;
    this.colSpan = 1;
    this.rowSpan = 1;
  }
}

class TableHeader {
  columns: TableColumn[] = [];
  leafs: TableColumn[] = [];

  /**
   * 表头渲染使用
   */
  headers: TableColumn[][] = [];

  /**
   * 添加表头
   */
  setColumn(v: VNode) {
    // 如果是 column，需要放进 headers 中。并且需要判断是不是有子项（多级表头使用）
    this.columns.push(new TableColumn(v));
  }

  /**
   * 添加子表头
   */
  setSubColumn(node: VNode, parent: TableColumn): TableColumn {
    const newItem = new TableColumn(node, parent);
    if (isArray(parent.children)) {
      parent.children?.push(newItem);
    } else {
      parent.children = [newItem];
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
   * This function idea from https://github.com/elemefe/element
   * 将 columns 内容转换为行的内容，这样才能循环渲染多级表头
   */
  private convertToRows(columns: TableColumn[]) {
    let maxLevel = 1;

    const traverse = (column: TableColumn, parent?: TableColumn) => {
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

    columns.forEach(column => {
      column.level = 1;
      traverse(column);
    });

    const rows: TableColumn[][] = [];
    for (let i = 0; i < maxLevel; i++) {
      rows.push([]);
    }

    const allColumns = this.getAllColumns(columns);

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

  /**
   * This function idea from https://github.com/elemefe/element
   */
  private getAllColumns(columns: TableColumn[]) {
    const result: TableColumn[] = [];
    columns.forEach(column => {
      if (column.children) {
        result.push(column);
        result.push.apply(result, this.getAllColumns(column.children));
      } else {
        // 非叶子结点只接收 label 参数作为展示。叶子结点还可以展示 prop 参数值
        if (!column.label) column.label = column.node.props?.prop ?? '';

        result.push(column);
        this.leafs.push(column);
      }
    });
    return result;
  }
}

export { TableHeader };
