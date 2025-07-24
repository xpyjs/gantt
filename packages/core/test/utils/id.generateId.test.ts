import { describe, expect, it } from "vitest";
import { generateId } from "../../src/utils/id";

describe("generateId", () => {
  it("应该生成字符串类型的ID", () => {
    const id = generateId();
    expect(typeof id).toBe("string");
  });

  it("应该生成非空字符串", () => {
    const id = generateId();
    expect(id.length).toBeGreaterThan(0);
  });

  it("应该生成唯一的ID", () => {
    const ids = new Set();
    const iterations = 1000;

    for (let i = 0; i < iterations; i++) {
      const id = generateId();
      expect(ids.has(id)).toBe(false); // 不应该有重复
      ids.add(id);
    }

    expect(ids.size).toBe(iterations);
  });

  it("应该只包含字母数字字符", () => {
    const id = generateId();
    const alphanumericRegex = /^[a-z0-9]+$/;
    expect(alphanumericRegex.test(id)).toBe(true);
  });

  it("连续调用应该生成不同的ID", () => {
    const id1 = generateId();
    const id2 = generateId();
    const id3 = generateId();

    expect(id1).not.toBe(id2);
    expect(id2).not.toBe(id3);
    expect(id1).not.toBe(id3);
  });

  it("性能测试：应该能快速生成大量ID", () => {
    const startTime = performance.now();
    const iterations = 10000;

    for (let i = 0; i < iterations; i++) {
      generateId();
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    // 10000个ID生成应该在合理时间内完成（比如100ms）
    expect(duration).toBeLessThan(100);
  });
});
