import { OFFICIAL_LOGOS } from '@/assets/logos'
import { BrandLogo } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'

/**
 * Official protocol logo. When a brand only publishes its mark as SVG (not the full wordmark), the mark is shown
 * unmodified with the brand name as text beside it. A logo published only for light backgrounds sits on a light
 * plate instead of being recoloured.
 */
export function ProtocolLogo({ name, className, textClassName }: { name: string; className?: string; textClassName?: string }) {
  const logo = OFFICIAL_LOGOS[name]
  if (!logo) return <span className={cn('font-semibold text-ink', textClassName)}>{name}</span>
  if (logo.onLight)
    return (
      <span className="inline-flex shrink-0 items-center rounded-lg bg-[#fffefc] px-2.5 py-1">
        <BrandLogo svg={logo.svg} name={name} className={className} />
      </span>
    )
  if (!logo.markOnly) return <BrandLogo svg={logo.svg} name={name} className={className} />
  return (
    <span role="img" aria-label={name} className="inline-flex shrink-0 items-center gap-2">
      <BrandLogo svg={logo.svg} name={name} className={className} />
      <span aria-hidden className={cn('font-semibold tracking-tight text-ink', textClassName)}>
        {name}
      </span>
    </span>
  )
}
