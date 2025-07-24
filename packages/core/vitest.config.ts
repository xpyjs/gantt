import { defineConfig } from "vitest/config";

export default defineConfig({
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
