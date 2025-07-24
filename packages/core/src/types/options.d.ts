import { EmitData } from ".";
import { IChartOptions } from "./chart";
import { ILink } from "./link";
import { IPattern } from "./styles";
import { ITableOptions } from "./table";

export type XGanttUnit = "hour" | "day" | "week" | "month" | "quarter";

export interface IGanttOptions {
  /** 日志 level。 默认 info */
  logLevel?: "debug" | "info" | "warn" | "error" | "none";

  /** 源数据 */
  data: any[];

  /** 关联配置 */
  links: {
    /**
     * 关联数据集合
     *
     * - 每一条数据都需要指定自己的 key 作为唯一 id，默认 'id'。 XGantt 内部不会修改它，仅用于修改数据与本地数据对比更新使用，否则无法更新。字段名称除指定字段外，任意使用，可以通过 key 来配置
     * - 每条数据应当具有正确的 `from`、`to` 属性，这样就可以保证关连线的位置。每一个 `from`、`to` 属性都应当绑定正确的数据 `id`，如果绑定不正确，关连线无法渲染
     * - 支持单独设置每一条连线。除明确标明不支持单独配置的属性外，大部分属性均支持在 data 中单独配置。
     *
     * @notice 使用 links 功能之前，确保对应源数据中有 `id`（id 字段可以自定义） 字段
     * @notice 当 `from` 和 `to` 一样时，不会连线。
     *
     * @example
     * const data = [
     *    {
     *      from: 1,  // id 为 1 的数据
     *      to: 2     // id 为 2 的数据
     *    }
     * ]
     */
    data: ILink[];
    /** 指定唯一 id 的字段。 默认 'id'。 如果没有找到对应字段，可能会导致关联线无法查找/更新/删除 */
    key: string;
    /** 是否展示关联线。不支持单独配置 */
    show: boolean;
    /** 创建相关设置 */
    create: {
      /**
       * 是否允许创建连线。
       *
       * @default false
       *
       * @description 开启时，所有节点将按照 from 与 to 属性规则允许创建连线
       */
      enabled: boolean;
      /**
       * 创建点的展示方式
       *
       * @default 'hover'
       *
       * - `always` - 始终展示
       * - `hover` - 鼠标悬停在任务条时展示
       */
      mode: "always" | "hover";
      /** 创建点的颜色 */
      color?: string;
      /** 透明度 */
      opacity?: number;
      /** 内圈空心半径。 默认 3 */
      radius: number;
      /** 线条宽度。 默认 2 */
      width: number;
      /**
       * 是否允许节点作为起始点创建连线。允许开启后，将可以通过创建按钮去链接被允许的任务节点
       *
       * @default true
       *
       * @argument {true} - 允许创建连线
       * @argument {false} - 不允许创建连线
       * @argument {"S"} - 允许以 S，也就是左侧起始点作为起点创建连线
       * @argument {"F"} - 允许以 F，也就是右侧结束点作为起点创建连线
       */
      from: boolean | "S" | "F" | ((row: EmitData) => boolean | "S" | "F");
      /**
       * 是否允许节点被链接。如果允许，可以将当前任务节点作为被连接点
       *
       * @default true
       *
       * @argument {true} - 允许创建连线
       * @argument {false} - 不允许创建连线
       * @argument {"S"} - 允许以 S，也就是左侧起始点作为终点创建连线
       * @argument {"F"} - 允许以 F，也就是右侧结束点作为终点创建连线
       */
      to:
        | boolean
        | "S"
        | "F"
        | ((row: EmitData, from: EmitData) => boolean | "S" | "F");
    };
    /** 默认关连线的颜色。每一条线可以单独配置后覆盖当前颜色。默认主色 */
    color?: string;
    /**
     * 转角到起始或结束点的距离。它指起始点或结束点到转向点的距离，防止出现连线初始就转向，目视不好定位的情况。
     *
     * @default 20
     */
    distance: number;
    /** 线条的起点/终点位置与任务条的距离。 默认 5 */
    gap: number;
    /** 线条的虚线设定。 默认 [6, 3] */
    dash: number[];
    /** 线条的宽度。 默认 1 */
    width: number;
    /** 箭头设置 */
    arrow: {
      /** 箭头颜色。 可单独配置，默认继承 link 的颜色 */
      color?: string;
      /** 箭头宽度 */
      width: number;
      /** 箭头高度 */
      height: number;
    };
    /** 原点大小。 默认 3 */
    radius: number;
  };

  /** 主色调。默认 #eca710 */
  primaryColor: string;

  /** 甘特图宽度 */
  width?: number;

  /** 甘特图高度 */
  height?: number;

  /**
   * 日期格式化格式。所有展示日期的地方都使用该格式化格式
   *
   * @default 'YYYY-MM-DD HH:mm:ss'
   *
   * @description 该格式将用于所有日期字段的格式化。至少需要格式化到指定单位的粒度，否则会丢失精度，导致出现渲染异常。
   *
   * @see 参考 dayjs 的 {@link https://day.js.org/docs/en/display/format|format} 文档
   */
  dateFormat: string;

  /** 展开配置 */
  expand: {
    /**
     * 是否展示展开
     *
     * @default true
     *
     * @description 如果不展示展开按钮，则所有数据都将展开，不会被收起
     */
    show: boolean;
    /**
     * 是否默认展开
     *
     * @default true
     */
    enabled: boolean;
  };

  /** 选择配置 */
  selection: {
    /** 是否启用选择功能 */
    enabled: boolean;
    /**
     * 右键点击时是否包含自身
     *
     * @default true
     *
     * @description 如果禁用，则右键点击选择框时，不会影响自身的选择，有时候这会反直觉。
     */
    includeSelf: boolean;
  };

  /**
   * 时间刻度
   *
   * @default 'day'
   */
  unit: XGanttUnit;

  /**
   * 显示语言。配置参考 {@link https://day.js.org/docs/en/i18n/i18n|dayjs i18n}
   *
   * @default 'en'
   */
  locale: string;

  /**
   * 当鼠标选停在具有起止时间的任务行上时，是否高亮对应的表头时间。
   *
   * @description 仅针对单位为 `day` 时生效
   */
  highlight?: boolean;

  /** 字段映射配置 */
  fields: {
    /** ID字段 */
    id: string;

    /** 开始时间字段 */
    startTime: string;

    /** 结束时间字段 */
    endTime: string;

    /** 名称字段 */
    name: string;

    /** 进度字段 */
    progress: string;

    /** 子项字段 */
    children: string;
  };

  /** 表格配置 */
  table: ITableOptions;

  /** 图表配置 */
  chart: IChartOptions;

  /** 整体的边框，以及纵向网格线 */
  border: {
    /** 是否展示边框 */
    show?: boolean;
    /** 边框颜色。默认 #e5e5e5 */
    color: string;
  };

  /** 头部配置 */
  header: {
    /**
     * 表头高度。 >= 30
     *
     * @default 80
     */
    height: number;
    /** 背景颜色。默认使用主色调 */
    backgroundColor?: string;
    /** 文字颜色 */
    color: string;
    /**
     * 文字大小
     *
     * @default 14
     */
    fontSize: number;
    /**
     * 文字粗细
     *
     * @default 600
     */
    fontWeight: number | string;
    /**
     * 文字字体
     *
     * @default 'Arial'
     */
    fontFamily: string;
  };

  /** 行属性配置 */
  row: {
    /**
     * 行高。 [20, 70]
     *
     * @default 30
     */
    height: number;
    /**
     * 不同层级行的缩进宽度
     *
     * @default 16
     */
    indent: number;
    /** 背景颜色。数组可以根据行层级选择指定样式 */
    backgroundColor?: string | string[] | ((row: EmitData) => string);
    /** 悬停行样式 */
    hover: {
      /**
       * 悬停的背景颜色
       *
       * @default #000
       */
      backgroundColor: string;
      /**
       * 透明度
       *
       * @default 0.05
       */
      opacity: number;
    };
    /** 选择行样式 */
    select: {
      /**
       * 背景颜色
       *
       * @default #000
       */
      backgroundColor: string;
      /**
       * 透明度
       *
       * @default 0.1
       */
      opacity: number;
    };
  };

  /** 任务条配置 */
  bar: {
    /**
     * 任务条高度。支持百分比，将按 row 的 height 计算
     *
     * @default 20
     */
    height: number | string;

    /**
     * 显示在任务条上的字段内容。如果配置了 label，则会显示 label 的内容。支持点语法对嵌套字段进行访问
     */
    field?: string;
    /**
     * 显示在任务条上的文本内容。它的优先级比 field 高
     */
    label?: string | ((row: EmitData) => string);
    /** 任务条移动规则 */
    move: {
      /** 允许移动移动/缩放 */
      enabled?: boolean | ((row: EmitData) => boolean);
      /**
       * 是否锁定时间范围。如果锁定，拖动将无法超出范围
       */
      lock?: boolean;
      /**
       * 是否允许左右分别单独移动。移动规则同整体效果
       */
      single?: {
        /** 是否允许左移 */
        left?: boolean | ((row: EmitData) => boolean);
        /** 是否允许右移 */
        right?: boolean | ((row: EmitData) => boolean);
      };
      /**
       * 是否按单位移动
       * @description 启用后，移动每次最小为一格，也就是一格最小单位宽度
       */
      byUnit: boolean;
      /** 配置联动 */
      link: {
        /**
         * 子级联动配置
         *
         * - none: 不联动
         * - scale: 按比例缩放。按照伸缩比例进行联动
         * - fixed: 按固定值缩放。仅针对两边超出进行缩放
         */
        child: "none" | "scale" | "fixed";
        /**
         * 父级联动配置
         *
         * - none: 不联动
         * - strict: 严格在父级范围内
         * - expand: 父级跟随极值扩展
         */
        parent: "none" | "strict" | "expand";
      };
    };
    /** 背景颜色 */
    backgroundColor?: string;
    /** 圆角 */
    radius?: number | number[];
    /** 阴影颜色 */
    shadowColor?: string;
    /** 阴影模糊度 */
    shadowBlur?: number;
    /** 阴影偏移量 */
    shadowOffsetX?: number;
    /** 阴影偏移量 */
    shadowOffsetY?: number;
    /** 文字颜色 */
    color?: string;
    /** 任务条的字体大小 */
    fontSize?: number;
    /** 任务条的字体 */
    fontFamily?: string;
    /** 任务条的文本对齐方式 */
    align?: "left" | "center" | "right";
    /** 任务条的文本垂直对齐方式 */
    verticalAlign?: "top" | "middle" | "bottom";
    /** 进度样式 */
    progress?: {
      /** 是否显示进度 */
      show?: boolean;
      /**
       * 进度百分比的基准值。数据中的进度值将会以这个值作为 100% 的基准值
       *
       * @default 100
       *
       * @description 一般来说，这个值是百分比的满分值，通常是 1 或者 100。 所有进度值将按照它进行换算
       */
      targetVal?: number;
      /** 颜色 */
      backgroundColor?: string;
      /** 文本颜色 */
      color?: string;
      /**
       * 基于任务条颜色的高亮百分比 0-100
       *
       * @description 优先级比 backgroundColor 低。默认 30
       *
       * @default 30
       */
      amount?: number;
      /** 透明度 */
      opacity?: number;
      /** 圆角 */
      radius?: number | number[];
      /** 进度小数位 0-10 */
      decimal?: number;
      /**
       * 文本显示位置
       *
       * - top 在进度条上方
       * - right 在进度条右侧外部
       * - inside 在进度条右侧内部
       */
      textAlign?: "top" | "right" | "inside";
      /** 字体大小。默认 10 */
      fontSize?: number;
      /** 字体样式。默认斜体 */
      fontStyle?: string;
    };
  };

  /** 今日时间线配置 */
  today: {
    /**
     * 是否展示今日线
     *
     * @default true
     */
    show: boolean;
    /**
     * 如何展示今日时间线
     *
     * @param line 展示一条竖线，以当前时间为准
     * @param block 会将今天的整个区域进行填充
     *
     * @default 'line'
     */
    type: "line" | "block";
    /**
     * 线条的颜色
     *
     * @default lightblue
     */
    backgroundColor: string;
    /**
     * 线条的透明度
     *
     * @default 1
     */
    opacity: number;
    /**
     * 线条的宽度。 当 type 为 line 时有效。
     *
     * @default 1
     */
    width: number;
  };

  /** 周末配置 */
  weekend: {
    /**
     * 是否展示周
     * @default true
     */
    show: boolean;
    /**
     * 周末的背景颜色
     *
     * @default #c9c9c9
     */
    backgroundColor: string;
    /**
     * 透明度
     *
     * @default 0.1
     */
    opacity: number;
  } & IPattern;

  /** 节假日期配置 */
  holiday: {
    /**
     * 是否展示节假日。
     */
    show?: boolean;
    /**
     * 背景颜色。默认使用主色
     */
    backgroundColor?: string;
    /**
     * 透明度
     *
     * @default 0.1
     */
    opacity: number;
    /**
     * 配置节假日期。可以针对不同节假日配置不同的背景颜色。默认使用统一配置颜色
     */
    holidays?: Array<
      {
        date: Date | number | string | Array<Date | number | string>;
        backgroundColor?: string;
        opacity?: number;
      } & IPattern
    >;
  } & IPattern;

  /** 滚动条配置 */
  scrollbar?: {
    /** 是否显示水平滚动条 */
    showHorizontal?: boolean;
    /** 是否显示垂直滚动条 */
    showVertical?: boolean;
    track?: {
      /** 滚动条轨道尺寸 (px) */
      size?: number;
      /** 滚动条轨道圆角 (px)，默认 4px */
      radius?: number;
      /** 滚动条轨道颜色，默认 transparent */
      color?: string;
    };
    thumb?: {
      /** 滚动条滑块最小尺寸 (px)，默认 30px */
      size?: number;
      /** 滚动条滑块圆角 (px)，默认 4px */
      radius?: number;
      /** 滚动条滑块颜色，默认 rgba(0, 0, 0, 0.4) */
      color?: string;
    };
    /** 鼠标悬停时显示滚动条的延迟时间 (ms)，默认 0 */
    showDelay?: number;
    /** 鼠标离开后隐藏滚动条的延迟时间 (ms)，默认 500 */
    hideDelay?: number;
    /** 滚动条显示动画时长 (ms)，默认 200 */
    showDuration?: number;
    /** 滚动条隐藏动画时长 (ms)，默认 200 */
    hideDuration?: number;
    /**
     * 滚动动画持续时间 (ms)， 默认 100
     *
     * @description 它用于控制滚动条跳转时长，而非滚轮的滚动
     */
    animationDuration?: number;
  };
}
