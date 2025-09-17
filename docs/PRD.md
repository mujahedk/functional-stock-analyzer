# Functional Stock Analyzer — PRD (Practical & Explainable)

## Product Overview
A daily-use web app that surfaces actionable stock & crypto insights. Users quickly see what's moving, why it's moving (explainable rules), and what to consider buying today.

## Primary Users
- Everyday investors seeking simple, transparent signals
- Personal use (MJ): daily open → decide → track

## Goals
1) Fast daily "Top Opportunities" list with simple explanations.
2) Stock detail pages with clear signals: Trend, Momentum, Breakout, Volume, Volatility.
3) Portfolio & Watchlist (manual entry first).
4) Simple projection (short-term linear trend) with confidence based on agreeing signals.

## Must-Have Features (MVP)
- Dashboard: Top Opportunities, Volatility Watch, mini Heatmap
- Ticker Search + Detail: Candles + SMA20/50/200, RSI, Volume bars, ATR%
- Explainable "RuleScore" (0–100) and Bias (Up/Neutral/Down)
- Crypto support (BTC-USD, ETH-USD, etc.) using same rules (minus fundamentals)

## Signals (Explainable)
- Trend: price > SMA20 > SMA50 > SMA200 (stacking adds points)
- Momentum: RSI(14) — oversold (<30) bonus; 30–70 mild bonus
- Breakout: today's high > prior 20-day high
- Volume: today's volume z-score vs 20-day avg
- Volatility Fit: ATR%(14) within user range (default 2–6%)

## Scoring (0–100)
- Trend: price>SMA20 (+10), SMA20>SMA50 (+10), SMA50>SMA200 (+10)
- Momentum: RSI<30 (+15) else if 30≤RSI≤70 (+5)
- Breakout: highToday>prior20High (+20)
- Volume: volZ≥2 (+15) else if volZ≥1 (+8)
- Volatility Fit: 2≤ATR%≤6 (+10)

Bias mapping: 70–100=Up, 40–69=Neutral, 0–39=Down  
Confidence: signal count + volume boost (≥2σ bumps a level)

## Universe (initial)
ETFs: SPY, QQQ, DIA, IWM, VTI, XLK, XLF, XLE  
Mega-cap Tech: AAPL, MSFT, NVDA, AMZN, META, GOOGL, TSLA, AMD, NFLX  
Leaders: AVGO, CRM, ORCL, COST, WMT, JPM, UNH, JNJ, XOM, CVX, NEE  
Momentum: SMCI, PLTR, SHOP, SNOW, UBER, ABNB  
Crypto: BTC-USD, ETH-USD, SOL-USD, AVAX-USD, DOGE-USD

## Risks & Non-Goals
- Not financial advice; educational.  
- No complex/black-box ML in MVP.  
- International expansion later (after MVP).
