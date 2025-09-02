/*
 * @Author: JeremyJone
 * @Date: 2025-06-24
 * @Description: Custom hooks for XGantt React
 */

import { useRef, useCallback, useEffect } from "react";
import type { XGanttReactRef } from "../types";

/**
 * 使用甘特图的 Hook
 *
 * @description 提供更便捷的甘特图操作方法
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { XGanttReact, useXGantt } from '@xpyjs/gantt-react';
 *
 * function MyGantt() {
 *   const { ganttRef, getInstance, jumpTo } = useXGantt();
 *
 *   const handleJumpToToday = () => {
 *     jumpTo(); // 没有参数，默认跳转到今天
 *   };
 *
 *   const handleUpdate = () => {
 *     const instance = getInstance();
 *     if (instance) {
 *       instance.update({ unit: 'week' });
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleJumpToToday}>跳转到今天</button>
 *       <button onClick={handleUpdate}>切换到周视图</button>
 *       <XGanttReact
 *         ref={ganttRef}
 *         options={{ data: [] }}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function useXGantt() {
  const ganttRef = useRef<XGanttReactRef>(null);

  /**
   * 获取甘特图实例
   */
  const getInstance = useCallback(() => {
    return ganttRef.current?.getInstance() || null;
  }, []);

  /**
   * 跳转到指定日期
   */
  const jumpTo = useCallback((date?: any) => {
    return ganttRef.current?.jumpTo(date) || false;
  }, []);

  /**
   * 获取指定任务的所有相关联的完整路径
   */
  const getDataChain = useCallback((id: string) => {
    return ganttRef.current?.getDataChain(id) || [];
  }, []);

  return {
    ganttRef,
    getInstance,
    jumpTo,
    getDataChain
  };
}
