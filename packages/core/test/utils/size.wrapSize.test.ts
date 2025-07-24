import { describe, expect, it } from "vitest";
import { wrapSize } from "../../src/utils/size";

describe("wrapSize", () => {
  describe("基本功能", () => {
    it("应该将数字转换为px单位", () => {
      expect(wrapSize(100)).toBe("100px");
      expect(wrapSize(0)).toBe("0px");
      expect(wrapSize(-50)).toBe("-50px");
    });

    it("应该保持带有效单位的字符串", () => {
      expect(wrapSize("100px")).toBe("100px");
      expect(wrapSize("50%")).toBe("50%");
      expect(wrapSize("10vh")).toBe("10vh");
      expect(wrapSize("20vw")).toBe("20vw");
      expect(wrapSize("2em")).toBe("2em");
      expect(wrapSize("1.5rem")).toBe("1.5rem");
    });

    it("应该将纯数字字符串转换为px单位", () => {
      expect(wrapSize("100")).toBe("100px");
      expect(wrapSize("0")).toBe("0px");
      expect(wrapSize("-50")).toBe("-50px");
    });

    it("应该处理小数", () => {
      expect(wrapSize(10.5)).toBe("10.5px");
      expect(wrapSize("10.5")).toBe("10.5px");
      expect(wrapSize("10.5px")).toBe("10.5px");
      expect(wrapSize("10.5%")).toBe("10.5%");
    });
  });

  describe("无效输入处理", () => {
    it("应该对undefined返回默认值", () => {
      expect(wrapSize(undefined)).toBe("");
      expect(wrapSize(undefined, "auto")).toBe("auto");
    });

    it("应该对null返回默认值", () => {
      expect(wrapSize(null)).toBe("");
      expect(wrapSize(null, "auto")).toBe("auto");
    });

    it("应该对无效数字返回默认值", () => {
      expect(wrapSize(NaN)).toBe("");
      expect(wrapSize(Infinity)).toBe("");
      expect(wrapSize(-Infinity)).toBe("");
    });

    it("应该对无效字符串返回默认值", () => {
      expect(wrapSize("invalid")).toBe("");
      expect(wrapSize("abc")).toBe("");
      expect(wrapSize("")).toBe("");
      expect(wrapSize("   ")).toBe("");
    });

    it("应该对无效单位返回默认值", () => {
      expect(wrapSize("100kg")).toBe("");
      expect(wrapSize("50meter")).toBe("");
      expect(wrapSize("10invalid")).toBe("");
    });
  });

  describe("边界情况", () => {
    it("应该处理字符串前后的空格", () => {
      expect(wrapSize("  100px  ")).toBe("100px");
      expect(wrapSize("  50%  ")).toBe("50%");
      expect(wrapSize("  100  ")).toBe("100px");
    });

    it("应该处理0值", () => {
      expect(wrapSize(0)).toBe("0px");
      expect(wrapSize("0")).toBe("0px");
      expect(wrapSize("0px")).toBe("0px");
      expect(wrapSize("0%")).toBe("0%");
    });

    it("应该处理非常大的数字", () => {
      expect(wrapSize(999999)).toBe("999999px");
      expect(wrapSize("999999")).toBe("999999px");
    });

    it("应该处理科学计数法", () => {
      expect(wrapSize(1e3)).toBe("1000px");
      expect(wrapSize("1e3")).toBe("1000px");
    });
  });

  describe("特殊单位处理", () => {
    it("应该处理所有支持的CSS单位", () => {
      const units = ["px", "%", "vh", "vw", "em", "rem"];
      units.forEach(unit => {
        expect(wrapSize(`100${unit}`)).toBe(`100${unit}`);
        expect(wrapSize(`0${unit}`)).toBe(`0${unit}`);
        expect(wrapSize(`-50${unit}`)).toBe(`-50${unit}`);
      });
    });

    it("应该处理单位前有空格的情况", () => {
      expect(wrapSize("100 vw")).toBe("100vw");
      expect(wrapSize("100  vw")).toBe("100vw");
    });

    it("应该区分大小写", () => {
      expect(wrapSize("100PX")).toBe(""); // 大写无效
      expect(wrapSize("100Px")).toBe(""); // 混合大小写无效
    });
  });

  describe("自定义默认值", () => {
    it("应该使用提供的默认值", () => {
      expect(wrapSize(undefined, "auto")).toBe("auto");
      expect(wrapSize(null, "100%")).toBe("100%");
      expect(wrapSize("invalid", "50px")).toBe("50px");
      expect(wrapSize(NaN, "0")).toBe("0");
    });

    it("应该在无效输入时返回自定义默认值", () => {
      const defaultValue = "1rem";
      expect(wrapSize("", defaultValue)).toBe(defaultValue);
      expect(wrapSize("invalid", defaultValue)).toBe(defaultValue);
      expect(wrapSize(Infinity, defaultValue)).toBe(defaultValue);
    });
  });

  describe("类型测试", () => {
    it("应该处理各种数据类型", () => {
      expect(wrapSize(true as any)).toBe("");
      expect(wrapSize(false as any)).toBe("");
      expect(wrapSize([] as any)).toBe("");
      expect(wrapSize({} as any)).toBe("");
      expect(wrapSize(() => {})).toBe("");
    });
  });

  describe("性能测试", () => {
    it("应该能处理大量输入", () => {
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        wrapSize(i);
        wrapSize(`${i}px`);
        wrapSize(`${i}%`);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // 3000次调用应该在合理时间内完成
      expect(duration).toBeLessThan(100);
    });
  });
});
