import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Generate a pseudo-random unique cache name at each build to store the file offline
const CACHE_NAME = `pwa-${Date.now().toString(36)}-${Math.random()
  .toString(36)
  .slice(2, 8)}`;

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  define: {
    __CACHE_NAME__: JSON.stringify(CACHE_NAME),
  },
})
