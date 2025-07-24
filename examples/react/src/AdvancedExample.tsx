import { useState, useCallback, useEffect } from 'react';
import { XGanttReact, useXGantt } from '@xpyjs/gantt-react';
import type { IOptions } from '@xpyjs/gantt-react';

interface TaskData {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    progress: number;
    children?: TaskData[];
}

/**
 * 高级甘特图示例组件
 * 展示响应式数据更新、动态配置和事件处理
 */
function AdvancedGanttExample() {
    const { ganttRef, jumpTo } = useXGantt();

    // 状态管理
    const [selectedTasks, setSelectedTasks] = useState<any[]>([]);
    const [lastClickedRow, setLastClickedRow] = useState<any>(null);

    // 状态管理
    const [tasks, setTasks] = useState<TaskData[]>([
        {
            id: '1',
            name: '前端开发',
            startTime: '2024-06-01',
            endTime: '2024-08-31',
            progress: 65,
            children: [
                {
                    id: '1-1',
                    name: 'React 组件开发',
                    startTime: '2024-06-01',
                    endTime: '2024-07-15',
                    progress: 80
                },
                {
                    id: '1-2',
                    name: 'UI 测试',
                    startTime: '2024-07-16',
                    endTime: '2024-08-15',
                    progress: 45
                },
                {
                    id: '1-3',
                    name: '性能优化',
                    startTime: '2024-08-01',
                    endTime: '2024-08-31',
                    progress: 20
                }
            ]
        },
        {
            id: '2',
            name: '后端开发',
            startTime: '2024-06-15',
            endTime: '2024-09-15',
            progress: 40,
            children: [
                {
                    id: '2-1',
                    name: 'API 设计',
                    startTime: '2024-06-15',
                    endTime: '2024-07-01',
                    progress: 100
                },
                {
                    id: '2-2',
                    name: '数据库设计',
                    startTime: '2024-06-20',
                    endTime: '2024-07-10',
                    progress: 90
                },
                {
                    id: '2-3',
                    name: '接口开发',
                    startTime: '2024-07-11',
                    endTime: '2024-08-31',
                    progress: 30
                },
                {
                    id: '2-4',
                    name: '部署上线',
                    startTime: '2024-09-01',
                    endTime: '2024-09-15',
                    progress: 0
                }
            ]
        }
    ]);

    const [isAutoProgress, setIsAutoProgress] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState('#007acc');
    const [viewUnit, setViewUnit] = useState<'day' | 'week' | 'month'>('day');
    const [isReadonly, setIsReadonly] = useState(false);

    // 主题色选项
    const themes = {
        blue: '#007acc',
        green: '#28a745',
        red: '#dc3545',
        purple: '#6f42c1',
        orange: '#fd7e14',
        aqua: '#17a2b8',
    };

    // 自动进度更新
    useEffect(() => {
        if (!isAutoProgress) return;

        const interval = setInterval(() => {
            setTasks(prevTasks =>
                prevTasks.map(task => ({
                    ...task,
                    progress: Math.min(100, task.progress + Math.random() * 5),
                    children: task.children?.map(child => ({
                        ...child,
                        progress: Math.min(100, child.progress + Math.random() * 3)
                    }))
                }))
            );
        }, 2000);

        return () => clearInterval(interval);
    }, [isAutoProgress]);    // 事件处理
    const handleTaskSelect = useCallback((data: any[], _checked: boolean, all: any[]) => {
        setSelectedTasks(all);
        console.log(`选择了 ${data.length} 个任务，总共选择 ${all.length} 个`);
    }, []);

    const handleRowClick = useCallback((_e: MouseEvent, data: any) => {
        setLastClickedRow(data);
        console.log(`点击了任务: ${data.name}`);
    }, []);

    const handleTaskMove = useCallback((data: { row: any; old: any }[]) => {
        // 同步更新本地状态
        setTasks(prevTasks => {
            const newTasks = [...prevTasks];
            data.forEach(({ row }) => {
                const updateTask = (tasks: TaskData[]): TaskData[] => {
                    return tasks.map(task => {
                        if (task.id === row.id) {
                            return { ...task, startTime: row.startTime, endTime: row.endTime };
                        }
                        if (task.children) {
                            return { ...task, children: updateTask(task.children) };
                        }
                        return task;
                    });
                };
                newTasks.splice(0, newTasks.length, ...updateTask(newTasks));
            });
            return newTasks;
        });

        console.log(`移动了 ${data.length} 个任务`);
    }, []);

    // 操作函数
    const addRandomTask = useCallback(() => {
        const newTask: TaskData = {
            id: `task-${Date.now()}`,
            name: `新任务 ${Math.floor(Math.random() * 100)}`,
            startTime: '2024-07-01',
            endTime: '2024-07-15',
            progress: Math.floor(Math.random() * 100)
        };

        setTasks(prev => [...prev, newTask]);
    }, []);

    const updateRandomProgress = useCallback(() => {
        setTasks(prev => prev.map(task => ({
            ...task,
            progress: Math.floor(Math.random() * 100),
            children: task.children?.map(child => ({
                ...child,
                progress: Math.floor(Math.random() * 100)
            }))
        })));
    }, []); const deleteSelectedTasks = useCallback(() => {
        if (selectedTasks.length === 0) return;

        const selectedIds = selectedTasks.map((task: any) => task.id);
        setTasks(prev => prev.filter(task => !selectedIds.includes(task.id)));
    }, [selectedTasks]);

    // 甘特图配置
    const ganttOptions: IOptions = {
        data: tasks,
        table: {
            width: 350,
            columns: [
                { field: 'name', label: '任务名称', width: 200, align: 'left' },
                { field: 'progress', label: '进度', width: 80, align: 'center' },
                { field: 'startTime', label: '开始时间', width: 70, align: 'center' }
            ]
        },
        fields: {
            id: 'id',
            name: 'name',
            startTime: 'startTime',
            endTime: 'endTime',
            progress: 'progress',
            children: 'children'
        },
        primaryColor: selectedTheme,
        unit: viewUnit,
        locale: 'zh',
        highlight: true,
        bar: {
            move: {
                enabled: !isReadonly
            }
        }
    };

    return (
        <div style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <h1>高级 React 甘特图示例</h1>

            {/* 控制面板 */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '20px',
                flexWrap: 'wrap',
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
            }}>
                <button onClick={() => jumpTo()}>跳转今天</button>
                <button onClick={addRandomTask}>添加任务</button>
                <button onClick={updateRandomProgress}>随机进度</button>
                <button
                    onClick={deleteSelectedTasks}
                    disabled={selectedTasks.length === 0}
                    style={{ opacity: selectedTasks.length === 0 ? 0.6 : 1 }}
                >
                    删除选中 ({selectedTasks.length})
                </button>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        type="checkbox"
                        checked={isAutoProgress}
                        onChange={(e) => setIsAutoProgress(e.target.checked)}
                    />
                    自动进度
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        type="checkbox"
                        checked={isReadonly}
                        onChange={(e) => setIsReadonly(e.target.checked)}
                    />
                    只读模式
                </label>

                <select
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: '4px' }}
                >
                    {Object.entries(themes).map(([name, color]) => (
                        <option key={name} value={color}>
                            {name} 主题
                        </option>
                    ))}
                </select>

                <select
                    value={viewUnit}
                    onChange={(e) => setViewUnit(e.target.value as 'day' | 'week' | 'month')}
                    style={{ padding: '4px 8px', borderRadius: '4px' }}
                >
                    <option value="day">日视图</option>
                    <option value="week">周视图</option>
                    <option value="month">月视图</option>
                </select>
            </div>

            {/* 信息面板 */}
            <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '20px',
                fontSize: '14px'
            }}>
                <div style={{ padding: '8px 12px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                    总任务数: {tasks.length + tasks.reduce((sum, task) => sum + (task.children?.length || 0), 0)}
                </div>
                <div style={{ padding: '8px 12px', backgroundColor: '#f3e5f5', borderRadius: '4px' }}>
                    已选择: {selectedTasks.length}
                </div>
                {lastClickedRow && (
                    <div style={{ padding: '8px 12px', backgroundColor: '#fff3e0', borderRadius: '4px' }}>
                        最后点击: {lastClickedRow.name}
                    </div>
                )}
                <div style={{ padding: '8px 12px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
                    主题: {Object.entries(themes).find(([, color]) => color === selectedTheme)?.[0]}
                </div>
                <div style={{ padding: '8px 12px', backgroundColor: '#fce4ec', borderRadius: '4px' }}>
                    视图: {viewUnit}
                </div>
            </div>

            {/* 甘特图 */}
            <div style={{
                flex: 1,
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'white'
            }}>
                <XGanttReact
                    ref={ganttRef}
                    style={{ height: '100%', width: '100%' }}
                    options={ganttOptions}
                    onSelect={handleTaskSelect}
                    onClickRow={handleRowClick}
                    onMove={handleTaskMove}
                    onError={(error) => console.error('甘特图错误:', error)}
                />
            </div>
        </div>
    );
}

export default AdvancedGanttExample;
