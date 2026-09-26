import { useQuery } from '@tanstack/react-query'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { useAppKitConnection } from '@reown/appkit-adapter-solana/react'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { SUPPORTED_NETWORK_IDS } from '@/app/wallet/config'

export const shortAddress = (a?: string) => (a ? `${a.slice(0, 4)}…${a.slice(-4)}` : '')

export function formatSol(lamports: number, max = 5) {
  const n = lamports / LAMPORTS_PER_SOL
  if (n === 0) return '0'
  if (n < 1 / 10 ** max) return `<${(1 / 10 ** max).toFixed(max)}`
  return n.toLocaleString('en-US', { maximumFractionDigits: max })
}

/** Connected Solana account and whether it is on a network TalkenFi supports (mainnet or devnet). */
export function useWallet() {
  const { address, isConnected } = useAppKitAccount({ namespace: 'solana' })
  const { chainId, caipNetwork } = useAppKitNetwork()
  const networkId = chainId === undefined ? undefined : String(chainId)
  const onSupportedNetwork = networkId !== undefined && SUPPORTED_NETWORK_IDS.includes(networkId) && caipNetwork?.chainNamespace === 'solana'
  return { address, isConnected, networkId, onSupportedNetwork }
}

/** Live SOL balance (in lamports) of an address on the wallet's current network. */
export function useSolBalance(address?: string) {
  const { connection } = useAppKitConnection()
  const { networkId } = useWallet()
  return useQuery({
    queryKey: ['sol-balance', networkId, address],
    enabled: Boolean(connection && address),
    queryFn: () => connection!.getBalance(new PublicKey(address!)),
    refetchInterval: 30_000,
  })
}
