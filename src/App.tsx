import { lazy, Suspense } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router'
import { Navbar } from '@/components/sections/Header'
import { Footer } from '@/components/sections/Lower'
import { ScrollManager } from '@/components/ScrollManager'
import { DocsLayout, DocPageView } from '@/pages/Docs'
import { Home } from '@/pages/Home'
import { NotFound } from '@/pages/NotFound'
import { loadApp } from '@/lib/loadApp'

// The dashboard pulls in the wallet SDKs, so it is split out and only loaded on /app.
const AppRoot = lazy(loadApp)

function AppLoading() {
  return (
    <div className="grid h-dvh place-items-center bg-white" role="status" aria-live="polite">
      <div className="flex items-center gap-3 text-sm font-semibold text-muted">
        <span className="size-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700" aria-hidden />
        Loading Plainly
      </div>
    </div>
  )
}

function SiteLayout() {
  return (
    <>
      <ScrollManager />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route
        path="app/*"
        element={
          <Suspense fallback={<AppLoading />}>
            <AppRoot />
          </Suspense>
        }
      />
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="docs" element={<DocsLayout />}>
          <Route index element={<Navigate to="/docs/introduction" replace />} />
          <Route path=":slug" element={<DocPageView />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
