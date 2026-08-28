import { describe, expect, it, vi } from 'vitest';
import { LinkManager } from '../../src/store/LinkManager';
import { EventBus } from '../../src/event';

function makeStore(): any {
  return {
    getDataManager: () => ({
      getTaskById: (id: string) => ({ id }),
      getTasks: () => []
    })
  };
}

function makeManager(): LinkManager {
  return new LinkManager(makeStore(), new EventBus());
}

describe('LinkManager.redirectTaskLinks', () => {
  it('普通重定向：被合并段两端的连线端点替换为保留段', () => {
    const lm = makeManager();
    lm.setLinks([
      { id: 'l1', from: 'a', to: 'cur' },
      { id: 'l2', from: 'cur', to: 'b' },
      { id: 'l3', from: 'a', to: 'b' }
    ]);

    const result = lm.redirectTaskLinks('cur', 'prev');

    expect(result.updated).toHaveLength(2);
    expect(result.removed).toHaveLength(0);
    expect(lm.getLinks()).toEqual([
      { id: 'l3', from: 'a', to: 'b' },
      { id: 'l1', from: 'a', to: 'prev' },
      { id: 'l2', from: 'prev', to: 'b' }
    ]);

    // 新旧数据成对：link 为重定向后，old 为重定向前
    const l1 = result.updated.find(u => u.old.id === 'l1')!;
    expect(l1.link).toEqual({ id: 'l1', from: 'a', to: 'prev' });
    expect(l1.old).toEqual({ id: 'l1', from: 'a', to: 'cur' });
  });

  it('被合并段与保留段之间的连线（合并后自连）直接移除，旧数据入 removed', () => {
    const lm = makeManager();
    lm.setLinks([
      { id: 'l1', from: 'prev', to: 'cur' },
      { id: 'l2', from: 'cur', to: 'prev' },
      { id: 'l3', from: 'cur', to: 'b' }
    ]);

    const result = lm.redirectTaskLinks('cur', 'prev');

    expect(result.updated).toHaveLength(1);
    expect(result.removed).toEqual([
      { id: 'l1', from: 'prev', to: 'cur' },
      { id: 'l2', from: 'cur', to: 'prev' }
    ]);
    expect(lm.getLinks()).toEqual([{ id: 'l3', from: 'prev', to: 'b' }]);
  });

  it('重定向后与其他连线重复（同端点同类型）时移除', () => {
    const lm = makeManager();
    lm.setLinks([
      { id: 'l1', from: 'a', to: 'cur' },
      { id: 'l2', from: 'a', to: 'prev' }
    ]);

    const result = lm.redirectTaskLinks('cur', 'prev');

    // l1 重定向后与 l2 完全相同，保留先存在的 l2
    expect(result.updated).toHaveLength(0);
    expect(result.removed).toEqual([{ id: 'l1', from: 'a', to: 'cur' }]);
    expect(lm.getLinks()).toEqual([{ id: 'l2', from: 'a', to: 'prev' }]);
  });

  it('重定向后与其他连线类型不同时不视为重复', () => {
    const lm = makeManager();
    lm.setLinks([
      { id: 'l1', from: 'a', to: 'cur', type: 'SS' },
      { id: 'l2', from: 'a', to: 'prev' }
    ]);

    const result = lm.redirectTaskLinks('cur', 'prev');

    expect(result.updated).toHaveLength(1);
    expect(result.updated[0].link).toEqual({ id: 'l1', from: 'a', to: 'prev', type: 'SS' });
    expect(lm.getLinks()).toHaveLength(2);
  });

  it('重定向后成环的连线被移除', () => {
    const lm = makeManager();
    // 已有 prev→a；重定向 a→cur 为 a→prev 后形成 prev→a→prev 环
    lm.setLinks([
      { id: 'l1', from: 'prev', to: 'a' },
      { id: 'l2', from: 'a', to: 'cur' }
    ]);

    const result = lm.redirectTaskLinks('cur', 'prev');

    expect(result.updated).toHaveLength(0);
    expect(result.removed).toEqual([{ id: 'l2', from: 'a', to: 'cur' }]);
    expect(lm.getLinks()).toEqual([{ id: 'l1', from: 'prev', to: 'a' }]);
  });

  it('无关联连线时返回空结果且不触发 setLinks', () => {
    const lm = makeManager();
    lm.setLinks([{ id: 'l1', from: 'a', to: 'b' }]);
    const spy = vi.spyOn(lm, 'setLinks');

    const result = lm.redirectTaskLinks('cur', 'prev');

    expect(result.removed).toHaveLength(0);
    expect(result.updated).toHaveLength(0);
    expect(spy).not.toHaveBeenCalled();
    expect(lm.getLinks()).toHaveLength(1);
  });

  it('mergedId 与 targetId 相同时直接返回空结果', () => {
    const lm = makeManager();
    lm.setLinks([{ id: 'l1', from: 'a', to: 'cur' }]);

    const result = lm.redirectTaskLinks('cur', 'cur');

    expect(result.removed).toHaveLength(0);
    expect(result.updated).toHaveLength(0);
    expect(lm.getLinks()).toHaveLength(1);
  });

  it('邻接表同步更新：重定向后的连线可按新端点查询', () => {
    const lm = makeManager();
    lm.setLinks([{ id: 'l1', from: 'a', to: 'cur' }]);

    lm.redirectTaskLinks('cur', 'prev');

    expect(lm.getLinksByTaskId('cur')).toHaveLength(0);
    expect(lm.getLinksByTaskId('prev')).toHaveLength(1);
  });
});
