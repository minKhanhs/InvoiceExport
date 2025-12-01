import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,                    // quan trọng: cho Docker expose ra ngoài
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true             // quan trọng trên Windows + Docker volume
    }
  },
  preview: {
    host: true,
    port: 4173                    // cổng khi chạy production trong Docker
  }
})