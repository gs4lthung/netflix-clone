import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'

export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      "/api":{
        target:"http://localhost:4444",
      }
    }
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  }
})
