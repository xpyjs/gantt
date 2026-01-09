import { CodeBlock } from "@/types/demo";
import { SandpackFile } from "sandpack-vue3";

const INDEX_HTML = `<!DOCTYPE html>
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
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
`;

const MAIN_TSX = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)`;

const STYLE_CSS = `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

#root {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.demo-container {
  width: 100%;
  height: 100%;
}`;

// 创建 Sandpack 用的 React 文件
export const createSandpackReactFiles = (
  _block: CodeBlock
): Record<string, string | SandpackFile> => {
  const files: Record<string, string | SandpackFile> = {
    "/index.html": { code: INDEX_HTML, hidden: true },
    "/index.tsx": { code: MAIN_TSX, hidden: true },
    "/styles.css": { code: STYLE_CSS, hidden: true }
  };

  return files;
};
