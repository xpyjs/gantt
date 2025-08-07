/*
 * @Author: JeremyJone
 * @Date: 2025-04-25 17:23:34
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-07-29 11:10:39
 * @Description: 列管理器
 */

import { cloneDeep } from "lodash-es";
import { EventName } from "../event";
import { Checkbox } from "../rendering/table/Checkbox";
import {
  ITableColumn,
  ITableColumnGroup,
  ITableColumnStandard
} from "@/types/table";
import { IContext } from "@/types/render";
import type { Task } from "@/models/Task";

const HANDLER_COLUMN = "handler_column";

/**
 * 内部列数据结构
 */
export interface IColumn<T extends ITableColumn = ITableColumn> {
  /** 显示文本 */
  label: string;
  /** 层级，默认为1 */
  level: number;
  /** 当前列最大层级 */
  maxLevel: number;
  /** 原始列数据 */
  column: T;
  /** 子项 */
  children: IColumn[];
  /** 列标识符，用于查找 */
  key: string;
  /** 标识数组，用于查找。从根到当前列的路径 */
  path: string[];
  /** 是否为叶子节点 */
  isLeaf: boolean;
  /** 列宽度 */
  width: number | "auto";
}

export interface MergeInfo {
  task: Task;
  originColumnIndex: number;
  colspan: number;
  rowspan: number;
}

export class ColumnManager {
  /** 源列数据 */
  private sourceColumns: ITableColumn[] = [];
  /** 处理后的所有列数据 */
  private columns: IColumn[] = [];
  /** 叶子列数据，只包含最终显示的列 */
  private leafColumns: IColumn<ITableColumnStandard>[] = [];

  /** 临时叶子列数据，用于更新源数据，读取宽度等原信息 */
  private temporaryLeafColumns: IColumn[] = [];

  /**
   * 保存所有行列合并的信息
   *
   * Map<task_id, Map<col_index, object>>
   */
  private mergeInfo: Map<string, Map<number, MergeInfo>> = new Map();

  /**
   * 收起表格
   */
  private collapseTable = false;

  constructor(private context: IContext) { }

  /**
   * 初始化列数据
   */
  public init(columns?: ITableColumn[]): void {
    if (columns?.length) {
      this.sourceColumns = columns;
    }

    this.columns = [];
    this.leafColumns = [];

    // 处理列数据
    this.processColumns(this.sourceColumns, this.columns);
  }

  /**
   * 处理列数据，将源数据转换为内部数据结构
   */
  private processColumns(
    columns: ITableColumn[],
    parentColumns: IColumn[] = [],
    parentColumn?: IColumn,
    level: number = 1
  ): void {
    columns.forEach((column, index) => {
      // 生成唯一标识。 'colomn-' + index + '-' + 父级标识 + '-' + 'field-' + 当前列标识(filed)
      // 父级标识：'group-' + 父级标识

      // 是否为分组列
      const isGroup =
        "children" in column &&
        Array.isArray(column.children) &&
        column.children.length > 0;

      // 是否为叶子节点
      const isLeaf = !isGroup;

      let key = "";
      if (isGroup) {
        const groupKey = `group-${index}`;
        key = groupKey;
      } else {
        key = `field-${(column as ITableColumnStandard).field}`;
      }

      // 当前列的路径
      const path = [...(parentColumn?.path || []), key];

      key = "column-" + index + "-" + path.join("-");

      // 获取列标签
      const label =
        column.label || (isLeaf ? (column as ITableColumnStandard).field : "");

      // 获取列宽度。分组列的宽度会自动撑开。更新数据的话，会优先调取旧数据中的宽度
      const width = isLeaf
        ? this.temporaryLeafColumns.find(c => c.key === key)?.width ||
        (column as ITableColumnStandard).width ||
        100
        : "auto";

      // 创建内部列数据
      const internalColumn: IColumn = {
        label,
        level,
        maxLevel: level,
        column,
        children: [],
        path,
        key,
        isLeaf,
        width
      };

      // 保存列数据
      parentColumns.push(internalColumn);

      // 保存列宽度
      if (isLeaf) {
        // 如果是叶子节点，保存到叶子列集合
        this.leafColumns.push(internalColumn as IColumn<ITableColumnStandard>);
      } else if (isGroup) {
        // 如果是分组列，递归处理子列
        const childColumns = (column as ITableColumnGroup).children;
        this.processColumns(
          childColumns,
          internalColumn.children,
          internalColumn,
          level + 1
        );

        // 更新当前列的最大层级
        internalColumn.maxLevel = Math.max(
          internalColumn.maxLevel,
          internalColumn.children.reduce((max, child) => {
            return Math.max(max, child.maxLevel);
          }, 0)
        );
      }
    });

    this.temporaryLeafColumns = cloneDeep(this.leafColumns);
  }

  /**
   * 根据 key 查找列
   */
  private findColumnByKey(key: string): IColumn | undefined {
    return this.columns.find(column => column.key === key);
  }

  update(columns: ITableColumn[]): void {
    this.init(columns);
    this.clearMergeInfo();
  }

  getColumns(): IColumn[] {
    return this.columns;
  }

  getColumn(key: string): IColumn | undefined {
    return this.leafColumns.find(column => column.key === key);
  }
  getLeafColumns(): IColumn<ITableColumnStandard>[] {
    return this.leafColumns;
  }
  getTotalWidth(): number {
    if (this.isCollapsed()) return 0;

    return this.leafColumns.reduce((total, column) => {
      return total + (column.width as number);
    }, this.getHandlerColumn().width as number);
  }
  getColumnWidth(key: string): number {
    if (key === HANDLER_COLUMN) return this.getHandlerColumn().width as number;

    const column = this.leafColumns.find(column => column.key === key);
    return typeof column?.width === "number" ? column.width : 0;
  }
  setColumnWidth(key: string, width: number): void {
    const column = this.leafColumns.find(column => column.key === key);
    if (column) {
      column.width = width;
    }

    this.context.event.emit(EventName.COLUMN_WIDTH_CHANGE, key, width);
  }
  isLastColumn(key: string): boolean {
    const index = this.leafColumns.findIndex(column => column.key === key);
    return index === this.leafColumns.length - 1;
  }

  addMergeInfo(id: string, colIndex: number, info: MergeInfo): void {
    if (!this.mergeInfo.has(id)) {
      this.mergeInfo.set(id, new Map());
    }

    const row = this.mergeInfo.get(id)!;
    row.set(colIndex, info);
  }

  getMergeInfo(id: string, colIndex: number): MergeInfo | undefined {
    return this.mergeInfo.get(id)?.get(colIndex);
  }

  clearMergeInfo(): void {
    this.mergeInfo.clear();
  }

  getHandlerColumn() {
    let width = 0;
    if (this.context.store.getOptionManager().getOptions().selection.enabled) {
      width += 40;
    }

    // 如果为一层数据，隐藏掉
    if (this.context.store.getDataManager().dataLevel > 0) {
      if (this.context.store.getOptionManager().getOptions().expand.show) {
        width += 40;
      }
    }

    return {
      label: "",
      level: 1,
      maxLevel: 1,
      column: {
        field: "",
        resizable: false,
        align: "left",
        headerAlign: "left",
        customStyle: {
          paddingLeft: this.context.store.getOptionManager().getOptions().expand
            .show
            ? "8px"
            : 0
        },
        headerRender: () => {
          return this.context.store.getOptionManager().getOptions().selection
            .enabled
            ? new Checkbox(this.context).getElement()
            : null;
        },
        ellipsis: false
      },
      children: [],
      path: [],
      key: HANDLER_COLUMN,
      isLeaf: true,
      width
    } as IColumn<ITableColumnStandard>;
  }

  isMultiHeader() {
    return this.columns.some(c => c.maxLevel > 1);
  }

  collapse() {
    this.collapseTable = !this.collapseTable;
    this.context.event.emit(EventName.TOGGLE_COLLAPSE);
  }

  isCollapsed() {
    return this.collapseTable;
  }
}
