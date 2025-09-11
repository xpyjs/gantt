/*
 * @Author: JeremyJone
 * @Date: 2025-07-30 17:53:19
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-09-05 09:20:06
 * @Description: 图表基线渲染管理器
 */

import Konva from "konva";
import { Baseline } from "../../models/Baseline";
import { Task } from "../../models/Task";
import { IContext } from "@/types/render";
import { isFunction, isString } from "lodash-es";
import { colorjs } from "../../utils/color";
import { formatNumber, getStandardCornerRadius, parseNumberWithPercent } from "../../utils/helpers";
import { EventName } from "../../event";
import { BaselineDiff } from "../../types/baseline";

export class ChartBaseline {
  private tasks: Task[] = [];

  private chartBaselineGroup: Konva.Group;
  private indicatorGroup: Konva.Group;
  private baselineGroup: Konva.Group;

  // 状态变量
  private width: number = 0;
  private height: number = 0;
  private offsetX: number = 0;
  private offsetY: number = 0;

  constructor(
    private context: IContext,
    private stage: Konva.Stage,
    private layer: Konva.Layer
  ) {
    this.chartBaselineGroup = new Konva.Group({ name: "chart-baseline-group" });

    // 创建基线组
    this.baselineGroup = new Konva.Group({ name: "baseline-group" });
    this.chartBaselineGroup.add(this.baselineGroup);

    this.indicatorGroup = new Konva.Group({ name: "baseline-indicator-group" });
    this.chartBaselineGroup.add(this.indicatorGroup);

    this.layer.add(this.chartBaselineGroup);

    this.registerEvents();
  }

  /**
   * 注册事件
   */
  private registerEvents(): void {
    // this.context.event.on(EventName.ROW_HIGHLIGHT, (id: string) => {
    //   this.highlightPoint(id);
    // });
  }

  /**
   * 调整基线大小
   */
  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;

    // 重新计算基线大小
    this.calculateBaselines();
  }

  /**
   * 设置偏移量 (响应滚动)
   */
  public setOffset(x: number, y: number): void {
    // 更新偏移量
    this.offsetX = x;
    this.offsetY = y;

    // 应用偏移到基线
    this.chartBaselineGroup.x(x);
    this.chartBaselineGroup.y(y);

    // 如果需要重新计算基线
    this.calculateBaselines();
  }

  /**
   * 更新数据
   */
  public update() {
    // 重新计算基线
    this.calculateBaselines();
  }

  /**
   * 渲染基线
   */
  public render(tasks: Task[]): void {
    this.tasks = tasks;
    this.update();
  }

  /**
   * 销毁关联线
   */
  public destroy(): void {
    this.baselineGroup.destroy();
    this.indicatorGroup.destroy();
    this.chartBaselineGroup.destroy();
  }

  /**
   * 计算并渲染基线
   */
  private calculateBaselines(): void {
    // 清空当前基线
    this.baselineGroup.destroyChildren();
    this.indicatorGroup.destroyChildren();

    // 不展示
    if (!this.context.getOptions().baselines.show) return;

    // 获取一些参数
    const headerHeight = this.context.getOptions().header.height;
    const rowHeight = this.context.getOptions().row.height;
    const height = rowHeight / 2 + headerHeight;
    const cornerRadius = getStandardCornerRadius(
      this.context.getOptions().baselines.radius
    );
    const opacity = this.context.getOptions().baselines.opacity;
    const bgColor = this.context.getOptions().baselines.backgroundColor;

    this.tasks.forEach(task => {
      if (
        this.context.store.getOptionManager().unpackFunc(this.context.getOptions().bar.show, task)
      ) {
        const bls = this.context.store.getDataManager().getBaselinesByTaskId(task.id);
        const barHeight = parseNumberWithPercent(
          this.context.getOptions().baselines.height ||
          this.context.store.getOptionManager().unpackFunc(this.context.getOptions().bar.height, task),
          rowHeight
        );
        const offset = (this.context.getOptions().baselines.offset ?? 0);
        bls.forEach((bl, index) => {
          if (!bl.validate()) return;

          const left = this.context.store.getTimeAxis().getTimeLeft(bl.startTime!);
          const right = this.context.store.getTimeAxis().getTimeLeft(bl.endTime!);
          const group = new Konva.Group({ id: `baseline-group-${bl.id}` });

          // 按照模式渲染基线
          this.renderBaselineBar(group, task, bl, left, right, height, rowHeight, barHeight, headerHeight, bgColor, opacity, cornerRadius, offset);
          this.baselineGroup.add(group);

          // 渲染对比
          const compare = this.context.getOptions().baselines.compare;
          const result = bl.getTimeDiff();
          if (!compare.enabled || !result) return;

          // 根据对比模式渲染
          const mode = compare.mode;
          if (bl.highlight) {
            if (mode === 'highlight' || mode === 'both') {
              this.renderCompareHighlight(group, task, bl, result);
            }
          }

          // 在多个基线的情况下，默认指示器只和第一个比较
          // 添加数据时已经把 target 放在前面了
          if (index === 0) {
            if (mode === 'indicator' || mode === 'both') {
              this.renderCompareIndicator(task, bl, result);
            }
          }

          // 绑定事件
          this.bindEvents(group, task, bl);
        });
      }
    });
  }

  private renderBaselineBar(group: Konva.Group, task: Task, bl: Baseline, left: number, right: number, height: number, rowHeight: number, barHeight: number, headerHeight: number, bgColor: string, opacity: number, cornerRadius: number | number[], offset: number): void {
    if (this.context.getOptions().baselines.mode === 'shadow') {
      const y = height + rowHeight * task.flatIndex - barHeight / 2 + offset;

      const blRect = new Konva.Rect({
        id: `baseline-item-${bl.id}`,
        x: left,
        y: y,
        width: right - left,
        height: barHeight,
        cornerRadius,
        fill: bgColor,
        opacity,
      });

      group.add(blRect);
      this.renderText(group, task, bl, left, right, y, barHeight);
    } else if (this.context.getOptions().baselines.mode === 'line') {
      const lineHeight = parseNumberWithPercent(this.context.getOptions().baselines.height ?? 5, rowHeight);
      let y = headerHeight + rowHeight * task.flatIndex + offset;

      // 如果是 line 模式，y 位置需要调整
      const pos = this.context.getOptions().baselines.position;
      let type = '';
      if (pos === 'top') {
        y += + lineHeight / 2;
        type = 'line_top';
      } else if (pos === 'center') {
        y += rowHeight / 2;
        type = 'line_center';
      } else {
        y += rowHeight - lineHeight / 2;
        type = 'line_bottom';
      }

      const blLine = new Konva.Line({
        id: `baseline-item-${bl.id}`,
        points: [left, y, right, y],
        stroke: bgColor,
        opacity: opacity,
        strokeWidth: lineHeight,
        lineCap: 'butt',
        lineJoin: 'round',
      });

      group.add(blLine);
      this.renderText(group, task, bl, left, right, y, lineHeight, type);
    }
  }

  private renderText(group: Konva.Group, task: Task, baseline: Baseline, left: number, right: number, y: number, height: number, type?: string) {
    const id = `chart-baseline-text-${baseline.id}`;
    const clearText = () => {
      if (this.baselineGroup.find(`#${id}`)) {
        this.baselineGroup.find(`#${id}`).forEach(text => text.remove());
      }
    };

    clearText();

    if (!this.context.getOptions().baselines.label.show) return;

    const _label = this.context.getOptions().baselines.label.field;
    const content = _label ? baseline.getField(_label) : baseline.name;
    if (!content || content === '') return; // 没有内容不渲染

    // 渲染文本
    const width = right - left - 10; // 留出左右边距
    const textHeight = Math.max(this.context.getOptions().baselines.label.fontSize, height);
    const textDom = new Konva.Text({
      text: content,
      id: id,
      x: left + 5,
      y: y,
      width: width,
      height: textHeight,
      fill: this.context.getOptions().baselines.label.color,
      fontSize: this.context.getOptions().baselines.label.fontSize,
      fontFamily: this.context.getOptions().baselines.label.fontFamily || "Arial",
      align: this.context.getOptions().baselines.label.position,
      verticalAlign: 'bottom',
    });


    if (type === 'line_bottom') {
      textDom.setAttrs({
        y: y - textHeight / 2,
        verticalAlign: 'top',
      })
    } else if (type === 'line_center') {
      textDom.setAttrs({
        y: y - textHeight / 2,
        verticalAlign: 'middle',
      })
    } else if (type === 'line_top') {
      textDom.setAttrs({
        y: y - height / 2,
        verticalAlign: 'bottom',
      })
    }

    // 如果高度大于文本高度，则垂直居中
    if (height >= textHeight) {
      textDom.setAttrs({
        verticalAlign: 'middle',
      })
    }

    // 太短不展示文本
    const textWidth = textDom.measureSize(content);
    if (this.context.getOptions().baselines.label.forceDisplay || width > textWidth.width) {
      group.add(textDom);
    }
  }

  private renderCompareHighlight(group: Konva.Group, task: Task, baseline: Baseline, result: BaselineDiff): void {
    const status = result[`${this.context.getOptions().baselines.compare.target}Status`];
    if (!status || status === 'ontime') return; // 准时不渲染高亮

    const itemDom = group.findOne(`#baseline-item-${baseline.id}`);
    if (!itemDom) return;

    const compare = this.context.getOptions().baselines.compare;
    const type = this.context.getOptions().baselines.mode;
    const style = { fill: '', stroke: '', opacity: compare[status].opacity }
    if (type === 'shadow') {
      style.fill = compare[status].backgroundColor;
    } else if (type === 'line') {
      style.stroke = compare[status].backgroundColor;
    } else {
      return; // 避免把颜色重置，直接返回
    }

    itemDom.setAttrs(style);
  }

  private renderCompareIndicator(task: Task, baseline: Baseline, result: BaselineDiff): void {
    const options = this.context.getOptions().baselines;
    const indicator = options.compare.indicator;
    if (!indicator || !indicator.show) return;

    // 计算位置
    const headerHeight = this.context.getOptions().header.height;
    const rowHeight = this.context.getOptions().row.height;
    const height = parseNumberWithPercent(
      this.context.store.getOptionManager().unpackFunc(this.context.getOptions().bar.height, task),
      rowHeight
    );

    let color = options.backgroundColor;

    const taskLeft = this.context.store.getTimeAxis().getTimeLeft(task.startTime!);
    const taskRight = this.context.store.getTimeAxis().getTimeLeft(task.endTime!);
    let y = (rowHeight - height) / 2 + rowHeight * task.flatIndex + headerHeight;

    // 指示器的位置
    if (indicator.position === 'bottom') {
      y += height;
    }

    // 显示起始时间对比的指示器
    if (indicator.show === 'start' || indicator.show === 'both' || indicator.show === true) {
      const status = result.startStatus;
      if (status && options.compare.indicator[status].show) {
        color = colorjs(options.compare.indicator[status].color).alpha(options.compare.indicator[status].opacity).toHex();
        const leftIndicator = new Konva.Circle({
          x: taskLeft - indicator.size,
          y: y,
          fill: color,
          radius: indicator.size / 2
        });
        this.indicatorGroup.add(leftIndicator);

        let text = `${formatNumber(result.startDiff)}${result.unit} ${status}`;
        const _t = options.compare.indicator[status].text;
        if (isFunction(_t)) {
          text = _t(result.startDiff, { ...task.getEmitData(), baseline });
        } else if (isString(_t)) {
          text = _t;
        }
        const textDom = new Konva.Text({
          y: y - indicator.fontSize / 2,
          text,
          fill: color,
          fontSize: indicator.fontSize,
          fontFamily: indicator.fontFamily || "Arial",
        });

        const textWidth = textDom.measureSize(text);
        textDom.x(taskLeft - indicator.size - textWidth.width - 5); // 调整文本位置

        this.indicatorGroup.add(textDom);
      }
    }

    // 显示结束时间对比的指示器
    if (indicator.show === 'end' || indicator.show === 'both' || indicator.show === true) {
      const status = result.endStatus;
      if (status && options.compare.indicator[status].show) {
        color = colorjs(options.compare.indicator[status].color).alpha(options.compare.indicator[status].opacity).toHex();
        const rightIndicator = new Konva.Circle({
          x: taskRight + indicator.size,
          y: y,
          fill: color,
          radius: indicator.size / 2
        });
        this.indicatorGroup.add(rightIndicator);

        let text = `${formatNumber(result.endDiff)}${result.unit} ${status}`;
        const _t = options.compare.indicator[status].text;
        if (isFunction(_t)) {
          text = _t(result.endDiff, { ...task.getEmitData(), baseline });
        } else if (isString(_t)) {
          text = _t;
        }
        const textDom = new Konva.Text({
          x: taskRight + indicator.size + 5,
          y: y - indicator.fontSize / 2,
          text,
          fill: color,
          fontSize: indicator.fontSize,
          fontFamily: indicator.fontFamily || "Arial"
        })

        this.indicatorGroup.add(textDom);
      }
    }

    // TODO 绑定事件
    // this.indicatorGroup.addEventListener('mouseover', e => {
    //   //
    // })
  }

  private bindEvents(dom: Konva.Group, task: Task, baseline: Baseline): void {
    dom.on('mouseover', e => {
      this.context.event.emit(EventName.BASELINE_MOUSEOVER, e.evt, task, baseline);
    });

    dom.on('mouseout', e => {
      this.context.event.emit(EventName.BASELINE_MOUSEOUT, e.evt, task, baseline);
    });

    dom.on('click', e => {
      e.cancelBubble = true; // 阻止事件冒泡

      if (e.evt.button === 0) {
        this.context.event.emit(EventName.BASELINE_CLICK, e.evt, task, baseline);
      } else if (e.evt.button === 2) {
        this.context.event.emit(EventName.BASELINE_CONTEXTMENU, e.evt, task, baseline);
      }
    });
  }
}
