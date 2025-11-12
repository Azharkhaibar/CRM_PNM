import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5530', // backend NestJS kamu
        changeOrigin: true, // penting biar host header diubah
        secure: false, // nonaktifkan SSL check (kalau http)
      },
    },
  },
});
