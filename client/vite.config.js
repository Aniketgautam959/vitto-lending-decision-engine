import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Needed for Docker and Network access
    proxy: {
      '/api': {
        target: process.env.API_PROXY_URL || 'http://localhost:5005',
        changeOrigin: true,
      },
    },
  },
})
