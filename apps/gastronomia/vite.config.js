import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared-ui': path.resolve(__dirname, '../../packages/shared-ui'),
      '@shared-data': path.resolve(__dirname, '../../packages/shared-data'),
      '@shared-styles': path.resolve(__dirname, '../../packages/shared-styles'),
      '@shared-hooks': path.resolve(__dirname, '../../packages/shared-hooks')
    }
  },
  server: {
    port: 3003
  }
})
