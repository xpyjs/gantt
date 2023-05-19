import { type ObjectEmitsOptions, type MethodOptions } from 'vue';
import { withInstall } from '../utils/install';
import Root from 'components/root/RootWrap.vue';
import { Variables } from '../constants/vars';
import type rootProps from '@/components/root/rootProps';
// import { type MoveSliderData } from '@/typings/data';
// import { type LinkProps } from '@/typings/link';

type props = Omit<typeof rootProps, 'slots'>;

interface methods extends MethodOptions {
  /**
   * 设置一个选择项。如果当前数据中找不到，返回 null
   */
  setSelected: (data: any) => null | undefined;

  /**
   * 跳转到指定日期（没有参数跳转到今天）。如果找不到日期，抛出 no-date-error 事件
   */
  jumpToDate: (date: Date | undefined) => void;
}

interface emits extends ObjectEmitsOptions {
  //   'row-click': (data: any) => void;
  //   'row-dbl-click': (data: any) => void;
  //   'row-checked': (state: boolean, data: any) => void;
  //   'move-slider': (data: MoveSliderData[]) => void;
  //   'add-link': (
  //     link: LinkProps,
  //     data: {
  //       from: any;
  //       to: any;
  //     },
  //     cb: (link: LinkProps) => void
  //   ) => void;
  //   'click-link': (link: any) => void;
  //   'no-date-error': (date: Date) => void;
}

const XGantt = withInstall<props, methods, emits>(Variables.name.root, Root);

export default XGantt;
