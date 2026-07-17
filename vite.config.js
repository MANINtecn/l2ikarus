import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    // dev local: repassa /api pro site em producao (senao todo fetch falha e o
    // status aparece OFFLINE mesmo com o servidor on — so afeta npm run dev)
    proxy: {
      '/api': {
        target: 'https://www.l2ikarus.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
