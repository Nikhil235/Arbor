import { useEffect } from 'react'
import { Outlet, useLocation, useMatches } from 'react-router'
import { Header } from './Header'
import { Footer } from './Footer'
import { ToastProvider } from './toast'

export type HeaderTone = 'dark' | 'light' | 'auth'

function useHeaderTone(): HeaderTone {
  const matches = useMatches()
  const handle = matches[matches.length - 1]?.handle as { tone?: HeaderTone } | undefined
  return handle?.tone ?? 'light'
}

/** Scrolls to the top on navigation, or to the hash target when one is present. */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
      return
    }
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}

export function Layout() {
  const tone = useHeaderTone()

  return (
    <ToastProvider>
      <ScrollManager />
      <a
        href="#main"
        className="fixed left-3 top-3 z-[60] -translate-y-[200%] rounded-lg bg-ink px-3 py-2 text-[13px] font-medium text-white focus:translate-y-0"
      >
        Skip to content
      </a>
      <div className="min-h-screen bg-canvas text-ink">
        {tone !== 'auth' && <Header tone={tone} />}
        <main id="main" tabIndex={-1} className="outline-none">
          <Outlet />
        </main>
        {tone !== 'auth' && <Footer />}
      </div>
    </ToastProvider>
  )
}
