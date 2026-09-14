import { motion } from 'motion/react'
import { APP_URL, hero, protocols, stats, statement } from '@/data/content'
import { HeroWaves } from '@/components/illustrations/Illustrations'
import { OFFICIAL_LOGOS } from '@/assets/logos'
import { BrandLogo, Button, Container, Highlight, Reveal, Rich } from '@/components/ui/primitives'
import { EASE } from '@/lib/utils'

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
        </motion.div>
      </div>
      {/* curved bottom edge */}
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[50px] w-full md:h-[90px]" aria-hidden>
        <path d="M0 90V52C360 -10 1080 -10 1440 52v38z" fill="#fff" />
      </svg>
    </section>
  )
}

// Official logos only (src/assets/logos, source URLs listed there).
function ProtocolMark({ name }: { name: string }) {
  const logo = OFFICIAL_LOGOS[name]
  return (
    <span className="flex h-8 shrink-0 items-center px-10">
      <BrandLogo svg={logo.svg} name={name} className="h-7" />
    </span>
  )
}

export function Integrations() {
  const row = [...protocols, ...protocols]
  return (
    <section className="border-t border-line/60 bg-white py-5" aria-label="Protocols Plainly routes across">
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
    <section className="bg-white pt-[112px]">
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
