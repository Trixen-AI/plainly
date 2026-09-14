import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * After navigation: scroll to the #hash target (its scroll-margin keeps it below the sticky nav), or to the top
 * for a new page. Runs after paint with instant scrolling, because a smooth scroll started while the new route is
 * still laying out gets cancelled. Retries until the target exists and has settled in place.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    let frame = 0
    let tries = 0

    if (!hash) {
      frame = requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }))
      return () => cancelAnimationFrame(frame)
    }

    const id = decodeURIComponent(hash.slice(1))
    const settle = () => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ block: 'start', behavior: 'instant' })
        const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
        if (Math.abs(el.getBoundingClientRect().top - margin) < 2) return
      }
      if (tries++ < 30) frame = requestAnimationFrame(settle)
    }
    frame = requestAnimationFrame(settle)
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}
