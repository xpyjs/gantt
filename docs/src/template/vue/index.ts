import { CodeBlock } from "@/types/demo";
import { toJSON } from "@/utils/common";
import { cloneDeep } from "lodash-es";

const VERSION = "0.0.1-rc.5";

const VITE_CONFIG = `import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 4567
  }
});`;

const PACKAGE_JSON = {
  name: "@xpyjs/gantt-vue-typescript-starter",
  private: true,
  version: "0.0.0",
  type: "module",
  scripts: {
    dev: "vite",
    build: "tsc && vite build",
    preview: "vite preview"
  },
  dependencies: {
    "@xpyjs/gantt-vue": VERSION,
    vue: "^3.4.0"
  },
  devDependencies: {
    "@vitejs/plugin-vue": "^5.0.0",
    typescript: "^5.2.0",
    vite: "^5.0.0",
    "vue-tsc": "^1.8.0"
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
    jsx: "react-jsx",

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

const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>XGantt Vue Example</title>
</head>

<body>
    <div style="width: 100%; height: 500px">
      <div id="app"></div>
    </div>
    <script type="module" src="/src/main.ts"></script>
</body>

</html>
`;

const MAIN_TS = `import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

const app = createApp(App);
app.mount("#app");`;

const STYLE_CSS = `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

#app {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.demo-container {
  width: 100%;
  height: 100%;
}`;

// 创建 Vue 项目文件
export const createVueProjectFiles = (
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
    "src/vite-env.d.ts": `/// <reference types="vite/client" />\n`,
    "src/main.ts": block.customFiles?.['src/main.ts'] || MAIN_TS,
    "src/App.vue": block.code,
    "src/style.css": STYLE_CSS
  };

  if (block.extraFiles) {
    Object.entries(block.extraFiles).forEach(([filePath, content]) => {
      files[`src/${filePath}`] = content;
    });
  }

  return files;
};
