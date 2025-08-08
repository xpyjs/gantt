import { CodeBlock } from "@/types/demo";
import { toJSON } from "@/utils/common";
import { cloneDeep } from "lodash-es";

const VERSION = "0.0.1-alpha.5";

const VITE_CONFIG = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})`;

const PACKAGE_JSON = {
  name: "@xpyjs/gantt-react-typescript-starter",
  private: true,
  version: "0.0.0",
  type: "module",
  scripts: {
    dev: "vite",
    build: "tsc && vite build",
    preview: "vite preview"
  },
  dependencies: {
    "@xpyjs/gantt-react": VERSION,
    react: "^18.3.1",
    "react-dom": "^18.3.1"
  },
  devDependencies: {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
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

const INDEX_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div style="width: 100%; height: 500px">
      <div id="root"></div>
    </div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

const MAIN_TSX = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)`;

// 创建 React 项目文件
export const createReactProjectFiles = (
  block: CodeBlock
): Record<string, string> => {
  const pkg = cloneDeep(PACKAGE_JSON);
  if (block.dependencies) {
    pkg.dependencies = { ...pkg.dependencies, ...block.dependencies };
  }

  return {
    "package.json": toJSON(pkg),
    "vite.config.ts": VITE_CONFIG,
    "tsconfig.json": toJSON(TSCONFIG),
    "tsconfig.node.json": toJSON(TSCONFIG_NODE),
    "index.html": INDEX_HTML,
    "src/vite-env.d.ts": `/// <reference types="vite/client" />\n`,
    "src/main.tsx": MAIN_TSX,
    "src/App.tsx": block.code
  };
};
