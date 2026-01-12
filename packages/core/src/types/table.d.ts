import { EmitData } from ".";

/**
 * 表格列配置
 */
export interface ITableColumnStandard {
  /**
   * 字段名。默认情况下该列会展示数据中对应字段的值。支持点语法对嵌套字段进行访问
   */
  field: string;
  /**
   * 标题。显示在表头的文本
   */
  label?: string;
  /**
   * 当前列宽
   *
   * @default 100
   */
  width?: number;
  /**
   * 当前列对齐方式
   *
   * @default left
   */
  align?: "left" | "center" | "right";
  /**
   * 表头对齐方式
   *
   * @default center
   */
  headerAlign?: "left" | "center" | "right";
  /**
   * 当文字溢出时，是否显示省略号
   *
   * @default true
   */
  ellipsis?: boolean;
  /**
   * 是否允许拖拽调整列宽
   *
   * @default true
   */
  resizable?: boolean;
  /**
   * 自定义样式
   */
  customStyle?: Partial<CSSStyleDeclaration>;
  /**
   * 渲染函数
   */
  render?: (row: EmitData) => HTMLElement | string;
  /**
   * 自定义表头渲染
   */
  headerRender?: () => HTMLElement | string;

  /**
   * 合并方法。
   * 返回值大于1，表示向后/向下合并的格数
   */
  merge?: (
    value: any,
    data: any,
    colIndex: number,
    level: number
  ) => { col: number; row: number } | undefined;

  children?: undefined;
}

/**
 * 表格列多级配置
 */
export interface ITableColumnGroup {
  /**
   * 标题。多级表头中，需要显式提供上层的标题
   */
  label: string;
  /**
   * 多级表头
   */
  children: ITableColumn[];
}

/**
 * 表格列配置
 */
export type ITableColumn = ITableColumnStandard | ITableColumnGroup;

/**
 * 表格列定义
 */
export interface ITableOptions {
  /**
   * 统一设置列宽度。每列的宽度可以单独设置
   *
   * @default 100
   */
  width: number;

  /**
   * 统一设置列对齐方式。每列的对齐方式可以单独设置
   *
   * @default left
   */
  align: "left" | "center" | "right";

  /**
   * 统一设置表头对齐方式。每列的表头对齐方式可以单独设置
   *
   * @default center
   */
  headerAlign: "left" | "center" | "right";

  /**
   * 是否在文字溢出时显示省略号
   *
   * @default true
   */
  ellipsis: boolean;

  /**
   * 空数据占位符
   *
   * @default "-"
   */
  emptyText: string;

  /**
   * 列配置
   */
  columns?: ITableColumn[];
}
