const MAX_INLINE_LENGTH = 70;
const INDENTATION = "  ";

/**
 * 递归地将任何 JavaScript 值格式化为字符串。
 * @param value 要格式化的值
 * @param indentLevel 当前的缩进级别
 * @param visited 用于检测循环引用的 Set
 * @returns 格式化后的字符串
 */
const formatValue = (
  value: any,
  indentLevel: number,
  visited: Set<any>
): string => {
  // 处理原始类型
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return `'${value}'`;
  if (["number", "boolean", "bigint"].includes(typeof value))
    return String(value);
  if (typeof value === "symbol") return value.toString();

  // 处理函数
  if (typeof value === "function") {
    const str = value.toString();
    // 简化原生代码的显示
    if (str.includes("[native code]")) {
      return `function ${value.name}() { [native code] }`;
    }
    return str;
  }

  // 处理对象类型
  if (typeof value === "object") {
    // 检测循环引用
    if (visited.has(value)) {
      return "'[Circular]'";
    }

    // 优化：在进入递归前添加，在完成后移除
    visited.add(value);

    const currentIndent = INDENTATION.repeat(indentLevel);
    const nextIndent = INDENTATION.repeat(indentLevel + 1);

    // 增加对 Error 对象的处理
    if (value instanceof Error) {
      visited.delete(value); // 完成处理，从 visited 中移除
      return `new Error('${value.message}')`;
    }
    if (value instanceof Date) {
      visited.delete(value);
      return `new Date('${value.toISOString()}')`;
    }
    if (value instanceof RegExp) {
      visited.delete(value);
      return value.toString();
    }

    let result: string;

    if (Array.isArray(value)) {
      if (value.length === 0) {
        result = "[]";
      } else {
        const items = value.map(item =>
          formatValue(item, indentLevel + 1, visited)
        );
        const inline = `[${items.join(", ")}]`;
        result =
          inline.length <= MAX_INLINE_LENGTH
            ? inline
            : `[\n${items
                .map(item => `${nextIndent}${item}`)
                .join(",\n")}\n${currentIndent}]`;
      }
    } else if (value instanceof Map) {
      if (value.size === 0) {
        result = "new Map()";
      } else {
        const entries = Array.from(value.entries()).map(
          ([k, v]) =>
            `[${formatValue(k, indentLevel + 1, visited)}, ${formatValue(
              v,
              indentLevel + 1,
              visited
            )}]`
        );
        const inline = `new Map([${entries.join(", ")}])`;
        result =
          inline.length <= MAX_INLINE_LENGTH
            ? inline
            : `new Map([\n${entries
                .map(entry => `${nextIndent}${entry}`)
                .join(",\n")}\n${currentIndent}])`;
      }
    } else if (value instanceof Set) {
      if (value.size === 0) {
        result = "new Set()";
      } else {
        const items = Array.from(value.values()).map(item =>
          formatValue(item, indentLevel + 1, visited)
        );
        const inline = `new Set([${items.join(", ")}])`;
        result =
          inline.length <= MAX_INLINE_LENGTH
            ? inline
            : `new Set([\n${items
                .map(item => `${nextIndent}${item}`)
                .join(",\n")}\n${currentIndent}])`;
      }
    } else {
      // 处理普通对象
      const keys = Object.keys(value);
      if (keys.length === 0) {
        result = "{}";
      } else {
        // 优化：消除重复代码
        const properties = keys.map(key => {
          const keyStr = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
            ? key
            : `'${key}'`;
          const valStr = formatValue(value[key], indentLevel + 1, visited);
          return { keyStr, valStr };
        });

        const inline = `{ ${properties
          .map(p => `${p.keyStr}: ${p.valStr}`)
          .join(", ")} }`;

        if (inline.length <= MAX_INLINE_LENGTH) {
          result = inline;
        } else {
          const formattedProperties = properties.map(
            p => `${nextIndent}${p.keyStr}: ${p.valStr}`
          );
          result = `{\n${formattedProperties.join(",\n")}\n${currentIndent}}`;
        }
      }
    }

    visited.delete(value); // 完成处理，从 visited 中移除
    return result;
  }

  return String(value);
};

/**
 * 将任意类型的值转换为格式化的字符串，支持自定义前缀
 * @param value 要格式化的值（支持任意类型）
 * @param prefix 每行的前缀字符串（可选）
 * @returns 格式化后的字符串
 */
export const toStr = (value: any, prefix?: string): string => {
  const res = formatValue(value, 0, new Set());

  if (!prefix) {
    return res;
  }

  return res
    .split("\n")
    .map((line, index) => {
      if (index === 0) {
        return line;
      }
      return prefix + line;
    })
    .join("\n");
};

/**
 * 将任意值转换为 JSON 字符串，支持自定义前缀
 * @param value 要格式化的值（支持任意类型）
 * @param prefix 每行的前缀字符串（可选）
 * @returns 格式化后的字符串
 */
export const toJSON = (value: any, prefix?: string): string => {
  const res = JSON.stringify(value, null, 2);

  if (!prefix) {
    return res;
  }

  return res
    .split("\n")
    .map((line, index) => {
      if (index === 0) {
        return line;
      }
      return prefix + line;
    })
    .join("\n");
};
