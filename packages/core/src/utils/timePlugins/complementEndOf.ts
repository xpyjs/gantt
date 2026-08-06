import type { Dayjs } from "../time";

/**
 * endOf 配置取值类型
 *
 * - 'start'：缺失精度位补 0
 * - 'end'：缺失精度位补最大值（时=23，分/秒=59）
 * - [时, 分, 秒]：缺失精度位按位补为数组对应值
 */
export type EndOfValue = "start" | "end" | [number, number, number];

/**
 * complementEndOf 插件方法的配置
 */
export interface ComplementEndOfOptions {
  /** endOf 配置 */
  endOf: EndOfValue;
  /**
   * 原始值（字符串/Date/number），用于字符串精度识别。
   * dayjs 实例化后不保留原始输入的精度信息，需由调用方传入。
   */
  raw?: unknown;
  /** 是否强制全量调整，默认 false */
  endOfAll?: boolean;
  /** 时间轴底层单位 */
  unit: "hour" | "day";
}

/** 可被 endOf 调整的时间位 */
type TimeSlot = "hour" | "minute" | "second";

/** 时间位对应的精度层级（越细越大） */
const SLOT_LEVEL: Record<TimeSlot, number> = {
  hour: 1,
  minute: 2,
  second: 3
};

/** 字符串原始值可识别的精度层级 */
const PRECISION_LEVEL: Record<string, number> = {
  day: 0,
  hour: 1,
  minute: 2,
  second: 3
};

/** 时间位在 [时,分,秒] 元组中的索引 */
const SLOT_TO_TUPLE_IDX: Record<TimeSlot, number> = {
  hour: 0,
  minute: 1,
  second: 2
};

/**
 * 识别字符串日期的“给出精度”。
 *
 * 支持常见格式：`YYYY-MM-DD`、`YYYY/MM/DD`、`YYYY-MM-DD HH`、`YYYY-MM-DD HH:mm`、
 * `YYYY-MM-DD HH:mm:ss`、`YYYY-MM-DDTHH:mm:ss` 等。
 *
 * @returns 精度层级字符串；无法识别时返回 null（视为已完整，不调整）
 */
export function getStringPrecision(
  raw: string
): "day" | "hour" | "minute" | "second" | null {
  const str = raw.trim();
  // 日期部分 + 可选时间部分（时 / 分 / 秒 / 毫秒）
  const m = str.match(
    /^(\d{4}[-/]\d{1,2}[-/]\d{1,2})(?:[T ](\d{1,2})(?::(\d{1,2})(?::(\d{1,2})(?:\.\d+)?)?)?)?$/
  );
  if (!m) return null;
  if (m[4] !== undefined) return "second";
  if (m[3] !== undefined) return "minute";
  if (m[2] !== undefined) return "hour";
  return "day";
}

/**
 * complementEndOf 插件
 *
 * 为 dayjs 实例挂载 {@link Dayjs.complementEndOf} 方法，用于根据 endOf 配置
 * 补全结束时间的缺失精度位。
 *
 * 调用方式：`dayjs(endTime).complementEndOf({ endOf, raw, endOfAll, unit })`
 *
 * 该方法只服务于展示层（任务条、连线、基线等渲染取值），
 * 不参与 duration 计算与数据回写。
 *
 * 调整规则：
 * - 可调位由底层单位 U 决定：U='day' → [时,分,秒]；U='hour' → [分,秒]（时位不可调，元组第 0 位忽略）。
 * - 字符串原始值按其“给出精度”判定缺失位；缺失位才补，已有位保留。
 * - `'start'`：缺失位补 0；`'end'`：缺失位补最大值；`[h,m,s]`：缺失位补元组对应位的值。
 * - `endOfAll=false`（默认）：仅字符串可识别精度且存在缺失位时调整；Date/number 不调整。
 * - `endOfAll=true`：忽略精度感知，按底层单位全位调整（对所有类型生效）。
 */
export const complementEndOfPlugin = (o: any, c: any) => {
  const proto = c.prototype;

  proto.complementEndOf = function (options: ComplementEndOfOptions): Dayjs {
    const { endOf, raw, endOfAll = false, unit } = options;
    if (endOf === undefined) return this;

    // 可调位：U=day → [时,分,秒]；U=hour → [分,秒]
    const allSlots: TimeSlot[] =
      unit === "hour" ? ["minute", "second"] : ["hour", "minute", "second"];

    // 计算需要补全的位
    const needFill: TimeSlot[] = [];

    if (endOfAll) {
      // 强制全量调整：所有可调位都补
      needFill.push(...allSlots);
    } else if (typeof raw === "string") {
      // 精度感知：按原始字符串的给出精度判定缺失位
      const p = getStringPrecision(raw);
      if (p) {
        const pLevel = PRECISION_LEVEL[p];
        for (const slot of allSlots) {
          if (SLOT_LEVEL[slot] > pLevel) needFill.push(slot);
        }
      }
      // p 为 null：无法识别精度，视为已完整，不补
    }

    if (needFill.length === 0) return this;

    let result: Dayjs = this;
    for (const slot of needFill) {
      let val: number;
      if (endOf === "start") {
        val = 0;
      } else if (endOf === "end") {
        val = slot === "hour" ? 23 : 59;
      } else {
        // 元组 [时, 分, 秒]：按位取值
        val = endOf[SLOT_TO_TUPLE_IDX[slot]];
      }
      if (slot === "hour") result = result.hour(val);
      else if (slot === "minute") result = result.minute(val);
      else result = result.second(val);
    }

    return result;
  };
};

declare module "dayjs" {
  interface Dayjs {
    /**
     * 根据 endOf 配置补全当前时间的缺失精度位。
     *
     * 仅用于展示层取值，不得用于 duration 计算或数据回写。
     *
     * @param options 调整配置
     * @returns 调整后的新 Dayjs 实例；未配置或不满足调整条件时返回原实例
     */
    complementEndOf(options: ComplementEndOfOptions): this;
  }
}