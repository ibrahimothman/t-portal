import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// Configure dev server options


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()], // Adds React and TailwindCSS plugins to Vite
  base: '/t-portal/', // 👈 replace with your repository name

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  optimizeDeps: {
    include: ['@emotion/react', '@emotion/styled'], // Pre-bundles Emotion deps for faster dev
  },

})
