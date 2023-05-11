/*
 * @Author: JeremyJone
 * @Date: 2021-12-24 16:36:33
 * @LastEditors: JeremyJone
 * @LastEditTime: 2023-04-12 17:50:18
 * @Description: 头部注释
 */

import { inject, provide, reactive } from 'vue';
import EventBus from '@/utils/bus';
import { AllData, AllLinks } from '@/models/data';
import { GanttHeader, Param, SlotsBox, StyleBox } from '@/models/param';

export const initStore = () => {
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
    $param: inject('$param') as Param
  };
};

export default useStore;
