import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { robinhood, robinhoodTestnet } from 'viem/chains'

/**
 * Robinhood Chain networks come from viem's official chain definitions:
 * mainnet 4663 (rpc.mainnet.chain.robinhood.com), testnet 46630 (rpc.testnet.chain.robinhood.com),
 * matching docs.robinhood.com/chain.
 */
export const DEFAULT_CHAIN = robinhood
export const NETWORKS: [AppKitNetwork, ...AppKitNetwork[]] = [robinhood, robinhoodTestnet]
export const SUPPORTED_CHAIN_IDS: number[] = [robinhood.id, robinhoodTestnet.id]

export const projectId = import.meta.env.VITE_REOWN_PROJECT_ID ?? ''
export const hasProjectId = projectId.length > 0

export const wagmiAdapter = new WagmiAdapter({
  // AppKit still boots without an ID (injected wallets work); WalletConnect QR needs a real one.
  projectId: projectId || 'missing-project-id',
  networks: NETWORKS,
})

export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks: NETWORKS,
  defaultNetwork: DEFAULT_CHAIN,
  projectId: projectId || 'missing-project-id',
  metadata: {
    name: 'Plainly',
    description: 'An AI agent that turns plain language into onchain transactions on Robinhood Chain.',
    url: window.location.origin,
    icons: [`${window.location.origin}/brand/logo-500.png`],
  },
  features: {
    analytics: false,
    email: false,
    socials: false,
    swaps: false,
    onramp: false,
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#084b32',
    '--w3m-color-mix': '#063424',
    '--w3m-color-mix-strength': 8,
    '--w3m-font-family': "'Inter Variable', Inter, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
    '--w3m-border-radius-master': '3px',
  },
})

export function explorerTxUrl(chainId: number, hash: string) {
  const chain = chainId === robinhoodTestnet.id ? robinhoodTestnet : robinhood
  return `${chain.blockExplorers.default.url}/tx/${hash}`
}

export function explorerAddressUrl(chainId: number, address: string) {
  const chain = chainId === robinhoodTestnet.id ? robinhoodTestnet : robinhood
  return `${chain.blockExplorers.default.url}/address/${address}`
}

export function chainName(chainId?: number) {
  if (chainId === robinhood.id) return robinhood.name
  if (chainId === robinhoodTestnet.id) return robinhoodTestnet.name
  return 'Unsupported network'
}
