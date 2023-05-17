/*
 * @Author: JeremyJone
 * @Date: 2021-12-24 16:36:33
 * @LastEditors: JeremyJone
 * @LastEditTime: 2023-05-17 09:49:28
 * @Description: 头部注释
 */

import { inject, provide, reactive, type Ref, ref } from 'vue';
import EventBus from '@/utils/bus';
import { AllData, AllLinks } from '@/models/data';
import { GanttHeader, Param, SlotsBox, StyleBox } from '@/models/param';
import { type LinkingItem } from '@/typings/link';

export const initStore = (emit: any) => {
  const Bus = reactive(new EventBus());
  provide('$bus', Bus);

  const slotsBox = reactive(new SlotsBox());
  provide('$slotsBox', slotsBox);

  const data = reactive(new AllData());
  provide('$data', data);

  const links = reactive(new AllLinks());
  provide('$links', links);

  const styleBox = reactive(new StyleBox());
  provide('$styleBox', styleBox);

  const ganttHeader = reactive(new GanttHeader());
  provide('ganttHeader', ganttHeader);

  const param = reactive(new Param());
  provide('$param', param);

  const rootEmit: any = ref(emit);
  provide('rootEmit', rootEmit);

  const rootRef = ref<HTMLElement | null>(null);
  provide('rootRef', rootRef);

  const tableHeaderRef = ref<HTMLElement | null>(null);
  provide('tableHeaderRef', tableHeaderRef);

  const ganttHeaderRef = ref<HTMLElement | null>(null);
  provide('ganttHeaderRef', ganttHeaderRef);

  const ganttBodyRef = ref<HTMLElement | null>(null);
  provide('ganttBodyRef', ganttBodyRef);

  const linking = reactive({
    startPos: { x: 0, y: 0 },
    endPos: { x: 0, y: 0 },
    isLinking: false,
    startRow: null,
    endRow: null
  }) as LinkingItem;
  provide('linking', linking);
};

export const useStore = () => {
  return {
    /**
     * 事件总线
     */
    $bus: inject('$bus') as EventBus,

    /**
     * 插槽盒子，所有插槽都保存在这里
     */
    $slotsBox: inject('$slotsBox') as SlotsBox,

    /**
     * 展示的数据
     */
    $data: inject('$data') as AllData,

    /**
     * 连线数据
     */
    $links: inject('$links') as AllLinks,

    /**
     * 样式盒子，所有样式都保存在这里来管理样式
     */
    $styleBox: inject('$styleBox') as StyleBox,

    /**
     * 甘特图的表头类
     */
    ganttHeader: inject('ganttHeader') as GanttHeader,

    /**
     * 获取各种参数
     */
    $param: inject('$param') as Param,

    /**
     * 根事件
     */
    rootEmit: inject('rootEmit') as Ref<any>,

    /**
     * 根ref
     */
    rootRef: inject('rootRef') as Ref<HTMLElement | null>,

    /**
     * 表头ref
     */
    tableHeaderRef: inject('tableHeaderRef') as Ref<HTMLElement | null>,

    /**
     * 甘特图表头ref
     */
    ganttHeaderRef: inject('ganttHeaderRef') as Ref<HTMLElement | null>,

    /**
     * 甘特图主体ref
     */
    ganttBodyRef: inject('ganttBodyRef') as Ref<HTMLElement | null>,

    /**
     * 鼠标创建的连接中的连线数据
     */
    linking: inject('linking') as LinkingItem
  };
};

export default useStore;
