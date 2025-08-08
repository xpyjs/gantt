/*
 * @Author: JeremyJone
 * @Date: 2025-04-18 10:56:01
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-08-08 15:38:40
 * @Description: 配置项管理器
 */

import { Task } from "@/models/Task";
import { IOptionConfig, IOptions } from "@/types";
import { IGanttOptions } from "@/types/options";
import { isArray, isFunction, isString, merge } from "lodash-es";

const DEFAULT_OPTIONS: () => IGanttOptions = () => ({
  data: [],
  links: {
    show: false,
    key: "id",
    data: [],
    distance: 20,
    dash: [6, 3],
    width: 1,
    gap: 5,
    arrow: {
      width: 6,
      height: 8
    },
    radius: 3,
    create: {
      enabled: false,
      mode: "hover",
      radius: 3,
      width: 2,
      from: true,
      to: true
    },
    move: {
      enabled: false
    }
  },
  baselines: {
    data: [],
    taskKey: "taskId",
    show: false,
    fields: {
      startTime: 'startTime',
      endTime: 'endTime',
      name: 'name',
      id: 'id',
      target: 'target',
      highlight: 'highlight'
    },
    mode: 'line',
    position: "bottom",
    backgroundColor: "#999",
    opacity: 0.6,
    radius: 2,
    label: {
      show: false,
      forceDisplay: false,
      color: "#666",
      fontSize: 10,
      position: 'right',
      fontFamily: "Arial"
    },
    compare: {
      enabled: false,
      tolerance: 0.5,
      mode: 'both',
      target: 'end',
      delayed: {
        backgroundColor: "#ff4444",
        opacity: 0.8,
      },
      ahead: {
        backgroundColor: "#44ff44",
        opacity: 0.8,
      },
      indicator: {
        show: true,
        position: 'top',
        fontFamily: "Arial",
        fontSize: 10,
        size: 6,
        delayed: {
          show: true,
          color: "#af1b1b",
          opacity: 1,
        },
        ahead: {
          show: true,
          color: "#1baf1b",
          opacity: 1,
        },
        ontime: {
          show: false,
          color: '#999',
          opacity: 1,
        }
      }
    }
  },
  milestone: {
    show: false,
    shape: 'diamond',
    border: {
      width: 1
    },
    label: {
      show: true,
      text: "",
      fontSize: 10,
      fontFamily: "Arial",
      position: "top-right"
    }
  },
  summary: {
    show: false,
    mode: 'expand',
    move: {
      enabled: false
    }
  },
  fields: {
    id: "id",
    startTime: "startTime",
    endTime: "endTime",
    name: "name",
    progress: "progress",
    children: "children",
    type: "type"
  },
  selection: {
    enabled: false,
    includeSelf: true
  },
  expand: {
    show: true,
    enabled: true
  },
  dateFormat: "YYYY-MM-DD HH:mm:ss",
  locale: "en",
  unit: "day",
  table: {
    width: 100,
    ellipsis: true,
    align: "center",
    headerAlign: "center",
    emptyText: "-"
  },
  chart: {
    autoCellWidth: false,
    cellWidth: "normal"
  },
  primaryColor: "#eca710",
  border: {
    color: "#e5e5e5"
  },
  header: {
    height: 80,
    color: "#000",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "Arial"
  },
  row: {
    height: 30,
    indent: 16,
    hover: {
      backgroundColor: "#000",
      opacity: 0.05
    },
    select: {
      backgroundColor: "#000",
      opacity: 0.1
    }
  },
  bar: {
    height: 20,
    show: true,
    move: {
      byUnit: false,
      link: {
        child: "none",
        parent: "none"
      }
    }
  },
  today: {
    show: true,
    type: "line",
    backgroundColor: "lightblue",
    opacity: 1,
    width: 1
  },
  weekend: {
    show: true,
    backgroundColor: "#c9c9c9",
    opacity: 0.1
  },
  holiday: {
    opacity: 0.1
  }
});

export class OptionManager {
  private options: IGanttOptions = DEFAULT_OPTIONS();

  constructor() { }

  getOptions(): IGanttOptions {
    return this.options;
  }

  setOptions(options: IOptions, config: IOptionConfig = { merge: true }) {
    this.options = config.merge
      ? merge(DEFAULT_OPTIONS(), this.options, options)
      : merge(DEFAULT_OPTIONS(), options);

    if (isArray(options.links?.data)) {
      this.options.links.data = options.links.data as any;
    }
  }

  update(newOptions: IOptions) {
    this.setOptions(newOptions);
  }

  getRowBackgroundColor(task: Task): string {
    let fill = "";
    const backgroundColor = this.options.row?.backgroundColor;
    if (isString(backgroundColor)) {
      fill = backgroundColor;
    } else if (isArray(backgroundColor) && backgroundColor.length > 0) {
      fill = backgroundColor[task.level];
    } else if (isFunction(backgroundColor)) {
      fill = backgroundColor(task.getEmitData());
    }

    return fill;
  }

  unpackFunc<T>(value: T | ((data: any) => T), task: Task): T {
    if (isFunction(value)) {
      return value(task.getEmitData());
    }
    return value;
  }
}
