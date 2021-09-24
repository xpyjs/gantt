import { Variables } from "@/constants/vars";
import { TableHeaderDataOptions } from "@/typings/ParamOptions";

export class TableHeader {
  /**
   * 表头 key
   */
  key: number;

  /**
   * 表头对应 label 名
   */
  label: string;

  /**
   * 表头显示文字
   */
  text: string;

  private __w: number;

  constructor() {
    this.key = -1;
    this.label = "";
    this.text = "";
    this.__w = Variables.size.defaultTableColumnWidth;

    return this;
  }

  initData(data: TableHeaderDataOptions) {
    this.key = data.key;
    this.label = data.label;
    this.text = data.text;
    this.__w = data.width;

    return this;
  }

  /**
   * 获取表头宽度
   */
  get width() {
    return this.__w;
  }

  /**
   * 设置表头宽度
   * @param v
   */
  setWidth(v: number) {
    this.__w = v;
  }
}
