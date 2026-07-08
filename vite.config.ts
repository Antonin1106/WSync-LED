import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve the current directory since __dirname is not available in ES modules.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Toggle production-specific options (e.g. CSS class naming).
const IS_PROD = false;

// Global SCSS code automatically injected into every SCSS file.
const scssToImport = '';

// More informations at https://vite.dev/config/
export default defineConfig({
  // Use relative asset paths to make the build portable.
  base: './',

  // Enable React support and bundle the application into a single HTML file.
  plugins: [react(), viteSingleFile()],

  // Configure import aliases for cleaner and shorter paths.
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  css: {
    modules: {
      // Use readable class names during development and shorter hashed names for production.
      generateScopedName: IS_PROD ? '[hash:base64:12]' : '[local]_[hash:base64:5]',
    },

    // Global configuration for CSS preprocessors.
    preprocessorOptions: {
      scss: {
        // Inject shared SCSS variables, mixins or imports into every SCSS file.
        additionalData: scssToImport,
      },
    },
  },
});