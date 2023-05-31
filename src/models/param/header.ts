import { XDate } from './date';
import { isArray } from 'lodash';
import { type VNode } from 'vue';
import Variables from '@/constants/vars';
import { baseUnit, getMillisecondBy } from '@/utils/date';
import { uuid } from '@/utils/common';

class Column {
  children?: Column[];
  level: number;
  colSpan: number;
  rowSpan: number;

  /**
   *
   */
  constructor() {
    this.level = 1;
    this.colSpan = 1;
    this.rowSpan = 1;
  }
}

class TableColumn extends Column {
  node: VNode;
  /**
   * 非叶子结点只接收 label 参数作为标题
   */
  label: string;
  declare children?: TableColumn[];
  parent?: TableColumn;
  width: number = Variables.default.tableColumnWidth;
  isLast: boolean = false;

  /**
   *
   */
  constructor(node: VNode, parent?: TableColumn) {
    super();

    this.node = node;
    this.label = node.props?.label ?? '';
    this.parent = parent;
  }
}

class GanttColumn extends Column {
  declare children?: GanttColumn[];
  date: XDate;
  label: string;
  uuid: string = uuid();

  constructor(date: XDate, unit: DateUnit) {
    super();

    this.date = date;

    // this.label = this.date.getBy(unit).toString();
    switch (unit) {
      case 'month':
        this.label = this.date.toMonth();
        break;
      case 'week':
        this.label = this.date.toWeek();
        break;
      default:
        this.label = this.date.getBy(unit).toString();
    }
  }
}

class Header {
  /**
   * This function idea from https://github.com/elemefe/element
   * 将 columns 内容转换为行的内容，这样才能循环渲染多级表头
   */
  protected convertToRows<T extends Column>(columns: T[], allColumns: T[]) {
    let maxLevel = 1;

    const traverse = (column: T, parent?: T) => {
      if (parent) {
        column.level = parent.level + 1;
        if (maxLevel < column.level) {
          maxLevel = column.level;
        }
      }

      if (column.children) {
        let colSpan = 0;
        column.children.forEach(subColumn => {
          traverse(subColumn as T, column);
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

    const rows: T[][] = [];
    for (let i = 0; i < maxLevel; i++) {
      rows.push([]);
    }

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
}

class TableHeader extends Header {
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
    this.headers = this.convertToRows(
      this.columns,
      this.getAllColumns(this.columns)
    );
  }

  /**
   * This function idea from https://github.com/elemefe/element
   */
  private getAllColumns(columns: TableColumn[], isLast?: boolean) {
    const result: TableColumn[] = [];
    columns.forEach((column, index) => {
      if (index === columns.length - 1) {
        if (isLast === undefined || isLast) {
          column.isLast = true;
        }
      }

      if (column.children) {
        result.push(column);
        result.push.apply(
          result,
          this.getAllColumns(column.children, !!column.isLast)
        );
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

class GanttHeader extends Header {
  /**
   * 表头渲染使用
   */
  headers: GanttColumn[][] = [];

  /**
   * 完整的表头日期列表
   */
  dates: XDate[] = [];

  /**
   * 起止日期间，根据单位生成的全量日期
   */
  datesByUnit: XDate[] = [];

  /**
   * 甘特的起始时间（数据起始时间请使用 data.start）
   */
  start: XDate = new XDate();

  /**
   * 甘特的结束时间（数据结束时间请使用 data.end）
   */
  end: XDate = new XDate().getOffset(Variables.time.millisecondOf.day);
  unit: HeaderDateUnit = 'day';
  minLength: number = 0;

  /**
   * 设置日期
   */
  setDate(
    minLen: number,
    start?: XDate,
    end?: XDate,
    unit: HeaderDateUnit = 'day'
  ) {
    let step = -Variables.time.millisecondOf.day;
    if (unit === 'hour') {
      step = -Variables.time.millisecondOf.hour * 5;
    }

    const _start = start?.getOffset(step);
    _start?.startOf(unit);
    const _end = end;

    // 避免重复渲染
    if (
      this.unit === unit &&
      _start &&
      this.start?.isSame(_start, unit) &&
      _end &&
      this.end?.isSame(_end, unit) &&
      this.minLength === minLen
    )
      return;

    this.unit = unit;
    this.start = _start ?? new XDate();
    this.end = _end ?? new XDate().getOffset(Variables.time.millisecondOf.day);
    this.minLength = minLen;

    this.generate();
  }

  generate() {
    this.dates = [];

    // 通过 start 和 end 以及 unit 来生成 columns
    const columns: GanttColumn[] = [];

    const start = this.start.date.getTime();
    const end = this.end.date.getTime();

    // TODO 这里可以优化一下，直接一次循环就可以组成 headers。因为是固定格式
    let s: number;
    for (s = start; s <= end; ) {
      this.dates.push(new XDate(s));
      s += getMillisecondBy(this.unit, s);
    }

    // 保证要占满所有宽度
    while (this.dates.length < this.minLength) {
      this.dates.push(new XDate(s));
      s += getMillisecondBy(this.unit, s);
    }

    let last: number;
    let i = -1;
    this.dates.forEach(date => {
      const cur = date.getBy(Variables.time.aggregation[this.unit] as DateUnit);

      if (cur !== last) {
        last = cur;
        columns.push(
          new GanttColumn(
            date,
            Variables.time.aggregation[this.unit] as DateUnit
          )
        );
        i++;
      }

      if (!columns[i].children) {
        columns[i].children = [];
      }

      columns[i].children?.push(new GanttColumn(date, this.unit));
    });

    this.headers = this.convertToRows(columns, this.getAllColumns(columns));
    this.end = this.dates[this.dates.length - 1];

    // 最后根据单位生成全量日期
    this.setDatesByUnit();
  }

  /**
   * This function idea from https://github.com/elemefe/element
   */
  private getAllColumns(columns: GanttColumn[]) {
    const result: GanttColumn[] = [];
    columns.forEach(column => {
      if (column.children) {
        result.push(column);
        result.push.apply(result, this.getAllColumns(column.children));
      } else {
        result.push(column);
      }
    });
    return result;
  }

  /**
   * 生成全量日期列表
   */
  setDatesByUnit() {
    this.datesByUnit = [];

    const start = this.start.date.getTime();
    const end = this.end.date.getTime();

    let s: number;
    for (s = start; s <= end; ) {
      this.datesByUnit.push(new XDate(s));
      s += getMillisecondBy(baseUnit(this.unit), s);
    }
  }
}

export { TableHeader, GanttHeader };
