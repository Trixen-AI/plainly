import type { ReactNode } from 'react'
import { chain, features, products, prompts, SOLANA_DEV_URL } from '@/data/content'
import {
  AgentStackIllustration,
  BorrowIllustration,
  ChainIllustration,
  EarnIllustration,
  LoansIllustration,
  McpIllustration,
  TradeIllustration,
} from '@/components/illustrations/Illustrations'
import { Button, Container, Highlight, LogoMark, Reveal, Rich, SectionTitle, TextLink } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'

const featureArt: Record<string, ReactNode> = {
  trade: <TradeIllustration />,
  borrow: <BorrowIllustration />,
  earn: <EarnIllustration />,
  loans: <LoansIllustration />,
}

export function Features() {
  return (
    <section className="bg-surface pt-5 pb-10">
      <Container className="flex flex-col gap-10 py-10 md:gap-[60px] md:py-[60px]">
        {features.map((f, i) => {
          const flip = i % 2 === 1
          return (
            <div key={f.id} id={f.id === 'loans' ? 'rates' : f.id} className="grid scroll-mt-24 items-center gap-8 md:grid-cols-2 md:gap-20">
              <Reveal className={cn('flex flex-col gap-6', flip && 'md:order-2')}>
                <h3 className="text-display-sm font-semibold text-ink md:text-[36px] md:leading-[44px]">{f.title}</h3>
                <p className="text-md text-ink">
                  <Rich value={f.body} />
                </p>
                <TextLink className="self-start">{f.link}</TextLink>
              </Reveal>
              <Reveal delay={0.1} className={cn('panel-gradient aspect-[3/2] overflow-hidden rounded-lg', flip && 'md:order-1')}>
                {featureArt[f.id]}
              </Reveal>
            </div>
          )
        })}
      </Container>
    </section>
  )
}

function PromptCard({ quote, steps, tag }: { quote: string; steps: string[]; tag: string }) {
  return (
    <div className="flex h-full flex-col justify-center gap-3 rounded-lg bg-mist p-6 sm:p-10">
      <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-brand-800 px-4 py-3 text-sm leading-5 text-on-accent shadow-sm">{quote}</div>
      <div className="mr-auto w-[85%] rounded-2xl rounded-bl-md bg-surface p-4 shadow-[0_1px_0_#00000012,0_8px_24px_-12px_#00000026]">
        <div className="mb-3 flex items-center gap-2">
          <LogoMark className="size-6" />
          <span className="text-xs font-semibold text-muted">TalkenFi · {tag}</span>
        </div>
        <ol className="grid gap-2">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2 text-sm text-ink">
              <span className={cn('grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-bold', i === steps.length - 1 ? 'bg-mint text-on-accent' : 'bg-brand-100 text-brand-800')}>
                {i === steps.length - 1 ? '✓' : i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export function Prompts() {
  return (
    <section className="bg-surface pt-10 pb-10 md:pt-[60px]">
      <Container>
        <Reveal>
          <SectionTitle>Ask it like you’d ask a friend</SectionTitle>
        </Reveal>
        <div className="flex flex-col gap-10 md:gap-20">
          {prompts.map((p, i) => {
            const flip = i % 2 === 1
            return (
              <div key={p.id} className="grid items-center gap-8 md:grid-cols-2 md:gap-20">
                <Reveal className={cn('md:h-[338px]', flip && 'md:order-2')}>
                  <PromptCard {...p} />
                </Reveal>
                <Reveal delay={0.1} className={cn('flex flex-col gap-10', flip && 'md:order-1')}>
                  <h3 className="text-display-sm font-semibold text-ink md:text-[36px] md:leading-[44px]">“{p.quote}”</h3>
                  <Button href={`/app?q=${encodeURIComponent(p.quote)}`} className="self-start">
                    Try this prompt
                  </Button>
                </Reveal>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

function ProductCopy({ name, title, body, cta, href, icon = 'chevron' as const }: { name: string; title: string; body: string; cta: string; href: string; icon?: 'chevron' | 'arrow' }) {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-[36px] leading-[46px] font-semibold text-ink md:text-display-lg md:leading-[60px]">
        <Highlight className="text-brand-600">{name}</Highlight>
        <br />
        {title}
      </h3>
      <p className="text-md text-ink">{body}</p>
      <Button href={href} icon={icon} className="mt-4 self-start md:mt-12">
        {cta}
      </Button>
    </div>
  )
}

function ScorePanel() {
  const rows = [
    { k: 'Personal loan', v: 'Pre-qualified', ok: true },
    { k: 'Auto loan', v: 'Pre-qualified', ok: true },
    { k: 'Business loan', v: 'Add revenue info', ok: false },
    { k: 'HELOC', v: 'Connect home account', ok: false },
  ]
  return (
    <div className="w-full overflow-hidden rounded-lg bg-surface shadow-[0_0_0_1px_#0000000f,0_24px_48px_-24px_#00000040]">
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <span className="text-md font-semibold text-ink">My Score</span>
        <span className="rounded-md bg-mist px-2.5 py-1 text-xs text-muted">7xKX…9fQm</span>
      </div>
      <div className="grid gap-5 p-6 sm:grid-cols-[150px_1fr]">
        <div className="relative mx-auto grid size-[150px] place-items-center">
          <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90" aria-hidden>
            <circle cx="60" cy="60" r="50" stroke="#2c2352" strokeWidth="12" fill="none" />
            <circle cx="60" cy="60" r="50" stroke="#55e9ab" strokeWidth="12" fill="none" strokeDasharray="314" strokeDashoffset="84" strokeLinecap="round" />
          </svg>
          <div className="text-center">
            <div className="text-[34px] leading-none font-semibold tracking-tight text-brand-900">Good</div>
            <div className="mt-1 text-xs text-muted">updated today</div>
          </div>
        </div>
        <ul className="grid gap-2">
          {rows.map((r) => (
            <li key={r.k} className="flex items-center justify-between rounded-lg border border-line px-3 py-2.5">
              <span className="text-sm text-ink">{r.k}</span>
              <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', r.ok ? 'bg-brand-100 text-brand-700' : 'bg-warn-soft text-warn')}>{r.v}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function Products() {
  return (
    <>
      <section className="bg-mist px-4 py-20">
        <Container className="grid items-center gap-10 md:grid-cols-[600px_1fr] md:gap-[50px] md:px-2.5">
          <Reveal className="mx-auto w-full max-w-[600px]">
            <AgentStackIllustration />
          </Reveal>
          <Reveal delay={0.1}>
            <ProductCopy {...products.agent} />
          </Reveal>
        </Container>
      </section>
      <section className="bg-mist px-4 py-20" id="score">
        <Container className="grid items-center gap-10 md:grid-cols-2 md:gap-10">
          <Reveal>
            <ProductCopy {...products.score} icon="arrow" />
          </Reveal>
          <Reveal delay={0.1}>
            <ScorePanel />
          </Reveal>
        </Container>
      </section>
      <section className="bg-mist px-4 py-20" id="mcp">
        <Container className="grid items-center gap-10 md:grid-cols-[600px_1fr] md:gap-[50px] md:px-2.5">
          <Reveal className="mx-auto w-full max-w-[600px] md:order-none">
            <McpIllustration />
          </Reveal>
          <Reveal delay={0.1}>
            <ProductCopy {...products.mcp} />
          </Reveal>
        </Container>
      </section>
    </>
  )
}

export function Chain() {
  return (
    <section className="bg-surface px-4 py-20" id="stocks">
      <Container className="grid items-center gap-10 lg:grid-cols-[840px_1fr]">
        <div>
          <Reveal>
            <h2 className="text-[36px] leading-[46px] font-semibold text-ink md:text-display-lg md:leading-[60px] md:tracking-[-0.03em]">
              {chain.lead} <Highlight className="text-brand-600">{chain.name}</Highlight>
              <br />
              {chain.title}
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-14">
            {chain.columns.map((c, i) => (
              <Reveal key={c.strong} delay={i * 0.1} className="flex flex-col gap-5">
                <p className="text-md font-semibold text-ink">{c.strong}</p>
                <p className="text-md text-ink">
                  <Rich value={c.body} />
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <Button href={SOLANA_DEV_URL} icon="external" className="mt-14">
              {chain.cta}
            </Button>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="mx-auto w-full max-w-[400px]">
          <ChainIllustration />
        </Reveal>
      </Container>
    </section>
  )
}
