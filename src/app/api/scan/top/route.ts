import { NextResponse } from 'next/server';
import { UNIVERSE } from '@/lib/universe';
import { fetchDailyOHLC, fetchQuote } from '@/lib/fetchers/yahoo';
import { sma, rsi, atrp, volZ, priorHigh, linregForecast } from '@/lib/indicators';
import { computeRuleScore } from '@/lib/scoring';
import type { TopScanItem } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const limit = parseInt(process.env.SCAN_LIMIT ?? '18', 10);
  const symbols = UNIVERSE.slice(0, Math.max(1, limit));

  const results: TopScanItem[] = [];
  const concurrency = 5;

  for (let i = 0; i < symbols.length; i += concurrency) {
    const batch = symbols.slice(i, i + concurrency);
    const settled = await Promise.allSettled(batch.map(scanOne));
    for (const s of settled) if (s.status === 'fulfilled' && s.value) results.push(s.value);
  }

  results.sort((a, b) => (b.rulescore?.score ?? 0) - (a.rulescore?.score ?? 0));
  return NextResponse.json({ items: results.slice(0, 10), generatedAt: new Date().toISOString() });
}

async function scanOne(symbol: string): Promise<TopScanItem | null> {
  try {
    const ohlc = await fetchDailyOHLC(symbol, 370);
    if (!ohlc?.length) return null;

    const close = ohlc.map(o => o.close);
    const high  = ohlc.map(o => o.high);
    const low   = ohlc.map(o => o.low);
    const vol   = ohlc.map(o => o.volume ?? 0);
    const last  = ohlc.length - 1;

    const sma20 = sma(close, 20);
    const sma50 = sma(close, 50);
    const sma200 = sma(close, 200);
    const rsi14 = rsi(close, 14);
    const atrp14 = atrp(high, low, close, 14);
    const volZ20 = volZ(vol, 20);
    const prior20High = priorHigh(high, 20);
    // simple projection is computed on detail route; we don't need forecast here

    const rulescore = computeRuleScore({
      price: close[last] ?? null,
      sma20: sma20[last] ?? null,
      sma50: sma50[last] ?? null,
      sma200: sma200[last] ?? null,
      rsi14: rsi14[last] ?? null,
      volZ: volZ20[last] ?? null,
      atrp: atrp14[last] ?? null,
      prior20High: prior20High[last] ?? null,
      highToday: high[last] ?? null,
    });

    const quote = await fetchQuote(symbol);
    const insight = buildInsight(symbol, rulescore.reasons, rulescore.bias, rulescore.confidence);

    return {
      symbol,
      quote: { price: (quote?.regularMarketPrice as number) ?? close[last] ?? null },
      rulescore,
      insight,
    };
  } catch {
    return null;
  }
}

function buildInsight(symbol: string, reasons: string[], bias: string, confidence: string) {
  const top = reasons.slice(0, 2).join(', ');
  return `${symbol}: ${top ? top + ' — ' : ''}Bias: ${bias}, Confidence: ${confidence}. (Educational, not advice.)`;
}
