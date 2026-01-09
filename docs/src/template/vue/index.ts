import { CodeBlock } from "@/types/demo";
import { SandpackFile } from "sandpack-vue3";

const INDEX_HTML = `<!DOCTYPE html>
<html lang="zh-CN">

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
import App from "/src/App.vue";
import "/src/styles.css";

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

// 创建 Sandpack 用的 Vue 文件
export const createSandpackVueFiles = (
  _block: CodeBlock
): Record<string, string | SandpackFile> => {
  const files: Record<string, string | SandpackFile> = {
    "/index.html": { code: INDEX_HTML, hidden: true },
    "/src/main.ts": { code: MAIN_TS, hidden: true },
    "/src/styles.css": { code: STYLE_CSS, hidden: true },
  };

  return files;
};
