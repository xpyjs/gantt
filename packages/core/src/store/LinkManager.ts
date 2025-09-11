/*
 * @Author: JeremyJone
 * @Date: 2025-04-18 10:47:28
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-09-11 14:21:07
 * @Description: 连线 / 依赖 管理器 (面向开发者的核心功能)
 */

import { EventName, ErrorType, type EventBus } from "../event";
import { Task } from "../models/Task";
import type { Store } from ".";
import { ILink, LinkType, LinkStartType, LinkFinishType, DataChain } from "@/types/link";
import { Logger } from "../utils/logger";

// ==================== 类型定义 ====================

/** 连线操作结果 */
type LinkOpResult = { ok: true; } | {
  ok: false,
  /** 失败原因编码 */
  reason: ErrorType;
  /** 友好提示（由上层决定是否展示） */
  message?: string;
  /** 当检测出环时，返回的环信息 */
  cycleInfo?: CycleInfo;
}

/** 连线类型信息 */
interface LinkTypeInfo {
  from: LinkFinishType | LinkStartType;
  to: LinkStartType | LinkFinishType;
  description: string;
}

/** 任务连线查询结果 */
interface TaskLinksResult {
  incoming: ILink[];
  outgoing: ILink[];
  all: ILink[];
}

/** 任务连接关系结果 */
interface TaskConnectionResult {
  tasks: Task[];
  links: ILink[];
}

/** 批量校验结果 */
interface ValidationBatchResult {
  invalid: Array<{ link: ILink; reason: string; message: string }>;
  valid: ILink[];
  totalCount: number;
}

/** 冲突检测结果 */
interface ConflictResult {
  hasConflict: boolean;
  conflicts: ILink[];
  conflictTypes: string[];
}

/** 环检测信息 */
interface CycleInfo {
  cycles: string[][];
  nodes: string[];
  sccs: string[][];
}

/** 环检测报告 */
interface CycleReport extends CycleInfo {
  hasCycle: boolean;
}

/** 调试信息 */
interface LinkDebugInfo {
  totalLinks: number;
  totalTasks: number;
  connectionComponents: number;
  hasCycle: boolean;
  topologicalOrder: string[] | null;
  isolatedTasks: string[];
}

/**
 * LinkManager - 甘特图连线/依赖关系管理器
 *
 * 核心职责：
 * 1. 连线数据的集中管理和索引
 * 2. 连线合法性校验（包括类型校验）
 * 3. 环检测和拓扑排序
 * 4. 任务连接关系查询
 * 5. 为 ChartLink 提供高效的连线操作支持
 */
export class LinkManager {
  // ==================== 核心数据结构 ====================
  /** 原始连线数据集合 */
  private links: ILink[] = [];

  /** 以起点任务 id 为 key 的出边邻接表 */
  private fromLinksMap: Map<string, ILink[]> = new Map();

  /** 以终点任务 id 为 key 的入边邻接表 */
  private toLinksMap: Map<string, ILink[]> = new Map();

  // ==================== 缓存系统（简化版） ====================
  /** 拓扑序（无环情况下才有效，懒计算） */
  private topoOrder: string[] | null = null;

  /** 节点 id -> 拓扑序索引 */
  private topoIndex: Map<string, number> = new Map();

  /** 最近一次全量环检测报告 */
  private lastCycleReport: CycleReport | null = null;

  /** 直接连接关系缓存（轻量级） */
  private directConnectionCache: Map<string, { predecessors: Task[], successors: Task[] }> = new Map();

  /** 记忆化缓存（用于链路查询优化） */
  private forwardMemo: Map<string, Task[][]> = new Map();
  private backwardMemo: Map<string, Task[][]> = new Map();

  // ==================== 增强缓存系统 ====================

  /** 缓存依赖关系追踪 */
  private cacheDependencies: Map<string, Set<string>> = new Map();

  /** 缓存访问频率统计 */
  private cacheAccessStats: Map<string, { hits: number; lastAccess: number }> = new Map();

  /** 缓存大小限制 */
  private readonly MAX_CACHE_SIZE = 1000;

  /** 缓存生存时间（毫秒） */
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5分钟

  // ==================== 配置选项 ====================
  /** 是否启用环检测 */
  private enableCycleDetection = true;

  // ==================== 连线类型映射表 ====================
  /** 连线类型映射表 */
  private static readonly LINK_TYPE_MAP: Record<LinkType, LinkTypeInfo> = {
    'FS': { from: 'F', to: 'S', description: '结束到开始' },
    'SF': { from: 'S', to: 'F', description: '开始到结束' },
    'FF': { from: 'F', to: 'F', description: '结束到结束' },
    'SS': { from: 'S', to: 'S', description: '开始到开始' }
  };

  // ==================== 构造函数和基础设置 ====================
  constructor(private store: Store, private event: EventBus) { }

  /** 开启/关闭环检测 */
  public setCycleDetection(enabled: boolean): void {
    this.enableCycleDetection = !!enabled;
  }

  // ==================== 核心数据管理 ====================
  /** 获取所有连线 */
  public getLinks(): ILink[] {
    return this.links;
  }

  /** 获取某个任务ID的连线 */
  public getLinksByTaskId(taskId: string): ILink[] {
    return this.links.filter(link => link.from === taskId || link.to === taskId);
  }

  /** 批量设置连线（唯一的数据修改入口） */
  public setLinks(links: ILink[], detectAll = false): void {
    // 计算变更影响的任务ID
    const oldTaskIds = new Set<string>();
    const newTaskIds = new Set<string>();

    this.links.forEach(link => {
      oldTaskIds.add(link.from);
      oldTaskIds.add(link.to);
    });

    links.forEach(link => {
      newTaskIds.add(link.from);
      newTaskIds.add(link.to);
    });

    const affectedTaskIds = Array.from(new Set([...oldTaskIds, ...newTaskIds]));

    // 确定操作类型
    let operationType: 'ADD' | 'REMOVE' | 'UPDATE' | 'BATCH' = 'BATCH';
    if (this.links.length === 0) {
      operationType = 'ADD';
    } else if (links.length === 0) {
      operationType = 'REMOVE';
    } else if (Math.abs(links.length - this.links.length) === 1) {
      operationType = links.length > this.links.length ? 'ADD' : 'REMOVE';
    }

    this.links = links || [];
    this.rebuildAdjacency();

    // 精细化缓存失效
    this.invalidateSmartCaches(affectedTaskIds, operationType);


    if (detectAll && this.enableCycleDetection) {
      this.detectAllCycles();
    } else {
      this.lastCycleReport = null;
    }
  }

  /** 更新各种缓存配置 */
  public update() {
    this.setLinks(this.links, true);
  }

  /** 检查连线是否存在 */
  public isLinkExist(from: string, to: string, type?: string): boolean {
    return this.links.some(l =>
      l.from === from && l.to === to && ((l.type || 'FS') === (type || 'FS'))
    );
  }

  // ==================== 连线类型系统 ====================
  /** 校验连线类型是否合法 */
  public validateLinkType(type: string): boolean {
    return Object.keys(LinkManager.LINK_TYPE_MAP).includes(type as LinkType);
  }

  /** 将起止点转换为连线类型 */
  public convertPointsToLinkType(fromPoint: LinkStartType | LinkFinishType, toPoint: LinkStartType | LinkFinishType): LinkType {
    return `${fromPoint}${toPoint}` as LinkType;
  }

  // ==================== 连线校验系统 ====================
  /** 校验单条连线的基础合法性 */
  public validateLink(link: ILink): LinkOpResult {
    if (!link || link.from == null || link.to == null) {
      return {
        ok: false,
        reason: ErrorType.LINK_INVALID_ARG,
        message: Logger.getMessage('Missing endpoint')
      };
    }

    if (link.from === link.to) {
      return {
        ok: false,
        reason: ErrorType.LINK_SAME,
        message: Logger.getMessage('Cannot link task to itself')
      };
    }

    if (!this.getTask(link.from) || !this.getTask(link.to)) {
      return {
        ok: false,
        reason: ErrorType.TASK_NOT_FOUND,
        message: Logger.getMessage('Task not found')
      };
    }

    // 连线类型校验
    if (link.type && !this.validateLinkType(link.type)) {
      return {
        ok: false,
        reason: ErrorType.INVALID_TYPE,
        message: Logger.getMessage(`Invalid link type: ${link.type}. It must be one of: ${Object.keys(LinkManager.LINK_TYPE_MAP).join(', ')}`)
      };
    }

    if (this.isLinkExist(link.from, link.to, link.type)) {
      return {
        ok: false,
        reason: ErrorType.LINK_EXIST,
        message: Logger.getMessage('Link already exists')
      };
    }

    return { ok: true };
  }

  /** 校验新增连线是否会产生环 */
  public validateChain(from: string, to: string, type?: string): LinkOpResult {
    const dummy: ILink = { from, to, type } as ILink;
    const base = this.validateLink(dummy);
    if (!base.ok) return base;

    // 临时环检测：判断新增是否产生环
    if (this.enableCycleDetection && this.willCreateCycle(from, to)) {
      return {
        ok: false,
        reason: ErrorType.LINK_CYCLE,
        message: Logger.getMessage('Adding this link would create a cycle'),
        cycleInfo: this.buildSimpleCycleInfo(from, to)
      };
    }

    return { ok: true };
  }

  /** 批量校验连线 */
  public validateLinks(links: ILink[]): ValidationBatchResult {
    const invalid: Array<{ link: ILink; reason: string; message: string }> = [];
    const valid: ILink[] = [];

    for (const link of links) {
      const result = this.validateLink(link);
      if (!result.ok) {
        invalid.push({
          link,
          reason: result.reason,
          message: result.message || ""
        });
      } else {
        valid.push(link);
      }
    }

    return {
      invalid,
      valid,
      totalCount: links.length
    };
  }

  // ==================== 任务连接关系查询 ====================
  /** 获取任务的所有连线（入边+出边） */
  public getTaskLinks(taskId: string): TaskLinksResult {
    const incoming = this.toLinksMap.get(taskId) || [];
    const outgoing = this.fromLinksMap.get(taskId) || [];
    const all = [...incoming, ...outgoing];

    return { incoming, outgoing, all };
  }

  /** 获取任务的直接前驱任务 */
  public getTaskPredecessors(taskId: string): TaskConnectionResult {
    const links = this.toLinksMap.get(taskId) || [];
    const tasks = links
      .map(link => this.getTask(link.from))
      .filter((task): task is Task => !!task);

    return { tasks, links };
  }

  /** 获取任务的直接后继任务 */
  public getTaskSuccessors(taskId: string): TaskConnectionResult {
    const links = this.fromLinksMap.get(taskId) || [];
    const tasks = links
      .map(link => this.getTask(link.to))
      .filter((task): task is Task => !!task);

    return { tasks, links };
  }

  /** 获取与指定任务直接连接的所有任务 */
  public getDirectlyConnectedTasks(taskId: string): Task[] {
    const predecessors = this.getTaskPredecessors(taskId).tasks;
    const successors = this.getTaskSuccessors(taskId).tasks;

    // 去重合并
    const connectedMap = new Map<string, Task>();
    [...predecessors, ...successors].forEach(task => {
      connectedMap.set(task.id, task);
    });

    return Array.from(connectedMap.values());
  }

  /** 检查两个任务间是否存在连接路径 */
  public hasConnectionPath(fromId: string, toId: string): boolean {
    if (fromId === toId) return true;

    const visited = new Set<string>();
    const stack = [fromId];

    while (stack.length) {
      const current = stack.pop()!;
      if (current === toId) return true;
      if (visited.has(current)) continue;

      visited.add(current);
      const successors = this.getTaskSuccessors(current).tasks;
      for (const task of successors) {
        if (!visited.has(task.id)) {
          stack.push(task.id);
        }
      }
    }

    return false;
  }

  /**
   * 枚举指定任务的所有前置完整路径与后置完整路径
   *
   * @param taskId 任务ID
   * @returns 包含前置链路、后置链路和所有节点的完整信息
   *
   * 返回结构：
   * - prev.chain: 所有源 -> 当前任务的完整路径（每条路径末尾为当前任务）
   * - next.chain: 当前任务 -> 所有汇的完整路径（每条路径首元素为当前任务）
   * - prev.nodes: 前置方向所有唯一节点
   * - next.nodes: 后置方向所有唯一节点
   * - allNodes: 前后方向去重后的全部节点
   * - allLinks: 涉及的所有连线
   */
  public getDataChain(taskId: string): DataChain {
    const currentTask = this.getTask(taskId);
    if (!currentTask) {
      return {
        prev: { chain: [], nodes: [], links: [] },
        next: { chain: [], nodes: [], links: [] },
        allNodes: [],
        allLinks: [],
        current: undefined
      };
    }

    // 检查缓存并记录访问
    const forwardCached = this.forwardMemo.get(taskId);
    const backwardCached = this.backwardMemo.get(taskId);
    this.recordCacheAccess(taskId, !!(forwardCached && backwardCached));

    // 获取出边和入边邻居
    const getOutNeighbors = (id: string): Task[] => {
      const links = this.fromLinksMap.get(id) || [];
      return links.map(l => this.getTask(l.to)).filter((t): t is Task => !!t);
    };

    const getInNeighbors = (id: string): Task[] => {
      const links = this.toLinksMap.get(id) || [];
      return links.map(l => this.getTask(l.from)).filter((t): t is Task => !!t);
    };

    // DFS 前向搜索（带缓存优化）
    const dfsForward = (current: Task, stack: Set<string>, visited: Set<string> = new Set()): Task[][] => {
      const cacheKey = current.id;
      if (this.forwardMemo.has(cacheKey)) {
        this.recordCacheAccess(cacheKey, true);
        return this.forwardMemo.get(cacheKey)!;
      }

      if (stack.has(current.id) || visited.has(current.id)) {
        return []; // 环剪枝或已访问
      }

      stack.add(current.id);
      visited.add(current.id);

      const children = getOutNeighbors(current.id);
      let paths: Task[][] = [];

      if (children.length === 0) {
        paths = [[current]];
      } else {
        for (const child of children) {
          const childPaths = dfsForward(child, stack, visited);
          for (const path of childPaths) {
            paths.push([current, ...path]);
          }
        }
        if (paths.length === 0) {
          paths = [[current]];
        }
      }

      stack.delete(current.id);

      // 缓存结果（仅对路径较短的结果进行缓存）
      if (paths.length < 100) {
        this.forwardMemo.set(cacheKey, paths);
        this.recordCacheAccess(cacheKey, false);
      }

      return paths;
    };

    // DFS 后向搜索（带缓存优化）
    const dfsBackward = (current: Task, stack: Set<string>, visited: Set<string> = new Set()): Task[][] => {
      const cacheKey = current.id;
      if (this.backwardMemo.has(cacheKey)) {
        this.recordCacheAccess(cacheKey, true);
        return this.backwardMemo.get(cacheKey)!;
      }

      if (stack.has(current.id) || visited.has(current.id)) {
        return []; // 环剪枝或已访问
      }

      stack.add(current.id);
      visited.add(current.id);

      const parents = getInNeighbors(current.id);
      let paths: Task[][] = [];

      if (parents.length === 0) {
        paths = [[current]];
      } else {
        for (const parent of parents) {
          const parentPaths = dfsBackward(parent, stack, visited);
          for (const path of parentPaths) {
            paths.push([...path, current]);
          }
        }
        if (paths.length === 0) {
          paths = [[current]];
        }
      }

      stack.delete(current.id);

      // 缓存结果（仅对路径较短的结果进行缓存）
      if (paths.length < 100) {
        this.backwardMemo.set(cacheKey, paths);
        this.recordCacheAccess(cacheKey, false);
      }

      return paths;
    };

    // 执行搜索（使用独立的访问集合避免冲突）
    const prevChains = dfsBackward(currentTask, new Set<string>());
    const nextChains = dfsForward(currentTask, new Set<string>());

    // 建立缓存依赖关系
    const directlyConnected = this.getDirectlyConnectedTasks(taskId);
    directlyConnected.forEach(task => {
      this.establishCacheDependency(taskId, task.id);
      this.establishCacheDependency(task.id, taskId);
    });

    // 收集节点（优化内存分配）
    const allNodeMap = new Map<string, Task>();
    const allLinkMap = new Map<string, ILink>();

    // 使用更高效的节点和连线收集
    const collectFromChains = (chains: Task[][], isForward: boolean) => {
      const links: ILink[] = [];

      for (const chain of chains) {
        chain.forEach(task => allNodeMap.set(task.id, task));

        // 收集连线
        for (let i = 0; i < chain.length - 1; i++) {
          const fromId = chain[i].id;
          const toId = chain[i + 1].id;
          const link = this.findLinkFast(fromId, toId);
          if (link) {
            const linkKey = `${link.from}-${link.to}-${link.type || 'default'}`;
            if (!allLinkMap.has(linkKey)) {
              links.push(link);
              allLinkMap.set(linkKey, link);
            }
          }
        }
      }

      return links;
    };

    const prevLinks = collectFromChains(prevChains, false);
    const nextLinks = collectFromChains(nextChains, true);

    return {
      prev: {
        chain: prevChains.map(p => p.map(task => task.getEmitData().data)),
        nodes: prevChains.flat().filter((task, index, arr) =>
          arr.findIndex(t => t.id === task.id) === index
        ).map(n => n.getEmitData().data),
        links: prevLinks
      },
      next: {
        chain: nextChains.map(p => p.map(task => task.getEmitData().data)),
        nodes: nextChains.flat().filter((task, index, arr) =>
          arr.findIndex(t => t.id === task.id) === index
        ).map(n => n.getEmitData().data),
        links: nextLinks
      },
      allNodes: Array.from(allNodeMap.values()).map(n => n.getEmitData().data),
      allLinks: Array.from(allLinkMap.values()),
      current: currentTask.getEmitData().data
    };
  }

  // ==================== 环检测系统 ====================
  /** 检查当前图是否存在环 */
  public hasCycle(): boolean {
    if (this.lastCycleReport) return this.lastCycleReport.hasCycle;
    return this.detectAllCycles(false).hasCycle;
  }

  /** 全量环检测（Tarjan 算法） */
  public detectAllCycles(sendErr = true): CycleReport {
    const indexMap = new Map<string, number>();
    const lowMap = new Map<string, number>();
    const onStack = new Set<string>();
    const stack: string[] = [];
    let index = 0;
    const sccs: string[][] = [];

    const visit = (id: string) => {
      indexMap.set(id, index);
      lowMap.set(id, index);
      index++;
      stack.push(id);
      onStack.add(id);

      const outs = this.fromLinksMap.get(id) || [];
      for (const e of outs) {
        if (!indexMap.has(e.to)) {
          visit(e.to);
          lowMap.set(id, Math.min(lowMap.get(id)!, lowMap.get(e.to)!));
        } else if (onStack.has(e.to)) {
          lowMap.set(id, Math.min(lowMap.get(id)!, indexMap.get(e.to)!));
        }
      }

      // 根节点，弹出栈形成一个 SCC
      if (lowMap.get(id) === indexMap.get(id)) {
        const comp: string[] = [];
        while (true) {
          const w = stack.pop()!;
          onStack.delete(w);
          comp.push(w);
          if (w === id) break;
        }
        sccs.push(comp);
      }
    };

    // 遍历图中所有任务（确保孤立节点也被遍历）
    this.store.getDataManager().getTasks(false).forEach((t: Task) => {
      if (!indexMap.has(t.id)) visit(t.id);
    });

    // 提取形成环的强连通分量：大小 >1 或 存在自环边
    const cycleSccs = sccs.filter(c => c.length > 1 || this.hasSelfLoop(c[0]));
    const cycles: string[][] = cycleSccs.map(c => c.slice());

    const report: CycleReport = {
      hasCycle: cycleSccs.length > 0,
      sccs: cycleSccs,
      cycles,
      nodes: Array.from(new Set(cycleSccs.flat()))
    };

    this.lastCycleReport = report;
    if (sendErr && report.hasCycle) {
      Logger.warn('Cycle detected in task dependencies', report);
    }
    return report;
  }

  /** 获取最近一次环检测报告 */
  public getCycleReport(): CycleReport | null {
    return this.lastCycleReport;
  }

  // ==================== 冲突检测 ====================
  /** 检测同一对任务间是否存在冲突的连线类型 */
  public detectLinkConflicts(taskA: string, taskB: string): ConflictResult {
    const forwardLinks = this.links.filter(l => l.from === taskA && l.to === taskB);
    const backwardLinks = this.links.filter(l => l.from === taskB && l.to === taskA);
    const allLinks = [...forwardLinks, ...backwardLinks];

    const conflicts: ILink[] = [];
    const conflictTypes: string[] = [];

    // 检查是否存在相互冲突的连线类型
    // 例如：同时存在 FS 和 SF 可能在业务上不合理
    const typeCount = new Map<string, number>();
    allLinks.forEach(link => {
      if (link.type) {
        typeCount.set(link.type, (typeCount.get(link.type) || 0) + 1);
      }
    });

    // 简单的冲突检测规则
    const hasFS = typeCount.has('FS');
    const hasSF = typeCount.has('SF');

    if (hasFS && hasSF) {
      conflicts.push(...allLinks.filter(l => l.type === 'FS' || l.type === 'SF'));
      conflictTypes.push('FS-SF conflict');
    }

    return {
      hasConflict: conflicts.length > 0,
      conflicts,
      conflictTypes
    };
  }

  /** 检查是否存在业务逻辑冲突的连线 */
  public hasConflictingLinks(from: string, to: string): boolean {
    const result = this.detectLinkConflicts(from, to);
    return result.hasConflict;
  }

  // ==================== 内部算法实现 ====================
  /** 懒计算拓扑序（Kahn 算法） */
  private computeTopo(): string[] | null {
    if (this.topoOrder) return this.topoOrder; // 已缓存

    // 初始化所有节点入度
    const inDeg = new Map<string, number>();
    this.store.getDataManager().getTasks(false).forEach((t: Task) => inDeg.set(t.id, 0));

    // 计算入度
    for (const l of this.links) {
      if (inDeg.has(l.to)) inDeg.set(l.to, (inDeg.get(l.to) || 0) + 1);
    }

    const queue: string[] = [];
    inDeg.forEach((deg, id) => { if (deg === 0) queue.push(id); });

    const order: string[] = [];
    while (queue.length) {
      const id = queue.shift()!;
      order.push(id);
      const outs = this.fromLinksMap.get(id) || [];
      for (const edge of outs) {
        const nd = (inDeg.get(edge.to) || 0) - 1;
        inDeg.set(edge.to, nd);
        if (nd === 0) queue.push(edge.to);
      }
    }

    if (order.length !== this.store.getDataManager().getTasks(false).length) {
      // 有环，返回 null；不缓存
      return null;
    }

    order.forEach((id, i) => this.topoIndex.set(id, i));
    this.topoOrder = order;
    return order;
  }

  /** 增量环检测（基于拓扑序 + DFS） */
  private willCreateCycle(from: string, to: string): boolean {
    const topo = this.computeTopo();
    if (topo) {
      const ifrom = this.topoIndex.get(from);
      const ito = this.topoIndex.get(to);
      if (ifrom != null && ito != null && ifrom < ito) return false; // 仍保持拓扑顺序
    }

    // DFS from 'to'
    const stack: string[] = [to];
    const visited = new Set<string>();
    while (stack.length) {
      const cur = stack.pop()!;
      if (cur === from) return true; // 可以回到起点，形成环
      if (visited.has(cur)) continue;
      visited.add(cur);
      const outs = this.fromLinksMap.get(cur) || [];
      for (const e of outs) stack.push(e.to);
    }
    return false;
  }

  /** 构建/重建邻接表 */
  private rebuildAdjacency(): void {
    this.fromLinksMap.clear();
    this.toLinksMap.clear();

    for (const link of this.links) {
      if (!this.fromLinksMap.has(link.from)) this.fromLinksMap.set(link.from, []);
      if (!this.toLinksMap.has(link.to)) this.toLinksMap.set(link.to, []);
      this.fromLinksMap.get(link.from)!.push(link);
      this.toLinksMap.get(link.to)!.push(link);
    }
  }

  /** 失效所有缓存 */
  private invalidateAllCaches(): void {
    this.topoOrder = null;
    this.topoIndex.clear();
    this.directConnectionCache.clear();
    // 新增：清理链路缓存
    this.forwardMemo.clear();
    this.backwardMemo.clear();
    // 清理增强缓存系统
    this.cacheDependencies.clear();
    this.cacheAccessStats.clear();
  }

  /** 失效直接连接缓存 */
  private invalidateConnectionCache(taskIds?: string[]): void {
    if (taskIds) {
      taskIds.forEach(id => this.directConnectionCache.delete(id));
    } else {
      this.directConnectionCache.clear();
    }
  }

  // ==================== 辅助工具方法 ====================
  /** 快速查找连线的优化方法 */
  private findLinkFast(from: string, to: string): ILink | undefined {
    const outLinks = this.fromLinksMap.get(from);
    if (!outLinks) return undefined;

    return outLinks.find(link => link.to === to);
  }

  /** 根据任务 ID 获取任务对象 */
  private getTask(id: string): Task | undefined {
    return this.store.getDataManager().getTaskById(id);
  }

  /** 检查节点是否存在自环 */
  private hasSelfLoop(id: string): boolean {
    return (this.fromLinksMap.get(id) || []).some(l => l.to === id);
  }

  /** 构造简单环信息 */
  private buildSimpleCycleInfo(from: string, to: string): CycleInfo {
    // 简化版本：只返回基本的环信息
    const cycle = [from, to];
    return {
      cycles: [cycle],
      nodes: Array.from(new Set(cycle)),
      sccs: []
    };
  }

  // 优化后的缓存失效策略
  /**
   * 精细化缓存失效策略
   * 根据操作类型和影响范围进行精确的缓存失效
   */
  private invalidateSmartCaches(affectedTaskIds?: string[], operationType: 'ADD' | 'REMOVE' | 'UPDATE' | 'BATCH' = 'UPDATE'): void {
    if (!affectedTaskIds || affectedTaskIds.length === 0) {
      this.invalidateAllCaches();
      return;
    }

    // 根据操作类型决定失效策略
    switch (operationType) {
      case 'ADD':
        this.handleAddLinkInvalidation(affectedTaskIds);
        break;
      case 'REMOVE':
        this.handleRemoveLinkInvalidation(affectedTaskIds);
        break;
      case 'UPDATE':
        this.handleUpdateLinkInvalidation(affectedTaskIds);
        break;
      case 'BATCH':
        this.handleBatchOperationInvalidation(affectedTaskIds);
        break;
    }

    // 清理过期缓存
    this.cleanupExpiredCaches();

    // 限制缓存大小
    this.limitCacheSize();
  }

  /** 处理添加连线的缓存失效 */
  private handleAddLinkInvalidation(taskIds: string[]): void {
    const toInvalidate = new Set<string>();

    for (const taskId of taskIds) {
      // 添加连线主要影响前向和后向路径
      toInvalidate.add(taskId);

      // 获取所有可能受影响的上游任务
      const upstreamTasks = this.getUpstreamTasksRecursive(taskId, 3); // 限制深度为3
      upstreamTasks.forEach(id => toInvalidate.add(id));

      // 获取所有可能受影响的下游任务
      const downstreamTasks = this.getDownstreamTasksRecursive(taskId, 3);
      downstreamTasks.forEach(id => toInvalidate.add(id));
    }

    this.invalidateSpecificCaches(Array.from(toInvalidate));
  }

  /** 处理删除连线的缓存失效 */
  private handleRemoveLinkInvalidation(taskIds: string[]): void {
    // 删除连线影响范围较大，需要更广泛的失效
    const toInvalidate = new Set<string>();

    for (const taskId of taskIds) {
      toInvalidate.add(taskId);

      // 删除连线可能影响整个连通分量
      const connectedComponent = this.getConnectedComponent(taskId);
      connectedComponent.forEach(id => toInvalidate.add(id));
    }

    this.invalidateSpecificCaches(Array.from(toInvalidate));
  }

  /** 处理更新连线的缓存失效 */
  private handleUpdateLinkInvalidation(taskIds: string[]): void {
    // 更新连线影响范围中等，主要影响直接相关的任务
    const toInvalidate = new Set<string>();

    for (const taskId of taskIds) {
      toInvalidate.add(taskId);

      // 获取直接相关的任务
      const directlyRelated = this.getDirectlyConnectedTasks(taskId);
      directlyRelated.forEach(task => toInvalidate.add(task.id));

      // 考虑缓存依赖关系
      const dependencies = this.cacheDependencies.get(taskId);
      if (dependencies) {
        dependencies.forEach(depId => toInvalidate.add(depId));
      }
    }

    this.invalidateSpecificCaches(Array.from(toInvalidate));
  }

  /** 处理批量操作的缓存失效 */
  private handleBatchOperationInvalidation(taskIds: string[]): void {
    if (taskIds.length > 50) {
      // 大批量操作，全量清理更高效
      this.invalidateAllCaches();
      return;
    }

    // 中等批量操作，采用智能失效
    const toInvalidate = new Set<string>(taskIds);

    // 批量操作可能影响整个项目结构，扩大失效范围
    for (const taskId of taskIds) {
      const related = this.getDirectlyConnectedTasks(taskId);
      related.forEach(task => toInvalidate.add(task.id));
    }

    this.invalidateSpecificCaches(Array.from(toInvalidate));
  }

  /** 精确失效指定缓存 */
  private invalidateSpecificCaches(taskIds: string[]): void {
    for (const taskId of taskIds) {
      // 删除主缓存
      this.forwardMemo.delete(taskId);
      this.backwardMemo.delete(taskId);
      this.directConnectionCache.delete(taskId);

      // 删除访问统计
      this.cacheAccessStats.delete(taskId);

      // 删除依赖关系
      this.cacheDependencies.delete(taskId);

      // 删除其他任务对此任务的依赖
      this.cacheDependencies.forEach((deps, key) => {
        deps.delete(taskId);
      });
    }

    // 拓扑缓存只在影响节点较多时才失效
    if (taskIds.length > 5) {
      this.topoOrder = null;
      this.topoIndex.clear();
    }
  }

  /** 获取递归上游任务（限制深度） */
  private getUpstreamTasksRecursive(taskId: string, maxDepth: number): string[] {
    const result = new Set<string>();
    const visited = new Set<string>();

    const dfs = (id: string, depth: number) => {
      if (depth >= maxDepth || visited.has(id)) return;
      visited.add(id);

      const predecessors = this.getTaskPredecessors(id).tasks;
      for (const task of predecessors) {
        result.add(task.id);
        dfs(task.id, depth + 1);
      }
    };

    dfs(taskId, 0);
    return Array.from(result);
  }

  /** 获取递归下游任务（限制深度） */
  private getDownstreamTasksRecursive(taskId: string, maxDepth: number): string[] {
    const result = new Set<string>();
    const visited = new Set<string>();

    const dfs = (id: string, depth: number) => {
      if (depth >= maxDepth || visited.has(id)) return;
      visited.add(id);

      const successors = this.getTaskSuccessors(id).tasks;
      for (const task of successors) {
        result.add(task.id);
        dfs(task.id, depth + 1);
      }
    };

    dfs(taskId, 0);
    return Array.from(result);
  }

  /** 获取连通分量 */
  private getConnectedComponent(taskId: string): string[] {
    const component = new Set<string>();
    const visited = new Set<string>();
    const stack = [taskId];

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (visited.has(current)) continue;

      visited.add(current);
      component.add(current);

      // 添加所有直接连接的任务
      const connected = this.getDirectlyConnectedTasks(current);
      for (const task of connected) {
        if (!visited.has(task.id)) {
          stack.push(task.id);
        }
      }
    }

    return Array.from(component);
  }

  /** 清理过期缓存 */
  private cleanupExpiredCaches(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    this.cacheAccessStats.forEach((stats, key) => {
      if (now - stats.lastAccess > this.CACHE_TTL) {
        expiredKeys.push(key);
      }
    });

    this.invalidateSpecificCaches(expiredKeys);
  }

  /** 限制缓存大小 */
  private limitCacheSize(): void {
    const totalCacheSize = this.forwardMemo.size + this.backwardMemo.size;

    if (totalCacheSize > this.MAX_CACHE_SIZE) {
      // 使用LRU策略清理缓存
      const sortedByAccess = Array.from(this.cacheAccessStats.entries())
        .sort((a, b) => a[1].lastAccess - b[1].lastAccess);

      const toRemove = Math.ceil(totalCacheSize * 0.2); // 清理20%
      const keysToRemove = sortedByAccess.slice(0, toRemove).map(([key]) => key);

      this.invalidateSpecificCaches(keysToRemove);
    }
  }

  /** 记录缓存访问 */
  private recordCacheAccess(taskId: string, isHit: boolean): void {
    const stats = this.cacheAccessStats.get(taskId) || { hits: 0, lastAccess: 0 };

    if (isHit) {
      stats.hits += 1;
    }
    stats.lastAccess = Date.now();

    this.cacheAccessStats.set(taskId, stats);
  }

  /** 建立缓存依赖关系 */
  private establishCacheDependency(fromTaskId: string, toTaskId: string): void {
    if (!this.cacheDependencies.has(fromTaskId)) {
      this.cacheDependencies.set(fromTaskId, new Set());
    }
    this.cacheDependencies.get(fromTaskId)!.add(toTaskId);
  }

  /** 为调试提供连线关系的可视化信息 */
  public getDebugInfo(): LinkDebugInfo {
    const tasks = this.store.getDataManager().getTasks(false);
    const isolatedTasks = tasks.filter(task => {
      const hasIncoming = this.toLinksMap.has(task.id) && this.toLinksMap.get(task.id)!.length > 0;
      const hasOutgoing = this.fromLinksMap.has(task.id) && this.fromLinksMap.get(task.id)!.length > 0;
      return !hasIncoming && !hasOutgoing;
    }).map(task => task.id);

    return {
      totalLinks: this.links.length,
      totalTasks: tasks.length,
      connectionComponents: this.countConnectionComponents(),
      hasCycle: this.hasCycle(),
      topologicalOrder: this.computeTopo(),
      isolatedTasks
    };
  }

  /** 计算连通分量数量 */
  private countConnectionComponents(): number {
    const tasks = this.store.getDataManager().getTasks(false);
    const visited = new Set<string>();
    let components = 0;

    const dfs = (taskId: string) => {
      if (visited.has(taskId)) return;
      visited.add(taskId);

      // 访问所有直接连接的任务
      const connected = this.getDirectlyConnectedTasks(taskId);
      for (const task of connected) {
        if (!visited.has(task.id)) {
          dfs(task.id);
        }
      }
    };

    for (const task of tasks) {
      if (!visited.has(task.id)) {
        dfs(task.id);
        components++;
      }
    }

    return components;
  }

  // ==================== 性能监控和统计 ====================

  /** 获取缓存性能统计 */
  public getCachePerformanceStats(): {
    totalCacheSize: number;
    hitRate: number;
    memoryUsage: string;
    expiredEntries: number;
    dependencyCount: number;
  } {
    const totalHits = Array.from(this.cacheAccessStats.values())
      .reduce((sum, stats) => sum + stats.hits, 0);
    const totalAccesses = this.cacheAccessStats.size;

    const now = Date.now();
    const expiredEntries = Array.from(this.cacheAccessStats.values())
      .filter(stats => now - stats.lastAccess > this.CACHE_TTL).length;

    return {
      totalCacheSize: this.forwardMemo.size + this.backwardMemo.size,
      hitRate: totalAccesses > 0 ? (totalHits / totalAccesses) * 100 : 0,
      memoryUsage: this.estimateMemoryUsage(),
      expiredEntries,
      dependencyCount: this.cacheDependencies.size
    };
  }

  /** 估算内存使用量 */
  private estimateMemoryUsage(): string {
    const linkSize = this.links.length * 100;
    const forwardCacheSize = this.forwardMemo.size * 300;
    const backwardCacheSize = this.backwardMemo.size * 300;
    const dependencySize = this.cacheDependencies.size * 50;
    const statsSize = this.cacheAccessStats.size * 50;

    const totalBytes = linkSize + forwardCacheSize + backwardCacheSize + dependencySize + statsSize;

    if (totalBytes > 1024 * 1024) {
      return `${(totalBytes / 1024 / 1024).toFixed(2)} MB`;
    } else if (totalBytes > 1024) {
      return `${(totalBytes / 1024).toFixed(2)} KB`;
    } else {
      return `${totalBytes} B`;
    }
  }
}