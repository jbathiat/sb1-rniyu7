import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  build: {
    rollupOptions: {
      plugins: [nodePolyfills()],
    }
  },
  resolve: {
    alias: {
      path: 'rollup-plugin-node-polyfills/polyfills/path',
      os: 'rollup-plugin-node-polyfills/polyfills/os'
    }
  }
});