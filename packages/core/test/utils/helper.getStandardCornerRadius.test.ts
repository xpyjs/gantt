import { describe, expect, it } from "vitest";
import { getStandardCornerRadius } from "../../src/utils/helpers";

describe("getStandardCornerRadius", () => {
  it("应该处理单个数字输入", () => {
    expect(getStandardCornerRadius(5)).toEqual([5, 5, 5, 5]);
    expect(getStandardCornerRadius(0)).toEqual([0, 0, 0, 0]);
    expect(getStandardCornerRadius(10)).toEqual([10, 10, 10, 10]);
  });

  it("应该处理数组输入", () => {
    expect(getStandardCornerRadius([5, 10, 15, 20])).toEqual([5, 10, 15, 20]);
    expect(getStandardCornerRadius([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
  });

  it("应该使用默认值填充不完整的数组", () => {
    expect(getStandardCornerRadius([5])).toEqual([5, 4, 4, 4]);
    expect(getStandardCornerRadius([5, 10])).toEqual([5, 10, 4, 4]);
    expect(getStandardCornerRadius([5, 10, 15])).toEqual([5, 10, 15, 4]);
  });

  it("应该处理空数组", () => {
    expect(getStandardCornerRadius([])).toEqual([4, 4, 4, 4]);
  });

  it("应该处理未定义的输入", () => {
    expect(getStandardCornerRadius()).toEqual([4, 4, 4, 4]);
    expect(getStandardCornerRadius(undefined)).toEqual([4, 4, 4, 4]);
  });

  it("应该使用自定义默认值", () => {
    expect(getStandardCornerRadius(undefined, 8)).toEqual([8, 8, 8, 8]);
    expect(getStandardCornerRadius([], 8)).toEqual([8, 8, 8, 8]);
    expect(getStandardCornerRadius([5], 8)).toEqual([5, 8, 8, 8]);
  });
});
