import { Dayjs } from "../utils/time";
import { ErrorType } from "../event";
import { ILink } from "./link";

export interface EventMap {
  /** 加载完成事件 */
  loaded: () => void;
  /** 错误事件 */
  error: (error: ErrorType, msg?: string) => void;
  /** 关联线更新事件 */
  "update:link": (link: ILink) => void;
  /** 创建关联线事件 */
  "create:link": (link: ILink) => void;
  /** 关联线被选中事件，支持多个选中 */
  "select:link": (
    /** 当前被新选中的关连线 */
    add: ILink | null,
    /** 当前被取消选中的关联线 */
    cancel: ILink | null,
    /** 所有目前被选中的关联线 */
    all: ILink[]
  ) => void;
  /** 关联线右键点击事件 */
  "contextmenu:link": (e: MouseEvent, link: ILink) => void;
  /** 任务被选中（checkbox）事件，支持多个选中 */
  select: (data: any[], checked: boolean, all: any[]) => void;
  /** 行点击事件 */
  "click:row": (e: MouseEvent, data: any, time?: Dayjs) => void;
  /** 行双击事件 */
  "dblclick:row": (e: MouseEvent, data: any, time?: Dayjs) => void;
  /** 行右键点击事件 */
  "contextmenu:row": (e: MouseEvent, data: any, time?: Dayjs) => void;
  /** 行拖拽事件。当且仅当行拖拽结束时被触发。仅当 启用 drag 配置项后生效 */
  "drag:row": (target: any, source: any) => void;
  /** 任务条点击事件 */
  "click:slider": (e: MouseEvent, data: any) => void;
  /** 任务条双击事件 */
  "dblclick:slider": (e: MouseEvent, data: any) => void;
  /** 任务条右键点击事件 */
  "contextmenu:slider": (e: MouseEvent, data: any) => void;
  /** 任务拖拽事件。当且仅当任务条拖拽结束时被触发 */
  move: (data: { row: any; old: any }[]) => void;
  /** 鼠标移入任务条事件 */
  "enter:slider": (e: MouseEvent, data: any) => void;
  /** 鼠标悬停任务条事件。当鼠标一直处于任务条上时，会持续触发 */
  "hover:slider": (e: MouseEvent, data: any) => void;
  /** 鼠标移出任务条事件 */
  "leave:slider": (e: MouseEvent, data: any) => void;
  /** 基线点击事件 */
  "click:baseline": (e: MouseEvent, data: any, baseline: any) => void;
  /** 基线右键点击事件 */
  "contextmenu:baseline": (e: MouseEvent, data: any, baseline: any) => void;
  /** 基线鼠标移入事件 */
  "enter:baseline": (e: MouseEvent, data: any, baseline: any) => void;
  /** 基线鼠标悬停事件。当鼠标一直处于基线上时，会持续触发 */
  "hover:baseline": (e: MouseEvent, data: any, baseline: any) => void;
  /** 基线鼠标移出事件 */
  "leave:baseline": (e: MouseEvent, data: any, baseline: any) => void;
}
