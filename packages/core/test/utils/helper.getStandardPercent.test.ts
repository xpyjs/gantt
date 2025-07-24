import { describe, expect, it } from "vitest";
import { getStandardPercent } from "../../src/utils/helpers";

describe("getStandardPercent", () => {
  describe("基本功能测试", () => {
    it("应该正确处理默认满分值 100 的情况", () => {
      expect(getStandardPercent(0)).toBe(0);
      expect(getStandardPercent(25)).toBe(0.25);
      expect(getStandardPercent(50)).toBe(0.5);
      expect(getStandardPercent(75)).toBe(0.75);
      expect(getStandardPercent(100)).toBe(1);
    });

    it("应该正确处理自定义满分值", () => {
      expect(getStandardPercent(0, 200)).toBe(0);
      expect(getStandardPercent(50, 200)).toBe(0.25);
      expect(getStandardPercent(100, 200)).toBe(0.5);
      expect(getStandardPercent(200, 200)).toBe(1);
    });

    it("应该正确处理小数", () => {
      expect(getStandardPercent(12.5, 100)).toBe(0.125);
      expect(getStandardPercent(33.33, 100)).toBe(0.3333);
      expect(getStandardPercent(0.5, 1)).toBe(0.5);
    });
  });

  describe("边界情况测试", () => {
    it("应该处理负数值", () => {
      expect(getStandardPercent(-10)).toBe(0);
      expect(getStandardPercent(-0.5)).toBe(0);
      expect(getStandardPercent(-100)).toBe(0);
    });

    it("应该处理超过满分的值", () => {
      expect(getStandardPercent(150, 100)).toBe(1);
      expect(getStandardPercent(200, 100)).toBe(1);
      expect(getStandardPercent(1000, 100)).toBe(1);
      expect(getStandardPercent(300, 200)).toBe(1);
    });

    it("应该处理零值", () => {
      expect(getStandardPercent(0, 100)).toBe(0);
      expect(getStandardPercent(0, 50)).toBe(0);
      expect(getStandardPercent(0, 1)).toBe(0);
    });
  });

  describe("异常情况测试", () => {
    it("应该处理满分值为 0 的情况", () => {
      expect(getStandardPercent(50, 0)).toBe(0);
      expect(getStandardPercent(100, 0)).toBe(0);
    });

    it("应该处理负的满分值", () => {
      expect(getStandardPercent(50, -100)).toBe(0.5);
      expect(getStandardPercent(25, -50)).toBe(0.5);
    });

    it("应该处理 NaN 和 Infinity", () => {
      expect(getStandardPercent(NaN, 100)).toBe(0);
      expect(getStandardPercent(50, NaN)).toBe(0);
      expect(getStandardPercent(Infinity, 100)).toBe(0);
      expect(getStandardPercent(50, Infinity)).toBe(0);
      expect(getStandardPercent(-Infinity, 100)).toBe(0);
      expect(getStandardPercent(50, -Infinity)).toBe(0);
    });
  });

  describe("精度测试", () => {
    it("应该保持数值精度", () => {
      expect(getStandardPercent(1, 3)).toBeCloseTo(0.3333333333333333);
      expect(getStandardPercent(2, 3)).toBeCloseTo(0.6666666666666666);
      expect(getStandardPercent(1, 7)).toBeCloseTo(0.14285714285714285);
    });
  });

  describe("特殊用例测试", () => {
    it("应该处理非常小的数值", () => {
      expect(getStandardPercent(0.001, 1)).toBe(0.001);
      expect(getStandardPercent(0.0001, 0.001)).toBe(0.1);
    });

    it("应该处理非常大的数值", () => {
      expect(getStandardPercent(1000000, 2000000)).toBe(0.5);
      expect(getStandardPercent(5000000, 1000000)).toBe(1);
    });
  });
});
