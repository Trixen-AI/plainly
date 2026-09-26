import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { APP_URL, CONTRACT_ADDRESS, hero, protocols, stats, statement } from '@/data/content'
import { HeroWaves } from '@/components/illustrations/Illustrations'
import { ProtocolLogo } from '@/components/ProtocolLogo'
import { Button, Container, Highlight, Reveal, Rich } from '@/components/ui/primitives'
import { cn, EASE } from '@/lib/utils'

export function Hero() {
  return (
    <section className="hero-gradient relative -mt-[72px] overflow-hidden pt-[72px]">
      <HeroWaves />
      <div className="relative mx-auto flex max-w-[896px] flex-col items-center px-4 pt-20 pb-[190px] text-center md:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="text-[44px] leading-[52px] font-semibold tracking-[-1.5px] text-brand-900 sm:text-display-2xl sm:leading-[92px] sm:tracking-[-3px]"
        >
          {hero.titleTop}
          <br />
          {hero.titleBottom}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
          className="mt-10 flex max-w-[700px] flex-col items-center gap-10"
        >
          <p className="text-lg leading-7 text-brand-900">
            <Rich value={hero.body} />
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Button href={APP_URL} icon="external">
              {hero.primary}
            </Button>
            <Button href="/#rates" icon="arrow">
              {hero.secondary}
            </Button>
          </div>
          <ContractAddress address={CONTRACT_ADDRESS} />
        </motion.div>
      </div>
      {/* curved bottom edge */}
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[50px] w-full md:h-[90px]" aria-hidden>
        <path d="M0 90V52C360 -10 1080 -10 1440 52v38z" fill="#0b0a10" />
      </svg>
    </section>
  )
}

const shortAddress = (a: string) => `${a.slice(0, 6)}...${a.slice(-6)}`

/** Token contract address with a copy button. Full address from sm up; shortened on phones so it never overflows. */
function ContractAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex max-w-full items-center gap-3 rounded-full bg-surface/70 py-1.5 pr-1.5 pl-4 ring-1 ring-line backdrop-blur-sm">
      <span className="shrink-0 text-xs font-semibold tracking-[0.12em] text-mint uppercase">CA</span>
      <code className="min-w-0 truncate font-mono text-sm text-ink" title={address}>
        <span className="hidden sm:inline">{address}</span>
        <span className="sm:hidden">{shortAddress(address)}</span>
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Contract address copied' : 'Copy contract address'}
        className={cn(
          'flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-semibold ring-1 transition-colors',
          copied ? 'bg-mint text-on-accent ring-mint' : 'text-ink-soft ring-line hover:bg-mist hover:text-ink',
        )}
      >
        {copied ? (
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <rect x="5.5" y="5.5" width="8" height="8" rx="2" />
            <path d="M10.5 3.5v-.5a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5" />
          </svg>
        )}
        <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  )
}

// Official logos only (src/assets/logos, source URLs listed there).
function ProtocolMark({ name }: { name: string }) {
  return (
    <span className="flex h-8 shrink-0 items-center px-10">
      <ProtocolLogo name={name} className="h-7" textClassName="text-[22px]" />
    </span>
  )
}

export function Integrations() {
  const row = [...protocols, ...protocols]
  return (
    <section className="border-t border-line/60 bg-surface py-5" aria-label="Protocols TalkenFi routes across">
      <p className="text-center text-sm font-medium tracking-[0.15em] text-brand-900 uppercase">Routes across</p>
      <div className="relative mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {row.map((p, i) => (
            <ProtocolMark key={`${p}-${i}`} name={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function StatsStatement() {
  return (
    <section className="bg-surface pt-[112px]">
      <Container className="grid gap-10 md:grid-cols-3 md:gap-0">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="px-5 text-center">
            <div className="text-[64px] leading-[76px] font-semibold tracking-[-3px] text-brand-900 md:text-[88px] md:leading-[92px]">{s.value}</div>
            <div className="text-md text-brand-900">{s.label}</div>
          </Reveal>
        ))}
      </Container>
      <Reveal>
        <h2 className="mx-auto max-w-[1050px] px-2 pt-10 text-center text-display-md font-semibold tracking-[-0.03em] text-ink md:text-display-lg md:tracking-[-0.03em]">
          <Highlight>{statement.highlight}</Highlight>
          <br />
          {statement.rest}
        </h2>
      </Reveal>
    </section>
  )
}
