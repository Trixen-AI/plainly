import { Route, Routes } from 'react-router'
import '@/app/wallet/config'
import { AgentStoreProvider } from '@/app/agent/store'
import { AppShell } from '@/app/AppShell'
import { AgentChat } from '@/app/pages/AgentChat'
import { Mcp } from '@/app/pages/Mcp'
import { Portfolio } from '@/app/pages/Portfolio'
import { Score } from '@/app/pages/Score'
import { WalletProvider } from '@/app/wallet/WalletProvider'
import { NotFound } from '@/pages/NotFound'
import { useSeo } from '@/lib/seo'

/** The whole dashboard (wallet SDKs included) lives in this lazily loaded chunk. */
export default function AppRoot() {
  // The dashboard is personal (wallet, chats), so it stays out of search results.
  useSeo({ title: 'Plainly App', description: 'Chat with the Plainly agent, sign transactions and manage your portfolio on Robinhood Chain.', path: '/app', noindex: true })

  return (
    <WalletProvider>
      <AgentStoreProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<AgentChat />} />
            <Route path="chat/:chatId" element={<AgentChat />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="score" element={<Score />} />
            <Route path="mcp" element={<Mcp />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AgentStoreProvider>
    </WalletProvider>
  )
}
