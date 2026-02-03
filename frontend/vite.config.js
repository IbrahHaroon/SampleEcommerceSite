import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages base path
  // For project pages: use '/your-repo-name/'
  // For user/organization pages: use '/'
  base: process.env.VITE_BASE_PATH || '/',
})
