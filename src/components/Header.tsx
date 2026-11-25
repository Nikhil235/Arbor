import { useCallback, useEffect, useId, useRef, useState, type RefObject } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { ChevronDown, Menu, X } from 'lucide-react'
import { NAV_GROUPS, type NavGroup } from '@/content/site'
import { ArborLogo, ButtonLink, cx } from './ui'

const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

function Dropdown({ group, dark }: { group: NavGroup; dark: boolean }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | null>(null)
  const menuId = useId()
  const { pathname, hash } = useLocation()

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  useEffect(() => {
    setOpen(false)
    clearCloseTimer()
  }, [pathname, hash, clearCloseTimer])

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer])

  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        ref.current?.querySelector('button')?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const groupActive = group.items.some((item) => !item.soon && item.to.split('#')[0] === pathname)

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        if (!isFinePointer()) return
        clearCloseTimer()
        setOpen(true)
      }}
      onMouseLeave={() => {
        if (!isFinePointer()) return
        clearCloseTimer()
        closeTimer.current = window.setTimeout(() => setOpen(false), 120)
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => {
          clearCloseTimer()
          setOpen((v) => !v)
        }}
        className={cx(
          'flex items-center gap-1 rounded-full px-3 py-2 transition-[transform,color] duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97]',
          dark ? 'text-white/85 hover:text-white' : 'text-ink-secondary hover:text-ink',
          groupActive && (dark ? 'text-white font-medium' : 'text-ink font-medium'),
        )}
      >
        {group.label}
        <ChevronDown
          className={cx('h-3.5 w-3.5 transition-transform duration-[180ms] ease-[var(--ease-out)]', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      {open && (
        <div id={menuId} className="popover-surface origin-top absolute left-1/2 top-full z-40 w-[300px] -translate-x-1/2 pt-2">
          <ul
            role="menu"
            className="rounded-2xl border border-line bg-white p-2 shadow-[0_24px_60px_-20px_rgba(18,36,21,0.25)]"
          >
            {group.items.map((item) => (
              <li key={item.label} role="none">
                {item.soon ? (
                  <div className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[13.5px] text-soft">
                    <span>{item.label}</span>
                    <span className="rounded-full bg-mist px-2 py-0.5 text-[10.5px] font-medium">Coming soon</span>
                  </div>
                ) : (
                  <Link
                    role="menuitem"
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2.5 transition-colors duration-[150ms] ease-[var(--ease-out)] hover:bg-canvas"
                  >
                    <span className="block text-[13.5px] font-medium text-ink">{item.label}</span>
                    {item.description && <span className="mt-0.5 block text-[12px] text-muted">{item.description}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function MobileMenu({
  onClose,
  triggerRef,
}: {
  onClose: () => void
  triggerRef: RefObject<HTMLButtonElement | null>
}) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previouslyFocused = triggerRef.current ?? (document.activeElement as HTMLElement | null)
    closeButtonRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === 'Tab' && sheetRef.current) {
        const focusable = Array.from(
          sheetRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previouslyFocused?.focus()
    }
  }, [onClose, triggerRef])

  return (
    <div id="mobile-menu" className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Site menu">
      <div className="scrim-surface absolute inset-0 bg-night/50 backdrop-blur-xs" onClick={onClose} />
      <div
        ref={sheetRef}
        className="sheet-surface origin-top absolute inset-x-3 top-3 max-h-[calc(100vh-1.5rem)] overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <Link to="/" onClick={onClose} aria-label="Arbor home">
            <ArborLogo light={false} />
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-[transform,border-color,background-color] duration-[160ms] ease-[var(--ease-out)] hover:border-line-strong hover:bg-paper active:scale-[0.95]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav aria-label="Mobile" className="mt-6 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="px-2 text-[11px] font-medium uppercase tracking-[0.12em] text-soft">{group.label}</div>
              <ul className="mt-2">
                {group.items.map((item) => (
                  <li key={item.label}>
                    {item.soon ? (
                      <span className="flex items-center justify-between px-2 py-2.5 text-[15px] text-soft">
                        {item.label}
                        <span className="rounded-full bg-mist px-2 py-0.5 text-[10.5px] font-medium">Coming soon</span>
                      </span>
                    ) : (
                      <Link
                        to={item.to}
                        onClick={onClose}
                        className="block rounded-lg px-2 py-2.5 text-[15px] text-ink transition-colors hover:bg-canvas"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <Link
            to="/pricing"
            onClick={onClose}
            className="block rounded-lg px-2 py-2.5 text-[15px] font-medium text-ink transition-colors hover:bg-canvas"
          >
            Pricing
          </Link>
        </nav>

        <div className="mt-6 grid grid-cols-2 gap-2 border-t border-line pt-5">
          <ButtonLink to="/login" variant="secondary" onClick={onClose}>
            Log in
          </ButtonLink>
          <ButtonLink to="/signup" onClick={onClose}>
            Get started
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}

export function Header({ tone }: { tone: 'dark' | 'light' }) {
  const dark = tone === 'dark'
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(() => (typeof window !== 'undefined' ? window.scrollY > 72 : false))
  const menuTriggerRef = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()

  useEffect(() => setMobileOpen(false), [pathname])

  useEffect(() => {
    if (!dark) {
      setScrolled(false)
      return
    }
    const onScroll = () => setScrolled(window.scrollY > 72)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [dark])

  const useLightInk = dark && !scrolled

  return (
    <header
      className={cx(
        'z-30 transition-[background-color,border-color,padding] duration-[200ms] ease-[var(--ease-out)]',
        dark
          ? scrolled
            ? 'glass-surface fixed inset-x-0 top-0 border-b border-line bg-canvas/85 backdrop-blur-xl'
            : 'fixed inset-x-0 top-0 px-3 pt-3 sm:px-5 sm:pt-5'
          : 'glass-surface sticky top-0 border-b border-line bg-canvas/85 backdrop-blur-xl',
      )}
    >
      <div className="mx-auto max-w-[1260px]">
        <nav aria-label="Primary" className="mx-auto flex h-20 max-w-[1180px] items-center justify-between px-4 sm:px-8">
          <Link to="/" aria-label="Arbor home" className="rounded-lg">
            <ArborLogo light={useLightInk} />
          </Link>

          <div className="hidden items-center gap-1 text-[14px] lg:flex">
            {NAV_GROUPS.map((group) => (
              <Dropdown key={group.label} group={group} dark={useLightInk} />
            ))}
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                cx(
                  'rounded-full px-3 py-2 transition-[transform,color] duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97]',
                  useLightInk ? 'text-white/85 hover:text-white' : 'text-ink-secondary hover:text-ink',
                  isActive && (useLightInk ? 'text-white font-medium' : 'text-ink font-medium'),
                )
              }
            >
              Pricing
            </NavLink>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className={cx(
                'hidden rounded-full px-4 py-2 text-[13px] font-medium transition-[transform,color,background-color] duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97] sm:inline-flex',
                useLightInk ? 'text-white/90 hover:text-white' : 'text-ink hover:bg-sage/60',
              )}
            >
              Log in
            </Link>
            <ButtonLink to="/signup" variant={useLightInk ? 'glass' : 'primary'} size="sm">
              Get started
            </ButtonLink>
            <button
              ref={menuTriggerRef}
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              className={cx(
                'flex h-11 w-11 items-center justify-center rounded-full border transition-[transform,background-color,border-color] duration-[160ms] ease-[var(--ease-out)] active:scale-[0.95] lg:hidden',
                useLightInk ? 'border-white/25 bg-white/15 text-white' : 'border-line bg-white text-ink',
              )}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </nav>
      </div>
      {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} triggerRef={menuTriggerRef} />}
    </header>
  )
}
