import { useAppKit, useAppKitNetwork } from '@reown/appkit/react'
import { DEFAULT_NETWORK, explorerAddressUrl, isDevnet, networkName } from '@/app/wallet/config'
import { formatSol, shortAddress, useSolBalance, useWallet } from '@/app/wallet/hooks'
import { cn } from '@/lib/utils'

export function ConnectButton({ className }: { className?: string }) {
  const { open } = useAppKit()
  const { switchNetwork } = useAppKitNetwork()
  const { isConnected, address, networkId, onSupportedNetwork } = useWallet()

  if (!isConnected) {
    return (
      <button
        type="button"
        onClick={() => open()}
        className={cn('h-10 rounded-full bg-brand-800 px-4 text-sm font-semibold whitespace-nowrap text-on-accent hover:bg-brand-700', className)}
      >
        Connect Wallet
      </button>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {onSupportedNetwork ? (
        <button
          type="button"
          onClick={() => open({ view: 'Networks' })}
          className="hidden h-10 items-center gap-2 rounded-full bg-surface px-3 text-sm font-semibold text-ink ring-1 ring-line hover:ring-brand-300 sm:flex"
        >
          <span className={cn('size-2 rounded-full', isDevnet(networkId) ? 'bg-warn' : 'bg-mint')} aria-hidden />
          {networkName(networkId)}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => switchNetwork(DEFAULT_NETWORK)}
          className="h-10 rounded-full bg-warn-soft px-3 text-sm font-semibold text-warn ring-1 ring-warn/30 hover:ring-warn/60"
        >
          Switch to Solana
        </button>
      )}
      <button
        type="button"
        onClick={() => open({ view: 'Account' })}
        className="flex h-10 items-center gap-2 rounded-full bg-surface pr-3 pl-1.5 text-sm font-semibold text-ink ring-1 ring-line hover:ring-brand-300"
      >
        <span className="size-7 rounded-full bg-[conic-gradient(from_140deg,#9945ff,#55e9ab,#9945ff)]" aria-hidden />
        <span className="font-mono text-xs">{shortAddress(address)}</span>
      </button>
    </div>
  )
}

export function SolBalance({ address }: { address: string }) {
  const { networkId } = useWallet()
  const { data, isLoading, isError, refetch } = useSolBalance(address)
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-surface px-4 py-3 ring-1 ring-line">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{networkName(networkId)}</p>
        <a href={explorerAddressUrl(networkId, address)} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-700 hover:underline">
          View on explorer
        </a>
      </div>
      <div className="text-right">
        {isLoading ? (
          <span className="inline-block h-5 w-20 animate-pulse rounded bg-mist" />
        ) : isError ? (
          <button type="button" onClick={() => refetch()} className="text-xs font-semibold text-warn">
            Couldn’t load, retry
          </button>
        ) : (
          <p className="font-mono text-md font-semibold text-ink">
            {formatSol(data ?? 0)} <span className="text-muted">SOL</span>
          </p>
        )}
      </div>
    </div>
  )
}

export function BalanceCard() {
  const { isConnected, address } = useWallet()
  const { open } = useAppKit()
  if (!isConnected || !address) {
    return (
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-mist p-4 ring-1 ring-line">
        <p className="text-sm text-ink-soft">Connect a wallet to read your SOL balance.</p>
        <button type="button" onClick={() => open()} className="h-9 rounded-full bg-brand-800 px-4 text-sm font-semibold text-on-accent hover:bg-brand-700">
          Connect Wallet
        </button>
      </div>
    )
  }
  return (
    <div className="mt-3 rounded-2xl bg-mist p-3 ring-1 ring-line">
      <SolBalance address={address} />
    </div>
  )
}
