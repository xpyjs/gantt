import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: true,
      outDir: "./types",
      exclude: ["**/*.test.*", "**/*.spec.*"],
      rollupTypes: false, // 改为 false，保持文件结构
      include: ["src/**/*"], // 明确指定包含的文件
      staticImport: true, // 保持静态导入
      beforeWriteFile: (filePath, content) => {
        // 可选：自定义文件写入前的处理
        return { filePath, content };
      }
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "XGanttVue",
      formats: ["es", "umd"],
      fileName: format => `index.${format === "es" ? "js" : "umd.cjs"}`
    },
    rollupOptions: {
      external: ["vue", "@xpyjs/gantt-core"],
      output: {
        globals: {
          vue: "Vue",
          "@xpyjs/gantt-core": "XGanttCore"
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/__tests__/**",
        "types/**",
        "**/*.d.ts",
        "**/*.config.*",
        "dist/"
      ]
    }
  }
});
