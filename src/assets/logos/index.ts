// Official third-party logos, downloaded from each brand's own kit or site and used unmodified
// (SVGO only: metadata removed, decimals rounded, ids prefixed). Dark-background variants.
// Listed only because TalkenFi routes to these protocols, plus the X social link.
import jupiter from './jupiter.svg?raw'
import raydium from './raydium.svg?raw'
import orca from './orca.svg?raw'
import meteora from './meteora.svg?raw'
import kamino from './kamino.svg?raw'
import drift from './drift.svg?raw'
import jito from './jito.svg?raw'
import x from './x.svg?raw'

export type BrandLogo = { name: string; svg: string; source: string; markOnly?: boolean; onLight?: boolean }

export const OFFICIAL_LOGOS: Record<string, BrandLogo> = {
  "Jupiter": { name: "Jupiter", svg: jupiter, source: "https://github.com/jup-ag/docs/blob/main/static/files/brand-kit/jupiter-brand-kit.zip (JupiterLogo/logowithtext-dark.svg, linked from developers.jup.ag/docs/resources/brand-kit)" },
  "Raydium": { name: "Raydium", svg: raydium, source: "https://github.com/raydium-io/media-assets/blob/HEAD/logo-text.svg (official Raydium media assets)" },
  "Orca": { name: "Orca", svg: orca, source: "https://www.orca.so/ (header logo, inline SVG on the official site; no dark-background variant is published)", onLight: true },
  "Meteora": { name: "Meteora", svg: meteora, source: "https://github.com/MeteoraAg/brand-kit/blob/main/meteora-v2/full-logo/full-logo-on-dark.svg (linked from docs.meteora.ag brand kit)" },
  "Kamino": { name: "Kamino", svg: kamino, source: "https://kamino.com/assets/logo.1790351940.svg (header logo on the official site)" },
  "Drift": { name: "Drift", svg: drift, source: "https://cdn.prod.website-files.com/6310e7dee49f0866da8eed4c/69b12f86f598d941e5937599_D-logo.svg (drift.trade navbar mark; the full wordmark is only published as a raster image)", markOnly: true },
  "Jito": { name: "Jito", svg: jito, source: "https://www.jito.network/jito-white.svg (official site)" },
  "X": { name: "X", svg: x, source: "https://about.x.com/content/dam/about-twitter/x/brand-toolkit/x-logo.zip (about.x.com brand toolkit)" },
}
