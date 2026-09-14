import type { ComponentProps, ReactNode } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import type { RichText } from '@/data/content'
import { WORDMARK } from '@/components/brand/outlines'
import { loadApp } from '@/lib/loadApp'
import { cn, EASE } from '@/lib/utils'

export function Container({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('mx-auto w-full max-w-(--max-width-container) px-4 md:px-0', className)} {...props} />
}

/** Internal paths ("/docs", "/#rates") go through React Router; everything else is a normal anchor. */
export function SmartLink({ href, className, children, onClick, ...rest }: Omit<ComponentProps<'a'>, 'href'> & { href: string }) {
  if (href.startsWith('/')) {
    // Warm the dashboard chunk before the click lands.
    const preload = href.startsWith('/app') ? () => void loadApp() : undefined
    return (
      <Link to={href} className={className} onClick={onClick} onMouseEnter={preload} onFocus={preload} {...rest}>
        {children}
      </Link>
    )
  }
  const external = /^https?:\/\//.test(href)
  return (
    <a href={href} className={className} onClick={onClick} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} {...rest}>
      {children}
    </a>
  )
}

export function Rich({ value }: { value: RichText }) {
  return (
    <>
      {value.map((part, i) => {
        if (typeof part === 'string') return <span key={i}>{part}</span>
        if ('b' in part)
          return (
            <strong key={i} className="font-semibold">
              {part.b}
            </strong>
          )
        if ('i' in part)
          return (
            <em key={i} className="font-medium text-brand-700 not-italic">
              {part.i}
            </em>
          )
        if ('code' in part)
          return (
            <code key={i} className="rounded-md bg-brand-50 px-1.5 py-0.5 font-mono text-[0.875em] text-brand-800 ring-1 ring-brand-100">
              {part.code}
            </code>
          )
        return (
          <SmartLink
            key={i}
            href={part.link.to}
            className="font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:text-brand-600 hover:decoration-brand-600"
          >
            {part.link.label}
          </SmartLink>
        )
      })}
    </>
  )
}

type Icon = 'arrow' | 'external' | 'chevron'

export function ArrowIcon({ kind = 'arrow', className }: { kind?: Icon; className?: string }) {
  if (kind === 'external')
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden className={cn('size-5', className)}>
        <path d="M6 14 14 6M7.5 6H14v6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  if (kind === 'chevron')
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden className={cn('size-5', className)}>
        <path d="m8 5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={cn('size-5', className)}>
      <path d="M3.5 10h13m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Button({
  children,
  icon = 'arrow',
  href = '#',
  variant = 'solid',
  className,
}: {
  children: ReactNode
  icon?: Icon | null
  href?: string
  variant?: 'solid' | 'ghost'
  className?: string
}) {
  return (
    <SmartLink
      href={href}
      className={cn(
        'group relative inline-flex h-12 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full px-5 text-md font-semibold whitespace-nowrap transition duration-200 focus-visible:ring-4 focus-visible:ring-brand-300 focus-visible:outline-none',
        variant === 'solid'
          ? 'btn-sheen bg-brand-800 text-white shadow-skeumorphic hover:bg-brand-700'
          : 'bg-white/70 text-brand-900 ring-1 ring-brand-900/15 hover:bg-white',
        className,
      )}
    >
      <span>{children}</span>
      {icon && <ArrowIcon kind={icon} className="transition-transform duration-200 group-hover:translate-x-0.5" />}
    </SmartLink>
  )
}

export function TextLink({ children, href = '#', className }: { children: ReactNode; href?: string; className?: string }) {
  return (
    <SmartLink
      href={href}
      className={cn(
        'group inline-flex items-center gap-2 rounded text-md font-semibold text-brand-800 hover:text-brand-600 focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:outline-none',
        className,
      )}
    >
      {children}
      <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-1" />
    </SmartLink>
  )
}

export function Highlight({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('box-decoration-clone bg-brand-100 px-1.5 py-0.5 text-brand-700', className)}>{children}</span>
  )
}

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/** The Plainly mark on its own (no wordmark), for avatars and small badges. */
export function LogoMark({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  const bg = inverted ? '#d4f36b' : '#063424'
  const fg = inverted ? '#063424' : '#d4f36b'
  return (
    <svg viewBox="0 0 32 32" role="img" aria-label="Plainly" className={cn('block size-8 shrink-0', className)}>
      <rect width="32" height="32" rx="9" fill={bg} />
      <path d="M8 11a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4h-4.5L11 25v-4.3A4 4 0 0 1 8 17v-6Z" fill={fg} />
      <path d="M12.5 14h7M16 10.5v7" stroke={bg} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** An official third-party logo SVG (from src/assets/logos), inlined unmodified and sized by `className`. */
export function BrandLogo({ svg, name, className }: { svg: string; name: string; className?: string }) {
  return (
    <span
      role="img"
      aria-label={name}
      className={cn('inline-flex shrink-0 items-center [&>svg]:block [&>svg]:h-full [&>svg]:w-auto', className)}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

const LOGO_GAP = 8
const LOGO_WIDTH = Math.ceil(32 + LOGO_GAP + WORDMARK.x2)

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  const bg = inverted ? '#d4f36b' : '#063424'
  const fg = inverted ? '#063424' : '#d4f36b'
  return (
    <svg
      viewBox={`0 0 ${LOGO_WIDTH} 32`}
      width={LOGO_WIDTH}
      height={32}
      role="img"
      aria-label="Plainly"
      className={cn('block h-8 w-auto', className)}
    >
      <rect width="32" height="32" rx="9" fill={bg} />
      <path d="M8 11a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4h-4.5L11 25v-4.3A4 4 0 0 1 8 17v-6Z" fill={fg} />
      <path d="M12.5 14h7M16 10.5v7" stroke={bg} strokeWidth="2" strokeLinecap="round" />
      <path
        transform={`translate(${32 + LOGO_GAP} ${16 - (WORDMARK.y1 + WORDMARK.y2) / 2})`}
        d={WORDMARK.d}
        fill={inverted ? '#ffffff' : '#0b1f17'}
      />
    </svg>
  )
}

export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={cn(
        'mx-auto max-w-[900px] pb-10 text-center text-display-md font-semibold text-ink md:pt-10 md:text-display-lg md:tracking-[-0.03em]',
        className,
      )}
    >
      {children}
    </h2>
  )
}
