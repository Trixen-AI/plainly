// Official third-party logos, downloaded from each brand's own kit or site, used unmodified (SVGO: metadata removed,
// decimals rounded, ids prefixed). Protocols Plainly routes to, plus the X social link.
import aave from './aave.svg?raw'
import morpho from './morpho.svg?raw'
import uniswap from './uniswap.svg?raw'
import pendle from './pendle.svg?raw'
import silo from './silo.svg?raw'
import aerodrome from './aerodrome.svg?raw'
import pancakeswap from './pancakeswap.svg?raw'
import x from './x.svg?raw'
import polymarket from './polymarket.svg?raw'

export type BrandLogo = { name: string; svg: string; source: string }

export const OFFICIAL_LOGOS: Record<string, BrandLogo> = {
  "Aave": { name: "Aave", svg: aave, source: "https://github.com/aave-dao/aave-brand-kit/blob/main/Logo/Logo-purple.svg" },
  "Morpho": { name: "Morpho", svg: morpho, source: "https://cdn.morpho.org/assets/brand-kit/morpho-logo.zip (brand.morpho.org)" },
  "Uniswap": { name: "Uniswap", svg: uniswap, source: "https://github.com/Uniswap/brand-assets/blob/main/Uniswap%20Brand%20Assets/Uniswap_horizontallogo_pink.svg" },
  "Pendle": { name: "Pendle", svg: pendle, source: "https://www.pendle.finance/images/logos/blue-light-with-name.svg (pendle.finance/brand-guide, light-background variant)" },
  "Silo": { name: "Silo", svg: silo, source: "https://cdn.prod.website-files.com/69970a1347a13933038cd519/69974b4bfb687fc0a16cef20_silo_logo_black.svg (silo.finance header logo)" },
  "Aerodrome": { name: "Aerodrome", svg: aerodrome, source: "https://aerodrome.finance/svg/AERO/wordmark.svg (aerodrome.finance header logo)" },
  "PancakeSwap": { name: "PancakeSwap", svg: pancakeswap, source: "PancakeSwap Logos.zip from https://docs.pancakeswap.finance/welcome-to-pancakeswap/about-us/brand" },
  "X": { name: "X", svg: x, source: "https://about.x.com/content/dam/about-twitter/x/brand-toolkit/x-logo.zip (about.x.com brand toolkit)" },
  "Polymarket": { name: "Polymarket", svg: polymarket, source: "https://polymarket-upload.s3.us-east-2.amazonaws.com/polymarket-logos.zip (polymarket.com/brand, monochrome preferred)" },
}
