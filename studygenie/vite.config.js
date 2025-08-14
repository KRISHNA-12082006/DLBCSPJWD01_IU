// studygenie/vite.config.js

/**
 * Features:
 * - Enables React support with @vitejs/plugin-react
 * - Integrates Tailwind CSS (v4+) with @tailwindcss/vite plugin
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),       // React JSX/TSX support
    tailwindcss()  // Tailwind CSS integration
  ],
  build: {
    outDir: 'dist',
  },
});

/**
 * Approach Explanation:
 * - Uses Vite's defineConfig for clean config syntax.
 * - React plugin adds Fast Refresh and JSX transforms.
 * - Tailwind Vite plugin enables rapid styling.
 */
