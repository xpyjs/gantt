// API 配置数据结构
export interface ApiItem {
  id: string; // 完整路径，用于跳转和菜单联动
  key: string; // options 中的键值
  title: string; // 中文标题
  type: string; // 数据类型
  defaultValue?: string; // 默认值
  description: string; // 描述
  required?: boolean; // 是否必需
  options?: string[]; // 可选值
  children?: ApiItem[]; // 子项（当 type 为 object 时）
  category?: string; // 所属分类，用于在 API 页面中分组显示
}

// 配置分类接口
export interface ConfigCategory {
  id: string;
  title: string;
  icon: string;
  iconClass: string;
  items: Array<{
    id: string;
    name: string;
    anchor: string;
  }>;
}

// 配置分类数据
export const configCategories: ConfigCategory[] = [
  {
    id: "data",
    title: "数据配置",
    icon: "material-symbols:database",
    iconClass: "data-icon",
    items: []
  },
  {
    id: "structure",
    title: "结构配置",
    icon: "material-symbols:view-column",
    iconClass: "structure-icon",
    items: []
  },
  {
    id: "style",
    title: "样式配置",
    icon: "material-symbols:palette",
    iconClass: "style-icon",
    items: []
  },
  {
    id: "interaction",
    title: "交互配置",
    icon: "material-symbols:touch-app",
    iconClass: "interaction-icon",
    items: []
  },
  {
    id: "advanced",
    title: "高级配置",
    icon: "material-symbols:settings",
    iconClass: "advanced-icon",
    items: []
  }
];

export const apiItems: ApiItem[] = [
  {
    id: "bar",
    key: "bar",
    title: "任务条配置",
    type: "object",
    description: "任务条配置",
    category: "style",
    children: [
      {
        id: "bar-align",
        key: "align",
        title: "文本对齐方式",
        type: '"left" | "center" | "right"',
        description: "任务条的文本对齐方式"
      },
      {
        id: "bar-backgroundColor",
        key: "backgroundColor",
        title: "背景颜色",
        type: "string",
        description: "背景颜色"
      },
      {
        id: "bar-color",
        key: "color",
        title: "文字颜色",
        type: "string",
        description: "文字颜色"
      },
      {
        id: "bar-field",
        key: "field",
        title: "显示字段",
        type: "string",
        description: "显示在任务条上的字段内容。支持点语法对嵌套字段进行访问"
      },
      {
        id: "bar-fontFamily",
        key: "fontFamily",
        title: "字体",
        type: "string",
        description: "任务条的字体"
      },
      {
        id: "bar-fontSize",
        key: "fontSize",
        title: "字体大小",
        type: "number",
        description: "任务条的字体大小"
      },
      {
        id: "bar-height",
        key: "height",
        title: "任务条高度",
        type: "number | string",
        defaultValue: "20",
        description: "任务条高度。支持百分比，将按 row 的 height 计算"
      },
      {
        id: "bar-label",
        key: "label",
        title: "显示文本",
        type: "string | ((row: EmitData) => string)",
        description: "显示在任务条上的文本内容。优先级比 field 高"
      },
      {
        id: "bar-move",
        key: "move",
        title: "移动规则",
        type: "object",
        description: "任务条移动规则",
        children: [
          {
            id: "bar-move-byUnit",
            key: "byUnit",
            title: "按单位移动",
            type: "boolean",
            description:
              "是否按单位移动。启用后，移动每次最小为一格，也就是一格最小单位宽度"
          },
          {
            id: "bar-move-enabled",
            key: "enabled",
            title: "允许移动",
            type: "boolean | ((row: EmitData) => boolean)",
            description: "允许移动/缩放"
          },
          {
            id: "bar-move-link",
            key: "link",
            title: "联动配置",
            type: "object",
            description: "配置联动",
            children: [
              {
                id: "bar-move-link-child",
                key: "child",
                title: "子级联动",
                type: '"none" | "scale" | "fixed"',
                description:
                  "子级联动配置。none: 不联动; scale: 按比例缩放; fixed: 按固定值缩放"
              },
              {
                id: "bar-move-link-parent",
                key: "parent",
                title: "父级联动",
                type: '"none" | "strict" | "expand"',
                description:
                  "父级联动配置。none: 不联动; strict: 严格在父级范围内; expand: 父级跟随极值扩展"
              }
            ]
          },
          {
            id: "bar-move-lock",
            key: "lock",
            title: "锁定时间范围",
            type: "boolean",
            description: "是否锁定时间范围。如果锁定，拖动将无法超出范围"
          },
          {
            id: "bar-move-single",
            key: "single",
            title: "单独移动",
            type: "object",
            description: "是否允许左右分别单独移动。移动规则同整体效果",
            children: [
              {
                id: "bar-move-single-left",
                key: "left",
                title: "允许左移",
                type: "boolean | ((row: EmitData) => boolean)",
                description: "是否允许左移"
              },
              {
                id: "bar-move-single-right",
                key: "right",
                title: "允许右移",
                type: "boolean | ((row: EmitData) => boolean)",
                description: "是否允许右移"
              }
            ]
          }
        ]
      },
      {
        id: "bar-progress",
        key: "progress",
        title: "进度样式",
        type: "object",
        description: "进度样式",
        children: [
          {
            id: "bar-progress-amount",
            key: "amount",
            title: "高亮百分比",
            type: "number",
            defaultValue: "30",
            description:
              "基于任务条颜色的高亮百分比 0-100。优先级比 backgroundColor 低"
          },
          {
            id: "bar-progress-backgroundColor",
            key: "backgroundColor",
            title: "背景颜色",
            type: "string",
            description: "颜色"
          },
          {
            id: "bar-progress-color",
            key: "color",
            title: "文本颜色",
            type: "string",
            description: "文本颜色"
          },
          {
            id: "bar-progress-decimal",
            key: "decimal",
            title: "小数位数",
            type: "number",
            description: "进度小数位 0-10"
          },
          {
            id: "bar-progress-fontSize",
            key: "fontSize",
            title: "字体大小",
            type: "number",
            defaultValue: "10",
            description: "字体大小"
          },
          {
            id: "bar-progress-fontStyle",
            key: "fontStyle",
            title: "字体样式",
            type: "string",
            description: "字体样式。默认斜体"
          },
          {
            id: "bar-progress-opacity",
            key: "opacity",
            title: "透明度",
            type: "number",
            description: "透明度"
          },
          {
            id: "bar-progress-radius",
            key: "radius",
            title: "圆角",
            type: "number | number[]",
            description: "圆角"
          },
          {
            id: "bar-progress-show",
            key: "show",
            title: "显示进度",
            type: "boolean",
            description: "是否显示进度"
          },
          {
            id: "bar-progress-targetVal",
            key: "targetVal",
            title: "基准值",
            type: "number",
            defaultValue: "100",
            description:
              "进度百分比的基准值。数据中的进度值将会以这个值作为 100% 的基准值"
          },
          {
            id: "bar-progress-textAlign",
            key: "textAlign",
            title: "文本位置",
            type: '"top" | "right" | "inside"',
            description:
              "文本显示位置。top: 在进度条上方; right: 在进度条右侧外部; inside: 在进度条右侧内部"
          }
        ]
      },
      {
        id: "bar-radius",
        key: "radius",
        title: "圆角",
        type: "number | number[]",
        description: "圆角"
      },
      {
        id: "bar-shadowBlur",
        key: "shadowBlur",
        title: "阴影模糊度",
        type: "number",
        description: "阴影模糊度"
      },
      {
        id: "bar-shadowColor",
        key: "shadowColor",
        title: "阴影颜色",
        type: "string",
        description: "阴影颜色"
      },
      {
        id: "bar-shadowOffsetX",
        key: "shadowOffsetX",
        title: "阴影X偏移",
        type: "number",
        description: "阴影偏移量"
      },
      {
        id: "bar-shadowOffsetY",
        key: "shadowOffsetY",
        title: "阴影Y偏移",
        type: "number",
        description: "阴影偏移量"
      },
      {
        id: "bar-verticalAlign",
        key: "verticalAlign",
        title: "垂直对齐",
        type: '"top" | "middle" | "bottom"',
        description: "任务条的文本垂直对齐方式"
      }
    ]
  },
  {
    id: "border",
    key: "border",
    title: "边框样式",
    type: "object",
    description: "整体的边框，以及纵向网格线",
    category: "style",
    children: [
      {
        id: "border-color",
        key: "color",
        title: "边框颜色",
        type: "string",
        defaultValue: '"#e5e5e5"',
        description: "边框颜色"
      },
      {
        id: "border-show",
        key: "show",
        title: "显示边框",
        type: "boolean",
        description: "是否展示边框"
      }
    ]
  },
  {
    id: "chart",
    key: "chart",
    title: "图表配置",
    type: "object",
    description: "右侧图表区域的显示和行为配置",
    category: "structure",
    children: [
      {
        id: "chart-autoCellWidth",
        key: "autoCellWidth",
        title: "自适应单元格宽度",
        type: "boolean",
        description:
          "自适应 cell 宽度。允许右侧部分基于当前宽度，自适应自定义的起止时间"
      },
      {
        id: "chart-cellWidth",
        key: "cellWidth",
        title: "单元格宽度",
        type: 'number | "small" | "normal" | "large" | Partial<Record<XGanttUnit, number>>',
        description: "时间单元格宽度设置"
      },
      {
        id: "chart-endTime",
        key: "endTime",
        title: "结束时间",
        type: "Date | string",
        description: "强制设置结束时间，覆盖数据中的结束时间"
      },
      {
        id: "chart-headerCellFormat",
        key: "headerCellFormat",
        title: "表头单元格格式化",
        type: "string | ((date: Date, unit: XGanttUnit) => string)",
        description:
          "表头单元格格式化配置。字符串使用 dayjs 格式化参数，函数可返回自定义格式"
      },
      {
        id: "chart-headerGroupFormat",
        key: "headerGroupFormat",
        title: "表头组格式化",
        type: "string | ((date: Date, unit: XGanttUnit) => string)",
        description:
          "表头组（上层）格式化配置。字符串使用 dayjs 格式化参数，函数可返回自定义格式"
      },
      {
        id: "chart-startTime",
        key: "startTime",
        title: "开始时间",
        type: "Date | string",
        description: "强制设置开始时间，覆盖数据中的开始时间"
      }
    ]
  },
  {
    id: "data",
    key: "data",
    title: "源数据",
    type: "any[]",
    description: "甘特图的源数据数组，包含所有任务项的信息",
    required: true,
    category: "data"
  },
  {
    id: "dateFormat",
    key: "dateFormat",
    title: "日期格式",
    type: "string",
    defaultValue: '"YYYY-MM-DD HH:mm:ss"',
    description:
      "日期格式化字符串，用于所有日期字段的显示。参考 dayjs 的 format 文档",
    category: "data"
  },
  {
    id: "expand",
    key: "expand",
    title: "展开配置",
    type: "object",
    description: "树形结构的展开/收起功能配置",
    category: "interaction",
    children: [
      {
        id: "expand-enabled",
        key: "enabled",
        title: "默认展开",
        type: "boolean",
        defaultValue: "true",
        description: "是否默认展开"
      },
      {
        id: "expand-show",
        key: "show",
        title: "显示展开按钮",
        type: "boolean",
        defaultValue: "true",
        description: "是否显示展开按钮。如果不显示，所有数据都将展开"
      }
    ]
  },
  {
    id: "fields",
    key: "fields",
    title: "字段映射",
    type: "object",
    description: "配置数据字段与甘特图功能的映射关系",
    category: "data",
    children: [
      {
        id: "fields-children",
        key: "children",
        title: "子任务字段",
        type: "string",
        description: "子任务字段名"
      },
      {
        id: "fields-endTime",
        key: "endTime",
        title: "结束时间字段",
        type: "string",
        description: "结束时间字段名"
      },
      {
        id: "fields-id",
        key: "id",
        title: "ID字段",
        type: "string",
        description: "ID字段名，用于唯一标识每个任务"
      },
      {
        id: "fields-name",
        key: "name",
        title: "任务名称字段",
        type: "string",
        description: "任务名称字段名"
      },
      {
        id: "fields-progress",
        key: "progress",
        title: "进度字段",
        type: "string",
        description: "进度字段名"
      },
      {
        id: "fields-startTime",
        key: "startTime",
        title: "开始时间字段",
        type: "string",
        description: "开始时间字段名"
      }
    ]
  },
  {
    id: "header",
    key: "header",
    title: "头部样式",
    type: "object",
    description: "头部配置",
    category: "style",
    children: [
      {
        id: "header-backgroundColor",
        key: "backgroundColor",
        title: "背景颜色",
        type: "string",
        description: "背景颜色，默认使用主色调"
      },
      {
        id: "header-color",
        key: "color",
        title: "文字颜色",
        type: "string",
        description: "文字颜色"
      },
      {
        id: "header-fontFamily",
        key: "fontFamily",
        title: "文字字体",
        type: "string",
        defaultValue: '"Arial"',
        description: "文字字体"
      },
      {
        id: "header-fontSize",
        key: "fontSize",
        title: "文字大小",
        type: "number",
        defaultValue: "14",
        description: "文字大小"
      },
      {
        id: "header-fontWeight",
        key: "fontWeight",
        title: "文字粗细",
        type: "number | string",
        defaultValue: "600",
        description: "文字粗细"
      },
      {
        id: "header-height",
        key: "height",
        title: "表头高度",
        type: "number",
        defaultValue: "80",
        description: "表头高度（>= 30）"
      }
    ]
  },
  {
    id: "height",
    key: "height",
    title: "高度",
    type: "number",
    description: "甘特图的高度（像素）",
    category: "structure"
  },
  {
    id: "highlight",
    key: "highlight",
    title: "时间高亮",
    type: "boolean",
    description:
      "当鼠标悬停在任务行上时，是否高亮对应的表头时间（仅针对单位为 day 时生效）",
    category: "interaction"
  },
  {
    id: "holiday",
    key: "holiday",
    title: "节假日配置",
    type: "object",
    description: "节假日期配置",
    category: "style",
    children: [
      {
        id: "holiday-backgroundColor",
        key: "backgroundColor",
        title: "背景颜色",
        type: "string",
        description: "背景颜色。默认使用主色"
      },
      {
        id: "holiday-holidays",
        key: "holidays",
        title: "节假日列表",
        type: `Array<{
  date: Date | number | string | Array<Date | number | string>;
  backgroundColor?: string;
  opacity?: number;
  pattern?: "stripe" | "dot" | "grid" | "custom";
  patternOptions?: { ... }  // 详看 holiday 中的 patternOptions
}>`,
        description: "配置节假日期。可以针对不同节假日配置不同的背景颜色"
      },
      {
        id: "holiday-opacity",
        key: "opacity",
        title: "透明度",
        type: "number",
        defaultValue: "0.1",
        description: "透明度"
      },
      {
        id: "holiday-pattern",
        key: "pattern",
        title: "填充样式",
        type: '"stripe" | "dot" | "grid" | "custom"',
        description:
          "填充样式。stripe: 斜条纹填充; dot: 圆点填充; grid: 网格填充; custom: 自定义图片填充"
      },
      {
        id: "holiday-patternOptions",
        key: "patternOptions",
        title: "图案选项",
        type: "object",
        description: "条纹样式配置",
        children: [
          {
            id: "holiday-patternOptions-angle",
            key: "angle",
            title: "旋转角度",
            type: "number",
            description: "图片旋转角度。对 stripe 有效"
          },
          {
            id: "holiday-patternOptions-color",
            key: "color",
            title: "条纹颜色",
            type: "string",
            description: "条纹颜色，默认使用 backgroundColor"
          },
          {
            id: "holiday-patternOptions-image",
            key: "image",
            title: "自定义图片",
            type: "string",
            description: "自定义图片。支持 base64 或图片 URL。对 custom 有效"
          },
          {
            id: "holiday-patternOptions-spacing",
            key: "spacing",
            title: "间距",
            type: "number",
            description: "间距"
          },
          {
            id: "holiday-patternOptions-width",
            key: "width",
            title: "线条宽度",
            type: "number",
            description: "线条宽度。对 dot 就是圆点的大小"
          }
        ]
      },
      {
        id: "holiday-show",
        key: "show",
        title: "显示节假日",
        type: "boolean",
        description: "是否展示节假日"
      }
    ]
  },
  {
    id: "links",
    key: "links",
    title: "关联配置",
    type: "object",
    description: "关联配置",
    category: "data",
    children: [
      {
        id: "links-arrow",
        key: "arrow",
        title: "箭头设置",
        type: "object",
        description: "箭头设置",
        children: [
          {
            id: "links-arrow-color",
            key: "color",
            title: "箭头颜色",
            type: "string",
            description: "箭头颜色。可单独配置，默认继承 link 的颜色"
          },
          {
            id: "links-arrow-height",
            key: "height",
            title: "箭头高度",
            type: "number",
            description: "箭头高度"
          },
          {
            id: "links-arrow-width",
            key: "width",
            title: "箭头宽度",
            type: "number",
            description: "箭头宽度"
          }
        ]
      },
      {
        id: "links-color",
        key: "color",
        title: "线条颜色",
        type: "string",
        description:
          "默认关连线的颜色。每一条线可以单独配置后覆盖当前颜色。默认主色"
      },
      {
        id: "links-create",
        key: "create",
        title: "创建设置",
        type: "object",
        description: "创建相关设置",
        children: [
          {
            id: "links-create-color",
            key: "color",
            title: "创建点颜色",
            type: "string",
            description: "创建点的颜色"
          },
          {
            id: "links-create-enabled",
            key: "enabled",
            title: "允许创建连线",
            type: "boolean",
            defaultValue: "false",
            description:
              "是否允许创建连线。开启时，所有节点将按照 from 与 to 属性规则允许创建连线"
          },
          {
            id: "links-create-from",
            key: "from",
            title: "起始点设置",
            type: 'boolean | "S" | "F" | ((row: EmitData) => boolean | "S" | "F")',
            defaultValue: "true",
            description:
              "是否允许节点作为起始点创建连线。true: 允许; false: 不允许; S: 以左侧起始点为起点; F: 以右侧结束点为起点"
          },
          {
            id: "links-create-mode",
            key: "mode",
            title: "展示方式",
            type: '"always" | "hover"',
            defaultValue: '"hover"',
            description:
              "创建点的展示方式。always: 始终展示; hover: 鼠标悬停在任务条时展示"
          },
          {
            id: "links-create-opacity",
            key: "opacity",
            title: "透明度",
            type: "number",
            description: "透明度"
          },
          {
            id: "links-create-radius",
            key: "radius",
            title: "半径",
            type: "number",
            defaultValue: "3",
            description: "内圈空心半径"
          },
          {
            id: "links-create-to",
            key: "to",
            title: "终点设置",
            type: 'boolean | "S" | "F" | ((row: EmitData, from: EmitData) => boolean | "S" | "F")',
            defaultValue: "true",
            description:
              "是否允许节点被链接。true: 允许; false: 不允许; S: 以左侧起始点为终点; F: 以右侧结束点为终点。当作为函数时，它会多一个 from 参数，可以获取到该条连线是从哪条数据起始的，进而可以更加灵活的进行判定是否可以落点。"
          },
          {
            id: "links-create-width",
            key: "width",
            title: "线条宽度",
            type: "number",
            defaultValue: "2",
            description: "线条宽度"
          }
        ]
      },
      {
        id: "links-dash",
        key: "dash",
        title: "虚线设定",
        type: "number[]",
        defaultValue: "[6, 3]",
        description: "线条的虚线设定"
      },
      {
        id: "links-data",
        key: "data",
        title: "关联数据",
        type: "ILink[]",
        description:
          "关联数据集合。每一条数据都需要指定自己的 key 作为唯一 id，默认 'id'。 XGantt 内部不会修改它，仅用于修改数据与本地数据对比更新使用，否则无法更新。字段名称除指定字段外，任意使用，可以通过 key 来配置。\n<span style=\"font-style: italic; color: var(--text-tertiary)\">支持单独设置每一条连线。除明确标明不支持单独配置的属性外，大部分属性均支持在 data 中单独配置</span>",
        children: [
          {
            id: "links-data-from",
            key: "from",
            title: "起始任务 id。缺少无法渲染",
            type: "any",
            required: true,
            description: "起始任务 id"
          },
          {
            id: "links-data-to",
            key: "to",
            title: "截止任务 id。缺少无法渲染",
            type: "any",
            required: true,
            description: "截止任务 id"
          },
          {
            id: "links-data-color",
            key: "color",
            title: "关联线颜色",
            type: "string",
            description: "关联线颜色"
          },
          {
            id: "links-data-type",
            key: "type",
            title: "关联线类型",
            type: '"FS" | "FF" | "SS" | "SF"',
            description: "关联线类型"
          }
        ]
      },
      {
        id: "links-distance",
        key: "distance",
        title: "转角距离",
        type: "number",
        defaultValue: "20",
        description:
          "转角到起始或结束点的距离。防止出现连线初始就转向，目视不好定位的情况"
      },
      {
        id: "links-gap",
        key: "gap",
        title: "连线间距",
        type: "number",
        defaultValue: "5",
        description: "线条的起点/终点位置与任务条的距离"
      },
      {
        id: "links-key",
        key: "key",
        title: "唯一标识字段",
        type: "string",
        defaultValue: '"id"',
        description:
          "指定唯一 id 的字段。默认 'id'。如果没有找到对应字段，可能会导致关联线无法查找/更新/删除"
      },
      {
        id: "links-radius",
        key: "radius",
        title: "原点大小",
        type: "number",
        defaultValue: "3",
        description: "原点大小"
      },
      {
        id: "links-show",
        key: "show",
        title: "显示关联线",
        type: "boolean",
        description: "是否展示关联线。不支持单独配置"
      },
      {
        id: "links-width",
        key: "width",
        title: "线条宽度",
        type: "number",
        defaultValue: "1",
        description: "线条的宽度"
      }
    ]
  },
  {
    id: "locale",
    key: "locale",
    title: "显示语言",
    type: "string",
    defaultValue: '"en"',
    description: "显示语言。配置参考 dayjs i18n",
    category: "data"
  },
  {
    id: "logLevel",
    key: "logLevel",
    title: "日志级别",
    type: '"debug" | "info" | "warn" | "error" | "none"',
    defaultValue: '"info"',
    description: "日志级别，控制控制台输出的日志详细程度",
    options: ["debug", "info", "warn", "error", "none"],
    category: "advanced"
  },
  {
    id: "primaryColor",
    key: "primaryColor",
    title: "主色调",
    type: "string",
    defaultValue: '"#eca710"',
    description: "甘特图的主色调，会影响整体的颜色风格",
    category: "style"
  },
  {
    id: "row",
    key: "row",
    title: "行样式",
    type: "object",
    description: "行属性配置",
    category: "style",
    children: [
      {
        id: "row-backgroundColor",
        key: "backgroundColor",
        title: "背景颜色",
        type: "string | string[] | ((row: EmitData) => string)",
        description: "背景颜色。数组可以根据行层级选择指定样式"
      },
      {
        id: "row-height",
        key: "height",
        title: "行高",
        type: "number",
        defaultValue: "30",
        description: "行高（范围: 20-70）"
      },
      {
        id: "row-hover",
        key: "hover",
        title: "悬停样式",
        type: "object",
        description: "悬停行样式",
        children: [
          {
            id: "row-hover-backgroundColor",
            key: "backgroundColor",
            title: "背景颜色",
            type: "string",
            defaultValue: '"#000"',
            description: "悬停的背景颜色"
          },
          {
            id: "row-hover-opacity",
            key: "opacity",
            title: "透明度",
            type: "number",
            defaultValue: "0.05",
            description: "透明度"
          }
        ]
      },
      {
        id: "row-indent",
        key: "indent",
        title: "缩进宽度",
        type: "number",
        defaultValue: "16",
        description: "不同层级行的缩进宽度"
      },
      {
        id: "row-select",
        key: "select",
        title: "选择样式",
        type: "object",
        description: "选择行样式",
        children: [
          {
            id: "row-select-backgroundColor",
            key: "backgroundColor",
            title: "背景颜色",
            type: "string",
            defaultValue: '"#000"',
            description: "背景颜色"
          },
          {
            id: "row-select-opacity",
            key: "opacity",
            title: "透明度",
            type: "number",
            defaultValue: "0.1",
            description: "透明度"
          }
        ]
      }
    ]
  },
  {
    id: "scrollbar",
    key: "scrollbar",
    title: "滚动条配置",
    type: "object",
    description: "虚拟滚动条的外观和行为配置",
    category: "interaction",
    children: [
      {
        id: "scrollbar-animationDuration",
        key: "animationDuration",
        title: "滚动动画时长",
        type: "number",
        defaultValue: "100",
        description: "滚动动画持续时间 (ms)，用于控制滚动条跳转时长"
      },
      {
        id: "scrollbar-hideDuration",
        key: "hideDuration",
        title: "隐藏动画时长",
        type: "number",
        defaultValue: "200",
        description: "滚动条隐藏动画时长 (ms)"
      },
      {
        id: "scrollbar-hideDelay",
        key: "hideDelay",
        title: "隐藏延迟",
        type: "number",
        defaultValue: "500",
        description: "鼠标离开后隐藏滚动条的延迟时间 (ms)"
      },
      {
        id: "scrollbar-showDelay",
        key: "showDelay",
        title: "显示延迟",
        type: "number",
        defaultValue: "0",
        description: "鼠标悬停时显示滚动条的延迟时间 (ms)"
      },
      {
        id: "scrollbar-showDuration",
        key: "showDuration",
        title: "显示动画时长",
        type: "number",
        defaultValue: "200",
        description: "滚动条显示动画时长 (ms)"
      },
      {
        id: "scrollbar-showHorizontal",
        key: "showHorizontal",
        title: "显示水平滚动条",
        type: "boolean",
        description: "是否显示水平滚动条"
      },
      {
        id: "scrollbar-showVertical",
        key: "showVertical",
        title: "显示垂直滚动条",
        type: "boolean",
        description: "是否显示垂直滚动条"
      },
      {
        id: "scrollbar-thumb",
        key: "thumb",
        title: "滑块样式",
        type: "object",
        description: "滑块样式",
        children: [
          {
            id: "scrollbar-thumb-color",
            key: "color",
            title: "滑块颜色",
            type: "string",
            defaultValue: '"rgba(0, 0, 0, 0.4)"',
            description: "滚动条滑块颜色"
          },
          {
            id: "scrollbar-thumb-radius",
            key: "radius",
            title: "滑块圆角",
            type: "number",
            defaultValue: "4",
            description: "滚动条滑块圆角 (px)"
          },
          {
            id: "scrollbar-thumb-size",
            key: "size",
            title: "滑块尺寸",
            type: "number",
            defaultValue: "30",
            description: "滚动条滑块最小尺寸 (px)"
          }
        ]
      },
      {
        id: "scrollbar-track",
        key: "track",
        title: "轨道样式",
        type: "object",
        description: "轨道样式",
        children: [
          {
            id: "scrollbar-track-color",
            key: "color",
            title: "轨道颜色",
            type: "string",
            defaultValue: '"transparent"',
            description: "滚动条轨道颜色"
          },
          {
            id: "scrollbar-track-radius",
            key: "radius",
            title: "轨道圆角",
            type: "number",
            defaultValue: "4",
            description: "滚动条轨道圆角 (px)"
          },
          {
            id: "scrollbar-track-size",
            key: "size",
            title: "轨道尺寸",
            type: "number",
            description: "滚动条轨道尺寸 (px)"
          }
        ]
      }
    ]
  },
  {
    id: "selection",
    key: "selection",
    title: "选择配置",
    type: "object",
    description: "任务选择功能的配置",
    category: "interaction",
    children: [
      {
        id: "selection-enabled",
        key: "enabled",
        title: "启用选择功能",
        type: "boolean",
        description: "是否启用选择功能"
      },
      {
        id: "selection-includeSelf",
        key: "includeSelf",
        title: "包含自身",
        type: "boolean",
        defaultValue: "true",
        description: "右键点击时是否包含自身"
      }
    ]
  },
  {
    id: "table",
    key: "table",
    title: "表格配置",
    type: "object",
    description: "左侧表格的显示和行为配置",
    category: "structure",
    children: [
      {
        id: "table-align",
        key: "align",
        title: "对齐方式",
        type: '"left" | "center" | "right"',
        defaultValue: '"center"',
        description: "统一设置列对齐方式。每列的对齐方式可以单独设置"
      },
      {
        id: "table-collapsible",
        key: "collapsible",
        title: "收起/展开表格",
        type: "boolean",
        defaultValue: "false",
        description: "允许收起表格。开启后，中线会显示一个折叠按钮，点击后可以收起表格"
      },
      {
        id: "table-columns",
        key: "columns",
        title: "列配置",
        type: "ITableColumn[]",
        description: "列配置数组，定义表格的列结构和行为",
        children: [
          {
            id: "table-columns-align",
            key: "align",
            title: "对齐方式",
            type: '"left" | "center" | "right"',
            defaultValue: '"center"',
            description: "当前列对齐方式"
          },
          {
            id: "table-columns-customStyle",
            key: "customStyle",
            title: "自定义样式",
            type: "Partial<CSSStyleDeclaration>",
            description: "自定义样式"
          },
          {
            id: "table-columns-ellipsis",
            key: "ellipsis",
            title: "文字省略",
            type: "boolean",
            defaultValue: "true",
            description: "当文字溢出时，是否显示省略号"
          },
          {
            id: "table-columns-field",
            key: "field",
            title: "字段名",
            type: "string",
            description: "字段名。支持点语法对嵌套字段进行访问",
            required: true
          },
          {
            id: "table-columns-headerAlign",
            key: "headerAlign",
            title: "表头对齐方式",
            type: '"left" | "center" | "right"',
            defaultValue: '"center"',
            description: "表头对齐方式"
          },
          {
            id: "table-columns-headerRender",
            key: "headerRender",
            title: "表头渲染函数",
            type: "() => HTMLElement | string",
            description: "自定义表头渲染"
          },
          {
            id: "table-columns-label",
            key: "label",
            title: "显示文本",
            type: "string",
            description: "显示在表头的文本"
          },
          {
            id: "table-columns-merge",
            key: "merge",
            title: "合并方法",
            type: "(value: any, row: any, colIndex: number, level: number) => { col: number; row: number } | undefined",
            description: "合并方法。返回值大于1，表示向后/向下合并的格数"
          },
          {
            id: "table-columns-render",
            key: "render",
            title: "渲染函数",
            type: "(row: EmitData) => HTMLElement | string",
            description: "渲染函数"
          },
          {
            id: "table-columns-resizable",
            key: "resizable",
            title: "可调整列宽",
            type: "boolean",
            defaultValue: "true",
            description: "是否允许拖拽调整列宽"
          },
          {
            id: "table-columns-width",
            key: "width",
            title: "列宽",
            type: "number",
            defaultValue: "100",
            description: "当前列宽"
          }
        ]
      },
      {
        id: "table-ellipsis",
        key: "ellipsis",
        title: "文字省略",
        type: "boolean",
        defaultValue: "true",
        description: "是否在文字溢出时显示省略号"
      },
      {
        id: "table-emptyText",
        key: "emptyText",
        title: "空数据占位符",
        type: "string",
        defaultValue: '"-"',
        description: "空数据占位符"
      },
      {
        id: "table-headerAlign",
        key: "headerAlign",
        title: "表头对齐方式",
        type: '"left" | "center" | "right"',
        defaultValue: '"center"',
        description: "统一设置表头对齐方式。每列的表头对齐方式可以单独设置"
      },
      {
        id: "table-width",
        key: "width",
        title: "列宽度",
        type: "number",
        defaultValue: "100",
        description: "统一设置列宽度。每列的宽度可以单独设置"
      }
    ]
  },
  {
    id: "today",
    key: "today",
    title: "今日标识",
    type: "object",
    description: "今日时间线配置",
    category: "style",
    children: [
      {
        id: "today-backgroundColor",
        key: "backgroundColor",
        title: "背景颜色",
        type: "string",
        defaultValue: '"lightblue"',
        description: "线条的颜色"
      },
      {
        id: "today-opacity",
        key: "opacity",
        title: "透明度",
        type: "number",
        defaultValue: "1",
        description: "线条的透明度"
      },
      {
        id: "today-show",
        key: "show",
        title: "显示今日线",
        type: "boolean",
        defaultValue: "true",
        description: "是否展示今日线"
      },
      {
        id: "today-type",
        key: "type",
        title: "显示类型",
        type: '"line" | "block"',
        defaultValue: '"line"',
        description:
          "如何展示今日时间线。line: 展示一条竖线; block: 填充今天的整个区域"
      },
      {
        id: "today-width",
        key: "width",
        title: "线条宽度",
        type: "number",
        defaultValue: "1",
        description: "线条的宽度（当 type 为 line 时有效）"
      }
    ]
  },
  {
    id: "unit",
    key: "unit",
    title: "时间刻度单位",
    type: "XGanttUnit",
    defaultValue: '"day"',
    description: "时间刻度单位",
    options: ["hour", "day", "week", "month", "quarter"],
    category: "structure"
  },
  {
    id: "weekend",
    key: "weekend",
    title: "周末标识",
    type: "object",
    description: "周末配置",
    category: "style",
    children: [
      {
        id: "weekend-backgroundColor",
        key: "backgroundColor",
        title: "背景颜色",
        type: "string",
        defaultValue: '"#c9c9c9"',
        description: "周末的背景颜色"
      },
      {
        id: "weekend-opacity",
        key: "opacity",
        title: "透明度",
        type: "number",
        defaultValue: "0.1",
        description: "透明度"
      },
      {
        id: "weekend-pattern",
        key: "pattern",
        title: "填充样式",
        type: '"stripe" | "dot" | "grid" | "custom"',
        description:
          "填充样式。stripe: 斜条纹填充; dot: 圆点填充; grid: 网格填充; custom: 自定义图片填充"
      },
      {
        id: "weekend-patternOptions",
        key: "patternOptions",
        title: "图案选项",
        type: "object",
        description: "条纹样式配置",
        children: [
          {
            id: "weekend-patternOptions-angle",
            key: "angle",
            title: "旋转角度",
            type: "number",
            description: "图片旋转角度。对 stripe 有效"
          },
          {
            id: "weekend-patternOptions-color",
            key: "color",
            title: "条纹颜色",
            type: "string",
            description: "条纹颜色，默认使用 backgroundColor"
          },
          {
            id: "weekend-patternOptions-image",
            key: "image",
            title: "自定义图片",
            type: "string",
            description: "自定义图片。支持 base64 或图片 URL。对 custom 有效"
          },
          {
            id: "weekend-patternOptions-spacing",
            key: "spacing",
            title: "间距",
            type: "number",
            description: "间距"
          },
          {
            id: "weekend-patternOptions-width",
            key: "width",
            title: "线条宽度",
            type: "number",
            description: "线条宽度。对 dot 就是圆点的大小"
          }
        ]
      },
      {
        id: "weekend-show",
        key: "show",
        title: "显示周末",
        type: "boolean",
        defaultValue: "true",
        description: "是否展示周末"
      }
    ]
  },
  {
    id: "width",
    key: "width",
    title: "宽度",
    type: "number",
    description: "甘特图的宽度（像素）",
    category: "structure"
  }
];

// 根据分类生成配置分类数据
export const getConfigCategories = (): ConfigCategory[] => {
  // 初始化分类数据
  const categories: ConfigCategory[] = configCategories.map(cat => ({
    ...cat,
    items: [] as Array<{
      id: string;
      name: string;
      anchor: string;
    }>
  }));

  // 根据 apiItems 的分类字段动态填充 items
  apiItems.forEach(item => {
    if (item.category) {
      const category = categories.find(cat => cat.id === item.category);
      if (category) {
        category.items.push({
          id: item.id,
          name: item.key,
          anchor: item.id
        });
      }
    }
  });

  return categories;
};
