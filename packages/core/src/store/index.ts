/*
 * @Author: JeremyJone
 * @Date: 2025-04-18 10:56:31
 * @LastEditors: JeremyJone
 * @LastEditTime: 2026-01-12 16:54:12
 * @Description: Store
 */
import { OptionManager } from "./OptionManager";
import { DataManager } from "./DataManager";
import { ColumnManager } from "./ColumnManager";
import { LinkManager } from './LinkManager';
import { TimeAxis } from "./TimeAxis";
import { Dayjs } from "dayjs";
import { setLocale } from "../utils/time";
import { isArray, omit } from "lodash-es";
import { Logger } from "../utils/logger";
import { IContext } from "@/types/render";
import { IOptionConfig, IOptions } from "@/types";
import { ILink } from "@/types/link";
import { EventName } from "../event";

export class Store {
  // 声明成员属性类型
  private optionManager: OptionManager;
  private dataManager: DataManager;
  private columnManager: ColumnManager;
  private linkManager: LinkManager;
  private timeAxis: TimeAxis;

  // 使用私有构造函数防止直接创建实例
  constructor(private context: IContext, options?: IOptions) {
    const _options = omit(options, ["data"]);
    const data = options?.data;
    if (data && !isArray(data)) {
      throw Logger.exception("Data should be a array.");
    }

    this.optionManager = new OptionManager();
    this.optionManager.setOptions(_options);

    if (_options.locale) {
      setLocale(_options.locale);
    }

    this.timeAxis = new TimeAxis();
    this.timeAxis.init(this.optionManager.getOptions());

    this.columnManager = new ColumnManager(this.context);
    if (_options.table && _options.table.columns) {
      this.columnManager.init(_options.table.columns);
    }

    this.dataManager = new DataManager(this, this.context.event);
    if (data) {
      this.dataManager.setData(data, true);
    }
    if (options?.baselines?.data) {
      this.dataManager.setBaselines(options.baselines.data);
    }

    this.linkManager = new LinkManager(this, this.context.event)
    if (isArray(options?.links?.data)) {
      this.linkManager.setLinks(options.links.data as ILink[], true);
    }
    // 设置链路环检查
    this.linkManager.setCycleDetection(options?.links?.enableCycleDetection ?? true);
  }

  getOptionManager() {
    return this.optionManager;
  }

  getDataManager() {
    return this.dataManager;
  }

  getColumnManager() {
    return this.columnManager;
  }

  getLinkManager() {
    return this.linkManager;
  }

  getTimeAxis() {
    return this.timeAxis;
  }

  setOption(options: IOptions, config: IOptionConfig = { merge: true }) {
    const _options = omit(options, ["data"]);
    const data = options?.data;

    this.optionManager.setOptions(_options, config);

    if (_options.milestone?.show !== undefined) {
      this.dataManager.getVisibleTasks().forEach((task) => {
        task.updateMode();
      });
    }

    this.context.getScrollbar().updateOptions(
      this.context.store.getOptionManager().getOptions().scrollbar || {}
    );
    this.context.event.emit(EventName.OPTIONS_UPDATE);

    if (isArray(data)) {
      this.dataManager.setData(data, false);
    }
    if (isArray(options.baselines?.data)) {
      this.dataManager.setBaselines(options.baselines.data);
    }
    if (isArray(options.links?.data)) {
      this.linkManager.setLinks(options.links.data as ILink[], true);
    }

    // 更新链路环检查
    this.linkManager.setCycleDetection(options.links?.enableCycleDetection ?? true);

    if (_options.locale) {
      setLocale(_options.locale);
    }

    if (_options.table && _options.table.columns) {
      this.columnManager.update(_options.table.columns);
    }

    this.timeAxis.update(this.optionManager.getOptions());
  }

  updateTime(start?: Dayjs, end?: Dayjs) {
    this.timeAxis.setDate(start, end);
  }
}
