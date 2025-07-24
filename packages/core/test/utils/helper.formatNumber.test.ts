import { describe, expect, test } from "vitest";
import { formatNumber } from "../../src/utils/helpers";

describe("formatNumber", () => {
  // 测试整数
  test("整数格式化", () => {
    expect(formatNumber(100)).toBe("100");
    expect(formatNumber(100, 2, true)).toBe("100.00");
    expect(formatNumber(1000)).toBe("1000");
    expect(formatNumber(1000, 2, true)).toBe("1000.00");
  });

  // 测试小数
  test("小数格式化", () => {
    expect(formatNumber(100.123)).toBe("100.12");
    expect(formatNumber(100.123, 3)).toBe("100.123");
    expect(formatNumber(100.123, 1)).toBe("100.1");
    expect(formatNumber(100.555)).toBe("100.56"); // 测试四舍五入
    expect(formatNumber(100.554, 2)).toBe("100.55"); // 测试四舍五入
  });

  // 测试零小数
  test("零小数格式化", () => {
    expect(formatNumber(100.0)).toBe("100");
    expect(formatNumber(100.0, 2, true)).toBe("100.00");
    expect(formatNumber(100.1)).toBe("100.1");
    expect(formatNumber(100.1, 2, true)).toBe("100.10");
    expect(formatNumber(100.1)).toBe("100.1"); // 测试末尾 0 的去除
    expect(formatNumber(100.1)).toBe("100.1"); // 测试多个末尾 0 的去除
  });

  // 测试负数
  test("负数格式化", () => {
    expect(formatNumber(-100.123)).toBe("-100.12");
    expect(formatNumber(-100.123, 3)).toBe("-100.123");
    expect(formatNumber(-100.0)).toBe("-100");
    expect(formatNumber(-100.0, 2, true)).toBe("-100.00");
    expect(formatNumber(-0.123)).toBe("-0.12");
    expect(formatNumber(-0.123, 3)).toBe("-0.123");
  });

  // 测试零值
  test("零值格式化", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(0, 2, true)).toBe("0.00");
    expect(formatNumber(0.0)).toBe("0");
    expect(formatNumber(0.0, 2, true)).toBe("0.00");
    expect(formatNumber(-0)).toBe("0");
    expect(formatNumber(-0, 2, true)).toBe("0.00");
  });

  // 测试特殊小数
  test("特殊小数格式化", () => {
    expect(formatNumber(0.1)).toBe("0.1");
    expect(formatNumber(0.01)).toBe("0.01");
    expect(formatNumber(0.001, 2)).toBe("0");
    expect(formatNumber(0.001, 3)).toBe("0.001");
    expect(formatNumber(0.0001, 3)).toBe("0");
    expect(formatNumber(0.0001, 4)).toBe("0.0001");
  });

  // 测试极限值
  test("极限值格式化", () => {
    expect(formatNumber(Number.MAX_SAFE_INTEGER)).toBe(
      Number.MAX_SAFE_INTEGER.toString()
    );
    expect(formatNumber(Number.MIN_SAFE_INTEGER)).toBe(
      Number.MIN_SAFE_INTEGER.toString()
    );
    expect(formatNumber(1e-7, 7)).toBe("0.0000001");
    expect(formatNumber(1e7)).toBe("10000000");
  });

  // 测试精度边界
  test("精度边界测试", () => {
    expect(formatNumber(123.456, 0)).toBe("123");
    expect(formatNumber(123.456, 10)).toBe("123.456");
    expect(formatNumber(123.000001, 2)).toBe("123");
    expect(formatNumber(123.000001, 6)).toBe("123.000001");
  });
});
