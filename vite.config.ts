import { defineConfig } from 'vite';
export default defineConfig({ base: './', build: { target: 'es2022', chunkSizeWarningLimit: 650, rollupOptions: { output: { manualChunks: { three: ['three'], ink: ['inkjs'], navigation: ['yuka'] } } } }, server: { port: 5173, strictPort: true } });
