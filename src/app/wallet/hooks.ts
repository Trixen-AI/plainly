import { formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { SUPPORTED_CHAIN_IDS } from '@/app/wallet/config'

export const shortAddress = (a?: string) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '')

export function formatAmount(value: bigint, decimals: number, max = 5) {
  const n = Number(formatUnits(value, decimals))
  if (n === 0) return '0'
  if (n < 1 / 10 ** max) return `<${(1 / 10 ** max).toFixed(max)}`
  return n.toLocaleString('en-US', { maximumFractionDigits: max })
}

export function useWallet() {
  const account = useAccount()
  const onSupportedChain = account.chainId !== undefined && SUPPORTED_CHAIN_IDS.includes(account.chainId)
  return { ...account, onSupportedChain }
}
