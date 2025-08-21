export type LinkStartType = 'S';
export type LinkFinishType = 'F';
export type LinkType = `${LinkFinishType}${LinkStartType}` | `${LinkFinishType}${LinkFinishType}` | `${LinkStartType}${LinkStartType}` | `${LinkStartType}${LinkFinishType}`;

export interface ILink {
  /** 起始任务 id */
  from: any;
  /** 截止任务 id */
  to: any;
  /** 自定义颜色 */
  color?: string;
  /**
   * 连线类型。它允许用户配置连线的具体类型。具体讨论参考 {@link https://github.com/xpyjs/gantt/issues/119|关于前置后置任务的连线}
   *
   * 当前针对已知的四种类型进行了补充：
   * - `FS` - Finish to Start
   * - `FF` - Finish to Finish
   * - `SS` - Start to Start
   * - `SF` - Start to Finish
   *
   * 默认情况下使用 `FS`，即 Finish to Start。
   *
   * 无论如何配置，连线始终是 from - to 的方向，type 定义了连线在 from / to 任务中出现的位置，左侧定义为 Start，右侧定义为 Finish。
   */
  type?: LinkType;
  [key: string]: any;
}

/**
 * 基于某个任务节点获取到的所有相关联的链路信息
 */
export interface DataChain {
  /** 前置链路信息 */
  prev: {
    /** 所有源 -> 当前任务的完整路径（每条路径末尾为当前节点） */
    chain: any[][];
    /** 前置方向所有唯一节点 */
    nodes: any[];
    /** 前置方向所有连线 */
    links: ILink[];
  };
  /** 后置链路联系 */
  next: {
    /** 当前任务 -> 所有汇的完整路径（每条路径首元素为当前节点） */
    chain: any[][];
    /** 后置方向所有唯一节点 */
    nodes: any[];
    /** 后置方向所有连线 */
    links: ILink[];
  };
  /** 所有相关联的节点 */
  allNodes: any[];
  /** 所有相关联的连线 */
  allLinks: ILink[];
  /** 当前任务 */
  current: any | undefined;
}