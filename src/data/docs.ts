import type { RichText } from '@/data/content'

export type DocBlock =
  | { type: 'p'; text: RichText }
  | { type: 'h2'; id: string; text: string }
  | { type: 'h3'; text: string }
  | { type: 'list'; items: RichText[] }
  | { type: 'steps'; items: { title: string; body: RichText }[] }
  | { type: 'callout'; tone: 'note' | 'warning'; title: string; body: RichText }
  | { type: 'prompts'; items: string[] }
  | { type: 'code'; label: string; code: string }
  | { type: 'table'; head: string[]; rows: RichText[][] }
  | { type: 'protocols'; items: { name: string; role: string }[] }

export type DocPage = {
  slug: string
  group: string
  title: string
  description: string
  blocks: DocBlock[]
}

export const DOC_GROUPS = ['Getting started', 'Using Plainly', 'Loans', 'Developers', 'Safety & reference'] as const

export const docs: DocPage[] = [
  {
    slug: 'introduction',
    group: 'Getting started',
    title: 'Introduction',
    description: 'What Plainly is, what it can do for you, and how it keeps you in control.',
    blocks: [
      {
        type: 'p',
        text: [
          { b: 'Plainly' },
          ' is an AI agent that turns plain language into onchain transactions. You describe what you want in a sentence, Plainly works out the steps, and you review and sign the result from your own wallet.',
        ],
      },
      { type: 'h2', id: 'what-you-can-do', text: 'What you can do' },
      {
        type: 'table',
        head: ['Area', 'Examples'],
        rows: [
          [[{ link: { label: 'Trade', to: '/docs/trading' } }], ['Swap tokens, place limit orders, bridge, send, open a loop or a short']],
          [[{ link: { label: 'Borrow', to: '/docs/borrowing' } }], ['Use tokens or tokenized stocks as collateral, roll over or repay a loan']],
          [[{ link: { label: 'Earn', to: '/docs/earning' } }], ['Find the best yield, deposit and withdraw, lend at your own rate, claim rewards']],
          [[{ link: { label: 'Stocks', to: '/docs/stocks' } }], ['Buy and sell tokenized stocks, borrow against them, track your stock portfolio']],
          [[{ link: { label: 'Loans', to: '/docs/pre-qualification' } }], ['Pre-qualify for personal, auto and business loans, debt consolidation, student refinancing and home financing']],
        ],
      },
      { type: 'h2', id: 'how-it-works', text: 'How it works' },
      {
        type: 'steps',
        items: [
          { title: 'You ask', body: ['Type a request such as ', { code: 'swap 200 USDC for ETH' }, '. No contract addresses or settings needed.'] },
          { title: 'Plainly plans', body: ['The agent picks the protocol and route, then prepares the transaction and shows what will happen.'] },
          { title: 'You review and sign', body: ['Nothing moves until you approve it in your wallet. You can cancel at any point.'] },
        ],
      },
      {
        type: 'callout',
        tone: 'note',
        title: 'Non-custodial',
        body: ['Plainly never holds your funds. Assets stay in your wallet, and every action needs your signature. Read more in ', { link: { label: 'Security', to: '/docs/security' } }, '.'],
      },
      { type: 'h2', id: 'next-steps', text: 'Next steps' },
      {
        type: 'list',
        items: [
          [{ link: { label: 'Quickstart', to: '/docs/quickstart' } }, ': connect a wallet and run your first prompt.'],
          [{ link: { label: 'Writing prompts', to: '/docs/writing-prompts' } }, ': get better results with clearer requests.'],
          [{ link: { label: 'Supported protocols', to: '/docs/protocols' } }, ': see where Plainly can route your actions.'],
        ],
      },
    ],
  },
  {
    slug: 'quickstart',
    group: 'Getting started',
    title: 'Quickstart',
    description: 'Connect a wallet, run your first prompt and sign your first transaction.',
    blocks: [
      { type: 'h2', id: 'connect', text: '1. Connect your wallet' },
      {
        type: 'p',
        text: ['Open the app and choose ', { b: 'Connect Wallet' }, '. Plainly reads your balances and positions so it can plan actions, but it cannot move anything without your signature.'],
      },
      { type: 'h2', id: 'credits', text: '2. Check your credits' },
      {
        type: 'p',
        text: ['Running prompts uses credits. Your balance is shown in the sidebar. See ', { link: { label: 'Credits', to: '/docs/credits' } }, ' for how they work.'],
      },
      { type: 'h2', id: 'first-prompt', text: '3. Ask for something' },
      { type: 'p', text: ['Start with a simple request. For example:'] },
      { type: 'prompts', items: ['What’s in my wallet right now?', 'Swap 50 USDC for ETH', 'Where can my USDC earn the most?'] },
      { type: 'h2', id: 'sign', text: '4. Review and sign' },
      {
        type: 'p',
        text: ['When an action is ready, it appears under ', { b: 'Sign Transactions' }, '. Check the amounts, the protocol and the fees, then approve it in your wallet. If there is nothing to sign, the panel shows ', { i: 'No transactions to execute' }, '.'],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Always read before you sign',
        body: ['The preview shows what the transaction will do. If anything looks different from what you asked for, reject it and rephrase your request.'],
      },
    ],
  },
  {
    slug: 'credits',
    group: 'Getting started',
    title: 'Credits',
    description: 'How credits pay for the AI, and how to keep an eye on your balance.',
    blocks: [
      {
        type: 'p',
        text: ['Credits cover the cost of running the AI agent. They are separate from network fees, which you pay in your wallet when you sign a transaction.'],
      },
      { type: 'h2', id: 'balance', text: 'Your balance' },
      {
        type: 'list',
        items: [
          ['Your credit balance is shown in the app sidebar as ', { i: 'credits to spend via AI' }, '.'],
          ['Use ', { b: 'Buy +' }, ' in the sidebar to add more.'],
          ['Your PLAIN token balance, in wallet and staked, is shown next to it.'],
        ],
      },
      { type: 'h2', id: 'what-uses-credits', text: 'What uses credits' },
      {
        type: 'p',
        text: ['Prompts that the agent plans or researches use credits. Signing a transaction does not use credits; it only uses the network fee shown in your wallet.'],
      },
    ],
  },
  {
    slug: 'writing-prompts',
    group: 'Using Plainly',
    title: 'Writing prompts',
    description: 'Clear requests get clear transactions. Tips and examples.',
    blocks: [
      { type: 'h2', id: 'principles', text: 'Good prompts' },
      {
        type: 'list',
        items: [
          [{ b: 'Say the amount and the asset' }, ': ', { code: 'swap 200 USDC for ETH' }, ' beats ', { code: 'buy some ETH' }, '.'],
          [{ b: 'Say the goal and the limits' }, ': ', { code: 'borrow $2,000 but keep me far from liquidation' }, '.'],
          [{ b: 'Chain steps in one sentence' }, ': ', { code: 'bridge 0.5 ETH to Robinhood Chain and buy $300 of stocks' }, '.'],
          [{ b: 'Ask questions first when unsure' }, ': ', { code: 'what would I earn in a year?' }, ' before depositing.'],
        ],
      },
      { type: 'h2', id: 'examples', text: 'Examples by area' },
      { type: 'h3', text: 'Trading' },
      { type: 'prompts', items: ['Swap 200 USDC for ETH', 'Buy ETH if it drops to $2,800', 'Send 25 USDC to maya.eth'] },
      { type: 'h3', text: 'Borrowing and earning' },
      { type: 'prompts', items: ['Move my idle USDC to the best stable yield', 'Repay half of my loan', 'Claim every reward I’m owed'] },
      { type: 'h3', text: 'Loans and planning' },
      { type: 'prompts', items: ['Am I pre-qualified for an auto loan?', 'Consolidate my two loans and show the new monthly payment', 'Build me a budget from last month'] },
      {
        type: 'callout',
        tone: 'note',
        title: 'Plainly asks when something is missing',
        body: ['If a request is ambiguous, for example no amount is given, the agent asks a follow-up question instead of guessing.'],
      },
    ],
  },
  {
    slug: 'trading',
    group: 'Using Plainly',
    title: 'Trading',
    description: 'Swap, place limit orders, bridge, send, and open loops or shorts.',
    blocks: [
      { type: 'h2', id: 'swap', text: 'Swap tokens' },
      {
        type: 'p',
        text: ['Ask for the pair and amount. Plainly finds a route across supported exchanges, quotes the price and prepares the swap for you to sign.'],
      },
      { type: 'prompts', items: ['Swap 200 USDC for ETH'] },
      { type: 'h2', id: 'limit-orders', text: 'Limit orders' },
      { type: 'p', text: ['Set the price you want to buy or sell at. The order waits until the market reaches it.'] },
      { type: 'prompts', items: ['Sell 1 ETH if it reaches $4,000'] },
      { type: 'h2', id: 'bridge', text: 'Bridge' },
      { type: 'p', text: ['Move assets from another network to Robinhood Chain, or back. The preview shows both sides of the transfer.'] },
      { type: 'h2', id: 'send', text: 'Send' },
      { type: 'p', text: ['Send tokens to an address or a name. Plainly repeats the recipient back to you before you sign.'] },
      { type: 'h2', id: 'loop-and-short', text: 'Loop and short' },
      {
        type: 'p',
        text: ['A ', { b: 'loop' }, ' repeatedly borrows and re-deposits to increase exposure. A ', { b: 'short' }, ' profits when a price falls. Both use leverage.'],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Leverage increases risk',
        body: ['Loops and shorts can be liquidated if prices move against you. Ask Plainly to explain the liquidation price before you sign.'],
      },
      { type: 'h2', id: 'markets', text: 'Markets and research' },
      { type: 'p', text: ['Ask what is moving today, or ask for a plain-English breakdown of a coin before you trade it.'] },
      { type: 'prompts', items: ['What’s moving today, and is any of it in my portfolio?', 'Research this coin for me'] },
    ],
  },
  {
    slug: 'borrowing',
    group: 'Using Plainly',
    title: 'Borrowing',
    description: 'Borrow against tokens or tokenized stocks, then roll over or repay.',
    blocks: [
      { type: 'h2', id: 'use-collateral', text: 'Use collateral' },
      {
        type: 'p',
        text: ['Deposit tokens or tokenized stocks as collateral and borrow against them. Plainly compares lending markets such as Aave, Morpho and Silo and shows the rate and loan health before you sign.'],
      },
      { type: 'prompts', items: ['Borrow $2,000 against my tokenized stocks, but keep me far from liquidation'] },
      { type: 'h2', id: 'loan-health', text: 'Loan health' },
      {
        type: 'p',
        text: ['Loan health shows how close a loan is to liquidation. It falls when your collateral loses value or your debt grows. Top up collateral or repay part of the loan to raise it.'],
      },
      { type: 'h2', id: 'my-loans', text: 'My loans' },
      { type: 'p', text: ['Ask for your loans to see each one’s balance, rate and health in one place.'] },
      { type: 'h2', id: 'rollover', text: 'Rollover' },
      { type: 'p', text: ['Extend or move a loan to new terms in one request instead of repaying and borrowing again by hand.'] },
      { type: 'h2', id: 'repay', text: 'Repay' },
      { type: 'p', text: ['Repay part or all of a loan at any time.'] },
      { type: 'prompts', items: ['Repay half of my loan'] },
    ],
  },
  {
    slug: 'earning',
    group: 'Using Plainly',
    title: 'Earning',
    description: 'Find yield, lend at your own rate, provide liquidity and claim rewards.',
    blocks: [
      { type: 'h2', id: 'best-yield', text: 'Find the best yield' },
      {
        type: 'p',
        text: ['Ask where an asset can earn the most. Plainly ranks options from lending markets, Pendle and exchange liquidity pools and explains the trade-offs.'],
      },
      {
        type: 'callout',
        tone: 'note',
        title: 'Highest is not always best',
        body: ['Ask for risk-aware options, for example ', { code: 'safest stable yield for 1,000 USDC' }, ', when you care more about safety than rate.'],
      },
      { type: 'h2', id: 'deposit-withdraw', text: 'Deposit and withdraw' },
      { type: 'p', text: ['Deposit into the option you chose, and withdraw whenever the position allows it.'] },
      { type: 'h2', id: 'lend-at-your-rate', text: 'Lend at your rate' },
      { type: 'p', text: ['Create a lending offer with your own rate and term. You can see and manage open offers under My lending offers.'] },
      { type: 'prompts', items: ['Lend 1,000 USDC at 9% for 30 days and tell me when it’s matched'] },
      { type: 'h2', id: 'liquidity', text: 'Provide liquidity' },
      { type: 'p', text: ['Add liquidity to exchange pools on Aerodrome, Uniswap or PancakeSwap and earn a share of trading fees.'] },
      { type: 'h2', id: 'rewards', text: 'Staked positions and rewards' },
      { type: 'p', text: ['See your staked positions, earn extra rewards, and claim what you are owed across protocols in one request.'] },
    ],
  },
  {
    slug: 'stocks',
    group: 'Using Plainly',
    title: 'Stocks',
    description: 'Buy, sell and borrow against tokenized stocks on Robinhood Chain.',
    blocks: [
      { type: 'h2', id: 'buy-sell', text: 'Buy and sell stocks' },
      { type: 'p', text: ['Buy or sell tokenized stocks with a sentence, in the same place you trade tokens.'] },
      { type: 'prompts', items: ['Buy $300 of stocks with my USDC'] },
      { type: 'h2', id: 'borrow-against-stocks', text: 'Borrow against stocks' },
      {
        type: 'p',
        text: ['Use tokenized stocks as collateral without selling them. Loan health works the same way as for tokens. See ', { link: { label: 'Borrowing', to: '/docs/borrowing#loan-health' } }, '.'],
      },
      { type: 'h2', id: 'portfolio', text: 'Stock portfolio' },
      { type: 'p', text: ['Ask for your stock portfolio to see holdings next to your token positions.'] },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Prices move',
        body: ['Tokenized stocks can lose value. Borrowing against them can lead to liquidation if prices fall.'],
      },
    ],
  },
  {
    slug: 'pre-qualification',
    group: 'Loans',
    title: 'No-collateral pre-qualification',
    description: 'Check estimated loan options without putting up collateral.',
    blocks: [
      {
        type: 'p',
        text: ['Plainly can check whether you pre-qualify for loans that do not need crypto collateral, and show estimated rates in the conversation.'],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Estimates, not offers',
        body: ['Pre-qualification shows estimated options. It is not an offer of credit or a guarantee of approval. Final terms come from the lender.'],
      },
      { type: 'h2', id: 'loan-types', text: 'Loan types' },
      {
        type: 'table',
        head: ['Type', 'What it is for'],
        rows: [
          [[{ b: 'Personal' }], ['General expenses and one-off costs']],
          [[{ b: 'Auto' }], ['Buying a new or used car, or refinancing one']],
          [[{ b: 'Business' }], ['Working capital for a business']],
          [[{ b: 'Debt consolidation' }], ['Combining several debts into one payment']],
          [[{ b: 'Student refi' }], ['Refinancing student loans']],
          [[{ b: 'Homes' }], ['Buying or selling, a HELOC, or a mortgage']],
        ],
      },
      { type: 'h2', id: 'how-to', text: 'How to check' },
      {
        type: 'steps',
        items: [
          { title: 'Ask', body: [{ code: 'Am I pre-qualified for an auto loan?' }] },
          { title: 'Share what is needed', body: ['Plainly tells you which details or accounts help the check, and you choose what to connect.'] },
          { title: 'Compare', body: ['See estimated options side by side, then decide whether to continue with a lender.'] },
        ],
      },
      { type: 'h2', id: 'score', text: 'Your score' },
      { type: 'p', text: ['Pre-qualification uses your Plainly Score. See ', { link: { label: 'Plainly Score', to: '/docs/plainly-score' } }, '.'] },
    ],
  },
  {
    slug: 'plainly-score',
    group: 'Loans',
    title: 'Plainly Score',
    description: 'The private profile that powers pre-qualification and rate estimates.',
    blocks: [
      {
        type: 'p',
        text: ['Your Plainly Score is built from your onchain history and the accounts you choose to connect. It powers no-collateral pre-qualification and helps produce clearer rate estimates.'],
      },
      { type: 'h2', id: 'see-it', text: 'See your score' },
      { type: 'p', text: ['Open ', { b: 'Account → My Score' }, ' in the app, or ask ', { code: 'show my score' }, '. You can also open ', { b: 'See rates' }, ' from the same menu.'] },
      { type: 'h2', id: 'improve', text: 'What can change it' },
      {
        type: 'list',
        items: [
          ['Connecting more accounts gives a fuller picture.'],
          ['Repaying loans on time and keeping loan health high.'],
          ['Keeping your details up to date when a check asks for them.'],
        ],
      },
      {
        type: 'callout',
        tone: 'note',
        title: 'You choose what to connect',
        body: ['Nothing is connected without your approval, and you can see which accounts are linked from your account.'],
      },
    ],
  },
  {
    slug: 'mcp',
    group: 'Developers',
    title: 'Plainly MCP',
    description: 'Give any MCP-compatible AI agent a wallet that listens, with a human signature on every transaction.',
    blocks: [
      {
        type: 'p',
        text: ['The Plainly MCP server exposes Plainly’s actions as tools, so an AI agent you already use can plan swaps, loans and yield actions. Every transaction still needs a signature from your wallet.'],
      },
      { type: 'h2', id: 'add', text: 'Add the server' },
      {
        type: 'steps',
        items: [
          { title: 'Open the app', body: ['Choose ', { b: 'Add Plainly MCP' }, ' in the sidebar and copy your server URL.'] },
          { title: 'Add it to your agent', body: ['Paste the URL into your MCP client’s server settings. Most clients use a config like the one below.'] },
          { title: 'Choose allowed actions', body: ['Pick which actions the agent may prepare. Leave the rest off.'] },
        ],
      },
      {
        type: 'code',
        label: 'mcp config (example)',
        code: `{
  "mcpServers": {
    "plainly": {
      "url": "<paste the server URL from the app>"
    }
  }
}`,
      },
      {
        type: 'callout',
        tone: 'note',
        title: 'Use the URL from the app',
        body: ['The value above is a placeholder. Copy the exact URL shown under Add Plainly MCP, and keep it private.'],
      },
      { type: 'h2', id: 'tools', text: 'What the agent can do' },
      {
        type: 'list',
        items: [
          [{ b: 'Trade' }, ': swaps, limit orders, bridges and sends.'],
          [{ b: 'Borrow and earn' }, ': loans, repayments, deposits and rewards.'],
          [{ b: 'Read' }, ': balances, positions, loans and prices.'],
        ],
      },
      { type: 'h2', id: 'agents', text: 'Launch an agent' },
      { type: 'p', text: ['Use ', { b: 'Launch an agent' }, ' in the app to run a custom agent with the same review-before-you-sign safety.'] },
    ],
  },
  {
    slug: 'security',
    group: 'Safety & reference',
    title: 'Security',
    description: 'How Plainly keeps you in control of every transaction.',
    blocks: [
      { type: 'h2', id: 'non-custodial', text: 'Non-custodial by design' },
      { type: 'p', text: ['Plainly never holds your funds or your keys. Assets stay in your wallet, and every action needs your signature.'] },
      { type: 'h2', id: 'preview', text: 'Previewed before you sign' },
      { type: 'p', text: ['Each transaction shows expected amounts, fees and risks before you approve it, so nothing surprises you afterwards.'] },
      { type: 'h2', id: 'limits', text: 'Limits you can always see' },
      { type: 'p', text: ['Credits, loan health and open positions are shown in plain numbers, and you can stop any strategy at any time.'] },
      { type: 'h2', id: 'good-habits', text: 'Good habits' },
      {
        type: 'list',
        items: [
          ['Check the recipient, amount and protocol on every preview.'],
          ['Never share your seed phrase. Plainly will never ask for it.'],
          ['Keep your MCP server URL private and turn off actions you do not use.'],
        ],
      },
    ],
  },
  {
    slug: 'protocols',
    group: 'Safety & reference',
    title: 'Supported protocols',
    description: 'Where Plainly can route your actions today.',
    blocks: [
      { type: 'p', text: ['Plainly routes actions across these protocols. Logos are shown as provided by each project.'] },
      {
        type: 'protocols',
        items: [
          { name: 'Aave', role: 'Lending and borrowing' },
          { name: 'Morpho', role: 'Lending and borrowing' },
          { name: 'Silo', role: 'Lending and borrowing' },
          { name: 'Pendle', role: 'Yield' },
          { name: 'Aerodrome', role: 'Exchange liquidity' },
          { name: 'Uniswap', role: 'Swaps and liquidity' },
          { name: 'PancakeSwap', role: 'Swaps and liquidity' },
          { name: 'Polymarket', role: 'Prediction markets' },
        ],
      },
    ],
  },
  {
    slug: 'faq',
    group: 'Safety & reference',
    title: 'FAQ',
    description: 'Short answers to common questions.',
    blocks: [
      { type: 'h3', text: 'Can Plainly move my funds without me?' },
      { type: 'p', text: ['No. Every transaction needs your signature in your wallet.'] },
      { type: 'h3', text: 'What do credits pay for?' },
      { type: 'p', text: ['The AI agent. Network fees are separate and shown when you sign. See ', { link: { label: 'Credits', to: '/docs/credits' } }, '.'] },
      { type: 'h3', text: 'Is pre-qualification a loan offer?' },
      { type: 'p', text: ['No. It shows estimated options. Final terms come from the lender.'] },
      { type: 'h3', text: 'Which network does Plainly use?' },
      { type: 'p', text: ['Plainly settles on Robinhood Chain, and can bridge assets to and from other networks.'] },
      { type: 'h3', text: 'Where do I get help?' },
      { type: 'p', text: ['Use ', { b: 'Ask a question' }, ' or ', { b: 'Request a beta feature' }, ' in the app. Priority support is available from the Support menu.'] },
    ],
  },
]

export const docBySlug = Object.fromEntries(docs.map((d) => [d.slug, d])) as Record<string, DocPage>
