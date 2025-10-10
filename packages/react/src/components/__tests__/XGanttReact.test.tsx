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
    const mockScrollTo = vi.fn().mockReturnValue(true);
    const mockGetDataChain = vi.fn().mockReturnValue({
        prev: { chain: [], nodes: [], links: [] },
        next: { chain: [], nodes: [], links: [] },
        allNodes: [],
        allLinks: [],
        current: undefined
    });
    const mockGetDataById = vi.fn().mockReturnValue({ id: '1', name: 'Test Task' });
    const mockGetDataSize = vi.fn().mockReturnValue(5);
    const mockRemoveDataById = vi.fn().mockReturnValue(true);

    const mockInstance = {
        destroy: mockDestroy,
        update: mockUpdate,
        jumpTo: mockJumpTo,
        render: mockRender,
        on: mockOn,
        scrollTo: mockScrollTo,
        getDataChain: mockGetDataChain,
        getDataById: mockGetDataById,
        getDataSize: mockGetDataSize,
        removeDataById: mockRemoveDataById
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
        __mockOn: mockOn,
        __mockScrollTo: mockScrollTo,
        __mockGetDataChain: mockGetDataChain,
        __mockGetDataById: mockGetDataById,
        __mockGetDataSize: mockGetDataSize,
        __mockRemoveDataById: mockRemoveDataById
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

    it('should register all event listeners', () => {
        const options = { data: [] };
        const handlers = {
            onLoaded: vi.fn(),
            onError: vi.fn(),
            onUpdateLink: vi.fn(),
            onCreateLink: vi.fn(),
            onSelectLink: vi.fn(),
            onContextMenuLink: vi.fn(),
            onSelect: vi.fn(),
            onClickRow: vi.fn(),
            onDoubleClickRow: vi.fn(),
            onContextMenuRow: vi.fn(),
            onClickSlider: vi.fn(),
            onDoubleClickSlider: vi.fn(),
            onContextMenuSlider: vi.fn(),
            onMove: vi.fn(),
            onEnterSlider: vi.fn(),
            onHoverSlider: vi.fn(),
            onLeaveSlider: vi.fn(),
            onClickBaseline: vi.fn(),
            onContextMenuBaseline: vi.fn(),
            onEnterBaseline: vi.fn(),
            onHoverBaseline: vi.fn(),
            onLeaveBaseline: vi.fn(),
        };

        render(<XGanttReact options={options} {...handlers} />);

        expect(mockCore.__mockOn).toHaveBeenCalledWith('loaded', handlers.onLoaded);
        expect(mockCore.__mockOn).toHaveBeenCalledWith('error', handlers.onError);
        expect(mockCore.__mockOn).toHaveBeenCalledWith('update:link', handlers.onUpdateLink);
        expect(mockCore.__mockOn).toHaveBeenCalledWith('create:link', handlers.onCreateLink);
        expect(mockCore.__mockOn).toHaveBeenCalledWith('select:link', handlers.onSelectLink);
        expect(mockCore.__mockOn).toHaveBeenCalledWith('contextmenu:link', handlers.onContextMenuLink);
        expect(mockCore.__mockOn).toHaveBeenCalledWith('select', handlers.onSelect);
        expect(mockCore.__mockOn).toHaveBeenCalledWith('click:row', handlers.onClickRow);
        expect(mockCore.__mockOn).toHaveBeenCalledWith('dblclick:row', handlers.onDoubleClickRow);
        expect(mockCore.__mockOn).toHaveBeenCalledWith('contextmenu:row', handlers.onContextMenuRow);
        expect(mockCore.__mockOn).toHaveBeenCalledWith('click:slider', handlers.onClickSlider);
        expect(mockCore.__mockOn).toHaveBeenCalledWith('dblclick:slider', handlers.onDoubleClickSlider);
        expect(mockCore.__mockOn).toHaveBeenCalledWith('contextmenu:slider', handlers.onContextMenuSlider);
        expect(mockCore.__mockOn).toHaveBeenCalledWith('move', handlers.onMove);
        expect(mockCore.__mockOn).toHaveBeenCalledWith('enter:slider', handlers.onEnterSlider);
        expect(mockCore.__mockOn).toHaveBeenCalledWith('hover:slider', handlers.onHoverSlider);
        expect(mockCore.__mockOn).toHaveBeenCalledWith('leave:slider', handlers.onLeaveSlider);
        expect(mockCore.__mockOn).toHaveBeenCalledWith('click:baseline', handlers.onClickBaseline);
        expect(mockCore.__mockOn).toHaveBeenCalledWith('contextmenu:baseline', handlers.onContextMenuBaseline);
        expect(mockCore.__mockOn).toHaveBeenCalledWith('enter:baseline', handlers.onEnterBaseline);
        expect(mockCore.__mockOn).toHaveBeenCalledWith('hover:baseline', handlers.onHoverBaseline);
        expect(mockCore.__mockOn).toHaveBeenCalledWith('leave:baseline', handlers.onLeaveBaseline);
    });

    it('should call scrollTo method correctly', () => {
        const options = { data: [] };
        const ref = createRef<XGanttReactRef>();

        render(<XGanttReact ref={ref} options={options} />);

        const result = ref.current?.scrollTo('task-1', true);

        expect(mockCore.__mockScrollTo).toHaveBeenCalledWith('task-1', true);
        expect(result).toBe(true);
    });

    it('should call scrollTo without parameters', () => {
        const options = { data: [] };
        const ref = createRef<XGanttReactRef>();

        render(<XGanttReact ref={ref} options={options} />);

        const result = ref.current?.scrollTo();

        expect(mockCore.__mockScrollTo).toHaveBeenCalledWith(undefined, undefined);
        expect(result).toBe(true);
    });

    it('should call getDataChain method correctly', () => {
        const options = { data: [] };
        const ref = createRef<XGanttReactRef>();

        render(<XGanttReact ref={ref} options={options} />);

        const result = ref.current?.getDataChain('task-1');

        expect(mockCore.__mockGetDataChain).toHaveBeenCalledWith('task-1');
        expect(result).toEqual({
            prev: { chain: [], nodes: [], links: [] },
            next: { chain: [], nodes: [], links: [] },
            allNodes: [],
            allLinks: [],
            current: undefined
        });
    });

    it('should call getDataById method correctly', () => {
        const options = { data: [] };
        const ref = createRef<XGanttReactRef>();

        render(<XGanttReact ref={ref} options={options} />);

        const result = ref.current?.getDataById('1');

        expect(mockCore.__mockGetDataById).toHaveBeenCalledWith('1');
        expect(result).toEqual({ id: '1', name: 'Test Task' });
    });

    it('should call getDataSize method correctly', () => {
        const options = { data: [] };
        const ref = createRef<XGanttReactRef>();

        render(<XGanttReact ref={ref} options={options} />);

        const result = ref.current?.getDataSize();

        expect(mockCore.__mockGetDataSize).toHaveBeenCalled();
        expect(result).toBe(5);
    });

    it('should call removeDataById method correctly', () => {
        const options = { data: [] };
        const ref = createRef<XGanttReactRef>();

        render(<XGanttReact ref={ref} options={options} />);

        const result = ref.current?.removeDataById('task-1');

        expect(mockCore.__mockRemoveDataById).toHaveBeenCalledWith('task-1');
        expect(result).toBe(true);
    });

    it('should call jumpTo without date parameter', () => {
        const options = { data: [] };
        const ref = createRef<XGanttReactRef>();

        render(<XGanttReact ref={ref} options={options} />);

        ref.current?.jumpTo();
        expect(mockCore.__mockJumpTo).toHaveBeenCalledWith(undefined);
    });

    it('should call scrollTo with only id parameter', () => {
        const options = { data: [] };
        const ref = createRef<XGanttReactRef>();

        render(<XGanttReact ref={ref} options={options} />);

        ref.current?.scrollTo('task-1');
        expect(mockCore.__mockScrollTo).toHaveBeenCalledWith('task-1', undefined);
    });

    it('should pass additional HTML attributes to container', () => {
        const options = { data: [] };
        const dataTestId = 'custom-test-id';

        render(
            <XGanttReact
                options={options}
                data-custom="custom-value"
                aria-label="Gantt Chart"
            />
        );

        const container = screen.getByTestId('x-gantt-container');
        expect(container).toHaveAttribute('data-custom', 'custom-value');
        expect(container).toHaveAttribute('aria-label', 'Gantt Chart');
    });

    it('should not update when options reference does not change', () => {
        const options = { data: [] };

        const { rerender } = render(<XGanttReact options={options} />);

        // Clear previous calls
        mockCore.__mockUpdate.mockClear();

        // Rerender with same options reference
        rerender(<XGanttReact options={options} />);

        // Update should not be called since options didn't change
        expect(mockCore.__mockUpdate).not.toHaveBeenCalled();
    });

    it('should handle jumpTo with different date formats', () => {
        const options = { data: [] };
        const ref = createRef<XGanttReactRef>();

        render(<XGanttReact ref={ref} options={options} />);

        // Test with string
        ref.current?.jumpTo('2024-06-01');
        expect(mockCore.__mockJumpTo).toHaveBeenCalledWith('2024-06-01');

        // Test with Date object
        const date = new Date('2024-06-01');
        ref.current?.jumpTo(date);
        expect(mockCore.__mockJumpTo).toHaveBeenCalledWith(date);

        // Test with no parameter (today)
        ref.current?.jumpTo();
        expect(mockCore.__mockJumpTo).toHaveBeenCalledWith(undefined);
    });

    it('should render correctly with empty className', () => {
        const options = { data: [] };

        render(<XGanttReact options={options} className="" />);

        const container = screen.getByTestId('x-gantt-container');
        expect(container).toHaveClass('x-gantt-container');
    });

    it('should have correct default styles', () => {
        const options = { data: [] };

        render(<XGanttReact options={options} />);

        const container = screen.getByTestId('x-gantt-container');
        expect(container).toHaveStyle({
            position: 'relative',
            width: '100%',
            height: '100%'
        });
    });
});
