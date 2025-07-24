import { describe, expect, it } from "vitest";
import { clamp } from "../../src/utils/helpers";

describe("clamp", () => {
  it("应该正确限制数值在范围内", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("应该处理最小值大于最大值的情况", () => {
    expect(clamp(5, 10, 0)).toBe(5);
    expect(clamp(-5, 10, 0)).toBe(0);
    expect(clamp(15, 10, 0)).toBe(10);
  });

  it("应该处理边界值", () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
    expect(clamp(5, 5, 5)).toBe(5);
  });

  it("应该处理无效输入", () => {
    expect(clamp(NaN, 0, 10)).toBe(0);
    expect(clamp(5, NaN, 10)).toBe(0);
    expect(clamp(5, 0, NaN)).toBe(0);
    expect(clamp(Infinity, 0, 10)).toBe(0);
    expect(clamp(-Infinity, 0, 10)).toBe(0);
  });

  it("应该处理小数", () => {
    expect(clamp(5.5, 0, 10)).toBe(5.5);
    expect(clamp(-5.5, 0, 10)).toBe(0);
    expect(clamp(15.5, 0, 10)).toBe(10);
  });
});
