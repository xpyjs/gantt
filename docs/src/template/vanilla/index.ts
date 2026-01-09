import { CodeBlock } from "@/types/demo";
import { SandpackFile } from "sandpack-vue3";

const INDEX_HTML = `<!DOCTYPE html>
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
    <script type="module" src="/index.ts"></script>
</body>

</html>
`;

// 创建 Sandpack 用的 Vanilla 文件
export const createSandpackVanillaFiles = (
  _block: CodeBlock
): Record<string, string | SandpackFile> => {
  const files: Record<string, string | SandpackFile> = {
    "index.html": { code: INDEX_HTML, hidden: true },
  };

  return files;
};
