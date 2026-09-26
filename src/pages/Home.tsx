import { useSeo } from '@/lib/seo'
import { Hero, Integrations, StatsStatement } from '@/components/sections/Hero'
import { Chain, Features, Products, Prompts } from '@/components/sections/Features'
import { Capabilities, Cta, Security } from '@/components/sections/Lower'

export function Home() {
  useSeo({
    title: 'TalkenFi: AI agent for onchain money on Solana',
    description:
      'TalkenFi turns plain language into onchain transactions. Swap, bridge, borrow, lend and earn, or pre-qualify for a no-collateral loan, on Solana.',
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
