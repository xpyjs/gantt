/**
 * 处理大小的尺寸单位，将其转换为有效的 CSS 尺寸字符串。
 * @param size 输入的大小值，可以是数字、字符串、null 或 undefined。
 * @param defaultSize 如果输入无效，则返回的默认尺寸字符串。
 * @returns 有效的 CSS 尺寸字符串或默认值。
 */
export function wrapSize(size: any, defaultSize = ""): string {
  const validUnits = ["px", "%", "vh", "vw", "rem", "em"];

  if (size === undefined || size === null) {
    return defaultSize;
  }

  if (typeof size === "number") {
    // 确保数字是有限的，避免 NaN 和 Infinity
    return isFinite(size) ? `${size}px` : defaultSize;
  }

  if (typeof size === "string") {
    const trimmedSize = size.trim();

    // 如果修剪后为空字符串，返回默认值
    if (trimmedSize === "") {
      return defaultSize;
    }

    // 检查是否以有效单位结尾
    for (const unit of validUnits) {
      if (trimmedSize.endsWith(unit)) {
        const valuePart = trimmedSize
          .substring(0, trimmedSize.length - unit.length)
          .trim();
        // 尝试将值部分转换为数字并验证
        const numericValue = Number(valuePart);
        if (!isNaN(numericValue) && isFinite(numericValue)) {
          // 重新组合以保留原始格式（如果有效）
          return `${numericValue}${unit}`;
        }
        // 如果值部分无效，则跳出循环，尝试作为纯数字处理或返回默认值
        break;
      }
    }

    // 如果不以有效单位结尾，尝试将整个字符串视为数字
    const numericValue = Number(trimmedSize);
    if (!isNaN(numericValue) && isFinite(numericValue)) {
      return `${numericValue}px`;
    }
  }

  // 如果所有检查都失败，返回默认值
  return defaultSize;
}
