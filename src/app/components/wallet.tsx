import { useAppKit } from '@reown/appkit/react'
import { robinhood, robinhoodTestnet } from 'viem/chains'
import { useBalance, useSwitchChain } from 'wagmi'
import { chainName, DEFAULT_CHAIN, explorerAddressUrl } from '@/app/wallet/config'
import { formatAmount, shortAddress, useWallet } from '@/app/wallet/hooks'
import { cn } from '@/lib/utils'

export function ConnectButton({ className }: { className?: string }) {
  const { open } = useAppKit()
  const { isConnected, address, chainId, onSupportedChain } = useWallet()
  const { switchChain, isPending } = useSwitchChain()

  if (!isConnected) {
    return (
      <button
        type="button"
        onClick={() => open()}
        className={cn('btn-sheen h-10 rounded-full bg-brand-800 px-4 text-sm font-semibold whitespace-nowrap text-white shadow-skeumorphic hover:bg-brand-700', className)}
      >
        Connect Wallet
      </button>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {onSupportedChain ? (
        <button
          type="button"
          onClick={() => open({ view: 'Networks' })}
          className="hidden h-10 items-center gap-2 rounded-full bg-white px-3 text-sm font-semibold text-ink ring-1 ring-line hover:ring-brand-300 sm:flex"
        >
          <span className={cn('size-2 rounded-full', chainId === robinhoodTestnet.id ? 'bg-amber-400' : 'bg-brand-500')} aria-hidden />
          {chainId === robinhoodTestnet.id ? 'Testnet' : 'Robinhood Chain'}
        </button>
      ) : (
        <button
          type="button"
          disabled={isPending}
          onClick={() => switchChain({ chainId: DEFAULT_CHAIN.id })}
          className="h-10 rounded-full bg-cream px-3 text-sm font-semibold text-[#7a4f00] ring-1 ring-[#f1dcae] hover:bg-[#fff1d6]"
        >
          {isPending ? 'Switching…' : 'Switch to Robinhood Chain'}
        </button>
      )}
      <button
        type="button"
        onClick={() => open({ view: 'Account' })}
        className="flex h-10 items-center gap-2 rounded-full bg-white pr-3 pl-1.5 text-sm font-semibold text-ink ring-1 ring-line hover:ring-brand-300"
      >
        <span className="size-7 rounded-full bg-[conic-gradient(from_120deg,#16a060,#d4f36b,#063424,#16a060)]" aria-hidden />
        <span className="font-mono text-xs">{shortAddress(address)}</span>
      </button>
    </div>
  )
}

function ChainBalance({ address, chainId }: { address: `0x${string}`; chainId: number }) {
  const { data, isLoading, isError, refetch } = useBalance({ address, chainId })
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-line">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{chainName(chainId)}</p>
        <a href={explorerAddressUrl(chainId, address)} target="_blank" rel="noreferrer" className="text-xs text-brand-700 hover:underline">
          View on explorer
        </a>
      </div>
      <div className="text-right">
        {isLoading ? (
          <span className="inline-block h-5 w-20 animate-pulse rounded bg-mist" />
        ) : isError ? (
          <button type="button" onClick={() => refetch()} className="text-xs font-semibold text-[#7a4f00]">
            Couldn’t load, retry
          </button>
        ) : (
          <p className="font-mono text-md font-semibold text-ink">
            {data ? formatAmount(data.value, data.decimals) : '0'} <span className="text-muted">{data?.symbol ?? 'ETH'}</span>
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
        <p className="text-sm text-ink-soft">Connect a wallet to read balances on Robinhood Chain.</p>
        <button type="button" onClick={() => open()} className="h-9 rounded-full bg-brand-800 px-4 text-sm font-semibold text-white hover:bg-brand-700">
          Connect Wallet
        </button>
      </div>
    )
  }
  return (
    <div className="mt-3 grid gap-2 rounded-2xl bg-mist p-3 ring-1 ring-line">
      <ChainBalance address={address} chainId={robinhood.id} />
      <ChainBalance address={address} chainId={robinhoodTestnet.id} />
    </div>
  )
}

export { ChainBalance }
