/*
 * @Author: JeremyJone
 * @Date: 2025-07-30 17:26:18
 * @LastEditors: JeremyJone
 * @LastEditTime: 2026-08-18 10:30:00
 * @Description: 基线数据模型
 */
import type { ConfigType, Dayjs } from "dayjs";
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
    if (_et) this.endTime = this.parseEndTime(_et);

    this.data = data;
  }

  /**
   * 解析基线的结束时间
   *
   * 与 {@link Task.parseEndTime} 同一语义：`date.endOf` 在解析时生效，
   * 'end' 含尾语义下按数据给出精度补全缺失位，结束时间保持在尾单位
   * 内（如 18日 23:59:59）。基线的渲染位置、与任务的对比都基于
   * 同一含尾时间
   */
  private parseEndTime(raw: unknown): Dayjs {
    let et = dayjs(raw as ConfigType);
    const options = this.store.getOptionManager().getOptions();
    const endOf = options.date?.endOf;
    if (endOf !== undefined) {
      const unit = this.store.getTimeAxis?.()?.getCellUnit?.() ?? "day";
      et = et.complementEndOf({
        endOf,
        raw,
        endOfAll: options.date?.endOfAll === true,
        unit
      });
    }
    return et;
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
   *
   * 起止时间均为含 endOf 解析语义的存储时间，ahead/ontime/delayed
   * 的判定与任务条、基线条的视觉位置一致。
   */
  getTimeDiff(): BaselineDiff | null {
    if (!this.validate()) return null;

    const task = this.store.getDataManager().getTaskById(this.taskId);
    if (!task || !task.startTime || !task.endTime) return null;

    const unit = this.store.getTimeAxis().getCellUnit();
    const blEnd = this.endTime!;
    const taskEnd = task.endTime;

    const startDiff = this.startTime!.diff(task.startTime!, unit, true);
    const endDiff = blEnd.diff(taskEnd, unit, true);

    const tolerance = this.store.getOptionManager().getOptions().baselines.compare.tolerance; // 0.5 个单位内认为是准时的

    const startStatus: BaselineDiffStatus = startDiff < -tolerance ? 'delayed' : startDiff > tolerance ? 'ahead' : 'ontime';
    const endStatus: BaselineDiffStatus = endDiff < -tolerance ? 'delayed' : endDiff > tolerance ? 'ahead' : 'ontime';

    // 计算偏差百分比
    const blDuration = blEnd.diff(this.startTime!, unit, true);
    const taskDuration = taskEnd.diff(task.startTime!, unit, true);
    const progressDiff = blDuration > 0 ? ((taskDuration - blDuration) / blDuration) * 100 : 0;

    return { startDiff, endDiff, startStatus, endStatus, progressDiff, unit };
  }
}
