import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { Logger, LogLevel } from "../../src/utils/logger";

describe("Logger", () => {
  let consoleSpy: {
    debug: any;
    info: any;
    warn: any;
    error: any;
  };

  beforeEach(() => {
    // 重置Logger设置为默认值
    Logger.setOptions({ level: LogLevel.INFO, showTimestamp: false });

    // 监听console方法
    consoleSpy = {
      debug: vi.spyOn(console, "debug").mockImplementation(() => {}),
      info: vi.spyOn(console, "info").mockImplementation(() => {}),
      warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
      error: vi.spyOn(console, "error").mockImplementation(() => {})
    };
  });

  afterEach(() => {
    // 恢复所有spy
    Object.values(consoleSpy).forEach(spy => spy.mockRestore());
  });

  describe("setOptions 和 getLevel", () => {
    it("应该正确设置和获取日志级别", () => {
      Logger.setOptions({ level: LogLevel.DEBUG });
      expect(Logger.getLevel()).toBe(LogLevel.DEBUG);

      Logger.setOptions({ level: LogLevel.ERROR });
      expect(Logger.getLevel()).toBe(LogLevel.ERROR);
    });

    it("应该支持部分选项更新", () => {
      Logger.setOptions({ level: LogLevel.DEBUG, showTimestamp: true });
      Logger.setOptions({ level: LogLevel.WARN }); // 只更新level

      expect(Logger.getLevel()).toBe(LogLevel.WARN);
      // showTimestamp 应该保持为 true（通过行为验证，因为无法直接访问）
    });
  });

  describe("日志级别控制", () => {
    it("DEBUG级别应该显示所有日志", () => {
      Logger.setOptions({ level: LogLevel.DEBUG });

      Logger.debug("debug message");
      Logger.info("info message");
      Logger.warn("warn message");
      Logger.error("error message");

      expect(consoleSpy.debug).toHaveBeenCalledWith(
        "[XGantt]",
        "debug message"
      );
      expect(consoleSpy.info).toHaveBeenCalledWith("[XGantt]", "info message");
      expect(consoleSpy.warn).toHaveBeenCalledWith("[XGantt]", "warn message");
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "[XGantt]",
        "error message"
      );
    });

    it("INFO级别应该显示INFO及以上级别的日志", () => {
      Logger.setOptions({ level: LogLevel.INFO });

      Logger.debug("debug message");
      Logger.info("info message");
      Logger.warn("warn message");
      Logger.error("error message");

      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.info).toHaveBeenCalledWith("[XGantt]", "info message");
      expect(consoleSpy.warn).toHaveBeenCalledWith("[XGantt]", "warn message");
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "[XGantt]",
        "error message"
      );
    });

    it("WARN级别应该显示WARN及以上级别的日志", () => {
      Logger.setOptions({ level: LogLevel.WARN });

      Logger.debug("debug message");
      Logger.info("info message");
      Logger.warn("warn message");
      Logger.error("error message");

      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.warn).toHaveBeenCalledWith("[XGantt]", "warn message");
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "[XGantt]",
        "error message"
      );
    });

    it("ERROR级别应该只显示ERROR级别的日志", () => {
      Logger.setOptions({ level: LogLevel.ERROR });

      Logger.debug("debug message");
      Logger.info("info message");
      Logger.warn("warn message");
      Logger.error("error message");

      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "[XGantt]",
        "error message"
      );
    });

    it("NONE级别应该不显示任何日志", () => {
      Logger.setOptions({ level: LogLevel.NONE });

      Logger.debug("debug message");
      Logger.info("info message");
      Logger.warn("warn message");
      Logger.error("error message");

      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
    });
  });

  describe("日志格式", () => {
    it("应该包含XGantt前缀", () => {
      Logger.info("test message");
      expect(consoleSpy.info).toHaveBeenCalledWith("[XGantt]", "test message");
    });

    it("应该支持多个参数", () => {
      Logger.info("message", 123, { test: true });
      expect(consoleSpy.info).toHaveBeenCalledWith("[XGantt]", "message", 123, {
        test: true
      });
    });

    it("showTimestamp为true时应该包含时间戳", () => {
      Logger.setOptions({ showTimestamp: true });
      Logger.info("test message");

      const firstCallArgs = consoleSpy.info.mock.calls[0];
      expect(firstCallArgs[0]).toMatch(/^\[.*\]\[XGantt\]$/);
      expect(firstCallArgs[1]).toBe("test message");
    });

    it("时间戳格式应该正确", () => {
      Logger.setOptions({ showTimestamp: true });
      Logger.info("test");

      const firstCallArgs = consoleSpy.info.mock.calls[0];
      const timestampPart = firstCallArgs[0];
      // 检查时间戳格式: [YYYY-MM-DD HH:mm:ss.SSS][XGantt]
      expect(timestampPart).toMatch(
        /^\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}\]\[XGantt\]$/
      );
    });
  });

  describe("assert 方法", () => {
    it("条件为true时不应该输出日志", () => {
      Logger.assert(true, "this should not appear");
      expect(consoleSpy.error).not.toHaveBeenCalled();
    });

    it("条件为false时应该输出ERROR级别日志", () => {
      Logger.assert(false, "assertion failed");
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "[XGantt]",
        "Assertion failed:",
        "assertion failed"
      );
    });

    it("断言失败时应该包含多个参数", () => {
      Logger.assert(false, "value:", 123, "expected:", 456);
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "[XGantt]",
        "Assertion failed:",
        "value:",
        123,
        "expected:",
        456
      );
    });

    it("日志级别为NONE时断言失败也不应该输出", () => {
      Logger.setOptions({ level: LogLevel.NONE });
      Logger.assert(false, "this should not appear");
      expect(consoleSpy.error).not.toHaveBeenCalled();
    });

    it("条件为假值时应该触发断言", () => {
      Logger.assert(0, "zero is falsy");
      Logger.assert("", "empty string is falsy");
      Logger.assert(null, "null is falsy");
      Logger.assert(undefined, "undefined is falsy");

      expect(consoleSpy.error).toHaveBeenCalledTimes(4);
    });
  });

  describe("getMessage 方法", () => {
    it("应该返回格式化的消息字符串", () => {
      const message = Logger.getMessage("Hello", "World");
      expect(message).toBe("[XGantt]HelloWorld");
    });

    it("应该正确处理各种类型的参数", () => {
      const message = Logger.getMessage("Number:", 123, "Object:", {
        test: true
      });
      expect(message).toBe("[XGantt]Number:123Object:[object Object]");
    });

    it("showTimestamp为true时应该包含时间戳", () => {
      Logger.setOptions({ showTimestamp: true });
      const message = Logger.getMessage("test");
      expect(message).toMatch(/^\[.*\]\[XGantt\]test$/);
    });
  });

  describe("exception 方法", () => {
    it("应该返回Error对象", () => {
      const error = Logger.exception("Something went wrong");
      expect(error).toBeInstanceOf(Error);
    });

    it("Error消息应该包含格式化的内容", () => {
      const error = Logger.exception("Error:", 404, "Not Found");
      expect(error.message).toBe("[XGantt]Error:404Not Found");
    });

    it("应该可以抛出生成的异常", () => {
      expect(() => {
        throw Logger.exception("Test error");
      }).toThrow("[XGantt]Test error");
    });
  });

  describe("边界情况", () => {
    it("应该处理空参数", () => {
      Logger.info();
      expect(consoleSpy.info).toHaveBeenCalledWith("[XGantt]");
    });

    it("应该处理undefined和null参数", () => {
      Logger.info(undefined, null);
      expect(consoleSpy.info).toHaveBeenCalledWith("[XGantt]", undefined, null);
    });

    it("应该处理复杂对象", () => {
      const complexObj = {
        nested: { deep: "value" },
        array: [1, 2, 3],
        func: () => "test"
      };
      Logger.info("Complex:", complexObj);
      expect(consoleSpy.info).toHaveBeenCalledWith(
        "[XGantt]",
        "Complex:",
        complexObj
      );
    });
  });
});
