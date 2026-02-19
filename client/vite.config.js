import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5530', // backend NestJS kamu
        changeOrigin: true, // penting biar host header diubah
        secure: false, // nonaktifkan SSL check (kalau http)
      },
      '/ai': {
        target: 'http://localhost:5530', // 🔥 BACKEND NESTJS
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
