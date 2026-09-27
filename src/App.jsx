import { useRef } from 'react'
import './App.css'

function App() {
  const storefrontFrame = useRef(null)

  function handleStorefrontLoad() {
    const document = storefrontFrame.current?.contentDocument
    if (!document) return

    function capturedRoute(link) {
      const url = new URL(link.href)
      if (url.origin !== window.location.origin) return

      const routePrefixes = ['/products/', '/collections/', '/pages/', '/blogs/', '/cart']
      const routePath = url.pathname.startsWith('/www.czard.com/')
        ? url.pathname.slice('/www.czard.com'.length)
        : url.pathname
      if (!routePrefixes.some((prefix) => routePath.startsWith(prefix))) return
      if (routePath.endsWith('.html') || routePath.endsWith('/')) return

      return `/www.czard.com${routePath}.html${url.search}${url.hash}`
    }

    document.querySelectorAll('a').forEach((link) => {
      const route = capturedRoute(link)
      if (route) link.href = route
    })

    document.addEventListener('click', (event) => {
      const link = event.target.closest('a')
      if (!link) return
      const route = capturedRoute(link)
      if (!route) return
      event.preventDefault()
      event.stopImmediatePropagation()
      storefrontFrame.current.src = route
    }, true)
  }

  return (
    <main className="storefront-shell">
      <iframe
        className="storefront-frame"
        ref={storefrontFrame}
        src="/www.czard.com/index.html"
        title="House of CZARD storefront"
        onLoad={handleStorefrontLoad}
      />
    </main>
  )
}

export default App
