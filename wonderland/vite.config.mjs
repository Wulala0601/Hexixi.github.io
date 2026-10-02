import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.SITE_BASE_PATH || '/',
  plugins: [react()],
  server: { port: 5173, strictPort: true },
  build: {
    rollupOptions: {
      output: { manualChunks: { three: ['three', '@react-three/fiber', '@react-three/drei'] } },
    },
  },
})
