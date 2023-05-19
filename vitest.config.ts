import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  test: {
    alias: {
      '@': '/src'
    },
    environment: 'happy-dom',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'tests/unit/old/**',
      '/src/assets/**'
    ],
    include: ['tests/**/*.spec.ts'],
    coverage: {
      // 覆盖率提供者
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      // 设置覆盖文件夹
      reportsDirectory: './coverage'
    }
  }
});
