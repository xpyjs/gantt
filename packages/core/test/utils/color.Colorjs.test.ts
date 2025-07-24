import { describe, expect, it, beforeEach, vi } from "vitest";
import { Colorjs, colorjs } from "../../src/utils/color";

describe("Colorjs", () => {
  describe("构造函数", () => {
    it("应该正确解析十六进制颜色", () => {
      const color = new Colorjs("#ff0000");
      expect(color.R).toBe(255);
      expect(color.G).toBe(0);
      expect(color.B).toBe(0);
      expect(color.A).toBe(1);
    });

    it("应该正确解析简写十六进制颜色", () => {
      const color = new Colorjs("#f00");
      expect(color.R).toBe(255);
      expect(color.G).toBe(0);
      expect(color.B).toBe(0);
      expect(color.A).toBe(1);
    });

    it("应该正确解析带alpha的十六进制颜色", () => {
      const color = new Colorjs("#ff000080");
      expect(color.R).toBe(255);
      expect(color.G).toBe(0);
      expect(color.B).toBe(0);
      expect(color.A).toBeCloseTo(0.502, 2);
    });

    it("应该正确解析RGB颜色", () => {
      const color = new Colorjs("rgb(255, 128, 64)");
      expect(color.R).toBe(255);
      expect(color.G).toBe(128);
      expect(color.B).toBe(64);
      expect(color.A).toBe(1);
    });

    it("应该正确解析RGBA颜色", () => {
      const color = new Colorjs("rgba(255, 128, 64, 0.5)");
      expect(color.R).toBe(255);
      expect(color.G).toBe(128);
      expect(color.B).toBe(64);
      expect(color.A).toBe(0.5);
    });

    it("应该正确解析百分比RGB颜色", () => {
      const color = new Colorjs("rgb(100%, 50%, 25%)");
      expect(color.R).toBe(255);
      expect(color.G).toBe(128);
      expect(color.B).toBe(64);
      expect(color.A).toBe(1);
    });

    it("应该正确解析RGBA对象", () => {
      const color = new Colorjs({ r: 255, g: 128, b: 64, a: 0.5 });
      expect(color.R).toBe(255);
      expect(color.G).toBe(128);
      expect(color.B).toBe(64);
      expect(color.A).toBe(0.5);
    });

    it("应该处理不完整的RGBA对象", () => {
      const color = new Colorjs({ r: 255, g: 128 });
      expect(color.R).toBe(255);
      expect(color.G).toBe(128);
      expect(color.B).toBe(0);
      expect(color.A).toBe(1);
    });

    it("应该处理无效颜色值时使用默认黑色", () => {
      const color = new Colorjs("invalid-color");
      expect(color.R).toBe(0);
      expect(color.G).toBe(0);
      expect(color.B).toBe(0);
      expect(color.A).toBe(1);
    });

    it("应该限制颜色值在有效范围内", () => {
      const color = new Colorjs({ r: 300, g: -50, b: 128, a: 2 });
      expect(color.R).toBe(255);
      expect(color.G).toBe(0);
      expect(color.B).toBe(128);
      expect(color.A).toBe(1);
    });
  });

  describe("getter 方法", () => {
    it("应该正确返回颜色通道值", () => {
      const color = new Colorjs({ r: 255, g: 128, b: 64, a: 0.5 });
      expect(color.R).toBe(255);
      expect(color.G).toBe(128);
      expect(color.B).toBe(64);
      expect(color.A).toBe(0.5);
    });
  });

  describe("颜色通道方法", () => {
    let color: Colorjs;

    beforeEach(() => {
      color = new Colorjs({ r: 255, g: 128, b: 64, a: 0.5 });
    });

    it("red() 应该获取和设置红色通道", () => {
      expect(color.red()).toBe(255);
      color.red(200);
      expect(color.red()).toBe(200);
      expect(color.R).toBe(200);
    });

    it("green() 应该获取和设置绿色通道", () => {
      expect(color.green()).toBe(128);
      color.green(100);
      expect(color.green()).toBe(100);
      expect(color.G).toBe(100);
    });

    it("blue() 应该获取和设置蓝色通道", () => {
      expect(color.blue()).toBe(64);
      color.blue(50);
      expect(color.blue()).toBe(50);
      expect(color.B).toBe(50);
    });

    it("alpha() 应该获取和设置透明度通道", () => {
      expect(color.alpha()).toBe(0.5);
      color.alpha(0.8);
      expect(color.alpha()).toBe(0.8);
      expect(color.A).toBe(0.8);
    });

    it("应该限制颜色通道值在有效范围内", () => {
      color.red(300).green(-50).blue(500).alpha(2);
      expect(color.R).toBe(255);
      expect(color.G).toBe(0);
      expect(color.B).toBe(255);
      expect(color.A).toBe(1);
    });

    it("应该支持链式调用", () => {
      const result = color.red(100).green(150).blue(200).alpha(0.8);
      expect(result).toBe(color);
      expect(color.R).toBe(100);
      expect(color.G).toBe(150);
      expect(color.B).toBe(200);
      expect(color.A).toBe(0.8);
    });
  });

  describe("输出方法", () => {
    it("toHex() 应该输出正确的十六进制格式", () => {
      const color = new Colorjs({ r: 255, g: 128, b: 64, a: 1 });
      expect(color.toHex()).toBe("#ff8040");
    });

    it("toHex() 应该支持三字符简写", () => {
      const color = new Colorjs({ r: 255, g: 255, b: 255, a: 1 });
      expect(color.toHex(true)).toBe("#fff");
    });

    it("toHex() 应该包含alpha通道", () => {
      const color = new Colorjs({ r: 255, g: 128, b: 64, a: 0.5 });
      expect(color.toHex(false, true)).toBe("#ff804080");
    });

    it("toHex() 应该在alpha不为1时自动包含alpha", () => {
      const color = new Colorjs({ r: 255, g: 128, b: 64, a: 0.5 });
      expect(color.toHex()).toBe("#ff804080");
    });

    it("toRgb() 应该输出正确的RGB格式", () => {
      const color = new Colorjs({ r: 255, g: 128, b: 64, a: 1 });
      expect(color.toRgb()).toBe("rgb(255, 128, 64)");
    });

    it("toRgb() 应该输出正确的RGBA格式", () => {
      const color = new Colorjs({ r: 255, g: 128, b: 64, a: 0.5 });
      expect(color.toRgb()).toBe("rgba(255, 128, 64, 0.5)");
    });

    it("toRgb() 应该正确处理浮点alpha值", () => {
      const color = new Colorjs({ r: 255, g: 128, b: 64, a: 0.123456 });
      expect(color.toRgb()).toBe("rgba(255, 128, 64, 0.12)");
    });

    it("toObject() 应该返回RGBA对象", () => {
      const color = new Colorjs({ r: 255, g: 128, b: 64, a: 0.5 });
      const obj = color.toObject();
      expect(obj).toEqual({ r: 255, g: 128, b: 64, a: 0.5 });
    });

    it("toString() 应该返回RGB格式", () => {
      const color = new Colorjs({ r: 255, g: 128, b: 64, a: 0.5 });
      expect(color.toString()).toBe("rgba(255, 128, 64, 0.5)");
    });
  });

  describe("颜色操作方法", () => {
    let color: Colorjs;

    beforeEach(() => {
      color = new Colorjs({ r: 128, g: 128, b: 128, a: 1 });
    });

    it("brighten() 应该增加颜色亮度", () => {
      const original = color.clone();
      color.brighten(20);
      expect(color.R).toBeGreaterThan(original.R);
      expect(color.G).toBeGreaterThan(original.G);
      expect(color.B).toBeGreaterThan(original.B);
    });

    it("brighten() 负值应该调用darken", () => {
      const brightenSpy = vi.spyOn(color, "darken");
      color.brighten(-20);
      expect(brightenSpy).toHaveBeenCalledWith(20);
    });

    it("darken() 应该降低颜色亮度", () => {
      const original = color.clone();
      color.darken(20);
      expect(color.R).toBeLessThan(original.R);
      expect(color.G).toBeLessThan(original.G);
      expect(color.B).toBeLessThan(original.B);
    });

    it("darken() 负值应该调用brighten", () => {
      const darkenSpy = vi.spyOn(color, "brighten");
      color.darken(-20);
      expect(darkenSpy).toHaveBeenCalledWith(20);
    });

    it("brighten() 和 darken() 应该限制百分比在0-100", () => {
      color.brighten(150); // 应该被限制为100
      // 白色应该接近255
      expect(color.R).toBeCloseTo(255, 0);
      expect(color.G).toBeCloseTo(255, 0);
      expect(color.B).toBeCloseTo(255, 0);
    });

    it("isLight() 应该正确判断亮色", () => {
      const lightColor = new Colorjs({ r: 255, g: 255, b: 255, a: 1 });
      const darkColor = new Colorjs({ r: 0, g: 0, b: 0, a: 1 });
      expect(lightColor.isLight()).toBe(true);
      expect(darkColor.isLight()).toBe(false);
    });

    it("isDark() 应该正确判断暗色", () => {
      const lightColor = new Colorjs({ r: 255, g: 255, b: 255, a: 1 });
      const darkColor = new Colorjs({ r: 0, g: 0, b: 0, a: 1 });
      expect(lightColor.isDark()).toBe(false);
      expect(darkColor.isDark()).toBe(true);
    });

    it("mix() 应该正确混合颜色", () => {
      const red = new Colorjs({ r: 255, g: 0, b: 0, a: 1 });
      const blue = new Colorjs({ r: 0, g: 0, b: 255, a: 1 });

      red.mix(blue, 50); // 50% 混合
      expect(red.R).toBeCloseTo(128, 0);
      expect(red.G).toBe(0);
      expect(red.B).toBeCloseTo(128, 0);
    });

    it("mix() 应该限制混合比例在0-100", () => {
      const red = new Colorjs({ r: 255, g: 0, b: 0, a: 1 });
      const blue = new Colorjs({ r: 0, g: 0, b: 255, a: 1 });

      red.mix(blue, 150); // 应该被限制为100
      expect(red.R).toBe(0);
      expect(red.G).toBe(0);
      expect(red.B).toBe(255);
    });

    it("mix() 应该支持链式调用", () => {
      const red = new Colorjs({ r: 255, g: 0, b: 0, a: 1 });
      const blue = new Colorjs({ r: 0, g: 0, b: 255, a: 1 });

      const result = red.mix(blue, 50);
      expect(result).toBe(red);
    });
  });

  describe("clone() 方法", () => {
    it("应该创建独立的副本", () => {
      const original = new Colorjs({ r: 255, g: 128, b: 64, a: 0.5 });
      const cloned = original.clone();

      expect(cloned).not.toBe(original);
      expect(cloned.R).toBe(original.R);
      expect(cloned.G).toBe(original.G);
      expect(cloned.B).toBe(original.B);
      expect(cloned.A).toBe(original.A);

      // 修改克隆对象不应影响原对象
      cloned.red(100);
      expect(original.R).toBe(255);
      expect(cloned.R).toBe(100);
    });
  });

  describe("静态方法", () => {
    it("extend() 应该正确调用插件函数", () => {
      const mockPlugin = vi.fn();
      const mockOption = { test: true };

      Colorjs.extend(mockPlugin, mockOption);

      expect(mockPlugin).toHaveBeenCalledWith(mockOption, Colorjs, colorjs);
    });

    it("extend() 应该处理无效插件", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      // @ts-ignore - 故意传入无效类型进行测试
      Colorjs.extend("invalid-plugin");

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
