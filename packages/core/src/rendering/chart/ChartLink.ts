/*
 * @Author: JeremyJone
 * @Date: 2025-05-09 16:52:26
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-09-10 17:26:22
 * @Description: 关联线
 */
import Konva from "konva";
import { Logger } from "../../utils/logger";
import { ErrorType, EventName } from "../../event";
import { cloneDeep, isBoolean, isFunction, isString } from "lodash-es";
import { colorjs } from "../../utils/color";
import { ILink, LinkType } from "@/types/link";
import { IContext } from "@/types/render";
import type { Task } from "@/models/Task";
import { generateId } from "../../utils/id";

export class LinkGroup {
  private tasks: Task[] = [];
  // 创建点组
  private pointGroup: Konva.Group;
  // 关联线组
  private linksGroup: Konva.Group;
  // 临时箭头
  private templateArrow: Konva.Arrow;

  // 对所有已存在的连线进行缓存
  private linkCache: Map<string, Konva.Group> = new Map();

  private isDragging = false;
  private isSliderMoving = false;

  // 选中的连线
  private selectedMap: Map<string, ILink> = new Map();

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
    this.linksGroup = new Konva.Group({ name: "links-group" });
    this.pointGroup = new Konva.Group({ name: "point-group" });

    this.templateArrow = new Konva.Arrow({
      points: [],
      stroke:
        this.context.getOptions().links.color ||
        this.context.getOptions().primaryColor,
      strokeWidth: this.context.getOptions().links.width,
      pointerLength: this.context.getOptions().links.arrow.height, // 箭头长度
      pointerWidth: this.context.getOptions().links.arrow.width, // 箭头宽度
      fill:
        this.context.getOptions().links.arrow.color ||
        this.context.getOptions().links.color ||
        this.context.getOptions().primaryColor, // 箭头填充色
      lineJoin: "round",
      dash: this.context.getOptions().links.dash,
      opacity: 0.4
    });
    this.templateArrow.visible(false);

    this.layer.add(this.linksGroup);
    this.layer.add(this.pointGroup);
    this.layer.add(this.templateArrow);

    this.registerEvents();
  }

  /**
   * 注册事件
   */
  private registerEvents(): void {
    // 监听行高亮事件
    this.context.event.on(EventName.ROW_HIGHLIGHT, (id: string) => {
      this.highlightPoint(id);
    });

    // 监听取消高亮事件
    this.context.event.on(EventName.ROW_UNHIGHLIGHT, (id: string) => {
      this.unhighlightPoint(id);
    });

    this.context.event.on(EventName.SLIDER_MOVING, (moving: boolean) => {
      this.isSliderMoving = moving;
    });
  }

  /**
   * 调整关联线大小
   */
  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  /**
   * 设置偏移量 (响应滚动)
   */
  public setOffset(x: number, y: number): void {
    // 更新偏移量
    this.offsetX = x;
    this.offsetY = y;

    // 应用偏移到关联线
    this.linksGroup.x(x);
    this.linksGroup.y(y);

    // 应用偏移到点组
    this.pointGroup.x(x);
    this.pointGroup.y(y);

    // 应用偏移到临时箭头
    this.templateArrow.x(x);
    this.templateArrow.y(y);
  }

  /**
   * 更新某一条数据
   */
  public updateTask(task: Task) {
    // 重新计算关联线
    this.calculateLinks(task);

    // 重新计算点组位置
    this.calculatePoints(task);
  }

  /**
   * 渲染关联线
   */
  public render(tasks: Task[]): void {
    this.tasks = tasks;

    // 重新计算关联线
    this.calculateLinks();

    // 重新计算点组位置
    this.calculatePoints();
  }

  /**
   * 销毁关联线
   */
  public destroy(): void {
    this.linksGroup.destroy();
    this.pointGroup.destroy();
    this.templateArrow.destroy();
    this.selectedMap.clear();
    this.linkCache.clear();
  }

  /**
   * 计算点组位置
   */
  private calculatePoints(currentTask?: Task): void {
    // 不展示
    if (!this.context.getOptions().links.show || !this.context.getOptions().links.create.enabled) {
      // 清除现有点组
      this.pointGroup.destroyChildren();
      return;
    }

    if (currentTask) {
      // 仅更新该任务的点
      this.pointGroup.findOne(`#point-${currentTask.id}-left`)?.destroy();
      this.pointGroup.findOne(`#point-${currentTask.id}-right`)?.destroy();
    } else {
      // 清除现有点组
      this.pointGroup.destroyChildren();
    }

    // 获取一些参数
    const headerHeight = this.context.getOptions().header.height;
    const rowHeight = this.context.getOptions().row.height;
    const height = rowHeight / 2 + headerHeight;
    const radius = this.context.getOptions().links.create.radius;
    const opacity =
      this.context.getOptions().links.create.mode === "always" ? 0.5 : 0;
    const color =
      this.context.getOptions().links.create.color ||
      this.context.getOptions().primaryColor;
    const stroke = colorjs(color)
      .alpha(this.context.getOptions().links.create.opacity ?? 1)
      .toHex();
    const strokeWidth = this.context.getOptions().links.create.width;

    this.tasks.forEach(task => {
      if (currentTask && task.id !== currentTask.id) return;

      if (
        this.context.store.getOptionManager().unpackFunc(this.context.getOptions().bar.show, task) &&
        task.startTime &&
        task.endTime
      ) {
        const left = this.context.store
          .getTimeAxis()
          .getTimeLeft(task.startTime);
        const right = this.context.store
          .getTimeAxis()
          .getTimeLeft(task.endTime);

        let gap = this.context.getOptions().links.gap;
        if (task.isMilestone()) {
          gap += rowHeight / 2;
        }

        const y = height + rowHeight * task.flatIndex;

        // 检测是否允许创建左侧连接点
        let allowLeft = true;
        let allowRight = true;
        let _from = this.context.store.getOptionManager().unpackFunc(this.context.getOptions().links.create.from, task);

        if (isBoolean(_from)) {
          allowLeft = allowRight = _from;
        } else if (isString(_from)) {
          allowLeft = _from === "S";
          allowRight = _from === "F";
        }

        // 左侧
        if (allowLeft) {
          const leftPoint = new Konva.Circle({
            id: `point-${task.id}-left`,
            x: left - gap,
            y,
            radius,
            opacity,
            stroke,
            strokeWidth
          });

          this.pointGroup.add(leftPoint);

          leftPoint.on("mousedown", e => {
            this.isDragging = true;
            this.createLink(e, "S", color, [left - gap, y], task.id);
          });

          leftPoint.on("mouseover", e => {
            if (this.isSliderMoving) return;
            this.stage.container().style.cursor = "pointer";
          });
          leftPoint.on("mouseout", e => {
            if (this.isDragging || this.isSliderMoving) return;
            this.stage.container().style.cursor = "default";
          });
        }

        // 右侧
        if (allowRight) {
          const rightPoint = new Konva.Circle({
            id: `point-${task.id}-right`,
            x: right + gap,
            y,
            radius,
            opacity,
            stroke,
            strokeWidth
          });

          this.pointGroup.add(rightPoint);

          rightPoint.on("mousedown", e => {
            this.isDragging = true;
            this.createLink(e, "F", color, [right + gap, y], task.id);
          });

          rightPoint.on("mouseover", e => {
            if (this.isSliderMoving) return;
            this.stage.container().style.cursor = "pointer";
          });
          rightPoint.on("mouseout", e => {
            if (this.isDragging || this.isSliderMoving) return;
            this.stage.container().style.cursor = "default";
          });
        }
      }
    });
  }

  /**
   * 计算关联线位置
   */
  private calculateLinks(task?: Task): void {
    // 不展示
    if (!this.context.getOptions().links.show) {
      this.destroy();
      return;
    }

    // 没有任务，不需要创建任何连线
    if (this.tasks.length === 0) {
      this.destroy();
      return;
    }

    // 获取数据
    const links = task
      ? this.context.store.getLinkManager().getLinksByTaskId(task.id)
      : this.context.store.getLinkManager().getLinks();

    if (task) {
      // 仅更新与该任务相关的连线
      links.forEach(link => {
        const id = this.createId(link);
        this.linkCache.delete(id);
        const existing = this.linksGroup.findOne(`#${id}`);
        if (existing) existing.destroy();
      });
    }

    const currentKey = generateId();
    // 记录已选择的状态
    links.forEach(link => {
      const id = this.createId(link);

      const fromTask = this.context.store.getDataManager().getTaskById(link.from);
      const toTask = this.context.store.getDataManager().getTaskById(link.to);

      if (!fromTask) {
        Logger.warn(
          `No corresponding FROM task [${link.from}] was found for the link. Info:`,
          link
        );
        return;
      }

      if (!toTask) {
        Logger.warn(
          `No corresponding TO task [${link.to}] was found for the link. Info:`,
          link
        );
        return;
      }

      if (fromTask.flatIndex < this.tasks[0].flatIndex && toTask.flatIndex < this.tasks[0].flatIndex) {
        // 全都在上面，不显示
        return;
      }
      if (fromTask.flatIndex > this.tasks[this.tasks.length - 1].flatIndex && toTask.flatIndex > this.tasks[this.tasks.length - 1].flatIndex) {
        // 全都在下面，不显示
        return;
      }
      // 只计算可视范围内
      const visibleStartX = Math.max(0, -this.offsetX);
      const visibleEndX = visibleStartX + this.width;
      if (this.context.store.getTimeAxis().getTimeLeft(link.type?.[0] === 'S' ? fromTask.startTime! : fromTask.endTime!) < visibleStartX &&
        this.context.store.getTimeAxis().getTimeLeft(link.type?.[1] === 'F' ? toTask.endTime! : toTask.startTime!) < visibleStartX) {
        // 全都在左边，不显示
        return;
      }
      if (this.context.store.getTimeAxis().getTimeLeft(link.type?.[0] === 'S' ? fromTask.startTime! : fromTask.endTime!) > visibleEndX &&
        this.context.store.getTimeAxis().getTimeLeft(link.type?.[1] === 'F' ? toTask.endTime! : toTask.startTime!) > visibleEndX) {
        // 全都在右边，不显示
        return;
      }

      // ====== 开始创建 ======
      if (
        this.context.store.getOptionManager().unpackFunc(this.context.getOptions().bar.show, fromTask) &&
        this.context.store.getOptionManager().unpackFunc(this.context.getOptions().bar.show, toTask)
      ) {
        const points = this.getPoints(fromTask, toTask, link);

        if (points.length <= 2) {
          Logger.warn(`The link position has some error.`, link);
        } else {
          const radius: number =
            link.radius ?? this.context.getOptions().links.radius; // 圆点半径
          const pointerWidth: number =
            link.arrow?.width ?? this.context.getOptions().links.arrow.width; // 箭头宽度
          const pointerLength: number =
            link.arrow?.height ?? this.context.getOptions().links.arrow.height; // 箭头长度
          const strokeWidth: number =
            link.width ?? this.context.getOptions().links.width; // 线条宽度

          // 检测是否已存在
          let group = this.linkCache.get(id);

          if (group === undefined) {
            group = new Konva.Group({ id });
          }
          if (!task) {
            (group as any)._ = currentKey; // 标记当前渲染周期
          }

          const circle = group.findOne<Konva.Circle>('Circle');
          if (circle) {
            circle.radius(radius);
            circle.fill(
              link.color ||
              this.context.getOptions().links.color ||
              this.context.getOptions().primaryColor
            );
            circle.x(points[0]);
            circle.y(points[1]);
          } else {
            const circle = new Konva.Circle({
              radius,
              fill:
                link.color ||
                this.context.getOptions().links.color ||
                this.context.getOptions().primaryColor,
              x: points[0],
              y: points[1]
            });
            group.add(circle);
          }

          // 更新拖拽时间的主体
          // 整条箭头线的前半段可以拖拽起始点
          // 箭头线的后半段可以拖拽结束点
          // 上面的圆点不再响应事件，仅仅表示一个起点。 PS:我还在考虑去掉圆点...
          const midPoint = Math.floor(points.length / 2);
          const actualMidIndex = midPoint % 2 === 0 ? midPoint : midPoint - 1;
          // 分割数组
          const startPoints = points.slice(0, actualMidIndex + 2);
          const endPoints = points.slice(actualMidIndex);

          const line = group.findOne<Konva.Line>('Line');
          if (line) {
            line.points(startPoints);
            line.stroke(
              link.color ||
              this.context.getOptions().links.color ||
              this.context.getOptions().primaryColor
            );
            line.strokeWidth(strokeWidth);
            line.dash(link.dash || this.context.getOptions().links.dash);
          } else {
            const line = new Konva.Line({
              points: startPoints,
              stroke:
                link.color ||
                this.context.getOptions().links.color ||
                this.context.getOptions().primaryColor,
              strokeWidth,
              lineCap: "round",
              lineJoin: "round",
              dash: link.dash || this.context.getOptions().links.dash,
              hitStrokeWidth: 10, // 增加点击区域
              draggable: true,
              dragBoundFunc: pos => ({ x: 0, y: 0 })
            });
            group.add(line);

            line.on("dragstart", e => {
              this.handleDrag(
                e,
                link,
                "S",
                [points[points.length - 2], points[points.length - 1]],
                id
              );
            });
          }

          const arrow = group.findOne<Konva.Arrow>('Arrow');
          if (arrow) {
            arrow.points(endPoints);
            arrow.stroke(
              link.color ||
              this.context.getOptions().links.color ||
              this.context.getOptions().primaryColor
            );
            arrow.strokeWidth(strokeWidth);
            arrow.pointerLength(pointerLength);
            arrow.pointerWidth(pointerWidth);
            arrow.fill(
              link.arrow?.color ||
              this.context.getOptions().links.arrow.color ||
              link.color ||
              this.context.getOptions().links.color ||
              this.context.getOptions().primaryColor
            );
            arrow.lineJoin("round");
            arrow.dash(link.dash || this.context.getOptions().links.dash);
          } else {
            const arrow = new Konva.Arrow({
              points: endPoints,
              stroke:
                link.color ||
                this.context.getOptions().links.color ||
                this.context.getOptions().primaryColor,
              strokeWidth,
              pointerLength,
              pointerWidth,
              fill:
                link.arrow?.color ||
                this.context.getOptions().links.arrow.color ||
                link.color ||
                this.context.getOptions().links.color ||
                this.context.getOptions().primaryColor, // 箭头填充色
              lineJoin: "round",
              dash: link.dash || this.context.getOptions().links.dash,
              hitStrokeWidth: 10, // 增加点击区域
              draggable: true,
              dragBoundFunc: pos => ({ x: 0, y: 0 })
            });
            group.add(arrow);

            arrow.on("dragstart", e => {
              this.handleDrag(e, link, "F", [points[0], points[1]], id);
            });
          }

          if (!this.linkCache.has(id)) {
            // 加载到视图
            this.linksGroup.add(group);

            group.on("mouseover", e => {
              e.target.moveToTop();

              if (this.context.getOptions().links.move.enabled === true) {
                this.stage.container().style.cursor = "pointer";
              }

              if (!this.selectedMap.has(id)) {
                this.handleHighlight(
                  group,
                  radius,
                  pointerWidth,
                  pointerLength,
                  strokeWidth,
                  2
                );
              }
            });
            group.on("mouseout", e => {
              if (!this.selectedMap.has(id)) {
                this.handleHighlight(
                  group,
                  radius,
                  pointerWidth,
                  pointerLength,
                  strokeWidth,
                  0
                );
              }

              if (this.isDragging) return;
              this.stage.container().style.cursor = "default";
            });
            group.on("mousedown", e => {
              this.isDragging = true;
            });
            group.on("click", e => {
              e.cancelBubble = true; // 阻止事件冒泡
              this.isDragging = false;
              group.moveToTop();

              if (e.evt.button === 0) {
                // 左键点击
                if (this.selectedMap.has(id)) {
                  this.selectedMap.delete(id);
                  this.context.event.emit(
                    EventName.SELECT_LINK,
                    null,
                    link,
                    this.selectedMap.values().toArray()
                  );
                } else {
                  this.selectedMap.set(id, link);
                  this.context.event.emit(
                    EventName.SELECT_LINK,
                    link,
                    null,
                    this.selectedMap.values().toArray()
                  );
                }
              }
            });
            group.on("contextmenu", e => {
              e.evt.preventDefault(); // 阻止默认右键菜单
              e.cancelBubble = true; // 阻止事件冒泡
              // 右键点击
              this.context.event.emit(EventName.CONTEXT_LINK, e.evt, link);
            })

            // 缓存连线
            this.linkCache.set(id, group);
          }

          // 创建后检查是否处于选中状态
          if (this.selectedMap.has(id)) {
            this.handleHighlight(
              group,
              radius,
              pointerWidth,
              pointerLength,
              strokeWidth,
              2,
              true
            );
          }
        }
      }
    });

    // 删除已不存在的连线
    if (!task) {
      this.linkCache.forEach((group, id) => {
        if ((group as any)._ !== currentKey) {
          group.destroy();
          this.linkCache.delete(id);
        }
      });
    }

    // 使用批量绘制，减少重绘次数
    this.layer.batchDraw();
  }

  private createId(link: ILink) {
    return `link-group-${link[this.context.getOptions().links.key]}-${link.from
      }-${link.to}-${link.type || "FS"}`;
  }

  private getPoints(fromTask: Task, toTask: Task, link: ILink) {
    if (fromTask.startTime && fromTask.endTime && toTask.startTime && toTask.endTime) {
      const rowHeight = this.context.getOptions().row.height;
      const fromGap = fromTask.isMilestone() ? rowHeight / 2 : 0;
      const fromX = this.context.store
        .getTimeAxis()
        .getTimeLeft(fromTask.startTime) - fromGap;
      const fromEnd = this.context.store
        .getTimeAxis()
        .getTimeLeft(fromTask.endTime) + fromGap;

      const toGap = toTask.isMilestone() ? rowHeight / 2 : 0;
      const toX = this.context.store
        .getTimeAxis()
        .getTimeLeft(toTask.startTime) - toGap;
      const toEnd = this.context.store
        .getTimeAxis()
        .getTimeLeft(toTask.endTime) + toGap;

      let points: number[] = [];
      const type = link.type || "FS";
      switch (type) {
        case "FF":
          points = this.createFF(link, fromTask, toTask, fromX, fromEnd, toX, toEnd);
          break;
        case "SS":
          points = this.createSS(link, fromTask, toTask, fromX, fromEnd, toX, toEnd);
          break;
        case "SF":
          points = this.createSF(link, fromTask, toTask, fromX, fromEnd, toX, toEnd);
          break;
        case "FS":
        default:
          points = this.createFS(link, fromTask, toTask, fromX, fromEnd, toX, toEnd);
      }

      return points;
    }

    return [];
  }

  /** 生成 FS 连线 */
  private createFS(
    link: ILink,
    fromTask: Task,
    toTask: Task,
    fromX: number,
    fromEnd: number,
    toX: number,
    toEnd: number
  ) {
    const headerHeight = this.context.getOptions().header.height;
    const rowHeight = this.context.getOptions().row.height;
    const y = rowHeight / 2 + headerHeight;
    const gap: number = link.gap || this.context.getOptions().links.gap;

    // 起点
    const points: number[] = [
      fromEnd + gap,
      0.05 + y + rowHeight * fromTask.flatIndex
    ];

    // 过程点
    {
      const distance: number = link.distance
        ? parseInt(link.distance)
        : this.context.getOptions().links.distance;
      if (isNaN(distance)) {
        Logger.error("Link's distance must be a Numeric");
      } else {
        // 找到起始点的延长点
        const startExtendX = fromEnd + gap + distance;
        // 找到结束点的延长点
        const endExtendX = toX - gap - distance;
        // 起始在结束的左侧，此时直接向右画即可，否则需要画到起始延长点
        const startExtendPos = [
          Math.max(startExtendX, endExtendX),
          y + rowHeight * fromTask.flatIndex
        ];
        points.push(...startExtendPos);

        // 判断结束任务在起始任务的上下，从而绘制出延长线的转向点
        const extendY =
          rowHeight * fromTask.flatIndex +
          headerHeight +
          (fromTask.flatIndex <= toTask.flatIndex ? rowHeight : 0);
        points.push(...[startExtendPos[0], extendY]);
        points.push(...[endExtendX, extendY]);

        // 定位到结束延长点
        points.push(...[endExtendX, y + rowHeight * toTask.flatIndex]);
      }
    }

    // 终点
    points.push(...[toX - gap, y + rowHeight * toTask.flatIndex]);

    return points;
  }

  /** 生成 FF 连线 */
  private createFF(
    link: ILink,
    fromTask: Task,
    toTask: Task,
    fromX: number,
    fromEnd: number,
    toX: number,
    toEnd: number
  ) {
    const headerHeight = this.context.getOptions().header.height;
    const rowHeight = this.context.getOptions().row.height;
    const y = rowHeight / 2 + headerHeight;
    const gap: number = link.gap || this.context.getOptions().links.gap;

    // 起点
    const points: number[] = [
      fromEnd + gap,
      0.05 + y + rowHeight * fromTask.flatIndex
    ];

    // 过程点
    {
      const distance: number = link.distance
        ? parseInt(link.distance)
        : this.context.getOptions().links.distance;
      if (isNaN(distance)) {
        Logger.error("Link's distance must be a Numeric");
      } else {
        // 找到起始点的延长点
        const startExtendX = fromEnd + gap + distance;
        // 找到结束点的延长点
        const endExtendX = toEnd + gap + distance;
        // 起始在结束的左侧，此时直接向右画即可，否则需要画到起始延长点
        const startExtendPos = [
          startExtendX <= endExtendX ? endExtendX : startExtendX,
          y + rowHeight * fromTask.flatIndex
        ];
        points.push(...startExtendPos);

        // 定位到结束延长点
        points.push(
          ...[
            Math.max(endExtendX, startExtendX),
            y + rowHeight * toTask.flatIndex
          ]
        );
      }
    }

    // 终点
    points.push(...[toEnd + gap, y + rowHeight * toTask.flatIndex]);

    return points;
  }

  /** 生成 SS 连线 */
  private createSS(
    link: ILink,
    fromTask: Task,
    toTask: Task,
    fromX: number,
    fromEnd: number,
    toX: number,
    toEnd: number
  ) {
    const headerHeight = this.context.getOptions().header.height;
    const rowHeight = this.context.getOptions().row.height;
    const y = rowHeight / 2 + headerHeight;
    const gap: number = link.gap || this.context.getOptions().links.gap;

    // 起点
    const points: number[] = [
      fromX - gap,
      0.05 + y + rowHeight * fromTask.flatIndex
    ];

    // 过程点
    {
      const distance: number = link.distance
        ? parseInt(link.distance)
        : this.context.getOptions().links.distance;
      if (isNaN(distance)) {
        Logger.error("Link's distance must be a Numeric");
      } else {
        // 找到起始点的延长点
        const startExtendX = fromX - gap - distance;
        // 找到结束点的延长点
        const endExtendX = toX - gap - distance;
        // 定位起始任务的左侧极小值
        points.push(
          ...[
            Math.min(endExtendX, startExtendX),
            y + rowHeight * fromTask.flatIndex
          ]
        );

        // 定位到结束延长点
        points.push(
          ...[
            Math.min(endExtendX, startExtendX),
            y + rowHeight * toTask.flatIndex
          ]
        );
      }
    }

    // 终点
    points.push(...[toX - gap, y + rowHeight * toTask.flatIndex]);

    return points;
  }

  /** 生成 SF 连线 */
  private createSF(
    link: ILink,
    fromTask: Task,
    toTask: Task,
    fromX: number,
    fromEnd: number,
    toX: number,
    toEnd: number
  ) {
    const headerHeight = this.context.getOptions().header.height;
    const rowHeight = this.context.getOptions().row.height;
    const y = rowHeight / 2 + headerHeight;
    const gap: number = link.gap || this.context.getOptions().links.gap;

    // 起点
    const points: number[] = [
      fromX - gap,
      0.05 + y + rowHeight * fromTask.flatIndex
    ];

    // 过程点
    {
      const distance: number = link.distance
        ? parseInt(link.distance)
        : this.context.getOptions().links.distance;
      if (isNaN(distance)) {
        Logger.error("Link's distance must be a Numeric");
      } else {
        // 找到起始点的延长点
        const startExtendX = fromX - gap - distance;
        // 找到结束点的延长点
        const endExtendX = toEnd + gap + distance;
        // 取起始值与结束值的极小值
        const startExtendPos = [
          Math.min(startExtendX, endExtendX),
          y + rowHeight * fromTask.flatIndex
        ];
        points.push(...startExtendPos);

        // 判断结束任务在起始任务的上下，从而绘制出延长线的转向点
        const extendY =
          rowHeight * fromTask.flatIndex +
          headerHeight +
          (fromTask.flatIndex <= toTask.flatIndex ? rowHeight : 0);
        points.push(...[startExtendPos[0], extendY]);
        points.push(...[endExtendX, extendY]);

        // 定位到结束延长点
        points.push(...[endExtendX, y + rowHeight * toTask.flatIndex]);
      }
    }

    // 终点
    points.push(...[toEnd + gap, y + rowHeight * toTask.flatIndex]);

    return points;
  }

  /**
   * 处理连线被点击后的移动
   */
  private handleDrag(
    e: Konva.KonvaEventObject<MouseEvent>,
    link: ILink,
    type: "S" | "F",
    points: [number, number],
    id: string
  ) {
    if (!this.isDragging) return;
    if (this.context.getOptions().links.move.enabled !== true) return;

    this.stage.container().style.cursor = "pointer";
    const group = this.linksGroup.findOne(`#${id}`);

    this.templateArrow.setAttrs({
      stroke:
        link.color ||
        this.context.getOptions().links.color ||
        this.context.getOptions().primaryColor,
      strokeWidth: link.width ?? this.context.getOptions().links.width,
      pointerLength:
        link.arrow?.height ?? this.context.getOptions().links.arrow.height, // 箭头长度
      pointerWidth:
        link.arrow?.width ?? this.context.getOptions().links.arrow.width, // 箭头宽度
      fill:
        link.arrow?.color ||
        this.context.getOptions().links.arrow.color ||
        link.color ||
        this.context.getOptions().links.color ||
        this.context.getOptions().primaryColor, // 箭头填充色
      lineJoin: "round",
      dash: link.data || this.context.getOptions().links.dash
    });
    this.templateArrow.visible(false);

    // 目标位置，拼类型使用
    let target: "F" | "S" | null = null;

    const headerHeight = this.context.getOptions().header.height;
    const rowHeight = this.context.getOptions().row.height;
    const y = rowHeight / 2 + headerHeight;
    const gap: number = link.gap || this.context.getOptions().links.gap;

    let task: Task | null = null;
    const handleMouseMove = () => {
      const pos = this.stage.getPointerPosition();
      if (!pos) return;

      task = this.getTaskByPosition(pos);
      if (!task) return;

      // 判断拖拽的是 S 还是 F，也就是起始点（圆）还是结束点（箭头），另一头的位置保持不变，创建一条临时的可变的连线，并隐藏原来的连线
      this.templateArrow.visible(true);
      group?.visible(false);

      if (task?.startTime && task?.endTime) {
        const left = this.context.store
          .getTimeAxis()
          .getTimeLeft(task.startTime);
        const right = this.context.store
          .getTimeAxis()
          .getTimeLeft(task.endTime);
        const middle = (right + left) / 2 + this.offsetX;

        // 计算鼠标位置，并计算目标类型应当放在当前任务的起始位置还是结束位置
        let x = left - gap;
        if (pos.x <= middle) {
          target = "S";
        } else {
          target = "F";
          x = right + gap;
        }

        let _type: LinkType;
        if (type === 'S') {
          _type = `${target}${(link.type || 'FS')[1]}` as LinkType
        } else {
          _type = `${(link.type || "FS")[0]}${target}` as LinkType;
        }


        if (type === "S") {
          // 移动的是起始点
          const { allowLeft, allowRight } = this.isAllowStartDrop(task, link.to, _type!);

          this.templateArrow.points([
            x,
            y + rowHeight * task.flatIndex,
            ...points
          ]);

          if (!allowRight) {
            this.stage.container().style.cursor = "not-allowed";
          } else {
            this.stage.container().style.cursor = "pointer";
          }
        } else if (type === "F") {
          // 移动的是结束点
          const { allowLeft, allowRight } = this.isAllowEndDrop(task, link.from, _type!);

          this.templateArrow.points([
            ...points,
            x,
            y + rowHeight * task.flatIndex
          ]);

          if (!allowLeft) {
            this.stage.container().style.cursor = "not-allowed";
          } else {
            this.stage.container().style.cursor = "pointer";
          }
        }
      }
    };

    const handleMouseUp = () => {
      let _type: string | undefined = undefined;
      const _link = cloneDeep(link);
      if (target && task) {
        if (type === "S") {
          _type = `${target}${(link.type || "FS")[1]}`;
          _link.from = task.id;
        } else if (type === "F") {
          _type = `${(link.type || "FS")[0]}${target}`;
          _link.to = task.id;
        }
      }

      if (_type && task) {
        _link.type = _type as LinkType;
        let allowLeft = false;
        let allowRight = false;
        if (type === "S") {
          ({ allowLeft, allowRight } = this.isAllowStartDrop(task, _link.to, _link.type!, true));
        } else if (type === 'F') {
          ({ allowLeft, allowRight } = this.isAllowEndDrop(task, _link.from, _link.type!, true));
        }

        if (
          (_link.type?.slice(1) === "S" && allowLeft) ||
          (_link.type?.slice(1) === "F" && allowRight)
        ) {
          this.context.event.emit(EventName.UPDATE_LINK, _link);
          this.context.store.getLinkManager().update();
        } else {
          this.context.event.emit(EventName.ERROR, ErrorType.LINK_NOT_ALLOWED);
        }
      } else {
        this.context.event.emit(EventName.ERROR, ErrorType.TASK_NOT_FOUND);
      }

      this.cleanupTempLink();
      this.calculateLinks(task || undefined);

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleKeyEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        this.cleanupTempLink();
        // 恢复原来的连线
        group?.visible(true);

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("keydown", handleKeyEscape);
      }
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("keydown", handleKeyEscape);
  }

  /**
   * 处理连线被点击后的移动
   */
  private createLink(
    e: Konva.KonvaEventObject<MouseEvent>,
    type: "S" | "F",
    color: string,
    points: [number, number],
    from: string
  ) {
    this.stage.container().style.cursor = "pointer";

    this.templateArrow.setAttrs({
      points: [],
      stroke: color,
      strokeWidth: this.context.getOptions().links.width,
      pointerLength: this.context.getOptions().links.arrow.height, // 箭头长度
      pointerWidth: this.context.getOptions().links.arrow.width, // 箭头宽度
      fill: color,
      dash: this.context.getOptions().links.dash
    });
    this.templateArrow.visible(false);

    const linkManager = this.context.store.getLinkManager();

    // 目标位置，拼类型使用
    let target: "F" | "S" | null = null;

    const headerHeight = this.context.getOptions().header.height;
    const rowHeight = this.context.getOptions().row.height;
    const y = rowHeight / 2 + headerHeight;
    const gap: number = this.context.getOptions().links.gap;

    let task: Task | null = null;
    const handleMouseMove = () => {
      const pos = this.stage.getPointerPosition();
      if (!pos) return;

      task = this.getTaskByPosition(pos);
      if (!task) return;

      this.templateArrow.visible(true);

      if (task.startTime && task.endTime) {
        const left = this.context.store
          .getTimeAxis()
          .getTimeLeft(task.startTime);
        const right = this.context.store
          .getTimeAxis()
          .getTimeLeft(task.endTime);
        const middle = (right + left) / 2 + this.offsetX;

        // 计算鼠标位置，并计算目标类型应当放在当前任务的起始位置还是结束位置
        let x = left - gap;
        if (pos.x <= middle) {
          target = "S";
        } else {
          target = "F";
          x = right + gap;
        }

        this.templateArrow.points([
          ...points,

          x,
          y + rowHeight * task.flatIndex
        ]);

        const { allowLeft, allowRight } = this.isAllowEndDrop(task, from, linkManager.convertPointsToLinkType(type, target));

        if (target === "S" && !allowLeft) {
          this.stage.container().style.cursor = "not-allowed";
        } else if (target === "F" && !allowRight) {
          this.stage.container().style.cursor = "not-allowed";
        } else {
          this.stage.container().style.cursor = "pointer";
        }
      }
    };

    const handleMouseUp = () => {
      let _type: LinkType | undefined = undefined;
      if (target) {
        _type = linkManager.convertPointsToLinkType(type, target);
      }

      if (_type && task) {
        // 检查连线是否存在
        if (linkManager.isLinkExist(from, task.id, _type)) {
          this.context.event.emit(EventName.ERROR, ErrorType.LINK_EXIST);
        } else {
          if (!(from === task.id && type === target)) {
            const { allowLeft, allowRight } = this.isAllowEndDrop(task, from, _type, true);

            if (
              (target === "S" && allowLeft) ||
              (target === "F" && allowRight)
            ) {
              this.context.event.emit(EventName.CREATE_LINK, {
                from,
                to: task.id,
                type: _type,
                color
              });
              this.context.store.getLinkManager().update();
            } else {
              this.context.event.emit(
                EventName.ERROR,
                ErrorType.LINK_NOT_ALLOWED
              );
            }
          } else {
            this.context.event.emit(EventName.ERROR, ErrorType.LINK_SAME);
          }
        }
      }

      this.cleanupTempLink();
      this.calculateLinks(task || undefined);

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleKeyEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        this.cleanupTempLink();

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("keydown", handleKeyEscape);
      }
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("keydown", handleKeyEscape);
  }

  /**
 * 清理临时连线状态
 */
  private cleanupTempLink(): void {
    this.templateArrow.visible(false);
    this.stage.container().style.cursor = "default";
    this.isDragging = false;
  }

  /**
   * 按照位置获取任务
   */
  private getTaskByPosition(pos: { x: number; y: number }): Task | null {
    const headerHeight = this.context.getOptions().header.height;
    if (pos.y <= headerHeight) return null;

    const adjustedY = pos.y - this.offsetY;
    const flatIndex = Math.floor(
      (adjustedY - headerHeight) / this.context.getOptions().row.height
    );

    const visibleTasks = this.context.store.getDataManager().getVisibleTasks();
    return visibleTasks[flatIndex] || null;
  }

  /**
   * 检查当前连接线的起始点是否可以被连接
   */
  private isAllowStartDrop(task: Task, toId: string, linkType: LinkType, useHighlight = false) {
    let allowLeft = true;
    let allowRight = true;
    let _from = this.context.getOptions().links.create.from;
    if (isFunction(_from)) {
      _from = _from(
        task.getEmitData(),
        this.context.store.getDataManager().getTaskById(toId)!.getEmitData()
      );
    }

    if (isBoolean(_from)) {
      allowLeft = allowRight = _from;
    } else if (isString(_from)) {
      allowLeft = _from === "S";
      allowRight = _from === "F";
    }

    const res = this.validateChain(task.id, toId, linkType, useHighlight);

    return {
      allowLeft: allowLeft && res,
      allowRight: allowRight && res
    };
  }

  /**
   * 检查当前连接点的结束点是否可以被连接
   */
  private isAllowEndDrop(task: Task, fromId: string, linkType: LinkType, useHighlight = false) {
    let allowLeft = true;
    let allowRight = true;
    let _to = this.context.getOptions().links.create.to;
    if (isFunction(_to)) {
      _to = _to(
        task.getEmitData(),
        this.context.store.getDataManager().getTaskById(fromId)!.getEmitData()
      );
    }

    if (isBoolean(_to)) {
      allowLeft = allowRight = _to;
    } else if (isString(_to)) {
      allowLeft = _to === "S";
      allowRight = _to === "F";
    }

    const res = this.validateChain(fromId, task.id, linkType, useHighlight);

    return {
      allowLeft: allowLeft && res,
      allowRight: allowRight && res
    };
  }

  /**
 * 校验连线创建是否合法
 */
  private validateChain(from: string, to: string, linkType: LinkType, useHighlight = false): boolean {
    const linkManager = this.context.store.getLinkManager();

    // 校验链路
    const result = linkManager.validateLink({ from, to, type: linkType });

    if (!result.ok) {
      if (useHighlight) {
        // 特殊处理环检测
        if (result.reason === ErrorType.LINK_CYCLE && result.cycleInfo) {
          // 可以在这里添加环检测的视觉提示
          this.highlightCycleNodes(result.cycleInfo.nodes);
        }
      }

      this.context.event.emit(EventName.ERROR, result.reason);
      return false;
    }

    return true;
  }

  /**
   * 操作高亮关联线
   */
  private handleHighlight(
    group: Konva.Group,
    radius: number,
    pointerWidth: number,
    pointerLength: number,
    strokeWidth: number,
    highlight: number,
    immediate: boolean = false
  ) {
    const circle: Konva.Circle | undefined = group.findOne("Circle");
    const arrow: Konva.Arrow | undefined = group.findOne("Arrow");
    const line: Konva.Line | undefined = group.findOne("Line");

    if (circle) {
      new Konva.Tween({
        node: circle,
        radius: radius + highlight,
        duration: immediate ? 0 : 0.1
      }).play();
    }

    if (arrow) {
      new Konva.Tween({
        node: arrow,
        pointerWidth: pointerWidth + highlight,
        pointerLength: pointerLength + highlight,
        strokeWidth: strokeWidth + highlight,
        duration: immediate ? 0 : 0.1
      }).play();
    }

    if (line) {
      new Konva.Tween({
        node: line,
        strokeWidth: strokeWidth + highlight,
        duration: immediate ? 0 : 0.1
      }).play();
    }
  }

  /** 高亮创建点 */
  private highlightPoint(id: string) {
    this.handlePointHighlight(id, 1);
  }

  /** 取消高亮创建点 */
  private unhighlightPoint(id: string) {
    const opacity =
      this.context.getOptions().links.create.mode === "always" ? 0.5 : 0;

    this.handlePointHighlight(id, opacity);
  }

  /** 操作创建点的高亮 */
  private handlePointHighlight(id: string, opacity: number) {
    const left = this.pointGroup.findOne(`#point-${id}-left`);
    const right = this.pointGroup.findOne(`#point-${id}-right`);

    if (left) {
      new Konva.Tween({
        node: left,
        opacity,
        duration: 0.1
      }).play();
    }

    if (right) {
      new Konva.Tween({
        node: right,
        opacity,
        duration: 0.1
      }).play();
    }
  }

  /**
 * 高亮显示环中的节点
 */
  private highlightCycleNodes(nodeIds: string[]): void {
    // 添加环检测的视觉反馈
    nodeIds.forEach(nodeId => {
      this.context.event.emit(EventName.SLIDER_BLINK, nodeId);
    });
  }
}
