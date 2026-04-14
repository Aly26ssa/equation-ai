import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/equation-ai/',
  plugins: [react()],
  server: {
    // Browser → same-origin `/api/ollama/...` → Ollama on localhost (avoids CORS in dev).
    proxy: {
      '/api/ollama': {
        target: 'http://127.0.0.1:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ollama/, ''),
      },
    },
  },
  // `vite preview` does not inherit `server.proxy`; mirror it for local production builds.
  preview: {
    proxy: {
      '/api/ollama': {
        target: 'http://127.0.0.1:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ollama/, ''),
      },
    },
  },
})
