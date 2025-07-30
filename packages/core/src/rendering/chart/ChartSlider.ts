import Konva from "konva";
import {
  clamp,
  formatNumber,
  getStandardCornerRadius,
  getStandardPercent,
  getStandardValue,
  parseNumberWithPercent,
  svgToImage
} from "../../utils/helpers";
import { EventName } from "../../event";
import { colorjs } from "../../utils/color";
import { isFunction } from "lodash-es";
import { IContext } from "@/types/render";
import type { Task } from "@/models/Task";
import { EmitData } from "@/types";

const HandlerIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M5.5 4.625a1.125 1.125 0 1 0 0-2.25a1.125 1.125 0 0 0 0 2.25m4 0a1.125 1.125 0 1 0 0-2.25a1.125 1.125 0 0 0 0 2.25M10.625 7.5a1.125 1.125 0 1 1-2.25 0a1.125 1.125 0 0 1 2.25 0M5.5 8.625a1.125 1.125 0 1 0 0-2.25a1.125 1.125 0 0 0 0 2.25m5.125 2.875a1.125 1.125 0 1 1-2.25 0a1.125 1.125 0 0 1 2.25 0M5.5 12.625a1.125 1.125 0 1 0 0-2.25a1.125 1.125 0 0 0 0 2.25" clip-rule="evenodd"/></svg>';

export class ChartSlider {
  private offsetX: number = 0;
  private offsetY: number = 0;

  public sliderGroup: Konva.Group;
  private slider!: Konva.Group;
  private sliderBg!: Konva.Rect;

  private leftHandleGroup: Konva.Group | null = null;
  private rightHandleGroup: Konva.Group | null = null;
  private progressGroup: Konva.Group | null = null;

  private handlerWidth = 10;

  // 自动滚动相关变量
  private autoMoveTimer: number | null = null;
  private autoScrollTimer: number | null = null;
  private autoExpandTimer: number | null = null;
  private readonly EDGE_THRESHOLD = 20; // 边缘检测阈值，单位px
  private readonly SCROLL_STEP = 5; // 每次滚动的步长，单位px
  private readonly MOVE_INTERVAL = 1000 / 60; // 移动间隔，单位ms，约60fps
  private readonly AUTO_EXPAND_INTERVAL = 500; // 自动扩展间隔，单位ms

  // 拖拽状态变量
  private isDragging = false;
  private draggingDirection: "left" | "right" | "none" = "none";

  // 记录拖拽时的原始数据
  private oldTasks: Task[] = [];

  constructor(
    private context: IContext,
    private x: number,
    private y: number,
    private task: Task,
    private rowWidth: number
  ) {
    this.sliderGroup = new Konva.Group({
      x,
      y,
      id: `chart-slider-bar-${task.id}`
    });

    this.render();
    this.bindEvents();
  }

  public update(x: number, y: number) {
    this.x = x;
    this.y = y;

    this.sliderGroup.position({ x, y });
    this.render();
  }

  public setOffset(x: number, y: number) {
    this.offsetX = x;
    this.offsetY = y;
  }

  /** 太多需要 function 的判断，搞一个统一的转换 */
  private unpackFunc<T>(val: T | ((data: EmitData) => T)) {
    if (isFunction(val)) {
      return val(this.task.getEmitData());
    }
    return val;
  }

  private render() {
    if (!this.task.startTime || !this.task.endTime) return;

    // 计算位置
    const rowHeight = this.context.getOptions().row.height;
    const height = parseNumberWithPercent(
      this.unpackFunc(this.context.getOptions().bar.height),
      rowHeight
    );

    const y = (rowHeight - height) / 2;
    const x = this.context.store.getTimeAxis().getTimeLeft(this.task.startTime);
    const end = this.context.store.getTimeAxis().getTimeLeft(this.task.endTime);
    const sliderWidth = end - x;

    // 获取一些属性
    const fill = this.unpackFunc(this.context.getOptions().bar.backgroundColor) || this.context.getOptions().primaryColor;
    const cornerRadius = getStandardCornerRadius(
      this.unpackFunc(this.context.getOptions().bar.radius)
    );

    // 生成任务条主体，并设置拖拽
    if (!this.slider) {
      this.slider = new Konva.Group({
        dragBoundFunc: pos => {
          let min = 0;
          let max = Math.abs(this.rowWidth - this.slider.width());

          // 严格父级模式下，移动时需要判定不能超过父级边界
          const parent = this.context.getOptions().bar.move.link.parent;
          if (parent === "strict" && this.task.parent) {
            if (this.task.parent.startTime) {
              const parentStart = this.task.parent.startTime;
              const parentLeft = this.context.store
                .getTimeAxis()
                .getTimeLeft(parentStart);
              min = parentLeft;
            }
            if (this.task.parent.endTime) {
              const parentEnd = this.task.parent.endTime;
              const parentRight = this.context.store
                .getTimeAxis()
                .getTimeLeft(parentEnd);
              max = Math.abs(parentRight - this.slider.width());
            }
          }
          return {
            x: clamp(pos.x, min, max),
            y: this.y + y + this.offsetY
          };
        }
      });
    }
    this.slider.position({ x, y });
    this.slider.size({ width: sliderWidth, height });
    const draggable = !!this.unpackFunc(this.context.getOptions().bar.move.enabled);
    this.slider.draggable(draggable);
    if (draggable) {
      this.slider.on("pointerover", e => {
        if (!this.isDragging) {
          e.target.getStage()!.container().style.cursor = "grab";
        }
      });
      this.slider.on("pointerout", e => {
        if (!this.isDragging) {
          e.target.getStage()!.container().style.cursor = "default";
        }
      });
    }

    // 滑块背景
    if (!this.sliderBg) {
      this.sliderBg = new Konva.Rect({
        x: 0,
        y: 0
      });
      this.slider.add(this.sliderBg);
    }
    this.sliderBg.setAttrs({
      width: sliderWidth,
      height,
      fill,
      cornerRadius: cornerRadius,
      shadowColor: this.unpackFunc(this.context.getOptions().bar.shadowColor),
      shadowBlur: this.unpackFunc(this.context.getOptions().bar.shadowBlur),
      shadowOffsetX: this.unpackFunc(this.context.getOptions().bar.shadowOffsetX),
      shadowOffsetY: this.unpackFunc(this.context.getOptions().bar.shadowOffsetY)
    });

    this.renderProgress(sliderWidth, height);

    const resizeIcon = this.context.getOptions().bar.move.single?.icon;
    const singleColor = this.context.getOptions().bar.move.single?.backgroundColor;
    const resizeColor = singleColor ?
      colorjs(singleColor).alpha(this.context.getOptions().bar.move.single?.opacity ?? 1).toHex() :
      colorjs(fill)
        .brighten(30 * (!!this.unpackFunc(this.context.getOptions().bar.progress?.show) ? -1 : 1))
        .alpha(this.context.getOptions().bar.move.single?.opacity ?? 1)
        .toHex();
    // 渲染左右拖拽按钮
    const moveLeft = !!this.unpackFunc(this.context.getOptions().bar.move.single?.left);
    if (moveLeft) {
      if (!this.leftHandleGroup) {
        this.leftHandleGroup = new Konva.Group({
          x: 0,
          y: 0,
          opacity: 0
        });
        this.slider.add(this.leftHandleGroup);
        this.leftHandleGroup.on("mousedown", e => {
          this.resizeMove(e, "left");
        });
        this.leftHandleGroup.on("pointerover", e => {
          setTimeout(() => {
            e.target.getStage()!.container().style.cursor = "ew-resize";
          }, 0);
        });
        this.leftHandleGroup.on("pointerout", e => {
          if (!this.isDragging) {
            e.target.getStage()!.container().style.cursor = "default";
          }
        });

        const leftHandler = new Konva.Rect({
          x: 0,
          y: 0,
        });
        this.leftHandleGroup.add(leftHandler);

        if (resizeIcon !== null) {
          svgToImage(resizeIcon || HandlerIcon, this.handlerWidth, height).then(image => {
            const icon = new Konva.Image({
              image,
              x: 0,
              y: (height - this.handlerWidth) / 2,
              width: this.handlerWidth,
              height: this.handlerWidth
            });
            this.leftHandleGroup?.add(icon);
          })
        }
      }

      this.leftHandleGroup.findOne("Rect")?.setAttrs({
        width: this.handlerWidth,
        height: height,
        fill: resizeColor,
        cornerRadius: [cornerRadius[0], 0, 0, cornerRadius[3]]
      });
      this.leftHandleGroup.findOne("Image")?.setAttrs({
        x: 0,
        y: (height - this.handlerWidth) / 2,
        width: this.handlerWidth,
        height: this.handlerWidth
      });
    } else if (this.leftHandleGroup) {
      // 如果不需要左侧拖拽按钮，移除它
      this.leftHandleGroup.remove();
      this.leftHandleGroup = null;
    }

    // 右侧拖拽按钮
    const moveRight = !!this.unpackFunc(this.context.getOptions().bar.move.single?.right);
    if (moveRight) {
      if (!this.rightHandleGroup) {
        this.rightHandleGroup = new Konva.Group({
          x: 0,
          y: 0,
          opacity: 0
        });
        this.slider.add(this.rightHandleGroup);
        this.rightHandleGroup.on("mousedown", e => {
          this.resizeMove(e, "right");
        });
        this.rightHandleGroup.on("pointerover", e => {
          setTimeout(() => {
            e.target.getStage()!.container().style.cursor = "ew-resize";
          }, 0);
        });
        this.rightHandleGroup.on("pointerout", e => {
          if (!this.isDragging) {
            e.target.getStage()!.container().style.cursor = "default";
          }
        });

        const rightHandler = new Konva.Rect({
          x: 0,
          y: 0,
        });
        this.rightHandleGroup.add(rightHandler);

        if (resizeIcon !== null) {
          svgToImage(resizeIcon || HandlerIcon, this.handlerWidth, height).then(image => {
            const icon = new Konva.Image({
              image,
              x: sliderWidth - this.handlerWidth,
              y: (height - this.handlerWidth) / 2,
              width: this.handlerWidth,
              height: this.handlerWidth
            });
            this.rightHandleGroup?.add(icon);
          })
        }
      }
      this.rightHandleGroup.findOne("Rect")?.setAttrs({
        x: sliderWidth - this.handlerWidth,
        width: this.handlerWidth,
        height: height,
        fill: resizeColor,
        cornerRadius: [0, cornerRadius[1], cornerRadius[2], 0]
      });
      this.rightHandleGroup.findOne("Image")?.setAttrs({
        x: sliderWidth - this.handlerWidth,
        y: (height - this.handlerWidth) / 2,
        width: this.handlerWidth,
        height: this.handlerWidth
      });
    } else if (this.rightHandleGroup) {
      // 如果不需要右侧拖拽按钮，移除它
      this.rightHandleGroup.remove();
      this.rightHandleGroup = null;
    }

    this.renderText(sliderWidth, height);

    this.sliderGroup.add(this.slider);
    this.leftHandleGroup?.moveToTop();
    this.rightHandleGroup?.moveToTop();

    if (this.unpackFunc(this.context.getOptions().bar.show) === false) {
      this.sliderGroup.hide();
    } else {
      this.sliderGroup.show();
    }
  }

  private renderText(width: number, height: number) {
    const id = `chart-slider-text-${this.task.id}`;
    const clearText = () => {
      if (this.slider.find(`#${id}`)) {
        this.slider.find(`#${id}`).forEach(text => text.remove());
      }
    };

    if (
      !this.context.getOptions().bar.field &&
      !this.context.getOptions().bar.label
    ) {
      clearText();
      return;
    }

    const _label = this.context.getOptions().bar.label;
    let content = "";
    if (_label) {
      content = this.unpackFunc(_label);
    } else if (this.context.getOptions().bar.field) {
      content = this.task.getField(this.context.getOptions().bar.field!);
    }

    clearText();

    // 渲染文本
    const textWidth =
      width -
      (this.leftHandleGroup ? this.handlerWidth : 0) -
      (this.rightHandleGroup ? this.handlerWidth : 0);
    if (textWidth > 20) {
      // 太短不展示文本
      const text = new Konva.Text({
        id: id,
        x: this.leftHandleGroup ? 10 : 0,
        y: 0,
        width: textWidth,
        height,
        padding: 10,
        text: content,
        fill: this.unpackFunc(this.context.getOptions().bar.color) || "#000",
        fontSize: this.unpackFunc(this.context.getOptions().bar.fontSize) || 12,
        fontFamily: this.unpackFunc(this.context.getOptions().bar.fontFamily) || "Arial",
        align: this.unpackFunc(this.context.getOptions().bar.align),
        verticalAlign: this.unpackFunc(this.context.getOptions().bar.verticalAlign) || "middle",
        ellipsis: true
      });
      this.slider.add(text);
    }
  }

  private renderProgress(width: number, height: number) {
    if (!this.unpackFunc(this.context.getOptions().bar.progress?.show)) {
      if (this.progressGroup) {
        this.progressGroup.destroy();
        this.progressGroup = null;
      }
      return;
    }

    if (this.task.progress) {
      const progressVal = getStandardPercent(
        this.task.progress,
        this.context.getOptions().bar.progress?.targetVal ?? 100
      );
      if (progressVal === 0) return;

      const barBC = this.unpackFunc(
        this.context.getOptions().bar.backgroundColor
      ) || this.context.getOptions().primaryColor;

      const bg =
        this.unpackFunc(this.context.getOptions().bar.progress?.backgroundColor) ||
        colorjs(barBC)
          .brighten(this.context.getOptions().bar.progress?.amount || 30)
          .toHex();

      const bgCornerRadius = getStandardCornerRadius(
        this.unpackFunc(this.context.getOptions().bar.radius)
      );
      const progressCornerRadius = getStandardCornerRadius(
        this.unpackFunc(this.context.getOptions().bar.progress?.radius),
        2 // 默认 2
      );
      // 左侧永远继承背景圆角
      progressCornerRadius[0] = bgCornerRadius[0];
      progressCornerRadius[3] = bgCornerRadius[3];

      // 右侧如果 100%，则使用背景圆角
      if (progressVal === 1) {
        progressCornerRadius[1] = bgCornerRadius[1];
        progressCornerRadius[2] = bgCornerRadius[2];
      }

      const progressWidth = width * progressVal;

      if (!this.progressGroup) {
        // 创建进度条
        this.progressGroup = new Konva.Group({
          x: 0,
          y: 0,
          width: progressWidth,
          height: height,
          listening: false
        });

        this.slider.add(this.progressGroup);
      } else {
        // 更新进度条宽度
        this.progressGroup.width(progressWidth);
        this.progressGroup.destroyChildren();
      }

      const progress = new Konva.Rect({
        x: 0,
        y: 0,
        width: progressWidth,
        height: height,
        fill: bg,
        cornerRadius: progressCornerRadius,
        opacity: this.unpackFunc(this.context.getOptions().bar.progress?.opacity)
      });
      this.progressGroup.add(progress);

      const progressText = `${formatNumber(
        progressVal * 100,
        this.context.getOptions().bar.progress?.decimal
      )}%`;
      const textWidth = new Konva.Text().measureSize(progressText).width;
      const textAlign = this.unpackFunc(this.context.getOptions().bar.progress?.textAlign);
      const text = new Konva.Text({
        x: 0,
        y:
          textAlign === "top"
            ? -height
            : 0,
        width:
          textAlign === "right"
            ? progressWidth + textWidth
            : Math.max(progressWidth, textWidth),
        height: height,
        fill:
          this.unpackFunc(this.context.getOptions().bar.progress?.color) ||
          colorjs("#000000").mix(bg, 50).alpha(0.7).toHex(),
        text: progressText,
        fontSize: this.unpackFunc(this.context.getOptions().bar.progress?.fontSize) || 10,
        fontStyle: this.unpackFunc(this.context.getOptions().bar.progress?.fontStyle) || "italic",
        fontFamily: "Arial",
        verticalAlign:
          textAlign === "top"
            ? "bottom"
            : "middle",
        align: "right"
      });

      this.progressGroup?.add(text);
    }
  }

  // 绑定事件，包括拖拽和边缘检测
  private bindEvents() {
    if (!this.slider) return;

    this.slider.on("dragstart", e => this.handleDragStart(e));
    this.slider.on("dragend", e => this.handleDragEnd(e));
    this.slider.on("dragmove", e => this.handleDragMove(e));

    this.slider.on("pointerover", () => this.handleMouseEnter());
    this.slider.on("pointerout", () => this.handleMouseLeave());

    this.slider.on("click", e => {
      if (e.evt.button !== 0) return; // 只处理左键点击
      e.cancelBubble = true; // 阻止事件冒泡

      this.isDragging = false; // 点击时重置拖拽状态
      this.context.event.emit(EventName.SLIDER_CLICK, e.evt, this.task);
    });
    this.slider.on("contextmenu", e => {
      e.cancelBubble = true; // 阻止事件冒泡
      e.evt.stopPropagation(); // 阻止事件传播
      e.evt.preventDefault(); // 阻止默认右键菜单

      this.context.event.emit(EventName.SLIDER_CONTEXTMENU, e.evt, this.task);
    });
    this.slider.on("dblclick", e => {
      if (e.evt.button !== 0) return; // 只处理左键双击
      e.cancelBubble = true; // 阻止事件冒泡

      this.context.event.emit(EventName.SLIDER_DBL_CLICK, e.evt, this.task);
    });
  }

  /**
   * 移动后更新任务时间
   */
  private emitUpdate(direction: "left" | "right" | "both") {
    let start = this.task.startTime!.clone();
    let end = this.task.endTime!.clone();
    if (direction !== "right") {
      start = this.context.store.getTimeAxis().getTimeByLeft(this.slider.x());
    }
    if (direction !== "left") {
      end = this.context.store
        .getTimeAxis()
        .getTimeByLeft(this.slider.x() + this.slider.width());
    }

    if (
      !start?.isSame(this.task.startTime) ||
      !end?.isSame(this.task.endTime)
    ) {
      this.context.store
        .getDataManager()
        .updateTaskTime(this.task, start, end, direction, this.oldTasks);
    }
  }

  private handleDragStart(e: Konva.KonvaEventObject<MouseEvent>) {
    const stage = e.target.getStage();
    if (!stage) return;

    this.isDragging = true;
    this.oldTasks = [];
    this.context.event.emit(EventName.SLIDER_MOVING, true);
    stage.container().style.cursor = "grabbing";

    this.handleMove(e, stage);
  }

  private handleDragMove(e: Konva.KonvaEventObject<MouseEvent>) {
    if (!this.isDragging) return;

    // 记录拖拽方向
    if (e.evt.movementX > 0) {
      this.draggingDirection = "right";
    } else if (e.evt.movementX < 0) {
      this.draggingDirection = "left";
    }

    const moveStep = !!this.context.getOptions().bar.move.byUnit;
    if (moveStep) {
      const currentX = e.target.x();
      const cellWidth = this.context.store.getTimeAxis().getCellWidth();
      const standardValue = getStandardValue(currentX, cellWidth);
      e.target.x(standardValue);
    }
  }

  private handleDragEnd(e: Konva.KonvaEventObject<MouseEvent>) {
    this.stopAutoMove();
    this.stopAutoScroll();
    this.stopAutoExpand();
    this.isDragging = false;
    this.draggingDirection = "none"; // 重置拖拽方向
    e.target.getStage()!.container().style.cursor = "default";

    if (this.oldTasks.length > 0) {
      this.context.event.emit(
        EventName.TASK_DRAG_END,
        this.task,
        this.oldTasks
      );
      this.oldTasks = [];
    }

    this.context.event.emit(EventName.SLIDER_MOVING, false);
  }

  private handleMove(
    e: Konva.KonvaEventObject<MouseEvent>,
    stage: Konva.Stage
  ) {
    // 获取当前视图的坐标范围
    const stageWidth = stage.width();

    // 获取移动参数
    const dragLock = !!this.context.getOptions().bar.move.lock;
    const moveStep = !!this.context.getOptions().bar.move.byUnit;
    const cellWidth = this.context.store.getTimeAxis().getCellWidth();

    this.autoMoveTimer = window.setInterval(() => {
      // 获取当前任务条的属性
      const sliderWidth = e.target.width();
      const sliderLeft = e.target.x() - this.offsetX;
      const sliderRight = sliderLeft + sliderWidth;

      const viewportLeft = -this.offsetX; // 视图的左侧边界（绝对坐标）
      const viewportRight = viewportLeft + stageWidth; // 视图的右侧边界（绝对坐标）

      // 判断是否触碰边界
      const isTouchingLeftEdge =
        sliderLeft <= viewportLeft - this.offsetX + this.EDGE_THRESHOLD;
      const isTouchingRightEdge =
        sliderRight >= viewportRight - this.offsetX - this.EDGE_THRESHOLD;

      if (isTouchingLeftEdge) {
        if (viewportLeft <= 0) {
          e.target.x(0); // 顶到最左边，直接贴边
          this.stopAutoScroll();
          if (!dragLock) {
            if (this.draggingDirection === "left") {
              // 顶到最左边，继续滚动
              this.startAutoExpand("left");
            } else {
              // 停止向左滚动
              this.stopAutoExpand();
            }
          }
        } else {
          if (this.draggingDirection === "left") {
            // 向左滚动
            const step = moveStep ? -cellWidth : -this.SCROLL_STEP;
            this.startAutoScroll(step, moveStep, () => {
              e.target.x(e.target.x() + step);
            });
          } else {
            this.stopAutoScroll();
          }
        }
      } else if (isTouchingRightEdge) {
        if (viewportRight >= this.context.store.getTimeAxis().getTotalWidth()) {
          // 顶到最右边，停止滚动
          e.target.x(
            this.context.store.getTimeAxis().getTotalWidth() - sliderWidth
          );
          this.stopAutoScroll();
          if (!dragLock) {
            // 顶到最右边，继续滚动
            if (this.draggingDirection === "right") {
              // 继续向右滚动
              this.startAutoExpand("right");
            } else {
              // 停止向右滚动
              this.stopAutoExpand();
            }
          }
        } else {
          if (this.draggingDirection === "right") {
            // 向右滚动
            const step = moveStep ? cellWidth : this.SCROLL_STEP;
            this.startAutoScroll(step, moveStep, () => {
              e.target.x(e.target.x() + step);
            });
          } else {
            this.stopAutoScroll();
          }
        }
      } else {
        // 普通移动（在视图内）
        this.stopAutoExpand();
        this.stopAutoScroll();
      }

      this.emitUpdate("both");
    }, this.MOVE_INTERVAL);
  }

  // 左右操作拖拽
  private resizeMove(
    e: Konva.KonvaEventObject<MouseEvent>,
    direction: "left" | "right"
  ) {
    e.cancelBubble = true;

    const stage = e.target.getStage();
    if (!stage) return;
    this.isDragging = true;
    this.context.event.emit(EventName.SLIDER_MOVING, true);

    let startX = stage.getPointerPosition()?.x || 0;
    const moveStep = !!this.context.getOptions().bar.move.byUnit;
    const cellWidth = this.context.store.getTimeAxis().getCellWidth();
    const dragLock = !!this.context.getOptions().bar.move.lock;
    const stageWidth = stage.width();

    // 移动时使用，贴边需要重置值
    let leftScrollDiff = 0;
    let rightScrollDiff = 0;

    this.autoMoveTimer = window.setInterval(() => {
      // 获取当前任务条的属性
      const sliderWidth = this.slider.width();
      const sliderLeft = this.slider.x(); // 任务条的绝对左侧位置
      const sliderRight = sliderLeft + sliderWidth; // 任务条的绝对右侧位置

      // 获取当前视图的坐标范围
      const viewportLeft = -this.offsetX; // 视图的左侧边界（绝对坐标）
      const viewportRight = viewportLeft + stageWidth; // 视图的右侧边界（绝对坐标）

      // 判断是否触碰边界
      const isTouchingLeftEdge =
        sliderLeft <= viewportLeft + this.EDGE_THRESHOLD;
      const isTouchingRightEdge =
        sliderRight >= viewportRight - this.EDGE_THRESHOLD;

      // 正常移动左侧，并且贴左侧边
      if (isTouchingLeftEdge && direction === "left") {
        if (viewportLeft <= 0) {
          this.slider.x(0); // 顶到最左边，直接贴边
          this.stopAutoScroll();
          if (!dragLock) {
            if (this.draggingDirection === "left") {
              // 顶到最左边，继续滚动
              this.startAutoExpand("left");
            } else {
              // 停止向左滚动
              this.stopAutoExpand();
            }
          }
        } else {
          if (this.draggingDirection === "left") {
            // 向左滚动
            const step = moveStep ? -cellWidth : -this.SCROLL_STEP;
            this.startAutoScroll(step, moveStep, () => {
              leftScrollDiff += step;
              this.slider.x(this.slider.x() + step);
            });
          } else {
            this.stopAutoScroll();
          }
        }

        this.emitUpdate("left");
      } else if (isTouchingRightEdge && direction === "right") {
        // 正常移动右侧，并且贴右侧边
        if (viewportRight >= this.context.store.getTimeAxis().getTotalWidth()) {
          // 顶到最右边，停止滚动
          this.slider.width(
            this.context.store.getTimeAxis().getTotalWidth() - this.slider.x()
          );
          this.stopAutoScroll();
          if (!dragLock) {
            // 顶到最右边，继续滚动
            if (this.draggingDirection === "right") {
              // 继续向右滚动
              this.startAutoExpand("right");
            } else {
              // 停止向右滚动
              this.stopAutoExpand();
            }
          }
        } else {
          if (this.draggingDirection === "right") {
            // 向右滚动
            const step = moveStep ? cellWidth : this.SCROLL_STEP;
            this.startAutoScroll(step, moveStep, () => {
              rightScrollDiff += step;
              this.slider.x(this.slider.x() + step);
            });
          } else {
            this.stopAutoScroll();
          }
        }

        this.emitUpdate("right");
      } else if (
        direction === "right" &&
        sliderLeft <= viewportLeft &&
        sliderRight <= viewportLeft + this.EDGE_THRESHOLD + cellWidth
      ) {
        // 右侧向左移动，且左侧超出左侧视图：滚动，但是移动的还是左侧
        const step = moveStep ? -cellWidth : -this.SCROLL_STEP;
        this.startAutoScroll(step, moveStep, () => {
          rightScrollDiff += step;
          this.slider.width(Math.max(this.slider.width(), cellWidth));
          if (this.slider.width() > cellWidth) {
            this.slider.x(this.slider.x() + step);
          }

          this.emitUpdate("right");
        });
      } else if (
        direction === "left" &&
        sliderRight >= viewportRight &&
        sliderLeft >= viewportRight - this.EDGE_THRESHOLD - cellWidth
      ) {
        // 左侧向右移动，且右侧超出右侧视图：滚动，但是移动的还是右侧
        const step = moveStep ? cellWidth : this.SCROLL_STEP;
        this.startAutoScroll(step, moveStep, () => {
          leftScrollDiff += step;
          this.slider.width(Math.max(this.slider.width(), cellWidth));
          if (this.slider.width() > cellWidth) {
            this.slider.x(this.slider.x() + step);
          }

          this.emitUpdate("left");
        });
      } else {
        // 普通移动（在视图内）
        this.stopAutoExpand();
        this.stopAutoScroll();
      }
    }, this.MOVE_INTERVAL);

    let lastX: undefined | number = undefined;
    const targetStartX = this.slider.x();
    const targetStartWidth = this.slider.width();
    const handleMouseMove = (e: MouseEvent) => {
      // 记录拖拽方向
      if (e.movementX > 0) {
        this.draggingDirection = "right";
      } else if (e.movementX < 0) {
        this.draggingDirection = "left";
      }

      const currentX = Math.max(stage.getPointerPosition()?.x || 0, 0);
      let diffX = currentX - startX;
      if (moveStep) {
        diffX = getStandardValue(diffX, cellWidth);
      }

      if (lastX === undefined || lastX !== diffX) {
        if (direction === "left") {
          if (targetStartWidth - diffX - leftScrollDiff >= cellWidth) {
            if (currentX < stageWidth - this.EDGE_THRESHOLD) {
              this.slider.width(targetStartWidth - diffX - leftScrollDiff);
              this.slider.x(targetStartX + diffX + leftScrollDiff);
              this.emitUpdate("left");
            }
          }
        } else {
          if (targetStartWidth + diffX + rightScrollDiff >= cellWidth) {
            if (currentX > this.EDGE_THRESHOLD) {
              this.slider.width(targetStartWidth + diffX + rightScrollDiff);
              this.emitUpdate("right");
            }
          }
        }
        lastX = diffX;
      }
    };

    const handleMouseUp = () => {
      this.handleDragEnd(e);

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  // 开始自动扩展
  private startAutoExpand(direction: "left" | "right") {
    if (this.autoExpandTimer) return;

    const timeAxis = this.context.store.getTimeAxis();
    this.autoExpandTimer = window.setInterval(() => {
      timeAxis.expand(direction, 1);
      this.context.event.emit(EventName.CHART_OFFSET_CHANGE);

      if (direction === "left") {
        this.slider.x(0); // 向左时，每次移动后任务条会刷新到第二格。手动贴边，触发继续移动
      } else {
        // 向右不会有问题
      }
    }, this.AUTO_EXPAND_INTERVAL);
  }

  // 开始自动滚动
  private startAutoScroll(offsetX: number, moveStep: boolean, cb?: () => void) {
    if (this.autoScrollTimer) return;

    const scrollbar = this.context.getScrollbar();
    if (!scrollbar) return;

    this.autoScrollTimer = window.setInterval(
      () => {
        const pos = scrollbar.getScrollPosition();
        scrollbar.scrollTo({ x: pos.x + offsetX, y: pos.y }, "drag");
        cb?.();
      },
      moveStep ? 300 : this.MOVE_INTERVAL
    );
  }

  // 停止自动移动
  private stopAutoMove() {
    if (this.autoMoveTimer) {
      clearInterval(this.autoMoveTimer);
      this.autoMoveTimer = null;
    }
  }

  // 停止自动滚动
  private stopAutoScroll() {
    if (this.autoScrollTimer) {
      clearInterval(this.autoScrollTimer);
      this.autoScrollTimer = null;
    }
  }

  // 停止自动扩展
  private stopAutoExpand() {
    if (this.autoExpandTimer) {
      clearInterval(this.autoExpandTimer);
      this.autoExpandTimer = null;
    }
  }

  // 鼠标进入
  private handleMouseEnter() {
    this.handleResizeHighlight(1);
  }

  // 鼠标离开
  private handleMouseLeave() {
    this.handleResizeHighlight(0);
  }

  // 拖拽块的高亮动画
  private handleResizeHighlight(opacity: number) {
    if (this.leftHandleGroup) {
      new Konva.Tween({
        node: this.leftHandleGroup,
        opacity,
        duration: 0.2
      }).play();
    }
    if (this.rightHandleGroup) {
      new Konva.Tween({
        node: this.rightHandleGroup,
        opacity,
        duration: 0.2
      }).play();
    }
  }
}
