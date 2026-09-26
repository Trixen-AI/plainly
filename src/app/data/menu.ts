/** Sidebar menu: every item is a sentence the agent understands, so clicking one drafts that prompt. */
export type MenuItem = { label: string; prompt?: string; to?: string }
export type MenuGroup = { label: string; icon: string; items: MenuItem[] }

export const MENU: MenuGroup[] = [
  {
    label: 'Trade',
    icon: 'M4 7h13l-3-3M20 17H7l3 3',
    items: [
      { label: 'Swap tokens', prompt: 'Swap 100 USDC for SOL' },
      { label: 'Limit order', prompt: 'Buy SOL if it drops to $150' },
      { label: 'Bridge', prompt: 'Bridge 100 USDC to Solana' },
      { label: 'Send', prompt: 'Send 0.01 SOL to ' },
      { label: 'Loop', prompt: 'Open a loop on SOL' },
      { label: 'Short', prompt: 'Open a short on SOL' },
    ],
  },
  {
    label: 'Markets',
    icon: 'M4 19V11M10 19V5M16 19v-6M22 19H2',
    items: [
      { label: 'What’s moving', prompt: 'What’s moving today, and is any of it in my portfolio?' },
      { label: 'Research a coin', prompt: 'Research the market for SOL' },
    ],
  },
  {
    label: 'Stocks',
    icon: 'M3 17l6-6 4 4 8-8M15 7h6v6',
    items: [
      { label: 'Buy stocks', prompt: 'Buy $100 of tokenized stocks' },
      { label: 'Sell stocks', prompt: 'Sell my tokenized stocks' },
      { label: 'Borrow against stocks', prompt: 'Borrow against my tokenized stocks' },
      { label: 'Stock portfolio', to: '/app/portfolio' },
    ],
  },
  {
    label: 'Borrow',
    icon: 'M12 3v18M7 8h7.5a3.5 3.5 0 0 1 0 7H6',
    items: [
      { label: 'My loans', prompt: 'Show my loans' },
      { label: 'Use collateral', prompt: 'Borrow $500 against my SOL collateral' },
      { label: 'Rollover', prompt: 'Roll over my loan' },
      { label: 'Repay', prompt: 'Repay half of my loan' },
    ],
  },
  {
    label: 'Earn',
    icon: 'M12 20V10M12 10c0-4 3-6 7-6 0 4-3 6-7 6ZM12 13c0-3-2.5-5-6-5 0 3 2.5 5 6 5Z',
    items: [
      { label: 'Find the best yield', prompt: 'Where can my USDC earn the most?' },
      { label: 'Deposit', prompt: 'Deposit 100 USDC into the best stable yield' },
      { label: 'Withdraw', prompt: 'Withdraw my USDC deposit' },
      { label: 'Earn extra rewards', prompt: 'Earn extra rewards on my deposits' },
      { label: 'My staked positions', prompt: 'Show my staked positions' },
      { label: 'Lend at your rate', prompt: 'Lend 1,000 USDC at 9% for 30 days' },
      { label: 'Claim rewards', prompt: 'Claim every reward I’m owed' },
    ],
  },
  {
    label: 'Loans',
    icon: 'M4 21V10l8-6 8 6v11M9 21v-6h6v6',
    items: [
      { label: 'Personal', prompt: 'Am I pre-qualified for a personal loan?' },
      { label: 'Auto', prompt: 'Am I pre-qualified for an auto loan?' },
      { label: 'Business', prompt: 'Am I pre-qualified for a business loan?' },
      { label: 'Debt consolidation', prompt: 'Can I consolidate my debts into one loan?' },
      { label: 'Student refi', prompt: 'Can I refinance my student loans?' },
      { label: 'HELOC', prompt: 'Am I pre-qualified for a HELOC?' },
      { label: 'Mortgage', prompt: 'Am I pre-qualified for a mortgage?' },
    ],
  },
  {
    label: 'Lending',
    icon: 'M3 10h18M5 10v8M9 10v8M15 10v8M19 10v8M2 20h20M12 3l9 5H3z',
    items: [
      { label: 'Kamino', prompt: 'Deposit 100 USDC on Kamino' },
      { label: 'Drift', prompt: 'Borrow 100 USDC on Drift' },
      { label: 'Jito', prompt: 'Stake 1 SOL with Jito' },
    ],
  },
  {
    label: 'DEX LP',
    icon: 'M8 12a4 4 0 1 0 0-.01M16 12a4 4 0 1 0 0-.01',
    items: [
      { label: 'Raydium', prompt: 'Add liquidity on Raydium' },
      { label: 'Orca', prompt: 'Add liquidity on Orca' },
      { label: 'Meteora', prompt: 'Add liquidity on Meteora' },
    ],
  },
  {
    label: 'Account',
    icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0',
    items: [
      { label: 'Portfolio', to: '/app/portfolio' },
      { label: 'My Score', to: '/app/score' },
      { label: 'See rates', to: '/app/score' },
    ],
  },
  {
    label: 'Benefits',
    icon: 'M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7H8a2 2 0 1 1 2-2l2 2Zm0 0h4a2 2 0 1 0-2-2l-2 2Z',
    items: [
      { label: 'Budgeting', prompt: 'Build me a budget from last month' },
      { label: 'Cash flow', prompt: 'Show my cash flow' },
      { label: 'Portfolio analytics', prompt: 'Show my portfolio analytics' },
      { label: 'Strategy generation', prompt: 'Suggest a strategy for my portfolio' },
    ],
  },
]
