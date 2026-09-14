import { useState } from 'react'
import { field, planIsComplete, planTitle, transferError, type Plan, type PlanField } from '@/app/agent/engine'
import { cn } from '@/lib/utils'

const inputBase =
  'h-10 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink placeholder:text-muted focus:border-brand-300 focus:ring-2 focus:ring-brand-100 focus:outline-none'

function FieldInput({ f, onChange, disabled }: { f: PlanField; onChange: (value: string) => void; disabled: boolean }) {
  if (f.options) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {f.options.map((o) => (
          <button
            key={o}
            type="button"
            disabled={disabled}
            onClick={() => onChange(o)}
            className={cn(
              'h-8 rounded-full px-3 text-xs font-semibold ring-1 transition',
              f.value === o ? 'bg-brand-800 text-white ring-brand-800' : 'bg-white text-ink-soft ring-line hover:ring-brand-300',
              disabled && 'opacity-60',
            )}
          >
            {o}
          </button>
        ))}
      </div>
    )
  }
  const numeric = f.type === 'amount' || f.type === 'price' || f.type === 'percent' || f.type === 'days'
  return (
    <div className="relative">
      <input
        value={f.value}
        disabled={disabled}
        onChange={(e) => onChange(numeric ? e.target.value.replace(/[^\d.]/g, '') : e.target.value)}
        inputMode={numeric ? 'decimal' : undefined}
        placeholder={f.type === 'address' ? '0x…' : f.type === 'text' ? 'Type here' : '0'}
        spellCheck={false}
        className={cn(inputBase, f.suffix && 'pr-16', f.type === 'address' && 'font-mono text-xs')}
      />
      {f.suffix && <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-semibold text-muted">{f.suffix}</span>}
    </div>
  )
}

export function PlanCard({ plan: initial, onSubmit, submitted }: { plan: Plan; onSubmit: (plan: Plan) => void; submitted: boolean }) {
  const [plan, setPlan] = useState(initial)
  const update = (key: string, value: string) => setPlan((p) => ({ ...p, fields: p.fields.map((x) => (x.key === key ? { ...x, value } : x)) }))
  const error = transferError(plan)
  const ready = planIsComplete(plan) && !error

  return (
    <div className="mt-3 overflow-hidden rounded-2xl bg-white ring-1 ring-line">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-mist px-4 py-3">
        <p className="min-w-0 truncate text-sm font-semibold text-ink">{planTitle(plan)}</p>
        <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold', plan.mode === 'transfer' ? 'bg-lime text-brand-900' : 'bg-brand-100 text-brand-800')}>
          {plan.mode === 'transfer' ? 'Onchain transfer' : 'Wallet approval'}
        </span>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2">
        {plan.fields.map((f) => (
          <label key={f.key} className={cn('grid gap-1.5', (f.options || f.type === 'address' || f.type === 'text') && 'sm:col-span-2')}>
            <span className="text-xs font-semibold text-muted">{f.label}</span>
            <FieldInput f={f} onChange={(v) => update(f.key, v)} disabled={submitted} />
          </label>
        ))}
      </div>
      {plan.risk && <p className="mx-4 mb-3 rounded-xl bg-cream px-3 py-2 text-xs leading-5 text-[#7a4f00]">{plan.risk}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
        <p className="text-xs text-muted">
          {error ?? (plan.mode === 'transfer' ? `Sends ${field(plan, 'amount') || '0'} ETH on Robinhood Chain.` : 'You approve this action with a signature. No funds move when you sign.')}
        </p>
        <button
          type="button"
          disabled={!ready || submitted}
          onClick={() => onSubmit(plan)}
          className="h-9 rounded-full bg-brand-800 px-4 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-800/40"
        >
          {submitted ? 'Added to Transactions' : 'Review & sign'}
        </button>
      </div>
    </div>
  )
}
