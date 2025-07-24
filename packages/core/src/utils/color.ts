import { clamp } from "./helpers";
import { Logger } from "./logger";

/**
 * RGBA 颜色接口
 */
interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Colorjs 插件函数类型
 * @param option 插件选项 (可选)
 * @param cls Colorjs 类本身
 * @param factory Colorjs 工厂函数
 */
type PluginFunc = (
  option: any,
  cls: typeof Colorjs,
  factory: typeof colorjs
) => void;

/**
 * 解析颜色字符串或对象为 RGBA 格式
 * @param value - 颜色值 (字符串, 如 '#rgb', '#rrggbb', 'rgb()', 'rgba()', 颜色名; 或对象 {r, g, b, a})
 * @returns RGBA 对象 或 null (无法解析时)
 */
function parseColor(value: string | Partial<RGBA>): RGBA | null {
  if (typeof value === "object" && value !== null) {
    // 如果是对象，填充默认值
    return {
      r: clamp(value.r ?? 0, 0, 255),
      g: clamp(value.g ?? 0, 0, 255),
      b: clamp(value.b ?? 0, 0, 255),
      a: clamp(value.a ?? 1, 0, 1)
    };
  }

  if (typeof value !== "string") {
    Logger.warn(`Invalid color value type: ${typeof value}`);
    return null; // 返回 null 表示无法解析
  }

  let colorStr = value.trim();
  const ctx = document?.createElement("canvas")?.getContext("2d");
  if (ctx) {
    // 利用 canvas 解析颜色名和简写格式
    ctx.fillStyle = colorStr;
    colorStr = ctx.fillStyle; // 获取标准格式 (通常是 #rrggbb 或 rgba())
  }

  // 尝试解析 #rrggbb / #rgb
  if (colorStr.startsWith("#")) {
    const hex = colorStr.slice(1);
    let bigint: number;
    let r: number, g: number, b: number;
    let a = 1; // Hex 默认 alpha 为 1

    try {
      bigint = parseInt(hex, 16);
    } catch (e) {
      Logger.warn(`Invalid hex color: ${value}`);
      return null;
    }

    if (hex.length === 3) {
      // #RGB
      r = ((bigint >> 8) & 15) * 17;
      g = ((bigint >> 4) & 15) * 17;
      b = (bigint & 15) * 17;
    } else if (hex.length === 6) {
      // #RRGGBB
      r = (bigint >> 16) & 255;
      g = (bigint >> 8) & 255;
      b = bigint & 255;
    } else if (hex.length === 8) {
      // #RRGGBBAA
      r = (bigint >> 24) & 255;
      g = (bigint >> 16) & 255;
      b = (bigint >> 8) & 255;
      a = (bigint & 255) / 255; // Alpha from 0-255 to 0-1
    } else {
      Logger.warn(`Invalid hex color length: ${value}`);
      return null;
    }
    return { r, g, b, a };
  }

  // 尝试解析 rgba()
  let parts = colorStr.match(
    /rgba?\(\s*(\d+%?)\s*,\s*(\d+%?)\s*,\s*(\d+%?)\s*(?:,\s*([\d.]+)\s*)?\)/i
  );
  if (parts) {
    const parseChannel = (channel: string): number => {
      if (channel.endsWith("%")) {
        return clamp((parseFloat(channel) / 100) * 255, 0, 255);
      }
      return clamp(parseInt(channel, 10), 0, 255);
    };
    return {
      r: parseChannel(parts[1]),
      g: parseChannel(parts[2]),
      b: parseChannel(parts[3]),
      a: parts[4] !== undefined ? clamp(parseFloat(parts[4]), 0, 1) : 1
    };
  }

  // 无法识别的格式
  Logger.warn(`Could not parse color: ${value}`);
  return null; // 返回 null 表示无法解析
}

/**
 * 将 RGBA 值转换为 Hex (#RRGGBB) 或 HexA (#RRGGBBAA) 字符串
 * @param r - Red (0-255)
 * @param g - Green (0-255)
 * @param b - Blue (0-255)
 * @param a - Alpha (0-1)
 * @param allow3Char - 是否允许输出 #RGB 简写格式 (如果可能)
 * @param forceAlpha - 是否强制输出 Alpha 通道 (即使 a=1)
 * @returns Hex/HexA 字符串
 */
function rgbaToHex(
  r: number,
  g: number,
  b: number,
  a: number,
  allow3Char: boolean = false,
  forceAlpha: boolean = false
): string {
  const toHex = (val: number): string => {
    // 确保是整数再转换
    const hex = Math.round(clamp(val, 0, 255)).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const hexR = toHex(r);
  const hexG = toHex(g);
  const hexB = toHex(b);
  const hexA = toHex(a * 255);

  // 尝试缩写 #RGB
  if (
    allow3Char &&
    hexR[0] === hexR[1] &&
    hexG[0] === hexG[1] &&
    hexB[0] === hexB[1] &&
    a === 1 && // Alpha 必须为 1 才能缩写
    !forceAlpha
  ) {
    return `#${hexR[0]}${hexG[0]}${hexB[0]}`;
  }

  // 标准 #RRGGBB 或 #RRGGBBAA
  const baseHex = `#${hexR}${hexG}${hexB}`;
  if (forceAlpha || a < 1) {
    return `${baseHex}${hexA}`;
  } else {
    return baseHex;
  }
}

/**
 * 提供颜色操作功能的类，支持链式调用。
 * 内部统一使用 RGBA 格式存储。
 */
export class Colorjs {
  // 使用 private 属性，强制通过方法访问和修改
  private _r: number;
  private _g: number;
  private _b: number;
  private _a: number;

  /**
   * 创建一个新的 Colorjs 实例。
   * 推荐使用 colorjs(value) 工厂函数来创建。
   * @param value - 颜色值 (字符串, 如 '#rgb', '#rrggbb', 'rgb()', 'rgba()', 颜色名; 或对象 {r, g, b, a})
   * @throws {Error} 如果颜色值无法解析
   */
  constructor(value: string | Partial<RGBA>) {
    const parsed = parseColor(value);
    if (parsed === null) {
      // 如果解析失败，可以抛出错误或使用默认颜色
      Logger.error(`Failed to parse color: ${value}. Using default black.`);
      this._r = 0;
      this._g = 0;
      this._b = 0;
      this._a = 1;
      // 或者抛出错误: throw new Error(`Invalid color value: ${value}`);
    } else {
      this._r = Math.round(parsed.r);
      this._g = Math.round(parsed.g);
      this._b = Math.round(parsed.b);
      this._a = parsed.a;
    }
  }

  // --- Getters ---
  /** 获取 Red 通道值 (0-255) */
  get R(): number {
    return this._r;
  }
  /** 获取 Green 通道值 (0-255) */
  get G(): number {
    return this._g;
  }
  /** 获取 Blue 通道值 (0-255) */
  get B(): number {
    return this._b;
  }
  /** 获取 Alpha 通道值 (0-1) */
  get A(): number {
    return this._a;
  }

  // --- 基础方法 ---

  /**
   * 获取 Red 通道值 (0-255)
   */
  red(): number;
  /**
   * 设置 Red 通道值 (0-255)
   * @param red - 新的 Red 值 (0-255)
   */
  red(red: number): this;
  red(red?: number) {
    if (red === undefined) {
      return this._r;
    }

    this._r = Math.round(clamp(red, 0, 255));
    return this;
  }

  /**
   * 获取 Green 通道值 (0-255)
   */
  green(): number;
  /**
   * 设置 Green 通道值 (0-255)
   * @param green - 新的 Green 值 (0-255)
   */
  green(green: number): this;
  green(green?: number) {
    if (green === undefined) {
      return this._g;
    }

    this._g = Math.round(clamp(green, 0, 255));
    return this;
  }

  /**
   * 获取 Blue 通道值 (0-255)
   */
  blue(): number;
  /**
   * 设置 Blue 通道值 (0-255)
   * @param blue - 新的 Blue 值 (0-255)
   */
  blue(blue: number): this;
  blue(blue?: number) {
    if (blue === undefined) {
      return this._b;
    }

    this._b = Math.round(clamp(blue, 0, 255));
    return this;
  }

  /**
   * 获取 Alpha 通道值 (0-1)
   */
  alpha(): number;
  /**
   * 设置 Alpha 通道值 (0-1)
   * @param alpha - 新的 Alpha 值 (0-1)
   */
  alpha(alpha: number): this;
  alpha(alpha?: number) {
    if (alpha === undefined) {
      return this._a;
    }

    this._a = clamp(alpha, 0, 1);
    return this;
  }

  // --- 输出方法 ---

  /**
   * 输出为 Hex (#RRGGBB) 或 HexA (#RRGGBBAA) 格式字符串。
   * @param allow3Char - 是否允许输出 #RGB 简写格式 (如果可能, 默认 false)。
   * @param forceAlpha - 是否强制输出 Alpha 通道 (即使 a=1, 默认 false)。
   * @returns Hex/HexA 字符串。
   */
  toHex(allow3Char: boolean = false, forceAlpha: boolean = false): string {
    return rgbaToHex(
      this._r,
      this._g,
      this._b,
      this._a,
      allow3Char,
      forceAlpha
    );
  }

  /**
   * 输出为 rgb() 或 rgba() 格式字符串。
   * @returns 'rgb(r, g, b)' 或 'rgba(r, g, b, a)' 格式字符串。
   */
  toRgb(): string {
    const r = Math.round(this._r);
    const g = Math.round(this._g);
    const b = Math.round(this._b);
    // 根据 alpha 值决定输出 rgb 还是 rgba
    if (this._a === 1) {
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // 保留两位小数的 alpha 值
      const alpha = parseFloat(this._a.toFixed(2));
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }

  /**
   * 输出为包含 r, g, b, a 的对象。
   * @returns RGBA 对象 { r, g, b, a }。
   */
  toObject(): RGBA {
    return { r: this._r, g: this._g, b: this._b, a: this._a };
  }

  /**
   * 默认字符串表示形式，输出为 rgba 格式。
   * @returns rgba 格式字符串。
   */
  toString(): string {
    return this.toRgb();
  }

  // --- 操作方法 (返回 this 以支持链式调用) ---

  /**
   * 增加颜色亮度。
   * @param amount - 增加的百分比 (0-100)，默认为 10。
   * @returns 当前 Colorjs 实例。
   */
  brighten(amount: number = 10): this {
    if (amount < 0) return this.darken(-amount);

    const factor = clamp(amount, 0, 100) / 100;
    // 增加亮度是通过向白色混合来实现的
    // newColor = currentColor + (white - currentColor) * factor
    this._r = Math.round(clamp(this._r + (255 - this._r) * factor, 0, 255));
    this._g = Math.round(clamp(this._g + (255 - this._g) * factor, 0, 255));
    this._b = Math.round(clamp(this._b + (255 - this._b) * factor, 0, 255));
    return this;
  }

  /**
   * 降低颜色亮度 (变暗)。
   * @param amount - 降低的百分比 (0-100)，默认为 10。
   * @returns 当前 Colorjs 实例。
   */
  darken(amount: number = 10): this {
    if (amount < 0) return this.brighten(-amount);

    const factor = clamp(amount, 0, 100) / 100;
    // 降低亮度是通过向黑色混合来实现的
    // newColor = currentColor + (black - currentColor) * factor
    // newColor = currentColor * (1 - factor)
    this._r = Math.round(clamp(this._r * (1 - factor), 0, 255));
    this._g = Math.round(clamp(this._g * (1 - factor), 0, 255));
    this._b = Math.round(clamp(this._b * (1 - factor), 0, 255));
    return this;
  }

  /**
   * 判断颜色是否偏亮。
   * 使用标准的亮度计算公式。
   * @returns 如果颜色偏亮则返回 true，否则返回 false。
   */
  isLight(): boolean {
    // Y = 0.299*R + 0.587*G + 0.114*B
    const brightness = (this._r * 299 + this._g * 587 + this._b * 114) / 1000;
    return brightness > 128; // 阈值可以根据需要调整
  }

  /**
   * 判断颜色是否偏暗。
   * @returns 如果颜色偏暗则返回 true，否则返回 false。
   */
  isDark(): boolean {
    return !this.isLight();
  }

  /**
   * 混合当前颜色与指定颜色。
   * @param colorToMix - 要混合的颜色 (Colorjs 实例或可被 colorjs() 解析的颜色值)。
   * @param amount - 混合的比例 (0-100)，表示 `colorToMix` 所占的权重，默认为 50 (各占一半)。
   * @returns 当前 Colorjs 实例。
   */
  mix(colorToMix: any, amount: number = 50): this {
    const factor = clamp(amount, 0, 100) / 100;
    const otherColor = colorjs(colorToMix); // 确保是 Colorjs 实例

    // new = current * (1 - factor) + other * factor
    this._r = Math.round(
      clamp(this._r * (1 - factor) + otherColor.R * factor, 0, 255)
    );
    this._g = Math.round(
      clamp(this._g * (1 - factor) + otherColor.G * factor, 0, 255)
    );
    this._b = Math.round(
      clamp(this._b * (1 - factor) + otherColor.B * factor, 0, 255)
    );
    this._a = clamp(this._a * (1 - factor) + otherColor.A * factor, 0, 1);

    return this;
  }

  /**
   * 创建当前颜色对象的副本。
   * @returns 一个新的 Colorjs 实例，具有相同的颜色值。
   */
  clone(): Colorjs {
    // 创建新实例并直接赋值内部变量，避免再次解析
    const newInstance = new Colorjs({
      r: this._r,
      g: this._g,
      b: this._b,
      a: this._a
    });
    return newInstance;
  }

  // --- 静态方法 ---

  /**
   * 扩展 Colorjs 功能的插件机制。
   * @param plugin - 插件函数。
   * @param option - 传递给插件的选项 (可选)。
   */
  static extend(plugin: PluginFunc, option?: any): void {
    if (typeof plugin === "function") {
      // 调用插件函数，传入 Colorjs 类、工厂函数和选项
      plugin(option, Colorjs, colorjs);
    } else {
      Logger.warn(
        "Invalid plugin provided to Colorjs.extend. Expected a function."
      );
    }
  }
}

/**
 * Colorjs 工厂函数，用于创建 Colorjs 实例。
 * @param value - 颜色值 (字符串, 如 '#rgb', '#rrggbb', 'rgb()', 'rgba()', 颜色名; 或对象 {r, g, b, a}; 或 Colorjs 实例)
 * @returns Colorjs 实例。如果传入的是 Colorjs 实例，则返回该实例本身。
 * @throws {Error} 如果颜色值无法解析 (除非内部构造函数处理了默认值)。
 */
export const colorjs = (value: any): Colorjs => {
  // 如果 value 已经是 Colorjs 实例，直接返回，避免重复创建
  if (value instanceof Colorjs) {
    return value;
  }
  // 否则，创建新实例
  return new Colorjs(value);
};

// 示例 (如果需要导出的话):
// export { colorjs, Colorjs, RGBA, PluginFunc };
