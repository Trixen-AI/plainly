import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { useAgentStore } from '@/app/agent/context'
import { TxPanel } from '@/app/components/TxPanel'
import { ConnectButton } from '@/app/components/wallet'
import { MENU, type MenuItem } from '@/app/data/menu'
import { hasProjectId } from '@/app/wallet/config'
import { Logo, SmartLink } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'

const PAGE_TITLES: Record<string, string> = {
  '/app/portfolio': 'Portfolio',
  '/app/score': 'My Score',
  '/app/mcp': 'TalkenFi MCP',
}

function MenuGroupView({ label, icon, items, onPick }: { label: string; icon: string; items: MenuItem[]; onPick: (item: MenuItem) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <li>
      <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-surface hover:text-ink">
        <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d={icon} />
        </svg>
        <span className="flex-1 text-left">{label}</span>
        <svg viewBox="0 0 16 16" className={cn('size-3.5 transition-transform', open && 'rotate-90')} aria-hidden>
          <path d="m6 4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </svg>
      </button>
      <ul className={cn('ml-[26px] grid border-l border-line pl-2', open ? 'py-1' : 'hidden')}>
        {items.map((item) => (
          <li key={item.label}>
            <button type="button" onClick={() => onPick(item)} className="w-full rounded-md px-2.5 py-1.5 text-left text-sm text-ink-soft hover:bg-surface hover:text-ink">
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </li>
  )
}

function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  const navigate = useNavigate()
  const { chats, deleteChat } = useAgentStore()
  const { pathname } = useLocation()
  const promptsSent = chats.reduce((n, c) => n + c.messages.filter((m) => m.role === 'user').length, 0)

  const pick = (item: MenuItem) => {
    onNavigate()
    if (item.to) navigate(item.to)
    else if (item.prompt) navigate(`/app?q=${encodeURIComponent(item.prompt)}`)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <SmartLink href="/" aria-label="TalkenFi home">
          <Logo />
        </SmartLink>
      </div>

      <div className="grid gap-2 px-3">
        <button
          type="button"
          onClick={() => {
            onNavigate()
            navigate('/app')
          }}
          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-800 text-sm font-semibold text-on-accent hover:bg-brand-700"
        >
          <span aria-hidden className="text-lg leading-none">+</span> New Chat
        </button>
        <div className="grid grid-cols-2 gap-2">
          <NavLink to="/app/mcp" onClick={onNavigate} className={({ isActive }) => cn('rounded-xl px-2 py-2 text-center text-xs font-semibold ring-1', isActive ? 'bg-brand-100 text-brand-800 ring-brand-200' : 'bg-surface text-ink-soft ring-line hover:ring-brand-300')}>
            + Add MCP
          </NavLink>
          <SmartLink href="/app/mcp#agents" onClick={onNavigate} className="rounded-xl bg-surface px-2 py-2 text-center text-xs font-semibold text-ink-soft ring-1 ring-line hover:ring-brand-300">
            Launch an agent
          </SmartLink>
        </div>
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto px-3 pb-4 [scrollbar-width:thin]">
        <p className="mb-1 px-3 text-xs font-semibold tracking-widest text-muted uppercase">Chat History</p>
        {chats.length === 0 ? (
          <p className="px-3 py-2 text-sm text-muted">No chat history yet</p>
        ) : (
          <ul className="grid gap-0.5">
            {chats.map((c) => (
              <li key={c.id} className="group relative">
                <NavLink
                  to={`/app/chat/${c.id}`}
                  onClick={onNavigate}
                  className={({ isActive }) => cn('block truncate rounded-lg py-2 pr-8 pl-3 text-sm', isActive ? 'bg-surface font-semibold text-ink ring-1 ring-line' : 'text-ink-soft hover:bg-surface')}
                >
                  {c.title}
                </NavLink>
                <button
                  type="button"
                  aria-label={`Delete chat ${c.title}`}
                  onClick={() => {
                    deleteChat(c.id)
                    if (pathname === `/app/chat/${c.id}`) navigate('/app')
                  }}
                  className="absolute top-1/2 right-1.5 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted opacity-0 group-hover:opacity-100 hover:bg-mist hover:text-ink focus-visible:opacity-100"
                >
                  <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-5 mb-1 px-3 text-xs font-semibold tracking-widest text-muted uppercase">Actions</p>
        <ul className="grid gap-0.5">
          {MENU.map((g) => (
            <MenuGroupView key={g.label} label={g.label} icon={g.icon} items={g.items} onPick={pick} />
          ))}
        </ul>
      </div>

      <div className="border-t border-line p-4">
        <div className="rounded-xl bg-surface p-3 ring-1 ring-line">
          <p className="text-xs font-semibold text-muted">Prompts this session</p>
          <p className="mt-0.5 text-lg font-semibold text-ink">{promptsSent}</p>
        </div>
        <p className="mt-3 text-center text-xs text-muted">
          <SmartLink href="/docs" className="hover:text-ink">Docs</SmartLink> · <SmartLink href="#terms" className="hover:text-ink">Terms</SmartLink> · <SmartLink href="#privacy" className="hover:text-ink">Privacy</SmartLink>
        </p>
      </div>
    </div>
  )
}

export function AppShell() {
  const [nav, setNav] = useState(false)
  const [txOpen, setTxOpen] = useState(false)
  const { pathname } = useLocation()
  const { queue } = useAgentStore()
  const waiting = queue.filter((t) => t.status === 'pending' || t.status === 'signing' || t.status === 'submitted' || t.status === 'failed').length
  const title = PAGE_TITLES[pathname] ?? 'Agent'

  return (
    <div className="fixed inset-0 grid grid-cols-1 grid-rows-[minmax(0,1fr)] overflow-hidden bg-surface lg:grid-cols-[272px_minmax(0,1fr)] xl:grid-cols-[272px_minmax(0,1fr)_340px]">
      {/* sidebar: static on desktop, sheet with blurred backdrop on mobile */}
      <aside className="hidden min-h-0 overflow-hidden border-r border-line bg-mist lg:block">
        <Sidebar onNavigate={() => undefined} />
      </aside>
      <button
        type="button"
        aria-label="Close menu"
        tabIndex={-1}
        aria-hidden={!nav}
        onClick={() => setNav(false)}
        className={cn('fixed inset-0 z-40 bg-black/55 backdrop-blur-md transition-[opacity,visibility] duration-200 lg:hidden', nav ? 'visible opacity-100' : 'invisible opacity-0')}
      />
      <aside
        inert={!nav}
        aria-hidden={!nav}
        className={cn('fixed inset-y-0 left-0 z-50 w-[min(300px,86vw)] bg-mist shadow-[24px_0_48px_-24px_#00000040] transition-[transform,visibility] duration-300 ease-out lg:hidden', nav ? 'visible translate-x-0' : 'invisible -translate-x-full')}
      >
        <Sidebar onNavigate={() => setNav(false)} />
      </aside>

      <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-line px-3 md:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <button type="button" onClick={() => setNav(true)} aria-label="Open menu" className="grid size-10 place-items-center rounded-full ring-1 ring-ink/10 lg:hidden">
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <p className="truncate text-md font-semibold text-ink">{title}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setTxOpen(true)} className="relative h-10 rounded-full px-3 text-sm font-semibold text-ink ring-1 ring-line hover:bg-mist xl:hidden">
              Transactions
              {waiting > 0 && <span className="ml-1.5 inline-grid size-5 place-items-center rounded-full bg-mint text-[11px] text-on-accent">{waiting}</span>}
            </button>
            <ConnectButton />
          </div>
        </header>
        {!hasProjectId && (
          <p className="border-b border-warn/30 bg-warn-soft px-4 py-2 text-xs text-warn">
            Add <code className="font-mono">VITE_REOWN_PROJECT_ID</code> to <code className="font-mono">.env</code> to enable WalletConnect QR and mobile wallets. Browser wallets work without it.
          </p>
        )}
        <main className="min-h-0 flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>

      <aside className="hidden min-h-0 overflow-hidden border-l border-line bg-mist xl:block">
        <TxPanel />
      </aside>
      <button
        type="button"
        aria-label="Close transactions"
        tabIndex={-1}
        aria-hidden={!txOpen}
        onClick={() => setTxOpen(false)}
        className={cn('fixed inset-0 z-40 bg-black/55 backdrop-blur-md transition-[opacity,visibility] duration-200 xl:hidden', txOpen ? 'visible opacity-100' : 'invisible opacity-0')}
      />
      <aside
        inert={!txOpen}
        aria-hidden={!txOpen}
        className={cn('fixed inset-y-0 right-0 z-50 w-[min(380px,92vw)] bg-mist shadow-[-24px_0_48px_-24px_#00000040] transition-[transform,visibility] duration-300 ease-out xl:hidden', txOpen ? 'visible translate-x-0' : 'invisible translate-x-full')}
      >
        <TxPanel onClose={() => setTxOpen(false)} />
      </aside>
    </div>
  )
}
