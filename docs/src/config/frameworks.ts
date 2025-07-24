/**
 * 框架配置 - 统一管理所有支持框架的信息
 * 包含框架的名称、图标、颜色、文件扩展名等信息
 */

export type FrameworkKey =
  | "javascript"
  | "vue"
  | "react"
  | "angular"
  | "svelte";

/**
 * 框架配置接口
 */
export interface FrameworkConfig {
  /** 框架标识符 */
  key: FrameworkKey;
  /** 显示名称 */
  label: string;
  /** 简短名称（用于徽章等紧凑场景） */
  shortLabel?: string;
  /** 图标标识符 */
  icon: string;
  /** 主题色 */
  color: string;
  /** 文件扩展名 */
  fileExtension: string;
  /** 编程语言（用于代码高亮和编辑器） */
  language: string;
  /** 框架描述 */
  description: string;
  /** 官方网站 */
  website?: string;
  /** 文档链接 */
  docs?: string;
  /** 是否为默认框架 */
  isDefault?: boolean;
  /** 排序权重（数字越小排序越靠前） */
  order: number;
}

/**
 * 支持的框架配置列表
 * 按照 order 字段排序，JavaScript 作为默认框架排在最前面
 */
export const FRAMEWORK_CONFIGS: FrameworkConfig[] = [
  {
    key: "javascript",
    label: "Vanilla JS",
    shortLabel: "JS",
    icon: "vscode-icons:file-type-js-official",
    color: "#f7df1e",
    fileExtension: ".js",
    language: "javascript",
    description: "原生 JavaScript 实现，无需额外框架依赖",
    website: "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript",
    docs: "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript",
    isDefault: true,
    order: 1
  },
  {
    key: "vue",
    label: "Vue 3",
    shortLabel: "Vue",
    icon: "vscode-icons:file-type-vue",
    color: "#4fc08d",
    fileExtension: ".vue",
    language: "typescript",
    description: "基于 Vue 3 的组合式 API 实现",
    website: "https://vuejs.org",
    docs: "https://cn.vuejs.org/guide/",
    order: 2
  },
  {
    key: "react",
    label: "React",
    shortLabel: "React",
    icon: "vscode-icons:file-type-reactjs",
    color: "#61dafb",
    fileExtension: ".tsx",
    language: "typescript",
    description: "基于 React Hooks 的函数式组件实现",
    website: "https://reactjs.org",
    docs: "https://react.docschina.org/",
    order: 3
  },
  {
    key: "angular",
    label: "Angular",
    shortLabel: "Angular",
    icon: "vscode-icons:file-type-angular",
    color: "#dd0031",
    fileExtension: ".ts",
    language: "typescript",
    description: "基于 Angular 的组件化开发",
    website: "https://angular.io",
    docs: "https://angular.cn/docs",
    order: 4
  },
  {
    key: "svelte",
    label: "Svelte",
    shortLabel: "Svelte",
    icon: "vscode-icons:file-type-svelte",
    color: "#ff3e00",
    fileExtension: ".svelte",
    language: "typescript",
    description: "基于 Svelte 的现代前端框架",
    website: "https://svelte.dev",
    docs: "https://svelte.dev/docs",
    order: 5
  }
];

/**
 * 框架配置映射表 - 以 key 为索引的对象
 */
export const FRAMEWORK_CONFIG_MAP: Record<FrameworkKey, FrameworkConfig> =
  FRAMEWORK_CONFIGS.reduce((map, config) => {
    map[config.key] = config;
    return map;
  }, {} as Record<FrameworkKey, FrameworkConfig>);

/**
 * 获取框架配置
 * @param key 框架标识符
 * @returns 框架配置，如果不存在则返回默认配置
 */
export function getFrameworkConfig(key: string): FrameworkConfig {
  return (
    FRAMEWORK_CONFIG_MAP[key as FrameworkKey] || FRAMEWORK_CONFIG_MAP.javascript
  );
}

/**
 * 获取框架显示名称
 * @param key 框架标识符
 * @param useShort 是否使用简短名称
 * @returns 框架显示名称
 */
export function getFrameworkLabel(key: string, useShort = false): string {
  const config = getFrameworkConfig(key);
  return useShort && config.shortLabel ? config.shortLabel : config.label;
}

/**
 * 获取框架图标
 * @param key 框架标识符
 * @returns 框架图标标识符
 */
export function getFrameworkIcon(key: string): string {
  return getFrameworkConfig(key).icon;
}

/**
 * 获取框架颜色
 * @param key 框架标识符
 * @returns 框架主题色
 */
export function getFrameworkColor(key: string): string {
  return getFrameworkConfig(key).color;
}

/**
 * 获取框架语言类型
 * @param key 框架标识符
 * @returns 编程语言标识符
 */
export function getFrameworkLanguage(key: string): string {
  return getFrameworkConfig(key).language;
}

/**
 * 获取默认框架
 * @returns 默认框架配置
 */
export function getDefaultFramework(): FrameworkConfig {
  return (
    FRAMEWORK_CONFIGS.find(config => config.isDefault) || FRAMEWORK_CONFIGS[0]
  );
}

/**
 * 获取所有框架的 key 列表
 * @returns 框架标识符数组
 */
export function getAllFrameworkKeys(): FrameworkKey[] {
  return FRAMEWORK_CONFIGS.map(config => config.key);
}

/**
 * 检查是否为有效的框架
 * @param key 框架标识符
 * @returns 是否为有效框架
 */
export function isValidFramework(key: string): key is FrameworkKey {
  return key in FRAMEWORK_CONFIG_MAP;
}

/**
 * 按顺序获取框架配置列表
 * @returns 按 order 排序的框架配置数组
 */
export function getOrderedFrameworks(): FrameworkConfig[] {
  return [...FRAMEWORK_CONFIGS].sort((a, b) => a.order - b.order);
}
