import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  plugins: [
    react(),
    {
      name: 'czard-captured-route-fallback',
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          const pathname = request.url?.split('?')[0] ?? ''
          const routePrefixes = ['/products/', '/collections/', '/pages/', '/blogs/', '/policies/']
          const isCapturedRoute =
            pathname === '/cart' ||
            pathname === '/collections' ||
            routePrefixes.some((prefix) => pathname.startsWith(prefix))

          if (!isCapturedRoute || pathname.endsWith('.html')) {
            next()
            return
          }

          const routePath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
          request.url = `/www.czard.com${routePath}.html`
          next()
        })
      },
    },
  ],
})
