/*
 * @Author: JeremyJone
 * @Date: 2025-04-18 10:59:03
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-08-06 15:26:40
 * @Description:任务数据模型
 */

import type { Dayjs } from "dayjs";
import { generateId } from "../utils/id";
import dayjs from "dayjs";
import { type EventBus, EventName } from "../event";
import { cloneDeep, isArray, isObject, isString } from "lodash-es";
import { IGanttOptions, TaskType } from "../types/options";
import { EmitData } from "@/types";
import { Store } from "@/store";

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
   * 时间持续间隔
   */
  private duration: number = 0;
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

  /** 切换展示模式时，需要调整时间 */
  updateMode() {
    // 更新开始时间
    if (this.data[this.fields.startTime]) {
      this.startTime = dayjs(this.data[this.fields.startTime]);
    }

    // 更新结束时间
    if (this.data[this.fields.endTime]) {
      this.endTime = dayjs(this.data[this.fields.endTime]);
    }

    // 更新持续时间
    if (this.startTime && this.endTime) {
      this.duration = this.endTime.diff(this.startTime);
    }

    if (this.isMilestone()) {
      this.endTime = this.startTime;
    }
  }

  updateData(data: any): void {
    // 替换数据
    this.data = data;

    // 更新任务名称
    if (data[this.fields.name]) {
      this.name = data[this.fields.name];
    }

    if (data[this.fields.type]) {
      this.type = data[this.fields.type];
    }

    this.updateMode();

    // 更新进度
    if (data[this.fields.progress] !== undefined) {
      this.progress = data[this.fields.progress];
    }


    // 触发更新事件
    this.event.emit(EventName.UPDATE_TASK, this);
  }

  updateTime(startTime: Dayjs, endTime: Dayjs): void {
    this.startTime = startTime;
    this.endTime = this.isMilestone() ? startTime : endTime;

    const format = this.store?.getOptionManager().getOptions()?.dateFormat;

    this.data[this.fields.startTime || "startTime"] =
      this.startTime.format(format);

    if (!this.isMilestone()) {
      this.data[this.fields.endTime || "endTime"] = this.endTime.format(format);
    } else {
      // 里程碑模式下，要保持起止时间的间距，需要使用 duration
      this.data[this.fields.endTime || "endTime"] = this.startTime.add(this.duration).format(format);
    }

    this.event.emit(EventName.UPDATE_TASK, this);
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

  public getEmitData(): EmitData {
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
        if (isArray(child.children) && child.children.length > 0) {
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
}
