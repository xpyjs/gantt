/*
 * @Author: JeremyJone
 * @Date: 2025-04-18 10:59:03
 * @LastEditors: JeremyJone
 * @LastEditTime: 2026-08-18 10:30:00
 * @Description:任务数据模型
 */

import type { Dayjs } from "dayjs";
import { generateId } from "../utils/id";
import dayjs from "dayjs";
import { type EventBus, EventName } from "../event";
import { cloneDeep, isObject, isString } from "lodash-es";
import { IGanttOptions, TaskType } from "../types/options";
import { Store } from "@/store";
import { clamp } from "../utils/helpers";
import { Logger } from "../utils/logger";

export class Task {
  __key__ = generateId();
  /**
   * 任务ID
   * 如果没有提供，则会自动生成一个唯一ID
   */
  id: string;
  /**
   * 任务名称
   */
  name: string;
  /**
   * 任务开始时间
   * 如果没有提供，则默认为 undefined
   */
  startTime?: Dayjs;
  /**
   * 任务结束时间
   * 如果没有提供，则默认为 undefined
   */
  endTime?: Dayjs;
  /**
   * 任务进度
   */
  progress?: number;
  /** 任务类型 */
  type: TaskType;
  /**
   * 是否展开
   * 如果没有提供，则默认为 true
   */
  expanded?: boolean;
  /**
   * 子任务列表
   * 如果没有子任务，则默认为空数组
   */
  children: Task[];
  /**
   * 父任务
   * 如果没有父任务，则默认为 undefined
   */
  parent?: Task;
  /**
   * 任务层级，从0开始
   */
  level: number;
  /**
   * 在扁平化列表中的索引位置，从0开始
   */
  flatIndex: number;

  /**
   * 工时持续时长
   *
   * @description 优先取原始 data 中的 duration
   * @description 若原始数据未提供，则由 endTime - startTime 计算，仅保存在内部，不回填原始数据
   */
  private _duration: number = 0;

  /**
   * 原始数据
   */
  data: any;

  private fields: IGanttOptions["fields"];

  constructor(
    private store: Store,
    private event: EventBus,
    data: any,
    parent?: Task,
    _id?: string
  ) {
    this.fields = this.store.getOptionManager().getOptions().fields;

    this.id = _id || data[this.fields.id] || generateId();
    this.data = data;

    this.name = data[this.fields.name] || "";
    this.type = data[this.fields.type] || "task"

    this.updateMode();

    this.progress = data[this.fields.progress];
    this.expanded = this.store.getOptionManager().getOptions().expand.show
      ? this.store.getOptionManager().getOptions().expand.enabled
      : true;

    this.children = [];

    this.level = parent
      ? parent.level !== undefined
        ? parent.level + 1
        : 0
      : 0;
    this.parent = parent;
    this.flatIndex = 0;

    // 更新起止时间
    this.store.updateTime(this.startTime, this.endTime);
  }

  getField(field: string): any {
    if (!field || (isString(field) && field.trim() === "")) {
      return undefined;
    }

    // 如果字段名不包含点号，直接返回
    if (!field.includes(".")) {
      return this.data[field];
    }

    // 分割字段路径
    const fieldPath = field.split(".");
    let current = this.data;

    // 遍历路径，逐层获取属性
    for (let i = 0; i < fieldPath.length; i++) {
      const key = fieldPath[i];

      // 检查当前层级是否存在且为对象（除了最后一层）
      if (
        current === null ||
        current === undefined ||
        typeof current !== "object"
      ) {
        return undefined;
      }

      // 检查属性是否存在
      if (!(key in current)) {
        return undefined;
      }

      current = current[key];
    }

    // 如果最终结果是对象，进行深拷贝
    return isObject(current) ? cloneDeep(current) : current;
  }

  /** 切换展示模式时，需要调整展示长度 */
  updateMode(): boolean {
    let isChanged = false;
    let changeTime = false;

    // 更新开始时间
    if (this.data[this.fields.startTime]) {
      if (!this.startTime || !this.startTime.isSame(dayjs(this.data[this.fields.startTime]))) {
        this.startTime = dayjs(this.data[this.fields.startTime]);
        isChanged = true;
        changeTime = true;
      }
    }

    const workCalendar = this.store.getWorkCalendar();

    // 更新结束时间（优先级：endTime > duration）
    if (this.data[this.fields.endTime]) {
      // 有 endTime 字段，优先使用。保持原始解析值，endOf 只在展示层生效
      const newEndTime = dayjs(this.data[this.fields.endTime]);
      if (!this.endTime || !this.endTime.isSame(newEndTime)) {
        this.endTime = newEndTime;
        isChanged = true;
        changeTime = true;
      }
    } else if (this.fields.duration && this.data[this.fields.duration]) {
      // 没有 endTime，但有 duration 字段
      const durationValue = Number(this.data[this.fields.duration]);
      if (!isNaN(durationValue) && durationValue > 0) {
        if (this.startTime) {
          // duration 推导的是排他边界（如 3 天任务的结束时间是第 4 天 0 点），保持原样
          const newEndTime = workCalendar?.workOffset(this.startTime, durationValue);
          if (!this.endTime || !this.endTime.isSame(newEndTime)) {
            this.endTime = newEndTime;
            this._duration = durationValue;
            isChanged = true;
            changeTime = true;
          }
        }
      } else {
        Logger.warn(`The \`${this.fields.duration}\` field should be a positive number, fractional values are allowed.`)
      }
    }

    if (changeTime) {
      // 更新起止时间
      this.store.updateTime(this.startTime, this.endTime);
    }

    // 更新持续时间
    if (this.startTime && this.endTime) {
      if (!this._duration) {
        this._duration = workCalendar?.workDiff(this.startTime, this.endTime) || this.endTime.diff(this.startTime);
      }
    }

    if (this.isMilestone()) {
      // 里程碑模式下，结束时间 = 开始时间
      if (!this.endTime || !this.endTime.isSame(this.startTime)) {
        this.endTime = this.startTime;
        isChanged = true;
      }
    }

    return isChanged;
  }

  /**
   * 展示用结束时间
   *
   * 应用 `date.endOf` 配置补全缺失精度位，仅用于渲染取值
   * （任务条宽度、连线锚点、基线对比等），duration 计算与数据回写
   * 始终使用 {@link Task.endTime} 原始值。
   *
   * 规则：
   * - 里程碑的结束时间就是开始时间，不做补全
   * - 原始数据未给出 endTime（由 duration 推导）时，结束时间是排他边界，不做补全
   * - 字符串按给出精度补全缺失位；Date/number 由 endOfAll 控制
   */
  getDisplayEndTime(): Dayjs | undefined {
    if (!this.endTime) return this.endTime;
    if (this.isMilestone()) return this.endTime;

    const rawEnd = this.data[this.fields.endTime];
    if (!rawEnd) return this.endTime;

    const options = this.store.getOptionManager().getOptions();
    const endOf = options.date?.endOf;
    if (endOf === undefined) return this.endTime; // 未配置，不调整

    return this.endTime.complementEndOf({
      endOf,
      raw: rawEnd,
      endOfAll: options.date?.endOfAll === true,
      unit: this.store.getTimeAxis().getCellUnit() // "hour" | "day"
    });
  }

  /**
   * 结束时间回写 data 时的格式化
   *
   * endOf 为 'end' 且 format 精度不足秒位时，直接格式化排他边界
   * （如 3 天任务的次日 0 点）会丢失时间位，重新解析后按“含当日”
   * 语义补全会比回写前多出一天。这里退回 1 毫秒，让重解析后的
   * 展示位置与回写前一致。
   */
  private formatEndTime(endTime: Dayjs, format: string): string {
    const endOf = this.store.getOptionManager().getOptions().date?.endOf;
    if (endOf === "end" && !/[sS]/.test(format)) {
      return endTime.subtract(1, "millisecond").format(format);
    }
    return endTime.format(format);
  }

  updateData(data: any): void {
    // 替换数据
    this.data = data;

    // 脏数据
    let dirty = false;

    // 更新任务名称
    if (data[this.fields.name]) {
      if (this.name !== data[this.fields.name]) {
        this.name = data[this.fields.name];
        dirty = true;
      }
    }

    if (data[this.fields.type]) {
      if (this.type !== data[this.fields.type]) {
        this.type = data[this.fields.type];
        dirty = true;
      }
    }

    dirty = this.updateMode();

    // 更新进度
    if (data[this.fields.progress] !== undefined) {
      if (this.progress !== data[this.fields.progress]) dirty = true;
      this.progress = clamp(data[this.fields.progress], 0, 100);
    }

    // 触发更新事件
    if (dirty) {
      this.event.emit(EventName.UPDATE_TASK, this);
    }
  }

  /**
   * 更新 Task 时间并修改原始 data
   *
   * 交互（拖拽/缩放）产生的时间是网格对齐的完整时刻，直接作为原始值保存，
   * 不做 endOf 补全；展示层的补全由 {@link Task.getDisplayEndTime} 处理。
   */
  updateTime(startTime: Dayjs, endTime: Dayjs, updateDuration?: boolean): void {
    let st = startTime;
    let et = this.isMilestone() ? st : endTime;

    if (!st || !et) {
      Logger.warn(`Task [${this.data}] has some error about startTime or endTime.`);
      return;
    }

    this.startTime = st;
    this.endTime = et;

    // 更新 duration
    if (updateDuration) {
      this.updateDuration(st, et);
    }

    const format = this.store?.getOptionManager().getOptions()?.date?.format || this.store?.getOptionManager().getOptions()?.dateFormat;
    this.data[this.fields.startTime || "startTime"] =
      this.startTime.format(format);

    if (!this.isMilestone()) {
      this.data[this.fields.endTime || "endTime"] = this.formatEndTime(et, format);
    } else {
      this.data[this.fields.endTime || "endTime"] = this.formatEndTime(
        this.startTime.add(this.duration),
        format
      );
    }

    this.event.emit(EventName.UPDATE_TASK, this);
  }

  /**
   * 更新 Task 持续时间并修改原始 data
   */
  updateDuration(startTime: Dayjs, endTime: Dayjs): void {
    const workCalendar = this.store.getWorkCalendar();
    this._duration = workCalendar.workDiff(startTime, endTime);

    // 只有原始数据给出字段，才更新 data
    if (this.fields.duration) {
      this.data[this.fields.duration] = this._duration;
    }
  }

  /**
   * 按照规则，适配任务时间
   *
   * 规则：
   * - 根据 direction 判断移动内容：left - 开始时间，right - 结束时间，both - 起止时间
   * - 同时缺失 endTime、duration 的话，直接返回
   * - 根据 duration 重新计算 endTime
   * - 启用了跳过非工作日模式，自动调整任务时间，使其落在工作日上
   */
  fitWork(direction: "left" | "right" | "both" = 'both', options?: { start?: Dayjs, end?: Dayjs }) {
    let st = options?.start || this.startTime;
    let et = options?.end || this.endTime;

    if(!st || !et || !this._duration) return;

    const workCalendar = this.store.getWorkCalendar();

    // 适配工作时间
    if (direction === 'left') {
      st = workCalendar.currentWorkTime(workCalendar.workOffset(et, -this._duration), 'before');
    } else if (direction === 'right') {
      et = workCalendar.currentWorkTime(workCalendar.workOffset(st, this._duration));
    } else {
      st = workCalendar.currentWorkTime(st);
      et = workCalendar.currentWorkTime(workCalendar.workOffset(st, this._duration));
    }

    // 特殊处理：里程碑模式，结束时间 = 开始时间
    if (this.isMilestone()) {
      et = st;
    }

    if (st && et) this.updateTime(st, et);
  }

  /** 获取当前 duration */
  get duration(): number {
    return this._duration;
  }

  public clone() {
    return new Task(
      this.store,
      this.event,
      cloneDeep(this.data),
      this.parent,
      this.id
    );
  }

  public getEmitData() {
    return {
      data: this.data,
      $index: this.flatIndex,
      level: this.level + 1
    };
  }

  public getAllChildren(): Task[] {
    const allChildren: Task[] = [];
    const traverse = (children: Task[]) => {
      children.forEach(child => {
        allChildren.push(child);
        if (child.children && child.children.length > 0) {
          traverse(child.children);
        }
      });
    };
    traverse(this.children);
    return allChildren;
  }

  public isMilestone() {
    if (this.store.getOptionManager().getOptions().milestone.show)
      return this.type === 'milestone';

    return false;
  }

  public isSummary() {
    if (this.store.getOptionManager().getOptions().summary.show)
      return this.type === 'summary';

    return false;
  }

  public isSomeoneChildren(parent: Task | undefined): boolean {
    let p = parent;
    while (p) {
      if (p.id === this.id) {
        return true;
      }
      p = p.parent;
    }
    return false;
  }
}
