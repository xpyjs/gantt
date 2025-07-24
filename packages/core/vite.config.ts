import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { readFileSync } from "node:fs";

// 读取 package.json 中的版本号
const packageJson = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf-8")
);

export default defineConfig({
  define: {
    // 在构建时注入版本号
    __VERSION__: JSON.stringify(packageJson.version)
  },
  plugins: [
    // Type definitions are generated separately via scripts/build-types.js
    // dts({
    //   tsconfigPath: "./tsconfig.json",
    //   insertTypesEntry: true, // Create single types entry point
    //   outDir: "types",
    //   copyDtsFiles: true,
    //   rollupTypes: true, // Bundle all type definitions into single file
    //   exclude: ["test/**/*", "**/*.test.ts", "./src/**/types"]
    // })
  ],
  build: {
    sourcemap: false,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "XGantt", // UMD build name
      fileName: format => `x-gantt.${format === "umd" ? "umd.cjs" : "js"}`,
      formats: ["es", "umd"]
    },
    rollupOptions: {
      // Externalize peer dependencies - these should not be bundled
      external: ["konva", "dayjs", "lodash-es"],
      output: {
        // Global variables to use in the UMD build for externalized deps
        globals: {
          konva: "Konva",
          dayjs: "dayjs",
          "lodash-es": "_"
        },
        // Ensure CSS is extracted to a consistent filename
        assetFileNames: assetInfo => {
          if (assetInfo.name === "style.css") return "style.css";
          return assetInfo.name || "";
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // You can add global SCSS variables/mixins here if needed
        // additionalData: `@import "./src/styles/base/_variables.scss";`
      }
    }
  }
});
