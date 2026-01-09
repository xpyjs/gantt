/**
 * Demo 文件加载器
 *
 * 使用 import.meta.glob 动态加载 demos 目录下的所有文件
 * 这些文件会被转换为 Sandpack 可用的格式
 */
// 基础 demo 路径
export const BASE_DEMO_PATH = '/src/demos/';
import { createSandpackVueFiles } from "@/template/vue";
import { createSandpackVanillaFiles } from "@/template/vanilla";
import { createSandpackReactFiles } from "@/template/react";
import { CodeBlock } from "@/types/demo";
import { SandpackFile } from "sandpack-vue3";

// 加载所有 demo 文件（以原始字符串形式）
const demoFiles = import.meta.glob<string>('/src/demos/**/*.*', {
  query: '?raw',
  import: 'default',
  eager: true
});

export interface DemoFiles {
  [fileName: string]: string | SandpackFile;
}

/**
 * 获取指定 demo 的所有文件
 * @param path 文件路径
 * @returns 文件映射对象
 */
export function getDemoFiles(path: string): DemoFiles {
  const result: DemoFiles = {};
  const basePath = `${BASE_DEMO_PATH}${path}/`.replace(/\/+/g, '/');

  for (const [_path, content] of Object.entries(demoFiles)) {
    if (_path.startsWith(basePath)) {
      result[_path.slice(basePath.length)] = content;
    }
  }

  return result;
}

/**
 * 为 Sandpack 准备文件
 * 将文件转换为 Sandpack 需要的格式
 */
export function prepareSandpackFiles(
  files: DemoFiles,
  framework: string = 'javascript',
  block?: CodeBlock
): Record<string, string | SandpackFile> {
  let result: DemoFiles = {};

  for (const [fileName, content] of Object.entries(files)) {
    // 开头以匹配 Sandpack 模板结构
    let sandpackPath = fileName.startsWith('/') ? fileName : `/${fileName}`;
    result[sandpackPath] = content;
  }

  /** Sandpack 模板入口:
  /*   - vite (vanilla): index.ts
  /*   - vite-vue: /src/App.vue + /src/main.ts
  /*   - vite-react-ts: /App.tsx + /index.tsx
  */
  if (block) {
    if (framework.includes('vue')) {
      const vueFiles = createSandpackVueFiles(block);
      result = Object.assign({}, vueFiles, result);
    } else if (framework.includes('react')) {
      const reactFiles = createSandpackReactFiles(block);
      result = Object.assign({}, reactFiles, result);
    } else {
      const vanillaFiles = createSandpackVanillaFiles(block);
      result = Object.assign({}, vanillaFiles, result);
    }
  }

  return result;
}
