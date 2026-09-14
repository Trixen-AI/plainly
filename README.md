# Plainly

An AI agent that turns plain language into onchain transactions on Robinhood Chain.
Live at **[plainly.chat](https://plainly.chat)** · [@PlainlyChat](https://x.com/PlainlyChat)

- `/` marketing site
- `/docs` documentation
- `/app` agent dashboard (Reown AppKit wallet connection, Robinhood Chain mainnet 4663 and testnet 46630)

## Stack

Vite, React 19, TypeScript, Tailwind CSS 4, React Router 7, Motion, Reown AppKit + wagmi + viem.
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

## Deploy to Netlify

The repo already contains `netlify.toml` (build command, publish folder, Node 22, SPA fallback, cache and security headers).

1. **Import the repo**: Netlify → *Add new site* → *Import an existing project* → GitHub → `Trixen-AI/plainly`.
   Netlify reads `netlify.toml`, so the build settings fill in automatically:
   - Build command: `npm run build`
   - Publish directory: `dist`
2. **Set environment variables**: *Site configuration → Environment variables → Add a variable*:
   - `VITE_REOWN_PROJECT_ID` = your Reown project ID (scopes: *Builds*; all deploy contexts)

   Changing it later requires a new deploy (*Deploys → Trigger deploy → Clear cache and deploy site*), because Vite
   bakes it in at build time.
3. **Add the domain**: *Domain management → Add a domain* → `plainly.chat` (and `www.plainly.chat`, redirected to the
   apex). Point DNS at Netlify as shown there, then enable HTTPS (Let's Encrypt is automatic once DNS resolves).
4. **Allow the domain in Reown**: in [dashboard.reown.com](https://dashboard.reown.com) → your project →
   *Domains*, add `https://plainly.chat` (and your Netlify preview domain if you test there). Without this,
   WalletConnect rejects connections from the site.

### After the first deploy, check

- `https://plainly.chat/docs/trading` loads directly (SPA fallback works).
- `https://plainly.chat/sitemap.xml` and `/robots.txt` load.
- `/app` → *Connect Wallet* opens the Reown modal and lists Robinhood Chain.
- Share `https://plainly.chat` on X to confirm the preview image (`/og-image.png`).

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
netlify.toml      Netlify build + SPA fallback + headers
```

## Notes

- The agent is rule-based for now (`src/app/agent/engine.ts`). Native ETH transfers are real transactions; other
  actions are approved with a wallet signature (no funds move) until protocol routing is connected in
  `src/app/components/TxPanel.tsx`.
- Chats and the transaction queue are stored in the browser (`localStorage`).
