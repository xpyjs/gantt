import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import glob from 'fast-glob';
import eslintPlugin from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig(async () => ({
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

  optimizeDeps: {
    include: (
      await glob(['dayjs/locale/*.js'], {
        cwd: path.resolve(__dirname, 'node_modules')
      })
    ).map(p => p.replace(/\.js$/, ''))
  },

  build: {
    // sourcemap: true,
    target: 'modules',
    minify: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'index',
      fileName: format => `index.${format}.js`
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
}));
