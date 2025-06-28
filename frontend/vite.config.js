import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This proxy is for development. It forwards API requests
    // from the frontend (e.g., /api/apod) to our backend server.
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // Your backend's address
        changeOrigin: true,
      },
    },
  },
})