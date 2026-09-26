import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { AgentReply, Plan } from '@/app/agent/engine'
import { StoreContext } from '@/app/agent/context'

export type Message = { id: string; role: 'user' | 'agent'; text: string; reply?: AgentReply; at: number }
export type Chat = { id: string; title: string; createdAt: number; messages: Message[] }
export type TxStatus = 'pending' | 'signing' | 'submitted' | 'confirmed' | 'approved' | 'failed' | 'rejected'
export type PendingTx = {
  id: string
  chatId: string
  /** Chat message that produced it, so the chat card can show it was added. */
  messageId?: string
  plan: Plan
  status: TxStatus
  /** Transaction hash for transfers, signature for approvals. */
  hash?: string
  signature?: string
  /** Solana network (cluster) id the action was signed on. */
  networkId?: string
  error?: string
  at: number
}

type State = { chats: Chat[]; queue: PendingTx[] }

type Action =
  | { type: 'createChat'; chat: Chat }
  | { type: 'addMessage'; chatId: string; message: Message }
  | { type: 'deleteChat'; chatId: string }
  | { type: 'enqueue'; tx: PendingTx }
  | { type: 'updateTx'; id: string; patch: Partial<PendingTx> }
  | { type: 'removeTx'; id: string }

const KEY = 'talkenfi.app.v1'
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`)

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { chats: [], queue: [] }
    const parsed = JSON.parse(raw) as State
    // A signature in flight cannot survive a reload; show it as pending again.
    return { chats: parsed.chats ?? [], queue: (parsed.queue ?? []).map((t) => (t.status === 'signing' ? { ...t, status: 'pending' } : t)) }
  } catch {
    return { chats: [], queue: [] }
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'createChat':
      return { ...state, chats: [action.chat, ...state.chats] }
    case 'addMessage':
      return { ...state, chats: state.chats.map((c) => (c.id === action.chatId ? { ...c, messages: [...c.messages, action.message] } : c)) }
    case 'deleteChat':
      return { chats: state.chats.filter((c) => c.id !== action.chatId), queue: state.queue.filter((t) => t.chatId !== action.chatId) }
    case 'enqueue':
      return { ...state, queue: [action.tx, ...state.queue] }
    case 'updateTx':
      return { ...state, queue: state.queue.map((t) => (t.id === action.id ? { ...t, ...action.patch } : t)) }
    case 'removeTx':
      return { ...state, queue: state.queue.filter((t) => t.id !== action.id) }
  }
}

export type Store = State & {
  createChat: (title: string) => string
  addMessage: (chatId: string, message: Omit<Message, 'id' | 'at'>) => void
  deleteChat: (chatId: string) => void
  enqueue: (chatId: string, plan: Plan, messageId?: string) => string
  updateTx: (id: string, patch: Partial<PendingTx>) => void
  removeTx: (id: string) => void
}

export function AgentStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      // storage full or blocked: the session still works in memory
    }
  }, [state])

  const createChat = useCallback((title: string) => {
    const id = uid()
    dispatch({ type: 'createChat', chat: { id, title, createdAt: Date.now(), messages: [] } })
    return id
  }, [])
  const addMessage = useCallback((chatId: string, message: Omit<Message, 'id' | 'at'>) => {
    dispatch({ type: 'addMessage', chatId, message: { ...message, id: uid(), at: Date.now() } })
  }, [])
  const deleteChat = useCallback((chatId: string) => dispatch({ type: 'deleteChat', chatId }), [])
  const enqueue = useCallback((chatId: string, plan: Plan, messageId?: string) => {
    const id = uid()
    dispatch({ type: 'enqueue', tx: { id, chatId, messageId, plan, status: 'pending', at: Date.now() } })
    return id
  }, [])
  const updateTx = useCallback((id: string, patch: Partial<PendingTx>) => dispatch({ type: 'updateTx', id, patch }), [])
  const removeTx = useCallback((id: string) => dispatch({ type: 'removeTx', id }), [])

  const value = useMemo(
    () => ({ ...state, createChat, addMessage, deleteChat, enqueue, updateTx, removeTx }),
    [state, createChat, addMessage, deleteChat, enqueue, updateTx, removeTx],
  )
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
