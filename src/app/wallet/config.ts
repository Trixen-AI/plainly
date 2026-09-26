import { createAppKit } from '@reown/appkit/react'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { solana, solanaDevnet, type AppKitNetwork } from '@reown/appkit/networks'
import { SITE_NAME } from '@/data/content'

/**
 * Solana networks from Reown AppKit. Mainnet is the default; devnet is kept for testing with free devnet SOL.
 * Phantom, Solflare, Backpack and other Wallet Standard wallets are picked up automatically.
 */
export const DEFAULT_NETWORK = solana
export const NETWORKS: [AppKitNetwork, ...AppKitNetwork[]] = [solana, solanaDevnet]
export const SUPPORTED_NETWORK_IDS: string[] = [String(solana.id), String(solanaDevnet.id)]

export const projectId = import.meta.env.VITE_REOWN_PROJECT_ID ?? ''
export const hasProjectId = projectId.length > 0

export const solanaAdapter = new SolanaAdapter()

export const appKit = createAppKit({
  adapters: [solanaAdapter],
  networks: NETWORKS,
  defaultNetwork: DEFAULT_NETWORK,
  // AppKit still boots without an ID (browser wallets work); WalletConnect QR and mobile wallets need a real one.
  projectId: projectId || 'missing-project-id',
  metadata: {
    name: SITE_NAME,
    description: 'An AI agent that turns plain language into onchain transactions on Solana.',
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
  // Solana wallets first in the modal (WalletConnect registry IDs): Phantom, Solflare, Backpack.
  featuredWalletIds: [
    'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393',
    '1ca0bdd4747578705b1939af023d120677c64fe6ca76add81fda36e350605e79',
    '2bd8c14e035c2d48f184aaa168559e86b0e3433228d3c4075900a221785019b0',
  ],
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#9945ff',
    '--w3m-color-mix': '#0b0a10',
    '--w3m-color-mix-strength': 20,
    '--w3m-font-family': "'Inter Variable', Inter, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
    '--w3m-border-radius-master': '3px',
  },
})

const isDevnet = (networkId?: string | number) => String(networkId) === String(solanaDevnet.id)
const clusterQuery = (networkId?: string | number) => (isDevnet(networkId) ? '?cluster=devnet' : '')

export function explorerTxUrl(networkId: string | number | undefined, signature: string) {
  return `https://explorer.solana.com/tx/${signature}${clusterQuery(networkId)}`
}

export function explorerAddressUrl(networkId: string | number | undefined, address: string) {
  return `https://explorer.solana.com/address/${address}${clusterQuery(networkId)}`
}

export function networkName(networkId?: string | number) {
  if (String(networkId) === String(solana.id)) return 'Solana'
  if (isDevnet(networkId)) return 'Solana Devnet'
  return 'Unsupported network'
}

export { isDevnet }
