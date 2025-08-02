import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import history from 'connect-history-api-fallback'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true,
    port: 3000, 
    cors: false,
    strictPort: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Content-Security-Policy' : "script-src 'self' 'unsafe-inline' mc.yandex.ru yastatic.net 'nonce-erere34r3fdca3df4f'; img-src https://mc.yandex.ru https://strapi.ti-soft.ru https://api.ti-soft.ru http://localhost:3000 https://localhost:3000 data: blob:; child-src blob: https://mc.yandex.ru; frame-src blob: https://mc.yandex.ru; frame-ancestors blob: https://mc.yandex.ru;"
    },
    middleware: [
      history({
        verbose: true,
        disableDotRule: true,
        htmlAcceptHeaders: ['text/html', 'application/xhtml+xml']
      })
    ]
  },
  preview: {
    port: 3000,
  },
  base: '/',
  publicDir: 'public',
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
