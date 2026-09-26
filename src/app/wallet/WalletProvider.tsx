import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// AppKit (Solana adapter) needs no React provider; React Query caches balances and transaction status.
const queryClient = new QueryClient()

export function WalletProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
