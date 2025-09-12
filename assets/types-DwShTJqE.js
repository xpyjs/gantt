const t={XGanttUnit:'export type XGanttUnit = "hour" | "day" | "week" | "month" | "quarter";',IOptionConfig:`export type IOptionConfig = {
  /** 是否合并选项 */
  merge?: boolean;
};`,EmitData:`export interface EmitData {
  /** 原始数据 */
  data: any;
  /** 当前数据的索引 */
  $index: number;
  /** 当前数据的层级。 1 开始 */
  level: number;
}`,ILink:`export interface ILink {
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
   * - \`FS\` - Finish to Start
   * - \`FF\` - Finish to Finish
   * - \`SS\` - Start to Start
   * - \`SF\` - Start to Finish
   *
   * 默认情况下使用 \`FS\`，即 Finish to Start。
   *
   * 无论如何配置，连线始终是 from - to 的方向，type 定义了连线在 from / to 任务中出现的位置，左侧定义为 Start，右侧定义为 Finish。
   */
  type?: LinkType;
  [key: string]: any;
}`,LinkType:"export type LinkStartType = 'S';\nexport type LinkFinishType = 'F';\nexport type LinkType = `${LinkFinishType}${LinkStartType}` | `${LinkFinishType}${LinkFinishType}` | `${LinkStartType}${LinkStartType}` | `${LinkStartType}${LinkFinishType}`;",DataChain:`export interface DataChain {
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
}`},i={overview:{title:"类型概述",description:"这里列出了在使用 Gantt 组件进行二次开发时最常用的一些公共 TypeScript 类型。所有内容直接来自核心库的 d.ts 声明文件，保证与源码保持一致，便于查阅与复制。"},types:[{id:"DataChain",name:"DataChain",description:"以某任务为中心计算得到的完整前置/后置链路集合。用于依赖可视分析。",code:[{framework:"javascript",code:t.DataChain,language:"typescript"}]},{id:"EmitData",name:"EmitData",description:"事件/回调传出的任务基础结构封装，包含原始数据及层级索引。",code:[{framework:"javascript",code:t.EmitData,language:"typescript"}]},{id:"ILink",name:"ILink",description:"任务间依赖（连线）基础结构。包含起止任务及连线类型等。",code:[{framework:"javascript",code:t.ILink,language:"typescript"}]},{id:"IOptionConfig",name:"IOptionConfig",description:"更新配置时的附加选项，目前支持是否合并更新。",code:[{framework:"javascript",code:t.IOptionConfig,language:"typescript"}]},{id:"LinkType",name:"LinkType",description:"四种依赖类型组合（FS/FF/SS/SF），定义连线在起止任务的锚点位置。",code:[{framework:"javascript",code:t.LinkType,language:"typescript"}]},{id:"XGanttUnit",name:"XGanttUnit",description:"甘特图时间刻度单位类型。控制时间轴的粒度。",code:[{framework:"javascript",code:t.XGanttUnit,language:"typescript"}]}]};export{i as t};
