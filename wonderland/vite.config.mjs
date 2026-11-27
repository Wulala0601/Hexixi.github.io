import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.SITE_BASE_PATH || '/',
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    // 编辑器原子写入会在 src 下留下临时目录，Windows 上 watcher 抢锁会直接把 dev server 打挂
    watch: { ignored: ['**/.*.tmpdir/**', '**/*.tmp'] },
  },
  build: {
    rollupOptions: {
      output: { manualChunks: { three: ['three', '@react-three/fiber', '@react-three/drei'] } },
    },
  },
})
