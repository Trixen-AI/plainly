import { useSeo } from '@/lib/seo'
import { Hero, Integrations, StatsStatement } from '@/components/sections/Hero'
import { Chain, Features, Products, Prompts } from '@/components/sections/Features'
import { Capabilities, Cta, Security } from '@/components/sections/Lower'

export function Home() {
  useSeo({
    title: 'Plainly: AI agent for onchain money on Robinhood Chain',
    description:
      'Plainly turns plain language into onchain transactions. Swap, bridge, borrow, lend and earn, or pre-qualify for a no-collateral loan, on Robinhood Chain.',
    path: '/',
  })

  return (
    <main>
      <Hero />
      <Integrations />
      <StatsStatement />
      <Features />
      <Prompts />
      <Products />
      <Chain />
      <Capabilities />
      <Security />
      <Cta />
    </main>
  )
}
