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
      '@': path.resolve(__dirname, '../src'),
      components: path.resolve(__dirname, '../src/components'),
      styles: path.resolve(__dirname, '../src/styles'),
      utils: path.resolve(__dirname, '../src/utils')
    }
  },

  base: 'https://jeremyjone.github.io/jz-gantt/demo/',

  build: {
    outDir: path.resolve(__dirname, '../gh-pages/demo')
  }
});
