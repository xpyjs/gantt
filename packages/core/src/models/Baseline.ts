/*
 * @Author: JeremyJone
 * @Date: 2025-07-30 17:26:18
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-08-04 09:22:05
 * @Description: 基线数据模型
 */
import type { Dayjs } from "dayjs";
import { Store } from "@/store";
import { generateId } from "../utils/id";
import dayjs from "dayjs";
import { type EventBus, EventName } from "../event";
import { BaselineDiff, BaselineDiffStatus } from "../types/baseline";

/**
 * 基线数据模型
 */
export class Baseline {
  /** 基线ID */
  id: string;
  /** 任务ID */
  taskId: string;
  /** 开始时间 */
  startTime?: Dayjs;
  /** 结束时间 */
  endTime?: Dayjs;
  /** 基线名称 */
  name?: string;
  /** 原始数据 */
  data: any;

  /** 是否高亮 */
  highlight = true;
  /** 是否为指示器对比基线 */
  target = false;

  constructor(private store: Store, private event: EventBus, data: any) {
    const fields = this.store.getOptionManager().getOptions().fields;
    const baselineFields = this.store.getOptionManager().getOptions().baselines.fields;

    this.taskId = data[store.getOptionManager().getOptions().baselines.taskKey];

    this.id = data[fields.id] || data[baselineFields.id] || generateId();
    this.name = data[fields.name] || data[baselineFields.name] || '';

    this.highlight = data[baselineFields.highlight] !== false; // 默认高亮，除非显式设置为 false
    this.target = data[baselineFields.target] === true; // 默认不是指示器对比基线，除非显式设置为 true

    const _st = data[fields.startTime] || data[baselineFields.startTime];
    if (_st) this.startTime = dayjs(_st);
    const _et = data[fields.endTime] || data[baselineFields.endTime];
    if (_et) this.endTime = dayjs(_et);

    this.data = data;
  }

  getField(field: string): any {
    return this.data[field];
  }

  /**
   * 验证基线的有效性
   */
  validate(): boolean {
    if (!this.taskId) return false;
    if (!this.startTime || !this.endTime) return false;
    return this.startTime.isBefore(this.endTime);
  }

  /**
   * 获取基线与任务的时间差异分析
   */
  getTimeDiff(): BaselineDiff | null {
    if (!this.validate()) return null;

    const task = this.store.getDataManager().getTaskById(this.taskId);
    if (!task || !task.startTime || !task.endTime) return null;

    const unit = this.store.getTimeAxis().getCellUnit();
    const startDiff = this.startTime!.diff(task.startTime!, unit, true);
    const endDiff = this.endTime!.diff(task.endTime!, unit, true);

    const tolerance = this.store.getOptionManager().getOptions().baselines.compare.tolerance; // 0.5 个单位内认为是准时的

    const startStatus: BaselineDiffStatus = startDiff < -tolerance ? 'delayed' : startDiff > tolerance ? 'ahead' : 'ontime';
    const endStatus: BaselineDiffStatus = endDiff < -tolerance ? 'delayed' : endDiff > tolerance ? 'ahead' : 'ontime';

    // 计算偏差百分比
    const blDuration = this.endTime!.diff(this.startTime!, unit, true);
    const taskDuration = task.endTime!.diff(task.startTime!, unit, true);
    const progressDiff = blDuration > 0 ? ((taskDuration - blDuration) / blDuration) * 100 : 0;

    return { startDiff, endDiff, startStatus, endStatus, progressDiff, unit };
  }
}
