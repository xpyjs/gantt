/*
 * @Author: JeremyJone
 * @Date: 2025-06-24
 * @Description: React wrapper for XGantt
 */

import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useCallback
} from "react";
import { XGantt } from "@xpyjs/gantt-core";
import type { XGanttReactProps, XGanttReactRef } from "../types";
import "@xpyjs/gantt-core/style.css";

/**
 * XGantt React 组件
 *
 * @description 基于 `@xpyjs/gantt-core` 的 React 封装组件，提供完整的甘特图功能
 *
 * @example
 * ```tsx
 * import React, { useRef } from 'react';
 * import { XGanttReact } from '@xpyjs/gantt-react';
 * import type { XGanttReactRef } from '@xpyjs/gantt-react';
 *
 * function App() {
 *   const ganttRef = useRef<XGanttReactRef>(null);
 *
 *   const handleTaskSelect = (data: any[], checked: boolean, all: any[]) => {
 *     console.log('任务选择:', { data, checked, all });
 *   };
 *
 *   const jumpToToday = () => {
 *     ganttRef.current?.jumpTo();
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={jumpToToday}>跳转到今天</button>
 *       <XGanttReact
 *         ref={ganttRef}
 *         style={{ height: '500px', width: '100%' }}
 *         options={{
 *           data: [
 *             {
 *               id: '1',
 *               name: '任务1',
 *               startTime: '2024-01-01',
 *               endTime: '2024-01-10',
 *               progress: 50
 *             }
 *           ]
 *         }}
 *         onSelect={handleTaskSelect}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export const XGanttReact = forwardRef<XGanttReactRef, XGanttReactProps>(
    (props, ref) => {
        const {
            options,
            className,
            style,
            onLoaded,
            onError,
            onUpdateLink,
            onCreateLink,
            onSelectLink,
            onContextMenuLink,
            onSelect,
            onClickRow,
            onDoubleClickRow,
            onContextMenuRow,
            onClickSlider,
            onDoubleClickSlider,
            onContextMenuSlider,
            onMove,
            ...restProps
        } = props;

        // 容器引用
        const containerRef = useRef<HTMLDivElement>(null);

        // 甘特图实例
        const ganttInstanceRef = useRef<XGantt | null>(null);

        // 注册事件监听器
        const registerEventListeners = useCallback(() => {
            const instance = ganttInstanceRef.current;
            if (!instance) return;

            // 注册所有事件监听器
            if (onLoaded) {
                instance.on("loaded", onLoaded);
            }
            if (onError) {
                instance.on("error", onError);
            }
            if (onUpdateLink) {
                instance.on("update:link", onUpdateLink);
            }
            if (onCreateLink) {
                instance.on("create:link", onCreateLink);
            }
            if (onSelectLink) {
                instance.on("select:link", onSelectLink);
            }
            if (onContextMenuLink) {
                instance.on("contextmenu:link", onContextMenuLink);
            }
            if (onSelect) {
                instance.on("select", onSelect);
            }
            if (onClickRow) {
                instance.on("click:row", onClickRow);
            }
            if (onDoubleClickRow) {
                instance.on("dblclick:row", onDoubleClickRow);
            }
            if (onContextMenuRow) {
                instance.on("contextmenu:row", onContextMenuRow);
            }
            if (onClickSlider) {
                instance.on("click:slider", onClickSlider);
            }
            if (onDoubleClickSlider) {
                instance.on("dblclick:slider", onDoubleClickSlider);
            }
            if (onContextMenuSlider) {
                instance.on("contextmenu:slider", onContextMenuSlider);
            }
            if (onMove) {
                instance.on("move", onMove);
            }
        }, [
            onLoaded,
            onError,
            onUpdateLink,
            onCreateLink,
            onSelectLink,
            onContextMenuLink,
            onSelect,
            onClickRow,
            onDoubleClickRow,
            onContextMenuRow,
            onClickSlider,
            onDoubleClickSlider,
            onContextMenuSlider,
            onMove
        ]);

        // 初始化甘特图
        const initGantt = useCallback(() => {
            if (!containerRef.current) return;

            // 创建甘特图实例
            ganttInstanceRef.current = new XGantt(containerRef.current, options);

            // 注册事件监听器
            registerEventListeners();
        }, [options, registerEventListeners]);

        // 跳转到指定日期
        const jumpTo = useCallback((date?: any) => {
            if (ganttInstanceRef.current) {
                return ganttInstanceRef.current.jumpTo(date);
            }
            return false;
        }, []);

        // 销毁甘特图
        const destroyGantt = useCallback(() => {
            if (ganttInstanceRef.current) {
                ganttInstanceRef.current.destroy();
                ganttInstanceRef.current = null;
            }
        }, []);

        // 暴露方法给父组件
        useImperativeHandle(ref, () => ({
            getInstance: () => ganttInstanceRef.current,
            jumpTo
        }), [jumpTo]);

        // 组件挂载时初始化
        useEffect(() => {
            initGantt();

            // 组件卸载时清理
            return () => {
                destroyGantt();
            };
        }, []); // 只在挂载时初始化一次

        // 监听 options 变化
        useEffect(() => {
            if (ganttInstanceRef.current) {
                ganttInstanceRef.current.update(options);
            }
        }, [options]);

        return (
            <div
                ref={containerRef}
                data-testid="x-gantt-container"
                className={`x-gantt-container ${className || ""}`}
                style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    ...style
                }}
                {...restProps}
            />
        );
    }
);

XGanttReact.displayName = "XGanttReact";
