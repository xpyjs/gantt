import { describe, expect, it } from "vitest";
import { colorjs, Colorjs } from "../../src/utils/color";

describe("colorjs", () => {
  it("应该创建新的Colorjs实例", () => {
    const color = colorjs("#ff0000");
    expect(color).toBeInstanceOf(Colorjs);
    expect(color.R).toBe(255);
    expect(color.G).toBe(0);
    expect(color.B).toBe(0);
    expect(color.A).toBe(1);
  });

  it("应该接受字符串颜色值", () => {
    const hexColor = colorjs("#ff0000");
    const rgbColor = colorjs("rgb(255, 0, 0)");
    const rgbaColor = colorjs("rgba(255, 0, 0, 0.5)");

    expect(hexColor.R).toBe(255);
    expect(rgbColor.R).toBe(255);
    expect(rgbaColor.R).toBe(255);
    expect(rgbaColor.A).toBe(0.5);
  });

  it("应该接受RGBA对象", () => {
    const color = colorjs({ r: 255, g: 128, b: 64, a: 0.5 });
    expect(color.R).toBe(255);
    expect(color.G).toBe(128);
    expect(color.B).toBe(64);
    expect(color.A).toBe(0.5);
  });

  it("如果传入的是Colorjs实例，应该直接返回", () => {
    const original = new Colorjs("#ff0000");
    const result = colorjs(original);

    expect(result).toBe(original); // 应该是同一个实例
  });

  it("应该能创建不同颜色格式的实例", () => {
    const colors = [
      colorjs("#f00"), // 短十六进制
      colorjs("#ff0000"), // 长十六进制
      colorjs("#ff000080"), // 带alpha的十六进制
      colorjs("rgb(255,0,0)"), // RGB
      colorjs("rgba(255,0,0,0.5)"), // RGBA
      colorjs({ r: 255, g: 0, b: 0 }) // 对象
    ];

    colors.forEach(color => {
      expect(color).toBeInstanceOf(Colorjs);
      expect(color.R).toBe(255);
      expect(color.G).toBe(0);
      expect(color.B).toBe(0);
    });
  });

  it("应该处理无效颜色值", () => {
    const color = colorjs("invalid-color");
    expect(color).toBeInstanceOf(Colorjs);
    // 应该使用默认黑色
    expect(color.R).toBe(0);
    expect(color.G).toBe(0);
    expect(color.B).toBe(0);
    expect(color.A).toBe(1);
  });

  it("工厂函数应该支持链式调用", () => {
    const color = colorjs("#ff0000").brighten(20).alpha(0.5);
    expect(color).toBeInstanceOf(Colorjs);
    expect(color.A).toBe(0.5);
  });
});
