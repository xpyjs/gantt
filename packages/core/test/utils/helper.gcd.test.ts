import { describe, expect, it } from "vitest";
import { gcd } from "../../src/utils/helpers";

describe("gcd", () => {
  it("应该计算正数的最大公约数", () => {
    expect(gcd(12, 8)).toBe(4);
    expect(gcd(54, 24)).toBe(6);
    expect(gcd(7, 13)).toBe(1);
    expect(gcd(100, 10)).toBe(10);
  });

  it("应该处理相等的数", () => {
    expect(gcd(5, 5)).toBe(5);
    expect(gcd(0, 0)).toBe(0);
    expect(gcd(100, 100)).toBe(100);
  });

  it("应该处理零", () => {
    expect(gcd(0, 5)).toBe(5);
    expect(gcd(5, 0)).toBe(5);
  });

  it("应该处理负数", () => {
    expect(gcd(-12, 8)).toBe(-4);
    expect(gcd(12, -8)).toBe(4);
    expect(gcd(-12, -8)).toBe(-4);
  });

  it("应该处理大数", () => {
    expect(gcd(1000000, 500000)).toBe(500000);
    expect(gcd(123456, 78910)).toBe(2);
  });

  it("应该处理质数", () => {
    expect(gcd(17, 23)).toBe(1);
    expect(gcd(97, 101)).toBe(1);
  });
});
