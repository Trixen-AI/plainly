import { useSeo } from '@/lib/seo'
import { Button, Container } from '@/components/ui/primitives'

export function NotFound() {
  useSeo({ title: 'Page not found', description: 'This page does not exist on Plainly.', path: window.location.pathname, noindex: true })

  return (
    <main className="bg-white">
      <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-24 text-center">
        <p className="text-sm font-semibold tracking-widest text-brand-700 uppercase">404</p>
        <h1 className="text-display-md font-semibold text-ink md:text-display-lg">We couldn’t find that page</h1>
        <p className="max-w-[480px] text-md text-muted">The link may be old or mistyped. Try the home page or the docs.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button href="/">Back home</Button>
          <Button href="/docs" variant="ghost">
            Read the docs
          </Button>
        </div>
      </Container>
    </main>
  )
}
