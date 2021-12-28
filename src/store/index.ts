/*
 * @Author: JeremyJone
 * @Date: 2021-12-24 16:36:33
 * @LastEditors: JeremyJone
 * @LastEditTime: 2021-12-28 10:08:44
 * @Description: 头部注释
 */

import { ref, inject, provide, reactive, Ref } from 'vue';
import { GanttData } from '@/models/data/data';
import { ParamData } from '@/models/param/param';
import { Variables } from '@/constants/vars';
import { Row } from '@/models/data/row';

export const initStore = () => {
  const GtData = reactive(new GanttData()) as GanttData;
  provide(Variables.provider.gtData, GtData);

  const GtParam = reactive(new ParamData()) as ParamData;
  provide(Variables.provider.gtParam, GtParam);

  const rootEmit = ref();
  provide(Variables.provider.gtRootEmit, rootEmit);

  const rootRef = ref<HTMLDivElement>();
  provide(Variables.provider.gtRootRef, rootRef);

  const ganttRef = ref<HTMLDivElement>();
  provide(Variables.provider.gtGanttRef, ganttRef);

  const tableRef = ref<HTMLDivElement>();
  provide(Variables.provider.gtTableRef, tableRef);

  const isShowMask = ref(false);
  provide(Variables.provider.gtIsShowMask, isShowMask);

  const showDateList = reactive<Date[]>([]);
  provide(Variables.provider.gtShowDateList, showDateList);

  const successBarList: Row[] = reactive([]);
  provide(Variables.provider.gtSuccessBarList, successBarList);

  const initGanttWidth = ref(0);
  provide(Variables.provider.gtInitGanttWidth, initGanttWidth);

  // 设置移动线
  const columnSliderLineVisible = ref(false);
  provide(
    Variables.provider.gtColumnSliderLineVisible,
    columnSliderLineVisible
  );
  const columnSliderLineLeft = ref(0);
  provide(Variables.provider.gtColumnSliderLineLeft, columnSliderLineLeft);
  const columnDefaultLeft = ref(-1);
  provide(Variables.provider.gtColumnDefaultLeft, columnDefaultLeft);

  const timeout = 1000; // 提示条消失时间
  provide(Variables.provider.gtSuccessBarTimeout, timeout);

  // toast
  const isShowToast = ref(false);
  provide(Variables.provider.gtIsShowToast, isShowToast);
  const toastMessage = ref('');
  provide(Variables.provider.gtToastMessage, toastMessage);
  const toastQueue: any[] = [];
  provide(Variables.provider.gtToastQueue, toastQueue);

  // wheel
  const scrollTop = ref(0);
  provide(Variables.provider.gtScrollTop, scrollTop);
  const rootHeight = ref(0);
  provide(Variables.provider.gtRootHeight, rootHeight);
  const scrollBarHeight = ref(Variables.size.defaultScrollBarHeight);
  provide(Variables.provider.gtScrollBarHeight, scrollBarHeight);
};

export const useStore = () => {
  return {
    GtData: inject(Variables.provider.gtData) as GanttData,
    GtParam: inject(Variables.provider.gtParam) as ParamData,
    rootEmit: inject(Variables.provider.gtRootEmit) as Ref<any>,
    rootRef: inject(Variables.provider.gtRootRef) as Ref<HTMLDivElement>,
    ganttRef: inject(Variables.provider.gtGanttRef) as Ref<HTMLDivElement>,
    tableRef: inject(Variables.provider.gtTableRef) as Ref<HTMLDivElement>,
    isShowMask: inject(Variables.provider.gtIsShowMask) as Ref<boolean>,
    showDateList: inject(Variables.provider.gtShowDateList) as Date[],
    successBarList: inject(Variables.provider.gtSuccessBarList) as Row[],
    initGanttWidth: inject(Variables.provider.gtInitGanttWidth) as Ref<number>,
    columnSliderLineVisible: inject(
      Variables.provider.gtColumnSliderLineVisible
    ) as Ref<boolean>,
    columnSliderLineLeft: inject(
      Variables.provider.gtColumnSliderLineLeft
    ) as Ref<number>,
    columnDefaultLeft: inject(
      Variables.provider.gtColumnDefaultLeft
    ) as Ref<number>,
    successBarTimeout: inject(Variables.provider.gtSuccessBarTimeout) as number,
    isShowToast: inject(Variables.provider.gtIsShowToast) as Ref<boolean>,
    toastMessage: inject(Variables.provider.gtToastMessage) as Ref<string>,
    toastQueue: inject(Variables.provider.gtToastQueue) as any[],
    scrollTop: inject(Variables.provider.gtScrollTop) as Ref<number>,
    rootHeight: inject(Variables.provider.gtRootHeight) as Ref<number>,
    scrollBarHeight: inject(Variables.provider.gtScrollBarHeight) as Ref<number>
  };
};

export default useStore;
