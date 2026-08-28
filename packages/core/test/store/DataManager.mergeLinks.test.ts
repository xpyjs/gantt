import { describe, expect, it, vi } from 'vitest';
import { DataManager } from '../../src/store/DataManager';
import { LinkManager } from '../../src/store/LinkManager';
import { EventBus, EventName } from '../../src/event';
import dayjs from '../../src/utils/time';
import { ILink } from '../../src/types/link';

/**
 * merge 连线重定向集成测试：DataManager 在合并段时调用
 * LinkManager.redirectTaskLinks，并把重定向结果作为普通的连线变更
 * 逐条抛出 —— UPDATE_LINK（成对携带新旧数据）与 DELETE_LINK
 * （携带删除前数据），供外部同步数据源与实现撤销。
 */

function createManager(overrides: Record<string, any> = {}) {
  const options: Record<string, any> = {
    expand: { show: true, enabled: true },
    milestone: { show: false },
    summary: { show: false },
    dateFormat: 'YYYY-MM-DD HH:mm:ss',
    fields: {
      id: 'id',
      children: 'children',
      name: 'name',
      type: 'type',
      startTime: 'startTime',
      endTime: 'endTime',
      progress: 'progress',
      duration: 'duration',
      split: 'split'
    },
    split: { enabled: true, overlap: 'merge' },
    bar: { move: { link: { child: 'none', parent: 'none' } } },
    ...overrides
  };

  const event = new EventBus();

  const dataManager = new DataManager({} as any, event);
  const linkManager = new LinkManager(
    {
      getDataManager: () => ({
        getTaskById: (id: string) => dataManager.getTaskById(id),
        getTasks: () => []
      })
    } as any,
    event
  );

  const store: any = {
    getOptionManager: () => ({ getOptions: () => options }),
    updateTime: vi.fn(),
    getTimeAxis: () => ({ getCellUnit: () => 'day' }),
    getWorkCalendar: () => ({
      workOffset: (start: any, n: number) => start.add(n, 'day'),
      workDiff: (start: any, end: any) => end.diff(start, 'day'),
      currentWorkTime: (t: any) => t
    }),
    getDataManager: () => dataManager,
    getLinkManager: () => linkManager
  };

  // 重新绑定 store（含完整依赖）
  (dataManager as any).store = store;

  return { dm: dataManager, lm: linkManager, event, store, options };
}

/** 收集一次操作抛出的连线事件（按发生顺序） */
function collectLinkEvents(event: EventBus) {
  const updates: { link: ILink; old: ILink }[] = [];
  const deletes: ILink[] = [];
  const order: string[] = [];
  event.on(EventName.UPDATE_LINK, (link: ILink, old: ILink) => {
    updates.push({ link, old });
    order.push(`update:${link.id}`);
  });
  event.on(EventName.DELETE_LINK, (link: ILink) => {
    deletes.push(link);
    order.push(`delete:${link.id}`);
  });
  return { updates, deletes, order };
}

function splitData(): any[] {
  return [
    {
      id: 'p1',
      name: '任务1',
      split: true,
      children: [
        { id: 's1', name: '段1', startTime: '2026-07-25', endTime: '2026-07-30' },
        { id: 's2', name: '段2', startTime: '2026-08-03', endTime: '2026-08-05' },
        { id: 's3', name: '段3', startTime: '2026-08-10', endTime: '2026-08-12' }
      ]
    },
    { id: 't2', name: '外部任务', startTime: '2026-07-01', endTime: '2026-07-10' }
  ];
}

describe('DataManager merge 连线重定向', () => {
  it('合并段时重定向走 UPDATE_LINK、自连移除走 DELETE_LINK，均携带旧数据', () => {
    const { dm, lm, event } = createManager();
    dm.setData(splitData(), true);
    lm.setLinks([
      { id: 'l1', from: 't2', to: 's2' },
      { id: 'l2', from: 's2', to: 's3' },
      { id: 'l3', from: 's1', to: 's2' },
      { id: 'l4', from: 't2', to: 's3' }
    ]);

    const { updates, deletes } = collectLinkEvents(event);

    // s2 拖入 s1 范围：s2 并入 s1
    const s2 = dm.getTaskById('s2')!;
    dm.updateTaskTime(s2, dayjs('2026-07-26'), dayjs('2026-07-28'), 'both');
    dm.fitTaskTime(s2, 'both');

    // 段已合并
    expect(dm.getTaskById('p1')!.children.map((c: any) => c.id)).toEqual(['s1', 's3']);

    // 连线重定向：l1(t2→s2)→t2→s1；l2(s2→s3)→s1→s3；l3(s1→s2) 自连移除；l4 不变
    const links = lm.getLinks();
    expect(links.find(l => l.id === 'l1')).toEqual({ id: 'l1', from: 't2', to: 's1' });
    expect(links.find(l => l.id === 'l2')).toEqual({ id: 'l2', from: 's1', to: 's3' });
    expect(links.find(l => l.id === 'l3')).toBeUndefined();
    expect(links.find(l => l.id === 'l4')).toEqual({ id: 'l4', from: 't2', to: 's3' });

    // 事件数据：重定向的两条走 UPDATE_LINK 且成对携带新旧
    expect(updates).toHaveLength(2);
    expect(updates[0]).toEqual({
      link: { id: 'l1', from: 't2', to: 's1' },
      old: { id: 'l1', from: 't2', to: 's2' }
    });
    expect(updates[1]).toEqual({
      link: { id: 'l2', from: 's1', to: 's3' },
      old: { id: 'l2', from: 's2', to: 's3' }
    });

    // 自连移除的一条走 DELETE_LINK，携带删除前数据
    expect(deletes).toEqual([{ id: 'l3', from: 's1', to: 's2' }]);
  });

  it('连线变更事件在行级刷新 UPDATE_TASK 之前抛出（视图先重绘连线再刷新行）', () => {
    const { dm, lm, event } = createManager();
    dm.setData(splitData(), true);
    lm.setLinks([{ id: 'l1', from: 't2', to: 's2' }]);

    const order: string[] = [];
    event.on(EventName.UPDATE_LINK, () => order.push('update_link'));
    event.on(EventName.DELETE_LINK, () => order.push('delete_link'));
    event.on(EventName.UPDATE_TASK, (t: any) => {
      if (t.id === 'p1') order.push('update_task_parent');
    });

    const s2 = dm.getTaskById('s2')!;
    dm.updateTaskTime(s2, dayjs('2026-07-26'), dayjs('2026-07-28'), 'both');
    dm.fitTaskTime(s2, 'both');

    // 连线变更事件先于 split 父的行级刷新（段滑块同步）
    expect(order.indexOf('update_link')).toBeGreaterThan(-1);
    expect(order.lastIndexOf('update_task_parent')).toBeGreaterThan(
      order.indexOf('update_link')
    );
  });

  it('合并的段没有关联连线时不抛任何连线事件', () => {
    const { dm, lm, event } = createManager();
    dm.setData(splitData(), true);
    lm.setLinks([{ id: 'l4', from: 't2', to: 's3' }]);

    const { updates, deletes } = collectLinkEvents(event);

    const s2 = dm.getTaskById('s2')!;
    dm.updateTaskTime(s2, dayjs('2026-07-26'), dayjs('2026-07-28'), 'both');
    dm.fitTaskTime(s2, 'both');

    expect(updates).toHaveLength(0);
    expect(deletes).toHaveLength(0);
    expect(lm.getLinks()).toHaveLength(1);
  });

  it('链式合并逐条抛出真实变更，逆序应用旧数据可完整还原（撤销契约）', () => {
    const { dm, lm, event } = createManager();
    // s1 与 s2 共享边界时刻（初始数据接触不合并），s3 与 s2 交叠后触发链式
    dm.setData(
      [
        {
          id: 'p1',
          split: true,
          children: [
            { id: 's1', startTime: '2026-07-01', endTime: '2026-07-06' },
            { id: 's2', startTime: '2026-07-06', endTime: '2026-07-08' },
            { id: 's3', startTime: '2026-07-10', endTime: '2026-07-16' }
          ]
        },
        { id: 't2', startTime: '2026-06-01', endTime: '2026-06-10' },
        { id: 'm1', startTime: '2026-06-20', endTime: '2026-06-22' }
      ],
      true
    );
    // l4 指向孤立任务 m1，避免与 l1 重定向结果构成依赖环
    const originalLinks: ILink[] = [
      { id: 'l1', from: 't2', to: 's2' },
      { id: 'l2', from: 's2', to: 's3' },
      { id: 'l3', from: 't2', to: 's3' },
      { id: 'l4', from: 's3', to: 'm1' }
    ];
    lm.setLinks(originalLinks);

    const { updates, deletes, order } = collectLinkEvents(event);

    // s3（6 天）保持时长左移 3 天：与 s2 交叠，链式合并全部并入 s1
    const s3 = dm.getTaskById('s3')!;
    dm.updateTaskTime(s3, dayjs('2026-07-07'), dayjs('2026-07-13'), 'both');
    dm.fitTaskTime(s3, 'both');

    expect(dm.getTaskById('p1')!.children.map((c: any) => c.id)).toEqual(['s1']);

    // 第一轮合并（s1/s2 初始接触，先合并）：l1、l2 重定向到 s1
    // 第二轮合并（s3 并入 s1）：
    //   l2(s1→s3) 自连移除；l3(t2→s3) 与 l1 重复移除；l4 重定向 s1→m1
    expect(order).toEqual([
      'update:l1',
      'update:l2',
      'delete:l2',
      'delete:l3',
      'update:l4'
    ]);

    // 每个事件均为当时的真实状态：l2 先被重定向（s2→s3 变 s1→s3），
    // 随后因自连被移除（删除时携带的是删除前状态 s1→s3）
    const l1Update = updates.find(u => u.link.id === 'l1')!;
    expect(l1Update).toEqual({
      link: { id: 'l1', from: 't2', to: 's1' },
      old: { id: 'l1', from: 't2', to: 's2' }
    });
    expect(updates.find(u => u.link.id === 'l2')!.link).toEqual({
      id: 'l2',
      from: 's1',
      to: 's3'
    });
    expect(deletes.find(l => l.id === 'l2')).toEqual({
      id: 'l2',
      from: 's1',
      to: 's3'
    });
    expect(updates.find(u => u.link.id === 'l4')!).toEqual({
      link: { id: 'l4', from: 's1', to: 'm1' },
      old: { id: 'l4', from: 's3', to: 'm1' }
    });

    // 撤销契约验证：从当前连线出发，逆序应用每个事件的旧数据
    const current = lm.getLinks().map(l => ({ ...l }));
    for (let i = order.length - 1; i >= 0; i--) {
      const entry = order[i];
      const id = entry.split(':')[1];
      if (entry.startsWith('update')) {
        const u = updates.filter(x => x.link.id === id).pop()!;
        const idx = current.findIndex(l => l.id === id);
        current[idx] = { ...u.old };
        updates.splice(updates.indexOf(u), 1);
      } else {
        const d = deletes.find(x => x.id === id)!;
        current.push({ ...d });
      }
    }

    expect(current).toHaveLength(4);
    expect(current.map(l => `${l.from}->${l.to}`).sort()).toEqual(
      ['s2->s3', 's3->m1', 't2->s2', 't2->s3'].sort()
    );
  });

  it('重新 setData 后再次合并，连线事件正常抛出', () => {
    const { dm, lm, event } = createManager();
    dm.setData(splitData(), true);
    lm.setLinks([{ id: 'l1', from: 't2', to: 's2' }]);

    const s2 = dm.getTaskById('s2')!;
    dm.updateTaskTime(s2, dayjs('2026-07-26'), dayjs('2026-07-28'), 'both');
    dm.fitTaskTime(s2, 'both');
    expect(lm.getLinks()[0].to).toBe('s1');

    // 重设数据（外部撤销后回写数据源的场景）：连线恢复引用 s2
    dm.setData(splitData(), true);
    lm.setLinks([{ id: 'l1', from: 't2', to: 's2' }]);

    // 再次合并同一对段，事件再次正常抛出
    const { updates } = collectLinkEvents(event);
    const s2Again = dm.getTaskById('s2')!;
    dm.updateTaskTime(s2Again, dayjs('2026-07-26'), dayjs('2026-07-28'), 'both');
    dm.fitTaskTime(s2Again, 'both');

    expect(updates).toHaveLength(1);
    expect(updates[0].link.to).toBe('s1');
    expect(updates[0].old.to).toBe('s2');
  });
});
