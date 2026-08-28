import { describe, expect, it, vi } from 'vitest';
import { DataManager } from '../../src/store/DataManager';
import { LinkManager } from '../../src/store/LinkManager';
import { EventName } from '../../src/event';
// 从 utils/time 引入以注册 isSameOrBefore 等插件（src 中的重叠策略依赖）
import dayjs from '../../src/utils/time';

/**
 * split 场景专用 mock 工厂。
 * options 对象提升到闭包中，同一实例贯穿始终，
 * 供运行时切换 split.enabled 的用例直接修改。
 * calendar 参数用于覆写工作日历行为（fitTaskTime 用例模拟适配偏移）。
 */
function createManager(
  overrides: Partial<Record<string, any>> = {},
  calendar: Partial<Record<string, any>> = {}
): any {
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
    split: { enabled: true, overlap: 'free' },
    bar: { move: { link: { child: 'none', parent: 'none' } } },
    ...overrides
  };

  const store: any = {
    getOptionManager: () => ({
      getOptions: () => options
    }),
    updateTime: vi.fn(),
    getTimeAxis: () => ({ getCellUnit: () => 'day' }),
    getWorkCalendar: () => ({
      workOffset: (start: any, n: number) => start.add(n, 'day'),
      workDiff: (start: any, end: any) => end.diff(start, 'day'),
      currentWorkTime: (t: any) => t,
      ...calendar
    })
  };

  const event: any = {
    emit: vi.fn()
  };

  const dm = new DataManager(store, event);
  // merge 合并段时会调用 LinkManager.redirectTaskLinks 重定向连线，
  // 与真实 Store 行为一致，这里挂一个真实实例（默认无连线）
  const linkManager = new LinkManager(
    { getDataManager: () => dm } as any,
    event as any
  );
  store.getLinkManager = () => linkManager;
  return { dm, event, store, options };
}

/**
 * 每次调用返回全新数据。
 * DataManager 会向 data 回写格式化时间、deleteTaskById 会 splice
 * children 数组，共享同一份数据会让用例之间互相污染。
 */
function makeSplitData(): any[] {
  return [
    {
      id: 'p1',
      name: '任务1',
      split: true,
      children: [
        { id: 's1', name: '段1', startTime: '2026-07-25', endTime: '2026-07-30' },
        { id: 's2', name: '段2', startTime: '2026-08-03', endTime: '2026-08-05' }
      ]
    },
    { id: 'other', name: '普通任务', startTime: '2026-09-01', endTime: '2026-09-02' }
  ];
}

describe('DataManager split', () => {
  describe('setData 包络派生', () => {
    it('数据导入后父任务时间为段的极值包络', () => {
      const { dm } = createManager();
      dm.setData(makeSplitData(), true);

      const p = dm.getTaskById('p1')!;
      expect(p.startTime?.isSame(dayjs('2026-07-25'))).toBe(true);
      expect(p.endTime?.isSame(dayjs('2026-08-05'))).toBe(true);
    });

    it('数据中显式给出的父时间被包络覆盖', () => {
      const { dm } = createManager();
      dm.setData(
        [
          {
            id: 'p1',
            split: true,
            startTime: '2026-01-01',
            endTime: '2026-01-02',
            children: [
              { id: 's1', startTime: '2026-07-25', endTime: '2026-07-30' }
            ]
          }
        ],
        true
      );

      const p = dm.getTaskById('p1')!;
      expect(p.startTime?.isSame(dayjs('2026-07-25'))).toBe(true);
      expect(p.endTime?.isSame(dayjs('2026-07-30'))).toBe(true);
    });

    it('数据更新（setData 二次调用）时包络跟随段集合变化', () => {
      const { dm } = createManager();
      dm.setData(makeSplitData(), true);

      // 移除较早的段1，仅保留段2
      dm.setData(
        [
          {
            id: 'p1',
            split: true,
            children: [
              { id: 's2', startTime: '2026-08-03', endTime: '2026-08-05' }
            ]
          }
        ],
        true
      );

      const p = dm.getTaskById('p1')!;
      expect(p.startTime?.isSame(dayjs('2026-08-03'))).toBe(true);
      expect(p.endTime?.isSame(dayjs('2026-08-05'))).toBe(true);
    });
  });

  describe('getVisibleTasks - 段不占行', () => {
    it('split 任务的子级不出现在可见行列表中', () => {
      const { dm } = createManager();
      dm.setData(makeSplitData(), true);

      const visibleIds = dm.getVisibleTasks().map((t: any) => t.id);
      expect(visibleIds).toContain('p1');
      expect(visibleIds).toContain('other');
      expect(visibleIds).not.toContain('s1');
      expect(visibleIds).not.toContain('s2');
    });

    it('段的 flatIndex 与父行保持一致（连线/基线定位依赖）', () => {
      const { dm } = createManager();
      dm.setData(makeSplitData(), true);

      const p = dm.getTaskById('p1')!;
      const s1 = dm.getTaskById('s1')!;
      const s2 = dm.getTaskById('s2')!;
      expect(s1.flatIndex).toBe(p.flatIndex);
      expect(s2.flatIndex).toBe(p.flatIndex);
    });

    it('普通树形任务的子级仍正常拍平（零影响）', () => {
      const { dm } = createManager({ split: { enabled: false, overlap: 'free' } });
      dm.setData(
        [
          {
            id: 'p',
            children: [{ id: 'c', startTime: '2026-07-25', endTime: '2026-07-26' }]
          }
        ],
        true
      );

      const visibleIds = dm.getVisibleTasks().map((t: any) => t.id);
      expect(visibleIds).toEqual(['p', 'c']);
    });
  });

  describe('getRenderTasks - 行任务 + 内联段', () => {
    it('返回可见行任务并内联展开段', () => {
      const { dm } = createManager();
      dm.setData(makeSplitData(), true);

      const renderIds = dm.getRenderTasks().map((t: any) => t.id);
      expect(renderIds).toEqual(['p1', 's1', 's2', 'other']);
    });

    it('段按开始时间升序内联', () => {
      const { dm } = createManager();
      dm.setData(
        [
          {
            id: 'p1',
            split: true,
            children: [
              { id: 'late', startTime: '2026-08-03', endTime: '2026-08-05' },
              { id: 'early', startTime: '2026-07-25', endTime: '2026-07-30' }
            ]
          }
        ],
        true
      );

      const renderIds = dm.getRenderTasks().map((t: any) => t.id);
      expect(renderIds).toEqual(['p1', 'early', 'late']);
    });

    it('split 关闭时 getRenderTasks 与 getVisibleTasks 等价（零影响）', () => {
      const { dm } = createManager({ split: { enabled: false, overlap: 'free' } });
      dm.setData(
        [
          {
            id: 'p1',
            split: true,
            children: [{ id: 's1', startTime: '2026-07-25', endTime: '2026-07-26' }]
          }
        ],
        true
      );

      expect(dm.getRenderTasks()).toEqual(dm.getVisibleTasks());
    });
  });

  describe('expandTask - split 任务无展开语义', () => {
    it('对 split 任务调用返回 false 且不改变可见行数', () => {
      const { dm } = createManager();
      dm.setData(makeSplitData(), true);

      const before = dm.getVisibleTasks().length;
      expect(dm.expandTask('p1', false)).toBe(false);
      expect(dm.getVisibleTasks().length).toBe(before);
    });

    it('不向 collapsedTaskIds 写入 split 任务', () => {
      const { dm } = createManager();
      dm.setData(makeSplitData(), true);

      dm.expandTask('p1', false);
      const p = dm.getTaskById('p1')!;
      // 未进入折叠集合，子级依旧内联
      expect(dm.isTaskVisible(dm.getTaskById('s1')!)).toBe(true);
      expect(p.children.length).toBe(2);
    });

    it('普通任务展开/收起行为不受影响（零影响）', () => {
      const { dm } = createManager();
      dm.setData(
        [
          {
            id: 'p',
            children: [{ id: 'c', startTime: '2026-07-25', endTime: '2026-07-26' }]
          }
        ],
        true
      );

      // 初始为展开态，子级可见
      expect(dm.getVisibleTasks().map((t: any) => t.id)).toEqual(['p', 'c']);

      // 第一次切换：收起
      expect(dm.expandTask('p', false)).toBe(true);
      expect(dm.getVisibleTasks().map((t: any) => t.id)).toEqual(['p']);

      // 第二次切换：重新展开
      expect(dm.expandTask('p', false)).toBe(true);
      expect(dm.getVisibleTasks().map((t: any) => t.id)).toEqual(['p', 'c']);
    });
  });

  describe('updateTaskTime - 包络跟随', () => {
    it('拖动段后父包络跟随移动', () => {
      const { dm } = createManager();
      dm.setData(makeSplitData(), true);

      const s1 = dm.getTaskById('s1')!;
      dm.updateTaskTime(s1, dayjs('2026-07-20'), dayjs('2026-07-24'), 'both');

      const p = dm.getTaskById('p1')!;
      expect(p.startTime?.isSame(dayjs('2026-07-20'))).toBe(true);
      expect(p.endTime?.isSame(dayjs('2026-08-05'))).toBe(true);
    });

    it('段右边界超出原包络时父包络扩展', () => {
      const { dm } = createManager();
      dm.setData(makeSplitData(), true);

      const s2 = dm.getTaskById('s2')!;
      dm.updateTaskTime(s2, dayjs('2026-08-03'), dayjs('2026-08-20'), 'right');

      const p = dm.getTaskById('p1')!;
      expect(p.endTime?.isSame(dayjs('2026-08-20'))).toBe(true);
    });

    it('中间段移动不影响包络（仍被两端覆盖）', () => {
      const { dm } = createManager();
      dm.setData(
        [
          {
            id: 'p1',
            split: true,
            children: [
              { id: 'left', startTime: '2026-07-01', endTime: '2026-07-05' },
              { id: 'mid', startTime: '2026-07-10', endTime: '2026-07-15' },
              { id: 'right', startTime: '2026-07-20', endTime: '2026-07-25' }
            ]
          }
        ],
        true
      );

      const mid = dm.getTaskById('mid')!;
      dm.updateTaskTime(mid, dayjs('2026-07-11'), dayjs('2026-07-14'), 'both');

      const p = dm.getTaskById('p1')!;
      expect(p.startTime?.isSame(dayjs('2026-07-01'))).toBe(true);
      expect(p.endTime?.isSame(dayjs('2026-07-25'))).toBe(true);
    });

    it('直接写入 split 父时间被包络覆盖（数据 = 视图）', () => {
      const { dm } = createManager();
      dm.setData(makeSplitData(), true);

      const p = dm.getTaskById('p1')!;
      dm.updateTaskTime(p, dayjs('2026-06-01'), dayjs('2026-06-10'), 'both');

      expect(p.startTime?.isSame(dayjs('2026-07-25'))).toBe(true);
      expect(p.endTime?.isSame(dayjs('2026-08-05'))).toBe(true);
    });

    it('普通任务时间更新不触发包络语义（零影响）', () => {
      const { dm } = createManager({ split: { enabled: false, overlap: 'free' } });
      dm.setData([
        { id: 't', startTime: '2026-07-01', endTime: '2026-07-02' }
      ], true);

      const t = dm.getTaskById('t')!;
      dm.updateTaskTime(t, dayjs('2026-08-01'), dayjs('2026-08-02'), 'both');
      expect(t.startTime?.isSame(dayjs('2026-08-01'))).toBe(true);
    });
  });

  describe('deleteTaskById - 段删除后包络收缩', () => {
    it('删除边界段后父包络收缩', () => {
      const { dm } = createManager();
      dm.setData(makeSplitData(), true);

      expect(dm.deleteTaskById('s1')).toBe(true);

      const p = dm.getTaskById('p1')!;
      expect(p.startTime?.isSame(dayjs('2026-08-03'))).toBe(true);
      expect(p.endTime?.isSame(dayjs('2026-08-05'))).toBe(true);
    });

    it('删除非 split 任务不受影响（零影响）', () => {
      const { dm } = createManager();
      dm.setData(makeSplitData(), true);

      expect(dm.deleteTaskById('other')).toBe(true);
      expect(dm.getTaskById('p1')?.startTime?.isSame(dayjs('2026-07-25'))).toBe(true);
    });
  });

  describe('refreshSplitState - 运行时开关', () => {
    it('开启后已导入的数据立即应用包络', () => {
      const { dm, options } = createManager({
        split: { enabled: false, overlap: 'free' }
      });
      dm.setData(makeSplitData(), true);

      // 关闭状态下父时间保持数据原值（数据未给出则为空）
      const p = dm.getTaskById('p1')!;
      expect(p.startTime).toBeUndefined();

      // 运行时切换开关后刷新
      options.split.enabled = true;
      dm.refreshSplitState();

      expect(p.startTime?.isSame(dayjs('2026-07-25'))).toBe(true);
      expect(p.endTime?.isSame(dayjs('2026-08-05'))).toBe(true);
    });

    it('刷新后可见列表重建（段回到内联状态）', () => {
      const { dm, options } = createManager({
        split: { enabled: false, overlap: 'free' }
      });
      dm.setData(makeSplitData(), true);

      // 先以关闭状态访问一次，建立缓存（此时子级按普通树形拍平为独立行）
      const closedIds = dm.getVisibleTasks().map((t: any) => t.id);
      expect(closedIds).toContain('s1');

      options.split.enabled = true;
      dm.refreshSplitState();

      const visibleIds = dm.getVisibleTasks().map((t: any) => t.id);
      expect(visibleIds).not.toContain('s1');
    });
  });

  describe('事件契约', () => {
    it('包络派生通过 UPDATE_TASK 事件通知视图', () => {
      const { dm, event } = createManager();
      dm.setData(
        [
          {
            id: 'p1',
            split: true,
            children: [{ id: 's1', startTime: '2026-07-25', endTime: '2026-07-30' }]
          }
        ],
        true
      );

      expect(event.emit).toHaveBeenCalledWith(EventName.UPDATE_TASK, expect.anything());
    });
  });

  describe('forbid 策略 - 段夹取', () => {
    it('右缘拉伸被右侧段的起点挡住（贴边允许）', () => {
      const { dm } = createManager({ split: { enabled: true, overlap: 'forbid' } });
      dm.setData(makeSplitData(), true);

      const s1 = dm.getTaskById('s1')!;
      dm.updateTaskTime(s1, dayjs('2026-07-25'), dayjs('2026-08-04'), 'right');

      // 段2起始于 08-03，段1右缘最多贴到该时刻
      expect(s1.endTime?.isSame(dayjs('2026-08-03'))).toBe(true);
    });

    it('左缘拉伸被左侧段的终点挡住（贴边允许）', () => {
      const { dm } = createManager({ split: { enabled: true, overlap: 'forbid' } });
      dm.setData(makeSplitData(), true);

      const s2 = dm.getTaskById('s2')!;
      dm.updateTaskTime(s2, dayjs('2026-07-26'), dayjs('2026-08-05'), 'left');

      // 段1结束于 07-30，段2左缘最多贴到该时刻
      expect(s2.startTime?.isSame(dayjs('2026-07-30'))).toBe(true);
    });

    it('整体左移：时长保持，起点被左边界顶住', () => {
      const { dm } = createManager({ split: { enabled: true, overlap: 'forbid' } });
      dm.setData(makeSplitData(), true);

      const s2 = dm.getTaskById('s2')!;
      dm.updateTaskTime(s2, dayjs('2026-07-20'), dayjs('2026-07-22'), 'both');

      // 左边界 07-30，时长 2 天，平移后贴边放置
      expect(s2.startTime?.isSame(dayjs('2026-07-30'))).toBe(true);
      expect(s2.endTime?.isSame(dayjs('2026-08-01'))).toBe(true);
    });

    it('整体右移：先满足左边界，再被右边界回退', () => {
      const { dm } = createManager({ split: { enabled: true, overlap: 'forbid' } });
      dm.setData(
        [
          {
            id: 'p1',
            split: true,
            children: [
              { id: 's1', startTime: '2026-07-01', endTime: '2026-07-05' },
              { id: 's2', startTime: '2026-07-10', endTime: '2026-07-15' },
              { id: 's3', startTime: '2026-07-20', endTime: '2026-07-25' }
            ]
          }
        ],
        true
      );

      const s2 = dm.getTaskById('s2')!;
      dm.updateTaskTime(s2, dayjs('2026-07-18'), dayjs('2026-07-23'), 'both');

      // 右边界 07-20 回退，时长 5 天保持，起点退到 07-15，未压过左边界
      expect(s2.startTime?.isSame(dayjs('2026-07-15'))).toBe(true);
      expect(s2.endTime?.isSame(dayjs('2026-07-20'))).toBe(true);
    });

    it('初始数据就交叠的段不参与夹取（无解交叠不死锁）', () => {
      const { dm } = createManager({ split: { enabled: true, overlap: 'forbid' } });
      dm.setData(
        [
          {
            id: 'p1',
            split: true,
            children: [
              { id: 's1', startTime: '2026-07-25', endTime: '2026-08-04' },
              { id: 's2', startTime: '2026-08-03', endTime: '2026-08-05' }
            ]
          }
        ],
        true
      );

      const s2 = dm.getTaskById('s2')!;
      dm.updateTaskTime(s2, dayjs('2026-07-20'), dayjs('2026-07-22'), 'both');

      // 段1与段2初始交叠，既不算左段也不算右段，移动不受限
      expect(s2.startTime?.isSame(dayjs('2026-07-20'))).toBe(true);
      expect(s2.endTime?.isSame(dayjs('2026-07-22'))).toBe(true);
    });

    it('夹取后跨度塌缩为非正时保持原时间（防御行为）', () => {
      const { dm } = createManager({ split: { enabled: true, overlap: 'forbid' } });
      dm.setData(makeSplitData(), true);

      const s2 = dm.getTaskById('s2')!;
      // 退化的输入（起点晚于终点），夹取判定后触发塌缩保护
      dm.updateTaskTime(s2, dayjs('2026-08-10'), dayjs('2026-08-08'), 'both');

      expect(s2.startTime?.isSame(dayjs('2026-08-03'))).toBe(true);
      expect(s2.endTime?.isSame(dayjs('2026-08-05'))).toBe(true);
    });

    it('顶住边界后再拖：不写入、不触发事件、不记录旧值（保持静止）', () => {
      const { dm, event } = createManager({ split: { enabled: true, overlap: 'forbid' } });
      dm.setData(makeSplitData(), true);

      const s1 = dm.getTaskById('s1')!;
      // 先拖到贴住段2起点（有效移动）
      dm.updateTaskTime(s1, dayjs('2026-07-25'), dayjs('2026-08-03'), 'right');
      expect(s1.endTime?.isSame(dayjs('2026-08-03'))).toBe(true);

      const updateCalls = event.emit.mock.calls.filter(
        c => c[0] === EventName.UPDATE_TASK
      ).length;
      const oldTasks: any[] = [];

      // 继续向右拖（越过边界）：夹取结果与当前时间一致，静默跳过
      dm.updateTaskTime(s1, dayjs('2026-07-25'), dayjs('2026-08-04'), 'right', oldTasks);

      expect(s1.endTime?.isSame(dayjs('2026-08-03'))).toBe(true);
      // 无新增更新事件（不触发重渲染，避免与鼠标位置交替渲染的闪烁）
      expect(
        event.emit.mock.calls.filter(c => c[0] === EventName.UPDATE_TASK).length
      ).toBe(updateCalls);
      // 无变化不记录旧值（整次拖拽顶死时无 move 事件，无撤销负担）
      expect(oldTasks).toHaveLength(0);
    });

    it('free 策略不做任何夹取（默认零影响）', () => {
      const { dm } = createManager();
      dm.setData(makeSplitData(), true);

      const s1 = dm.getTaskById('s1')!;
      dm.updateTaskTime(s1, dayjs('2026-07-25'), dayjs('2026-08-04'), 'right');

      // 自由策略下段1可以直接压过段2
      expect(s1.endTime?.isSame(dayjs('2026-08-04'))).toBe(true);
    });

    it('forbid 只对段生效，普通任务时间直接写入', () => {
      const { dm } = createManager({ split: { enabled: true, overlap: 'forbid' } });
      dm.setData(makeSplitData(), true);

      const other = dm.getTaskById('other')!;
      dm.updateTaskTime(other, dayjs('2026-09-01'), dayjs('2026-09-10'), 'both');

      expect(other.startTime?.isSame(dayjs('2026-09-01'))).toBe(true);
      expect(other.endTime?.isSame(dayjs('2026-09-10'))).toBe(true);
    });
  });

  describe('merge 策略 - 段合并', () => {
    it('拖拽中不合并：鼠标未松开前段保持分离（可自由穿越）', () => {
      const { dm } = createManager({ split: { enabled: true, overlap: 'merge' } });
      dm.setData(makeSplitData(), true);

      const s2 = dm.getTaskById('s2')!;
      // 松开前：直接压进段1范围（甚至穿过），不发生合并
      dm.updateTaskTime(s2, dayjs('2026-07-26'), dayjs('2026-07-28'), 'both');

      const p = dm.getTaskById('p1')!;
      expect(p.children.length).toBe(2);
      expect(s2.startTime?.isSame(dayjs('2026-07-26'))).toBe(true);
      expect(s2.endTime?.isSame(dayjs('2026-07-28'))).toBe(true);

      // 穿越到段1左侧仍是两段
      dm.updateTaskTime(s2, dayjs('2026-07-18'), dayjs('2026-07-20'), 'both');
      expect(p.children.length).toBe(2);
      expect(s2.startTime?.isSame(dayjs('2026-07-18'))).toBe(true);
    });

    it('鼠标松开后接触（共享边界时刻）的段合并为一个段', () => {
      const { dm } = createManager({ split: { enabled: true, overlap: 'merge' } });
      dm.setData(makeSplitData(), true);

      const s2 = dm.getTaskById('s2')!;
      dm.updateTaskTime(s2, dayjs('2026-07-30'), dayjs('2026-08-01'), 'both');
      // 模拟鼠标松开：拖拽结束钩子
      dm.fitTaskTime(s2, 'both');

      const p = dm.getTaskById('p1')!;
      expect(p.children.length).toBe(1);
      expect(p.children[0].id).toBe('s1');
      expect(p.children[0].startTime?.isSame(dayjs('2026-07-25'))).toBe(true);
      expect(p.children[0].endTime?.isSame(dayjs('2026-08-01'))).toBe(true);
      expect(p.startTime?.isSame(dayjs('2026-07-25'))).toBe(true);
      expect(p.endTime?.isSame(dayjs('2026-08-01'))).toBe(true);
    });

    it('松开后交叠合并取更宽范围（被拖段结束更晚）', () => {
      const { dm } = createManager({ split: { enabled: true, overlap: 'merge' } });
      dm.setData(makeSplitData(), true);

      // 整体拖拽保持时长：s2（2 天）左移 5 天，交叠 s1 且结束更晚
      const s2 = dm.getTaskById('s2')!;
      dm.updateTaskTime(s2, dayjs('2026-07-29'), dayjs('2026-07-31'), 'both');
      dm.fitTaskTime(s2, 'both');

      const p = dm.getTaskById('p1')!;
      expect(p.children.length).toBe(1);
      expect(p.children[0].endTime?.isSame(dayjs('2026-07-31'))).toBe(true);
    });

    it('松开后被拖段完全落入前段范围时保留前段时间', () => {
      const { dm } = createManager({ split: { enabled: true, overlap: 'merge' } });
      dm.setData(makeSplitData(), true);

      const s2 = dm.getTaskById('s2')!;
      dm.updateTaskTime(s2, dayjs('2026-07-26'), dayjs('2026-07-28'), 'both');
      dm.fitTaskTime(s2, 'both');

      const p = dm.getTaskById('p1')!;
      expect(p.children.length).toBe(1);
      expect(p.children[0].startTime?.isSame(dayjs('2026-07-25'))).toBe(true);
      expect(p.children[0].endTime?.isSame(dayjs('2026-07-30'))).toBe(true);
    });

    it('链式交叠松开后迭代合并至稳定', () => {
      const { dm } = createManager({ split: { enabled: true, overlap: 'merge' } });
      dm.setData(
        [
          {
            id: 'p1',
            split: true,
            children: [
              { id: 's1', startTime: '2026-07-01', endTime: '2026-07-10' },
              { id: 's2', startTime: '2026-07-14', endTime: '2026-07-20' },
              { id: 's3', startTime: '2026-07-22', endTime: '2026-07-31' }
            ]
          }
        ],
        true
      );

      // 整体拖拽保持时长：s3（9 天）左移 17 天，同时压进段1与段2的范围，
      // 松开后链式合并：s3 并入 s1 → s1 触及 s2 → s2 再并入 s1
      const s3 = dm.getTaskById('s3')!;
      dm.updateTaskTime(s3, dayjs('2026-07-05'), dayjs('2026-07-14'), 'both');
      dm.fitTaskTime(s3, 'both');

      const p = dm.getTaskById('p1')!;
      expect(p.children.length).toBe(1);
      expect(p.children[0].id).toBe('s1');
      expect(p.children[0].startTime?.isSame(dayjs('2026-07-01'))).toBe(true);
      expect(p.children[0].endTime?.isSame(dayjs('2026-07-20'))).toBe(true);
      expect(dm.getTaskById('s2')).toBeUndefined();
      expect(dm.getTaskById('s3')).toBeUndefined();
    });

    it('松开后有间隙的段不合并', () => {
      const { dm } = createManager({ split: { enabled: true, overlap: 'merge' } });
      dm.setData(makeSplitData(), true);

      const s2 = dm.getTaskById('s2')!;
      dm.updateTaskTime(s2, dayjs('2026-08-04'), dayjs('2026-08-06'), 'both');
      dm.fitTaskTime(s2, 'both');

      const p = dm.getTaskById('p1')!;
      expect(p.children.length).toBe(2);
      expect(p.endTime?.isSame(dayjs('2026-08-06'))).toBe(true);
    });

    it('合并同步清理原始数据与任务映射', () => {
      const { dm } = createManager({ split: { enabled: true, overlap: 'merge' } });
      const data = makeSplitData();
      dm.setData(data, true);

      const s2 = dm.getTaskById('s2')!;
      dm.updateTaskTime(s2, dayjs('2026-07-30'), dayjs('2026-08-01'), 'both');
      dm.fitTaskTime(s2, 'both');

      // 原始数据中段2条目被移除，视图与数据保持一致
      expect(data[0].children).toHaveLength(1);
      expect(data[0].children[0].id).toBe('s1');
      expect(dm.getTaskById('s2')).toBeUndefined();
    });

    it('合并把受影响段的旧值写入 oldTasks（撤销/历史契约）', () => {
      const { dm } = createManager({ split: { enabled: true, overlap: 'merge' } });
      dm.setData(makeSplitData(), true);

      const oldTasks: any[] = [];
      const s2 = dm.getTaskById('s2')!;
      // oldTasks 贯穿拖拽（记录被拖段旧值）与松开（记录被合并段旧值）
      dm.updateTaskTime(s2, dayjs('2026-07-30'), dayjs('2026-08-01'), 'both', oldTasks);
      dm.fitTaskTime(s2, 'both', oldTasks);

      const ids = oldTasks.map(t => t.id);
      expect(ids).toContain('s1');
      expect(ids).toContain('s2');

      // 记录的是合并前的旧时间
      const oldS1 = oldTasks.find(t => t.id === 's1')!;
      expect(oldS1.startTime?.isSame(dayjs('2026-07-25'))).toBe(true);
      expect(oldS1.endTime?.isSame(dayjs('2026-07-30'))).toBe(true);
      const oldS2 = oldTasks.find(t => t.id === 's2')!;
      expect(oldS2.startTime?.isSame(dayjs('2026-08-03'))).toBe(true);
      expect(oldS2.endTime?.isSame(dayjs('2026-08-05'))).toBe(true);
    });

    it('被合并移除的段可回查合并目标（move 事件 row 兜底）', () => {
      const { dm } = createManager({ split: { enabled: true, overlap: 'merge' } });
      dm.setData(makeSplitData(), true);

      const s2 = dm.getTaskById('s2')!;
      dm.updateTaskTime(s2, dayjs('2026-07-30'), dayjs('2026-08-01'), 'both');
      dm.fitTaskTime(s2, 'both');

      // 段2被移除，getTaskById 落空，但可回查其数据归属
      expect(dm.getTaskById('s2')).toBeUndefined();
      expect(dm.getMergedSegmentTarget('s2')?.id).toBe('s1');

      // 存活的段与无关 id 没有合并目标
      expect(dm.getMergedSegmentTarget('s1')).toBeUndefined();
      expect(dm.getMergedSegmentTarget('not-exist')).toBeUndefined();
    });

    it('merge 对普通任务无影响', () => {
      const { dm } = createManager({ split: { enabled: true, overlap: 'merge' } });
      dm.setData(makeSplitData(), true);

      const other = dm.getTaskById('other')!;
      dm.updateTaskTime(other, dayjs('2026-09-01'), dayjs('2026-09-10'), 'both');

      expect(other.endTime?.isSame(dayjs('2026-09-10'))).toBe(true);
      expect(dm.getTaskById('p1')!.children.length).toBe(2);
    });
  });

  describe('fitTaskTime - 工作日适配联动', () => {
    it('forbid：适配把段推入左邻后被夹取回边界（时长保持）', () => {
      // currentWorkTime 把起始时刻向前推 2 天，模拟跳过非工作日的适配偏移
      const { dm } = createManager(
        { split: { enabled: true, overlap: 'forbid' } },
        { currentWorkTime: (t: any) => t.subtract(2, 'day') }
      );
      dm.setData(
        [
          {
            id: 'p1',
            split: true,
            children: [
              { id: 's1', startTime: '2026-07-25', endTime: '2026-07-30' },
              { id: 's2', startTime: '2026-07-31', endTime: '2026-08-02' }
            ]
          }
        ],
        true
      );

      const s2 = dm.getTaskById('s2')!;
      dm.fitTaskTime(s2, 'both');

      // 适配后 07-29 起步，越过左边界 07-30，夹取贴边放置
      expect(s2.startTime?.isSame(dayjs('2026-07-30'))).toBe(true);
      expect(s2.endTime?.isSame(dayjs('2026-08-01'))).toBe(true);

      // 左邻段不受影响，包络覆盖两段
      const s1 = dm.getTaskById('s1')!;
      expect(s1.endTime?.isSame(dayjs('2026-07-30'))).toBe(true);
      const p = dm.getTaskById('p1')!;
      expect(p.endTime?.isSame(dayjs('2026-08-01'))).toBe(true);
    });

    it('merge：适配造成的交叠自动合并', () => {
      const { dm } = createManager(
        { split: { enabled: true, overlap: 'merge' } },
        { currentWorkTime: (t: any) => t.subtract(2, 'day') }
      );
      dm.setData(
        [
          {
            id: 'p1',
            split: true,
            children: [
              { id: 's1', startTime: '2026-07-25', endTime: '2026-07-30' },
              { id: 's2', startTime: '2026-07-31', endTime: '2026-08-02' }
            ]
          }
        ],
        true
      );

      const s2 = dm.getTaskById('s2')!;
      dm.fitTaskTime(s2, 'both');

      // 适配后段2为 07-29→07-31，与段1交叠，合并为一段
      expect(dm.getTaskById('s2')).toBeUndefined();
      const p = dm.getTaskById('p1')!;
      expect(p.children.length).toBe(1);
      expect(p.children[0].endTime?.isSame(dayjs('2026-07-31'))).toBe(true);
      expect(p.endTime?.isSame(dayjs('2026-07-31'))).toBe(true);
    });
  });
});
