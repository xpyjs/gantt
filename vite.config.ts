import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import eslintPlugin from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslintPlugin({
      include: ['src/**/*.js', 'src/**/*.vue', 'src/**/*.ts']
    })
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      components: path.resolve(__dirname, 'src/components'),
      styles: path.resolve(__dirname, 'src/styles'),
      utils: path.resolve(__dirname, 'src/utils')
    }
  },

  // base: 'https://docs.xiaopangying.com/gantt-demo/',

  build: {
    cssCodeSplit: true,
    // sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'jz-gantt',
      fileName: format => `jz-gantt.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      preserveEntrySignatures: 'strict',
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
});
