# TalkenFi

An AI agent that turns plain language into onchain transactions on Solana.
Live at **[talkenhub.xyz](https://talkenhub.xyz)** · [@TalkenFi_xyz](https://x.com/TalkenFi_xyz)

- `/` marketing site
- `/docs` documentation
- `/app` agent dashboard (Reown AppKit with the Solana adapter: Phantom, Solflare and other Solana wallets; mainnet and devnet)

## Stack

Vite, React 19, TypeScript, Tailwind CSS 4, React Router 7, Motion, Reown AppKit (Solana adapter) + @solana/web3.js.
The dashboard and wallet SDKs are code-split and only load on `/app`.

## Run locally

```bash
npm install
cp .env.example .env   # then fill in the values below
npm run dev            # http://localhost:5173
```

```bash
npm run build          # type-check + production build into dist/
npm run lint
npm run preview        # serve the production build locally
```

## Environment variables

| Variable | Required | What it is |
|---|---|---|
| `VITE_REOWN_PROJECT_ID` | Yes, for production | Project ID from [dashboard.reown.com](https://dashboard.reown.com). Enables WalletConnect (QR and mobile wallets). Browser extension wallets still work without it. |

`VITE_` variables are embedded in the browser bundle at build time, so they are public by design. Never put private
keys or server secrets in a `VITE_` variable. `.env` files are git-ignored.

## Deploy to Vercel

The repo contains `vercel.json`: Vite preset, `npm ci` + `npm run build`, output `dist`, SPA fallback for
`/docs/*` and `/app/*`, `www.talkenhub.xyz` → `talkenhub.xyz` redirect, long cache on hashed assets, `noindex` on
`/app`, and security headers. Node is pinned to 22.x through `engines` in `package.json`.

1. **Import the repo**: [vercel.com/new](https://vercel.com/new) → *Import Git Repository* → GitHub →
   `Trixen-AI/plainly`. Framework, build command and output directory are read from `vercel.json`; leave them as
   detected. Root directory: `./`.
2. **Environment variables** (*Project → Settings → Environment Variables*):

   | Key | Value | Environments |
   |---|---|---|
   | `VITE_REOWN_PROJECT_ID` | your project ID from [dashboard.reown.com](https://dashboard.reown.com) | Production, Preview |

   Vite bakes it in at build time, so after adding or changing it, redeploy (*Deployments → ⋯ → Redeploy*).
3. **Domains** (*Project → Settings → Domains*): add `talkenhub.xyz` and `www.talkenhub.xyz`. Set the DNS records
   exactly as Vercel shows them at your registrar (an A record for the apex, a CNAME for `www`). HTTPS is issued
   automatically once DNS resolves. `vercel.json` already redirects `www` to the apex.
4. **Allow the domain in Reown**: [dashboard.reown.com](https://dashboard.reown.com) → your project → *Domains*, add
   `https://talkenhub.xyz` (and `https://*.vercel.app` if you test on preview URLs). Without this, WalletConnect
   rejects connections from the site.

Every push to `main` then deploys to production; other branches get preview URLs.

### After the first deploy, check

- `https://talkenhub.xyz/docs/trading` loads directly (SPA fallback works).
- `https://www.talkenhub.xyz` redirects to `https://talkenhub.xyz`.
- `https://talkenhub.xyz/sitemap.xml` and `/robots.txt` load; submit the sitemap in Google Search Console.
- `/app` → *Connect Wallet* opens the Reown modal with Phantom, Solflare and Backpack.
- Share `https://talkenhub.xyz` on X to confirm the preview image (`/og-image.png`).

## Project layout

```
src/
  app/            dashboard: agent engine, store, wallet config, pages, Sign Transactions panel
  assets/logos/   official third-party logos (source URLs in index.ts)
  components/     marketing sections, illustrations, shared UI
  data/           site copy, docs content
  lib/            SEO hook, lazy loader, utils
  pages/          Home, Docs, NotFound
public/           favicon, brand logos, og-image, robots.txt, sitemap.xml, site.webmanifest
vercel.json       Vercel build, SPA fallback, redirects and headers
```

## Notes

- The agent is rule-based for now (`src/app/agent/engine.ts`). Native SOL transfers are real transactions; other
  actions are approved with a wallet signature (no funds move) until protocol routing is connected in
  `src/app/components/TxPanel.tsx`.
- Chats and the transaction queue are stored in the browser (`localStorage`).
