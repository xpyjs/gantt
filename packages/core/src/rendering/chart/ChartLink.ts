/*
 * @Author: JeremyJone
 * @Date: 2025-05-09 16:52:26
 * @LastEditors: JeremyJone
 * @LastEditTime: 2025-08-06 09:22:44
 * @Description: 关联线
 */
import Konva from "konva";
import { Logger } from "../../utils/logger";
import { ErrorType, EventName } from "../../event";
import { cloneDeep, isBoolean, isFunction, isString } from "lodash-es";
import { colorjs } from "../../utils/color";
import { ILink } from "@/types/link";
import { IContext } from "@/types/render";
import type { Task } from "@/models/Task";
import { parseNumberWithPercent } from "../../utils/helpers";

export class LinkGroup {
  private tasks: Task[] = [];
  // 创建点组
  private pointGroup: Konva.Group;
  // 关联线组
  private linksGroup: Konva.Group;
  // 临时箭头
  private templateArrow: Konva.Arrow;

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

    // 重新计算关联线
    this.calculateLinks();

    // 重新计算点组位置
    this.calculatePoints();
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

    // 如果需要重新计算关联线
    this.calculateLinks();

    // 重新计算点组位置
    this.calculatePoints();
  }

  /**
   * 更新数据
   */
  public update() {
    // 重新计算关联线
    this.calculateLinks();

    // 重新计算点组位置
    this.calculatePoints();
  }

  /**
   * 渲染关联线
   */
  public render(tasks: Task[]): void {
    this.tasks = tasks;

    // 使用批量绘制，减少重绘次数
    this.update();
  }

  /**
   * 销毁关联线
   */
  public destroy(): void {
    this.linksGroup.destroy();
    this.pointGroup.destroy();
    this.templateArrow.destroy();
    this.selectedMap.clear();
  }

  /**
   * 计算点组位置
   */
  private calculatePoints(): void {
    // 清除现有点组
    this.pointGroup.destroyChildren();

    // 不展示
    if (!this.context.getOptions().links.create.enabled) return;

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
      if (
        this.context.store.getOptionManager().unpackFunc(this.context.getOptions().bar.show, task) &&
        this.context.store.getDataManager().isTaskVisible(task) &&
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
  private calculateLinks(): void {
    // 清除现有关联线
    this.linksGroup.destroyChildren();

    // 不展示
    if (!this.context.getOptions().links.show) return;

    // 获取数据
    const links = this.context.getOptions().links.data;
    const rowHeight = this.context.getOptions().row.height;

    // 先清除已不存在但选中的内容
    const exists: string[] = [];
    links.forEach(link => {
      const id = this.createId(link);
      if (this.selectedMap.has(id)) {
        exists.push(id);
      }
    });
    this.selectedMap.forEach((_, id) => {
      if (!exists.includes(id)) {
        this.selectedMap.delete(id);
      }
    });

    // 然后重新创建 links
    links.forEach(link => {
      const fromTask = this.context.store.getDataManager().getTaskById(link.from);
      const toTask = this.context.store.getDataManager().getTaskById(link.to);

      if (!fromTask) {
        Logger.warn(
          `No corresponding FROM task [${link.from}] was found for the link. Info:`,
          link
        );
      }

      if (!toTask) {
        Logger.warn(
          `No corresponding TO task [${link.to}] was found for the link. Info:`,
          link
        );
      }

      if (
        fromTask &&
        this.context.store.getOptionManager().unpackFunc(this.context.getOptions().bar.show, fromTask) &&
        this.context.store.getDataManager().isTaskVisible(fromTask) &&
        fromTask.startTime &&
        fromTask.endTime &&
        toTask &&
        this.context.store.getOptionManager().unpackFunc(this.context.getOptions().bar.show, toTask) &&
        this.context.store.getDataManager().isTaskVisible(toTask) &&
        toTask.startTime &&
        toTask.endTime
      ) {
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
            points = this.createFF(
              link,
              fromTask,
              toTask,
              fromX,
              fromEnd,
              toX,
              toEnd
            );
            break;
          case "SS":
            points = this.createSS(
              link,
              fromTask,
              toTask,
              fromX,
              fromEnd,
              toX,
              toEnd
            );
            break;
          case "SF":
            points = this.createSF(
              link,
              fromTask,
              toTask,
              fromX,
              fromEnd,
              toX,
              toEnd
            );
            break;
          case "FS":
          default:
            points = this.createFS(
              link,
              fromTask,
              toTask,
              fromX,
              fromEnd,
              toX,
              toEnd
            );
        }

        if (points.length <= 2) {
          Logger.warn(`The link position has some error.`, link);
        } else {
          const id = this.createId(link);
          const radius: number =
            link.radius ?? this.context.getOptions().links.radius; // 圆点半径
          const pointerWidth: number =
            link.arrow?.width ?? this.context.getOptions().links.arrow.width; // 箭头宽度
          const pointerLength: number =
            link.arrow?.height ?? this.context.getOptions().links.arrow.height; // 箭头长度
          const strokeWidth: number =
            link.width ?? this.context.getOptions().links.width; // 线条宽度

          const group = new Konva.Group({ id });

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

          circle.on("mousedown", e => {
            this.handleDrag(
              e,
              link,
              "S",
              [points[points.length - 2], points[points.length - 1]],
              id
            );
          });

          const arrow = new Konva.Arrow({
            points,
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
            hitStrokeWidth: 10 // 增加点击区域
          });
          group.add(arrow);

          arrow.on("mousedown", e => {
            this.handleDrag(e, link, "F", [points[0], points[1]], id);
          });

          this.linksGroup.add(group);

          group.on("mouseover", e => {
            e.target.moveToTop();
            this.stage.container().style.cursor = "pointer";
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
            e.target.moveToTop();

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
            } else if (e.evt.button === 2) {
              // 右键点击
              this.context.event.emit(EventName.CONTEXT_LINK, e.evt, link);
            }
          });

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
  }

  private createId(link: ILink) {
    return `link-group-${link[this.context.getOptions().links.key]}-${link.from
      }-${link.to}-${link.type || "FS"}`;
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

      const { allowLeft, allowRight } = this.isAllowDrop(task, link.from);

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

        if (type === "S") {
          // 移动的是起始点
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

      if (
        _type &&
        task &&
        !(_link.from === _link.to && ["FF", "SS"].includes(_type))
      ) {
        const { allowLeft, allowRight } = this.isAllowDrop(task, _link.from);
        _link.type = _type as ILink["type"];
        if (
          (_link.type?.slice(1) === "S" && allowLeft) ||
          (_link.type?.slice(1) === "F" && allowRight)
        ) {
          this.context.event.emit(EventName.UPDATE_LINK, _link);
        } else {
          this.context.event.emit(EventName.ERROR, ErrorType.LINK_NOT_ALLOWED);
          this.calculateLinks();
        }
      } else {
        this.context.event.emit(EventName.ERROR, ErrorType.LINK_SAME);
        this.calculateLinks();
      }

      this.templateArrow.visible(false);

      this.stage.container().style.cursor = "default";
      this.isDragging = false;

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
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

      const { allowLeft, allowRight } = this.isAllowDrop(task, from);

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
      let _type: string | undefined = undefined;
      if (target) {
        _type = `${type}${target}`;
      }

      if (_type && task) {
        // 检查连线是否存在
        if (
          this.context.getOptions().links.data.some(link => {
            return (
              link.from === from && link.to === task!.id && link.type === _type
            );
          })
        ) {
          this.context.event.emit(EventName.ERROR, ErrorType.LINK_EXIST);
        } else {
          if (!(from === task.id && type === target)) {
            const { allowLeft, allowRight } = this.isAllowDrop(task, from);

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

      this.templateArrow.visible(false);

      this.stage.container().style.cursor = "default";
      this.isDragging = false;

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
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
   * 检查当前连接点是否可以被创建
   */
  private isAllowDrop(task: Task, fromId: string) {
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

    return {
      allowLeft,
      allowRight
    };
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
}
