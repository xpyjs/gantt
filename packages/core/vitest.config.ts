import { defineConfig } from "vitest/config";
import path from "node:path";
import { createRequire } from "node:module";

// konva 的 main 指向 node 构建（依赖原生 canvas 包），测试环境使用
// browser 构建在 jsdom 中运行
const require = createRequire(import.meta.url);
const konvaBrowser = path.dirname(require.resolve("konva/lib/index.js"));

export default defineConfig({
  resolve: {
    alias: {
      konva: konvaBrowser
    }
  },
  test: {
    // 启用类似 jest 的全局测试 API
    globals: true,
    // 模拟浏览器环境
    environment: "jsdom",
    // 覆盖率配置
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/utils/**"],
      exclude: [
        "coverage/**",
        "dist/**",
        "test/**",
        "**/*.test.ts",
        "**/*.d.ts"
      ]
    }
  }
});
