/*
 * @Author: JeremyJone
 * @Date: 2025-06-24
 * @Description: React wrapper types for XGantt
 */

import type { IOptions, EventMap } from "@xpyjs/gantt-core";

/**
 * XGanttReact 组件的 Props 类型
 */
export interface XGanttReactProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onError" | "onSelect" | "onClick" | "onDoubleClick" | "onContextMenu"
  > {
  /**
   * XGantt 图表的配置选项
   *
   * @description
   * 该选项包含所有 XGantt 图表的配置参数，包括数据源、表格配置、图表配置、样式配置等
   */
  options: IOptions;

  /**
   * 容器的 className
   */
  className?: string;

  /**
   * 容器的样式
   */
  style?: React.CSSProperties;

  /**
   * 加载完成事件回调
   *
   * @description 当甘特图加载完成时触发
   */
  onLoaded?: EventMap["loaded"];

  /**
   * 错误事件回调
   *
   * @description 当甘特图发生错误时触发
   * @param error 错误信息对象
   */
  onError?: EventMap["error"];

  /**
   * 关联线更新事件回调
   *
   * @description 当关联线被更新时触发
   * @param link 更新的关联线对象
   */
  onUpdateLink?: EventMap["update:link"];

  /**
   * 关联线创建事件回调
   *
   * @description 当新建关联线时触发
   * @param link 新创建的关联线对象
   */
  onCreateLink?: EventMap["create:link"];

  /**
   * 关联线选择事件回调
   *
   * @description 当关联线的选择状态发生变化时触发
   * @param add 新增选择的关联线
   * @param cancel 取消选择的关联线
   * @param all 所有当前选择的关联线
   */
  onSelectLink?: EventMap["select:link"];

  /**
   * 关联线右键菜单事件回调
   *
   * @description 当在关联线上右键点击时触发
   * @param e 鼠标事件对象
   * @param link 被右键点击的关联线对象
   */
  onContextMenuLink?: EventMap["contextmenu:link"];

  /**
   * 任务选择事件回调
   *
   * @description 当任务的选择状态发生变化时触发
   * @param data 当前操作的任务数据数组
   * @param checked 是否为选中状态
   * @param all 所有当前选择的任务数据数组
   */
  onSelect?: EventMap["select"];

  /**
   * 行点击事件回调
   *
   * @description 当点击表格行时触发
   * @param e 鼠标事件对象
   * @param data 点击行对应的任务数据
   */
  onClickRow?: EventMap["click:row"];

  /**
   * 行双击事件回调
   *
   * @description 当双击表格行时触发
   * @param e 鼠标事件对象
   * @param data 双击行对应的任务数据
   */
  onDoubleClickRow?: EventMap["dblclick:row"];

  /**
   * 行右键菜单事件回调
   *
   * @description 当在表格行上右键点击时触发
   * @param e 鼠标事件对象
   * @param data 右键行对应的任务数据
   */
  onContextMenuRow?: EventMap["contextmenu:row"];

  /**
   * 任务条点击事件回调
   *
   * @description 当点击甘特图中的任务条时触发
   * @param e 鼠标事件对象
   * @param data 点击任务条对应的任务数据
   */
  onClickSlider?: EventMap["click:slider"];

  /**
   * 任务条双击事件回调
   *
   * @description 当双击甘特图中的任务条时触发
   * @param e 鼠标事件对象
   * @param data 双击任务条对应的任务数据
   */
  onDoubleClickSlider?: EventMap["dblclick:slider"];

  /**
   * 任务条右键菜单事件回调
   *
   * @description 当在甘特图中的任务条上右键点击时触发
   * @param e 鼠标事件对象
   * @param data 右键任务条对应的任务数据
   */
  onContextMenuSlider?: EventMap["contextmenu:slider"];

  /**
   * 任务移动事件回调
   *
   * @description 当任务被拖拽移动完成时触发
   * @param data 移动的任务信息数组，包含新旧位置信息
   */
  onMove?: EventMap["move"];

  /**
   * 鼠标悬停在任务条的事件回调
   *
   * @description 当鼠标悬停在任务条上时触发
   * @param data 悬停的任务数据
   */
  onHoverSlider?: EventMap["hover:slider"];

  /**
   * 鼠标离开任务条的事件回调
   *
   * @description 当鼠标离开任务条时触发
   * @param data 离开的任务数据
   */
  onLeaveSlider?: EventMap["leave:slider"];
}

/**
 * XGanttReact 组件实例类型
 */
export interface XGanttReactRef {
  /**
   * 获取甘特图核心实例
   *
   * @description
   * 获取底层的 XGantt 核心实例，通过实例可以调用所有核心方法
   *
   * @returns XGantt 核心实例，如果组件未初始化则返回 null
   *
   * @example
   * ```tsx
   * const ganttRef = useRef<XGanttReactRef>(null);
   *
   * const handleGetInstance = () => {
   *   const instance = ganttRef.current?.getInstance();
   *   if (instance) {
   *     // 调用核心实例的方法
   *     instance.update({ unit: 'week' });
   *     instance.render();
   *     instance.destroy();
   *   }
   * };
   * ```
   */
  getInstance: () => import("@xpyjs/gantt-core").XGantt | null;

  /**
   * 跳转到指定日期
   *
   * @description
   * 将甘特图的视图跳转到指定日期位置，如果不传参数则跳转到今天
   *
   * @param date 要跳转的日期，支持多种格式：
   *   - 字符串：'2024-06-01'、'2024/06/01'
   *   - Date 对象：new Date()
   *   - Dayjs 对象：dayjs('2024-06-01')
   *   - undefined：跳转到今天
   *
   * @returns 是否成功跳转
   *
   * @example
   * ```tsx
   * const ganttRef = useRef<XGanttReactRef>(null);
   *
   * // 跳转到今天
   * ganttRef.current?.jumpTo();
   *
   * // 跳转到指定日期
   * ganttRef.current?.jumpTo('2024-06-01');
   * ganttRef.current?.jumpTo(new Date());
   * ```
   */
  jumpTo: (date?: any) => boolean;
}
