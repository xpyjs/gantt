export type BaselineDiffStatus = 'ahead' | 'ontime' | 'delayed';

export interface BaselineDiff {
    /** 开始时间差异 */
    startDiff: number;
    /** 开始状态 */
    startStatus?: BaselineDiffStatus;
    /** 结束时间差异 */
    endDiff: number;
    /** 结束状态 */
    endStatus?: BaselineDiffStatus;
    /** 差异单位 */
    unit: string;
    /** 进度偏差 */
    progressDiff?: number;
}