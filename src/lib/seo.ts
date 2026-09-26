import { useEffect } from 'react'
import { SITE_NAME, SITE_URL } from '@/data/content'

type Seo = {
  title: string
  description: string
  /** Path on talkenhub.xyz, e.g. "/docs/trading". */
  path: string
  /** Keep a page out of search results (404, app screens). */
  noindex?: boolean
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

function setAlternates(href: string) {
  document.head.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]').forEach((el) => {
    el.href = href
  })
}

/** Keeps title, description, canonical and social tags in sync with the current SPA route. */
export function useSeo({ title, description, path, noindex = false }: Seo) {
  useEffect(() => {
    const url = `${SITE_URL}${path === '/' ? '/' : path}`
    const fullTitle = title === SITE_NAME ? title : title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
    document.title = fullTitle
    setMeta('name', 'description', description)
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description)
    setCanonical(url)
    setAlternates(url)
  }, [title, description, path, noindex])
}
