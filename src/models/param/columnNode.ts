import { ColumnNodeDataOptions } from "@/typings/ParamOptions";
import { VNode } from "vue";

export class ColumnNode {
  /**
   * 节点key
   */
  key: number;

  /**
   * 节点 label 名
   */
  label: string;

  /**
   * 节点内容
   */
  node: VNode | null;

  /**
   * 是否合并
   */
  merge: boolean;

  constructor() {
    this.key = -1;
    this.label = "";
    this.node = null;
    this.merge = false;

    return this;
  }

  initData(data: ColumnNodeDataOptions) {
    this.key = data.key;
    this.label = data.label;
    this.node = data.node;
    this.merge = data.merge;

    return this;
  }
}
