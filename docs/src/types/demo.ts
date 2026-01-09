// 代码块类型定义 - 使用文件夹路径模式
export interface CodeBlock {
  framework: string; // 框架标识（javascript, vue, react）
  language: string; // 语言标识，用于语法高亮（javascript, vue, tsx）
  path: string; // 相对于 demos 目录的路径，如 "basic/simple/javascript"
  dependencies?: Record<string, string>; // 额外依赖包
  view?: 'default' | 'preview'; // 视图模式
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
