import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@kit': path.resolve(__dirname, '../../packages/demo-kit')
    }
  },
  server: { port: 3011 },
  build: { outDir: 'dist' }
})
