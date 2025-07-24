import { describe, expect, it } from "vitest";
import { parseNumberWithPercent } from "../../src/utils/helpers";

describe("parseNumberWithPercent", () => {
  it("应该正确处理纯数字", () => {
    expect(parseNumberWithPercent(100, 200)).toBe(100);
    expect(parseNumberWithPercent(0, 200)).toBe(0);
    expect(parseNumberWithPercent(-100, 200)).toBe(-100);
  });

  it("应该正确处理百分比字符串", () => {
    expect(parseNumberWithPercent("50%", 200)).toBe(100);
    expect(parseNumberWithPercent("100%", 200)).toBe(200);
    expect(parseNumberWithPercent("0%", 200)).toBe(0);
  });

  it("应该正确处理数字字符串", () => {
    expect(parseNumberWithPercent("100", 200)).toBe(100);
    expect(parseNumberWithPercent("0", 200)).toBe(0);
    expect(parseNumberWithPercent("-100", 200)).toBe(-100);
  });

  it("应该处理特殊百分比值", () => {
    expect(parseNumberWithPercent("200%", 200)).toBe(400);
    expect(parseNumberWithPercent("-50%", 200)).toBe(-100);
    expect(parseNumberWithPercent("0.5%", 200)).toBe(1);
  });

  it("应该处理无效的百分比字符串", () => {
    expect(parseNumberWithPercent("abc%", 200)).toBe(0);
    expect(parseNumberWithPercent("%", 200)).toBe(0);
    expect(parseNumberWithPercent("%%", 200)).toBe(0);
  });

  it("应该处理目标值为 0 的情况", () => {
    expect(parseNumberWithPercent("50%", 0)).toBe(0);
    expect(parseNumberWithPercent("100%", 0)).toBe(0);
    expect(parseNumberWithPercent("200%", 0)).toBe(0);
  });
});
