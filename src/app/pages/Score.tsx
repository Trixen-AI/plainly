import { useState } from 'react'
import { Link } from 'react-router'
import { planTitle, type Plan } from '@/app/agent/engine'
import { useAgentStore } from '@/app/agent/context'
import { useWallet } from '@/app/wallet/hooks'
import { cn } from '@/lib/utils'

const LOANS = [
  { id: 'Personal', hint: 'General expenses and one-off costs' },
  { id: 'Auto', hint: 'New, used or refinance' },
  { id: 'Business', hint: 'Working capital' },
  { id: 'Debt consolidation', hint: 'One payment, one rate' },
  { id: 'Student refi', hint: 'Refinance student loans' },
  { id: 'HELOC', hint: 'Tap your home equity' },
  { id: 'Mortgage', hint: 'Buy a home' },
]
const INCOME = ['Under $50k', '$50k to $100k', '$100k to $200k', 'Over $200k']
const EMPLOYMENT = ['Employed', 'Self-employed', 'Business owner', 'Other']
const TERMS = ['12 months', '24 months', '36 months', '60 months']

function Chips({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={cn('h-9 rounded-full px-4 text-sm font-semibold ring-1 transition', value === o ? 'bg-brand-800 text-on-accent ring-brand-800' : 'bg-surface text-ink-soft ring-line hover:ring-brand-300')}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

export function Score() {
  const { isConnected } = useWallet()
  const { queue, enqueue } = useAgentStore()
  const [loan, setLoan] = useState('Auto')
  const [amount, setAmount] = useState('15000')
  const [term, setTerm] = useState('36 months')
  const [income, setIncome] = useState('$50k to $100k')
  const [employment, setEmployment] = useState('Employed')
  const [consent, setConsent] = useState(false)
  const [sentId, setSentId] = useState<string | null>(null)

  const requests = queue.filter((t) => t.plan.kind === 'prequal')
  const ready = Number(amount) > 0 && consent

  const submit = () => {
    const plan: Plan = {
      kind: 'prequal',
      mode: 'approval',
      fields: [
        { key: 'loan', label: 'Loan type', value: loan, type: 'select' },
        { key: 'amount', label: 'Amount', value: amount, type: 'amount', suffix: 'USD' },
        { key: 'term', label: 'Term', value: term, type: 'select' },
        { key: 'income', label: 'Yearly income', value: income, type: 'select' },
        { key: 'employment', label: 'Employment', value: employment, type: 'select' },
      ],
    }
    setSentId(enqueue('score', plan))
    setConsent(false)
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto grid max-w-[960px] gap-8 px-4 py-8 md:px-6 lg:grid-cols-[1fr_300px]">
        <div className="grid gap-6">
          <header>
            <h1 className="text-display-xs font-semibold text-ink md:text-display-sm">My Score</h1>
            <p className="mt-1 text-md text-muted">Check no-collateral loan options. Estimates are not an offer of credit.</p>
          </header>

          <section className="grid gap-5 rounded-2xl bg-surface p-5 ring-1 ring-line md:p-6">
            <div>
              <p className="mb-3 text-sm font-semibold text-ink">1. What is it for?</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {LOANS.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLoan(l.id)}
                    className={cn('rounded-xl p-3 text-left ring-1 transition', loan === l.id ? 'bg-brand-50 ring-2 ring-brand-500' : 'bg-surface ring-line hover:ring-brand-300')}
                  >
                    <span className="block text-sm font-semibold text-ink">{l.id}</span>
                    <span className="block text-xs text-muted">{l.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-sm font-semibold text-ink">2. How much?</span>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted">$</span>
                  <input
                    value={amount}
                    inputMode="decimal"
                    onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
                    className="h-10 w-full rounded-xl border border-line bg-surface pr-3 pl-7 text-sm text-ink focus:border-brand-300 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                  />
                </div>
              </label>
              <div className="grid gap-1.5">
                <span className="text-sm font-semibold text-ink">Term</span>
                <Chips value={term} options={TERMS} onChange={setTerm} />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <span className="text-sm font-semibold text-ink">3. Yearly income</span>
                <Chips value={income} options={INCOME} onChange={setIncome} />
              </div>
              <div className="grid gap-1.5">
                <span className="text-sm font-semibold text-ink">Employment</span>
                <Chips value={employment} options={EMPLOYMENT} onChange={setEmployment} />
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-xl bg-mist p-3">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 size-4 accent-[#9945ff]" />
              <span className="text-sm leading-6 text-ink-soft">
                I agree to share these details for a pre-qualification check. It shows estimated options and is not an offer of credit or a guarantee of approval.
              </span>
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted">{isConnected ? 'You sign the request in your wallet. No funds move.' : 'Connect your wallet to sign the request.'}</p>
              <button type="button" disabled={!ready} onClick={submit} className="h-10 rounded-full bg-brand-800 px-5 text-sm font-semibold text-on-accent hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-800/40">
                Send for signature
              </button>
            </div>
            {sentId && (
              <p className="rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-800" role="status">
                Added to Sign Transactions. Approve it there to send the request.
              </p>
            )}
          </section>
        </div>

        <aside className="grid content-start gap-4">
          <div className="rounded-2xl bg-surface p-5 ring-1 ring-line">
            <p className="text-sm font-semibold text-ink">Your requests</p>
            {requests.length === 0 ? (
              <p className="mt-2 text-sm text-muted">No requests yet.</p>
            ) : (
              <ul className="mt-3 grid gap-2">
                {requests.map((r) => (
                  <li key={r.id} className="rounded-xl bg-mist px-3 py-2">
                    <p className="text-sm font-semibold text-ink">{planTitle(r.plan)}</p>
                    <p className="text-xs text-muted">{r.status === 'approved' ? 'Signed and sent' : r.status === 'rejected' ? 'Rejected' : 'Waiting for your signature'}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-2xl bg-mist p-5 ring-1 ring-line">
            <p className="text-sm font-semibold text-ink">What helps your score</p>
            <ul className="mt-2 grid gap-1.5 text-sm text-ink-soft">
              <li>Connecting more accounts</li>
              <li>Repaying loans on time</li>
              <li>Keeping loan health high</li>
            </ul>
            <Link to="/docs/talkenfi-score" className="mt-3 inline-block text-sm font-semibold text-brand-700 hover:underline">
              How it works
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
