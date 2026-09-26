import { useAppKit } from '@reown/appkit/react'
import { Link } from 'react-router'
import { planTitle } from '@/app/agent/engine'
import { useAgentStore } from '@/app/agent/context'
import { SolBalance } from '@/app/components/wallet'
import { shortAddress, useWallet } from '@/app/wallet/hooks'
import { explorerAddressUrl, explorerTxUrl, networkName } from '@/app/wallet/config'
import { cn } from '@/lib/utils'

export function Portfolio() {
  const { isConnected, address, networkId } = useWallet()
  const { open } = useAppKit()
  const { queue } = useAgentStore()
  const activity = queue.filter((t) => ['confirmed', 'approved', 'submitted', 'failed'].includes(t.status))

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto grid max-w-[960px] gap-8 px-4 py-8 md:px-6">
        <header>
          <h1 className="text-display-xs font-semibold text-ink md:text-display-sm">Portfolio</h1>
          <p className="mt-1 text-md text-muted">Your SOL balance, read live from Solana.</p>
        </header>

        {!isConnected || !address ? (
          <div className="rounded-2xl bg-mist p-8 text-center ring-1 ring-line">
            <p className="text-md font-semibold text-ink">Connect a wallet to see your portfolio</p>
            <p className="mt-1 text-sm text-muted">TalkenFi only reads balances. Nothing moves without your signature.</p>
            <button type="button" onClick={() => open()} className="mt-5 h-10 rounded-full bg-brand-800 px-5 text-sm font-semibold text-on-accent hover:bg-brand-700">
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            <section className="grid gap-4 rounded-2xl bg-surface p-5 ring-1 ring-line md:grid-cols-[1fr_auto] md:items-center">
              <div className="flex items-center gap-4">
                <span className="size-12 rounded-full bg-[conic-gradient(from_140deg,#9945ff,#55e9ab,#9945ff)]" aria-hidden />
                <div>
                  <p className="font-mono text-md font-semibold text-ink">{shortAddress(address)}</p>
                  <p className="text-sm text-muted">Connected to {networkName(networkId)}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => navigator.clipboard?.writeText(address)} className="h-9 rounded-full px-4 text-sm font-semibold text-ink ring-1 ring-line hover:bg-mist">
                  Copy address
                </button>
                <a href={explorerAddressUrl(networkId, address)} target="_blank" rel="noopener noreferrer" className="grid h-9 place-items-center rounded-full px-4 text-sm font-semibold text-ink ring-1 ring-line hover:bg-mist">
                  Explorer
                </a>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-md font-semibold text-ink">Balance</h2>
              <SolBalance address={address} />
              <p className="mt-2 text-xs text-muted">Switch between Solana and Solana Devnet from the network button in the top bar.</p>
            </section>
          </>
        )}

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-md font-semibold text-ink">TalkenFi activity</h2>
            <Link to="/app" className="text-sm font-semibold text-brand-700 hover:underline">
              New action
            </Link>
          </div>
          {activity.length === 0 ? (
            <p className="rounded-2xl bg-mist p-6 text-sm text-muted ring-1 ring-line">Signed transfers and approvals appear here.</p>
          ) : (
            <ul className="divide-y divide-line overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
              {activity.map((t) => (
                <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{planTitle(t.plan)}</p>
                    <p className="text-xs text-muted">{new Date(t.at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {t.hash && (
                      <a href={explorerTxUrl(t.networkId, t.hash)} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-brand-700 hover:underline">
                        Explorer
                      </a>
                    )}
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                        t.status === 'failed' ? 'bg-danger-soft text-danger' : t.status === 'submitted' ? 'bg-brand-50 text-brand-800' : 'bg-mint text-on-accent',
                      )}
                    >
                      {t.status === 'confirmed' ? 'Confirmed' : t.status === 'approved' ? 'Approved' : t.status === 'submitted' ? 'Submitted' : 'Failed'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
