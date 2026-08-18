/*
 * @Author: JeremyJone
 * @Date: 2025-04-18 10:59:03
 * @LastEditors: JeremyJone
 * @LastEditTime: 2026-08-19 11:20:00
 * @Description:任务数据模型
 */

import type { ConfigType, Dayjs } from "dayjs";
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
      // 有 endTime 字段，优先使用。endOf 在解析时生效：按数据给出精度
      // 补全缺失位，'end' 语义下结束时间保持在尾单位内（如 1 天任务
      // 为 18日 23:59:59），duration 计算与视觉宽度由此对齐
      const newEndTime = this.parseEndTime(this.data[this.fields.endTime]);
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
          // duration 推导出计算边界（如 1 天任务为次日 0 点），
          // 含尾语义下退 1 秒收回尾单位内存储
          const edge = workCalendar ? this.workEdge(this.startTime, durationValue) : undefined;
          const newEndTime = edge ? this.fromEdge(edge) : undefined;
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

    // 更新持续时间。endTime 优先级高于 duration 字段，起止时间变化时必须
    // 重算，否则 updateData 换时间后 duration 会残留旧值
    if (this.startTime && this.endTime) {
      if (changeTime || !this._duration) {
        const edge = this.toEdge(this.endTime);
        // duration 以“天”为单位；无工作日历时退化为日历天数。
        // workDiff 可能为 0（起止同一时刻），不能用 || 兜底，否则会混入毫秒单位
        this._duration = workCalendar
          ? workCalendar.workDiff(this.startTime, edge)
          : edge.diff(this.startTime, "day", true);
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
   * 解析数据的结束时间
   *
   * `date.endOf` 在这里生效，按原始值的给出精度补全缺失位：
   * - 'end'：含尾语义。day 粒度的 "2026-08-18" 表示当天结束，补全为
   *   2026-08-18 23:59:59。结束时间保持在尾单位内，不落到下一单位
   *   边界，格子高亮、跳过非工作日的判定不会越界；时长计算由
   *   {@link Task.toEdge} 补 1 秒还原计算边界
   * - 'start' / 元组：按配置补全缺失位，已有位保留
   * - 未配置：保持原始解析值
   *
   * 补全只在存在缺失位时生效；dayjs 实例不保留原始输入的精度信息，
   * 因此 raw 需由调用方传入。
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

  /** 是否为含尾语义（endOf='end'）：结束时间是尾单位内的最后一秒 */
  private isInclusiveEnd(): boolean {
    return this.store.getOptionManager().getOptions().date?.endOf === "end";
  }

  /**
   * 存储的结束时间 → 时长计算边界
   *
   * 含尾语义下结束时间是尾单位内的最后一秒（如 1 天任务为
   * 18日 23:59:59），时长按"从起始秒起数的完整秒数"计：补 1 秒得到
   * 下一单位边界再求差。因此 18日 0 点 - 18日 23:59:59 的时长为 1；
   * 不足最后一秒（如 23:50:20）则为 0.xxx 小数
   */
  private toEdge(et: Dayjs): Dayjs {
    return this.isInclusiveEnd() ? et.add(1, "second") : et;
  }

  /**
   * 时长计算边界 → 存储的结束时间
   *
   * 由 duration 推导的边界（如 1 天任务的次日 0 点）退 1 秒收回
   * 尾单位内存储（18日 23:59:59）。非 0 点起始同样成立：13:00:00
   * 起 1 天，结束时间为次日 12:59:59
   */
  private fromEdge(edge: Dayjs): Dayjs {
    return this.isInclusiveEnd() ? edge.subtract(1, "second") : edge;
  }

  /**
   * 归一化交互产生的结束时间为存储值
   *
   * 拖拽反推的时间有两种来源：按单位吸附得到的是计算边界（恰落在
   * 单位起点，如次日 0 点），退 1 秒收尾存储；自由拖拽反推的是右缘
   * 时刻（本身已是含尾末尾），原样存储，避免每次交互累计偏移
   */
  private normalizeEnd(et: Dayjs): Dayjs {
    if (!this.isInclusiveEnd()) return et;
    const unit = this.store.getTimeAxis?.()?.getCellUnit?.() ?? "day";
    return et.isSame(et.startOf(unit)) ? this.fromEdge(et) : et;
  }

  /**
   * 由起始时间与 duration 推导计算边界
   *
   * 单位起点整起始（如 0 点）且 duration 为整数时，任务的最后一个
   * 单位是完整的工作日，边界落在该工作日的末尾。直接用
   * workOffset(st, duration) 推进会在尾日紧邻周末时把边界多推一个
   * 工作日（如周五起 1 天的任务被扩到下周一）；改为定位到最后一个
   * 工作日再取次日 0 点。非单位起点（如 13:00）或小数 duration 的
   * 时长按工作时间推进，仍由 workOffset 直接计算（如 13:00 起 1 天，
   * 边界为下一个工作日的 13:00）
   */
  private workEdge(st: Dayjs, duration: number): Dayjs {
    const workCalendar = this.store.getWorkCalendar();
    const unit = this.store.getTimeAxis?.()?.getCellUnit?.() ?? "day";
    if (st.isSame(st.startOf(unit)) && Number.isInteger(duration)) {
      return workCalendar.workOffset(st, duration - 1).add(1, "day");
    }
    return workCalendar.workOffset(st, duration);
  }

  /**
   * 结束时间回写 data 时的格式化
   *
   * 存储的结束时间已在尾单位内，直接格式化即可，重解析后由
   * {@link Task.parseEndTime} 补全回同一时间，保证回写前后一致
   */
  private formatEndTime(endTime: Dayjs, format: string): string {
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
   * 交互（拖拽/缩放）产生的起止时间经 {@link Task.normalizeEnd} 归一化
   * 后存储；回写经 {@link Task.formatEndTime} 直接格式化，重解析后
   * 还原同一时间
   */
  updateTime(startTime: Dayjs, endTime: Dayjs, updateDuration?: boolean): void {
    let st = startTime;
    let et = this.isMilestone() ? st : endTime;

    if (!st || !et) {
      Logger.warn(`Task [${this.data}] has some error about startTime or endTime.`);
      return;
    }

    this.startTime = st;
    // 里程碑的结束时间就是开始时间，不参与含尾收尾
    this.endTime = this.isMilestone() ? et : this.normalizeEnd(et);

    // 更新 duration
    if (updateDuration) {
      this.updateDuration(st, this.endTime);
    }

    const format = this.store?.getOptionManager().getOptions()?.date?.format || this.store?.getOptionManager().getOptions()?.dateFormat;
    this.data[this.fields.startTime || "startTime"] =
      this.startTime.format(format);

    if (!this.isMilestone()) {
      this.data[this.fields.endTime || "endTime"] = this.formatEndTime(this.endTime, format);
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
   *
   * endTime 为存储的结束时间，含尾语义下由 {@link Task.toEdge} 补
   * 1 秒还原计算边界后求差，整单位任务的 duration 为整数
   */
  updateDuration(startTime: Dayjs, endTime: Dayjs): void {
    const workCalendar = this.store.getWorkCalendar();
    this._duration = workCalendar.workDiff(startTime, this.toEdge(endTime));

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
      // 存储的结束时间先补 1 秒还原计算边界，再向前推 duration
      st = workCalendar.currentWorkTime(workCalendar.workOffset(this.toEdge(et), -this._duration), 'before');
    } else if (direction === 'right') {
      // 边界落在最后一个工作日的末尾（次日 0 点），允许紧邻周末，
      // 不做工作时间修正，避免把任务尾部再推过一个周末
      et = this.fromEdge(this.workEdge(st, this._duration));
    } else {
      st = workCalendar.currentWorkTime(st);
      et = this.fromEdge(this.workEdge(st, this._duration));
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
