import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useParams } from 'react-router'
import { ProtocolLogo } from '@/components/ProtocolLogo'
import { DOC_GROUPS, docBySlug, docs, type DocBlock } from '@/data/docs'
import { ArrowIcon, Container, Rich, SmartLink } from '@/components/ui/primitives'
import { NotFound } from '@/pages/NotFound'
import { useSeo } from '@/lib/seo'
import { cn } from '@/lib/utils'

/* ---------- sidebar ---------- */

function DocsSearch({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
  return (
    <label className="relative block">
      <span className="sr-only">Search the docs</span>
      <svg viewBox="0 0 20 20" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden>
        <circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="m13.5 13.5 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search docs"
        className="h-10 w-full rounded-xl border border-line bg-surface pr-3 pl-9 text-sm text-ink placeholder:text-muted focus:border-brand-300 focus:ring-2 focus:ring-brand-100 focus:outline-none"
      />
    </label>
  )
}

function DocsNav({ query, onNavigate }: { query: string; onNavigate?: () => void }) {
  const q = query.trim().toLowerCase()
  const matches = (title: string, description: string) => !q || title.toLowerCase().includes(q) || description.toLowerCase().includes(q)

  return (
    <nav aria-label="Documentation" className="flex flex-col gap-6">
      {DOC_GROUPS.map((group) => {
        const pages = docs.filter((d) => d.group === group && matches(d.title, d.description))
        if (!pages.length) return null
        return (
          <div key={group}>
            <p className="mb-2 px-3 text-xs font-semibold tracking-widest text-muted uppercase">{group}</p>
            <ul className="grid gap-0.5">
              {pages.map((d) => (
                <li key={d.slug}>
                  <NavLink
                    to={`/docs/${d.slug}`}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'block rounded-lg px-3 py-2 text-sm transition-colors',
                        isActive ? 'bg-brand-100 font-semibold text-brand-800' : 'text-ink-soft hover:bg-brand-50 hover:text-ink',
                      )
                    }
                  >
                    {d.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
      {q && !docs.some((d) => matches(d.title, d.description)) && <p className="px-3 text-sm text-muted">No pages match “{query}”.</p>}
    </nav>
  )
}

export function DocsLayout() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { pathname } = useLocation()

  // Close the mobile sheet when the page changes (state adjusted during render, no effect).
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    const { overflow } = root.style
    root.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => {
      root.style.overflow = overflow
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const current = docBySlug[pathname.split('/')[2] ?? '']

  return (
    <main className="bg-surface">
      {/* mobile docs bar */}
      <div className="sticky top-[72px] z-20 border-b border-line bg-bg/85 backdrop-blur-lg lg:hidden">
        <Container className="flex h-12 items-center justify-between">
          <button type="button" onClick={() => setOpen(true)} aria-expanded={open} className="flex items-center gap-2 text-sm font-semibold text-ink">
            <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
              <path d="M3 6h14M3 10h14M3 14h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Docs menu
          </button>
          {current && <span className="truncate pl-4 text-sm text-muted">{current.title}</span>}
        </Container>
      </div>

      {/* Sheet is always mounted and shown with CSS transitions (no exit animation that can stall). */}
      <button
        type="button"
        aria-label="Close docs menu"
        tabIndex={-1}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={cn(
          'fixed inset-0 z-40 cursor-default bg-black/55 backdrop-blur-md transition-[opacity,visibility] duration-200 lg:hidden',
          open ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      />
      <aside
        inert={!open}
        aria-hidden={!open}
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[min(320px,86vw)] flex-col bg-mist shadow-[24px_0_48px_-24px_#00000040] transition-[transform,visibility] duration-300 ease-out lg:hidden',
          open ? 'visible translate-x-0' : 'invisible -translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-7 pt-5 pb-4">
          <p className="text-md font-semibold text-ink">Documentation</p>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close docs menu" className="grid size-9 place-items-center rounded-full ring-1 ring-ink/10">
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="px-4 pb-4">
          <DocsSearch query={query} setQuery={setQuery} />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
          <DocsNav query={query} onNavigate={() => setOpen(false)} />
        </div>
      </aside>

      <Container className="grid gap-10 py-10 md:px-4 lg:grid-cols-[240px_minmax(0,1fr)] lg:py-14 xl:grid-cols-[240px_minmax(0,1fr)_200px]">
        <aside className="hidden lg:block">
          <div className="sticky top-[96px] flex max-h-[calc(100dvh-120px)] flex-col gap-5">
            <DocsSearch query={query} setQuery={setQuery} />
            <div className="min-h-0 flex-1 overflow-y-auto pb-8 [scrollbar-width:thin]">
              <DocsNav query={query} />
            </div>
          </div>
        </aside>
        <Outlet />
      </Container>
    </main>
  )
}

/* ---------- page ---------- */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1600)
        } catch {
          setCopied(false)
        }
      }}
      className="rounded-md px-2 py-1 text-xs font-semibold text-brand-200 ring-1 ring-white/15 hover:bg-white/10"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function Block({ block }: { block: DocBlock }) {
  switch (block.type) {
    case 'p':
      return (
        <p className="text-md leading-7 text-ink-soft">
          <Rich value={block.text} />
        </p>
      )
    case 'h2':
      return (
        <h2 id={block.id} className="group mt-6 scroll-mt-32 text-display-xs font-semibold text-ink lg:scroll-mt-28">
          <a href={`#${block.id}`} className="relative">
            {block.text}
            <span aria-hidden className="ml-2 text-brand-300 opacity-0 transition group-hover:opacity-100">
              #
            </span>
          </a>
        </h2>
      )
    case 'h3':
      return <h3 className="mt-2 text-lg leading-7 font-semibold text-ink">{block.text}</h3>
    case 'list':
      return (
        <ul className="grid gap-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-md leading-7 text-ink-soft">
              <span aria-hidden className="mt-[11px] size-1.5 shrink-0 rounded-full bg-brand-500" />
              <span>
                <Rich value={item} />
              </span>
            </li>
          ))}
        </ul>
      )
    case 'steps':
      return (
        <ol className="grid gap-4">
          {block.items.map((step, i) => (
            <li key={step.title} className="flex gap-4 rounded-2xl bg-mist p-5 ring-1 ring-line">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-800 text-sm font-semibold text-on-accent">{i + 1}</span>
              <div>
                <p className="font-semibold text-ink">{step.title}</p>
                <p className="mt-1 text-md leading-7 text-ink-soft">
                  <Rich value={step.body} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      )
    case 'callout':
      return (
        <div
          role="note"
          className={cn(
            'rounded-2xl p-5 ring-1',
            block.tone === 'warning' ? 'bg-warn-soft ring-warn/30' : 'bg-brand-50 ring-brand-100',
          )}
        >
          <p className={cn('flex items-center gap-2 font-semibold', block.tone === 'warning' ? 'text-warn' : 'text-brand-800')}>
            <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
              {block.tone === 'warning' ? (
                <path d="M10 3 2.5 16.5h15zM10 8v3.5M10 14h.01" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM10 9v4.5M10 6.5h.01" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
            {block.title}
          </p>
          <p className="mt-1.5 text-md leading-7 text-ink-soft">
            <Rich value={block.body} />
          </p>
        </div>
      )
    case 'prompts':
      return (
        <div className="grid gap-2">
          {block.items.map((p) => (
            <div key={p} className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3 ring-1 ring-line">
              <svg viewBox="0 0 20 20" className="size-4 shrink-0 text-brand-600" aria-hidden>
                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h7A2.5 2.5 0 0 1 16 5.5v5a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3A2.5 2.5 0 0 1 4 10.5z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
              <span className="text-md text-ink">{p}</span>
            </div>
          ))}
        </div>
      )
    case 'code':
      return (
        <div className="overflow-hidden rounded-2xl bg-code">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
            <span className="font-mono text-xs text-brand-200">{block.label}</span>
            <CopyButton text={block.code} />
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-sm leading-6 text-white">
            <code>{block.code}</code>
          </pre>
        </div>
      )
    case 'table':
      return (
        <div className="overflow-x-auto rounded-2xl ring-1 ring-line">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-mist">
              <tr>
                {block.head.map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold text-ink">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-t border-line">
                  {row.map((cell, c) => (
                    <td key={c} className="px-4 py-3 align-top leading-6 text-ink-soft">
                      <Rich value={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'protocols':
      return (
        <ul className="grid gap-3 sm:grid-cols-2">
          {block.items.map((item) => {
            return (
              <li key={item.name} className="flex items-center justify-between gap-4 rounded-2xl bg-surface px-5 py-4 ring-1 ring-line">
                <ProtocolLogo name={item.name} className="h-6" textClassName="text-lg" />
                <span className="text-right text-sm text-muted">{item.role}</span>
              </li>
            )
          })}
        </ul>
      )
  }
}

export function DocPageView() {
  const { slug = '' } = useParams()
  const page = docBySlug[slug]
  const index = docs.findIndex((d) => d.slug === slug)
  const toc = useMemo(() => (page ? page.blocks.filter((b): b is Extract<DocBlock, { type: 'h2' }> => b.type === 'h2') : []), [page])

  useSeo({
    title: page ? `${page.title} | TalkenFi Docs` : 'Page not found',
    description: page?.description ?? 'This page does not exist on TalkenFi.',
    path: `/docs/${slug}`,
    noindex: !page,
  })

  if (!page) return <NotFound />

  const prev = docs[index - 1]
  const next = docs[index + 1]

  return (
    <>
      <article className="min-w-0 max-w-[760px]">
        <p className="text-sm font-semibold text-brand-700">{page.group}</p>
        <h1 className="mt-2 text-display-sm font-semibold tracking-[-0.02em] text-ink md:text-display-md">{page.title}</h1>
        <p className="mt-3 text-lg leading-8 text-muted">{page.description}</p>

        <div className="mt-10 flex flex-col gap-5">
          {page.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>

        <nav aria-label="Previous and next pages" className="mt-16 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
          {prev ? (
            <SmartLink href={`/docs/${prev.slug}`} className="group rounded-2xl p-5 ring-1 ring-line transition hover:bg-brand-50 hover:ring-brand-200">
              <span className="flex items-center gap-1 text-sm text-muted">
                <ArrowIcon className="size-4 rotate-180" /> Previous
              </span>
              <span className="mt-1 block font-semibold text-ink">{prev.title}</span>
            </SmartLink>
          ) : (
            <span />
          )}
          {next && (
            <SmartLink href={`/docs/${next.slug}`} className="group rounded-2xl p-5 text-right ring-1 ring-line transition hover:bg-brand-50 hover:ring-brand-200">
              <span className="flex items-center justify-end gap-1 text-sm text-muted">
                Next <ArrowIcon className="size-4" />
              </span>
              <span className="mt-1 block font-semibold text-ink">{next.title}</span>
            </SmartLink>
          )}
        </nav>
      </article>

      <aside className="hidden xl:block">
        {toc.length > 0 && (
          <div className="sticky top-[96px]">
            <p className="mb-3 text-xs font-semibold tracking-widest text-muted uppercase">On this page</p>
            <ul className="grid gap-2 border-l border-line">
              {toc.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`} className="-ml-px block border-l border-transparent pl-4 text-sm text-ink-soft hover:border-brand-500 hover:text-brand-700">
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </>
  )
}
