import type { ReactNode, SVGProps } from 'react'

const S = '#084b32' // stroke
const C = '#fff8ea' // cream fill
const M = '#d9f3e2' // mint fill
const L = '#d4f36b' // lime accent

function Svg({ children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return (
    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      {children}
    </svg>
  )
}

function Bubble({ x, y, w, h, fill = C }: { x: number; y: number; w: number; h: number; fill?: string }) {
  return (
    <g>
      <path d={`M${x + 28} ${y + h - 2}l-4 18 22-18`} fill={fill} stroke={S} strokeWidth="2" />
      <rect x={x} y={y} width={w} height={h} rx="16" fill={fill} stroke={S} strokeWidth="2" />
      <path d={`M${x + 27} ${y + h}h18`} stroke={fill} strokeWidth="3" />
    </g>
  )
}

function Coin({ cx, cy, r = 26, label, fill = C }: { cx: number; cy: number; r?: number; label: string; fill?: string }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + 5} rx={r} ry={r} fill={S} opacity=".12" />
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke={S} strokeWidth="2" />
      <circle cx={cx} cy={cy} r={r - 7} stroke={S} strokeWidth="1.2" strokeDasharray="3 4" />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill={S} fontFamily="Inter Variable, Inter, sans-serif">
        {label}
      </text>
    </g>
  )
}

/* ---------- Feature row illustrations (600 x 400) ---------- */

export function TradeIllustration() {
  return (
    <Svg viewBox="0 0 600 400" className="h-full w-full">
      <path d="M-10 250 Q 150 170 300 250 T 610 250" stroke={S} strokeOpacity=".25" strokeWidth="1.5" strokeDasharray="6 8" />
      <Bubble x={170} y={70} w={260} h={70} />
      <text x={196} y={112} fontSize="18" fill={S} fontWeight="600" fontFamily="Inter Variable, Inter, sans-serif">
        swap 200 USDC for ETH
      </text>
      <rect x="414" y="96" width="2" height="22" fill={S}>
        <animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite" />
      </rect>
      <Coin cx={150} cy={265} r={48} label="USDC" />
      <Coin cx={450} cy={265} r={48} label="ETH" fill={M} />
      <path d="M212 238 C 260 200, 340 200, 388 238" stroke={S} strokeWidth="2" />
      <path d="m378 226 10 12-15 4" stroke={S} strokeWidth="2" />
      <path d="M388 294 C 340 332, 260 332, 212 294" stroke={S} strokeWidth="2" strokeDasharray="5 6" />
      <path d="m222 306-10-12 15-4" stroke={S} strokeWidth="2" />
      <g transform="translate(262 240)">
        <rect width="76" height="52" rx="12" fill={L} stroke={S} strokeWidth="2" />
        <text x="38" y="23" textAnchor="middle" fontSize="11" fill={S} fontWeight="600" fontFamily="Inter Variable, Inter, sans-serif">
          best route
        </text>
        <text x="38" y="40" textAnchor="middle" fontSize="13" fill={S} fontWeight="700" fontFamily="Inter Variable, Inter, sans-serif">
          0.3% fee
        </text>
      </g>
    </Svg>
  )
}

export function BorrowIllustration() {
  const layer = (y: number, fill: string, op = 1) => (
    <path d={`M300 ${y}l150 75-150 75-150-75z`} fill={fill} stroke={S} strokeWidth="2" opacity={op} />
  )
  return (
    <Svg viewBox="0 0 600 400" className="h-full w-full">
      {layer(170, M, 0.6)}
      {layer(155, M, 0.8)}
      {layer(140, C)}
      <path d="M150 215v14l150 75 150-75v-14" stroke={S} strokeWidth="2" />
      <g transform="translate(252 170)">
        <path d="M0 26 48 2l48 24-48 24z" fill="#fff" stroke={S} strokeWidth="2" />
        <path d="M30 26h36M48 17v18" stroke={S} strokeWidth="2" />
      </g>
      {/* collateral chips */}
      <g transform="translate(66 70)">
        <rect width="116" height="46" rx="23" fill={C} stroke={S} strokeWidth="2" />
        <path d="M18 29l10-10 8 6 12-12" stroke={S} strokeWidth="2" />
        <text x="58" y="29" fontSize="14" fontWeight="600" fill={S} fontFamily="Inter Variable, Inter, sans-serif">Stocks</text>
      </g>
      <g transform="translate(418 70)">
        <rect width="116" height="46" rx="23" fill={C} stroke={S} strokeWidth="2" />
        <circle cx="30" cy="23" r="10" stroke={S} strokeWidth="2" />
        <text x="52" y="29" fontSize="14" fontWeight="600" fill={S} fontFamily="Inter Variable, Inter, sans-serif">Tokens</text>
      </g>
      <path d="M124 118c0 40 60 60 110 70" stroke={S} strokeWidth="2" strokeDasharray="5 6" />
      <path d="M476 118c0 40-60 60-110 70" stroke={S} strokeWidth="2" strokeDasharray="5 6" />
      {/* health gauge */}
      <g transform="translate(220 318)">
        <rect width="160" height="54" rx="14" fill="#fff" stroke={S} strokeWidth="2" />
        <text x="16" y="22" fontSize="11" fill={S} fontWeight="600" fontFamily="Inter Variable, Inter, sans-serif">Loan health</text>
        <rect x="16" y="32" width="128" height="8" rx="4" fill={M} />
        <rect x="16" y="32" width="94" height="8" rx="4" fill="#16a060" />
      </g>
    </Svg>
  )
}

export function EarnIllustration() {
  const bars = [70, 110, 90, 150, 190]
  return (
    <Svg viewBox="0 0 600 400" className="h-full w-full">
      <path d="M110 330h380" stroke={S} strokeWidth="2" />
      {bars.map((h, i) => {
        const x = 140 + i * 70
        return (
          <g key={i}>
            <rect x={x} y={330 - h} width="44" height={h} rx="8" fill={i === bars.length - 1 ? L : C} stroke={S} strokeWidth="2" />
            <path d={`M${x + 10} ${330 - h + 16}h24`} stroke={S} strokeOpacity=".4" strokeWidth="2" />
          </g>
        )
      })}
      <path d="M162 250 232 212 302 232 372 172 442 128" stroke={S} strokeWidth="2.5" />
      <path d="m428 124 14 4-4 14" stroke={S} strokeWidth="2.5" />
      <g transform="translate(372 50)">
        <rect width="170" height="58" rx="14" fill="#fff" stroke={S} strokeWidth="2" />
        <text x="18" y="24" fontSize="11" fontWeight="600" fill={S} fontFamily="Inter Variable, Inter, sans-serif">Top pick for USDC</text>
        <text x="18" y="45" fontSize="18" fontWeight="700" fill={S} fontFamily="Inter Variable, Inter, sans-serif">Ranked #1</text>
        <circle cx="146" cy="36" r="10" fill={L} stroke={S} strokeWidth="2" />
      </g>
      <g transform="translate(60 70)">
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(0 ${i * 34})`}>
            <rect width="150" height="26" rx="13" fill={i === 0 ? M : C} stroke={S} strokeWidth="1.6" />
            <circle cx="14" cy="13" r="5" fill={S} opacity={1 - i * 0.3} />
            <rect x="28" y="10" width={80 - i * 16} height="6" rx="3" fill={S} opacity=".35" />
          </g>
        ))}
      </g>
    </Svg>
  )
}

export function LoansIllustration() {
  const hex = (cx: number, cy: number, fill: string) => (
    <path
      d={`M${cx} ${cy - 44}l38 22v44l-38 22-38-22v-44z`}
      fill={fill}
      stroke={S}
      strokeWidth="2"
    />
  )
  return (
    <Svg viewBox="0 0 600 400" className="h-full w-full">
      <g transform="translate(220 70)">
        <rect x="8" y="8" width="160" height="220" rx="16" fill={S} opacity=".12" />
        <rect width="160" height="220" rx="16" fill="#fff" stroke={S} strokeWidth="2" />
        <text x="18" y="34" fontSize="13" fontWeight="700" fill={S} fontFamily="Inter Variable, Inter, sans-serif">Pre-qualified</text>
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(18 ${58 + i * 38})`}>
            <circle cx="10" cy="10" r="10" fill={i < 3 ? L : M} stroke={S} strokeWidth="1.6" />
            {i < 3 && <path d="m5 10 3.5 3.5L15 7" stroke={S} strokeWidth="1.8" />}
            <rect x="30" y="4" width={86 - i * 8} height="6" rx="3" fill={S} opacity=".5" />
            <rect x="30" y="14" width="50" height="4" rx="2" fill={S} opacity=".2" />
          </g>
        ))}
      </g>
      {hex(120, 130, C)}
      <path d="M102 136v-8l18-14 18 14v18h-36zM114 146v-10h12v10" stroke={S} strokeWidth="2" />
      {hex(120, 280, C)}
      <path d="M96 286h48v-12l-8-10h-30l-10 10zM106 292a5 5 0 1 0 0 .1M134 292a5 5 0 1 0 0 .1" stroke={S} strokeWidth="2" />
      {hex(480, 130, C)}
      <path d="M460 124h40v28h-40zM472 124v-8h16v8M460 136h40" stroke={S} strokeWidth="2" />
      {hex(480, 280, M)}
      <circle cx="470" cy="278" r="9" stroke={S} strokeWidth="2" />
      <circle cx="490" cy="284" r="9" stroke={S} strokeWidth="2" fill={C} />
      <path d="M158 150c30 10 40 20 62 20M158 262c30-10 40-20 62-20M442 150c-30 10-40 20-54 20M442 262c-30-10-40-20-54-20" stroke={S} strokeWidth="1.6" strokeDasharray="4 6" />
    </Svg>
  )
}

/* ---------- Product panels ---------- */

export function AgentStackIllustration() {
  const plate = (y: number, fill: string, op = 1) => (
    <path d={`M300 ${y}l200 100-200 100-200-100z`} fill={fill} stroke={S} strokeWidth="2" opacity={op} />
  )
  return (
    <Svg viewBox="0 0 600 520" className="h-full w-full">
      <path d="M40 430 300 300l260 130-260 130z" stroke={S} strokeOpacity=".5" strokeWidth="1.5" />
      <text x="300" y="455" textAnchor="middle" fontSize="18" fontWeight="600" fill={S} fontFamily="Inter Variable, Inter, sans-serif">
        Robinhood Chain
      </text>
      {plate(250, '#b4e6c6', 0.7)}
      {plate(236, '#b4e6c6', 0.85)}
      {plate(170, M)}
      {plate(90, C)}
      <g stroke={S} strokeWidth="2">
        <path d="M246 190h108M268 176v28" opacity=".0" />
      </g>
      {/* protocol tiles on middle plate */}
      <g transform="translate(206 250)">
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${i * 64} ${i % 2 ? -8 : 0})`}>
            <path d="M24 0 48 12 24 24 0 12z" fill="#fff" stroke={S} strokeWidth="1.8" />
          </g>
        ))}
      </g>
      {/* chat on top plate */}
      <g transform="translate(236 150)">
        <rect width="128" height="52" rx="14" fill="#fff" stroke={S} strokeWidth="2" />
        <path d="M16 20h72M16 32h48" stroke={S} strokeWidth="2" />
        <circle cx="108" cy="26" r="9" fill={L} stroke={S} strokeWidth="1.8" />
      </g>
      <text x="120" y="176" fontSize="13" fontWeight="600" fill={S} fontFamily="Inter Variable, Inter, sans-serif">you say it</text>
      <text x="92" y="262" fontSize="13" fontWeight="600" fill={S} fontFamily="Inter Variable, Inter, sans-serif">agent routes it</text>
      <text x="410" y="336" fontSize="13" fontWeight="600" fill={S} fontFamily="Inter Variable, Inter, sans-serif">you sign it</text>
      <path d="M470 90v120" stroke={S} strokeWidth="2" strokeDasharray="4 6" />
      <circle cx="470" cy="80" r="10" fill={L} stroke={S} strokeWidth="2" />
    </Svg>
  )
}

export function McpIllustration() {
  const nodes = [
    { x: 110, y: 110, t: 'Your agent' },
    { x: 110, y: 290, t: 'Claude' },
    { x: 110, y: 460, t: 'Custom bot' },
  ]
  const tools = [
    { x: 490, y: 110, t: 'swap' },
    { x: 490, y: 230, t: 'borrow' },
    { x: 490, y: 350, t: 'earn' },
    { x: 490, y: 470, t: 'repay' },
  ]
  return (
    <Svg viewBox="0 0 600 572" className="h-full w-full">
      {nodes.map((n) => (
        <path key={n.t} d={`M${n.x + 70} ${n.y} C 230 ${n.y}, 230 286, 262 286`} stroke={S} strokeWidth="2" strokeDasharray="5 6" />
      ))}
      {tools.map((n) => (
        <path key={n.t} d={`M338 286 C 380 286, 380 ${n.y}, ${n.x - 58} ${n.y}`} stroke={S} strokeWidth="2" />
      ))}
      {nodes.map((n) => (
        <g key={n.t} transform={`translate(${n.x - 80} ${n.y - 26})`}>
          <rect width="150" height="52" rx="26" fill={C} stroke={S} strokeWidth="2" />
          <circle cx="26" cy="26" r="10" fill={M} stroke={S} strokeWidth="1.8" />
          <text x="46" y="31" fontSize="14" fontWeight="600" fill={S} fontFamily="Inter Variable, Inter, sans-serif">{n.t}</text>
        </g>
      ))}
      <g transform="translate(240 230)">
        <rect x="6" y="8" width="120" height="112" rx="24" fill={S} opacity=".14" />
        <rect width="120" height="112" rx="24" fill={L} stroke={S} strokeWidth="2" />
        <text x="60" y="52" textAnchor="middle" fontSize="16" fontWeight="700" fill={S} fontFamily="Inter Variable, Inter, sans-serif">Plainly</text>
        <text x="60" y="74" textAnchor="middle" fontSize="16" fontWeight="700" fill={S} fontFamily="Inter Variable, Inter, sans-serif">MCP</text>
      </g>
      {tools.map((n) => (
        <g key={n.t} transform={`translate(${n.x - 58} ${n.y - 22})`}>
          <rect width="116" height="44" rx="12" fill="#fff" stroke={S} strokeWidth="2" />
          <text x="18" y="28" fontSize="14" fontWeight="600" fill={S} fontFamily="ui-monospace, Menlo, monospace">{n.t}()</text>
        </g>
      ))}
    </Svg>
  )
}

export function ChainIllustration() {
  return (
    <Svg viewBox="0 0 400 696" className="h-full w-full">
      <g transform="translate(70 70)">
        <rect x="8" y="10" width="250" height="150" rx="22" fill={S} opacity=".12" />
        <rect width="250" height="150" rx="22" fill={M} stroke={S} strokeWidth="2" />
        <rect x="18" y="20" width="176" height="42" rx="14" fill="#fff" stroke={S} strokeWidth="1.8" />
        <text x="32" y="46" fontSize="13" fontWeight="600" fill={S} fontFamily="Inter Variable, Inter, sans-serif">claim all my rewards</text>
        <rect x="70" y="80" width="162" height="52" rx="14" fill={C} stroke={S} strokeWidth="1.8" />
        <path d="M86 100h86M86 114h54" stroke={S} strokeWidth="2" />
        <circle cx="210" cy="106" r="10" fill={L} stroke={S} strokeWidth="1.8" />
      </g>
      {[110, 150, 190, 230, 270].map((x, i) => (
        <path key={x} d={`M${x} ${270 + (i % 2) * 20}v${90 - (i % 3) * 20}`} stroke={S} strokeWidth="1.6">
          <animate attributeName="stroke-dashoffset" from="0" to="-40" dur={`${1.4 + i * 0.2}s`} repeatCount="indefinite" />
        </path>
      ))}
      <g transform="translate(100 372)">
        <rect width="200" height="50" rx="25" fill={L} stroke={S} strokeWidth="2" />
        <path d="m22 25 7 7 14-14" stroke={S} strokeWidth="2.2" />
        <text x="56" y="31" fontSize="17" fontWeight="600" fill={S} fontFamily="Inter Variable, Inter, sans-serif">Signed by you</text>
      </g>
      {[120, 170, 230, 280].map((x, i) => (
        <path key={x} d={`M${x} ${436}v${60 + (i % 2) * 30}`} stroke={S} strokeWidth="1.6" strokeDasharray="4 6" />
      ))}
      <path d="M200 520 390 610 200 700 10 610z" fill="#fff" stroke={S} strokeWidth="2" />
      <text x="200" y="616" textAnchor="middle" fontSize="18" fontWeight="600" fill={S} fontFamily="Inter Variable, Inter, sans-serif">
        Robinhood Chain
      </text>
    </Svg>
  )
}

/* ---------- Capability card scenes (396 x 300) ---------- */

export function IntentsScene() {
  return (
    <Svg viewBox="0 0 396 300" className="h-full w-full">
      <rect x="40" y="40" width="316" height="220" rx="20" fill="#fff" stroke={S} strokeWidth="2" />
      <g transform="translate(64 70)">
        <rect width="200" height="40" rx="14" fill={M} stroke={S} strokeWidth="1.6" />
        <text x="16" y="25" fontSize="13" fontWeight="600" fill={S} fontFamily="Inter Variable, Inter, sans-serif">send Maya $40 for dinner</text>
      </g>
      <g transform="translate(120 128)">
        <rect width="212" height="96" rx="14" fill={C} stroke={S} strokeWidth="1.6" />
        {['To: maya.eth', 'Amount: 40 USDC', 'Network fee: low'].map((t, i) => (
          <text key={t} x="16" y={28 + i * 24} fontSize="12" fontWeight="500" fill={S} fontFamily="Inter Variable, Inter, sans-serif">{t}</text>
        ))}
        <circle cx="186" cy="24" r="10" fill={L} stroke={S} strokeWidth="1.6" />
      </g>
    </Svg>
  )
}

export function ToolsScene() {
  return (
    <Svg viewBox="0 0 396 300" className="h-full w-full">
      <rect x="40" y="40" width="316" height="220" rx="20" fill="#fff" stroke={S} strokeWidth="2" />
      <circle cx="130" cy="150" r="56" fill={M} stroke={S} strokeWidth="2" />
      <path d="M130 94a56 56 0 0 1 53 38l-53 18z" fill={L} stroke={S} strokeWidth="2" />
      <path d="M130 150 92 191" stroke={S} strokeWidth="2" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(214 ${88 + i * 34})`}>
          <rect width="112" height="22" rx="6" fill={i === 1 ? C : '#fff'} stroke={S} strokeWidth="1.4" />
          <rect x="10" y="8" width={70 - i * 12} height="6" rx="3" fill={S} opacity=".45" />
        </g>
      ))}
    </Svg>
  )
}

export function SupportScene() {
  return (
    <Svg viewBox="0 0 396 300" className="h-full w-full">
      <rect x="40" y="40" width="316" height="220" rx="20" fill="#fff" stroke={S} strokeWidth="2" />
      <g transform="translate(64 68)">
        <rect width="170" height="44" rx="14" fill={C} stroke={S} strokeWidth="1.6" />
        <text x="16" y="27" fontSize="13" fontWeight="600" fill={S} fontFamily="Inter Variable, Inter, sans-serif">why did my swap fail?</text>
      </g>
      <g transform="translate(130 128)">
        <rect width="202" height="70" rx="14" fill={M} stroke={S} strokeWidth="1.6" />
        <path d="M16 24h150M16 40h120M16 56h80" stroke={S} strokeWidth="2" opacity=".55" />
      </g>
      <g transform="translate(64 212)">
        <rect width="118" height="28" rx="14" fill={L} stroke={S} strokeWidth="1.6" />
        <text x="16" y="19" fontSize="11" fontWeight="700" fill={S} fontFamily="Inter Variable, Inter, sans-serif">Priority support</text>
      </g>
    </Svg>
  )
}

/* ---------- Security icons (96 x 96) ---------- */

export function SecurityIcon({ id, className = 'size-24' }: { id: string; className?: string }) {
  if (id === 'custody')
    return (
      <Svg viewBox="0 0 96 96" className={className}>
        <rect x="14" y="26" width="68" height="52" rx="12" fill={M} stroke={S} strokeWidth="2" />
        <path d="M14 40h68" stroke={S} strokeWidth="2" />
        <rect x="56" y="48" width="26" height="18" rx="6" fill={C} stroke={S} strokeWidth="2" />
        <circle cx="66" cy="57" r="3" fill={S} />
        <path d="M26 26v-6a8 8 0 0 1 8-8h28a8 8 0 0 1 8 8v6" stroke={S} strokeWidth="2" />
      </Svg>
    )
  if (id === 'simulate')
    return (
      <Svg viewBox="0 0 96 96" className={className}>
        <rect x="16" y="12" width="56" height="72" rx="10" fill={C} stroke={S} strokeWidth="2" />
        <path d="M28 30h32M28 42h24M28 54h28" stroke={S} strokeWidth="2" />
        <circle cx="64" cy="64" r="16" fill={M} stroke={S} strokeWidth="2" />
        <path d="m76 76 10 10" stroke={S} strokeWidth="3" />
        <path d="m57 64 5 5 9-9" stroke={S} strokeWidth="2" />
      </Svg>
    )
  return (
    <Svg viewBox="0 0 96 96" className={className}>
      <path d="M48 10 80 22v24c0 20-14 34-32 40-18-6-32-20-32-40V22z" fill={M} stroke={S} strokeWidth="2" />
      <path d="M48 10v76" stroke={S} strokeWidth="2" opacity=".35" />
      <rect x="32" y="40" width="32" height="12" rx="6" fill={C} stroke={S} strokeWidth="2" />
      <rect x="32" y="40" width="20" height="12" rx="6" fill={L} stroke={S} strokeWidth="2" />
    </Svg>
  )
}

/* ---------- Hero background ---------- */

export function HeroWaves() {
  const rings = Array.from({ length: 9 }, (_, i) => i)
  return (
    <svg viewBox="0 0 1440 760" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden>
      {rings.map((i) => (
        <ellipse
          key={i}
          cx="720"
          cy="760"
          rx={260 + i * 120}
          ry={180 + i * 70}
          stroke={i % 3 === 0 ? '#fff3d6' : '#ffffff'}
          strokeOpacity={0.9 - i * 0.07}
          strokeWidth={i % 3 === 0 ? 3 : 2}
          fill="none"
        />
      ))}
      {rings.slice(0, 6).map((i) => (
        <path
          key={`t${i}`}
          d={`M${720 - (200 + i * 150)} 760 Q 720 ${260 - i * 40} ${720 + 200 + i * 150} 760`}
          stroke="#ffffff"
          strokeOpacity=".45"
          strokeWidth="1.5"
          fill="none"
        />
      ))}
    </svg>
  )
}
