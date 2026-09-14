import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import type { Plan } from '@/app/agent/engine'
import { useAgentStore } from '@/app/agent/context'
import { cn } from '@/lib/utils'

const ACTIONS = [
  { id: 'read', label: 'Read balances and positions', group: 'Read' },
  { id: 'swap', label: 'Swaps and limit orders', group: 'Trade' },
  { id: 'send', label: 'Sends and bridges', group: 'Trade' },
  { id: 'borrow', label: 'Borrow and repay', group: 'Borrow & earn' },
  { id: 'earn', label: 'Deposits, withdrawals and rewards', group: 'Borrow & earn' },
  { id: 'stocks', label: 'Tokenized stocks', group: 'Stocks' },
]

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onChange} className={cn('relative h-6 w-11 shrink-0 rounded-full transition', on ? 'bg-brand-600' : 'bg-line')}>
      <span className={cn('absolute top-0.5 size-5 rounded-full bg-white shadow transition-all', on ? 'left-[22px]' : 'left-0.5')} />
    </button>
  )
}

export function Mcp() {
  const { enqueue, queue } = useAgentStore()
  const [allowed, setAllowed] = useState<string[]>(['read', 'swap', 'earn'])
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [name, setName] = useState('Yield keeper')
  const [instructions, setInstructions] = useState('Keep my idle USDC in the best stable yield and ask me before moving more than 500 USDC.')
  const [agentSent, setAgentSent] = useState(false)

  const config = useMemo(
    () =>
      JSON.stringify(
        { mcpServers: { plainly: { url: url || '<your Plainly MCP server URL>', allowedActions: allowed } } },
        null,
        2,
      ),
    [url, allowed],
  )
  const agents = queue.filter((t) => t.plan.kind === 'agent')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(config)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  const launch = () => {
    const plan: Plan = {
      kind: 'agent',
      mode: 'approval',
      fields: [
        { key: 'name', label: 'Agent', value: name, type: 'text' },
        { key: 'actions', label: 'Allowed actions', value: allowed.join(', ') || 'none', type: 'text' },
        { key: 'instructions', label: 'Instructions', value: instructions, type: 'text' },
      ],
    }
    enqueue('agents', plan)
    setAgentSent(true)
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto grid max-w-[960px] gap-8 px-4 py-8 md:px-6">
        <header>
          <h1 className="text-display-xs font-semibold text-ink md:text-display-sm">Plainly MCP</h1>
          <p className="mt-1 text-md text-muted">Let your own AI agent prepare Plainly actions. Every transaction still needs your signature.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="grid content-start gap-4 rounded-2xl bg-white p-5 ring-1 ring-line">
            <p className="text-md font-semibold text-ink">1. Allowed actions</p>
            <ul className="grid gap-2">
              {ACTIONS.map((a) => {
                const on = allowed.includes(a.id)
                return (
                  <li key={a.id} className="flex items-center justify-between gap-3 rounded-xl bg-mist px-3 py-2.5">
                    <span>
                      <span className="block text-sm font-semibold text-ink">{a.label}</span>
                      <span className="block text-xs text-muted">{a.group}</span>
                    </span>
                    <Toggle on={on} label={a.label} onChange={() => setAllowed((v) => (on ? v.filter((x) => x !== a.id) : [...v, a.id]))} />
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="grid content-start gap-4 rounded-2xl bg-white p-5 ring-1 ring-line">
            <p className="text-md font-semibold text-ink">2. Connect your client</p>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-muted">Server URL from your Plainly account</span>
              <input value={url} onChange={(e) => setUrl(e.target.value.trim())} placeholder="https://…" spellCheck={false} className="h-10 rounded-xl border border-line px-3 font-mono text-xs text-ink focus:border-brand-300 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
            </label>
            <div className="overflow-hidden rounded-2xl bg-brand-900">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
                <span className="font-mono text-xs text-brand-200">mcp config</span>
                <button type="button" onClick={copy} className="rounded-md px-2 py-1 text-xs font-semibold text-brand-200 ring-1 ring-white/15 hover:bg-white/10">
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-5 text-white">
                <code>{config}</code>
              </pre>
            </div>
            <p className="text-xs text-muted">
              Keep the URL private. <Link to="/docs/mcp" className="font-semibold text-brand-700 hover:underline">Setup guide</Link>
            </p>
          </section>
        </div>

        <section id="agents" className="grid gap-4 rounded-2xl bg-white p-5 ring-1 ring-line md:p-6">
          <div>
            <p className="text-md font-semibold text-ink">Launch an agent</p>
            <p className="text-sm text-muted">Give it a job in plain words. It uses the actions allowed above.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-[240px_1fr]">
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-muted">Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className="h-10 rounded-xl border border-line px-3 text-sm text-ink focus:border-brand-300 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-muted">Instructions</span>
              <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3} className="rounded-xl border border-line px-3 py-2 text-sm text-ink focus:border-brand-300 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
            </label>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted">{agents.length ? `${agents.length} agent request${agents.length > 1 ? 's' : ''} in Sign Transactions` : 'You approve the agent with a wallet signature.'}</p>
            <button type="button" disabled={!name.trim() || !instructions.trim() || allowed.length === 0} onClick={launch} className="h-10 rounded-full bg-brand-800 px-5 text-sm font-semibold text-white hover:bg-brand-700 disabled:bg-brand-800/40">
              Launch agent
            </button>
          </div>
          {agentSent && (
            <p className="rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-800" role="status">
              Added to Sign Transactions. Approve it there to launch the agent.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
