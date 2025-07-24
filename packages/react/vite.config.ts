import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      include: ["src/**/*"],
      exclude: ["src/**/*.test.*", "src/**/*.spec.*"],
      outDir: "dist",
      insertTypesEntry: true,
      copyDtsFiles: true,
      rollupTypes: true
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@xpyjs/gantt-core/style.css";`
      }
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "XGanttReact",
      formats: ["es", "cjs"],
      fileName: format => `index.${format === "es" ? "js" : "cjs"}`
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@xpyjs/gantt-core"
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
          "@xpyjs/gantt-core": "XGanttCore"
        },
        // 确保样式文件被正确导出
        assetFileNames: assetInfo => {
          if (assetInfo.name === "style.css") {
            return "style.css";
          }
          return assetInfo.name!;
        }
      }
    },
    sourcemap: false,
    minify: false,
    // 生成样式文件
    cssCodeSplit: false
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  }
});
