import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAppKit, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react'
import { useAppKitConnection, type Provider } from '@reown/appkit-adapter-solana/react'
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { field, planTitle, solToLamports, transferError } from '@/app/agent/engine'
import { useAgentStore } from '@/app/agent/context'
import type { PendingTx, TxStatus } from '@/app/agent/store'
import { useWallet } from '@/app/wallet/hooks'
import { DEFAULT_NETWORK, explorerTxUrl, networkName } from '@/app/wallet/config'
import { cn } from '@/lib/utils'

const STATUS: Record<TxStatus, { label: string; tone: string }> = {
  pending: { label: 'Waiting for signature', tone: 'bg-mist text-ink-soft ring-line' },
  signing: { label: 'Check your wallet', tone: 'bg-brand-50 text-brand-700 ring-brand-200' },
  submitted: { label: 'Submitted', tone: 'bg-brand-50 text-brand-700 ring-brand-200' },
  confirmed: { label: 'Confirmed', tone: 'bg-mint text-on-accent ring-mint' },
  approved: { label: 'Approved', tone: 'bg-mint text-on-accent ring-mint' },
  failed: { label: 'Failed', tone: 'bg-danger-soft text-danger ring-danger/30' },
  rejected: { label: 'Rejected', tone: 'bg-mist text-muted ring-line' },
}

function isUserRejection(err: unknown) {
  const text = `${(err as { name?: string })?.name ?? ''} ${(err as Error)?.message ?? ''}`
  return /reject|denied|cancel|declined/i.test(text)
}

function errorText(err: unknown) {
  return (err as Error)?.message?.split('\n')[0] || 'Something went wrong.'
}

const toBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes))

/** Plain-text approval shown in the wallet: readable by a person, no funds move. */
function approvalMessage(tx: PendingTx) {
  const lines = tx.plan.fields.map((x) => `${x.label}: ${x.value}${x.suffix ? ` ${x.suffix}` : ''}`)
  return ['TalkenFi approval', '', `Action: ${planTitle(tx.plan)}`, ...lines, '', `Issued: ${new Date(tx.at).toISOString()}`, 'No funds move when you sign this message.'].join('\n')
}

function TxItem({ tx }: { tx: PendingTx }) {
  const { updateTx, removeTx } = useAgentStore()
  const { open } = useAppKit()
  const { switchNetwork } = useAppKitNetwork()
  const { walletProvider } = useAppKitProvider<Provider>('solana')
  const { connection } = useAppKitConnection()
  const { isConnected, address, networkId, onSupportedNetwork } = useWallet()

  // Poll the signature until the cluster reports it confirmed (or failed).
  const sigStatus = useQuery({
    queryKey: ['sig-status', tx.hash],
    enabled: tx.status === 'submitted' && Boolean(tx.hash && connection),
    refetchInterval: 2000,
    queryFn: async () => (await connection!.getSignatureStatuses([tx.hash!])).value[0],
  })

  useEffect(() => {
    if (tx.status !== 'submitted' || !sigStatus.data) return
    if (sigStatus.data.err) updateTx(tx.id, { status: 'failed', error: 'The transaction failed onchain.' })
    else if (sigStatus.data.confirmationStatus === 'confirmed' || sigStatus.data.confirmationStatus === 'finalized')
      updateTx(tx.id, { status: 'confirmed', error: undefined })
  }, [sigStatus.data, tx.id, tx.status, updateTx])

  const sign = async () => {
    if (!isConnected || !address) {
      open()
      return
    }
    if (!onSupportedNetwork) {
      await switchNetwork(DEFAULT_NETWORK)
      updateTx(tx.id, { error: 'Switched to Solana. Press Sign again.' })
      return
    }
    if (!walletProvider || !connection) {
      updateTx(tx.id, { status: 'failed', error: 'Wallet is not ready yet. Reconnect and try again.' })
      return
    }
    try {
      updateTx(tx.id, { status: 'signing', error: undefined })
      if (tx.plan.mode === 'transfer') {
        const invalid = transferError(tx.plan)
        if (invalid) throw new Error(invalid)
        const from = new PublicKey(address)
        const { blockhash } = await connection.getLatestBlockhash()
        const transaction = new Transaction({ feePayer: from, recentBlockhash: blockhash }).add(
          SystemProgram.transfer({ fromPubkey: from, toPubkey: new PublicKey(field(tx.plan, 'to')), lamports: solToLamports(field(tx.plan, 'amount')) }),
        )
        const signature = await walletProvider.sendTransaction(transaction, connection)
        updateTx(tx.id, { status: 'submitted', hash: signature, networkId })
      } else {
        const signed = await walletProvider.signMessage(new TextEncoder().encode(approvalMessage(tx)))
        updateTx(tx.id, { status: 'approved', signature: toBase64(signed), networkId })
      }
    } catch (err) {
      if (isUserRejection(err)) updateTx(tx.id, { status: 'pending', error: 'You declined the request in your wallet.' })
      else updateTx(tx.id, { status: 'failed', error: errorText(err) })
    }
  }

  const s = STATUS[tx.status]
  const done = tx.status === 'confirmed' || tx.status === 'approved' || tx.status === 'rejected'
  const canSign = tx.status === 'pending' || tx.status === 'failed'

  return (
    <li className="rounded-2xl bg-surface p-4 ring-1 ring-line">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{planTitle(tx.plan)}</p>
          <p className="mt-0.5 text-xs text-muted">{tx.plan.mode === 'transfer' ? 'Onchain transfer' : 'Wallet approval'} · {new Date(tx.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1', s.tone)}>{s.label}</span>
      </div>

      <dl className="mt-3 grid gap-1.5">
        {tx.plan.fields.map((x) => (
          <div key={x.key} className="flex justify-between gap-3 text-xs">
            <dt className="text-muted">{x.label}</dt>
            <dd className={cn('truncate text-right font-medium text-ink', x.type === 'address' && 'font-mono')}>
              {x.value}
              {x.suffix ? ` ${x.suffix}` : ''}
            </dd>
          </div>
        ))}
      </dl>

      {tx.error && <p className="mt-3 rounded-lg bg-danger-soft px-3 py-2 text-xs text-danger">{tx.error}</p>}

      {(tx.hash || tx.signature) && (
        <div className="mt-3 rounded-lg bg-mist px-3 py-2 text-xs">
          {tx.hash ? (
            <a href={explorerTxUrl(tx.networkId, tx.hash)} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-700 hover:underline">
              View on {networkName(tx.networkId)} explorer
            </a>
          ) : (
            <p className="truncate font-mono text-muted" title={tx.signature}>
              Signature {tx.signature?.slice(0, 18)}…
            </p>
          )}
        </div>
      )}

      {!done && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            disabled={!canSign}
            onClick={sign}
            className="h-9 flex-1 rounded-full bg-brand-800 text-sm font-semibold text-on-accent transition hover:bg-brand-700 disabled:cursor-wait disabled:bg-brand-800/50"
          >
            {tx.status === 'signing' ? 'Waiting for wallet…' : tx.status === 'submitted' ? 'Confirming…' : !isConnected ? 'Connect to sign' : tx.status === 'failed' ? 'Try again' : 'Sign'}
          </button>
          {canSign && (
            <button type="button" onClick={() => updateTx(tx.id, { status: 'rejected', error: undefined })} className="h-9 rounded-full px-4 text-sm font-semibold text-ink-soft ring-1 ring-line hover:bg-mist">
              Reject
            </button>
          )}
        </div>
      )}
      {done && (
        <button type="button" onClick={() => removeTx(tx.id)} className="mt-3 text-xs font-semibold text-muted hover:text-ink">
          Clear
        </button>
      )}
    </li>
  )
}

export function TxPanel({ onClose }: { onClose?: () => void }) {
  const { queue } = useAgentStore()
  const open = queue.filter((t) => !['confirmed', 'approved', 'rejected'].includes(t.status))
  const done = queue.filter((t) => ['confirmed', 'approved', 'rejected'].includes(t.status))

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div>
          <p className="text-md font-semibold text-ink">Sign Transactions</p>
          <p className="text-xs text-muted">{open.length ? `${open.length} waiting` : 'Nothing waiting'}</p>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close transactions" className="grid size-9 place-items-center rounded-full ring-1 ring-ink/10">
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {queue.length === 0 ? (
          <div className="grid h-full place-items-center text-center">
            <div>
              <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand-100 text-brand-800">
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M4 17c3 0 3-4 6-4s3 4 6 4 3-4 4-4M4 21h16" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-semibold text-ink">No transactions to execute</p>
              <p className="mt-1 text-xs text-muted">Actions you prepare in the chat show up here.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-5">
            {open.length > 0 && (
              <ul className="grid gap-3">
                {open.map((t) => (
                  <TxItem key={t.id} tx={t} />
                ))}
              </ul>
            )}
            {done.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold tracking-widest text-muted uppercase">Done</p>
                <ul className="grid gap-3">
                  {done.map((t) => (
                    <TxItem key={t.id} tx={t} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
