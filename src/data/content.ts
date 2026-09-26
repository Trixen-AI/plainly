export const SITE_URL = 'https://talkenhub.xyz'
export const SITE_NAME = 'TalkenFi'
export const X_URL = 'https://x.com/TalkenFi_xyz'
export const X_HANDLE = '@TalkenFi_xyz'
export const APP_URL = '/app'
export const DOCS_URL = '/docs'
export const SOLANA_DEV_URL = 'https://solana.com/developers'

export type RichText = Array<string | { b: string } | { i: string } | { code: string } | { link: { label: string; to: string } }>

export type NavGroup = {
  label: string
  columns: { title: string; links: { label: string; hint: string; href?: string }[] }[]
}

export const navGroups: NavGroup[] = [
  {
    label: 'Trade',
    columns: [
      {
        title: 'Move tokens',
        links: [
          { label: 'Swap tokens', hint: 'Best route, one sentence', href: '/docs/trading#swap' },
          { label: 'Limit order', hint: 'Buy or sell at your price', href: '/docs/trading#limit-orders' },
          { label: 'Bridge', hint: 'Bring assets to Solana', href: '/docs/trading#bridge' },
          { label: 'Send', hint: 'Pay anyone by name or address', href: '/docs/trading#send' },
        ],
      },
      {
        title: 'Markets & stocks',
        links: [
          { label: "What's moving", hint: 'Today’s biggest movers', href: '/docs/trading#markets' },
          { label: 'Research a coin', hint: 'Plain-English breakdowns', href: '/docs/trading#markets' },
          { label: 'Buy & sell stocks', hint: 'Tokenized equities', href: '/docs/stocks#buy-sell' },
          { label: 'Loop & short', hint: 'Leveraged strategies', href: '/docs/trading#loop-and-short' },
        ],
      },
    ],
  },
  {
    label: 'Borrow & Earn',
    columns: [
      {
        title: 'Borrow',
        links: [
          { label: 'My loans', hint: 'Health, rates and dates', href: '/docs/borrowing#my-loans' },
          { label: 'Use collateral', hint: 'Tokens or tokenized stocks', href: '/docs/borrowing#use-collateral' },
          { label: 'Rollover', hint: 'Extend without the hassle', href: '/docs/borrowing#rollover' },
          { label: 'Repay', hint: 'Partial or full, anytime', href: '/docs/borrowing#repay' },
        ],
      },
      {
        title: 'Earn',
        links: [
          { label: 'Find the best yield', hint: 'Ranked across protocols', href: '/docs/earning#best-yield' },
          { label: 'Lend at your rate', hint: 'Set terms, get matched', href: '/docs/earning#lend-at-your-rate' },
          { label: 'Staked positions', hint: 'Track and withdraw', href: '/docs/earning#rewards' },
          { label: 'Claim rewards', hint: 'Every protocol, one tap', href: '/docs/earning#rewards' },
        ],
      },
    ],
  },
  {
    label: 'Loans',
    columns: [
      {
        title: 'No-collateral loans',
        links: [
          { label: 'Personal', hint: 'Check estimated rates', href: '/docs/pre-qualification#loan-types' },
          { label: 'Auto', hint: 'New, used or refinance', href: '/docs/pre-qualification#loan-types' },
          { label: 'Business', hint: 'Working capital options', href: '/docs/pre-qualification#loan-types' },
          { label: 'Debt consolidation', hint: 'One payment, one rate', href: '/docs/pre-qualification#loan-types' },
        ],
      },
      {
        title: 'Homes',
        links: [
          { label: 'Buy or sell', hint: 'Plan your next move', href: '/docs/pre-qualification#loan-types' },
          { label: 'HELOC', hint: 'Tap your home equity', href: '/docs/pre-qualification#loan-types' },
          { label: 'Mortgage', hint: 'Compare pre-qualified rates', href: '/docs/pre-qualification#loan-types' },
          { label: 'Student refi', hint: 'Lower what you owe monthly', href: '/docs/pre-qualification#loan-types' },
        ],
      },
    ],
  },
  {
    label: 'Resources',
    columns: [
      {
        title: 'Learn',
        links: [
          { label: 'Docs', hint: 'How the agent works', href: '/docs' },
          { label: 'TalkenFi MCP', hint: 'Plug into your own agent', href: '/docs/mcp' },
          { label: 'Build on Solana', hint: 'Developer resources', href: 'https://solana.com/developers' },
        ],
      },
      {
        title: 'Support',
        links: [
          { label: 'Ask a question', hint: 'Answers inside the chat', href: '/docs/faq' },
          { label: 'Request a beta feature', hint: 'Shape the roadmap', href: '/docs/faq' },
          { label: 'Priority support', hint: 'Faster answers from the team', href: '/docs/faq' },
          { label: 'Status', hint: 'Live system health', href: '#status' },
        ],
      },
    ],
  },
]

export const hero = {
  titleTop: 'Your money,',
  titleBottom: 'in plain words',
  body: [
    { b: 'TalkenFi' },
    ' is an AI agent that turns everyday sentences into onchain transactions. Swap, bridge, borrow, lend and earn, or ',
    { b: 'pre-qualify for a no-collateral loan' },
    ', with ',
    { b: 'nothing signed until you approve it' },
    '.',
  ] as RichText,
  primary: 'Launch the agent',
  secondary: 'Check my rates',
}

export const protocols = ['Jupiter', 'Raydium', 'Orca', 'Meteora', 'Kamino', 'Drift', 'Jito']

export const stats = [
  { value: '40+', label: 'actions you can ask for' },
  { value: '7', label: 'protocols in a single chat' },
  { value: '4', label: 'loan types to pre-qualify for' },
]

export const statement = {
  highlight: 'TalkenFi reads what you mean',
  rest: 'and turns it into a transaction you can review, sign and track',
}

export type Feature = {
  id: string
  title: string
  body: RichText
  link: string
}

export const features: Feature[] = [
  {
    id: 'trade',
    title: 'Trade by typing a sentence',
    body: [
      'Tell TalkenFi ',
      { i: '“swap 200 USDC for SOL”' },
      ' and it finds the route, quotes the price and prepares the transaction. Place ',
      { b: 'limit orders' },
      ', ',
      { b: 'bridge to Solana' },
      ', send to a friend, or open a ',
      { b: 'loop or short' },
      ', all from the same chat window.',
    ],
    link: 'Explore trading',
  },
  {
    id: 'borrow',
    title: 'Borrow without the busywork',
    body: [
      'Put tokens or ',
      { b: 'tokenized stocks' },
      ' to work as collateral, then ',
      { b: 'roll over or repay' },
      ' a loan with one message. TalkenFi compares terms across ',
      { b: 'Kamino and Drift' },
      ' so you never have to juggle tabs to find a fair rate.',
    ],
    link: 'Explore borrowing',
  },
  {
    id: 'earn',
    title: 'Earn more on what you already hold',
    body: [
      'Ask ',
      { i: '“where can my USDC earn the most?”' },
      ' and get a ranked answer from lending markets, ',
      { b: 'Jito staking' },
      ' and ',
      { b: 'DEX liquidity pools' },
      '. Deposit, withdraw and claim rewards, or ',
      { b: 'lend at your own rate' },
      ' and let borrowers come to you.',
    ],
    link: 'Explore earning',
  },
  {
    id: 'loans',
    title: 'Pre-qualify for a loan, no collateral',
    body: [
      'Check options for ',
      { b: 'personal, auto and business loans' },
      ', debt consolidation or student refinancing, plus ',
      { b: 'home buying, HELOCs and mortgages' },
      '. See estimated rates in a conversation, ',
      { b: 'without locking up a single token' },
      '.',
    ],
    link: 'See my options',
  },
]

export const prompts = [
  {
    id: 'yield',
    quote: 'Move my idle USDC to the best stable yield and tell me what I’d earn in a year.',
    steps: ['Scanned 6 lending markets', 'Best match: stable vault', 'Deposit ready to sign'],
    tag: 'Earn',
  },
  {
    id: 'stocks',
    quote: 'Borrow $2,000 against my tokenized stocks, but keep me far from liquidation.',
    steps: ['Checked collateral value', 'Loan health kept above safe range', 'Borrow ready to sign'],
    tag: 'Borrow',
  },
  {
    id: 'bridge',
    quote: 'Bridge 200 USDC to Solana and buy $150 of tokenized stocks with it.',
    steps: ['Bridge route found', 'Swap to stablecoin queued', 'Two steps, one review'],
    tag: 'Bridge & buy',
  },
]

export const products = {
  agent: {
    name: 'TalkenFi Agent',
    title: 'One chat for every onchain move',
    body: 'The agent understands intent, picks the right protocol, simulates the outcome and shows exactly what will happen before you sign. Your wallet, your keys, your call.',
    cta: 'Launch the agent',
    href: '/app',
  },
  score: {
    name: 'TalkenFi Score',
    title: 'See what you qualify for',
    body: 'Your onchain history and the accounts you choose to connect build a private profile that unlocks no-collateral pre-qualification and clearer rate estimates. Check it anytime from your account.',
    cta: 'See my score',
    href: '/app/score',
  },
  mcp: {
    name: 'TalkenFi MCP',
    title: 'Give any AI agent a wallet that listens',
    body: 'Add the TalkenFi MCP server to the agent you already use and call swaps, loans and yield actions as tools. Launch custom agents that act onchain with the same review-before-you-sign safety.',
    cta: 'Add TalkenFi MCP',
    href: '/app/mcp',
  },
}

export const chain = {
  lead: 'Settled on',
  name: 'Solana',
  title: 'Where stocks and crypto share one wallet',
  columns: [
    {
      strong: 'Low fees make small, frequent moves worth it.',
      body: [
        'TalkenFi settles on Solana, so ',
        { b: 'rebalancing' },
        ', topping up a loan or ',
        { b: 'claiming rewards' },
        ' doesn’t quietly eat into what you earn.',
      ] as RichText,
    },
    {
      strong: 'Tokenized stocks and tokens, side by side.',
      body: [
        'Buy, sell and borrow against stocks in the same place you swap tokens. One portfolio, one chat, one signature at a time.',
      ] as RichText,
    },
  ],
  cta: 'Build on Solana',
}

export const capabilities = [
  {
    id: 'intents',
    title: 'Plain-language intents',
    body: 'No contract addresses, no slippage sliders. Describe the outcome you want and TalkenFi fills in the technical details.',
  },
  {
    id: 'tools',
    title: 'Money tools built in',
    body: 'Budgeting, cash-flow tracking, portfolio analytics and strategy ideas, generated from the positions you actually hold.',
  },
  {
    id: 'support',
    title: 'Help without leaving the chat',
    body: 'Ask a question, request a beta feature or reach priority support, right where you already are.',
  },
]

export const security = [
  {
    id: 'custody',
    title: 'Non-custodial by design',
    body: 'TalkenFi never holds your funds. Assets stay in your wallet and every action needs your signature.',
  },
  {
    id: 'simulate',
    title: 'Previewed before you sign',
    body: 'Each transaction shows expected amounts, fees and risks up front, so nothing surprises you after approval.',
  },
  {
    id: 'limits',
    title: 'Limits you can always see',
    body: 'Credits, loan health and open positions appear in plain numbers, and you can stop any strategy at any time.',
  },
]

export const cta = {
  title: 'Start with a sentence',
  body: 'Connect your wallet, type what you want to do and review the transaction before anything moves. Credits cover the AI; you only sign what you approve.',
  button: 'Launch the agent',
}

export const examplePrompts = [
  { text: 'What’s moving today, and is any of it in my portfolio?', label: 'Markets' },
  { text: 'Consolidate my two loans into one and show me the new monthly payment.', label: 'Loans' },
  { text: 'Lend 1,000 USDC at 9% for 30 days and tell me when it’s matched.', label: 'Lend' },
  { text: 'Build me a budget from last month’s spending and flag anything unusual.', label: 'Budgeting' },
  { text: 'Claim every reward I’m owed and restake the best ones.', label: 'Rewards' },
  { text: 'Am I pre-qualified for a HELOC? Keep it a soft look.', label: 'Homes' },
]

export const footerColumns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Trade',
    links: [
      { label: 'Swap tokens', href: '/docs/trading#swap' },
      { label: 'Limit order', href: '/docs/trading#limit-orders' },
      { label: 'Bridge', href: '/docs/trading#bridge' },
      { label: 'Send', href: '/docs/trading#send' },
      { label: 'Loop & short', href: '/docs/trading#loop-and-short' },
    ],
  },
  {
    title: 'Borrow & Earn',
    links: [
      { label: 'My loans', href: '/docs/borrowing#my-loans' },
      { label: 'Use collateral', href: '/docs/borrowing#use-collateral' },
      { label: 'Find the best yield', href: '/docs/earning#best-yield' },
      { label: 'Lend at your rate', href: '/docs/earning#lend-at-your-rate' },
      { label: 'Claim rewards', href: '/docs/earning#rewards' },
    ],
  },
  {
    title: 'Loans',
    links: [
      { label: 'Personal', href: '/docs/pre-qualification#loan-types' },
      { label: 'Auto', href: '/docs/pre-qualification#loan-types' },
      { label: 'Business', href: '/docs/pre-qualification#loan-types' },
      { label: 'Debt consolidation', href: '/docs/pre-qualification#loan-types' },
      { label: 'Homes & HELOC', href: '/docs/pre-qualification#loan-types' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Docs', href: '/docs' },
      { label: 'Ask a question', href: '/docs/faq' },
      { label: 'Request a beta feature', href: '/docs/faq' },
      { label: 'Priority support', href: '/docs/faq' },
      { label: 'Build on Solana', href: 'https://solana.com/developers' },
    ],
  },
]
