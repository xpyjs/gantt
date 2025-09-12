import type { MethodParameter, CodeExample, MethodConfig, BestPractice, MethodsPageConfig } from "./methods";

/**
 * 代码示例数据
 */
const codeExamples = {
  colorjs: `import { colorjs } from "@xpyjs/gantt-core";

// 创建 Colorjs 实例
const color1 = colorjs("#3498db"); // 使用十六进制颜色
const color2 = colorjs("rgb(52, 152, 219)"); // 使用 RGB 颜色
const color3 = colorjs({ r: 52, g: 152, b: 219, a: 1 }); // 使用对象
const color4 = colorjs(color1); // 传入 Colorjs 实例，返回该实例本身
console.log('color4 === color1:', color4 === color1); // true

// 链式调用
const lighterColor = color1.brighten(20).toHex(); // 变亮 20%
console.log(lighterColor); // 输出变亮后的十六进制颜色
`,
};

/**
 * 辅助页面配置数据
 */
export const assistPageConfig: MethodsPageConfig = {
  // 页面概述
  overview: {
    title: "辅助概述",
    description:
      "为了方便使用，XGantt 还提供了一些辅助工具方法，帮助开发者更高效地操作和管理甘特图。",
  },

  // 方法列表
  methods: [
    {
      id: "colorjs",
      name: "colorjs(color)",
      type: "颜色处理",
      description: "Colorjs 工厂函数，用于创建 Colorjs 实例。它支持链式调用，方便进行颜色转换和操作。",
      icon: "🎨",
      parameters: [
        {
          name: "color",
          type: "string",
          description: "颜色值 (字符串, 如 '#rgb', '#rrggbb', 'rgb()', 'rgba()', 颜色名; 或对象 {r, g, b, a}; 或 Colorjs 实例)",
          optional: false
        }
      ],
      functions: [
        {
          name: "alpha",
          parameters: [
            {
              name: "value",
              type: "number",
              description: "新的 alpha 通道值 (0-1)，如果不传则返回当前 alpha 值",
              optional: true
            }
          ],
          description: "获取或设置颜色的 alpha 通道值",
          returns: "number | Colorjs"
        },
        {
          name: "blue",
          parameters: [
            {
              name: "value",
              type: "number",
              description: "新的蓝色通道值 (0-255)，如果不传则返回当前蓝色通道值",
              optional: true
            }
          ],
          description: "获取或设置颜色的蓝色通道值",
          returns: "number | Colorjs"
        },
        {
          name: "brighten",
          parameters: [
            {
              name: "value",
              type: "number",
              description: "亮度增加的百分比 (0-100)，默认为 10。",
              optional: true
            }
          ],
          description: "使颜色变亮，参数为亮度增加的百分比 (0-100)，默认为 10。",
          returns: "Colorjs"
        },
        {
          name: "clone",
          parameters: [],
          description: "创建当前颜色的副本",
          returns: "Colorjs"
        },
        {
          name: "darken",
          parameters: [
            {
              name: "value",
              type: "number",
              description: "亮度减少的百分比 (0-100)，默认为 10。",
              optional: true
            }
          ],
          description: "使颜色变暗，参数为亮度减少的百分比 (0-100)，默认为 10。",
          returns: "Colorjs"
        },
        {
          name: "green",
          parameters: [
            {
              name: "value",
              type: "number",
              description: "新的绿色通道值 (0-255)，如果不传则返回当前绿色通道值",
              optional: true
            }
          ],
          description: "获取或设置颜色的绿色通道值",
          returns: "number | Colorjs"
        },
        {
          name: "isDark",
          parameters: [],
          description: "判断颜色是否为暗色",
          returns: "boolean"
        },
        {
          name: "isLight",
          parameters: [],
          description: "判断颜色是否为亮色",
          returns: "boolean"
        },
        {
          name: "mix",
          parameters: [
            {
              name: "colorToMix",
              type: "any",
              description: "要混合的颜色",
              optional: false
            },
            {
              name: "amount",
              type: "number",
              description: "混合的比例 (0-100)，默认为 50 (各占一半)",
              optional: true
            }
          ],
          description: "与另一种颜色混合，amount 为要混合的比例 (0-100)，表示 `colorToMix` 所占的权重，默认为 50 (各占一半)。",
          returns: "Colorjs"
        },
        {
          name: "red",
          parameters: [
            {
              name: "value",
              type: "number",
              description: "新的红色通道值 (0-255)，如果不传则返回当前红色通道值",
              optional: true
            }
          ],
          description: "获取或设置颜色的红色通道值",
          returns: "number | Colorjs"
        },
        {
          name: "toHex",
          parameters: [
            {
              name: "allow3Char",
              type: "boolean",
              description: "是否允许返回三字符的十六进制格式 (如 '#fff')，默认为 false",
              optional: true
            },
            {
              name: "forceAlpha",
              type: "boolean",
              description: "是否强制包含 alpha 通道 (如 '#rrggbbaa')，默认为 false",
              optional: true
            }
          ],
          description: "将颜色转换为十六进制字符串格式",
          returns: "string"
        },
        {
          name: "toObject",
          parameters: [],
          description: "将颜色转换为包含 r, g, b, a 属性的对象",
          returns: "{ r: number; g: number; b: number; a: number }"
        },
        {
          name: "toRgb",
          parameters: [
            {
              name: "includeAlpha",
              type: "boolean",
              description: "是否包含 alpha 通道，默认为 false",
              optional: true
            }
          ],
          description: "将颜色转换为 RGB 或 RGBA 字符串格式",
          returns: "string"
        },
        {
          name: "toString",
          parameters: [],
          description: "将颜色转换为字符串格式，默认将返回 rgba 格式字符串。",
          returns: "string"
        }
      ],
      returnType: "Colorjs",
      returnDescription: "Colorjs 实例。如果传入的是 Colorjs 实例，则返回该实例本身。",
      examples: [
        {
          framework: "javascript",
          code: codeExamples.colorjs,
          language: "javascript"
        }
      ]
    },
    {
      id: "dayjs",
      name: "dayjs(date)",
      type: "日期处理",
      description: "XGantt 内部使用了 dayjs 插件。该方法是内部 dayjs 对外的一个引用，用户可以在不用额外安装 dayjs 的情况下，直接使用该方法进行日期处理。它同时继承了内部使用到的一些扩展插件以及对应配置。",
      icon: "🗓️",
      parameters: [
        {
          name: "date",
          type: "string | Date | dayjs.Dayjs",
          description: "要处理的日期",
          optional: true
        }
      ],
      returnType: "Dayjs",
      returnDescription: "dayjs 实例，包含了 XGantt 内部使用的所有扩展插件和配置。",
      href: "https://day.js.org/",
    },
    {
      id: "generateId",
      name: "generateId()",
      type: "ID 生成",
      description: "生成一个唯一的 ID，主要用于标识甘特图中的任务。",
      icon: "🆔",
      parameters: [],
      returnType: "string",
      returnDescription: "生成的唯一 ID。",
    },
  ],
};

/**
 * 导出辅助页面配置
 */
export default assistPageConfig;
