import { isString } from "lodash-es";

/**
 * 取一个范围值
 */
export function clamp(value: number, min: number, max: number) {
  // 检查输入是否都是有效的数字
  if (
    !Number.isFinite(value) ||
    !Number.isFinite(min) ||
    !Number.isFinite(max)
  ) {
    return Number.isFinite(min) ? min : 0; // 无效输入时返回最小值或0
  }

  const _min = Math.min(min, max);
  const _max = Math.max(min, max);

  return Math.min(Math.max(_min, value), _max);
}

/**
 * 处理百分比数字文本以及纯数字
 *
 * @description 转换纯数字与百分比的数值，返回真实使用的数值
 */
export function parseNumberWithPercent(value: number | string, target: number) {
  let _v = value;
  if (isString(_v)) {
    if (/%$/.test(_v)) {
      _v = (target * parseFloat(_v)) / 100;
    } else {
      _v = parseFloat(_v);
    }
  }

  if (isNaN(_v)) return 0;
  return _v;
}

/**
 * 获取距离当前值最近的基准值或其倍数
 * @param value 当前值
 * @param target 基准值
 * @returns 最近的基准值或其倍数
 */
export function getStandardValue(value: number, target: number): number {
  if (target === 0) {
    throw new Error("基准值不能为0");
  }

  // 如果 value 接近 0，直接返回 0
  if (Math.abs(value) <= target / 2) {
    return 0;
  }

  const lowerMultiple = Math.floor(value / target);
  const upperMultiple = Math.ceil(value / target);

  const lowerValue = lowerMultiple * target;
  const upperValue = upperMultiple * target;

  // 比较距离
  const distanceToLower = Math.abs(value - lowerValue);
  const distanceToUpper = Math.abs(value - upperValue);

  return distanceToLower <= distanceToUpper ? lowerValue : upperValue;
}

/**
 * 计算两个数的最大公约数
 */
export function gcd(a: number, b: number): number {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * 获取标准圆角数据
 *
 * 圆角数据可能为 number，也可能为 number[]，统一转为 number[]
 */
export function getStandardCornerRadius(
  radius?: number | number[],
  defaultRadius: number = 4
): [number, number, number, number] {
  if (typeof radius === "number") {
    return [radius, radius, radius, radius];
  } else if (Array.isArray(radius)) {
    return [
      radius[0] ?? defaultRadius,
      radius[1] ?? defaultRadius,
      radius[2] ?? defaultRadius,
      radius[3] ?? defaultRadius
    ];
  }
  return [defaultRadius, defaultRadius, defaultRadius, defaultRadius];
}

/**
 * 获取标准百分比值
 *
 * @param value 目标值
 * @param full 满分值，默认为 100
 * @returns 0-1 之间的百分比值
 */
export function getStandardPercent(value: number, full: number = 100): number {
  // 参数验证
  if (!Number.isFinite(value) || !Number.isFinite(full)) {
    return 0;
  }

  // 满分值不能为 0
  if (full === 0) {
    return 0;
  }

  // 负数直接返回 0
  if (value < 0) {
    return 0;
  }

  // 计算百分比
  const result = value / Math.abs(full); // 使用绝对值处理负的满分值

  // 确保结果在 0-1 范围内
  return Math.min(result, 1);
}

/**
 * 格式化数字。
 *
 * 要求：
 * 1、根据精度格式化数字
 * 2、被格式化的数字，如果小数位都位 0，默认不展示。但是如果 forceDisplay 为 true，则保留
 */
export function formatNumber(
  value: number,
  precision: number = 2,
  forceDisplay = false
): string {
  const v = value.toFixed(precision);
  if (forceDisplay) {
    return v;
  }

  return v.replace(/\.?0+$/, "");
}
