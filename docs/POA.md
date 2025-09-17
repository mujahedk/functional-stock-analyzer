# Plan of Action (POA)

## Tech Stack
- Next.js (App Router, TypeScript), TailwindCSS, shadcn/ui
- Charts: TradingView Lightweight Charts
- Data: yahoo-finance2 (free, no key needed)
- (Later) Supabase for auth/watchlist/portfolio persistence

## MVP Sprints

### Sprint 1 (Today)
- Project scaffold + UI shell
- Indicators lib: SMA, RSI, ATR%, Volume Z, Prior 20d High, 20-day LinReg forecast
- Scoring engine
- API: `/api/symbol/[symbol]/indicators`, `/api/scan/top`
- Dashboard v1: Top Opportunities + Volatility Watch + basic Heatmap

### Sprint 2
- Stock detail page: chart, indicators overlay, signals panel, insight text
- Watchlist UI (local state; upgrade to Supabase in Sprint 3)

### Sprint 3
- Portfolio CRUD + P/L
- Preferences: ATR% range, include crypto toggle
- Heatmap polish (sector ETFs snapshot)

### Sprint 4
- Mobile polish, loading/empty states, README + deploy polish
- (Optional) Supabase persistence

## Acceptance (End of Sprint 1)
- Repo builds locally
- `/` loads dashboard with Top Opportunities (from universe list)
- Clicking a card routes to `/stocks/[symbol]` (stub page)
- API returns indicators+score for a symbol
- Deployed to Vercel
