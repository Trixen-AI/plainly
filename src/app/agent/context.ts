import { createContext, useContext } from 'react'
import type { Store } from '@/app/agent/store'

export const StoreContext = createContext<Store | null>(null)

export function useAgentStore() {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useAgentStore must be used inside AgentStoreProvider')
  return store
}
