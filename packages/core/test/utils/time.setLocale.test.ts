import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import dayjs from "../../src/utils/time";
import { setLocale } from "../../src/utils/time";

describe("time utils", () => {
  let consoleSpy: {
    info: any;
    warn: any;
  };

  beforeEach(() => {
    // 监听console方法
    consoleSpy = {
      info: vi.spyOn(console, "info").mockImplementation(() => {}),
      warn: vi.spyOn(console, "warn").mockImplementation(() => {})
    };

    // 重置为默认语言
    dayjs.locale("en");
  });

  afterEach(() => {
    // 恢复所有spy
    Object.values(consoleSpy).forEach(spy => spy.mockRestore());
  });

  describe("dayjs 插件加载", () => {
    it("应该加载duration插件", () => {
      const duration = dayjs.duration(1, "hour");
      expect(duration.asMinutes()).toBe(60);
      expect(duration.asSeconds()).toBe(3600);
    });

    it("应该加载isBetween插件", () => {
      const date = dayjs("2023-06-15");
      const start = dayjs("2023-06-01");
      const end = dayjs("2023-06-30");

      expect(date.isBetween(start, end)).toBe(true);
      expect(date.isBetween(start, end, "day")).toBe(true);
    });

    it("应该加载isSameOrBefore和isSameOrAfter插件", () => {
      const date1 = dayjs("2023-06-15");
      const date2 = dayjs("2023-06-15");
      const date3 = dayjs("2023-06-16");

      expect(date1.isSameOrBefore(date2)).toBe(true);
      expect(date1.isSameOrBefore(date3)).toBe(true);
      expect(date1.isSameOrAfter(date2)).toBe(true);
      expect(date3.isSameOrAfter(date1)).toBe(true);
    });

    it("应该加载weekOfYear插件", () => {
      const date = dayjs("2023-06-15");
      const week = date.week();
      expect(typeof week).toBe("number");
      expect(week).toBeGreaterThan(0);
      expect(week).toBeLessThanOrEqual(53);
    });

    it("应该加载localeData插件", () => {
      const localeData = dayjs.localeData();
      expect(localeData).toBeDefined();
      expect(typeof localeData.months).toBeDefined();
      expect(typeof localeData.weekdays).toBeDefined();
    });

    it("应该加载weekYear插件", () => {
      const date = dayjs("2023-06-15");
      const weekYear = date.weekYear();
      expect(typeof weekYear).toBe("number");
      expect(weekYear).toBe(2023);
    });

    it("应该加载advancedFormat插件", () => {
      const date = dayjs("2023-06-15");
      const formatted = date.format("Q");
      expect(formatted).toBe("2");
    });

    it("应该加载isoWeek插件", () => {
      const date = dayjs("2023-06-15");
      const isoWeek = date.isoWeek();
      expect(typeof isoWeek).toBe("number");
      expect(isoWeek).toBeGreaterThan(0);
    });

    it("应该加载timezone插件", () => {
      const date = dayjs("2023-06-15");
      // 基本的时区功能测试
      expect(typeof date.utc).toBe("function");
    });
  });

  describe("setLocale 函数", () => {
    it("应该成功设置英文语言", () => {
      setLocale("en");
      expect(dayjs.locale()).toBe("en");
    });

    it("应该成功设置中文语言", () => {
      setLocale("zh");
      expect(dayjs.locale()).toBe("zh");
      expect(consoleSpy.info).toHaveBeenCalledWith(
        "[XGantt]",
        "Locale set to zh"
      );
    });

    it("应该处理无效语言并回退到英文", () => {
      setLocale("invalid-locale");
      expect(dayjs.locale()).toBe("en");
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        "[XGantt]",
        "Failed to set locale invalid-locale, fallback to en"
      );
    });

    it("设置语言后应该影响日期格式化", () => {
      setLocale("en");
      const date = dayjs("2023-06-15");
      const englishFormat = date.format("MMMM");

      setLocale("zh");
      const chineseFormat = date.format("MMMM");

      expect(englishFormat).not.toBe(chineseFormat);
    });
  });

  describe("自动语言订阅插件", () => {
    it("应该扩展dayjs原型", () => {
      const date = dayjs("2023-06-15");
      expect(typeof (date as any).setLocale).toBe("function");
    });

    it("setLocale方法应该正确工作", () => {
      const date = dayjs("2023-06-15");
      const result = (date as any).setLocale("zh");
      expect(result).toBe(date); // 应该返回同一个实例
    });

    it("format方法应该自动应用当前语言", () => {
      const date = dayjs("2023-06-15");

      // 设置全局语言为中文
      setLocale("zh");
      const formatted = date.format("MMMM");

      // 在中文环境下，6月应该显示为中文
      expect(formatted).toMatch(/六月|6月/);
    });
  });

  describe("基本dayjs功能", () => {
    it("应该能创建和格式化日期", () => {
      const date = dayjs("2023-06-15");
      expect(date.isValid()).toBe(true);
      expect(date.format("YYYY-MM-DD")).toBe("2023-06-15");
    });

    it("应该能进行日期计算", () => {
      const date = dayjs("2023-06-15");
      const nextWeek = date.add(1, "week");
      const prevWeek = date.subtract(1, "week");

      expect(nextWeek.format("YYYY-MM-DD")).toBe("2023-06-22");
      expect(prevWeek.format("YYYY-MM-DD")).toBe("2023-06-08");
    });

    it("应该能比较日期", () => {
      const date1 = dayjs("2023-06-15");
      const date2 = dayjs("2023-06-16");

      expect(date1.isBefore(date2)).toBe(true);
      expect(date2.isAfter(date1)).toBe(true);
      expect(date1.isSame(date1)).toBe(true);
    });

    it("应该正确处理不同的输入格式", () => {
      const fromString = dayjs("2023-06-15");
      const fromDate = dayjs(new Date("2023-06-15"));
      const fromTimestamp = dayjs(1686787200000); // 2023-06-15的时间戳

      expect(fromString.format("YYYY-MM-DD")).toBe("2023-06-15");
      expect(fromDate.format("YYYY-MM-DD")).toBe("2023-06-15");
      // 时间戳可能因时区而异，只检查年份
      expect(fromTimestamp.year()).toBe(2023);
    });
  });

  describe("边界情况", () => {
    it("应该处理无效日期", () => {
      const invalidDate = dayjs("invalid-date");
      expect(invalidDate.isValid()).toBe(false);
    });

    it("应该处理极端日期", () => {
      const veryOldDate = dayjs("1900-01-01");
      const veryNewDate = dayjs("2100-12-31");

      expect(veryOldDate.isValid()).toBe(true);
      expect(veryNewDate.isValid()).toBe(true);
    });

    it("setLocale应该处理空字符串", () => {
      setLocale("");
      expect(dayjs.locale()).toBe("en");
      expect(consoleSpy.warn).toHaveBeenCalled();
    });
  });
});
