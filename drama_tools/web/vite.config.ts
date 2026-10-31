/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  cacheDir: path.resolve(__dirname, 'node_modules/.vite-cache'),
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    port: 5174,
    proxy: {
      // 默认对齐后端 .env 的 PORT=8731，避免前后端端口各写一套导致联调 404/500
      '/api': { target: process.env.VITE_API_PROXY || 'http://127.0.0.1:8731', changeOrigin: true },
      '/media': { target: process.env.VITE_API_PROXY || 'http://127.0.0.1:8731', changeOrigin: true },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    cacheDir: path.resolve(__dirname, 'node_modules/.vitest'),
  },
});
