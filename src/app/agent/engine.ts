import { isAddress, parseEther } from 'viem'

/**
 * Rule-based intent engine: plain sentence in, interactive plan out.
 * Every plan has editable fields and a Sign action:
 * - `transfer` plans send a real native ETH transaction on Robinhood Chain.
 * - `approval` plans ask the wallet to sign the action as a typed message (free, no funds move). Replace the
 *   approval handler with protocol execution when routing is connected.
 */

export type FieldType = 'amount' | 'token' | 'address' | 'select' | 'text' | 'percent' | 'price' | 'days'

export type PlanField = {
  key: string
  label: string
  value: string
  type: FieldType
  options?: string[]
  suffix?: string
}

export type PlanKind =
  | 'send'
  | 'swap'
  | 'limit'
  | 'bridge'
  | 'loop'
  | 'short'
  | 'borrow'
  | 'repay'
  | 'rollover'
  | 'deposit'
  | 'withdraw'
  | 'lend'
  | 'claim'
  | 'liquidity'
  | 'stocks'
  | 'predict'
  | 'prequal'
  | 'agent'

export type Plan = {
  kind: PlanKind
  mode: 'transfer' | 'approval'
  fields: PlanField[]
  risk?: string
}

export type AgentReply = {
  text: string
  steps?: string[]
  plan?: Plan
  card?: 'balance' | 'score' | 'mcp'
  suggestions?: string[]
}

export type AgentContext = { address?: string; chainName?: string; connected: boolean }

export const TOKENS = ['ETH', 'USDC', 'USDT', 'WBTC', 'DAI']
export const EXCHANGES = ['Best route', 'Uniswap', 'Aerodrome', 'PancakeSwap']
export const LENDING = ['Best rate', 'Aave', 'Morpho', 'Silo']
export const YIELD = ['Best yield', 'Aave', 'Morpho', 'Silo', 'Pendle']
export const POOLS = ['Aerodrome', 'Uniswap', 'PancakeSwap']

const num = (s?: string, fallback = '') => (s ? s.replace(/,/g, '') : fallback)
const token = (s?: string, fallback = 'USDC') => {
  const t = (s ?? '').toUpperCase()
  return TOKENS.includes(t) ? t : fallback
}
const f = (key: string, label: string, value: string, type: FieldType, extra: Partial<PlanField> = {}): PlanField => ({ key, label, value, type, ...extra })

export function field(plan: Plan, key: string) {
  return plan.fields.find((x) => x.key === key)?.value ?? ''
}

/** Human title for a plan, recomputed from its current field values. */
export function planTitle(plan: Plan) {
  const v = (k: string) => field(plan, k)
  switch (plan.kind) {
    case 'send':
      return `Send ${v('amount') || '…'} ETH`
    case 'swap':
      return `Swap ${v('amount') || '…'} ${v('from')} → ${v('to')}`
    case 'limit':
      return `${v('side')} ${v('amount') || '…'} ${v('token')} at $${v('price') || '…'}`
    case 'bridge':
      return `Bridge ${v('amount') || '…'} ${v('token')} to Robinhood Chain`
    case 'loop':
      return `Loop ${v('token')} at ${v('leverage')}`
    case 'short':
      return `Short ${v('token')} with ${v('amount') || '…'} USDC`
    case 'borrow':
      return `Borrow ${v('amount') || '…'} ${v('token')} on ${v('market')}`
    case 'repay':
      return `Repay ${v('share')} of my loan`
    case 'rollover':
      return `Roll over loan for ${v('term')}`
    case 'deposit':
      return `Deposit ${v('amount') || '…'} ${v('token')} into ${v('venue')}`
    case 'withdraw':
      return `Withdraw ${v('amount') || '…'} ${v('token')}`
    case 'lend':
      return `Lend ${v('amount') || '…'} ${v('token')} at ${v('rate') || '…'}%`
    case 'claim':
      return 'Claim all rewards'
    case 'liquidity':
      return `Add ${v('amount') || '…'} ${v('token')} liquidity on ${v('pool')}`
    case 'stocks':
      return `${v('side')} $${v('amount') || '…'} of ${v('ticker') || 'stocks'}`
    case 'predict':
      return `Predict: ${v('market') || 'market'}`
    case 'prequal':
      return `Pre-qualify: ${v('loan')} loan, ${v('amount') || '…'}`
    case 'agent':
      return `Launch agent: ${v('name') || 'Untitled'}`
  }
}

export function planIsComplete(plan: Plan) {
  return plan.fields.every((x) => {
    if (x.type === 'amount' || x.type === 'price' || x.type === 'percent' || x.type === 'days') return Number(x.value) > 0
    if (x.type === 'address') return isAddress(x.value)
    return x.value.trim().length > 0
  })
}

/** Validates the executable part of a transfer; returns an error message or null. */
export function transferError(plan: Plan): string | null {
  if (plan.mode !== 'transfer') return null
  const to = field(plan, 'to')
  const amount = field(plan, 'amount')
  if (!isAddress(to)) return 'Enter a valid 0x recipient address.'
  try {
    if (parseEther(amount) <= 0n) return 'Enter an amount above zero.'
  } catch {
    return 'Enter a valid ETH amount.'
  }
  return null
}

type Rule = { test: RegExp; reply: (m: RegExpMatchArray, ctx: AgentContext, input: string) => AgentReply }

const sign = (ctx: AgentContext) => (ctx.connected ? 'Adjust anything below, then sign it in the Transactions panel.' : 'Adjust anything below, then connect your wallet to sign.')

const rules: Rule[] = [
  {
    test: /\bsend\s+([\d.,]+)?\s*(?:eth)?\s*(?:to\s+(\S+))?/i,
    reply: (m, ctx) => {
      const to = (m[2] ?? '').replace(/[.,;!?]+$/, '')
      return {
        text: `I prepared a native ETH transfer on Robinhood Chain. ${sign(ctx)}`,
        steps: ['Read the recipient and amount', 'Built a transfer on Robinhood Chain', 'Ready for your signature'],
        plan: {
          kind: 'send',
          mode: 'transfer',
          fields: [f('amount', 'Amount', num(m[1], '0.001'), 'amount', { suffix: 'ETH' }), f('to', 'Recipient', to.startsWith('0x') ? to : '', 'address')],
        },
      }
    },
  },
  {
    test: /\b(balance|wallet|portfolio|holdings|what'?s in my|what’s in my|how much eth)\b/i,
    reply: (_m, ctx) => ({
      text: ctx.connected ? 'Here’s your wallet on Robinhood Chain right now.' : 'Connect your wallet and I’ll read your balances on Robinhood Chain.',
      card: 'balance',
      suggestions: ['Send 0.001 ETH to 0x', 'Swap 100 USDC for ETH'],
    }),
  },
  {
    test: /\bswap\s+([\d.,]+)?\s*([a-z]+)?\s*(?:for|to|into)?\s*([a-z]+)?/i,
    reply: (m, ctx) => ({
      text: `I set up the swap and will route it through the best available exchange. ${sign(ctx)}`,
      steps: ['Picked the pair and amount', 'Selected the best route', 'Ready for your signature'],
      plan: {
        kind: 'swap',
        mode: 'approval',
        fields: [
          f('amount', 'You pay', num(m[1], '100'), 'amount'),
          f('from', 'Pay token', token(m[2], 'USDC'), 'token', { options: TOKENS }),
          f('to', 'Receive token', token(m[3], 'ETH'), 'token', { options: TOKENS }),
          f('route', 'Route', 'Best route', 'select', { options: EXCHANGES }),
          f('slippage', 'Max slippage', '0.5', 'percent', { suffix: '%' }),
        ],
      },
    }),
  },
  {
    test: /\b(buy|sell)\b(?!.*\bstock).*?\b(if|when|at)\b.*?\$?\s?([\d,.]+)/i,
    reply: (m, ctx) => ({
      text: `That’s a limit order. It fills when the market reaches your price. ${sign(ctx)}`,
      plan: {
        kind: 'limit',
        mode: 'approval',
        fields: [
          f('side', 'Side', m[1][0].toUpperCase() + m[1].slice(1).toLowerCase(), 'select', { options: ['Buy', 'Sell'] }),
          f('amount', 'Amount', '1', 'amount'),
          f('token', 'Token', 'ETH', 'token', { options: TOKENS }),
          f('price', 'Limit price', num(m[3], '2800'), 'price', { suffix: 'USD' }),
        ],
      },
    }),
  },
  {
    test: /\bbridge\s*([\d.,]+)?\s*([a-z]+)?/i,
    reply: (m, ctx) => ({
      text: `I prepared a bridge to Robinhood Chain. ${sign(ctx)}`,
      plan: {
        kind: 'bridge',
        mode: 'approval',
        fields: [
          f('amount', 'Amount', num(m[1], '0.1'), 'amount'),
          f('token', 'Token', token(m[2], 'ETH'), 'token', { options: TOKENS }),
          f('source', 'From network', 'Ethereum', 'select', { options: ['Ethereum', 'Base', 'Arbitrum', 'Optimism'] }),
        ],
      },
    }),
  },
  {
    test: /\bloop\b/i,
    reply: (_m, ctx) => ({
      text: `A loop borrows and re-deposits to increase exposure. ${sign(ctx)}`,
      plan: {
        kind: 'loop',
        mode: 'approval',
        fields: [f('token', 'Asset', 'ETH', 'token', { options: TOKENS }), f('amount', 'Starting amount', '1', 'amount'), f('leverage', 'Leverage', '2x', 'select', { options: ['1.5x', '2x', '3x'] })],
        risk: 'Higher leverage moves the liquidation price closer. Keep an eye on loan health.',
      },
    }),
  },
  {
    test: /\bshort\b/i,
    reply: (_m, ctx) => ({
      text: `A short gains when the price falls. ${sign(ctx)}`,
      plan: {
        kind: 'short',
        mode: 'approval',
        fields: [f('token', 'Asset', 'ETH', 'token', { options: TOKENS }), f('amount', 'Collateral', '500', 'amount', { suffix: 'USDC' }), f('leverage', 'Leverage', '2x', 'select', { options: ['1.5x', '2x', '3x'] })],
        risk: 'If the price rises, the position can be liquidated.',
      },
    }),
  },
  {
    test: /\brepay\b/i,
    reply: (_m, ctx) => ({
      text: `I set up the repayment. ${sign(ctx)}`,
      plan: { kind: 'repay', mode: 'approval', fields: [f('share', 'Repay', '50%', 'select', { options: ['25%', '50%', '75%', '100%'] }), f('market', 'Loan on', 'Aave', 'select', { options: LENDING.slice(1) })] },
    }),
  },
  {
    test: /\b(rollover|roll over)\b/i,
    reply: (_m, ctx) => ({
      text: `I prepared a rollover to new terms. ${sign(ctx)}`,
      plan: { kind: 'rollover', mode: 'approval', fields: [f('term', 'New term', '30 days', 'select', { options: ['30 days', '60 days', '90 days'] }), f('market', 'Market', 'Best rate', 'select', { options: LENDING })] },
    }),
  },
  {
    test: /\b(borrow|collateral|my loans?)\b\D*([\d.,]+)?/i,
    reply: (m, ctx) => ({
      text: `I compared lending markets and set up the loan. ${sign(ctx)}`,
      steps: ['Read your collateral', 'Compared Aave, Morpho and Silo', 'Kept loan health in a safe range'],
      plan: {
        kind: 'borrow',
        mode: 'approval',
        fields: [
          f('amount', 'Borrow', num(m[2], '500'), 'amount'),
          f('token', 'Token', 'USDC', 'token', { options: TOKENS }),
          f('collateral', 'Collateral', 'ETH', 'select', { options: ['ETH', 'WBTC', 'Tokenized stocks'] }),
          f('market', 'Market', 'Best rate', 'select', { options: LENDING }),
        ],
        risk: 'Borrowing can be liquidated if your collateral loses value.',
      },
    }),
  },
  {
    test: /\blend\b\D*([\d.,]+)?\s*([a-z]+)?(?:\D*([\d.]+)\s*%)?/i,
    reply: (m, ctx) => ({
      text: `I set up a lending offer at your rate. ${sign(ctx)}`,
      plan: {
        kind: 'lend',
        mode: 'approval',
        fields: [f('amount', 'Amount', num(m[1], '1000'), 'amount'), f('token', 'Token', token(m[2], 'USDC'), 'token', { options: TOKENS }), f('rate', 'Rate', num(m[3], '9'), 'percent', { suffix: '%' }), f('days', 'Term', '30', 'days', { suffix: 'days' })],
      },
    }),
  },
  {
    test: /\bclaim\b|\breward/i,
    reply: (_m, ctx) => ({
      text: `I gathered your rewards across protocols. ${sign(ctx)}`,
      plan: { kind: 'claim', mode: 'approval', fields: [f('restake', 'After claiming', 'Keep in wallet', 'select', { options: ['Keep in wallet', 'Restake the best ones'] })] },
    }),
  },
  {
    test: /\bwithdraw\b\D*([\d.,]+)?\s*([a-z]+)?/i,
    reply: (m, ctx) => ({
      text: `I prepared the withdrawal. ${sign(ctx)}`,
      plan: { kind: 'withdraw', mode: 'approval', fields: [f('amount', 'Amount', num(m[1], '100'), 'amount'), f('token', 'Token', token(m[2], 'USDC'), 'token', { options: TOKENS }), f('venue', 'From', 'Aave', 'select', { options: YIELD.slice(1) })] },
    }),
  },
  {
    test: /\b(liquidity|pool|lp)\b/i,
    reply: (_m, ctx, input) => {
      const pool = POOLS.find((p) => input.toLowerCase().includes(p.toLowerCase())) ?? 'Uniswap'
      return {
        text: `I set up the liquidity position. ${sign(ctx)}`,
        plan: { kind: 'liquidity', mode: 'approval', fields: [f('amount', 'Amount', '100', 'amount'), f('token', 'Token', 'USDC', 'token', { options: TOKENS }), f('pool', 'Pool', pool, 'select', { options: POOLS })], risk: 'Liquidity positions can lose value when prices move apart.' },
      }
    },
  },
  {
    test: /\b(earn|yield|apy|deposit|stake|staked)\b\D*([\d.,]+)?\s*([a-z]+)?/i,
    reply: (m, ctx, input) => {
      const venue = YIELD.find((p) => input.toLowerCase().includes(p.toLowerCase())) ?? 'Best yield'
      return {
        text: `I ranked the options and set up the deposit. ${sign(ctx)}`,
        steps: ['Scanned lending markets and Pendle', 'Ranked by rate and risk', 'Ready for your signature'],
        plan: { kind: 'deposit', mode: 'approval', fields: [f('amount', 'Amount', num(m[2], '100'), 'amount'), f('token', 'Token', token(m[3], 'USDC'), 'token', { options: TOKENS }), f('venue', 'Venue', venue, 'select', { options: YIELD })] },
      }
    },
  },
  {
    test: /\bstocks?\b/i,
    reply: (_m, ctx, input) => ({
      text: `I set up the stock order. ${sign(ctx)}`,
      plan: {
        kind: 'stocks',
        mode: 'approval',
        fields: [f('side', 'Side', /\bsell\b/i.test(input) ? 'Sell' : 'Buy', 'select', { options: ['Buy', 'Sell'] }), f('amount', 'Amount', '100', 'amount', { suffix: 'USD' }), f('ticker', 'Stock', '', 'text')],
      },
    }),
  },
  {
    test: /\b(pre-?qualif\w*|personal loan|auto loan|car loan|business loan|mortgage|heloc|refi\w*|consolidat\w*|student)\b/i,
    reply: () => ({ text: 'Let’s check what you pre-qualify for. Estimates are not an offer of credit.', card: 'score', suggestions: ['Show my score'] }),
  },
  {
    test: /\bscore\b|\brates?\b/i,
    reply: () => ({ text: 'Your Plainly Score powers no-collateral pre-qualification.', card: 'score' }),
  },
  {
    test: /\b(mcp|agent|claude|tool)\b/i,
    reply: () => ({ text: 'Give your own AI agent access to Plainly actions through the MCP server. Your signature is still required.', card: 'mcp' }),
  },
  {
    test: /\b(polymarket|prediction|predict|odds)\b/i,
    reply: (_m, ctx) => ({
      text: `I set up a prediction position. ${sign(ctx)}`,
      plan: { kind: 'predict', mode: 'approval', fields: [f('market', 'Market', '', 'text'), f('outcome', 'Outcome', 'Yes', 'select', { options: ['Yes', 'No'] }), f('amount', 'Stake', '10', 'amount', { suffix: 'USDC' })] },
    }),
  },
]

const HELP: AgentReply = {
  text: 'Tell me what you want to do. For example:',
  suggestions: ['What’s in my wallet?', 'Send 0.001 ETH to 0x', 'Swap 100 USDC for ETH', 'Where can my USDC earn the most?', 'Am I pre-qualified for an auto loan?'],
}

export function planReply(input: string, ctx: AgentContext): AgentReply {
  const text = input.trim()
  if (!text || /^(hi|hello|hey|help|what can you do)\b/i.test(text)) return HELP
  for (const rule of rules) {
    const m = text.match(rule.test)
    if (m) return rule.reply(m, ctx, text)
  }
  return { text: 'Tell me the action and amount and I’ll set it up, for example:', suggestions: HELP.suggestions }
}

export function titleFrom(input: string) {
  const t = input.trim().replace(/\s+/g, ' ')
  return t.length > 42 ? `${t.slice(0, 40)}…` : t
}
