import { CodeBlock } from "@/types/demo";
import { toJSON } from "@/utils/common";
import { cloneDeep } from "lodash-es";

const VERSION = "0.0.1";

const VITE_CONFIG = `import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 6876
  }
});
`;

const PACKAGE_JSON = {
  name: "@xpyjs/gantt-vanilla-typescript-starter",
  private: true,
  version: "0.0.0",
  type: "module",
  scripts: {
    dev: "vite",
    build: "tsc && vite build",
    preview: "vite preview"
  },
  dependencies: {
    "@xpyjs/gantt-core": VERSION
  },
  devDependencies: {
    typescript: "^5.4.5",
    vite: "^5.2.11"
  },
  packageManager: "pnpm@9.1.1",
  engines: {
    node: ">=18.0.0"
  }
};

const TSCONFIG = {
  compilerOptions: {
    target: "ES2020",
    useDefineForClassFields: true,
    lib: ["ES2020", "DOM", "DOM.Iterable"],
    module: "ESNext",
    skipLibCheck: true,

    /* Bundler mode */
    moduleResolution: "bundler",
    allowImportingTsExtensions: true,
    resolveJsonModule: true,
    isolatedModules: true,
    noEmit: true,

    /* Linting */
    strict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noFallthroughCasesInSwitch: true
  },
  include: ["src"],
  references: [{ path: "./tsconfig.node.json" }]
};
const TSCONFIG_NODE = {
  compilerOptions: {
    composite: true,
    skipLibCheck: true,
    module: "ESNext",
    moduleResolution: "bundler",
    allowSyntheticDefaultImports: true
  },
  include: ["vite.config.ts"]
};

const INDEX_HTML = `<!doctype html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>X-Gantt Vanilla Example</title>
    <style>
        html,
        body {
            margin: 0;
            padding: 16px;
            box-sizing: border-box;
        }
    </style>
</head>

<body>
    <div style="width: 100%; height: 400px">
      <div id="gantt-container">loading...</div>
    </div>
    <div id="btn-container"></div>
    <div id="log-container"></div>
    <script type="module" src="/src/main.ts"></script>
</body>

</html>
`;

// 创建 JavaScript 项目文件
export const createJavaScriptProjectFiles = (
  block: CodeBlock
): Record<string, string> => {
  const pkg = cloneDeep(PACKAGE_JSON);
  if (block.dependencies) {
    pkg.dependencies = { ...pkg.dependencies, ...block.dependencies };
  }

  const files: Record<string, string> = {
    "package.json": toJSON(pkg),
    "vite.config.ts": VITE_CONFIG,
    "tsconfig.json": toJSON(TSCONFIG),
    "tsconfig.node.json": toJSON(TSCONFIG_NODE),
    "index.html": INDEX_HTML,
    "src/main.ts": block.code
  };

  if (block.extraFiles) {
    Object.entries(block.extraFiles).forEach(([filePath, content]) => {
      files[`src/${filePath}`] = content;
    });
  }

  return files;
};
