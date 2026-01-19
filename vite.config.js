import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Use root path for local dev, base path for production deployment
  base: mode === 'production' ? '/frontend-user-service/' : '/',
  server: {
    host: '0.0.0.0',  // Allow external access (required for Docker)
    port: 5173,
    watch: {
      usePolling: true  // Docker volume file watching
    },
    proxy: {
      // Proxy auth API requests
      '/api/auth': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/auth/, '/auth')
      },
      // Proxy user/scooter API requests
      '/api/v1': {
        target: 'http://localhost:3002',
        changeOrigin: true
      }
    }
  }
}))
