import { useState, useCallback } from 'react';
import { XGanttReact, useXGantt } from '@xpyjs/gantt-react';
import type { IOptions } from '@xpyjs/gantt-react';
import "@xpyjs/gantt-react/style.css"
import AdvancedGanttExample from './AdvancedExample';

function App() {
    const [currentExample, setCurrentExample] = useState<'basic' | 'advanced'>('basic');

    // 如果选择高级示例，渲染高级组件
    if (currentExample === 'advanced') {
        return <AdvancedGanttExample />;
    }

    return <BasicGanttExample onSwitchExample={setCurrentExample} />;
}

// 基础示例组件
function BasicGanttExample({ onSwitchExample }: { onSwitchExample: (example: 'basic' | 'advanced') => void }) {
    const { ganttRef, jumpTo } = useXGantt();

    // 状态管理
    const [selectedTasks, setSelectedTasks] = useState<any[]>([]);
    const [lastClickedRow, setLastClickedRow] = useState<any>(null);
    const [primaryColor, setPrimaryColor] = useState('#007acc');
    const [currentUnit, setCurrentUnit] = useState<'day' | 'week' | 'month'>('day');
    const [eventLogs, setEventLogs] = useState<Array<{
        time: string;
        event: string;
        data: string;
    }>>([]);

    // 甘特图数据 - 使用状态管理以支持动态更新
    const [ganttData, setGanttData] = useState([
        {
            id: '1',
            name: '项目规划',
            startTime: '2025-05-01',
            endTime: '2025-05-15',
            progress: 80,
            children: [
                {
                    id: '1-1',
                    name: '需求分析',
                    startTime: '2025-05-01',
                    endTime: '2025-05-05',
                    progress: 100
                },
                {
                    id: '1-2',
                    name: '技术选型',
                    startTime: '2025-05-06',
                    endTime: '2025-05-10',
                    progress: 90
                }
            ]
        },
        {
            id: '2',
            name: '开发阶段',
            startTime: '2025-05-16',
            endTime: '2025-06-15',
            progress: 45,
            children: [
                {
                    id: '2-1',
                    name: '前端开发',
                    startTime: '2025-05-16',
                    endTime: '2025-06-15',
                    progress: 70
                },
                {
                    id: '2-2',
                    name: '后端开发',
                    startTime: '2025-05-20',
                    endTime: '2025-06-20',
                    progress: 60
                }
            ]
        }
    ]);

    // 添加日志
    const addLog = useCallback((event: string, data: any) => {
        setEventLogs(prev => [
            {
                time: new Date().toLocaleTimeString(),
                event,
                data: JSON.stringify(data, null, 2).slice(0, 100) + '...'
            },
            ...prev.slice(0, 49)
        ]);
    }, []);    // 事件处理器
    const handleSelect = useCallback((data: any[], checked: boolean, all: any[]) => {
        setSelectedTasks(all);
        addLog('任务选择', { selected: data.length, total: all.length, checked });
    }, [addLog]);

    const handleClickRow = useCallback((_e: MouseEvent, data: any) => {
        setLastClickedRow(data);
        addLog('行点击', { name: data.name, id: data.id });
    }, [addLog]);

    const handleDoubleClickRow = useCallback((_e: MouseEvent, data: any) => {
        addLog('行双击', { name: data.name, id: data.id });
    }, [addLog]);

    const handleMove = useCallback((data: { row: any; old: any }[]) => {
        addLog('任务移动', { count: data.length, tasks: data.map(d => d.row.name) });
        // 注意：在实际应用中，您可能需要根据移动的数据更新本地状态
        // 这里仅做演示，实际的数据同步可以通过回调或状态管理来处理
    }, [addLog]);

    const handleError = useCallback((error: any) => {
        addLog('错误', { message: error.message, type: error.type });
        console.error('甘特图错误:', error);
    }, [addLog]);

    const changePrimaryColor = useCallback(() => {
        const colors = ['#007acc', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
        const currentIndex = colors.indexOf(primaryColor);
        const nextColor = colors[(currentIndex + 1) % colors.length];
        setPrimaryColor(nextColor);
        addLog('主色调切换', { color: nextColor });
    }, [primaryColor, addLog]);

    const changeUnit = useCallback(() => {
        const units: Array<'day' | 'week' | 'month'> = ['day', 'week', 'month'];
        const currentIndex = units.indexOf(currentUnit);
        const nextUnit = units[(currentIndex + 1) % units.length];
        setCurrentUnit(nextUnit);
        addLog('单位切换', { unit: nextUnit });
    }, [currentUnit, addLog]);

    const handleJumpToToday = useCallback(() => {
        const success = jumpTo(); // 不传参数，跳转到今天
        addLog('跳转到今天', { success });
    }, [jumpTo, addLog]);

    const handleJumpToDate = useCallback(() => {
        // 跳转到项目开始日期
        const success = jumpTo('2025-05-01');
        addLog('跳转到项目开始', { success, date: '2025-05-01' });
    }, [jumpTo, addLog]);

    const addTask = useCallback(() => {
        const newTask = {
            id: `new-${Date.now()}`,
            name: `新任务 ${Math.floor(Math.random() * 100)}`,
            startTime: '2025-06-01',
            endTime: '2025-06-10',
            progress: Math.floor(Math.random() * 100),
            children: [] // 确保有children属性
        };

        setGanttData(prev => [...prev, newTask]);
        addLog('添加任务', { name: newTask.name, id: newTask.id });
    }, [addLog]);

    const updateProgress = useCallback(() => {
        setGanttData(prev => prev.map(task => ({
            ...task,
            progress: Math.min(100, task.progress + Math.floor(Math.random() * 10)),
            children: task.children?.map(child => ({
                ...child,
                progress: Math.min(100, child.progress + Math.floor(Math.random() * 10))
            })) || []
        })));
        addLog('更新进度', { message: '所有任务进度已随机更新' });
    }, [addLog]);

    const resetData = useCallback(() => {
        // 重置为初始数据
        setGanttData([
            {
                id: '1',
                name: '项目规划',
                startTime: '2025-05-01',
                endTime: '2025-05-15',
                progress: 80,
                children: [
                    {
                        id: '1-1',
                        name: '需求分析',
                        startTime: '2025-05-01',
                        endTime: '2025-05-05',
                        progress: 100
                    },
                    {
                        id: '1-2',
                        name: '技术选型',
                        startTime: '2025-05-06',
                        endTime: '2025-05-10',
                        progress: 90
                    }
                ]
            },
            {
                id: '2',
                name: '开发阶段',
                startTime: '2025-05-16',
                endTime: '2025-06-15',
                progress: 45,
                children: [
                    {
                        id: '2-1',
                        name: '前端开发',
                        startTime: '2025-05-16',
                        endTime: '2025-06-15',
                        progress: 70
                    },
                    {
                        id: '2-2',
                        name: '后端开发',
                        startTime: '2025-05-20',
                        endTime: '2025-06-20',
                        progress: 60
                    }
                ]
            }
        ]);
        addLog('重置数据', { message: '数据已重置为初始状态' });
    }, [addLog]);

    // 甘特图配置 - 配置会自动更新到甘特图组件
    const ganttOptions: IOptions = {
        data: ganttData,
        table: {
            width: 300,
            columns: [
                {
                    field: 'name',
                    label: '任务名称',
                    width: 200,
                    align: 'left'
                },
                {
                    field: 'progress',
                    label: '进度',
                    width: 100,
                    align: 'center'
                }
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
        primaryColor,
        unit: currentUnit,
        locale: 'zh',
        highlight: true,
        selection: {
            enabled: true
        },
        bar: {
            move: {
                enabled: true,
                byUnit: true
            }
        }
    };

    return (
        <div className="app">
            <h1>XGantt React 基础示例</h1>

            <div className="controls">
                <button
                    onClick={() => onSwitchExample('basic')}
                    style={{ backgroundColor: '#005a9e' }}
                >
                    基础示例
                </button>
                <button
                    onClick={() => onSwitchExample('advanced')}
                    style={{ backgroundColor: '#007acc' }}
                >
                    高级示例
                </button>
                <button onClick={changePrimaryColor}>
                    切换主色调 ({primaryColor})
                </button>
                <button onClick={changeUnit}>
                    切换单位 ({currentUnit})
                </button>
                <button onClick={handleJumpToToday}>
                    跳转到今天
                </button>
                <button onClick={handleJumpToDate}>
                    跳转到项目开始
                </button>
                <button onClick={addTask}>
                    添加任务
                </button>
                <button onClick={updateProgress}>
                    更新进度
                </button>
                <button onClick={resetData}>
                    重置数据
                </button>
            </div>

            <div className="responsive-grid">
                <div className="gantt-wrapper">
                    <XGanttReact
                        ref={ganttRef}
                        style={{ height: '500px', width: '100%' }}
                        options={ganttOptions}
                        onSelect={handleSelect}
                        onClickRow={handleClickRow}
                        onDoubleClickRow={handleDoubleClickRow}
                        onMove={handleMove}
                        onError={handleError}
                    />
                </div>

                <div className="info-panel">
                    <h3>实时信息</h3>

                    <div className="info-section">
                        <h4>选中状态</h4>
                        <div className="info-content">
                            已选择 {selectedTasks.length} 个任务
                            {lastClickedRow && (
                                <div>最后点击: {lastClickedRow.name}</div>
                            )}
                        </div>
                    </div>

                    <div className="info-section">
                        <h4>配置信息</h4>
                        <div className="info-content">
                            <div>主色调: {primaryColor}</div>
                            <div>显示单位: {currentUnit}</div>
                            <div>任务总数: {ganttData.length}</div>
                            <div>子任务总数: {ganttData.reduce((sum, task) => sum + (task.children?.length || 0), 0)}</div>
                        </div>
                    </div>

                    <div className="info-section">
                        <h4>API 使用说明</h4>
                        <div className="info-content">
                            <div>• useXGantt: 获取 ganttRef, jumpTo</div>
                            <div>• 配置自动更新: 修改 options 自动同步</div>
                            <div>• jumpTo(): 跳转到今天</div>
                            <div>• jumpTo(date): 跳转到指定日期</div>
                        </div>
                    </div>

                    <div className="info-section">
                        <h4>事件日志</h4>
                        <div className="event-log">
                            {eventLogs.map((log, index) => (
                                <div key={index} className="log-item">
                                    <span className="log-time">{log.time}</span>
                                    <span className="log-event">{log.event}</span>
                                    <span className="log-data">{log.data}</span>
                                </div>
                            ))}
                            {eventLogs.length === 0 && (
                                <div className="info-content">暂无事件，开始操作甘特图吧！</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
