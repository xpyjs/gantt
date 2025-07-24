/*
 * @Author: JeremyJone
 * @Date: 2025-05-26 10:17:14
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-07-18 17:40:57
 * @Description: 实现 pattern 的渲染
 */

import { IPattern } from "@/types/styles";
import { colorjs } from "../../utils/color";
import Konva from "konva";

export class Pattern {
  private constructor() {}

  public static async createPattern(
    pattern?: IPattern & { backgroundColor?: string }
  ): Promise<HTMLImageElement | null> {
    if (!pattern?.pattern) return null;

    const options = pattern.patternOptions || {};
    options.color = options.color || pattern.backgroundColor;

    switch (pattern.pattern) {
      case "stripe":
        return this.createStripePattern(options);
      case "dot":
        return this.createDotPattern(options);
      case "grid":
        return this.createGridPattern(options);
      case "custom":
        if (options.image) {
          const img = new Image();
          img.src = options.image;
          return new Promise(resolve => {
            img.onload = () => resolve(img);
          });
        }
        return null;
      default:
        return null;
    }
  }

  /**
   * 创建条纹图案
   */
  private static createStripePattern(
    options?: IPattern["patternOptions"]
  ): HTMLImageElement {
    const {
      color = options?.color || "#c9c9c9",
      width = options?.width || 1,
      angle = options?.angle ?? 30,
      spacing = options?.spacing || 10
    } = options || {};

    // 将角度转换到 0-180 范围内
    const θ = angle % 180;
    const rad = (θ * Math.PI) / 180;

    let canvasWidth: number;
    let canvasHeight: number;
    if (θ === 0) {
      canvasWidth = spacing;
      canvasHeight = width + spacing;
    } else if (θ === 90) {
      canvasWidth = width + spacing;
      canvasHeight = spacing;
    } else {
      canvasWidth = Math.abs(Math.ceil((width + spacing) / Math.sin(rad)));
      canvasHeight = Math.abs(Math.ceil((width + spacing) / Math.cos(rad)));
    }

    // 创建一个临时的 stage
    const stage = new Konva.Stage({
      container: document.createElement("div"),
      width: canvasWidth,
      height: canvasHeight
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    // 创建线条组
    const group = new Konva.Group();

    // 绘制线条
    if (θ === 0 || θ === 90) {
      const line = new Konva.Line({
        points: [0, 0, θ === 0 ? canvasWidth : 0, θ === 0 ? 0 : canvasHeight],
        stroke: color,
        strokeWidth: width,
        perfectDrawEnabled: true
      });

      group.add(line);
    } else {
      for (let x = -canvasWidth; x < canvasWidth * 2; x += canvasWidth) {
        // 计算线条的起点和终点
        const x1 = x + width / 2;
        const y1 = 0;
        const x2 =
          x + width / 2 + (Math.cos(rad) < 0 ? -canvasWidth : canvasWidth);
        const y2 = canvasHeight;

        const line = new Konva.Line({
          points: [Math.ceil(x1), Math.ceil(y1), Math.ceil(x2), Math.ceil(y2)],
          stroke: color,
          strokeWidth: width,
          perfectDrawEnabled: true,
          lineCap: "square",
          lineJoin: "miter"
        });

        group.add(line);
      }
    }

    layer.add(group);
    layer.draw();

    // 导出为图片
    const img = new Image();
    img.src = stage.toDataURL();

    // 清理
    stage.destroy();

    return img;
  }

  /**
   * 创建圆点图案
   */
  private static createDotPattern(
    options?: IPattern["patternOptions"]
  ): HTMLImageElement {
    const {
      color = options?.color || "#f9f9f9",
      width: dotSize = options?.width || 2,
      spacing = options?.spacing || 4
    } = options || {};

    // 计算画布尺寸
    const canvasWidth = dotSize * 2 + spacing * 2;
    const canvasHeight = canvasWidth;

    // 使用 colorjs 处理颜色
    const dotColor = colorjs(color);

    // 创建一个临时的 stage
    const stage = new Konva.Stage({
      container: document.createElement("div"),
      width: canvasWidth,
      height: canvasHeight
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    // 计算点的位置
    const positions = [
      { x: spacing / 2 + dotSize / 2, y: spacing / 2 + dotSize / 2 },
      {
        x: canvasWidth - spacing / 2 - dotSize / 2,
        y: spacing / 2 + dotSize / 2
      },
      {
        x: spacing / 2 + dotSize / 2,
        y: canvasHeight - spacing / 2 - dotSize / 2
      },
      {
        x: canvasWidth - spacing / 2 - dotSize / 2,
        y: canvasHeight - spacing / 2 - dotSize / 2
      }
    ];

    // 绘制点
    positions.forEach(pos => {
      const dot = new Konva.Circle({
        x: pos.x,
        y: pos.y,
        radius: dotSize / 2,
        fill: dotColor.toString()
      });

      layer.add(dot);
    });
    layer.draw();

    // 导出为图片
    const img = new Image();
    img.src = stage.toDataURL();

    // 清理
    stage.destroy();

    return img;
  }

  /**
   * 创建网格图案
   */
  private static createGridPattern(
    options?: IPattern["patternOptions"]
  ): HTMLImageElement {
    const {
      color = options?.color || "#f9f9f9",
      width = options?.width || 1,
      spacing = options?.spacing || 20
    } = options || {};

    // 基础单元大小
    const baseSize = width + spacing;

    // 计算画布尺寸
    const canvasWidth = baseSize;
    const canvasHeight = baseSize;

    // 创建一个临时的 stage
    const stage = new Konva.Stage({
      container: document.createElement("div"),
      width: canvasWidth,
      height: canvasHeight
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    // 创建线条组
    const group = new Konva.Group();

    group.add(
      new Konva.Line({
        points: [0, 0, canvasWidth, canvasHeight],
        stroke: color,
        strokeWidth: width,
        perfectDrawEnabled: true
      })
    );

    group.add(
      new Konva.Line({
        points: [0, canvasHeight, canvasWidth, 0],
        stroke: color,
        strokeWidth: width,
        perfectDrawEnabled: true
      })
    );

    layer.add(group);
    layer.draw();

    // 导出为图片
    const img = new Image();
    img.src = stage.toDataURL();

    // 清理
    stage.destroy();

    return img;
  }
}
