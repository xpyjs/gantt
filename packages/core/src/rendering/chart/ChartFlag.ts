import Konva from "konva";
import dayjs from "../../utils/time";
import { Pattern } from "./Pattern";
import { isArray } from "lodash-es";
import { IContext } from "@/types/render";
import { colorjs } from "../../utils/color";

/**
 * 标志日期的渲染
 */
export class FlagGroup {
  // 状态变量
  private width: number = 0;
  private height: number = 0;
  private offsetX: number = 0;
  private offsetY: number = 0;

  // 保存标志日期渲染组
  private flagGroup: Konva.Group;

  constructor(private context: IContext, private layer: Konva.Layer) {
    this.flagGroup = new Konva.Group();
    this.layer.add(this.flagGroup);
  }

  /**
   * 调整标志日期大小
   */
  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;

    // 重新计算标志日期
    this.calculateFlag();
  }

  /**
   * 设置偏移量 (响应滚动)
   */
  public setOffset(x: number, y: number): void {
    // 更新偏移量
    this.offsetX = x;
    this.offsetY = y;

    // 应用偏移到标志日期组
    this.flagGroup.x(x);

    // 重新计算标志日期
    this.calculateFlag();
  }

  /**
   * 渲染标志日期
   */
  public render(): void {
    // 使用批量绘制，减少重绘次数
    this.layer.batchDraw();
  }

  /**
   * 销毁标志日期层
   */
  public destroy(): void {
    this.flagGroup.destroy();
  }

  private clearFlag(): void {
    this.flagGroup.destroyChildren();
  }

  /**
   * 计算标志日期
   */
  private async calculateFlag(): Promise<void> {
    this.clearFlag();
    if (!this.context.getOptions().flag?.show) return;

    const data = this.context.getOptions().flag?.data;
    if (!data || data.length === 0) return;

    const backgroundColor = this.context.getOptions().flag?.backgroundColor || this.context.getOptions().primaryColor;
    const opacity = this.context.getOptions().flag?.opacity || 1;
    const color = this.context.getOptions().flag?.color || (colorjs(backgroundColor).isDark() ? 'white' : 'black');
    const fontFamily = this.context.getOptions().flag?.fontFamily || 'Arial';
    const fontSize = this.context.getOptions().flag?.fontSize || 10;

    // 只计算可视范围内
    const visibleStartX = Math.max(0, -this.offsetX);
    const visibleEndX = visibleStartX + this.width;

    const cellWidth = this.context.store.getTimeAxis().getCellWidth();
    const headerHeight = this.context.getOptions().header.height;
    const cellHeight = this.context.getOptions().row.height;
    const totalRows = this.context.store.getDataManager().getVisibleSize();
    const totalHeight = totalRows * cellHeight;

    data.forEach(item => {
      const time = dayjs(item.date);
      const x = this.context.store.getTimeAxis().getTimeLeft(time);
      const y = headerHeight;

      // 检查是否在可视范围内。只渲染可视范围内的内容
      const itemEndX = x + cellWidth;
      if (itemEndX < visibleStartX) {
        return; // 跳过
      }

      if (x > visibleEndX) {
        return; // 已经超过了可视范围，停止
      }

      // 创建线条
      const points = [x, headerHeight, x, this.height];
      const line = new Konva.Line({
        points,
        stroke: item.backgroundColor || backgroundColor,
        opacity: item.opacity || opacity,
        strokeWidth: 1
      });

      this.flagGroup.add(line);

      // 创建文本
      const textContent = item.content || '';
      if (textContent) {
        const text = new Konva.Text({
          text: textContent,
          x: x + 5, // 添加一些内边距
          y: y + 5, // 添加一些内边距
          fontSize,
          fontFamily,
          fill: item.color || color,
          verticalAlign: 'middle',
          align: 'left'
        });

        const bg = new Konva.Rect({
          x: x,
          y: y,
          width: text.measureSize(textContent).width + 12,
          height: text.measureSize(textContent).height + 8,
          fill: item.backgroundColor || backgroundColor,
        });

        this.flagGroup.add(bg);
        this.flagGroup.add(text);
      } else if (item.flag) {
        switch (item.flag) {
          case 'banner':
            this.flagGroup.add(new Konva.Rect({
              x,
              y,
              width: 20,
              height: 10,
              fill: item.backgroundColor || backgroundColor,
              opacity: item.opacity || opacity
            }))
            break;
          case 'pennant':
            this.flagGroup.add(new Konva.Line({
              points: [x, y, x + 20, y + 5, x, y + 10],
              fill: item.backgroundColor || backgroundColor,
              opacity: item.opacity || opacity,
              closed: true
            }));
            break;
          case 'tag':
            this.flagGroup.add(new Konva.Line({
              points: [x, y, x + 20, y, x + 15, y + 5, x + 20, y + 10, x, y + 10],
              fill: item.backgroundColor || backgroundColor,
              opacity: item.opacity || opacity,
              closed: true
            }));
            break;
          case 'wedge':
            this.flagGroup.add(new Konva.Line({
              points: [x, y, x + 20, y, x + 25, y + 5, x + 20, y + 10, x, y + 10],
              fill: item.backgroundColor || backgroundColor,
              opacity: item.opacity || opacity,
              closed: true
            }));
            break;
          case 'ribbon':
            this.flagGroup.add(new Konva.Line({
              points: [x, y, x + 15, y + 2, x + 20, y, x + 20, y + 10, x + 15, y + 12, x, y + 10],
              fill: item.backgroundColor || backgroundColor,
              opacity: item.opacity || opacity,
              closed: true,
              tension: 0.1
            }));
            break;
          default:
            break;
        }
      }
    })

    // 重新渲染
    this.layer.batchDraw();
  }
}
