import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: '../backend/public',
    emptyOutDir: true,
    rollupOptions: {
      input: './index.html'
    }
  }
});
