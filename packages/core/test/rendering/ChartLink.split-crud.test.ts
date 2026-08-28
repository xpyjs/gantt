import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import Konva from 'konva';
import dayjs, { type Dayjs } from 'dayjs';
import { LinkGroup } from '../../src/rendering/chart/ChartLink';
import { OptionManager } from '../../src/store/OptionManager';
import { LinkManager } from '../../src/store/LinkManager';
import { EventBus, EventName, ErrorType } from '../../src/event';
import { Task } from '../../src/models/Task';
import { ILink } from '../../src/types';
import { stubCanvasContext } from './helpers/canvasStub';

stubCanvasContext();

const PX_PER_DAY = 40;
const AXIS_START = dayjs('2026-07-01');
const HEADER_HEIGHT = 40;
const ROW_HEIGHT = 40;
const ROW_CENTER_Y = HEADER_HEIGHT + ROW_HEIGHT / 2;

const timeAxis = {
  getCellUnit: () => 'day',
  getTimeLeft: (t: Dayjs) => t.diff(AXIS_START, 'day', true) * PX_PER_DAY,
  getEndTime: () => dayjs('2026-09-01')
};

let optionManager: OptionManager;
let event: EventBus;
let linkManager: LinkManager;
let context: any;
let stage: Konva.Stage;
let layer: Konva.Layer;
let taskMap: Map<string, Task>;
let links: ILink[];

function setup(options: Record<string, any> = {}): void {
  optionManager = new OptionManager();
  optionManager.setOptions({
    row: { height: ROW_HEIGHT },
    header: { height: HEADER_HEIGHT },
    bar: { height: 20, show: true },
    links: {
      show: true,
      create: { enabled: true, mode: 'always' },
      move: { enabled: true }
    },
    split: { enabled: true, overlap: 'free' },
    ...options
  });

  event = new EventBus();

  const store: any = {
    getOptionManager: () => optionManager,
    getTimeAxis: () => timeAxis,
    getWorkCalendar: () => ({
      workOffset: (start: Dayjs, n: number) => start.add(n, 'day'),
      workDiff: (start: Dayjs, end: Dayjs) => end.diff(start, 'day', true)
    }),
    updateTime: vi.fn(),
    getDataManager: () => ({
      getTaskById: (id: string) => taskMap.get(id),
      isTaskVisible: () => true,
      getVisibleTasks: () => [...taskMap.values()].filter(t => !t.parent),
      // LinkManager.computeTopo 依赖（环检测）
      getTasks: () => [...taskMap.values()]
    }),
    getLinkManager: () => linkManager
  };

  linkManager = new LinkManager(store, event);

  context = {
    getOptions: () => optionManager.getOptions(),
    store,
    event
  };
}

function buildTask(data: any, flatIndex: number, parent?: Task): Task {
  const task = new Task(context.store, event, data, parent);
  task.flatIndex = flatIndex;
  taskMap.set(task.id, task);
  if (Array.isArray(data.children)) {
    task.children = data.children.map((c: any) =>
      buildTask(c, flatIndex, task)
    );
  }
  return task;
}

function splitData(): any {
  return {
    id: 'p1',
    name: '任务1',
    split: true,
    children: [
      { id: 's1', name: '段1', startTime: '2026-07-25', endTime: '2026-07-30' },
      { id: 's2', name: '段2', startTime: '2026-08-03', endTime: '2026-08-05' }
    ]
  };
}

function dispatchMouseEvent(type: string, x: number, y: number) {
  document.dispatchEvent(new MouseEvent(type, { clientX: x, clientY: y }));
}

/** 模拟从锚点拖拽创建连线 */
function dragFromAnchor(
  linkGroup: LinkGroup,
  anchorId: string,
  toX: number,
  toY: number = ROW_CENTER_Y
) {
  const anchor = layer.findOne(`#${anchorId}`)!;
  anchor.fire('mousedown', { evt: new MouseEvent('mousedown'), target: anchor });
  // Konva 的 setPointersPositions 读取 clientX/clientY（jsdom 容器位置为 0，
  // client 坐标即 stage 坐标）
  stage.setPointersPositions({ clientX: toX, clientY: toY });
  dispatchMouseEvent('mousemove', toX, toY);
  dispatchMouseEvent('mouseup', toX, toY);
}

beforeEach(() => {
  taskMap = new Map();
  links = [];
  setup();

  const container = document.createElement('div');
  document.body.appendChild(container);
  stage = new Konva.Stage({ container, width: 2000, height: 600 });
  layer = new Konva.Layer();
  stage.add(layer);
});

afterEach(() => {
  stage.destroy();
  document.body.innerHTML = '';
});

describe('ChartLink split 创建连线', () => {
  it('段与段之间创建 FS 连线：事件携带两端段 id', () => {
    const p1 = buildTask(splitData(), 0);
    const created: any[] = [];
    event.on(EventName.CREATE_LINK, (link: any) => created.push(link));

    const linkGroup = new LinkGroup(context, stage, layer);
    linkGroup.resize(2000, 600);
    linkGroup.render([p1]);

    // 从 s1 右锚点（段尾）拖到 s2 左半（段头）：FS
    dragFromAnchor(linkGroup, 'point-s1-right', 33 * PX_PER_DAY);

    expect(created).toHaveLength(1);
    expect(created[0].from).toBe('s1');
    expect(created[0].to).toBe('s2');
    expect(created[0].type).toBe('FS');
  });

  it('段与普通任务之间创建连线', () => {
    const p1 = buildTask(splitData(), 0);
    buildTask({ id: 't2', startTime: '2026-07-10', endTime: '2026-07-20' }, 1);
    const created: any[] = [];
    event.on(EventName.CREATE_LINK, (link: any) => created.push(link));

    const linkGroup = new LinkGroup(context, stage, layer);
    linkGroup.resize(2000, 600);
    linkGroup.render([p1, taskMap.get('t2')!]);

    // s1 右锚点拖到 t2 行（flatIndex 1）左端
    dragFromAnchor(linkGroup, 'point-s1-right', 9 * PX_PER_DAY, ROW_CENTER_Y + ROW_HEIGHT);

    expect(created).toHaveLength(1);
    expect(created[0].from).toBe('s1');
    expect(created[0].to).toBe('t2');
  });

  it('重复连线被拦截：LINK_EXIST，不再发出创建事件', () => {
    const p1 = buildTask(splitData(), 0);
    links = [{ id: 'l1', from: 's1', to: 's2', type: 'FS' }];
    linkManager.setLinks(links as ILink[]);

    const created: any[] = [];
    const errors: any[] = [];
    event.on(EventName.CREATE_LINK, (link: any) => created.push(link));
    event.on(EventName.ERROR, (e: any) => errors.push(e));

    const linkGroup = new LinkGroup(context, stage, layer);
    linkGroup.resize(2000, 600);
    linkGroup.render([p1]);

    dragFromAnchor(linkGroup, 'point-s1-right', 33 * PX_PER_DAY);

    expect(created).toHaveLength(0);
    expect(errors).toContain(ErrorType.LINK_EXIST);
  });

  it('段自连被拦截：LINK_SAME', () => {
    const p1 = buildTask(splitData(), 0);
    const created: any[] = [];
    const errors: any[] = [];
    event.on(EventName.CREATE_LINK, (link: any) => created.push(link));
    event.on(EventName.ERROR, (e: any) => errors.push(e));

    const linkGroup = new LinkGroup(context, stage, layer);
    linkGroup.resize(2000, 600);
    linkGroup.render([p1]);

    // s1 右锚点拖回 s1 左端（F → S 自连）
    dragFromAnchor(linkGroup, 'point-s1-right', 24 * PX_PER_DAY);

    expect(created).toHaveLength(0);
    expect(errors).toContain(ErrorType.LINK_SAME);
  });

  it('环检测：已有 s1→s2 时反向 s2→s1 被拦截', () => {
    const p1 = buildTask(splitData(), 0);
    links = [{ id: 'l1', from: 's1', to: 's2', type: 'FS' }];
    linkManager.setLinks(links as ILink[]);

    const created: any[] = [];
    const errors: any[] = [];
    event.on(EventName.CREATE_LINK, (link: any) => created.push(link));
    event.on(EventName.ERROR, (e: any) => errors.push(e));

    const linkGroup = new LinkGroup(context, stage, layer);
    linkGroup.resize(2000, 600);
    linkGroup.render([p1]);

    // 从 s2 右锚点拖到 s1：反向连线成环
    dragFromAnchor(linkGroup, 'point-s2-right', 26 * PX_PER_DAY);

    expect(created).toHaveLength(0);
    expect(errors).toContain(ErrorType.LINK_CYCLE);
  });
});

describe('ChartLink split 修改连线', () => {
  /** 普通任务 t2 指向段 s1 的既有连线，拖 F 端点换目标段 */
  function dragEndpointTo(
    groupId: string,
    toX: number,
    toY: number = ROW_CENTER_Y
  ) {
    const group = layer.findOne(`#${groupId}`)!;
    const arrow = group.findOne<Konva.Arrow>('Arrow')!;
    group.fire('mousedown', { evt: new MouseEvent('mousedown'), target: group });
    arrow.fire('dragstart', { evt: new MouseEvent('mousedown'), target: arrow });
    stage.setPointersPositions({ clientX: toX, clientY: toY });
    dispatchMouseEvent('mousemove', toX, toY);
    dispatchMouseEvent('mouseup', toX, toY);
  }

  it('拖拽 F 端点到另一段：UPDATE_LINK 成对携带新数据与旧数据', () => {
    const p1 = buildTask(splitData(), 0);
    buildTask({ id: 't2', startTime: '2026-07-10', endTime: '2026-07-20' }, 1);
    links = [{ id: 'l1', from: 't2', to: 's1', type: 'FS' }];
    linkManager.setLinks(links as ILink[]);

    const updated: any[] = [];
    event.on(EventName.UPDATE_LINK, (link: any, old: any) =>
      updated.push({ link, old })
    );

    const linkGroup = new LinkGroup(context, stage, layer);
    linkGroup.resize(2000, 600);
    linkGroup.render([p1, taskMap.get('t2')!]);

    // 拖 F 端点到 s2 左半（S 端）：to 从 s1 变更为 s2
    dragEndpointTo('link-group-l1-t2-s1-FS', 33 * PX_PER_DAY);

    expect(updated).toHaveLength(1);
    // 新数据：目标段变更为 s2
    expect(updated[0].link.from).toBe('t2');
    expect(updated[0].link.to).toBe('s2');
    expect(updated[0].link.type).toBe('FS');
    // 旧数据：变更前的原始状态，供外部同步与撤销恢复
    expect(updated[0].old).toEqual({
      id: 'l1',
      from: 't2',
      to: 's1',
      type: 'FS'
    });
  });

  it('普通任务间修改连线不受影响（零影响）', () => {
    buildTask({ id: 't2', startTime: '2026-07-10', endTime: '2026-07-20' }, 0);
    buildTask({ id: 't3', startTime: '2026-07-25', endTime: '2026-07-30' }, 1);
    links = [{ id: 'l1', from: 't2', to: 't3', type: 'FS' }];
    linkManager.setLinks(links as ILink[]);

    const updated: any[] = [];
    event.on(EventName.UPDATE_LINK, (link: any) => updated.push(link));

    const linkGroup = new LinkGroup(context, stage, layer);
    linkGroup.resize(2000, 600);
    linkGroup.render([taskMap.get('t2')!, taskMap.get('t3')!]);

    // 拖 F 端点到 t3 行右半（F 端）：类型 FS → FF。
    // 拖到 S 端会生成与原连线相同的 t2→t3 FS，被 LINK_EXIST 拦截
    dragEndpointTo('link-group-l1-t2-t3-FS', 28 * PX_PER_DAY, ROW_CENTER_Y + ROW_HEIGHT);

    expect(updated).toHaveLength(1);
    expect(updated[0].from).toBe('t2');
    expect(updated[0].to).toBe('t3');
    expect(updated[0].type).toBe('FF');
  });
});

describe('ChartLink split 删除连线', () => {
  it('数据移除段间连线后全量渲染销毁对应视图', () => {
    const p1 = buildTask(splitData(), 0);
    buildTask({ id: 't2', startTime: '2026-07-10', endTime: '2026-07-20' }, 1);
    links = [
      { id: 'l1', from: 's1', to: 's2', type: 'FS' },
      { id: 'l2', from: 's2', to: 't2', type: 'FS' }
    ];
    linkManager.setLinks(links as ILink[]);

    const linkGroup = new LinkGroup(context, stage, layer);
    linkGroup.resize(2000, 600);
    linkGroup.render([p1, taskMap.get('t2')!]);

    expect(layer.findOne('#link-group-l1-s1-s2-FS')).toBeDefined();
    expect(layer.findOne('#link-group-l2-s2-t2-FS')).toBeDefined();

    // 删除段间连线 l1：外部更新数据后重新设置
    links = links.filter(l => (l as any).id !== 'l1');
    linkManager.setLinks(links as ILink[]);
    linkGroup.render([p1, taskMap.get('t2')!]);

    expect(layer.findOne('#link-group-l1-s1-s2-FS')).toBeUndefined();
    expect(layer.findOne('#link-group-l2-s2-t2-FS')).toBeDefined();
  });

  it('删除所有段间连线后锚点保留（锚点与连线独立）', () => {
    const p1 = buildTask(splitData(), 0);
    links = [{ id: 'l1', from: 's1', to: 's2', type: 'FS' }];
    linkManager.setLinks(links as ILink[]);

    const linkGroup = new LinkGroup(context, stage, layer);
    linkGroup.resize(2000, 600);
    linkGroup.render([p1]);

    linkManager.setLinks([]);
    linkGroup.render([p1]);

    expect(layer.findOne('#link-group-l1-s1-s2-FS')).toBeUndefined();
    // 段锚点仍在，可继续创建新连线
    expect(layer.findOne('#point-s1-right')).toBeDefined();
    expect(layer.findOne('#point-s2-left')).toBeDefined();
  });
});
