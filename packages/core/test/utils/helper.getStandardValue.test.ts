import { describe, expect, it } from "vitest";
import { getStandardValue } from "../../src/utils/helpers";

describe("getStandardValue", () => {
  it("应该返回最近的基准值倍数", () => {
    expect(getStandardValue(11, 5)).toBe(10);
    expect(getStandardValue(14, 5)).toBe(15);
    expect(getStandardValue(13, 5)).toBe(15);
    expect(getStandardValue(12, 5)).toBe(10);
  });

  it("应该处理负数", () => {
    expect(getStandardValue(-11, 5)).toBe(-10);
    expect(getStandardValue(-14, 5)).toBe(-15);
    expect(getStandardValue(-13, 5)).toBe(-15);
    expect(getStandardValue(-12, 5)).toBe(-10);
  });

  it("应该处理接近零的值", () => {
    expect(getStandardValue(2, 5)).toBe(0);
    expect(getStandardValue(-2, 5)).toBe(0);
    expect(getStandardValue(2.4, 5)).toBe(0);
    expect(getStandardValue(-2.4, 5)).toBe(0);
  });

  it("应该处理边界值", () => {
    expect(getStandardValue(5, 5)).toBe(5);
    expect(getStandardValue(10, 5)).toBe(10);
    expect(getStandardValue(-5, 5)).toBe(-5);
    expect(getStandardValue(-10, 5)).toBe(-10);
  });

  it("应该处理小数基准值", () => {
    expect(getStandardValue(1.1, 0.5)).toBe(1);
    expect(getStandardValue(1.4, 0.5)).toBe(1.5);
    expect(getStandardValue(-1.1, 0.5)).toBe(-1);
    expect(getStandardValue(-1.4, 0.5)).toBe(-1.5);
  });

  it("应该在基准值为 0 时抛出错误", () => {
    expect(() => getStandardValue(10, 0)).toThrow("基准值不能为0");
  });
});
