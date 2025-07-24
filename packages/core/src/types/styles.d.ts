export interface IPattern {
  /**
   * 填充样式
   *
   * @param stripe 斜条纹填充
   * @param dot 圆点填充
   * @param grid 网格填充
   * @param custom 自定义图片填充。使用自定义需要配置 patternOptions 中的 image 属性
   *
   * @example
   * ```ts
   * // 使用斜条纹
   * pattern: "stripe"
   *
   * // 使用自定义图片
   * pattern: "custom"
   * customImage: "data:image/png;base64,..."
   * ```
   */
  pattern?: "stripe" | "dot" | "grid" | "custom";

  /**
   * 条纹样式配置，仅在 pattern 为 "stripe" 时生效
   */
  patternOptions?: {
    /** 条纹颜色，默认使用 backgroundColor */
    color?: string;
    /** 线条宽度。对 dot 就是圆点的大小 */
    width?: number;
    /** 图片旋转角度。对 stripe 有效 */
    angle?: number;
    /** 间距 */
    spacing?: number;
    /** 自定义图片。支持 base64 或图片 URL。对 custom 有效 */
    image?: string;
  };
}
