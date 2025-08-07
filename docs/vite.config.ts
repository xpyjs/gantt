import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 4000,
    open: true,
    host: true
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
  base: "/gantt/",
  build: {
    outDir: "dist"
  },
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    global: "globalThis"
  },
  worker: {
    format: "es"
  }
});
