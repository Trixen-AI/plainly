import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { planReply, titleFrom, type AgentReply } from '@/app/agent/engine'
import { useAgentStore } from '@/app/agent/context'
import type { Message } from '@/app/agent/store'
import { PlanCard } from '@/app/components/PlanCard'
import { BalanceCard } from '@/app/components/wallet'
import { useWallet } from '@/app/wallet/hooks'
import { chainName } from '@/app/wallet/config'
import { LogoMark } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'

const STARTERS = [
  { title: 'Check my wallet', prompt: 'What’s in my wallet?' },
  { title: 'Send ETH', prompt: 'Send 0.001 ETH to 0x' },
  { title: 'Swap tokens', prompt: 'Swap 100 USDC for ETH' },
  { title: 'Earn on stablecoins', prompt: 'Where can my USDC earn the most?' },
  { title: 'Borrow against ETH', prompt: 'Borrow $500 against my ETH collateral' },
  { title: 'Pre-qualify for a loan', prompt: 'Am I pre-qualified for an auto loan?' },
]

function ReplyCards({ reply, chatId, messageId }: { reply: AgentReply; chatId: string; messageId: string }) {
  const { queue, enqueue } = useAgentStore()
  const submitted = queue.some((t) => t.messageId === messageId)
  return (
    <>
      {reply.steps && (
        <ol className="mt-3 grid gap-1.5">
          {reply.steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2 text-sm text-ink-soft">
              <span className={cn('grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-bold', i === reply.steps!.length - 1 ? 'bg-lime text-brand-900' : 'bg-brand-100 text-brand-800')}>
                {i === reply.steps!.length - 1 ? '✓' : i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
      )}
      {reply.plan && <PlanCard plan={reply.plan} submitted={submitted} onSubmit={(plan) => enqueue(chatId, plan, messageId)} />}
      {reply.card === 'balance' && <BalanceCard />}
      {reply.card === 'score' && (
        <Link to="/app/score" className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-mist p-4 ring-1 ring-line hover:ring-brand-300">
          <span>
            <span className="block text-sm font-semibold text-ink">Open My Score</span>
            <span className="block text-xs text-muted">Pick a loan type and send a pre-qualification request.</span>
          </span>
          <span aria-hidden className="text-brand-700">→</span>
        </Link>
      )}
      {reply.card === 'mcp' && (
        <Link to="/app/mcp" className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-mist p-4 ring-1 ring-line hover:ring-brand-300">
          <span>
            <span className="block text-sm font-semibold text-ink">Add Plainly MCP</span>
            <span className="block text-xs text-muted">Choose allowed actions and copy your config.</span>
          </span>
          <span aria-hidden className="text-brand-700">→</span>
        </Link>
      )}
    </>
  )
}

function Bubble({ m, chatId, onSuggest }: { m: Message; chatId: string; onSuggest: (p: string) => void }) {
  if (m.role === 'user') {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-md bg-brand-800 px-4 py-3 text-sm leading-6 whitespace-pre-wrap text-white">{m.text}</p>
      </div>
    )
  }
  return (
    <div className="flex gap-3">
      <LogoMark className="mt-0.5 size-8" />
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-6 text-ink">{m.text}</p>
        {m.reply && <ReplyCards reply={m.reply} chatId={chatId} messageId={m.id} />}
        {m.reply?.suggestions && (
          <div className="mt-3 flex flex-wrap gap-2">
            {m.reply.suggestions.map((s) => (
              <button key={s} type="button" onClick={() => onSuggest(s)} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-800 ring-1 ring-brand-200 hover:bg-brand-50">
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function AgentChat() {
  const { chatId } = useParams()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const { chats, createChat, addMessage } = useAgentStore()
  const { isConnected, address, chainId } = useWallet()
  const chat = chats.find((c) => c.id === chatId)
  const [draft, setDraft] = useState(() => params.get('q') ?? '')
  const [thinking, setThinking] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // A prompt handed over by a link (/app?q=…) becomes the draft once, then leaves the URL.
  const incoming = params.get('q')
  const [lastIncoming, setLastIncoming] = useState(incoming)
  if (incoming !== lastIncoming) {
    setLastIncoming(incoming)
    if (incoming) setDraft(incoming)
  }
  useEffect(() => {
    if (!incoming) return
    setParams({}, { replace: true })
    inputRef.current?.focus({ preventScroll: true })
  }, [incoming, setParams])

  // Scroll only the message list; scrollIntoView would also shift the fixed app layout.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [chat?.messages.length, thinking])

  // Unknown chat id (deleted or from another browser): start fresh.
  useEffect(() => {
    if (chatId && !chat) navigate('/app', { replace: true })
  }, [chatId, chat, navigate])

  const send = (text: string) => {
    const value = text.trim()
    if (!value || thinking) return
    let id = chat?.id
    if (!id) {
      id = createChat(titleFrom(value))
      navigate(`/app/chat/${id}`, { replace: !chatId })
    }
    addMessage(id, { role: 'user', text: value })
    setDraft('')
    setThinking(true)
    const target = id
    window.setTimeout(() => {
      const reply = planReply(value, { connected: isConnected, address, chainName: chainId ? chainName(chainId) : undefined })
      addMessage(target, { role: 'agent', text: reply.text, reply })
      setThinking(false)
    }, 550)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    send(draft)
  }
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(draft)
    }
  }
  const suggest = (p: string) => {
    if (/0x$/.test(p) || /to 0x$/i.test(p)) {
      setDraft(p)
      inputRef.current?.focus({ preventScroll: true })
    } else send(p)
  }

  const empty = !chat || chat.messages.length === 0

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[760px] px-4 py-8 md:px-6">
          {empty ? (
            <div className="pt-6 md:pt-16">
              <LogoMark className="size-12" />
              <h1 className="mt-6 text-display-sm font-semibold tracking-[-0.02em] text-ink md:text-display-md">What do you want to do?</h1>
              <p className="mt-2 text-md text-muted">Describe it in a sentence. You review and sign everything before it happens.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {STARTERS.map((s) => (
                  <button key={s.title} type="button" onClick={() => suggest(s.prompt)} className="group rounded-2xl bg-white p-4 text-left ring-1 ring-line transition hover:bg-brand-50 hover:ring-brand-200">
                    <span className="block text-sm font-semibold text-ink">{s.title}</span>
                    <span className="mt-1 block text-sm text-muted group-hover:text-ink-soft">{s.prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {chat.messages.map((m) => (
                <Bubble key={m.id} m={m} chatId={chat.id} onSuggest={suggest} />
              ))}
              {thinking && (
                <div className="flex items-center gap-3" aria-live="polite">
                  <LogoMark className="size-8" />
                  <span className="flex gap-1" aria-label="Plainly is thinking">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="size-2 animate-bounce rounded-full bg-brand-300" style={{ animationDelay: `${i * 120}ms` }} />
                    ))}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <form onSubmit={onSubmit} className="border-t border-line bg-white/90 px-4 py-3 backdrop-blur md:px-6">
        <div className="mx-auto flex max-w-[760px] items-end gap-2 rounded-2xl bg-white p-2 ring-1 ring-line focus-within:ring-2 focus-within:ring-brand-300">
          <label htmlFor="agent-input" className="sr-only">
            Message Plainly
          </label>
          <textarea
            id="agent-input"
            ref={inputRef}
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask Plainly to swap, send, borrow, earn…"
            className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-ink placeholder:text-muted focus:outline-none [field-sizing:content]"
          />
          <button type="submit" disabled={!draft.trim() || thinking} aria-label="Send" className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-800 text-white transition hover:bg-brand-700 disabled:bg-brand-800/30">
            <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
              <path d="M10 16V4m0 0-5 5m5-5 5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-[760px] text-center text-[11px] text-muted">Plainly never moves funds without your signature.</p>
      </form>
    </div>
  )
}
