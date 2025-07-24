import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useXGantt } from '../index';

describe('useXGantt', () => {
    it('should provide gantt methods', () => {
        const { result } = renderHook(() => useXGantt());

        expect(result.current.ganttRef).toBeDefined();
        expect(typeof result.current.getInstance).toBe('function');
        expect(typeof result.current.jumpTo).toBe('function');

        // 确保已删除的方法不存在
        expect((result.current as any).updateGanttOptions).toBeUndefined();
        expect((result.current as any).renderGantt).toBeUndefined();
    });

    it('should return null when instance is not available', () => {
        const { result } = renderHook(() => useXGantt());

        expect(result.current.getInstance()).toBeNull();
        expect(result.current.jumpTo()).toBe(false);
        expect(result.current.jumpTo('2024-01-01')).toBe(false);
    });
});
