import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { createRef } from 'react';
import type { XGanttReactRef } from '../../types';

// Mock @xpyjs/gantt-core
vi.mock('@xpyjs/gantt-core', () => {
    const mockDestroy = vi.fn();
    const mockUpdate = vi.fn();
    const mockJumpTo = vi.fn().mockReturnValue(true);
    const mockRender = vi.fn();
    const mockOn = vi.fn();

    const mockInstance = {
        destroy: mockDestroy,
        update: mockUpdate,
        jumpTo: mockJumpTo,
        render: mockRender,
        on: mockOn
    };

    const mockXGantt = vi.fn().mockImplementation(() => mockInstance);

    return {
        XGantt: mockXGantt,
        // 暴露mock函数供测试使用
        __mockInstance: mockInstance,
        __mockXGantt: mockXGantt,
        __mockDestroy: mockDestroy,
        __mockUpdate: mockUpdate,
        __mockJumpTo: mockJumpTo,
        __mockRender: mockRender,
        __mockOn: mockOn
    };
});

// 动态导入组件以确保mock生效
async function importXGanttReact() {
    const module = await import('../XGanttReact');
    return module.XGanttReact;
}

describe('XGanttReact', () => {
    let XGanttReact: any;
    let mockCore: any;

    beforeEach(async () => {
        vi.clearAllMocks();
        XGanttReact = await importXGanttReact();
        mockCore = await import('@xpyjs/gantt-core');
    });

    afterEach(() => {
        cleanup();
    }); it('should render without crashing', () => {
        const options = {
            data: [
                {
                    id: '1',
                    name: 'Test Task',
                    startTime: '2024-01-01',
                    endTime: '2024-01-10',
                    progress: 50
                }
            ]
        };

        render(<XGanttReact options={options} />);

        expect(screen.getByTestId('x-gantt-container')).toBeInTheDocument();
    });

    it('should create XGantt instance on mount', () => {
        const options = {
            data: []
        };

        render(<XGanttReact options={options} />);

        expect(mockCore.__mockXGantt).toHaveBeenCalledWith(expect.any(HTMLElement), options);
    });

    it('should register event listeners', () => {
        const options = { data: [] };
        const onSelect = vi.fn();

        render(<XGanttReact options={options} onSelect={onSelect} />);

        expect(mockCore.__mockOn).toHaveBeenCalledWith('select', onSelect);
    });

    it('should destroy instance on unmount', () => {
        const options = { data: [] };

        const { unmount } = render(<XGanttReact options={options} />);

        unmount();

        expect(mockCore.__mockDestroy).toHaveBeenCalled();
    }); it('should apply custom className and style', () => {
        const options = { data: [] };
        const customStyle = { backgroundColor: 'red' };
        const customClassName = 'custom-gantt';

        render(
            <XGanttReact
                options={options}
                style={customStyle}
                className={customClassName}
            />
        );

        const container = screen.getByTestId('x-gantt-container');
        expect(container).toHaveClass('x-gantt-container', customClassName);
        expect(container).toHaveStyle('background-color: rgb(255, 0, 0)');
    });

    it('should provide ref methods correctly', () => {
        const options = { data: [] };
        const ref = createRef<XGanttReactRef>();

        render(<XGanttReact ref={ref} options={options} />);

        // 测试 getInstance 方法
        expect(ref.current?.getInstance).toBeDefined();
        expect(typeof ref.current?.getInstance).toBe('function');
        expect(ref.current?.getInstance()).toBe(mockCore.__mockInstance);

        // 测试 jumpTo 方法
        expect(ref.current?.jumpTo).toBeDefined();
        expect(typeof ref.current?.jumpTo).toBe('function');

        // 确保已删除的方法不存在
        expect((ref.current as any)?.update).toBeUndefined();
        expect((ref.current as any)?.render).toBeUndefined();
    });

    it('should call jumpTo method correctly', () => {
        const options = { data: [] };
        const ref = createRef<XGanttReactRef>();

        render(<XGanttReact ref={ref} options={options} />);

        const result = ref.current?.jumpTo('2024-06-01');

        expect(mockCore.__mockJumpTo).toHaveBeenCalledWith('2024-06-01');
        expect(result).toBe(true);
    });

    it('should update options when props change', () => {
        const options1 = { data: [] };
        const options2 = { data: [{ id: '1', name: 'New Task' }] };

        const { rerender } = render(<XGanttReact options={options1} />);

        // 重新渲染时更改 options
        rerender(<XGanttReact options={options2} />);

        expect(mockCore.__mockUpdate).toHaveBeenCalledWith(options2);
    });
});
