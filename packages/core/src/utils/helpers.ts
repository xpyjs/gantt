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
 * @param type 取值方式，默认为 round，可选 floor 或 ceil
 * @returns 最近的基准值或其倍数
 */
export function getStandardValue(value: number, target: number, type: 'round' | 'floor' | 'ceil' = 'round'): number {
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

  if (type === 'floor') {
    return lowerValue;
  } else if (type === 'ceil') {
    return upperValue;
  }

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

/**
 * 将 SVG 字符串转成可复用的 HTMLImageElement（带全局缓存）。
 * 同一内容的 svg 只会 decode 一次，后续直接复用 Promise。
 * width / height 参数仅为兼容旧签名，不在此阶段做缩放，缩放交给使用处的 Konva.Image 属性。
 */
const __svgImageCache = new Map<string, Promise<HTMLImageElement>>();

/**
 * svg to image - 简化版本，通过正则表达式处理 SVG
 */
export function svgToImage(
  svg: string,
  width: number = 16,
  height: number = 16
): Promise<HTMLImageElement> {
  const cached = __svgImageCache.get(svg);
  if (cached) return cached;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    // 使用正则表达式处理 SVG 尺寸
    let processedSvg = svg;

    // 检查是否已经有 viewBox
    const hasViewBox = /viewBox\s*=\s*["'][^"']*["']/.test(processedSvg);

    if (!hasViewBox) {
      // 提取原始宽高来创建 viewBox
      const widthMatch = processedSvg.match(/width\s*=\s*["']([^"']*)["']/);
      const heightMatch = processedSvg.match(/height\s*=\s*["']([^"']*)["']/);

      const originalWidth = widthMatch ? parseFloat(widthMatch[1]) : width;
      const originalHeight = heightMatch ? parseFloat(heightMatch[1]) : height;

      // 在 <svg 标签中添加 viewBox
      processedSvg = processedSvg.replace(
        /<svg([^>]*)>/,
        `<svg$1 viewBox="0 0 ${originalWidth} ${originalHeight}">`
      );
    }

    // 替换或添加 width 和 height 属性
    processedSvg = processedSvg.replace(/width\s*=\s*["'][^"']*["']/, `width="${width}"`);
    processedSvg = processedSvg.replace(/height\s*=\s*["'][^"']*["']/, `height="${height}"`);

    // 如果没有 width 或 height 属性，添加它们
    if (!/width\s*=/.test(processedSvg)) {
      processedSvg = processedSvg.replace(/<svg/, `<svg width="${width}"`);
    }
    if (!/height\s*=/.test(processedSvg)) {
      processedSvg = processedSvg.replace(/<svg/, `<svg height="${height}"`);
    }

    // 确保有 preserveAspectRatio 属性
    if (!/preserveAspectRatio\s*=/.test(processedSvg)) {
      processedSvg = processedSvg.replace(
        /<svg([^>]*)>/,
        '<svg$1 preserveAspectRatio="xMidYMid meet">'
      );
    }

    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img);
    };
    img.onerror = (error) => {
      URL.revokeObjectURL(img.src);
      __svgImageCache.delete(svg);
      reject(error);
    };

    // 创建一个 Blob 对象
    const blob = new Blob([processedSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    img.src = url;
  });

  __svgImageCache.set(svg, promise);
  return promise;
}