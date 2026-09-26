import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  APP_URL,
  capabilities,
  cta,
  DOCS_URL,
  examplePrompts,
  footerColumns,
  X_URL,
  security,
} from '@/data/content'
import { IntentsScene, SecurityIcon, SupportScene, ToolsScene } from '@/components/illustrations/Illustrations'
import { OFFICIAL_LOGOS } from '@/assets/logos'
import { ArrowIcon, BrandLogo, Button, Container, Logo, LogoMark, Reveal, SectionTitle, SmartLink } from '@/components/ui/primitives'
import { cn, EASE } from '@/lib/utils'

const scenes: Record<string, ReactNode> = {
  intents: <IntentsScene />,
  tools: <ToolsScene />,
  support: <SupportScene />,
}

export function Capabilities() {
  return (
    <section className="bg-mist px-4 pt-20 pb-10">
      <Container>
        <Reveal>
          <SectionTitle className="md:pt-0">Made for how you think about money</SectionTitle>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3 md:gap-10">
          {capabilities.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.08} className="group overflow-hidden rounded-xl bg-surface ring-1 ring-ink/5 transition-shadow hover:shadow-[0_24px_48px_-28px_#00000040]">
              <div className="panel-gradient m-1 aspect-[396/300] overflow-hidden rounded-lg">
                <div className="h-full transition-transform duration-500 group-hover:scale-[1.03]">{scenes[c.id]}</div>
              </div>
              <div className="flex flex-col gap-4 px-4 pt-6 pb-8 md:gap-10 md:pt-10">
                <h3 className="text-display-xs font-semibold text-ink">{c.title}</h3>
                <p className="text-md text-ink">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
      <div className="flex justify-center pt-20 pb-10">
        <Button href={DOCS_URL} icon="arrow">
          Read the docs
        </Button>
      </div>
    </section>
  )
}

export function Security() {
  return (
    <section className="bg-surface px-4 py-20">
      <Container>
        <Reveal>
          <SectionTitle className="md:pt-0">You stay in control</SectionTitle>
        </Reveal>
        <div className="grid gap-12 md:grid-cols-3 md:gap-10 md:px-[30px]">
          {security.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.08} className="flex flex-col items-center text-center">
              <SecurityIcon id={s.id} />
              <h3 className="mt-3 mb-3 text-xl leading-[30px] font-semibold text-ink">{s.title}</h3>
              <p className="max-w-[380px] text-md text-ink">{s.body}</p>
            </Reveal>
          ))}
        </div>
        <div className="flex justify-center pt-20">
          <Button href="/docs/security" icon="arrow">
            How TalkenFi keeps you safe
          </Button>
        </div>
      </Container>
    </section>
  )
}

export function Cta() {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return
    const t = window.setInterval(() => setIdx((v) => (v + 1) % examplePrompts.length), 5000)
    return () => window.clearInterval(t)
  }, [paused])
  const current = examplePrompts[idx]

  return (
    <section className="bg-surface px-4 py-20">
      <Container className="grid gap-6 lg:grid-cols-[1fr_300px] lg:gap-6">
        <Reveal className="panel-gradient relative overflow-hidden rounded-lg px-6 py-14 md:px-8 md:py-20">
          <div aria-hidden className="absolute -top-20 right-[-10%] h-[140%] w-[45%] rotate-[30deg] bg-white/[0.04]" />
          <div className="relative flex max-w-[892px] flex-col gap-6">
            <h3 className="text-[40px] leading-[48px] font-semibold tracking-[-0.96px] text-brand-800 md:text-display-lg md:leading-[60px]">{cta.title}</h3>
            <p className="text-md text-brand-900">{cta.body}</p>
            <Button href={APP_URL} icon={null} className="mt-4 self-start">
              {cta.button}
            </Button>
          </div>
        </Reveal>
        <div className="flex flex-col gap-5" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="relative flex min-h-[331px] flex-1 flex-col justify-between overflow-hidden rounded-lg bg-mist p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex h-full flex-col justify-between gap-6"
              >
                <p className="text-lg leading-7 text-ink">“{current.text}”</p>
                <div className="flex items-center gap-4">
                  <LogoMark className="size-[52px]" />
                  <div>
                    <p className="text-md font-semibold text-ink">Try asking</p>
                    <p className="text-md text-muted">{current.label}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-between px-1">
            <button type="button" aria-label="Previous prompt" onClick={() => setIdx((v) => (v - 1 + examplePrompts.length) % examplePrompts.length)} className="text-ink hover:text-brand-600">
              <ArrowIcon className="rotate-180" />
            </button>
            <div className="flex gap-1.5">
              {examplePrompts.map((p, i) => (
                <button
                  key={p.text}
                  type="button"
                  aria-label={`Show prompt ${i + 1}`}
                  onClick={() => setIdx(i)}
                  className={cn('h-2 rounded-full transition-all', i === idx ? 'w-6 bg-brand-800' : 'w-2 bg-brand-200')}
                />
              ))}
            </div>
            <button type="button" aria-label="Next prompt" onClick={() => setIdx((v) => (v + 1) % examplePrompts.length)} className="text-ink hover:text-brand-600">
              <ArrowIcon />
            </button>
          </div>
        </div>
      </Container>
    </section>
  )
}


export function Footer() {
  return (
    <footer className="bg-mist">
      <Container className="px-4 md:px-10">
        <div className="flex items-center justify-between py-20">
          <SmartLink href="/" aria-label="TalkenFi home">
            <Logo />
          </SmartLink>
          <SmartLink href={X_URL} aria-label="TalkenFi on X (opens in a new tab)" className="grid size-12 place-items-center rounded-full bg-white/5 transition hover:bg-brand-100">
            <BrandLogo svg={OFFICIAL_LOGOS.X.svg} name="X" className="h-5 [&_path]:fill-ink" />
          </SmartLink>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 pb-20 md:grid-cols-4">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <p className="mb-6 text-sm font-semibold tracking-wide text-ink uppercase">{col.title}</p>
              <ul className="grid gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <SmartLink href={link.href} className="inline-flex items-start text-md text-ink hover:text-brand-600">
                      {link.label}
                      {link.href.startsWith('http') && <ArrowIcon kind="external" className="-mt-1 size-3.5" />}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-5 border-t border-line py-10 sm:flex-row sm:items-center">
          <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-surface text-center ring-1 ring-line">
            <SecurityIcon id="custody" className="size-14" />
          </div>
          <p className="max-w-[672px] text-sm leading-[23px] text-muted">
            TalkenFi is non-custodial software. You keep your keys, every transaction is shown to you before it runs, and nothing executes without your
            signature.
          </p>
        </div>
        <div className="flex flex-col gap-6 border-t border-line py-10">
          <div className="flex flex-wrap gap-x-8 gap-y-3 sm:justify-end">
            {[
              { label: 'Docs', href: '/docs' },
              { label: 'Terms', href: '#terms' },
              { label: 'Privacy', href: '#privacy' },
              { label: 'Status', href: '#status' },
            ].map((link) => (
              <SmartLink key={link.label} href={link.href} className="text-sm text-muted hover:text-ink">
                {link.label}
              </SmartLink>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  )
}
