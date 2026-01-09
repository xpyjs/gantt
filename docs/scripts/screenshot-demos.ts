/**
 * Demo 截图脚本
 *
 * 使用 Playwright 自动化访问每个 demo 页面，等待 Sandpack 渲染完成后截图
 *
 * 用法：
 *   pnpm run screenshot
 *
 * 脚本会自动启动开发服务器，完成截图后自动关闭
 */

import { chromium, Browser, Page } from "playwright";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { spawn, ChildProcess } from "child_process";

// ESM 模块下获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const CONFIG = {
  // 文档开发服务器端口
  port: 4173,
  // 截图输出目录（相对于 docs 目录）
  outputDir: "src/demos",
  // 截图尺寸（viewport）
  viewportWidth: 1280,
  viewportHeight: 800,
  // 预览区域截图尺寸
  clipWidth: 600,
  clipHeight: 400,
  // Sandpack 加载超时时间（毫秒）
  timeout: 30000,
  // 额外等待时间（毫秒），确保甘特图渲染完成
  extraWait: 3000
};

// 获取服务器地址
function getBaseUrl(): string {
  return `http://localhost:${CONFIG.port}/gantt`;
}

// Demo 配置类型
interface DemoInfo {
  id: string;
  category: string;
  framework: string;
  path: string;
}

// 从配置文件中获取所有 demo 信息
async function getDemoList(): Promise<DemoInfo[]> {
  const configPath = path.resolve(__dirname, "../src/config/demos/index.ts");
  const configContent = fs.readFileSync(configPath, "utf-8");

  const demos: DemoInfo[] = [];

  // 提取所有 path 配置
  const pathRegex = /path:\s*["']([^"']+)["']/g;
  const paths: string[] = [];

  let match;
  while ((match = pathRegex.exec(configContent)) !== null) {
    paths.push(match[1]);
  }

  // 从路径中提取 demo 信息
  // 路径格式: category/id/framework
  const seenDemos = new Set<string>();

  for (const demoPath of paths) {
    const parts = demoPath.split("/");
    if (parts.length >= 3) {
      const category = parts[0];
      const id = parts[1];
      const framework = parts[2];
      const demoKey = `${category}/${id}`;

      // 只保留第一个（优先 javascript）
      if (!seenDemos.has(demoKey)) {
        // 检查是否有 javascript 版本
        const jsPath = `${category}/${id}/javascript`;
        const hasJs = paths.some(p => p === jsPath);

        if (framework === "javascript" || !hasJs) {
          seenDemos.add(demoKey);
          demos.push({
            id,
            category,
            framework,
            path: demoPath
          });
        }
      }
    }
  }

  return demos;
}

// 启动开发服务器
async function startServer(): Promise<ChildProcess> {
  return new Promise((resolve, reject) => {
    console.log("🚀 启动预览服务器...");

    const docsDir = path.resolve(__dirname, "..");
    const server = spawn("npx", ["vite", "preview", "--port", String(CONFIG.port)], {
      cwd: docsDir,
      shell: true,
      stdio: ["ignore", "pipe", "pipe"]
    });

    let started = false;

    const checkServer = () => {
      // 使用 Playwright 检测服务器是否已启动
      chromium.launch({ headless: true }).then(async (browser) => {
        const page = await browser.newPage();
        try {
          await page.goto(getBaseUrl(), { timeout: 5000, waitUntil: "domcontentloaded" });
          if (!started) {
            started = true;
            console.log(`✅ 服务器已启动: ${getBaseUrl()}\n`);
            resolve(server);
          }
        } catch {
          // 服务器还没准备好，继续等待
        } finally {
          await browser.close();
        }
      });
    };

    // 每秒检测一次服务器是否启动
    const checkInterval = setInterval(() => {
      if (!started) {
        checkServer();
      } else {
        clearInterval(checkInterval);
      }
    }, 1000);

    server.stdout?.on("data", (data: Buffer) => {
      const output = data.toString();
      console.log("服务器输出:", output.trim());
    });

    server.stderr?.on("data", (data: Buffer) => {
      const output = data.toString();
      // 忽略 deprecation 警告
      if (!output.includes("Deprecation Warning")) {
        console.error("服务器错误:", output);
      }
    });

    server.on("error", (err) => {
      clearInterval(checkInterval);
      reject(new Error(`启动服务器失败: ${err.message}`));
    });

    // 超时检测
    setTimeout(() => {
      if (!started) {
        clearInterval(checkInterval);
        server.kill();
        reject(new Error("服务器启动超时"));
      }
    }, 60000);
  });
}

// 等待 Sandpack 预览加载完成
async function waitForSandpackReady(page: Page): Promise<boolean> {
  try {
    // 等待 Sandpack 容器出现
    await page.waitForSelector(".sp-wrapper", { timeout: CONFIG.timeout });

    // 等待预览 iframe 出现
    await page.waitForSelector(".sp-preview-iframe", { timeout: CONFIG.timeout });

    // 等待 loading 消失（如果有的话）
    try {
      await page.waitForSelector(".sp-loading", { state: "hidden", timeout: 5000 });
    } catch {
      // loading 可能不存在，忽略
    }

    // 额外等待，确保甘特图完全渲染
    await page.waitForTimeout(CONFIG.extraWait);

    return true;
  } catch (error) {
    console.error("等待 Sandpack 超时:", error);
    return false;
  }
}

// 截取 Sandpack 预览区域
async function capturePreview(
  page: Page,
  outputPath: string
): Promise<boolean> {
  try {
    // 获取预览 iframe 元素
    const previewFrame = await page.$(".sp-preview-iframe");
    if (!previewFrame) {
      console.error("找不到预览 iframe");
      return false;
    }

    // 获取 iframe 的边界
    const boundingBox = await previewFrame.boundingBox();
    if (!boundingBox) {
      console.error("无法获取预览区域边界");
      return false;
    }

    // 截取预览区域
    await page.screenshot({
      path: outputPath,
      clip: {
        x: boundingBox.x,
        y: boundingBox.y,
        width: Math.min(boundingBox.width, CONFIG.clipWidth),
        height: Math.min(boundingBox.height, CONFIG.clipHeight)
      }
    });

    return true;
  } catch (error) {
    console.error("截图失败:", error);
    return false;
  }
}

// 确保目录存在
function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 主函数
async function main() {
  console.log("📸 Demo 截图工具\n");

  // 先构建项目
  console.log("🔨 构建项目...");
  const buildResult = await new Promise<boolean>((resolve) => {
    const build = spawn("npx", ["vite", "build"], {
      cwd: path.resolve(__dirname, ".."),
      shell: true,
      stdio: "inherit"
    });
    build.on("close", (code) => resolve(code === 0));
  });

  if (!buildResult) {
    console.error("❌ 构建失败");
    process.exit(1);
  }
  console.log("✅ 构建完成\n");

  // 启动预览服务器
  let server: ChildProcess | null = null;
  try {
    server = await startServer();
  } catch (error) {
    console.error(`❌ ${error}`);
    process.exit(1);
  }

  // 获取 demo 列表
  const demos = await getDemoList();
  console.log(`📋 找到 ${demos.length} 个 Demo\n`);

  if (demos.length === 0) {
    console.error("❌ 未找到任何 Demo 配置");
    server?.kill();
    process.exit(1);
  }

  // 启动浏览器
  const browser: Browser = await chromium.launch({
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: CONFIG.viewportWidth, height: CONFIG.viewportHeight }
  });

  const page: Page = await context.newPage();

  // 统计
  let success = 0;
  let failed = 0;
  let skipped = 0;
  const failedDemos: string[] = [];
  const skippedDemos: string[] = [];
  const baseUrl = getBaseUrl();

  // 遍历所有 demo
  for (const demo of demos) {
    const demoUrl = `${baseUrl}/demo/${demo.category}/${demo.id}?framework=${demo.framework}`;
    // 输出到 demos/{category}/{id}/screenshot.png
    const outputDir = path.resolve(
      __dirname,
      "..",
      CONFIG.outputDir,
      demo.category,
      demo.id
    );
    const outputPath = path.join(outputDir, "screenshot.png");

    // 检查截图是否已存在
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  跳过: ${demo.category}/${demo.id} (截图已存在)`);
      skipped++;
      skippedDemos.push(`${demo.category}/${demo.id}`);
      continue;
    }

    console.log(`📸 正在截图: ${demo.category}/${demo.id}`);

    try {
      // 确保输出目录存在
      ensureDir(outputDir);

      // 导航到 demo 页面
      await page.goto(demoUrl, { waitUntil: "networkidle", timeout: 60000 });

      // 等待 Sandpack 加载完成
      const ready = await waitForSandpackReady(page);
      if (!ready) {
        throw new Error("Sandpack 加载超时");
      }

      // 截取预览
      const captured = await capturePreview(page, outputPath);
      if (!captured) {
        throw new Error("截图失败");
      }

      // 获取文件大小
      const stats = fs.statSync(outputPath);
      const sizeKB = (stats.size / 1024).toFixed(1);

      console.log(`   ✅ 成功 (${sizeKB} KB)\n`);
      success++;
    } catch (error) {
      console.error(`   ❌ 失败: ${error}\n`);
      failed++;
      failedDemos.push(`${demo.category}/${demo.id}`);
    }
  }

  // 关闭浏览器
  await browser.close();

  // 关闭服务器
  server?.kill();

  // 输出统计
  console.log("\n📊 截图完成统计:");
  console.log(`   ✅ 成功: ${success}`);
  console.log(`   ⏭️  跳过: ${skipped}`);
  console.log(`   ❌ 失败: ${failed}`);

  if (skippedDemos.length > 0) {
    console.log("\n跳过的 Demo (已有截图):");
    skippedDemos.forEach(d => console.log(`   - ${d}`));
  }

  if (failedDemos.length > 0) {
    console.log("\n失败的 Demo:");
    failedDemos.forEach(d => console.log(`   - ${d}`));
  }

  console.log("\n🎉 截图任务完成!");
}

// 运行
main().catch(console.error);
