/*
 * @Author: JeremyJone
 * @Date: 2025-04-18 11:06:36
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-06-17 13:27:38
 * @Description: 日志工具类
 */

import dayjs from "dayjs";

/**
 * 日志级别枚举
 */
export enum LogLevel {
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  NONE = 5 // 特殊级别，用于禁用所有日志
}

/**
 * 日志配置选项接口
 */
interface LoggerOptions {
  level: LogLevel;
  showTimestamp: boolean;
}

/**
 * 日志工具类
 * 提供不同级别的日志输出，并可以动态控制日志级别和格式。
 */
export class Logger {
  private static readonly Prefix = "[XGantt]";
  private static options: LoggerOptions = {
    // 默认级别，INFO 及以上会被打印
    level: LogLevel.INFO,
    // 默认不显示时间戳
    showTimestamp: false
  };

  /**
   * 设置日志配置
   * @param options - 新的日志配置
   */
  public static setOptions(options: Partial<LoggerOptions>): void {
    Logger.options = { ...Logger.options, ...options };
  }

  /**
   * 获取当前日志级别
   * @returns 当前设置的日志级别
   */
  public static getLevel(): LogLevel {
    return Logger.options.level;
  }

  /**
   * 输出 DEBUG 级别的日志
   * 仅当当前日志级别 <= DEBUG 时输出
   * @param args - 需要打印的参数
   */
  public static debug(...args: any[]): void {
    Logger.logWithLevel(LogLevel.DEBUG, console.debug, ...args);
  }

  /**
   * 输出 INFO 级别的日志
   * 仅当当前日志级别 <= INFO 时输出
   * @param args - 需要打印的参数
   */
  public static info(...args: any[]): void {
    Logger.logWithLevel(LogLevel.INFO, console.info, ...args);
  }

  /**
   * 输出 WARN 级别的日志
   * 仅当当前日志级别 <= WARN 时输出
   * @param args - 需要打印的参数
   */
  public static warn(...args: any[]): void {
    Logger.logWithLevel(LogLevel.WARN, console.warn, ...args);
  }

  /**
   * 输出 ERROR 级别的日志
   * 仅当当前日志级别 <= ERROR 时输出
   * @param args - 需要打印的参数
   */
  public static error(...args: any[]): void {
    Logger.logWithLevel(LogLevel.ERROR, console.error, ...args);
  }

  /**
   * 断言方法
   * 如果条件为 false，则输出 ERROR 级别的日志
   * @param condition - 断言条件
   * @param args - 断言失败时需要打印的参数
   */
  public static assert(condition: any, ...args: any[]): void {
    if (!condition) {
      // 断言失败总是视为 ERROR 级别
      if (Logger.options.level <= LogLevel.ERROR) {
        const logArgs = Logger.formatArgs("Assertion failed:", ...args);
        console.error(...logArgs);
      }
    }
  }

  /**
   * 返回日志信息
   */
  public static getMessage(...args: any[]): string {
    return Logger.formatArgs(...args).join("");
  }

  /**
   * 抛出异常
   */
  public static exception(...args: any[]): Error {
    return new Error(Logger.getMessage(...args));
  }

  /**
   * 根据级别输出日志的核心方法
   * @param level - 当前尝试输出的日志级别
   * @param logFn - 使用的 console 方法 (console.log, console.warn, etc.)
   * @param args - 需要打印的参数
   */
  private static logWithLevel(
    level: LogLevel,
    logFn: (...data: any[]) => void,
    ...args: any[]
  ): void {
    if (Logger.options.level <= level) {
      const logArgs = Logger.formatArgs(...args);
      logFn(...logArgs);
    }
  }

  /**
   * 格式化日志参数，添加前缀和可选的时间戳
   * @param args - 原始日志参数
   * @returns 格式化后的日志参数数组
   */
  private static formatArgs(...args: any[]): any[] {
    const prefixParts = [Logger.Prefix];
    if (Logger.options.showTimestamp) {
      prefixParts.unshift(`[${dayjs().format("YYYY-MM-DD HH:mm:ss.SSS")}]`);
    }
    // 根据级别添加不同的前缀标识符可能更好，但为了简化，暂时只用通用前缀
    // 例如：[XGantt][INFO] message

    return [prefixParts.join(""), ...args];
  }
}
