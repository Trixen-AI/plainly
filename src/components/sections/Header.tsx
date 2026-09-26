import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { APP_URL, navGroups } from '@/data/content'
import { Button, Container, Logo, SmartLink } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [open, setOpen] = useState<number | null>(null)
  const [mobile, setMobile] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const location = useLocation()

  const closeMenus = () => {
    setOpen(null)
    setMobile(false)
  }

  // Keep the last opened group so the panel keeps its content while it fades out.
  const [menuIndex, setMenuIndex] = useState(0)
  if (open !== null && open !== menuIndex) setMenuIndex(open)

  // Fallback for back/forward: close any open menu after navigating to another page or anchor (state adjusted during render, no effect).
  const routeKey = location.pathname + location.hash
  const [lastRoute, setLastRoute] = useState(routeKey)
  if (lastRoute !== routeKey) {
    setLastRoute(routeKey)
    setOpen(null)
    setMobile(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(null)
      setMobile(false)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  // Lock page scroll while the mobile menu overlays it; close it if the viewport grows to desktop.
  useEffect(() => {
    if (!mobile) return
    // Lock on <html>, not <body>: with overflow-x: clip on <html>, a hidden <body> becomes its own scroll box and
    // the sticky nav would scroll away with the page.
    const root = document.documentElement
    const { overflow } = root.style
    root.style.overflow = 'hidden'
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => mq.matches && setMobile(false)
    mq.addEventListener('change', onChange)
    return () => {
      root.style.overflow = overflow
      mq.removeEventListener('change', onChange)
    }
  }, [mobile])

  return (
    <nav
      ref={navRef}
      className={cn(
        'sticky top-0 z-30 transition-colors duration-300',
        scrolled || open !== null || mobile ? 'bg-bg/85 shadow-[0_1px_0_#00000014] backdrop-blur-lg' : 'bg-transparent',
      )}
      onMouseLeave={() => setOpen(null)}
    >
      <Container className="flex h-[72px] items-center justify-between md:px-4">
        <div className="flex h-full items-center gap-5">
          <SmartLink href="/" aria-label="TalkenFi home" className="rounded focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:outline-none">
            <Logo />
          </SmartLink>
          <ul className="hidden h-full items-center lg:flex">
            {navGroups.map((g, i) => (
              <li key={g.label} className="h-full" onMouseEnter={() => setOpen(i)}>
                <button
                  type="button"
                  aria-expanded={open === i}
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex h-full items-center gap-1 px-3 text-md font-medium text-ink-soft hover:text-brand-700"
                >
                  {g.label}
                  <svg viewBox="0 0 16 16" className={cn('size-4 transition-transform', open === i && 'rotate-180')} aria-hidden>
                    <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <SmartLink href="/#rates" className="hidden px-3 text-md font-semibold text-brand-800 hover:text-brand-600 sm:block">
            Check rates
          </SmartLink>
          <Button href={APP_URL} icon={null} className="hidden sm:inline-flex">
            Launch app
          </Button>
          <button
            type="button"
            aria-label={mobile ? 'Close menu' : 'Open menu'}
            aria-expanded={mobile}
            onClick={() => setMobile((v) => !v)}
            className="grid size-11 place-items-center rounded-full ring-1 ring-ink/10 lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
              {mobile ? (
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {/* Menus are always mounted and shown with CSS transitions (no exit animation that can stall). */}
      <div
        inert={open === null}
        aria-hidden={open === null}
        className={cn(
          'absolute inset-x-0 top-full hidden border-t border-line bg-surface shadow-[0_24px_48px_-24px_#00000033] transition-[opacity,transform,visibility] duration-200 ease-out lg:block',
          open === null ? 'invisible -translate-y-2 opacity-0' : 'visible translate-y-0 opacity-100',
        )}
      >
        <Container className="grid grid-cols-[1fr_1fr_320px] gap-10 py-10 md:px-4">
          {navGroups[menuIndex].columns.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-xs font-semibold tracking-widest text-muted uppercase">{col.title}</p>
              <ul className="grid gap-1">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <SmartLink href={l.href ?? '#'} onClick={closeMenus} className="block rounded-xl px-3 py-2.5 hover:bg-brand-50">
                      <span className="block font-semibold text-ink">{l.label}</span>
                      <span className="block text-sm text-muted">{l.hint}</span>
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="panel-gradient flex flex-col justify-between rounded-2xl p-6">
            <p className="text-display-xs font-semibold text-brand-900">“{navGroups[menuIndex].columns[0].links[0].label.toLowerCase()} for me”</p>
            <p className="text-sm text-brand-900/80">Everything in this menu works as a sentence in the agent.</p>
            <Button href={APP_URL} className="mt-4 self-start">
              Try it
            </Button>
          </div>
        </Container>
      </div>

      <button
        type="button"
        aria-label="Close menu"
        tabIndex={-1}
        aria-hidden={!mobile}
        onClick={() => setMobile(false)}
        className={cn(
          'fixed inset-x-0 top-[72px] bottom-0 -z-10 cursor-default bg-black/55 backdrop-blur-md transition-[opacity,visibility] duration-200 lg:hidden',
          mobile ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      />

      <div
        inert={!mobile}
        aria-hidden={!mobile}
        className={cn(
          'absolute inset-x-3 top-full mt-2 overflow-hidden rounded-2xl bg-surface shadow-[0_0_0_1px_#0000000f,0_24px_48px_-16px_#00000040] transition-[opacity,transform,visibility] duration-250 ease-out lg:hidden',
          mobile ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-3 opacity-0',
        )}
      >
        <div className="grid max-h-[calc(100dvh-72px-32px)] gap-6 overflow-y-auto overscroll-contain px-5 py-6">
          {navGroups.map((g) => (
            <div key={g.label}>
              <p className="mb-2 text-xs font-semibold tracking-widest text-muted uppercase">{g.label}</p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                {g.columns.flatMap((c) => c.links).map((l) => (
                  <li key={l.label}>
                    <SmartLink href={l.href ?? '#'} onClick={closeMenus} className="text-md text-ink">
                      {l.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <Button href={APP_URL}>Launch app</Button>
        </div>
      </div>
    </nav>
  )
}
