import { UiViewOption } from "@stackblitz/sdk";

// 代码块类型定义 - 与教程保持一致
export interface CodeBlock {
  framework: string; // 框架标识，用于匹配 tabs（javascript, vue, react）
  code: string; // 代码内容
  language: string; // 语言标识，用于语法高亮（javascript, vue, tsx）
  dependencies?: Record<string, string>; // 依赖包
  extraFiles?: Record<string, string>; // 额外文件
  view?: UiViewOption; // 视图类型（默认 default，可选有 default、fullscreen、split）
}

// 演示配置类型定义
export interface DemoConfig {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "basic" | "intermediate" | "advanced";
  tags: string[];
  code: CodeBlock[]; // 使用代码块数组替代框架对象
}

export interface DemoCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  demos: DemoConfig[];
}

// 框架类型
export type Framework = "vanilla" | "vue" | "react";

// 编辑器主题
export type EditorTheme = "vs-dark" | "vs-light";

// 布局模式
export type LayoutMode = "horizontal" | "vertical";
